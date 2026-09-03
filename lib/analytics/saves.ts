import "server-only"

import type { NextRequest } from "next/server"

import { getItem } from "@/lib/registry"

import { authEndpoint, publicSupabaseReady, SUPABASE_ANON_KEY } from "./env"
import { logRestFailure, restFetch } from "./rest"
import { userRest } from "./server"

/**
 * A signed-in user's saved items.
 *
 * The identity of the caller comes from one place only: the access token on the
 * request. Nothing in this file accepts a `user_id` argument, so there is no
 * parameter for a caller to lie about — and the writes go through the anon key
 * plus that token, which means row level security, not this code, decides which
 * rows are reachable. The service role key deliberately never appears here.
 */

export type SessionUser = { id: string; email: string | null }

export type SavesFailure = "unconfigured" | "unauthorized" | "unknown-item" | "error"
export type SavesResult<T> = { ok: true; data: T } | { ok: false; reason: SavesFailure }

/**
 * Pull the bearer token out of the request headers.
 *
 * The shape check is a cheap filter to avoid a round trip on obvious junk — three
 * base64url segments is what a JWT looks like. It is NOT verification, and nothing
 * downstream reads the payload: the `sub` claim inside an unverified JWT is
 * attacker-controlled, so the user id always comes from `getSessionUser` instead.
 */
export function bearerToken(headers: Headers): string | undefined {
  const raw = headers.get("authorization")?.trim()
  if (!raw) return undefined
  const token = /^bearer\s+(\S+)$/i.exec(raw)?.[1]
  if (!token) return undefined
  return /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(token) ? token : undefined
}

/**
 * The name of the httpOnly cookie the site's own session lives in.
 *
 * COUPLING, DELIBERATE AND WORTH KNOWING ABOUT: this string is declared a second
 * time, as a private `const ACCESS_COOKIE` in `app/(site)/(auth)/auth.ts`, which
 * is the file that writes it (`writeSession()` stores the raw Supabase access
 * token in it, so the value here is a token this module can send straight on to
 * PostgREST). That file is owned by another workstream and does not export the
 * name, so it is repeated rather than imported. Rename it there and saves stop
 * being read; the handoff asks for it to be exported so this copy can go.
 */
const ACCESS_COOKIE = "ab-access"

/**
 * The caller's access token, from the session cookie or from an explicit bearer.
 *
 * Order matters. The cookie is the site's real session: it is `httpOnly`, so no
 * script on the page can read it, which is the whole reason it is preferred over
 * anything the browser could hand us. The `Authorization` header is the path for
 * a non-browser client (a script, the CLI if it ever grows a login) that has a
 * token of its own and no cookie jar.
 *
 * `from` is not bookkeeping — the caller needs it. A cookie is attached by the
 * browser whether or not the page asking for it is ours, so a cookie-authenticated
 * write has to pass the cross-site check in `http.ts`; a bearer token has to be put
 * on the request deliberately, so it cannot be forged onto somebody else's and
 * needs no such check.
 *
 * `writeSession()` writes `access_token ?? ""`, so an empty cookie is a real
 * possibility and reads here as "no session" rather than as a token to send.
 *
 * Whichever it came from, the token is still only a claim — `getSessionUser()`
 * asks the Auth server who it belongs to. Nothing here decodes it.
 */
export type Credential = { token: string; from: "cookie" | "bearer" }

export function credentialFromRequest(request: NextRequest): Credential | undefined {
  const header = bearerToken(request.headers)
  if (header) return { token: header, from: "bearer" }
  const cookie = request.cookies.get(ACCESS_COOKIE)?.value?.trim()
  return cookie ? { token: cookie, from: "cookie" } : undefined
}

/**
 * Who the token belongs to, according to the Supabase Auth server.
 *
 * This is a network call on purpose. Supabase documents `getUser()` as performing
 * "a network request to the Supabase Auth server, so the returned value is
 * authentic" — the alternative, decoding the JWT locally, would mean trusting a
 * string the client handed us. Never cached.
 */
