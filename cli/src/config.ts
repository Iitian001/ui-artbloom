import { existsSync, readFileSync } from "node:fs"
import path from "node:path"

import { DEFAULT_REGISTRY, NAME, BIN } from "./pkg.js"
import { CliError } from "./ui.js"

export type Paths = { ui: string; pages: string; hooks: string; css: string }

export type Config = {
  cwd: string
  registry: string
  alias: string
  paths: Paths
}

export type Overrides = {
  cwd?: string
  registry?: string
  css?: string
  ui?: string
}

export const CONFIG_FILE = `${NAME}.json`

function firstExisting(cwd: string, candidates: string[]) {
  return candidates.find((rel) => existsSync(path.join(cwd, rel)))
}

/** Guess the project layout so `init` is optional. */
export function detect(cwd: string): Paths {
  const src = existsSync(path.join(cwd, "src")) ? "src/" : ""
  const css =
    firstExisting(cwd, [
      `${src}app/globals.css`,
      `${src}styles/globals.css`,
      `${src}app/global.css`,
      `${src}styles/index.css`,
      `${src}index.css`,
    ]) ?? `${src}app/globals.css`

  return { ui: `${src}components/ui`, pages: `${src}app`, hooks: `${src}hooks`, css }
}

export function loadConfig(overrides: Overrides = {}): Config {
  const cwd = path.resolve(overrides.cwd ?? process.cwd())
  if (!existsSync(cwd)) throw new CliError(`No such directory: ${cwd}`)

  let onDisk: Partial<Config> = {}
  const file = path.join(cwd, CONFIG_FILE)
  if (existsSync(file)) {
    try {
      onDisk = JSON.parse(readFileSync(file, "utf8")) as Partial<Config>
    } catch {
      throw new CliError(
        `${CONFIG_FILE} is not valid JSON.`,
        `Fix it, or delete it and run \`${BIN} init\`.`,
      )
    }
  }

  const detected = detect(cwd)
  const registry = (overrides.registry ?? onDisk.registry ?? DEFAULT_REGISTRY).replace(/\/+$/, "")
  if (!/^https?:\/\//.test(registry)) {
    throw new CliError(`Registry must be an http(s) URL, got: ${registry}`)
  }

  return {
    cwd,
    registry,
    alias: onDisk.alias ?? "@",
    paths: {
      ui: overrides.ui ?? onDisk.paths?.ui ?? detected.ui,
      pages: onDisk.paths?.pages ?? detected.pages,
      hooks: onDisk.paths?.hooks ?? detected.hooks,
      css: overrides.css ?? onDisk.paths?.css ?? detected.css,
    },
  }
}
