import { readFileSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

/**
 * Identity comes from this package's own manifest rather than a literal, so the
 * package name, version, and registry origin can never drift apart.
 */
const here = path.dirname(fileURLToPath(import.meta.url))

const manifest = JSON.parse(
  readFileSync(path.join(here, "..", "package.json"), "utf8"),
) as { name: string; version: string; homepage?: string; bin?: Record<string, string> }

export const NAME = manifest.name
export const VERSION = manifest.version
export const DEFAULT_REGISTRY = (manifest.homepage ?? "").replace(/\/+$/, "")

/**
 * What the executable is actually called on PATH — which is not the package
 * name, because a dot in a bin name is unrunnable on Windows: `cmd.exe` reads
 * everything after the last dot as a file extension, so it never appends the
 * `.cmd` from PATHEXT and `npx <dotted-bin>` exits 0 having done nothing.
 * A dot in the *package* name is fine; npm resolves it to this single bin.
 */
export const BIN = Object.keys(manifest.bin ?? {})[0] ?? manifest.name
