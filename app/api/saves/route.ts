import type { NextRequest } from "next/server"

import { publicSupabaseReady } from "@/lib/analytics/env"
import {
  isSameOrigin,
  MAX_BODY_BYTES,
  PRIVATE_NO_STORE,
  readJsonBody,
  stringField,
} from "@/lib/analytics/http"
import { clientIpHash, rateLimit } from "@/lib/analytics/ip"
import {
  addSave,
  credentialFromRequest,
  getSessionUser,
  listSaves,
  removeSave,
  type SessionUser,
} from "@/lib/analytics/saves"
import { getItem } from "@/lib/registry"

/**
 * `/api/saves` — the signed-in visitor's saved items. GET to list, POST to add,
 * DELETE to remove.
 *
 * WHO THE CALLER IS COMES FROM THE SESSION, NEVER FROM THE REQUEST BODY. There is
 * no `user_id` parameter anywhere in this file or in `lib/analytics/saves.ts`, so
 * there is nothing for a caller to lie about. The id is whatever the Supabase Auth
 * server says the token belongs to — a network check on every call, not a local
 * decode, because the `sub` claim inside an unverified JWT is just a string the
 * client chose.
 *
 * AND THE DATABASE DOES NOT TAKE OUR WORD FOR IT EITHER. These handlers reach
 * PostgREST with the anon key plus the caller's own token, so the `saves_*` policies
 * in `supabase/schema.sql` decide which rows are reachable. The service role key —
 * which bypasses all of them — is deliberately not on this path. A bug in this file
 * cannot hand one person another person's library.
 *
 * Every response is `private, no-store`: this body is per user, and a shared cache
 * that kept one would eventually serve it to somebody else.
 */

/** Per hashed address. Generous for a UI, and it bounds the Auth round trips a
 *  stranger can make us pay for, since verifying a token is a network call. */
const LIMIT_PER_MINUTE = 60
const WINDOW_MS = 60_000

function reply(status: number, payload: Record<string, unknown>, headers?: HeadersInit) {
  return Response.json(payload, { status, headers: { ...PRIVATE_NO_STORE, ...headers } })
}

type Caller = { ok: true; token: string; user: SessionUser } | { ok: false; response: Response }

/**
 * Establish who is calling, in the order that makes each refusal honest.
 *
 * 1. Not configured. No Supabase keys on this deployment, so there is no account
 *    system to be signed out of. 503 says "not here yet", which is true, where a
 *    401 would say "wrong credentials", which is not.
 * 2. Rate limit, before the token is checked. Verifying a token costs a request to
 *    the Auth server, so an unauthenticated flood would otherwise be a way of
 *    spending our Supabase quota for free.
 * 3. Cross-site check, on the cookie path only, and only for a write. See
 *    `isSameOrigin()` for what it prevents and what already prevented it.
 * 4. Only then, ask the Auth server. A rejected or expired token is a 401.
 */
async function authorize(request: NextRequest, mutating: boolean): Promise<Caller> {
  if (!publicSupabaseReady) {
    return {
      ok: false,
      response: reply(503, {
        ok: false,
        configured: false,
        error: "Accounts are not configured on this deployment",
      }),
    }
  }

  const ipHash = await clientIpHash(request.headers)
  const verdict = rateLimit(`saves:${ipHash}`, LIMIT_PER_MINUTE, WINDOW_MS)
  if (!verdict.allowed) {
    return {
      ok: false,
      response: reply(
        429,
        { ok: false, error: "Too many requests" },
        { "retry-after": String(verdict.retryAfterSeconds) },
      ),
    }
  }

  const credential = credentialFromRequest(request)
  if (!credential) {
    return { ok: false, response: reply(401, { ok: false, error: "Sign in to save items" }) }
  }

  if (mutating && credential.from === "cookie" && !isSameOrigin(request)) {
    return { ok: false, response: reply(403, { ok: false, error: "Cross-site write refused" }) }
  }

  const user = await getSessionUser(credential.token)
  if (!user) {
    return { ok: false, response: reply(401, { ok: false, error: "That session is not valid" }) }
  }

  return { ok: true, token: credential.token, user }
}

