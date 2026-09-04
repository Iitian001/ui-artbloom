import { existsSync, readFileSync, statSync } from "node:fs"
import path from "node:path"

import type { Config, Paths } from "./config.js"
import type { Payload } from "./registry.js"
import { CliError, warn } from "./ui.js"

export type PlannedFile = {
  /** Project-relative, forward slashes, for display. */
  rel: string
  absolute: string
  /** Exactly the bytes that will land on disk, trailing newline included. */
  content: string
  exists: boolean
  /** Already there byte-for-byte — writing it would change nothing. */
  identical: boolean
  from: string
}

export type PlannedAsset = {
  rel: string
  absolute: string
  url: string
  bytes: number
  exists: boolean
  /** Already there at the declared size — a size check only, see `sameSize`. */
  identical: boolean
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

/**
 * The alias-relative form of a configured directory.
 *
 * A leading `src/` comes off because `@/*` in a `src` project conventionally
 * maps to `./src/*`, so `src/hooks` is reached as `@/hooks` and not as
 * `@/src/hooks`. A project that maps `@/*` to `./*` while keeping its code in
 * `src/` is the one layout this gets wrong — and it is already wrong there
 * today, with or without a remap, because the default target lands in `src/`
 * while the payload's own specifier says `@/hooks`.
 */
function aliasPath(dir: string) {
  return dir
    .replace(/\\/g, "/")
    .replace(/^\.\//, "")
    .replace(/^src\//, "")
    .replace(/\/+$/, "")
}

/** Every payload prefix that `remap` can move, with where it moves to. */
const ALIASED: ReadonlyArray<{ payload: string; configured: (paths: Paths) => string }> = [
  { payload: "components/ui", configured: (paths) => aliasPath(paths.ui) },
  { payload: "hooks", configured: (paths) => aliasPath(paths.hooks) },
]

/**
 * Point the payload's own alias imports at wherever its files are actually going.
 *
 * `remap` honours a custom `paths.ui` or `paths.hooks` for the destination, but
 * the source it writes still says `@/hooks/use-canvas-scene`. Left alone, an
 * animation installed into a project whose config moved that directory lands as
 * a file that cannot resolve its own hook — a broken build, from a run that
 * exited 0.
 *
 * Only specifier positions are touched: after `from`, after a bare `import`, or
 * inside `require(`. A path that happens to appear in prose or in a comment is
 * not an import and is left exactly as the author wrote it.
 */
function rewriteImports(content: string, config: Config) {
  const moves = ALIASED.map((entry) => ({
    was: `${config.alias}/${entry.payload}/`,
    now: `${config.alias}/${entry.configured(config.paths)}/`,
  })).filter((move) => move.was !== move.now)

  if (moves.length === 0) return content

  return content.replace(
    /((?:\bfrom|\bimport|\brequire\()\s*)(['"])([^'"\n]+)\2/g,
    (whole: string, lead: string, quote: string, spec: string) => {
      const move = moves.find((candidate) => spec.startsWith(candidate.was))
      if (!move) return whole
      return `${lead}${quote}${move.now}${spec.slice(move.was.length)}${quote}`
    },
  )
}

/**
 * The exact bytes a planned file will end up holding.
 *
 * Every file written ends with a newline; payload content may or may not. The
 * newline goes on here rather than at write time so the plan carries the real
 * bytes: the rule lives in one place, and asking whether a target already holds
 * what we would write stays a straight comparison that cannot drift away from
 * what the writer actually does.
 */
function asWritten(content: string) {
  return content.endsWith("\n") ? content : `${content}\n`
}

/**
 * Whether a path already holds exactly these bytes.
 *
 * Two items shipping the same file is ordinary — a template carries the
 * animations it is built from, and a shared helper arrives with every item that
 * imports it — so a target already holding what we would write is neither a
 * conflict nor an overwrite. Anything unreadable (a directory, no permission)
 * counts as different: the write is what should complain about it, with the real
 * reason.
 */
function sameBytes(absolute: string, content: string) {
  try {
    return readFileSync(absolute).equals(Buffer.from(content, "utf8"))
  } catch {
    return false
  }
}

/**
 * Whether an asset on disk is already the size its payload declares.
 *
 * A size check and nothing else: the bytes live on the network, and downloading
 * megabytes to hash what is already there is the exact work being skipped. So it
 * does not catch a file of the right length holding the wrong bytes — one
 * replaced by hand, or a truncation that happened to land on the declared
 * boundary. A payload that declares no size gets nothing from this.
 */
function sameSize(absolute: string, bytes: number) {
  if (bytes <= 0) return false
  try {
    const info = statSync(absolute)
    return info.isFile() && info.size === bytes
  } catch {
    return false
  }
}

type Claim = { from: string; writes: string }

/**
 * Take a path for one item, or report that a second item wants the same one.
 *
 * `writes` is what the path has been promised to end up holding — a file's exact
 * bytes, an asset's url. Two items agreeing about a shared path is the common
 * case, and the duplicate is dropped in silence; disagreeing means the installed
 * result depends on which payload happened to be fetched first, which is worth
 * saying out loud rather than settling by luck. Files and assets go through the
 * same map, so neither can quietly take the other's target.
 */
function claim(claims: Map<string, Claim>, absolute: string, rel: string, mine: Claim) {
  const key = absolute.toLowerCase()
  const first = claims.get(key)
  if (!first) {
    claims.set(key, mine)
    return true
  }
  if (first.writes !== mine.writes) {
    warn(`${rel} differs between "${first.from}" and "${mine.from}" — keeping "${first.from}"'s`)
  }
  return false
}

export function buildPlan(items: Payload[], config: Config): Plan {
  const files: PlannedFile[] = []
  const assets: PlannedAsset[] = []
  const dependencies = new Set<string>()
  const cssVars: Record<string, string> = {}
  const css: string[] = []
  const claims = new Map<string, Claim>()

  for (const item of items) {
    for (const file of item.files) {
      const { absolute, rel } = resolveTarget(file.target, item.name, config)
      const content = asWritten(rewriteImports(file.content, config))
      if (!claim(claims, absolute, rel, { from: item.name, writes: content })) continue

      const exists = existsSync(absolute)
      files.push({
        rel,
        absolute,
        content,
        exists,
        identical: exists && sameBytes(absolute, content),
        from: item.name,
      })
    }

    for (const asset of item.assets ?? []) {
      const { absolute, rel } = resolveTarget(asset.target, item.name, config)
      if (!claim(claims, absolute, rel, { from: item.name, writes: asset.url })) continue

      const exists = existsSync(absolute)
      assets.push({
        rel,
        absolute,
        url: asset.url,
        bytes: asset.bytes,
        exists,
        identical: exists && sameSize(absolute, asset.bytes),
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

/**
 * Files and assets already on disk holding something else — `add` refuses unless
 * --overwrite is passed. A target that already holds exactly what would be
 * written is not one of these: rewriting the same bytes replaces nothing.
 */
export function clashes(plan: Plan) {
  return [...plan.files, ...plan.assets].filter((entry) => entry.exists && !entry.identical)
}

/** Targets already holding what the plan wants — nothing to write, nothing to say. */
export function satisfied(plan: Plan) {
  return [...plan.files, ...plan.assets].filter((entry) => entry.identical)
}
