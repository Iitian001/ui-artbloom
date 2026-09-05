import { cookies, headers } from "next/headers"
import { cache } from "react"

import { siteOrigin } from "@/lib/brand"
import {
  authEndpoint,
  publicSupabaseReady,
  restEndpoint,
  SUPABASE_ANON_KEY,
} from "@/lib/analytics/env"
import { logRestFailure, restFetch } from "@/lib/analytics/rest"

/**
 * GitHub sign-in against Supabase Auth: PKCE out, session in httpOnly cookies.
 *
 * Why raw GoTrue calls instead of `@supabase/ssr`: that package is not in this
 * repo's node_modules and package.json belongs to another workstream, so a
 * static import would fail `next build` today. The whole flow is the four
 * requests below, and none of them ever runs in the browser. Both the project
 * config and the transport are shared with `lib/analytics/` rather than
 * re-derived here, so there is one place where "is Supabase configured" is
 * decided. Replacing this file with `createServerClient()` later is a
 * single-file change — the rest of the app only ever sees `readSession()`,
 * `restSelect()` and the actions.
 *
 * With no keys set every entry point resolves to `unconfigured`, so /login,
 * /signup and /bookmarks still render and the site still builds.
 */

/** A hung auth service must not hold a page render open indefinitely. */
const READ_TIMEOUT_MS = 4000
/** Token exchanges carry a provider round trip, so they get longer. */
const WRITE_TIMEOUT_MS = 8000

/**
 * The httpOnly cookie the raw Supabase access token lives in.
 *
 * Exported because `lib/analytics/saves.ts` reads it to authenticate the site's
 * own `/api/saves` routes: it is the one cookie another server module has a
 * reason to know about, and a duplicated string literal there would break
 * silently if this one were ever renamed. The refresh token and the PKCE
 * verifier stay private — nothing outside this file has any business with them.
 */
export const ACCESS_COOKIE = "ab-access"
const REFRESH_COOKIE = "ab-refresh"
const VERIFIER_COOKIE = "ab-verifier"

/** Where Supabase sends the browser back after GitHub. */
export const CALLBACK_PATH = "/auth/callback"

type CookieStore = Awaited<ReturnType<typeof cookies>>

/** True when the project URL and anon key are both present. */
export function isAuthConfigured() {
  return publicSupabaseReady
}

export type AuthUser = {
  id: string
  email?: string
  /** GitHub login, when the provider sent one. */
  handle?: string
  name?: string
  avatar?: string
}

export type SessionState =
  /** No Supabase keys in the environment — nothing to sign in to yet. */
  | { status: "unconfigured" }
  | { status: "signed-out" }
  /** Access token aged out, but the refresh token is still here. */
  | { status: "expired" }
  /** Keys are set and the auth service did not answer. Not the same as signed out. */
  | { status: "unreachable" }
  | { status: "signed-in"; user: AuthUser }

/* ------------------------------------------------------------------ cookies */

function cookieOptions() {
  return {
    httpOnly: true,
    // `lax` and not `strict`: the session cookie has to survive the browser
    // arriving back here from github.com by way of the Supabase project.
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
  }
}

type TokenResponse = {
  access_token?: string
  refresh_token?: string
  expires_in?: number
}

/**
 * A token pair that has already been checked. Taking non-optional strings means
 * an empty session cookie cannot be written by accident — anything reading
 * `ACCESS_COOKIE` can treat a present cookie as a token worth sending.
 */
type SessionTokens = { access: string; refresh: string; expiresIn?: number }

const FALLBACK_ACCESS_SECONDS = 3600
const REFRESH_COOKIE_SECONDS = 60 * 60 * 24 * 30

function writeSession(store: CookieStore, tokens: SessionTokens) {
  store.set(ACCESS_COOKIE, tokens.access, {
    ...cookieOptions(),
    maxAge: tokens.expiresIn ?? FALLBACK_ACCESS_SECONDS,
  })
  store.set(REFRESH_COOKIE, tokens.refresh, {
    ...cookieOptions(),
    maxAge: REFRESH_COOKIE_SECONDS,
  })
}

function clearSession(store: CookieStore) {
  store.delete(ACCESS_COOKIE)
  store.delete(REFRESH_COOKIE)
  store.delete(VERIFIER_COOKIE)
}

/* --------------------------------------------------------------------- PKCE */

/** 64 random bytes -> 86 base64url chars, inside RFC 7636's 43..128. */
const VERIFIER_BYTES = 64

function base64url(bytes: Uint8Array) {
  let binary = ""
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
}

async function challengeFor(verifier: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(verifier))
  return base64url(new Uint8Array(digest))
}

/* ------------------------------------------------------------------ redirect */