export async function getSessionUser(accessToken: string): Promise<SessionUser | null> {
  if (!publicSupabaseReady) return null

  const result = await restFetch<{ id?: unknown; email?: unknown }>({
    url: authEndpoint("user"),
    apiKey: SUPABASE_ANON_KEY,
    accessToken,
    cache: "no-store",
    timeoutMs: 4000,
  })

  if (!result.ok) {
    if (result.reason !== "unauthorized") logRestFailure("auth/v1/user", result)
    return null
  }

  const id = result.data?.id
  if (typeof id !== "string" || id.length === 0) return null
  return { id, email: typeof result.data?.email === "string" ? result.data.email : null }
}

export type SavedItem = { name: string; savedAt: string | null }

/**
 * The caller's saved items, newest first.
 *
 * `user_id=eq.<id>` is redundant — `saves_select_own` already limits the result to
 * `auth.uid()`. It is here as a second lock: if RLS were ever disabled on the
 * table by accident, the filter still scopes the query. The id it filters on comes
 * from `getSessionUser`, i.e. from the Auth server, never from the request body.
 */
export async function listSaves(
  accessToken: string,
  userId: string,
): Promise<SavesResult<SavedItem[]>> {
  if (!publicSupabaseReady) return { ok: false, reason: "unconfigured" }

  const result = await userRest<{ item_name: string; created_at: string | null }[]>(
    accessToken,
    `saves?select=item_name,created_at&user_id=eq.${encodeURIComponent(userId)}&order=created_at.desc&limit=500`,
    { cache: "no-store", timeoutMs: 4000 },
  )

  if (!result.ok) {
    if (result.reason === "unauthorized") return { ok: false, reason: "unauthorized" }
    logRestFailure("list saves", result)
    return { ok: false, reason: "error" }
  }

  const rows = result.data ?? []
  return {
    ok: true,
    // Items retired from the registry stay in the table but stop being listed —
    // the registry decides what exists.
    data: rows
      .filter((row) => Boolean(getItem(row.item_name)))
      .map((row) => ({ name: row.item_name, savedAt: row.created_at })),
  }
}

/**
 * Save one item. Idempotent: a repeat save hits the `(user_id, item_name)` primary
 * key and comes back 409, which is reported as success rather than as an error.
 *
 * `user_id` is deliberately absent from the payload. The column default is
 * `auth.uid()`, so the database fills it from the token, and `saves_insert_own`
 * rejects the row if it somehow does not match.
 *
 * A plain insert, not an upsert: PostgREST's `resolution=merge-duplicates` maps to
 * `ON CONFLICT DO UPDATE`, which would need an UPDATE policy on a table that has
 * nothing mutable about it.
 */
export async function addSave(accessToken: string, name: string): Promise<SavesResult<null>> {
  if (!getItem(name)) return { ok: false, reason: "unknown-item" }
  if (!publicSupabaseReady) return { ok: false, reason: "unconfigured" }

  const result = await userRest<null>(accessToken, "saves", {
    method: "POST",
    body: [{ item_name: name }],
    prefer: "return=minimal",
    cache: "no-store",
    timeoutMs: 4000,
  })

  if (result.ok) return { ok: true, data: null }
  if (result.status === 409) return { ok: true, data: null }
  if (result.reason === "unauthorized") return { ok: false, reason: "unauthorized" }
  logRestFailure("add save", result)
  return { ok: false, reason: "error" }
}

/**
 * Remove one item. Idempotent — deleting something that is not there is a 204.
 *
 * The filters are not optional: PostgREST treats an unfiltered DELETE as "every
 * row you are allowed to touch", so a missing `item_name` here would empty the
 * caller's whole library.
 */
export async function removeSave(
  accessToken: string,
  userId: string,
  name: string,
): Promise<SavesResult<null>> {
  if (!getItem(name)) return { ok: false, reason: "unknown-item" }
  if (!publicSupabaseReady) return { ok: false, reason: "unconfigured" }

  const result = await userRest<null>(
    accessToken,
    `saves?item_name=eq.${encodeURIComponent(name)}&user_id=eq.${encodeURIComponent(userId)}`,
    { method: "DELETE", prefer: "return=minimal", cache: "no-store", timeoutMs: 4000 },
  )

  if (result.ok) return { ok: true, data: null }
  if (result.reason === "unauthorized") return { ok: false, reason: "unauthorized" }
  logRestFailure("remove save", result)
  return { ok: false, reason: "error" }
}
