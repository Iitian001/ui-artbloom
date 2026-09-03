import "server-only"

import { revalidateTag } from "next/cache"

import { ITEMS } from "@/lib/registry"

import { COUNTS_REVALIDATE_SECONDS, COUNTS_TAG, publicSupabaseReady } from "./env"
import { logRestFailure } from "./rest"
import { publicRest } from "./server"

/**
 * Reading the counters.
 *
 * WHAT HAPPENS BEFORE THE KEYS ARE PASTED IN: `publicSupabaseReady` is false, no
 * request is made, and every number comes from `lib/registry/items.ts`. The site
 * builds, deploys and renders exactly as it does today. The same path is taken if
 * Supabase is configured but down, slow, or returns garbage.
 *
 * THE FALLBACK IS PER ITEM, NOT GLOBAL. An item with a row in `public.items`
 * shows its real count; an item without one shows its seed number from the
 * registry. That normally risks one rail mixing a real 3 with a seeded 12,480,
 * which would make "popular" sort two different kinds of number — but not here:
 * every one of the 17 entries in `lib/registry/items.ts` currently carries
 * `installs: 0` and `bookmarks: 0`, so the seed path renders honest zeroes and
 * there is nothing to un-seed before switching Supabase on. `ItemCounts.source`
 * is exposed anyway, so the UI can label or hide a number it did not get from the
 * database, and so this stays true if somebody hand-writes a seed number later.
 */
export type ItemCounts = {
  installs: number
  saves: number
  /** `"seed"` means this number is from lib/registry/items.ts, not from the database. */
  source: "live" | "seed"
}

/** `installs` and `saves` are `bigint`; some PostgREST versions serialise those as strings. */
type CountRow = { name: string; installs: number | string | null; saves: number | string | null }

function toCount(value: number | string | null | undefined): number {
  const parsed = typeof value === "string" ? Number.parseInt(value, 10) : value
  return typeof parsed === "number" && Number.isFinite(parsed) && parsed >= 0 ? Math.trunc(parsed) : 0
}

/**
 * Cached for `COUNTS_REVALIDATE_SECONDS`, so a page that shows counts stays
 * prerenderable and the database is not queried per visitor. No `timeoutMs` here
 * on purpose: passing an `AbortSignal` to `fetch` opts the request out of Next's
 * per-render memoization, and this is the one call that wants to be cached.
 */
async function fetchCountRows(): Promise<CountRow[] | null> {
  if (!publicSupabaseReady) return null

  const result = await publicRest<CountRow[]>("items?select=name,installs,saves&order=name", {
    cache: "force-cache",
    next: { revalidate: COUNTS_REVALIDATE_SECONDS, tags: [COUNTS_TAG] },
  })

  if (!result.ok) {
    logRestFailure("read item counts", result)
    return null
  }
  return result.data ?? []
}

/** The seed numbers. `bookmarks` in the registry is the same idea as `saves` in the database. */
function seedCounts(name: string): ItemCounts {
  const item = ITEMS.find((candidate) => candidate.name === name)
  return { installs: item?.installs ?? 0, saves: item?.bookmarks ?? 0, source: "seed" }
}

/**
 * Counts for every item in the registry, keyed by name.
 *
 * Rows in `public.items` whose name is not in the registry any more (a renamed or
 * retired item) are ignored rather than surfaced: the registry decides what
 * exists, the database only decides how many.
 */
export async function getItemCounts(): Promise<Map<string, ItemCounts>> {
  const rows = await fetchCountRows()
  const live = new Map<string, CountRow>()
  for (const row of rows ?? []) live.set(row.name, row)

  const counts = new Map<string, ItemCounts>()
  for (const item of ITEMS) {
    const row = live.get(item.name)
    counts.set(
      item.name,
      row
        ? { installs: toCount(row.installs), saves: toCount(row.saves), source: "live" }
        : seedCounts(item.name),
    )
  }
  return counts
}

/** One item. Same fallback rules as `getItemCounts`. */
export async function getCountsFor(name: string): Promise<ItemCounts> {
  const counts = await getItemCounts()
  return counts.get(name) ?? seedCounts(name)
}

/**
 * The marketing total. Mirrors `totalInstalls()` in `lib/registry/index.ts` but
 * over live numbers where they exist — so the two will disagree once Supabase is
 * on, and this is the one to show.
 */
export async function getTotalInstalls(): Promise<number> {
  const counts = await getItemCounts()
  let total = 0
  for (const value of counts.values()) total += value.installs
  return total
}

/** True when at least one number on the page came from the database. */
export async function hasLiveCounts(): Promise<boolean> {
  const counts = await getItemCounts()
  for (const value of counts.values()) if (value.source === "live") return true
  return false
}

/**
 * Drop the cached counters now.
 *
 * Deliberately not called from `/api/track/install`: invalidating on every
 * install would mean a database round trip per page view under any real traffic,
 * and nobody needs an install count that is fresher than
 * `COUNTS_REVALIDATE_SECONDS`. Call it from a deploy hook or a cron job if you
 * ever need the numbers to jump immediately.
 *
 * The `"max"` profile is stale-while-revalidate: readers keep getting the old
 * number while the new one is fetched, instead of one request blocking on the
 * database. The single-argument form of `revalidateTag` is deprecated in this
 * version of Next.
 */
export function revalidateCounts(): void {
  revalidateTag(COUNTS_TAG, "max")
}
