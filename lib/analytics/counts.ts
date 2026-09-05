import "server-only"

import { revalidateTag } from "next/cache"

import { ITEMS } from "@/lib/registry"

import { COUNTS_REVALIDATE_SECONDS, COUNTS_TAG, publicSupabaseReady } from "./env"
import { logRestFailure } from "./rest"
import { publicRest } from "./server"

/**
 * Reading the counters.
 *
 * NOTHING IMPORTS THIS YET, AND THAT IS THE CURRENT STATE OF THE FEATURE, NOT AN
 * OVERSIGHT. `/api/track/install` writes real numbers into `public.items` on every
 * install; this is the read side, kept working and kept out of the UI. What used to
 * be on the pages instead was `item.installs`, a literal `0` on every entry in
 * `lib/registry/items.ts`, rendered as a download count on every card and summed
 * into "0 components installed by builders" on the landing page. Those fields are
 * gone (see the note in `lib/registry/schema.ts`), so the site now says nothing
 * about install counts at all — which is the honest position until there is traffic
 * worth showing. Wiring `getItemCounts()` into a card is the change to make then.
 *
 * WHAT HAPPENS BEFORE THE KEYS ARE PASTED IN: `publicSupabaseReady` is false, no
 * request is made, and every number comes back `0` with `source: "unknown"`. The
 * same path is taken if Supabase is configured but down, slow, or returns garbage.
 *
 * THE FALLBACK IS PER ITEM, NOT GLOBAL. An item with a row in `public.items` shows
 * its real count; an item without one is `0`/`"unknown"`. There is no seed number to
 * mix with a real one — the registry carries no counts, so an unknown count is
 * unknown rather than a plausible-looking twelve thousand. `source` is exposed so a
 * caller can hide or label a number it did not get from the database, which is the
 * difference between "nobody has installed this" and "we do not know".
 */
export type ItemCounts = {
  installs: number
  saves: number
  /** `"unknown"` means no row in `public.items`, or the read failed. Not "zero installs". */
  source: "live" | "unknown"
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

/** No row, or no database. Zero, and labelled as not-a-measurement. */
const UNKNOWN: ItemCounts = { installs: 0, saves: 0, source: "unknown" }

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
        : UNKNOWN,
    )
  }
  return counts
}

/** One item. Same fallback rules as `getItemCounts`. */
export async function getCountsFor(name: string): Promise<ItemCounts> {
  const counts = await getItemCounts()
  return counts.get(name) ?? UNKNOWN
}

/**
 * Every install this deployment has recorded, across every item.
 *
 * Only counts rows that exist, so this is a floor, not a total: an item with no row
 * contributes 0 whether it has never been installed or the read failed. Pair it with
 * `hasLiveCounts()` before putting it on a page — a "0" from an unconfigured
 * deployment is the sentence that got the old `totalInstalls()` deleted.
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
