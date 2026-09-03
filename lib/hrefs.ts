import type { RegistryItem } from "@/lib/registry"

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
