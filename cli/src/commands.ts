import { writeFileSync, existsSync } from "node:fs"
import path from "node:path"

import prompts from "prompts"

import {
  detectManager,
  downloadAssets,
  humanBytes,
  installCommand,
  patchCss,
  runInstall,
  writeFiles,
} from "./apply.js"
import { CONFIG_FILE, loadConfig, type Overrides } from "./config.js"
import { NAME, BIN } from "./pkg.js"
import { buildPlan, clashes, type Plan } from "./plan.js"
import { fetchIndex, fetchItem, type Payload } from "./registry.js"
import { c, CliError, heading, line, ok, setSilent, step, warn } from "./ui.js"

export type AddOptions = Overrides & {
  yes?: boolean
  overwrite?: boolean
  dryRun?: boolean
  deps?: boolean
  silent?: boolean
}

/**
 * Walk `registryDependencies` so the CLI also works against a registry that
 * does not pre-flatten them. Ours does, so the extra payloads are usually
 * redundant — the plan dedupes files, packages, and keyframes either way.
 */
async function collect(registry: string, names: string[]): Promise<Payload[]> {
  const out: Payload[] = []
  const seen = new Set<string>()
  const queue = [...names]

  while (queue.length > 0) {
    const name = queue.shift()
    if (!name || seen.has(name)) continue
    seen.add(name)

    const isRoot = names.includes(name)
    let payload: Payload
    try {
      payload = await fetchItem(registry, name)
    } catch (error) {
      if (isRoot) throw error
      warn(`skipped dependency "${name}" — not in this registry`)
      continue
    }

    out.push(payload)
    for (const dep of payload.registryDependencies ?? []) {
      if (!seen.has(dep)) queue.push(dep)
    }
  }

  return out
}

/** "2 keyframes and 1 variable" — said out loud before the stylesheet is touched. */
function cssSummary(plan: Plan) {
  const names = new Set(
    [...plan.css.join("\n").matchAll(/@keyframes\s+([A-Za-z_-][\w-]*)/g)].map((m) => m[1]),
  )
  const keyframes = names.size
  const vars = Object.keys(plan.cssVars).length
  const parts: string[] = []
  if (keyframes > 0) parts.push(`${keyframes} ${keyframes === 1 ? "keyframe" : "keyframes"}`)
  if (vars > 0) parts.push(`${vars} ${vars === 1 ? "variable" : "variables"}`)
  if (parts.length === 0) return plan.css.length > 0 ? "styles" : ""
  return parts.join(" and ")
}

/**
 * The whole plan, printed before anything is written. `names` is what was asked
 * for, so everything else can be summarised as what it is: a dependency.
 */
function describe(plan: Plan, cssFileRel: string, names: string[]) {
  const roots = plan.items.filter((item) => names.includes(item.name))
  const shown = roots.length > 0 ? roots : plan.items

  for (const item of shown) {
    const kind = item.meta?.kind ? item.meta.kind.replace(/s$/, "") : "item"
    line(`  ${c.bold(item.name)}  ${c.dim(`${kind}${item.author ? ` by ${item.author}` : ""}`)}`)
    if (item.description) line(`  ${c.dim(item.description)}`)
  }

  const pulled = plan.items.length - shown.length
  if (pulled > 0) {
    line(`  ${c.dim(`Pulls in ${pulled} registry ${pulled === 1 ? "dependency" : "dependencies"}.`)}`)
  }

  heading("will write")
  for (const file of plan.files) {
    line(`    ${file.exists ? c.yellow(file.rel) : file.rel}${file.exists ? c.dim(" (exists)") : ""}`)
  }

  if (plan.assets.length > 0) {
    const total = plan.assets.reduce((sum, asset) => sum + asset.bytes, 0)
    heading(`will download ${plan.assets.length} ${plan.assets.length === 1 ? "asset" : "assets"} · ${humanBytes(total)}`)
    for (const asset of plan.assets) {
      line(
        `    ${asset.exists ? c.yellow(asset.rel) : asset.rel} ${c.dim(humanBytes(asset.bytes))}${asset.exists ? c.dim(" (exists)") : ""}`,
      )
    }
  }

  const css = cssSummary(plan)
  if (css) line(`  will append ${css} to ${cssFileRel}`)
  if (plan.dependencies.length > 0) line(`  will install ${plan.dependencies.join(", ")}`)
}

