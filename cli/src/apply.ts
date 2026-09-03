import { spawn } from "node:child_process"
import { appendFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs"
import path from "node:path"

import type { Plan } from "./plan.js"
import { NAME } from "./pkg.js"
import { CliError } from "./ui.js"

export function writeFiles(plan: Plan) {
  for (const file of plan.files) {
    mkdirSync(path.dirname(file.absolute), { recursive: true })
    const content = file.content.endsWith("\n") ? file.content : `${file.content}\n`
    writeFileSync(file.absolute, content, "utf8")
  }
  return plan.files.length
}

/** "1.4 MB", "812 KB" — for a progress line, not for arithmetic. */
export function humanBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

/**
 * Download the plan's assets to disk, one at a time.
 *
 * Sequential on purpose: a template can carry 15MB of models, and saturating a
 * connection with parallel fetches makes the progress line meaningless without
 * making the total any faster on a normal link. The declared size is checked
 * against what actually arrived, so a truncated response is an error rather than
 * a corrupt file the consumer discovers at runtime.
 *
 * `onProgress` is called before each download so the caller owns all output.
 */
export async function downloadAssets(
  plan: Plan,
  onProgress?: (rel: string, bytes: number, index: number, total: number) => void,
): Promise<number> {
  let downloaded = 0

  for (const [index, asset] of plan.assets.entries()) {
    onProgress?.(asset.rel, asset.bytes, index + 1, plan.assets.length)

    let response: Response
    try {
      response = await fetch(asset.url, { redirect: "follow" })
    } catch (cause) {
      throw new CliError(
        `Could not download ${asset.rel}`,
        cause instanceof Error ? cause.message : `From ${asset.url}`,
      )
    }
    if (!response.ok) {
      throw new CliError(`${asset.url} responded ${response.status}.`, `Needed for ${asset.rel}.`)
    }

    const body = Buffer.from(await response.arrayBuffer())
    if (asset.bytes > 0 && body.byteLength !== asset.bytes) {
      throw new CliError(
        `${asset.rel} arrived incomplete.`,
        `Expected ${asset.bytes} bytes, got ${body.byteLength}. Nothing further was written.`,
      )
    }

    mkdirSync(path.dirname(asset.absolute), { recursive: true })
    writeFileSync(asset.absolute, body)
    downloaded += body.byteLength
  }

  return downloaded
}

export type CssResult = "written" | "nothing-to-do" | "already-there" | "no-stylesheet"

const KEYFRAMES_RE = /@keyframes\s+([A-Za-z_-][\w-]*)/
const VAR_RE = /(--[\w-]+)\s*:/g

/**
 * Split CSS into top-level blocks by tracking brace depth.
 *
 * Registry CSS is minified onto one line, so there is no line structure to lean
 * on. Slicing only at depth zero means a block is never cut in half — anything
 * unrecognised comes back whole and is kept.
 */
function topLevelBlocks(css: string): string[] {
  const blocks: string[] = []
  let depth = 0
  let start = 0

  for (let i = 0; i < css.length; i += 1) {
    const char = css[i]
    if (char === "{") depth += 1
    else if (char === "}") {
      depth -= 1
      if (depth === 0) {
        blocks.push(css.slice(start, i + 1).trim())
        start = i + 1
      }
    }
  }

  const tail = css.slice(start).trim()
  if (tail) blocks.push(tail)
  return blocks.filter(Boolean)
}

/**
 * Append the keyframes and variables an item needs to the project stylesheet.
 *
 * Each block is fenced with a marker naming the item, so running the same
 * install twice does not duplicate it. Individual keyframes and variables are
 * also skipped if the stylesheet already declares them: a template ships the
 * keyframes of everything it is built from, so installing a template after one
 * of its own animations would otherwise redefine what is already there — and
 * silently outrank whatever the project had set by hand.
 */
export function patchCss(plan: Plan): CssResult {
  const needed = plan.items.filter(
    (item) => item.css?.trim() || Object.keys(item.cssVars ?? {}).length > 0,
  )
  if (needed.length === 0) return "nothing-to-do"
  if (!existsSync(plan.cssFile)) return "no-stylesheet"

  const current = readFileSync(plan.cssFile, "utf8")
  const blocks: string[] = []

  const keyframes = new Set<string>()
  for (const match of current.matchAll(new RegExp(KEYFRAMES_RE.source, "g"))) {
    if (match[1]) keyframes.add(match[1])
  }

  const variables = new Set<string>()
  for (const match of current.matchAll(VAR_RE)) {
    if (match[1]) variables.add(match[1])
  }

  for (const item of needed) {
    const marker = `/* ${NAME}: ${item.name} */`
    if (current.includes(marker)) continue

    const parts: string[] = []

    const vars = Object.entries(item.cssVars ?? {})
      .map(([key, value]) => [key.startsWith("--") ? key : `--${key}`, value] as const)
      .filter(([key]) => !variables.has(key))
    if (vars.length > 0) {
      for (const [key] of vars) variables.add(key)
      const body = vars.map(([key, value]) => `  ${key}: ${value};`).join("\n")
      parts.push(`:root {\n${body}\n}`)
    }

    const rules = topLevelBlocks(item.css?.trim() ?? "").filter((block) => {
      const name = KEYFRAMES_RE.exec(block)?.[1]
      if (!name) return true
      if (keyframes.has(name)) return false
      keyframes.add(name)
      return true
    })
    if (rules.length > 0) parts.push(rules.join("\n"))

    if (parts.length > 0) blocks.push(`${marker}\n${parts.join("\n\n")}`)
  }

  if (blocks.length === 0) return "already-there"

  const prefix = current.endsWith("\n") ? "\n" : "\n\n"
  appendFileSync(plan.cssFile, `${prefix}${blocks.join("\n\n")}\n`, "utf8")
  return "written"
}

export type Manager = "npm" | "pnpm" | "yarn" | "bun"

export function detectManager(cwd: string): Manager {
  if (existsSync(path.join(cwd, "pnpm-lock.yaml"))) return "pnpm"
  if (existsSync(path.join(cwd, "bun.lockb")) || existsSync(path.join(cwd, "bun.lock"))) return "bun"
  if (existsSync(path.join(cwd, "yarn.lock"))) return "yarn"

  const agent = process.env.npm_config_user_agent ?? ""
  if (agent.startsWith("pnpm")) return "pnpm"
  if (agent.startsWith("yarn")) return "yarn"
  if (agent.startsWith("bun")) return "bun"
  return "npm"
}

export function installCommand(manager: Manager, deps: string[]) {
  const verb = manager === "npm" ? "install" : "add"
  return `${manager} ${verb} ${deps.join(" ")}`
}

export function runInstall(manager: Manager, deps: string[], cwd: string): Promise<number> {
  const args = [manager === "npm" ? "install" : "add", ...deps]

  /**
   * Windows cannot exec a `.cmd` shim directly, so the package manager has to go
   * through the command interpreter. `cmd /d /s /c` is invoked explicitly rather
   * than via `shell: true` — same result, no deprecation warning, and the command
   * string is built only from a fixed verb plus dependency specs that `plan.ts`
   * has already restricted to a shell-inert character set.
   */
  const [command, argv] =
    process.platform === "win32"
      ? [process.env.ComSpec ?? "cmd.exe", ["/d", "/s", "/c", `${manager} ${args.join(" ")}`]]
      : [manager, args]

  return new Promise((resolve, reject) => {
    const child = spawn(command, argv, { cwd, stdio: "inherit" })
    child.on("error", reject)
    child.on("close", (code) => resolve(code ?? 0))
  })
}
