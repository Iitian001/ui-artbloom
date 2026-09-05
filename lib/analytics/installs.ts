import "server-only"

import { getItem } from "@/lib/registry"

import { logRestFailure } from "./rest"
import { serviceRest, serviceRoleReady } from "./server"

/**
 * The only write path to an install counter.
 *
 * It is reached from `app/api/track/install/route.ts` inside `after()`, so it runs
 * once the response has already gone out. Nothing here throws: every failure —
 * missing keys, an unknown item, a 500 from Supabase, a timeout — comes back as a
 * value, which is what lets the caller `await` it inside an `after()` callback
 * without having to reason about how the framework treats a rejected one.
 *
 * On SQL injection: there is none to have. PostgREST sends the arguments as a JSON
 * body and calls the function with bound parameters — `item_name` is never
 * concatenated into a statement. The validation below is about keeping junk out of
 * the table, not about escaping.
 */

/**
 * The exact set the CLI can send: `cli/src/apply.ts` declares
 * `export type Manager = "npm" | "pnpm" | "yarn" | "bun"` and `reportInstalls()`
 * passes that value straight through. `"npx"` is here for the other caller — the
 * copy-button path in `client.ts`, where what was copied is an `npx` command.
 * Miss `"npm"` out of this list and the most common runner in the world silently
 * becomes null in every row.
 */
const KNOWN_RUNNERS = new Set(["npm", "npx", "pnpm", "yarn", "bun"])

/** Anything not in the runner list becomes null rather than free text in a column. */
export function normalizeRunner(value: unknown): string | null {
  return typeof value === "string" && KNOWN_RUNNERS.has(value) ? value : null
}

const VERSION_PATTERN = /^\d{1,4}\.\d{1,4}\.\d{1,4}(?:[-+][0-9A-Za-z.-]{1,16})?$/

/** Semver or nothing. The CLI reports its own version; it is diagnostic, never trusted. */
export function normalizeVersion(value: unknown): string | null {
  if (typeof value !== "string") return null
  const trimmed = value.trim()
  return trimmed.length <= 32 && VERSION_PATTERN.test(trimmed) ? trimmed : null
}

export type RecordInstallInput = {
  /** Must be a name in `lib/registry/items.ts`. Checked again here. */
  name: string
  /** From `clientIpHash()`. Never a raw address. */
  ipHash: string
  version?: unknown
  runner?: unknown
}

export type RecordInstallOutcome =
  /** `installs` is the new total, or null when Supabase answered with something unreadable. */
  | { accepted: true; installs: number | null }
  | { accepted: false; reason: "unconfigured" | "unknown-item" | "error" }

/**
 * Say "the keys are missing" once per process, not once per request.
 *
 * `logRestFailure` is deliberately silent on `unconfigured`, because a local
 * checkout with no keys would otherwise warn on every page. That silence hid the
 * case that actually matters: a *deployed* site whose `SUPABASE_SECRET_KEY` was
 * never pasted in drops every install ping, and did it with no log line
 * anywhere — the route answered 202, `after()` returned `unconfigured`, and the
 * only visible symptom was a counter that stayed at zero forever.
 *
 * Guarded by a module-scope flag rather than a counter: one line at cold start is
 * enough to find this in a log, and repeating it per request would bury the
 * failures that vary.
 */
let warnedUnconfigured = false

function warnUnconfiguredOnce() {
  if (warnedUnconfigured || process.env.NODE_ENV !== "production") return
  warnedUnconfigured = true
  console.warn(
    "[analytics] install pings are being dropped: no service role key is configured. " +
      "Set SUPABASE_SECRET_KEY (and NEXT_PUBLIC_SUPABASE_URL) to start counting.",
  )
}

export async function recordInstall(input: RecordInstallInput): Promise<RecordInstallOutcome> {
  // Checked in the route handler too. Repeated here because this is the function
  // that holds the service role key, and the service role bypasses every RLS
  // policy in the schema — so the name check is the last line of defence against
  // this becoming a write-anything primitive, and it should not live only in the
  // caller.
  if (!getItem(input.name)) return { accepted: false, reason: "unknown-item" }

  if (!serviceRoleReady) {
    warnUnconfiguredOnce()
    return { accepted: false, reason: "unconfigured" }
  }

  const result = await serviceRest<number | string>("rpc/increment_install", {
    method: "POST",
    body: {
      item_name: input.name,
      ip_hash: input.ipHash,
      version: normalizeVersion(input.version),
      runner: normalizeRunner(input.runner),
    },
    timeoutMs: 4000,
  })

  if (!result.ok) {
    logRestFailure("increment_install", result)
    return { accepted: false, reason: "error" }
  }

  const raw = typeof result.data === "string" ? Number.parseInt(result.data, 10) : result.data
  const installs = typeof raw === "number" && Number.isFinite(raw) ? Math.trunc(raw) : null
  return { accepted: true, installs }
}
