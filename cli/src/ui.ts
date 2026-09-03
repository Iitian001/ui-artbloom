import kleur from "kleur"

let quiet = false

export function setSilent(value: boolean) {
  quiet = value
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
