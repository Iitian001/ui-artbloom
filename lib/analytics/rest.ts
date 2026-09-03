/**
 * The transport for every Supabase call in this directory.
 *
 * There is no `@supabase/supabase-js` in this project's dependencies, and adding
 * one is not this change's to make (see `needsOtherFile` in the handoff). The
 * REST surface is small enough to hit directly with `fetch`: PostgREST under
 * `/rest/v1/`, GoTrue under `/auth/v1/`, both keyed by an `apikey` header plus an
 * optional `Authorization: Bearer <jwt>`.
 *
 * The one rule this file exists to enforce: **nothing here ever throws.** Every
 * failure — missing env vars, a 500 from Supabase, a timeout, malformed JSON —
 * comes back as a value. A counter that cannot be read must degrade to the seed
 * number in `lib/registry/items.ts`, not take a page down with it.
 */

export type RestFailure =
  /** No `NEXT_PUBLIC_SUPABASE_URL` / key in the environment yet. Expected state. */
  | "unconfigured"
  /** Missing or rejected credentials — a 401 or 403 from Supabase. */
  | "unauthorized"
  /** We gave up waiting. */
  | "timeout"
  /** DNS, TLS, socket. */
  | "network"
  /** Reached Supabase, got a non-2xx. */
  | "http"
  /** Reached Supabase, got something that was not the JSON we expected. */
  | "parse"

export type RestResult<T> =
  /** `data` is `null` for a 204 or a `Prefer: return=minimal` write — success, no body. */
  | { ok: true; status: number; data: T | null }
  | { ok: false; status: number; reason: RestFailure; message: string }

export type RestRequest = {
  /** Absolute URL from `restEndpoint()` / `authEndpoint()`, or undefined when unconfigured. */
  url: string | undefined
  /** Anon key for RLS-respecting calls, service role key for privileged ones. */
  apiKey: string | undefined
  method?: "GET" | "POST" | "PATCH" | "DELETE"
  /** A user's access token. Sent as the bearer so PostgREST applies RLS as them. */
  accessToken?: string
  body?: unknown
  /** PostgREST `Prefer` header, e.g. `return=representation`. */
  prefer?: string
  /**
   * Abort after this many ms. Only set it on request-time paths: passing a signal
   * to `fetch` opts the request out of Next's per-render memoization, which is
   * exactly what you do not want on the cached read path.
   */
  timeoutMs?: number
  /** Next.js cache options. Left off means uncached, which is the default in 16. */
  cache?: RequestCache
  next?: { revalidate?: number | false; tags?: string[] }
}

const DEFAULT_TIMEOUT_MS = 4000

/** Cap an error body before it reaches a log. Supabase can return a whole page. */
async function safeText(response: Response): Promise<string> {
  try {
    const text = (await response.text()).trim().slice(0, 400)
    return text || response.statusText || `HTTP ${response.status}`
  } catch {
    return response.statusText || `HTTP ${response.status}`
  }
}

export async function restFetch<T>(request: RestRequest): Promise<RestResult<T>> {
  const { url, apiKey } = request

  if (!url || !apiKey) {
    return { ok: false, status: 0, reason: "unconfigured", message: "Supabase env vars are not set" }
  }

  const headers: Record<string, string> = {
    apikey: apiKey,
    // Supabase expects both. With no user token the api key doubles as the
    // bearer, which is how PostgREST decides the request runs as `anon`.
    Authorization: `Bearer ${request.accessToken ?? apiKey}`,
    Accept: "application/json",
  }
  if (request.body !== undefined) headers["Content-Type"] = "application/json"
  if (request.prefer) headers["Prefer"] = request.prefer

  const controller = request.timeoutMs === undefined ? undefined : new AbortController()
  const timer =
    controller === undefined
      ? undefined
      : setTimeout(() => controller.abort(), request.timeoutMs ?? DEFAULT_TIMEOUT_MS)

  try {
    const response = await fetch(url, {
      method: request.method ?? "GET",
      headers,
      body: request.body === undefined ? undefined : JSON.stringify(request.body),
      cache: request.cache,
      next: request.next,
      signal: controller?.signal,
    })

    if (!response.ok) {
      return {
        ok: false,
        status: response.status,
        reason: response.status === 401 || response.status === 403 ? "unauthorized" : "http",
        message: await safeText(response),
      }
    }

    if (response.status === 204) return { ok: true, status: response.status, data: null }

    const text = await response.text()
    if (!text) return { ok: true, status: response.status, data: null }

    try {
      return { ok: true, status: response.status, data: JSON.parse(text) as T }
    } catch {
      return { ok: false, status: response.status, reason: "parse", message: "response was not JSON" }
    }
  } catch (error) {
    const aborted = error instanceof Error && error.name === "AbortError"
    return {
      ok: false,
      status: 0,
      reason: aborted ? "timeout" : "network",
      message: error instanceof Error ? error.message : String(error),
    }
  } finally {
    if (timer !== undefined) clearTimeout(timer)
  }
}

/**
 * Log a failure without ever logging a credential.
 *
 * `unconfigured` is silent on purpose: it is the normal state of a deploy whose
 * keys have not been pasted yet, and warning about it on every request would
 * bury the failures that matter.
 */
export function logRestFailure(context: string, result: RestResult<unknown>): void {
  if (result.ok || result.reason === "unconfigured") return
  console.warn(`[analytics] ${context} failed (${result.reason}, status ${result.status}): ${result.message}`)
}

/** PostgREST filter value: `?name=eq.<value>`. */
export function eq(value: string): string {
  return `eq.${encodeURIComponent(value)}`
}
