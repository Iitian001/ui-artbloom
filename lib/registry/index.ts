import { ALL_CATEGORIES, CATEGORY_GROUPS, isKind, type Kind } from "@/lib/categories"

import { ITEMS } from "./items"
import type { Author, RegistryItem } from "./schema"

export type {
  Author,
  RegistryAsset,
  RegistryItem,
  RegistryFile,
  RegistryPayload,
} from "./schema"
export { ITEMS, AUTHORS } from "./items"

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

export function popular(limit?: number, kind?: Kind) {
  const pool = kind ? itemsByKind(kind) : ITEMS
  const sorted = [...pool].sort((a, b) => b.installs - a.installs)
  return limit ? sorted.slice(0, limit) : sorted
}

export function featured(limit?: number, kind?: Kind) {
  const pool = (kind ? itemsByKind(kind) : ITEMS).filter((item) => item.featured)
  const sorted = [...pool].sort((a, b) => b.installs - a.installs)
  return limit ? sorted.slice(0, limit) : sorted
}

/**
 * "Ranked for you and reshuffled daily" — a deterministic daily shuffle so SSR
 * and the client agree, and so the order is stable for a whole day.
 */
export function reshuffled(limit?: number, kind?: Kind) {
  const pool = kind ? itemsByKind(kind) : ITEMS
  const day = Math.floor(Date.now() / 86_400_000)
  const scored = pool.map((item, i) => {
    const seed = (day * 9301 + (i + 1) * 49297) % 233280
    return { item, score: seed / 233280 + item.installs / 1_000_000 }
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

export function allAuthors(): (Author & { count: number; installs: number })[] {
  const map = new Map<string, Author & { count: number; installs: number }>()
  for (const item of ITEMS) {
    const existing = map.get(item.author.handle)
    if (existing) {
      existing.count += 1
      existing.installs += item.installs
    } else {
      map.set(item.author.handle, { ...item.author, count: 1, installs: item.installs })
    }
  }
  return [...map.values()].sort((a, b) => b.installs - a.installs)
}

export function getAuthor(handle: string) {
  return allAuthors().find((a) => a.handle === handle)
}

export function itemsByAuthor(handle: string) {
  return ITEMS.filter((item) => item.author.handle === handle).sort(byDateDesc)
}

/** Total installs across the catalog — the marketing counter. */
export function totalInstalls() {
  return ITEMS.reduce((sum, item) => sum + item.installs, 0)
}

/** Resolve `registryDependencies` transitively, in install order. */
export function resolveTree(name: string, seen = new Set<string>()): RegistryItem[] {
  const item = getItem(name)
  if (!item || seen.has(name)) return []
  seen.add(name)
  const deps = (item.registryDependencies ?? []).flatMap((dep) => resolveTree(dep, seen))
  return [...deps, item]
}

/** Other items a visitor is likely to want next. */
export function relatedItems(item: RegistryItem, limit = 6) {
  return ITEMS.filter((other) => other.name !== item.name)
    .map((other) => {
      const shared = other.categories.filter((c) => item.categories.includes(c)).length
      const sameKind = other.kind === item.kind ? 1 : 0
      return { other, score: shared * 3 + sameKind + other.installs / 1_000_000 }
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.other)
}
