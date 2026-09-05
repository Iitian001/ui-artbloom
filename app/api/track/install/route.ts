import { after } from "next/server"
import type { NextRequest } from "next/server"

import { clientIpHash, rateLimit } from "@/lib/analytics/ip"
import { MAX_BODY_BYTES, PRIVATE_NO_STORE, readJsonBody, stringField } from "@/lib/analytics/http"
import { recordInstall } from "@/lib/analytics/installs"
import { getItem } from "@/lib/registry"

/**
 * `POST /api/track/install` — the only way an install counter ever moves.
 *
 * WHY THIS ROUTE EXISTS AT ALL, given that the install is a fetch of
 * `/r/{name}.json`: that route is `export const dynamic = "force-static"` with
 * `generateStaticParams()` (see `app/r/[name]/route.ts:13`), so every payload is
 * prerendered at build time and served from the CDN. Our code does not run when
 * somebody installs, and making it run would mean trading the CDN for a function
 * invocation on the hottest path the site has. So counting is a separate,
 * deliberate call, and `cli/src/track.ts` is the only thing that makes it — after
 * the files are on disk, so the number means an install that happened. A browser
 * reporter used to sit in `lib/analytics/client.ts` for the copy button to call;
 * nothing ever called it, and it was deleted rather than wired up, because "copied
 * a command" and "installed" in one column is a number with two meanings.
 *
 * WHAT AN ATTACKER CAN DO WITH IT is written out at the bottom of
 * `supabase/schema.sql`. The short version: this is a client-reported number, and
 * anything client-reported is inflatable. The three checks below make it cost
 * something rather than making it impossible.
 *
 * `after()` is what keeps the install fast. The response is returned first and the
 * database write runs once the response is finished
 * (`node_modules/next/dist/docs/01-app/03-api-reference/04-functions/after.md`), so
 * a slow or dead Supabase costs the person installing nothing at all. POST route
 * handlers are never cached, so no segment config is needed to keep this dynamic.
 */

/**
 * Per hashed address, per minute. A `pnpm dlx ui.artbloom add` of a template with
 * registry dependencies posts once per resolved item, so the ceiling has to clear a
 * fan-out plus retries without being a useful amount of inflation on its own.
 *
 * Read `rateLimit()` in `lib/analytics/ip.ts` before trusting this: the window is
 * in process memory, so the real ceiling is this number times the count of live
 * serverless instances. The durable limit is the `(item_name, ip_hash, day)`
 * primary key on `install_events`, which caps one address at +1 per item per day
 * however many instances are running.
 */
const LIMIT_PER_MINUTE = 30
const WINDOW_MS = 60_000

function reply(status: number, payload: Record<string, unknown>, headers?: HeadersInit) {
  return Response.json(payload, {
    status,
    headers: { ...PRIVATE_NO_STORE, ...headers },
  })
}

export async function POST(request: NextRequest) {
  /**
   * A JSON content type is required, and that is a security check rather than
   * fussiness. A cross-origin `fetch` carrying `Content-Type: application/json`
   * triggers a CORS preflight; this route answers no preflight and sends no
   * `Access-Control-Allow-Origin` (the open CORS rule in `next.config.ts` is scoped
   * to `/r/:path*`), so the browser refuses to send the request. Accept
   * `text/plain` as well and the same request becomes a "simple" one that is sent
   * regardless — which is a third-party page silently spending its visitors'
   * addresses on our counters. Node clients like the CLI set this header anyway.
   */
  const contentType = request.headers.get("content-type") ?? ""
  if (!contentType.toLowerCase().startsWith("application/json")) {
    return reply(415, { ok: false, error: "Send application/json" })
  }

  /**
   * Hashed before the body is read, so the cheapest rejections come first and an
   * abusive caller does not get to make us decode JSON. This is the one value the
   * write needs that comes from the request, and computing it now means the
   * `after()` callback closes over a string instead of reaching back for request
   * state. The raw address is not passed on, logged, or stored anywhere.
   */
  const ipHash = await clientIpHash(request.headers)

  const verdict = rateLimit(`install:${ipHash}`, LIMIT_PER_MINUTE, WINDOW_MS)
  if (!verdict.allowed) {
    return reply(
      429,
      { ok: false, error: "Too many install reports from this address" },
      { "retry-after": String(verdict.retryAfterSeconds) },
    )
  }

  const body = await readJsonBody(request)
  if (!body.ok) {
    return reply(body.reason === "too-large" ? 413 : 400, {
      ok: false,
      error: body.reason === "too-large" ? `Body must be under ${MAX_BODY_BYTES} bytes` : "Malformed JSON",
    })
  }

  const name = stringField(body.value, "name")

  /**
   * The name has to be one of the items in `lib/registry/items.ts`. This is the
   * check that stops the endpoint being an arbitrary-key write primitive: the
   * function it calls holds the service role key, which bypasses every row level
   * security policy in the schema, so without this an unauthenticated stranger
   * could insert any row they liked into `public.items` and use the counter table
   * as free storage. `items_name_is_slug` in the schema is the backstop if this
   * line is ever removed; it is not a substitute for it.
   *
   * 404, not 400: "that item does not exist" is the true statement, and it tells a
   * fork with a stale registry something useful.
   */
  if (!name || !getItem(name)) {
    return reply(404, { ok: false, error: "Unknown registry item" })
  }

  /**
   * Queued, not written. `after()` runs when the response is finished, so the
   * outcome — counted, deduplicated as a repeat from this address today, or dropped
   * because no keys are configured — is not knowable here and this route never
   * claims otherwise. `recordInstall()` returns a value for every one of those
   * cases and throws in none of them.
   *
   * The outcome is read rather than discarded, because two of its cases were
   * otherwise invisible from outside the process. `recordInstall` already logs the
   * two that carry an operator action: `unconfigured` warns once per process, and
   * `error` goes through `logRestFailure`. What is left is covered here.
   */
  after(async () => {
    const outcome = await recordInstall({
      name,
      ipHash,
      version: stringField(body.value, "version"),
      runner: stringField(body.value, "runner"),
    })

    /**
     * Cannot happen: the same `getItem(name)` ran above and 404'd. If it ever
     * does, the check and the writer disagree about what is in the registry —
     * worth a line, because the symptom on its own is a counter that ignores one
     * item while every other one moves.
     */
    if (!outcome.accepted && outcome.reason === "unknown-item") {
      console.warn(`[track/install] accepted "${name}" at the route but the writer rejected it`)
      return
    }

    /**
     * A 200 from PostgREST whose body was not a number. The row may well have
     * been written, so this is not an error path — but it means
     * `increment_install` is no longer returning the new total, which is the one
     * thing this endpoint exists to move.
     */
    if (outcome.accepted && outcome.installs === null) {
      console.warn(`[track/install] increment_install returned no usable count for "${name}"`)
    }
  })

  return reply(202, { ok: true, name, queued: true })
}
