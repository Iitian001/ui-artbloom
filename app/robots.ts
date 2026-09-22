import type { MetadataRoute } from "next"

import { siteOrigin } from "@/lib/brand"

/**
 * Open to crawlers, with nothing closed.
 *
 * Every page that should stay out of the index says so in its own metadata — the
 * whole `(bare)` group of template fixtures carries `robots: { index: false }` —
 * and that is on purpose, because a `Disallow` and a `noindex` do not compose. A
 * crawler obeying `Disallow` never fetches the page, so it never sees the
 * noindex, and the URL can stay in the index as a bare link with no description.
 * Noindex removes it; Disallow only hides why.
 *
 * So there is no `Disallow` here. `/preview/` in particular has to stay fetchable
 * for a crawler to reach the noindex on a fixture, and `/r/` and `/schema/` are
 * the registry itself — the JSON any shadcn-compatible tool reads, and the schema
 * it validates against. There is no longer anything to hide: the tracker and the
 * OAuth callback that used to sit under `/api/` and `/auth/` are gone.
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
    },
    sitemap: `${siteOrigin}/sitemap.xml`,
  }
}
