import type { MetadataRoute } from "next"

import { siteOrigin } from "@/lib/brand"

/**
 * Open to crawlers, with two directories closed.
 *
 * `/api/` and `/auth/` are the only `Disallow` entries because they are the only
 * paths with nothing to read: a POST tracker, a saves endpoint and an OAuth
 * callback. Every other page that should stay out of the index says so in its own
 * metadata — `/bookmarks`, `/login`, `/signup` and the whole `(bare)` group of
 * template fixtures carry `robots: { index: false }` — and that is on purpose,
 * because the two mechanisms do not compose. A crawler obeying `Disallow` never
 * fetches the page, so it never sees the noindex, and the URL can stay in the
 * index as a bare link with no description. Noindex removes it; Disallow only
 * hides why.
 *
 * `/r/`, `/schema/` and `/preview/` stay open. The first two are the registry
 * itself — the JSON any shadcn-compatible tool reads, and the schema it validates
 * against — and the third is how a crawler reaches the noindex on a fixture.
 *
 * No `Host` directive. Next supports one, but it is a Yandex extension that
 * expects a bare hostname rather than an origin, and the canonical URL on every
 * page already says which host is authoritative.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/auth/"],
    },
    sitemap: `${siteOrigin}/sitemap.xml`,
  }
}
