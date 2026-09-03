import "server-only"

import type { NextRequest } from "next/server"

/**
 * Request plumbing shared by the two route handlers: a body reader that cannot be
 * made to buffer an unbounded amount of memory, and the cross-site check that a
 * cookie-authenticated write needs.
 *
 * Both of these are the kind of thing a framework is assumed to do for you and
 * does not. Route handlers hand you a Web `Request`; `await request.json()` on one
 * will read a body of any size a client cares to send.
 */

/** 2 KB. The largest honest body either endpoint takes is about 80 bytes. */
export const MAX_BODY_BYTES = 2048

export type BodyResult =
  | { ok: true; value: unknown }
  | { ok: false; reason: "too-large" | "not-json" }

function concat(chunks: Uint8Array[], total: number): Uint8Array {
  const out = new Uint8Array(total)
  let offset = 0
  for (const chunk of chunks) {
    out.set(chunk, offset)
    offset += chunk.byteLength
  }
  return out
}

/**
 * Read and parse a JSON body, refusing to hold more than `maxBytes` of it.
 *
 * Read in chunks off the stream and cancelled the moment the running total passes
 * the cap, rather than `await request.text()` then checking the length — by the
 * time `text()` resolves the whole body is already in memory, so a length check
 * there measures a decision that has already been made. `content-length` is
 * checked first as a courtesy to honest clients, but it is only a claim: a chunked
 * request need not send one and may lie in either direction, so the running total
 * is what actually enforces the cap.
 *
 * An absent or empty body is `{ ok: true, value: undefined }` — not an error, just
 * nothing. `DELETE /api/saves` takes its argument in the query string and sends no
 * body at all.
 */
export async function readJsonBody(
  request: Request,
  maxBytes: number = MAX_BODY_BYTES,
): Promise<BodyResult> {
  const declared = Number(request.headers.get("content-length"))
  if (Number.isFinite(declared) && declared > maxBytes) return { ok: false, reason: "too-large" }

  const body = request.body
  if (!body) return { ok: true, value: undefined }

  const reader = body.getReader()
  const chunks: Uint8Array[] = []
  let total = 0

  try {
    for (;;) {
      const { done, value } = await reader.read()
      if (done) break
      if (!value) continue
      total += value.byteLength
      if (total > maxBytes) {
        await reader.cancel()
        return { ok: false, reason: "too-large" }
      }
      chunks.push(value)
    }
  } catch {
    // Connection died mid-body. Nothing to parse and nobody to tell.
    return { ok: false, reason: "not-json" }
  }

  if (total === 0) return { ok: true, value: undefined }

  try {
    return { ok: true, value: JSON.parse(new TextDecoder().decode(concat(chunks, total))) }
  } catch {
    return { ok: false, reason: "not-json" }
  }
}

/** A field that has to be a short string to be worth looking at. */
export function stringField(source: unknown, key: string): string | undefined {
  if (typeof source !== "object" || source === null) return undefined
  const value = (source as Record<string, unknown>)[key]
  if (typeof value !== "string") return undefined
  const trimmed = value.trim()
  return trimmed.length > 0 && trimmed.length <= 128 ? trimmed : undefined
}

/**
 * Does this request's `Origin` belong to this site?
 *
 * WHAT IT PREVENTS: cross-site request forgery on the cookie-authenticated
 * writes. `evil.example` cannot read a response it is not allowed to read, but
 * without this it could still *cause* one — a form or a `fetch` that lands on
 * `POST /api/saves` while the visitor's session cookie tags along, quietly filling
 * or emptying somebody's library.
 *
 * WHAT IT IS NOT: the only thing standing in the way. The session cookies are
 * `sameSite: "lax"` (`app/(site)/(auth)/auth.ts`), which already means a browser
 * does not attach them to a cross-site POST at all. This is the second lock, for
 * the cases the first one misses: a browser old enough to default `SameSite` to
 * `None`, and a page on a *different subdomain* of the same site, which is
 * same-site by that cookie's rules and a different origin by this one's.
 *
 * A missing `Origin` is rejected on the cookie path. Every browser sends one on a
 * `fetch` or a form POST, so its absence means the caller is not a browser — and a
 * caller that is not a browser has no cookie jar and should be presenting a bearer
 * token, which cannot be forged onto somebody else's request in the first place.
 *
 * `x-forwarded-host` before `host`, because a proxy rewrites the latter (this is
 * the same order `requestOrigin()` in the auth module uses). Both headers are
 * client-settable in principle; forging them to match your own `Origin` gains
 * nothing, since the cookie you are trying to borrow still never leaves the
 * victim's browser for your origin.
 */
export function isSameOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin")
  if (!origin) return false

  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host")
  if (!host) return false

  try {
    return new URL(origin).host.toLowerCase() === host.trim().toLowerCase()
  } catch {
    // `Origin: null` (a sandboxed iframe, a file:// page) lands here.
    return false
  }
}

/**
 * Response headers for anything user-specific.
 *
 * `private` is the load-bearing word: without it a shared cache in front of the
 * app — Vercel's, a corporate proxy — is free to store one user's saved list and
 * hand it to the next person who asks. `no-store` then says do not keep it at all.
 */
export const PRIVATE_NO_STORE = {
  "cache-control": "private, no-store, max-age=0",
} as const
