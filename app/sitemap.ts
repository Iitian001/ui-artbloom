import type { MetadataRoute } from "next"

import { siteOrigin } from "@/lib/brand"
import { ALL_CATEGORIES } from "@/lib/categories"
import { itemHref, profileHref } from "@/lib/hrefs"
import {
  allAuthors,
  browsableKinds,
  isBrowsableKind,
  ITEMS,
  itemsByAuthor,
  itemsByCategory,
  itemsByKind,
  type RegistryItem,
} from "@/lib/registry"

/**
 * Every indexable URL on the site, derived from the registry rather than listed.
 *
 * The rule this file is kept to: a path appears here only if some route's own
 * `generateStaticParams` would produce it. That is why the kind and category
 * filters are `browsableKinds()` and `isBrowsableKind` — the same predicates
 * `/community/[kind]` and `/community/[kind]/s/[slug]` use to decide whether to
 * 404 — and why nothing here is a literal item path. A sitemap that promises a
 * URL the router refuses is worse than no sitemap.
 *
 * What is deliberately absent:
 *
 * - `/bookmarks`, `/login`, `/signup`. Each carries `robots: { index: false }`;
 *   listing a page you have asked not to be indexed is a contradiction, not a
 *   hedge.
 * - The template mounts (`/monolith-launch`, `/paper-portfolio`, …) and every
 *   `/preview/<name>`. `app/(bare)/layout.tsx` sets `robots: { index: false,
 *   follow: false }` on that whole group, and rightly — they are fixtures whose
 *   content belongs to an invented business, and indexing them would put "reserve
 *   your Monolith" under this domain in competition with the item page that is
 *   actually selling the template. Note that robots.txt does *not* disallow them:
 *   a crawler has to fetch a page to read its noindex.
 * - `changeFrequency` and `priority` on every entry. Google ignores both, and
 *   Bing treats priority as noise; writing them would only invite the question of
 *   whether they are true.
 *
 * `lastModified` is set only where a page's content is derived from the registry,
 * taken from the newest item feeding it. The legal and documentation pages each
 * carry their own revision date in the body, but reading it would mean exporting
 * a constant out of a `page.tsx`, which Next validates against its own list of
 * permitted page exports. An absent `lastmod` is honest; a guessed one is not.
 */

const STATIC_PATHS = ["/docs", "/docs/cli", "/themes", "/license", "/terms", "/privacy"]

function absolute(path: string) {
  return path === "/" ? siteOrigin : `${siteOrigin}${path}`
}

/** An item's own revision date: `updatedAt` if it has one, else `createdAt`. */
function stamp(item: RegistryItem) {
  return new Date(item.updatedAt ?? item.createdAt)
}

/** The newest stamp in a set, or nothing at all if the set is empty. */
function latest(items: RegistryItem[]) {
  if (!items.length) return undefined
  return new Date(Math.max(...items.map((item) => stamp(item).getTime())))
}

export default function sitemap(): MetadataRoute.Sitemap {
  const categories = ALL_CATEGORIES.filter((category) => isBrowsableKind(category.kind))

  return [
    { url: absolute("/"), lastModified: latest([...ITEMS]) },

    ...STATIC_PATHS.map((path) => ({ url: absolute(path) })),

    ...browsableKinds().map((kind) => ({
      url: absolute(`/community/${kind}`),
      lastModified: latest(itemsByKind(kind)),
    })),

    ...categories.map((category) => ({
      url: absolute(`/community/${category.kind}/s/${category.slug}`),
      lastModified: latest(itemsByCategory(category.kind, category.slug)),
    })),

    ...allAuthors().map((author) => ({
      url: absolute(profileHref(author.handle)),
      lastModified: latest(itemsByAuthor(author.handle)),
    })),

    ...ITEMS.map((item) => ({
      url: absolute(itemHref(item)),
      lastModified: stamp(item),
    })),
  ]
}
