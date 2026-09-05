"use client"

/**
 * The browser side of the backend: three calls, all of them to this site's own
 * `/api/saves` route, none of them to Supabase.
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
 * (asked of the Auth server, not decoded locally) and that the item name is one
 * `lib/registry/items.ts` actually declares. How many that is deliberately does not
 * appear here; it changes whenever an item is added.
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

/*
 * No `reportInstall()` here any more.
 *
 * It posted `{name, runner}` to `/api/track/install` from the browser and nothing
 * ever called it. Its own comment set out the reason it should not be called:
 * fired from a copy-to-clipboard handler it would count *intent* to install —
 * somebody copied a command — into the same column `cli/src/track.ts` fills after
 * the files are actually on disk, leaving one number with two meanings and no way
 * to separate them afterwards.
 *
 * So the CLI is the only thing that moves that counter, which is what
 * `app/(site)/privacy/page.tsx` now tells the reader, and what makes the number
 * mean one thing. A copy button that wants to be counted needs its own column, not
 * this one.
 */