/** A failure from `lib/analytics/saves.ts`, as a status a client can act on. */
function failureStatus(reason: "unconfigured" | "unauthorized" | "unknown-item" | "error"): number {
  if (reason === "unconfigured") return 503
  if (reason === "unauthorized") return 401
  if (reason === "unknown-item") return 404
  // Reached Supabase, Supabase said no. Ours to look at, not the caller's to fix.
  return 502
}

/**
 * The item name a write is about: a string in the body (POST) or the query string
 * (DELETE), and in both cases a name that `lib/registry/items.ts` actually declares.
 * The count is deliberately not written down here — it changes every time an item is
 * added, and a number in a comment is one more thing to be wrong.
 *
 * The registry check is not decoration. `item_name` has no foreign key to
 * `public.items` — a user can save something nobody has installed — so without this
 * the table would accept any slug a caller invented, and `items.saves` would count
 * saves of things that do not exist. `saves_item_name_is_slug` in the schema bounds
 * the shape; this bounds the set.
 */
function knownItem(name: string | undefined): string | null {
  return name && getItem(name) ? name : null
}

/**
 * List. An unconfigured deployment answers 200 with an empty list rather than an
 * error: there is no account system yet, so "you have saved nothing" is the true
 * answer and a bookmarks page can render it without a special case. Writes are
 * where an unconfigured deployment has to say so out loud, because there the caller
 * is expecting something to persist.
 */
export async function GET(request: NextRequest) {
  if (!publicSupabaseReady) return reply(200, { ok: true, configured: false, saves: [] })

  const caller = await authorize(request, false)
  if (!caller.ok) return caller.response

  const result = await listSaves(caller.token, caller.user.id)
  if (!result.ok) {
    return reply(failureStatus(result.reason), { ok: false, error: "Could not read your saves" })
  }

  return reply(200, { ok: true, configured: true, saves: result.data })
}

/**
 * Save one item. Idempotent — saving something twice is a success, not a 409.
 *
 * The JSON content type is required, and it is the third lock on cross-site writes
 * after `sameSite: "lax"` and the `Origin` check: an HTML form can only send
 * `application/x-www-form-urlencoded`, `multipart/form-data` or `text/plain`, so
 * refusing everything else means the classic no-JavaScript CSRF form cannot reach
 * this handler at all, and a cross-origin `fetch` sending JSON has to clear a
 * preflight that this route never answers.
 */
export async function POST(request: NextRequest) {
  const caller = await authorize(request, true)
  if (!caller.ok) return caller.response

  const contentType = request.headers.get("content-type") ?? ""
  if (!contentType.toLowerCase().startsWith("application/json")) {
    return reply(415, { ok: false, error: "Send application/json" })
  }

  const body = await readJsonBody(request)
  if (!body.ok) {
    return reply(body.reason === "too-large" ? 413 : 400, {
      ok: false,
      error:
        body.reason === "too-large" ? `Body must be under ${MAX_BODY_BYTES} bytes` : "Malformed JSON",
    })
  }

  const name = knownItem(stringField(body.value, "name"))
  if (!name) return reply(404, { ok: false, error: "Unknown registry item" })

  const result = await addSave(caller.token, name)
  if (!result.ok) {
    return reply(failureStatus(result.reason), { ok: false, error: "Could not save that item" })
  }

  return reply(200, { ok: true, name, saved: true })
}

/**
 * Un-save one item. Idempotent — removing something that is not there is a success.
 *
 * `?name=` rather than a body, because a DELETE with a body is poorly supported by
 * intermediaries and there is exactly one argument. The name is required: PostgREST
 * reads an unfiltered DELETE as "every row you are allowed to touch", so
 * `removeSave()` always sends both filters and a caller who omits the name gets a
 * 404 here rather than an emptied library there.
 */
export async function DELETE(request: NextRequest) {
  const caller = await authorize(request, true)
  if (!caller.ok) return caller.response

  const name = knownItem(request.nextUrl.searchParams.get("name")?.trim())
  if (!name) return reply(404, { ok: false, error: "Unknown registry item" })

  const result = await removeSave(caller.token, caller.user.id, name)
  if (!result.ok) {
    return reply(failureStatus(result.reason), { ok: false, error: "Could not remove that item" })
  }

  return reply(200, { ok: true, name, saved: false })
}