/**
 * Only same-origin paths are ever echoed back into a redirect. Anything else —
 * an absolute URL, a protocol-relative `//host`, a backslash trick — is dropped
 * rather than sanitised, so this cannot become an open redirect.
 */
export function safePath(next: string | null | undefined): string | null {
  if (!next || next.length > 512) return null
  if (!next.startsWith("/")) return null
  if (next.startsWith("//") || next.startsWith("/\\")) return null
  // A control character is not part of any path, and letting one through costs a
  // 500: a redirect is returned as `new Headers({ Location: url })` (see
  // next/dist/server/route-modules/app-route/module.js), and a CR, LF or NUL in
  // a header value throws there. `?next=` arrives percent-decoded, so `%0A` is a
  // real newline by the time it reaches this function.
  for (let i = 0; i < next.length; i += 1) {
    const code = next.charCodeAt(i)
    if (code < 0x20 || code === 0x7f) return null
  }
  return next
}

/** First value of a `searchParams` entry, which may be repeated in the URL. */
export function queryValue(value: string | string[] | undefined): string | null {
  if (Array.isArray(value)) return value[0] ?? null
  return value ?? null
}

/**
 * The origin to hand Supabase as `redirect_to`. Taken from the request so
 * preview deployments come back to themselves, with the build-time origin as a
 * fallback. Whichever it resolves to must be in the project's allow-list.
 */
async function requestOrigin() {
  const incoming = await headers()
  const host = incoming.get("x-forwarded-host") ?? incoming.get("host")
  if (!host) return siteOrigin
  const forwarded = (incoming.get("x-forwarded-proto") ?? "").split(",")[0]?.trim()
  const local = host.startsWith("localhost") || host.startsWith("127.0.0.1")
  return `${forwarded || (local ? "http" : "https")}://${host}`
}

/* ------------------------------------------------------------------ sign in */

/**
 * Start the round trip. Stashes the PKCE verifier in an httpOnly cookie and
 * returns the provider URL to send the browser to, or null when unconfigured.
 * Sets a cookie, so it can only be called from a Server Action or Route Handler.
 */
export async function githubAuthorizeUrl(next: string | null): Promise<string | null> {
  const endpoint = authEndpoint("authorize")
  if (!endpoint || !publicSupabaseReady) return null

  const verifier = base64url(crypto.getRandomValues(new Uint8Array(VERIFIER_BYTES)))
  const store = await cookies()
  store.set(VERIFIER_COOKIE, verifier, { ...cookieOptions(), maxAge: 600 })

  const callback = new URL(CALLBACK_PATH, await requestOrigin())
  const target = safePath(next)
  if (target) callback.searchParams.set("next", target)

  const authorize = new URL(endpoint)
  authorize.searchParams.set("provider", "github")
  authorize.searchParams.set("redirect_to", callback.toString())
  authorize.searchParams.set("code_challenge", await challengeFor(verifier))
  authorize.searchParams.set("code_challenge_method", "s256")
  return authorize.toString()
}

export type ExchangeResult = { ok: true } | { ok: false; reason: string }

/** Trade the one-time code for a session. Callback route only — writes cookies. */
export async function completeGitHubSignIn(code: string): Promise<ExchangeResult> {
  if (!publicSupabaseReady) return { ok: false, reason: "unconfigured" }

  const store = await cookies()
  const verifier = store.get(VERIFIER_COOKIE)?.value
  if (!verifier) return { ok: false, reason: "stale-request" }

  const result = await restFetch<TokenResponse>({
    url: authEndpoint("token?grant_type=pkce"),
    apiKey: SUPABASE_ANON_KEY,
    method: "POST",
    body: { auth_code: code, code_verifier: verifier },
    cache: "no-store",
    timeoutMs: WRITE_TIMEOUT_MS,
  })

  if (!result.ok) {
    // Network-level failure stored nothing, so a retry is safe. A rejected
    // exchange is final: the code is spent either way.
    const transport = result.reason === "network" || result.reason === "timeout"
    return { ok: false, reason: transport ? "unreachable" : "exchange-failed" }
  }

  const tokens = result.data
  if (!tokens?.access_token || !tokens.refresh_token) {
    return { ok: false, reason: "exchange-failed" }
  }

  store.delete(VERIFIER_COOKIE)
  writeSession(store, {
    access: tokens.access_token,
    refresh: tokens.refresh_token,
    expiresIn: tokens.expires_in,
  })
  return { ok: true }
}

/**
 * Swap the refresh token for a fresh access token. Server Action only — writes
 * cookies, which a render cannot do. A rejected refresh clears the session
 * instead of leaving a token that will be rejected on every later request.
 */