export async function add(names: string[], options: AddOptions = {}) {
  setSilent(Boolean(options.silent))
  if (names.length === 0) throw new CliError(`Nothing to add.`, `Try \`${BIN} list\`.`)

  const config = loadConfig(options)
  const started = Date.now()

  const items = await collect(config.registry, names)
  const plan = buildPlan(items, config)
  const cssFileRel = path.relative(config.cwd, plan.cssFile).replace(/\\/g, "/")

  line()
  describe(plan, cssFileRel, names)
  line()

  if (options.dryRun) {
    ok("dry run — nothing written")
    return
  }

  const existing = clashes(plan)
  if (existing.length > 0 && !options.overwrite) {
    throw new CliError(
      `${existing.length} ${existing.length === 1 ? "file" : "files"} already exist.`,
      `Pass --overwrite to replace ${existing.length === 1 ? "it" : "them"}, or move ${existing.length === 1 ? "it" : "them"} aside first.`,
    )
  }

  if (!options.yes) {
    const answer = await prompts({
      type: "confirm",
      name: "proceed",
      message: existing.length > 0 ? `Overwrite ${existing.length} and continue?` : "Proceed?",
      initial: true,
    })
    if (!answer.proceed) throw new CliError("Cancelled. Nothing was written.")
    line()
  }

  const written = writeFiles(plan)
  ok(`wrote ${written} ${written === 1 ? "file" : "files"}`)

  if (plan.assets.length > 0) {
    const bytes = await downloadAssets(plan, (rel, size, index, total) => {
      step(`${c.dim(`${index}/${total}`)} ${rel} ${c.dim(humanBytes(size))}`)
    })
    ok(`downloaded ${plan.assets.length} ${plan.assets.length === 1 ? "asset" : "assets"} · ${humanBytes(bytes)}`)
  }

  const css = patchCss(plan)
  if (css === "written") ok(`updated ${cssFileRel}`)
  if (css === "already-there") step(`${cssFileRel} already had it`)
  if (css === "no-stylesheet") {
    warn(`no stylesheet at ${cssFileRel} — add the keyframes yourself, or pass --css <path>`)
  }

  if (plan.dependencies.length > 0) {
    const manager = detectManager(config.cwd)
    if (options.deps === false) {
      warn(`skipped packages — run: ${installCommand(manager, plan.dependencies)}`)
    } else {
      line()
      const code = await runInstall(manager, plan.dependencies, config.cwd)
      if (code !== 0) {
        warn(`${manager} exited ${code} — the files are written, the packages are not`)
        line(`  run: ${installCommand(manager, plan.dependencies)}`)
      } else {
        const count = plan.dependencies.length
        ok(`installed ${count} ${count === 1 ? "package" : "packages"}`)
      }
    }
  }

  const seconds = ((Date.now() - started) / 1000).toFixed(1)
  line()
  line(`  ${c.green("done")} ${c.dim(`in ${seconds}s`)}`)

  const docs = plan.items[0]?.meta?.docs
  if (docs) line(`  ${c.dim(docs)}`)
  line()
}

