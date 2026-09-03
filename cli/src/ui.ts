import { writeSync } from "node:fs"

import kleur from "kleur"

let quiet = false
let cursorArmed = false

export function setSilent(value: boolean) {
  quiet = value
}

/**
 * Guarantee the cursor comes back, however this process ends.
 *
 * `prompts` hides it on its first render and shows it again only when the prompt
 * closes, so any exit that skips the close leaves the terminal with no cursor
 * until the next `reset`. `writeSync` rather than `process.stdout.write` because
 * an `exit` listener is the last code to run: a TTY write through the stream is
 * asynchronous on Windows and would never flush. --silent does not apply — this
 * is terminal state, not output.
 */
export function restoreCursorOnExit() {
  if (cursorArmed || !process.stdout.isTTY) return
  cursorArmed = true
  process.on("exit", () => {
    try {
      writeSync(1, "\x1b[?25h")
    } catch {
      // Nothing better to try — the process is already leaving.
    }
  })
}

export function line(text = "") {
  if (!quiet) console.log(text)
}

export function step(text: string) {
  line(`  ${kleur.dim("·")} ${text}`)
}

export function ok(text: string) {
  line(`  ${kleur.green("✓")} ${text}`)
}

export function warn(text: string) {
  line(`  ${kleur.yellow("!")} ${text}`)
}

/** Errors always print, even under --silent: a silent failure is a lie. */
export function fail(text: string) {
  console.error(`  ${kleur.red("✗")} ${text}`)
}

export function heading(text: string) {
  line()
  line(`  ${kleur.bold(text)}`)
}

export const c = kleur

/** Thrown for expected, explainable failures — no stack trace shown. */
export class CliError extends Error {
  readonly hint?: string
  constructor(message: string, hint?: string) {
    super(message)
    this.name = "CliError"
    this.hint = hint
  }
}
