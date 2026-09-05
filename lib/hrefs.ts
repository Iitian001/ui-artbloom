import { isKind } from "@/lib/categories"
import { getItem, type RegistryItem } from "@/lib/registry"

/**
 * Site URLs for authors and items — one source of truth, because the shape is
 * load-bearing and not obvious.
 *
 * Handles are *displayed* with a leading `@` ("@artbloom") but the URL carries
 * the bare handle. That is not a style choice: Next 16's app-route parser
 * classifies any path segment starting with `@` as a parallel-route slot
 * (`parseAppRouteSegment` in `next/dist/shared/lib/router/routes/app.js`) and
 * rejects it during request matching, so `/@artbloom/...` 404s no matter what
 * `[handle]` does with it. Percent-encoding does not help either — the parser
 * decodes the segment before classifying it.
 *
 * So: `@handle` in the UI, `/handle` in the address bar.
 */
export function profileHref(handle: string) {
  return `/${handle}`
}

export function itemHref(item: RegistryItem) {
  return `/${item.author.handle}/${item.kind}/${item.name}`
}

/** Absolute form, for registry payloads and metadata. */
export function itemUrl(origin: string, item: RegistryItem) {
  return `${origin}${itemHref(item)}`
}

/**
 * The inverse of `itemHref`: three URL segments back to the item, or `null`.
 *
 * It lives here because it is the same mapping read backwards, and because two
 * routes need it — `[handle]/[kind]/[slug]/page.tsx` and the `opengraph-image`
 * beside it. When those each had their own copy, an item could in principle have
 * rendered a page and a card that disagreed about which item it was.
 *
 * All three segments have to match, not just the slug. `getItem` is keyed on the
 * install name alone, so without the `kind` and `handle` checks every item would
 * answer to every author's URL and the catalogue would have 38 items reachable at
 * as many paths as there are handles.
 */
export function itemFromParams({
  handle,
  kind,
  slug,
}: {
  handle: string
  kind: string
  slug: string
}): RegistryItem | null {
  // Bare handle only, for the reason above: a leading `@` never reaches a route.
  if (handle.startsWith("@") || !isKind(kind)) return null
  const item = getItem(slug)
  if (!item || item.kind !== kind || item.author.handle !== handle) return null
  return item
}