export async function refreshStoredSession(): Promise<boolean> {
  if (!publicSupabaseReady) return false

  const store = await cookies()
  const refreshToken = store.get(REFRESH_COOKIE)?.value
  if (!refreshToken) return false

  const result = await restFetch<TokenResponse>({
    url: authEndpoint("token?grant_type=refresh_token"),
    apiKey: SUPABASE_ANON_KEY,
    method: "POST",
    body: { refresh_token: refreshToken },
    cache: "no-store",
    timeoutMs: WRITE_TIMEOUT_MS,
  })

  if (!result.ok) {
    // Leave the cookies alone when the service was simply unreachable: the
    // token may still be good. A refused refresh will be refused forever.
    if (result.reason === "network" || result.reason === "timeout") return false
    clearSession(store)
    return false
  }

  const tokens = result.data
  if (!tokens?.access_token || !tokens.refresh_token) {
    clearSession(store)
    return false
  }

  writeSession(store, {
    access: tokens.access_token,
    refresh: tokens.refresh_token,
    expiresIn: tokens.expires_in,
  })
  return true
}

/** Revoke the session upstream, then drop the cookies either way. */
export async function endSession() {
  const store = await cookies()
  const accessToken = store.get(ACCESS_COOKIE)?.value

  if (publicSupabaseReady && accessToken) {
    // A failed revoke must not trap someone in a session they asked to leave,
    // so the result is deliberately unread.
    await restFetch({
      url: authEndpoint("logout?scope=local"),
      apiKey: SUPABASE_ANON_KEY,
      method: "POST",
      accessToken,
      cache: "no-store",
      timeoutMs: WRITE_TIMEOUT_MS,
    })
  }

  clearSession(store)
}

/* ------------------------------------------------------------------- reading */

type RawUser = {
  id?: unknown
  email?: unknown
  user_metadata?: Record<string, unknown>
}

function text(value: unknown) {
  return typeof value === "string" && value.length > 0 ? value : undefined
}

function toUser(raw: RawUser): AuthUser | null {
  const id = text(raw.id)
  if (!id) return null
  const meta = raw.user_metadata ?? {}
  return {
    id,
    email: text(raw.email),
    handle: text(meta.user_name) ?? text(meta.preferred_username),
    name: text(meta.full_name) ?? text(meta.name),
    avatar: text(meta.avatar_url),
  }
}

/**
 * Who the caller is, asked of the auth service rather than decoded here, so a
 * revoked token reads as revoked. Memoised per render pass, so the page and the
 * panel inside it cost one request between them.
 */
export const readSession = cache(async (): Promise<SessionState> => {
  if (!publicSupabaseReady) return { status: "unconfigured" }

  const store = await cookies()
  const accessToken = store.get(ACCESS_COOKIE)?.value
  const resumable = Boolean(store.get(REFRESH_COOKIE)?.value)
  if (!accessToken) return { status: resumable ? "expired" : "signed-out" }

  const result = await restFetch<RawUser>({
    url: authEndpoint("user"),
    apiKey: SUPABASE_ANON_KEY,
    accessToken,
    cache: "no-store",
    timeoutMs: READ_TIMEOUT_MS,
  })

  if (!result.ok) {
    if (result.reason === "unauthorized") {
      return { status: resumable ? "expired" : "signed-out" }
    }
    return { status: "unreachable" }
  }

  const user = result.data ? toUser(result.data) : null
  return user ? { status: "signed-in", user } : { status: "unreachable" }
})

/**
 * One authenticated read from the project's REST API.
 *
 * The caller's own access token goes on the request, so row-level security in
 * Postgres — not this function — decides which rows come back. `null` means the
 * read did not happen (no keys, no session, table missing, network); an empty
 * array means the caller genuinely has no rows.
 */
export async function restSelect<T>(query: string): Promise<T[] | null> {
  if (!publicSupabaseReady) return null

  const store = await cookies()
  const accessToken = store.get(ACCESS_COOKIE)?.value
  if (!accessToken) return null

  const result = await restFetch<T[]>({
    url: restEndpoint(query),
    apiKey: SUPABASE_ANON_KEY,
    accessToken,
    cache: "no-store",
    timeoutMs: READ_TIMEOUT_MS,
  })

  /**
   * A failed read is logged before it is flattened to `null`.
   *
   * `null` is all the caller needs — /bookmarks renders the same "Try again"
   * either way — but the operator needs to tell the cases apart, and this is the
   * read that fails when `supabase/schema.sql` has not been applied. Without the
   * line, a missing table and a network blip both left exactly no trace.
   * `logRestFailure` stays quiet on `unconfigured`, which is the ordinary state
   * of a deploy with no keys, and never prints a credential.
   */
  if (!result.ok) {
    logRestFailure(`restSelect ${query.split("?")[0]}`, result)
    return null
  }
  return Array.isArray(result.data) ? result.data : null
}