export async function list(options: Overrides & { kind?: string; silent?: boolean } = {}) {
  setSilent(Boolean(options.silent))
  const config = loadConfig(options)
  const entries = await fetchIndex(config.registry)

  const filtered = options.kind
    ? entries.filter((entry) => entry.kind === options.kind)
    : entries

  if (filtered.length === 0) {
    throw new CliError(
      options.kind ? `Nothing published under "${options.kind}" yet.` : "The registry is empty.",
    )
  }

  const width = Math.max(...filtered.map((entry) => entry.name.length))
  line()
  for (const entry of filtered) {
    const kind = (entry.kind ?? "").padEnd(10)
    line(`  ${entry.name.padEnd(width)}  ${c.dim(kind)} ${c.dim(entry.description ?? "")}`)
  }
  line()
  line(`  ${c.dim(`${filtered.length} items · npx ${NAME} add <name>`)}`)
  line()
}

export async function info(name: string, options: Overrides & { silent?: boolean } = {}) {
  setSilent(Boolean(options.silent))
  const config = loadConfig(options)

  const items = await collect(config.registry, [name])
  const plan = buildPlan(items, config)
  const cssFileRel = path.relative(config.cwd, plan.cssFile).replace(/\\/g, "/")

  line()
  describe(plan, cssFileRel, [name])

  const existing = clashes(plan)
  if (existing.length > 0) {
    heading("already in this project")
    for (const file of existing) line(`    ${c.yellow(file.rel)}`)
  }

  heading("install")
  line(`    npx ${NAME} add ${name}`)

  heading("json")
  line(`    ${config.registry}/r/${name}.json`)

  const docs = items.find((item) => item.name === name)?.meta?.docs
  if (docs) {
    heading("docs")
    line(`    ${docs}`)
  }
  line()
}

function cleanPath(value: string, fallback: string) {
  const clean = value.trim().replace(/\\/g, "/").replace(/^\.\//, "").replace(/\/+$/, "")
  return clean || fallback
}

export type InitOptions = Overrides & {
  yes?: boolean
  overwrite?: boolean
  silent?: boolean
}

export async function init(options: InitOptions = {}) {
  setSilent(Boolean(options.silent))
  const config = loadConfig(options)
  const target = path.join(config.cwd, CONFIG_FILE)

  if (existsSync(target) && !options.overwrite) {
    throw new CliError(
      `${CONFIG_FILE} already exists.`,
      "Edit it by hand, or pass --overwrite to replace it.",
    )
  }

  let paths = config.paths
  if (!options.yes) {
    line()
    line(`  ${c.dim("Guessed from the project — press enter to keep a value.")}`)
    line()

    const answers = await prompts([
      { type: "text", name: "ui", message: "Components go in", initial: config.paths.ui },
      { type: "text", name: "pages", message: "Pages go in", initial: config.paths.pages },
      { type: "text", name: "hooks", message: "Hooks go in", initial: config.paths.hooks },
      { type: "text", name: "css", message: "Stylesheet", initial: config.paths.css },
    ])

    if (
      typeof answers.ui !== "string" ||
      typeof answers.pages !== "string" ||
      typeof answers.hooks !== "string" ||
      typeof answers.css !== "string"
    ) {
      throw new CliError("Cancelled. Nothing was written.")
    }

    paths = {
      ui: cleanPath(answers.ui, config.paths.ui),
      pages: cleanPath(answers.pages, config.paths.pages),
      hooks: cleanPath(answers.hooks, config.paths.hooks),
      css: cleanPath(answers.css, config.paths.css),
    }
  }

  const contents = {
    registry: config.registry,
    alias: config.alias,
    paths: { ui: paths.ui, pages: paths.pages, hooks: paths.hooks, css: paths.css },
  }
  writeFileSync(target, `${JSON.stringify(contents, null, 2)}\n`, "utf8")

  line()
  ok(`wrote ${CONFIG_FILE}`)
  step(`components → ${paths.ui}`)
  step(`pages → ${paths.pages}`)
  step(`hooks → ${paths.hooks}`)
  step(`stylesheet → ${paths.css}`)

  if (!existsSync(path.join(config.cwd, paths.css))) {
    warn(`there is no ${paths.css} yet — keyframes will be skipped until there is`)
  }

  line()
  line(`  ${c.dim(`next: npx ${NAME} add <name>`)}`)
  line()
}
