import { existsSync } from "node:fs"
import path from "node:path"

import type { Config } from "./config.js"
import type { Payload } from "./registry.js"
import { CliError } from "./ui.js"

export type PlannedFile = {
  /** Project-relative, forward slashes, for display. */
  rel: string
  absolute: string
  content: string
  exists: boolean
  from: string
}

export type PlannedAsset = {
  rel: string
  absolute: string
  url: string
  bytes: number
  exists: boolean
  from: string
}

export type Plan = {
  items: Payload[]
  files: PlannedFile[]
  assets: PlannedAsset[]
  css: string[]
  cssVars: Record<string, string>
  cssFile: string
  dependencies: string[]
}

/**
 * npm names, optionally scoped, optionally with a version.
 *
 * The version part is deliberately restricted to a safe character set: on
 * Windows the package manager has to be spawned through a shell (Node refuses
 * to exec a `.cmd` without one), so a range containing `>`, `|` or a space
 * would be a shell-injection vector. Registry items pin exact versions anyway.
 */
const DEP_RE = /^(@[a-z0-9-~][a-z0-9-._~]*\/)?[a-z0-9-~][a-z0-9-._~]*(@[a-zA-Z0-9.\-+~^*]+)?$/

function remap(target: string, config: Config) {
  const clean = target.replace(/\\/g, "/").replace(/^\.\//, "")
  if (clean.startsWith("components/ui/")) {
    return `${config.paths.ui}/${clean.slice("components/ui/".length)}`
  }
  if (clean.startsWith("hooks/")) {
    return `${config.paths.hooks}/${clean.slice("hooks/".length)}`
  }
  if (clean.startsWith("app/")) {
    return `${config.paths.pages}/${clean.slice("app/".length)}`
  }
  return clean
}

/**
 * Turn a payload target into a project path, or refuse.
 *
 * The payload is remote data. It must never be able to address a path outside the
 * project it is being installed into, so every target — source file or asset —
 * comes through here.
 */
function resolveTarget(target: string, itemName: string, config: Config) {
  const rel = remap(target, config)
  const absolute = path.resolve(config.cwd, rel)
  const inside = path.relative(config.cwd, absolute)

  if (inside === "" || inside.startsWith("..") || path.isAbsolute(inside)) {
    throw new CliError(
      `Refusing to write outside the project: ${target}`,
      `Reported by item "${itemName}".`,
    )
  }

  return { absolute, rel: inside.replace(/\\/g, "/") }
}

export function buildPlan(items: Payload[], config: Config): Plan {
  const files: PlannedFile[] = []
  const assets: PlannedAsset[] = []
  const dependencies = new Set<string>()
  const cssVars: Record<string, string> = {}
  const css: string[] = []
  const seen = new Set<string>()

  for (const item of items) {
    for (const file of item.files) {
      const { absolute, rel } = resolveTarget(file.target, item.name, config)

      const key = absolute.toLowerCase()
      if (seen.has(key)) continue
      seen.add(key)

      files.push({
        rel,
        absolute,
        content: file.content,
        exists: existsSync(absolute),
        from: item.name,
      })
    }

    for (const asset of item.assets ?? []) {
      const { absolute, rel } = resolveTarget(asset.target, item.name, config)

      const key = absolute.toLowerCase()
      if (seen.has(key)) continue
      seen.add(key)

      assets.push({
        rel,
        absolute,
        url: asset.url,
        bytes: asset.bytes,
        exists: existsSync(absolute),
        from: item.name,
      })
    }

    for (const dep of item.dependencies ?? []) {
      if (!DEP_RE.test(dep)) {
        throw new CliError(
          `Item "${item.name}" asks for a package name that does not look like one: ${dep}`,
        )
      }
      dependencies.add(dep)
    }

    if (item.css?.trim()) css.push(item.css.trim())
    for (const [key, value] of Object.entries(item.cssVars ?? {})) {
      if (typeof value === "string") cssVars[key] = value
    }
  }

  return {
    items,
    files,
    assets,
    css,
    cssVars,
    cssFile: path.resolve(config.cwd, config.paths.css),
    dependencies: [...dependencies],
  }
}

/** Files and assets already on disk — `add` refuses unless --overwrite is passed. */
export function clashes(plan: Plan) {
  return [...plan.files, ...plan.assets].filter((entry) => entry.exists)
}
