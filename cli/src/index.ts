#!/usr/bin/env node
import { Command } from "commander"

import { add, info, init, list, type AddOptions, type InitOptions } from "./commands.js"
import type { Overrides } from "./config.js"
import { BIN, NAME, VERSION } from "./pkg.js"
import { c, CliError, fail } from "./ui.js"

type ListOptions = Overrides & { kind?: string; silent?: boolean }
type InfoOptions = Overrides & { silent?: boolean }

const program = new Command()

program
  .name(BIN)
  .description(`Copy templates and animations into your project.`)
  .version(VERSION, "-v, --version")
  .showHelpAfterError()

program
  .command("add")
  .argument("<names...>", "install names, as shown on each item page")
  .description("Write one or more pieces into this project")
  .option("-y, --yes", "answer every prompt with the default")
  .option("-o, --overwrite", "replace files that already exist")
  .option("-c, --cwd <path>", "project root (default: the current directory)")
  .option("--css <path>", "stylesheet that receives keyframes")
  .option("--ui <path>", "where component files land")
  .option("--registry <url>", "read from a different registry origin")
  .option("--dry-run", "print the plan and exit")
  .option("--no-deps", "skip the npm install step")
  // Commander turns a `--no-x` flag into `x: false`, which is exactly what
  // track.ts reads. It has to be declared even so: undeclared, the flag the
  // README documents exits 1 as an unknown option instead of opting out.
  .option("--no-telemetry", "do not report the install")
  .option("-s, --silent", "no output except errors")
  .action(async (names: string[], options: AddOptions) => {
    await add(names, options)
  })

program
  .command("list")
  .description("Print the catalogue")
  .option("--kind <kind>", "templates or animations")
  .option("-c, --cwd <path>", "project root (default: the current directory)")
  .option("--registry <url>", "read from a different registry origin")
  .option("-s, --silent", "no output except errors")
  .action(async (options: ListOptions) => {
    await list(options)
  })

program
  .command("info")
  .argument("<name>", "an install name")
  .description("Show what a piece would write. Writes nothing")
  .option("-c, --cwd <path>", "project root (default: the current directory)")
  .option("--css <path>", "stylesheet that receives keyframes")
  .option("--ui <path>", "where component files land")
  .option("--registry <url>", "read from a different registry origin")
  .option("-s, --silent", "no output except errors")
  .action(async (name: string, options: InfoOptions) => {
    await info(name, options)
  })

program
  .command("init")
  .description(`Write a ${NAME}.json so you stop passing paths on every call`)
  .option("-y, --yes", "accept the guessed paths without prompting")
  .option("-o, --overwrite", "replace an existing config file")
  .option("-c, --cwd <path>", "project root (default: the current directory)")
  .option("--css <path>", "stylesheet that receives keyframes")
  .option("--ui <path>", "where component files land")
  .option("--registry <url>", "registry origin to record")
  .option("-s, --silent", "no output except errors")
  .action(async (options: InitOptions) => {
    await init(options)
  })

program.addHelpText(
  "after",
  `
Examples:
  npx ${NAME} list --kind animations
  npx ${NAME} info marquee
  npx ${NAME} add text-shimmer number-ticker
  npx ${NAME} add cinematic-supercar --yes --overwrite

Installed as a dependency, the command is \`${BIN}\`.
`,
)

/**
 * Expected failures print their message and exit 1. Anything else is a bug in
 * this CLI, so it keeps its stack — behind DEBUG, to stay out of the way.
 */
program.parseAsync(process.argv).catch((error: unknown) => {
  console.error("")
  if (error instanceof CliError) {
    fail(error.message)
    if (error.hint) console.error(`    ${c.dim(error.hint)}`)
  } else {
    fail(error instanceof Error ? error.message : String(error))
    if (process.env.DEBUG && error instanceof Error && error.stack) console.error(error.stack)
    else console.error(`    ${c.dim(`Unexpected — rerun with DEBUG=1 for the stack.`)}`)
  }
  console.error("")
  process.exitCode = 1
})
