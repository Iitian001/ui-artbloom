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
import { fetchIndex, fetchItem, assertName, type Payload } from "./registry.js"
import { reportInstalls } from "./track.js"
import { c, CliError, heading, line, ok, restoreCursorOnExit, setSilent, step, warn } from "./ui.js"

export type AddOptions = Overrides & {
  yes?: boolean
  overwrite?: boolean
  dryRun?: boolean
  deps?: boolean
  telemetry?: boolean
  silent?: boolean
}

/**
 * Walk `registryDependencies` so the CLI also works against a registry that
 * does not pre-flatten them. Ours does, so the extra payloads are usually
 * redundant — the plan dedupes files, packages, and keyframes either way.
 *
 * Every name that was *typed* is validated here, before the first fetch. The
 * loop below skips a falsy name so a registry that lists `""` among an item's
 * dependencies cannot stall the queue, and that skip used to swallow the typed
 * name too: `add ""` reached `assertName` never, wrote nothing, and exited 0 as
 * though it had installed something. A root name is a request, so a malformed
 * one is an error; a dependency name is someone else's data, so a malformed one
 * is a warning at worst.
 */
async function collect(registry: string, names: string[]): Promise<Payload[]> {
  for (const name of names) assertName(name)

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
 *
 * Three states per target, not two. `exists` alone was printed as "(exists)" in
 * yellow, which read as a warning over a file already holding exactly the bytes
 * the plan would write — and read as merely informational over one that `add`
 * was about to refuse. `identical` separates them: already installed is dim and
 * settled, a true clash is yellow and names the flag that resolves it.
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
  for (const file of plan.files) line(`    ${state(file.rel, file)}`)

  if (plan.assets.length > 0) {
    const total = plan.assets.reduce((sum, asset) => sum + asset.bytes, 0)
    heading(`will download ${plan.assets.length} ${plan.assets.length === 1 ? "asset" : "assets"} · ${humanBytes(total)}`)
    for (const asset of plan.assets) {
      line(`    ${state(`${asset.rel} ${c.dim(humanBytes(asset.bytes))}`, asset)}`)
    }
  }

  const css = cssSummary(plan)
  if (css) line(`  will append ${css} to ${cssFileRel}`)
  if (plan.dependencies.length > 0) line(`  will install ${plan.dependencies.join(", ")}`)
}

/** One planned target, labelled by which of the three things it is. */
function state(label: string, entry: { exists: boolean; identical: boolean }) {
  if (entry.identical) return `${c.dim(label)}${c.dim(" (already installed)")}`
  if (entry.exists) return `${c.yellow(label)}${c.yellow(" (will be replaced)")}`
  return label
}

/**
 * Refuse to prompt when there is nobody to answer.
 *
 * `prompts` builds a readline over whatever stdin happens to be; on a pipe it
 * closes without ever submitting, so the promise never settles, the event loop
 * drains, and Node exits 0 having done nothing. Assuming yes instead would write
 * files into somebody's repo unattended, which is worse than refusing.
 */
function assertInteractive(hint: string) {
  if (!process.stdin.isTTY) {
    throw new CliError("Cannot prompt — stdin is not a terminal. Nothing was written.", hint)
  }
}

/**
 * Everything the printed plan promised and the run did not deliver.
 *
 * A shortfall does not undo what already landed: a missing stylesheet is a
 * one-line fix, and discarding files that are already correct would only make
 * the retry slower. But a plan that half happened must never read as success, so
 * every shortfall collects here and is settled once — exit status stays a single
 * decision at the end of the command rather than a flag set from four places,
 * and each shortfall is named alongside the command that finishes it.
 */
class Unfinished {
  private readonly entries: { what: string; fix: string }[] = []

  note(what: string, fix: string) {
    this.entries.push({ what, fix })
  }

  settle() {
    const count = this.entries.length
    if (count === 0) return
    throw new CliError(
      `${count} ${count === 1 ? "thing" : "things"} the plan promised did not happen.`,
      [
        ...this.entries.map((entry) => `${entry.what}\n      ${entry.fix}`),
        "The rest of the plan is on disk — nothing was rolled back.",
      ].join("\n    "),
    )
  }
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

  /**
   * The clash check runs before the --dry-run return, not after it. A dry run
   * whose whole purpose is "tell me what this would do" must not print a plan and
   * exit 0 for a run that would immediately exit 1 on the same inputs.
   */
  const existing = clashes(plan)
  if (existing.length > 0 && !options.overwrite) {
    throw new CliError(
      `${existing.length} ${existing.length === 1 ? "file already exists" : "files already exist"}.`,
      `Pass --overwrite to replace ${existing.length === 1 ? "it" : "them"}, or move ${existing.length === 1 ? "it" : "them"} aside first.`,
    )
  }

