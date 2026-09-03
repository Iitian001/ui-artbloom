/**
 * Public Supabase configuration and URL builders.
 *
 * Safe to import from anywhere, including a client component: the only variables
 * read here are `NEXT_PUBLIC_`-prefixed, which is the set Next.js inlines into
 * the browser bundle on purpose. The service role key is read in `server.ts`
 * instead, which is `server-only`.
 *
 * Nothing in this file throws or asserts. The site has to build and deploy
 * before any key has been pasted, so "not configured" is a normal state that
 * every caller handles by falling back to the seed numbers in
 * `lib/registry/items.ts`.
 */

/** An unset variable in a `.env` file is often `""`, which is not "set". */
function present(value: string | undefined): string | undefined {
  const trimmed = value?.trim()
  return trimmed ? trimmed : undefined
}

/** Project URL, e.g. `https://abcdefghijkl.supabase.co`. Trailing slash removed. */
export const SUPABASE_URL = present(process.env.NEXT_PUBLIC_SUPABASE_URL)?.replace(/\/+$/, "")

/**
 * The anon key. Public by design — it identifies the project, it does not
 * authorise anything on its own. Everything it can reach is gated by row level
 * security (see `supabase/schema.sql`).
 *
 * TWO NAMES, ONE VALUE. Supabase now issues an `sb_publishable_…` key alongside
 * the legacy `anon` JWT, and the dashboard of a project created today leads with
 * the new one; both are accepted in the `apikey` header and the legacy keys keep
 * working. Reading either variable means whichever name somebody copied into the
 * environment is the one that works, instead of the site reporting itself
 * unconfigured because the value landed under the other spelling. Both have to be
 * written as static `process.env.X` references: that is the form Next inlines into
 * the browser bundle, and a computed key would inline as `undefined`.
 */
export const SUPABASE_ANON_KEY =
  present(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) ??
  present(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)

/** True when the browser-side / RLS-respecting path can be used at all. */
export const publicSupabaseReady = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY)

/** PostgREST: `/rest/v1/<table>` or `/rest/v1/rpc/<function>`. */
export function restEndpoint(path: string): string | undefined {
  if (!SUPABASE_URL) return undefined
  return `${SUPABASE_URL}/rest/v1/${path.replace(/^\/+/, "")}`
}

/** GoTrue: `/auth/v1/user`, `/auth/v1/token`, and friends. */
export function authEndpoint(path: string): string | undefined {
  if (!SUPABASE_URL) return undefined
  return `${SUPABASE_URL}/auth/v1/${path.replace(/^\/+/, "")}`
}

/**
 * Cache tag for the public counters, so a deploy or a cron job can refresh them
 * on demand with `revalidateCounts()` in `counts.ts`.
 */
export const COUNTS_TAG = "artbloom:item-counts"

/** How long a counter may be stale, in seconds. Nobody needs a live install count. */
export const COUNTS_REVALIDATE_SECONDS = 300
