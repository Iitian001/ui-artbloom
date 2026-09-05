import type { Metadata } from "next"

import { brand } from "@/lib/brand"

/**
 * The site card, at the one URL that is stable.
 *
 * `app/opengraph-image.tsx` is at the root of `app/` rather than inside a route
 * group on purpose: Next appends a content hash to the served path of an image
 * route in any nested segment (`/opengraph-image-12o0cb`) and leaves the root one
 * alone, so this is the only form that can be written down without going stale on
 * the next edit to the card.
 *
 * The dimensions repeat `OG_SIZE` from `lib/og.tsx` instead of importing it. That
 * module reads a file off disk, and pulling `node:fs` into the graph of every page
 * that wants a title is a poor trade for two numbers. If one moves, move both.
 */
const SITE_CARD = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: `${brand.name} — ${brand.tagline}`,
}

/**
 * One metadata shape for every page that has something of its own to say.
 *
 * The reason this exists rather than each page writing its own block: Next merges
 * metadata **shallowly**. A segment that sets `openGraph` replaces its parent's
 * entire `openGraph` object, and a segment that does not set it inherits every
 * field. `app/(site)/layout.tsx` sets one — so before this helper, all 38 item
 * pages and every category page shared a single card. Their own `title` and
 * `description` reached `<title>` and `<meta name="description">` and were then
 * contradicted by an `og:title` reading "ui.artbloom — The living library of
 * interfaces". A link to snap-toggle pasted into Slack said nothing about
 * snap-toggle.
 *
 * `twitter` has to be repeated for the same reason: setting it drops the parent's
 * `summary_large_image` unless this puts it back.
 *
 * And `images` has to be set here for a third turn of the same screw. An
 * `opengraph-image` file contributes its URL to the `openGraph` object of the
 * segment it sits in — so a deeper segment that sets `openGraph` at all discards
 * it along with everything else. That is measurable: with the card at the root and
 * nothing here, `/docs` and every category page emitted no `og:image` whatsoever.
 * The pages that have their own card colocated pass `ownCard`, which leaves
 * `images` out and lets the file win.
 */
export function pageMeta({
  title,
  description,
  path,
  ogTitle,
  index = true,
  ownCard = false,
}: {
  /** Page title, unbranded. The parent's title template adds the brand. */
  title: string
  description: string
  /** Site-relative, leading slash. Resolved against `metadataBase`. */
  path: string
  /** Card headline, when the branded title is the wrong thing to show. */
  ogTitle?: string
  /** `false` keeps it out of the index while still following its links. */
  index?: boolean
  /**
   * `true` for a route with an `opengraph-image` of its own. Omits `images` so
   * that file supplies them — it knows the hashed URL it is served at, and
   * nothing else does.
   */
  ownCard?: boolean
}): Metadata {
  /*
   * Matches what the title template in `app/(site)/layout.tsx` produces, so the
   * card headline and the browser tab agree. The template only ever applies to
   * `title` — `openGraph.title` is taken verbatim, which is why it is spelled out.
   */
  const headline = ogTitle ?? `${title} | ${brand.name}`
  const card = ownCard ? {} : { images: [SITE_CARD] }

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: brand.name,
      url: path,
      title: headline,
      description,
      ...card,
    },
    twitter: {
      card: "summary_large_image",
      title: headline,
      description,
      ...card,
    },
    ...(index ? {} : { robots: { index: false, follow: true } }),
  }
}

/** The card the `(site)` layout hands to every page that does not replace it. */
export const siteCard = SITE_CARD