  if (options.dryRun) {
    ok("dry run — nothing written")
    return
  }

  if (!options.yes) {
    assertInteractive("Pass --yes to answer it with the default, or run this from a terminal.")
    restoreCursorOnExit()
    const answer = await prompts({
      type: "confirm",
      name: "proceed",
      message: existing.length > 0 ? `Overwrite ${existing.length} and continue?` : "Proceed?",
      initial: true,
    })
    if (!answer.proceed) throw new CliError("Cancelled. Nothing was written.")
    line()
  }

  const unfinished = new Unfinished()

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
    warn(`no stylesheet at ${cssFileRel}`)
    unfinished.note(
      `${cssSummary(plan)} not appended to ${cssFileRel}`,
      `create ${cssFileRel} — or point --css at one that exists — then re-run with --overwrite`,
    )
  }

  /**
   * Detected once, before it is needed twice: the manager that installs the
   * packages is the same one reported afterwards, whatever the install itself
   * leaves lying around in the project root.
   */
  const manager = detectManager(config.cwd)

  if (plan.dependencies.length > 0) {
    if (options.deps === false) {
      warn(`skipped packages — run: ${installCommand(manager, plan.dependencies)}`)
    } else {
      line()
      const code = await runInstall(manager, plan.dependencies, config.cwd)
      if (code !== 0) {
        warn(`${manager} exited ${code} — the files are written, the packages are not`)
        unfinished.note(
          `${plan.dependencies.join(", ")} not installed`,
          installCommand(manager, plan.dependencies),
        )
      } else {
        const count = plan.dependencies.length
        ok(`installed ${count} ${count === 1 ? "package" : "packages"}`)
      }
    }
  }

  unfinished.settle()

  /**
   * Past this line the run succeeded: every file is on disk, the stylesheet took
   * what it was given, and the package manager exited 0 or was never asked to
   * run. A shortfall would have thrown above, so nothing half-finished is ever
   * reported as an install.
   *
   * Only the names that were typed go out. The registry dependencies they
   * dragged in were nobody's choice, and counting those would flatter the shared
   * helpers and nothing else. Fire and forget: `add` does not wait for this and
   * cannot fail because of it.
   */
  reportInstalls(
    config.registry,
    plan.items.filter((item) => names.includes(item.name)).map((item) => item.name),
    manager,
    options.telemetry,
  )

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
    assertInteractive("Pass --yes to accept the guessed paths, or run this from a terminal.")
    restoreCursorOnExit()

    line()
    line(`  ${c.dim("Guessed from the project — press enter to keep a value.")}`)
    line()

    const answers = await prompts([
      { type: "text", name: "ui", message: "Components go in", initial: config.paths.ui },
      { type: "text", name: "pages", message: "Pages go in", initial: config.paths.pages },
      { type: "text", name: "hooks", message: "Hooks go in", initial: config.paths.hooks },
      { type: "text", name: "lib", message: "Helpers go in", initial: config.paths.lib },
      { type: "text", name: "css", message: "Stylesheet", initial: config.paths.css },
    ])

    if (
      typeof answers.ui !== "string" ||
      typeof answers.pages !== "string" ||
      typeof answers.hooks !== "string" ||
      typeof answers.lib !== "string" ||
      typeof answers.css !== "string"
    ) {
      throw new CliError("Cancelled. Nothing was written.")
    }

    paths = {
      ui: cleanPath(answers.ui, config.paths.ui),
      pages: cleanPath(answers.pages, config.paths.pages),
      hooks: cleanPath(answers.hooks, config.paths.hooks),
      lib: cleanPath(answers.lib, config.paths.lib),
      css: cleanPath(answers.css, config.paths.css),
    }
  }

  const contents = {
    registry: config.registry,
    alias: config.alias,
    paths: {
      ui: paths.ui,
      pages: paths.pages,
      hooks: paths.hooks,
      lib: paths.lib,
      css: paths.css,
    },
  }
  writeFileSync(target, `${JSON.stringify(contents, null, 2)}\n`, "utf8")

  line()
  ok(`wrote ${CONFIG_FILE}`)
  step(`components → ${paths.ui}`)
  step(`pages → ${paths.pages}`)
  step(`hooks → ${paths.hooks}`)
  step(`helpers → ${paths.lib}`)
  step(`stylesheet → ${paths.css}`)

  if (!existsSync(path.join(config.cwd, paths.css))) {
    warn(`there is no ${paths.css} yet — keyframes will be skipped until there is`)
  }

  line()
  line(`  ${c.dim(`next: npx ${NAME} add <name>`)}`)
  line()
}
