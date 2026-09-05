import { ALL_CATEGORIES, CATEGORY_GROUPS, isKind, type Kind } from "@/lib/categories"

import { ITEMS } from "./items"
import type { Author, RegistryItem } from "./schema"

export type {
  Author,
  CssBlock,
  CssValue,
  RegistryAsset,
  RegistryItem,
  RegistryFile,
  RegistryPayload,
} from "./schema"
export { ITEMS, AUTHORS } from "./items"
export { cssText } from "./css"

const BY_NAME = new Map(ITEMS.map((item) => [item.name, item]))

export function getItem(name: string): RegistryItem | undefined {
  return BY_NAME.get(name)
}

export function itemsByKind(kind: Kind) {
  return ITEMS.filter((item) => item.kind === kind)
}

export function itemsByCategory(kind: Kind, slug: string) {
  return ITEMS.filter((item) => item.kind === kind && item.categories.includes(slug))
}

/** Derived, never hand-written: a category can only advertise what exists. */
export function categoryCount(kind: Kind, slug: string) {
  return itemsByCategory(kind, slug).length
}

export function kindCount(kind: Kind) {
  return itemsByKind(kind).length
}

/**
 * The kinds a visitor can browse, in nav order. Derived, never hand-written: a
 * kind with nothing in it is not a catalogue with an empty state, it reads as a
 * broken site — so `/community/{kind}` 404s until something lands in it, and
 * comes back on its own when something does.
 */
export function browsableKinds(): Kind[] {
  return CATEGORY_GROUPS.map((group) => group.kind).filter((kind) => kindCount(kind) > 0)
}

/** Route guard for `/community/{kind}` and everything under it. */
export function isBrowsableKind(value: string): value is Kind {
  return isKind(value) && kindCount(value) > 0
}

/** Categories in a kind that actually have items, most populated first. */
export function populatedCategories(kind: Kind) {
  return ALL_CATEGORIES.filter((c) => c.kind === kind && categoryCount(kind, c.slug) > 0).sort(
    (a, b) => categoryCount(kind, b.slug) - categoryCount(kind, a.slug),
  )
}

const byDateDesc = (a: RegistryItem, b: RegistryItem) =>
  (b.updatedAt ?? b.createdAt).localeCompare(a.updatedAt ?? a.createdAt)

export function newest(limit?: number, kind?: Kind) {
  const pool = kind ? itemsByKind(kind) : ITEMS
  const sorted = [...pool].sort(byDateDesc)
  return limit ? sorted.slice(0, limit) : sorted
}

/*
 * No `popular()` here any more.
 *
 * It sorted by `item.installs`, a field every entry declared as `0` — so the
 * comparator returned 0 for every pair and the "result" was whatever order
 * `items.ts` happens to list things in, presented to the visitor as a ranking.
 * Its two callers (the /bookmarks rail and the catalogue's third tab) now sort by
 * date, which is a real signal this repo actually has. See the note in
 * `schema.ts` for where the true counts live and what it would take to rank by
 * them.
 */

/** Hand-picked via `featured: true`. Newest first — nothing here is ranked. */
export function featured(limit?: number, kind?: Kind) {
  const pool = (kind ? itemsByKind(kind) : ITEMS).filter((item) => item.featured)
  const sorted = [...pool].sort(byDateDesc)
  return limit ? sorted.slice(0, limit) : sorted
}

/**
 * "Reshuffled daily" — a deterministic daily shuffle so SSR and the client agree,
 * and so the order is stable for a whole day. Purely positional: the seed is the
 * item's index and the day, which is the only honest thing to shuffle by.
 */
export function reshuffled(limit?: number, kind?: Kind) {
  const pool = kind ? itemsByKind(kind) : ITEMS
  const day = Math.floor(Date.now() / 86_400_000)
  const scored = pool.map((item, i) => {
    const seed = (day * 9301 + (i + 1) * 49297) % 233280
    return { item, score: seed / 233280 }
  })
  scored.sort((a, b) => b.score - a.score)
  const out = scored.map((s) => s.item)
  return limit ? out.slice(0, limit) : out
}

export function search(query: string, kind?: Kind) {
  const q = query.trim().toLowerCase()
  if (!q) return kind ? itemsByKind(kind) : ITEMS
  const pool = kind ? itemsByKind(kind) : ITEMS
  return pool.filter((item) =>
    [item.title, item.name, item.description, item.author.name, ...item.categories]
      .join(" ")
      .toLowerCase()
      .includes(q),
  )
}

/** Everyone with something in the catalogue, most items first. */
export function allAuthors(): (Author & { count: number })[] {
  const map = new Map<string, Author & { count: number }>()
  for (const item of ITEMS) {
    const existing = map.get(item.author.handle)
    if (existing) {
      existing.count += 1
    } else {
      map.set(item.author.handle, { ...item.author, count: 1 })
    }
  }
  return [...map.values()].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
}

export function getAuthor(handle: string) {
  return allAuthors().find((a) => a.handle === handle)
}

export function itemsByAuthor(handle: string) {
  return ITEMS.filter((item) => item.author.handle === handle).sort(byDateDesc)
}

/** Resolve `registryDependencies` transitively, in install order. */
export function resolveTree(name: string, seen = new Set<string>()): RegistryItem[] {
  const item = getItem(name)
  if (!item || seen.has(name)) return []
  seen.add(name)
  const deps = (item.registryDependencies ?? []).flatMap((dep) => resolveTree(dep, seen))
  return [...deps, item]
}

/**
 * Other items a visitor is likely to want next: shared categories first, then
 * same kind, then recency as the tiebreak. The tiebreak used to be
 * `other.installs / 1_000_000`, which was zero for every item and therefore
 * decided nothing.
 */
export function relatedItems(item: RegistryItem, limit = 6) {
  return ITEMS.filter((other) => other.name !== item.name)
    .map((other) => {
      const shared = other.categories.filter((c) => item.categories.includes(c)).length
      const sameKind = other.kind === item.kind ? 1 : 0
      return { other, score: shared * 3 + sameKind }
    })
    .sort((a, b) => b.score - a.score || byDateDesc(a.other, b.other))
    .slice(0, limit)
    .map((s) => s.other)
}
