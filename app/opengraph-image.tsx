import { ImageResponse } from "next/og"

import { brand, installCommand } from "@/lib/brand"
import { KIND_LABEL } from "@/lib/categories"
import { loadMark, OG_SIZE, OgCard } from "@/lib/og"
import { browsableKinds, kindCount } from "@/lib/registry"

/**
 * The card every page falls back to: what the library is, how big it is, and the
 * shape of the command that takes something out of it.
 *
 * It sits at the root of `app/` for one concrete reason. Next serves an image
 * route from a nested segment under a content-hashed path — the item card below
 * is `/…/opengraph-image-35fkyk` — and leaves the root one at `/opengraph-image`.
 * A stable path is what makes it referable, and it has to be referable, because
 * an `opengraph-image` file only contributes `images` to the `openGraph` object of
 * the segment it sits in. Any deeper segment that sets `openGraph` at all throws
 * that away. So `lib/seo.ts` names this URL, and every page it builds carries it.
 *
 * `alt`, `size` and `contentType` have to be static exports, so they cannot vary
 * per page. That is the whole reason the item route has a card of its own.
 */
export const alt = `${brand.name} — ${brand.tagline}`
export const size = OG_SIZE
export const contentType = "image/png"

export default async function Image() {
  const mark = await loadMark()

  /*
   * Counted, not written down. `browsableKinds()` omits any kind with nothing in
   * it, so this cannot advertise "0 Templates" the way a hand-kept string would.
   */
  const eyebrow = browsableKinds()
    .map((kind) => `${kindCount(kind)} ${KIND_LABEL[kind]}`)
    .join("  ·  ")

  return new ImageResponse(
    (
      <OgCard
        eyebrow={eyebrow}
        title={brand.tagline}
        lede={brand.description}
        command={installCommand("<name>")}
        mark={mark}
      />
    ),
    { ...size },
  )
}
