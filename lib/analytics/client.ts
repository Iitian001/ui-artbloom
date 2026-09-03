"use client"

/**
 * The browser side of the backend: four calls, all of them to this site's own
 * `/api` routes, none of them to Supabase.
 *
 * WHY THERE IS NO SUPABASE CLIENT HERE, AND NO TOKEN EITHER.
 * The session lives in httpOnly cookies written server-side by
 * `app/(site)/(auth)/auth.ts` after a GitHub PKCE round trip. `httpOnly` means
 * this file cannot read the access token — deliberately, and that is the argument
 * for the design: a token in `localStorage` is readable by every script that ends
 * up on the page, including one that arrives through a dependency six levels down.
 * So the browser holds no credential at all. It sends the request; the cookie
 * rides along because of `credentials: "same-origin"`, and the route handler on
 * the other end verifies it against the Supabase Auth server.
 *
 * The anon key would be *safe* to use from here — everything it reaches is gated
 * by row level security in `supabase/schema.sql` — but calling PostgREST directly
 * would skip the two checks the API routes exist to make: that the token is real
 * (asked of the Auth server, not decoded locally) and that the item name is one of
 * the 17 in `lib/registry/items.ts`.
 *
 * `"use client"` is here so importing this from a Server Component is a build
 * error rather than a runtime one.
 *
 * Nothing below reads `NEXT_PUBLIC_SUPABASE_*` to decide whether the backend is
 * configured, on purpose. Those values are inlined into this bundle at build time,
 * while the server reads its own at request time; gating on the build-time copy
 * would mean a deploy whose keys were pasted in afterwards silently dropped real
 * data. The server is the only honest authority on "is this configured", and its
 * answer for an unconfigured deploy is an empty list and a failed write, which is
 * what these functions return anyway.
 */

/** Same-origin, never cached, and a failure is a value rather than a throw. */
async function call(url: string, init?: RequestInit): Promise<Response | null> {
  try {
    return await fetch(url, {
      ...init,
      // Sends the httpOnly session cookie. Without this the request is anonymous
      // and every save comes back 401.
      credentials: "same-origin",
      cache: "no-store",
    })
  } catch {
    // Offline, DNS, aborted navigation. Not worth a console line on a bookmark.
    return null
  }
}

/**
 * Item names the signed-in user has saved, newest first.
 *
 * An empty array is returned for every non-success — signed out, no keys on the
 * deployment, Supabase down — because a bookmarks list has one sane failure mode
 * and it is "nothing to show", not a stack trace.
 */
export async function fetchSaves(): Promise<string[]> {
  const response = await call("/api/saves")
  if (!response?.ok) return []
  try {
    const payload = (await response.json()) as { saves?: { name?: unknown }[] }
    return (payload.saves ?? [])
      .map((entry) => entry.name)
      .filter((name): name is string => typeof name === "string")
  } catch {
    return []
  }
}

/**
 * True only when the row is actually in the database now.
 *
 * The caller needs that distinction: an optimistic toggle that flips on `false`
 * shows a filled bookmark for something the server refused, and the user finds out
 * on the next page load. Revert on `false`.
 */
async function mutateSave(name: string, method: "POST" | "DELETE"): Promise<boolean> {
  const url = method === "DELETE" ? `/api/saves?name=${encodeURIComponent(name)}` : "/api/saves"
  const response = await call(url, {
    method,
    headers: method === "POST" ? { "Content-Type": "application/json" } : undefined,
    body: method === "POST" ? JSON.stringify({ name }) : undefined,
  })
  return Boolean(response?.ok)
}

export function saveItem(name: string): Promise<boolean> {
  return mutateSave(name, "POST")
}

export function unsaveItem(name: string): Promise<boolean> {
  return mutateSave(name, "DELETE")
}

/**
 * Report an install. Fire and forget — the caller never waits and never sees an
 * error, because a metrics write must not be able to make a copy button feel slow
 * or broken.
 *
 * BE PRECISE ABOUT WHAT THIS MEASURES. Called from a copy-to-clipboard handler it
 * counts *intent to install*: somebody copied a command, which is not the same as
 * running it. Only `cli/src/track.ts`, which posts after the files are on disk,
 * counts an install that happened. Both land in the same column, so pick one
 * meaning for the number on the page and label it to match — or send `runner`
 * from the CLI only and leave the copy button silent.
 */
export function reportInstall(name: string, runner?: string): void {
  if (typeof window === "undefined") return
  try {
    void fetch("/api/track/install", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, runner }),
      // Survives the page being navigated away from immediately afterwards.
      keepalive: true,
      cache: "no-store",
    }).catch(() => {})
  } catch {
    /* never surfaced */
  }
}
