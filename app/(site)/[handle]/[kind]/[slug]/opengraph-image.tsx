import { ImageResponse } from "next/og"

import { brand, installCommand } from "@/lib/brand"
import { categoryLabel, KIND_SINGULAR } from "@/lib/categories"
import { itemFromParams } from "@/lib/hrefs"
import { loadMark, OG_SIZE, OgCard } from "@/lib/og"
import { ITEMS } from "@/lib/registry"

/**
 * The card for one item: its name, what it does, and the command that installs
 * it — which is the whole of what a link to this page is offering.
 *
 * `alt` is generic because the config exports of an image route are static and
 * cannot read `params`; per-item alt text needs `generateImageMetadata`, and a
 * second mechanism is not worth one attribute. The sentence is still true of
 * every card it describes.
 */
export const alt = `A ${brand.name} card: an item's name, what it does, and the one command that installs it.`
export const size = OG_SIZE
export const contentType = "image/png"

/**
 * The same params the page beside this one generates.
 *
 * Without it the route is still correct but renders on demand, and that is worse
 * here than elsewhere: `loadMark` reads `app/icon.svg` off the filesystem, and a
 * serverless bundle only carries files the tracer saw. Prerendering all 38 cards
 * at build time means the read happens where the file certainly is — and a card
 * that is already a static asset is served the first time a crawler asks for it,
 * which is the only time most of them ever will.
 */
export function generateStaticParams() {
  return ITEMS.map((item) => ({
    handle: item.author.handle,
    kind: item.kind,
    slug: item.name,
  }))
}

export default async function Image({
  params,
}: {
  params: Promise<{ handle: string; kind: string; slug: string }>
}) {
  const [item, mark] = await Promise.all([params.then(itemFromParams), loadMark()])

  /*
   * An unresolvable URL still gets a card. The page itself 404s — this route is
   * reached independently, and an `<img>` that fails is worse than a generic one.
   */
  if (!item) {
    return new ImageResponse(
      (
        <OgCard
          eyebrow={brand.domain}
          title={brand.tagline}
          lede={brand.description}
          command={installCommand("<name>")}
          mark={mark}
        />
      ),
      { ...size },
    )
  }

  const category = item.categories[0]

  return new ImageResponse(
    (
      <OgCard
        eyebrow={
          category
            ? `${KIND_SINGULAR[item.kind]}  ·  ${categoryLabel(item.kind, category)}`
            : KIND_SINGULAR[item.kind]
        }
        title={item.title}
        lede={item.description}
        command={installCommand(item.name)}
        mark={mark}
      />
    ),
    { ...size },
  )
}
