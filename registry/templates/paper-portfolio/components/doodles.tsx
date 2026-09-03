/**
 * The photographic slots in this template: the portrait collage and the project
 * marks.
 *
 * These were briefly redrawn as generated SVG. They are bitmaps again, because a
 * photograph of a person and five product logos are not derivable from a hash.
 * The files live in `assets/` beside this template; the install copies them to
 * `public/paper-portfolio/`, and Next serves `public` from the base URL — so the
 * URLs are `/paper-portfolio/<file>` and, unlike the routes, they do not move
 * when `BASE` changes.
 *
 * Plain `<img>`, not `next/image`, on purpose. A template is installed into an
 * app whose `next.config` it does not control, and `next/image` has two
 * configuration dependencies this folder cannot satisfy from here:
 *
 *   - `output: "export"` cannot use the default loader at all. It needs
 *     `images.loader: "custom"` plus a `loaderFile`, so an export build fails
 *     rather than degrades.
 *   - `images.localPatterns`, once a consumer sets it for their own images,
 *     turns every path outside those patterns into a 400. A consumer who has
 *     never touched it is fine; one who has must remember to add this folder.
 *
 * What is given up is small. Five of the six files are 52–73px wide and render
 * at 62–230px, so the optimizer has nothing to shrink and would only upscale
 * them into a larger, softer variant. The collage is the real cost — 525,048
 * bytes for a 565px box — but the fix there is re-encoding the file, not making
 * a consumer's build satisfy `next/image`.
 *
 * The stylesheet's `.paperSite img` rule already supplies `display: block` and
 * `max-width: 100%`. The inline styles below add only the box-filling geometry,
 * which is inline because the rules for these three slots still select `svg`.
 * Once `paper-portfolio.css` selects `img` too, the `style` props can go.
 */

import { profile, projects } from "../data/projects"

/**
 * Intrinsic pixels of `hero-collage.png`, read from its PNG header. Both slots
 * share that one file, so there is one pair rather than a table.
 *
 * The marks get no such constant. Their box is a fixed CSS square and they are
 * cropped to fill it, so their five different shapes (52×58 up to 73×75) cannot
 * shift the layout and the browser never needs the ratio to reserve space.
 */
const COLLAGE = { width: 525, height: 500 } as const

/**
 * Shown when a `seed` matches no project. `star.png` is the spare mark the data
 * already gives to projects with no logo of their own, so an unknown seed lands
 * on something drawn for this purpose instead of a broken image.
 */
const SPARE_MARK = "/paper-portfolio/star.png"

/** One description, two slots — it is the same photograph on both pages. */
const COLLAGE_ALT = `Portrait collage of ${profile.name} ${profile.surname}`

/**
 * The hero artwork: the cut-out collage, cropped to fill its box.
 *
 * `.heroArtwork` is 565×520 on desktop, so `cover` trims a little off the sides
 * of the 525×500 file. At 900px and under that box goes auto-height, the
 * percentage height resolves against nothing, and the intrinsic ratio takes
 * over.
 *
 * Eager and high priority: it is above the fold and the likely LCP element.
 */
export function TornCollage() {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={profile.portrait}
      alt={COLLAGE_ALT}
      width={COLLAGE.width}
      height={COLLAGE.height}
      loading="eager"
      fetchPriority="high"
      decoding="async"
      style={{ width: "100%", height: "100%", objectFit: "cover" }}
    />
  )
}

/**
 * The about-page portrait. Same file as the hero, fitted to the panel rather
 * than cropped: the panel has no fixed height, so width drives and height
 * follows.
 *
 * `height: auto` is what keeps it from squashing, and it always matters here —
 * the panel sits in a 470px grid column on desktop and is capped at 520px below
 * that, so the box is never as wide as the file's 525px.
 */
export function StudioPortrait() {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={profile.portrait}
      alt={COLLAGE_ALT}
      width={COLLAGE.width}
      height={COLLAGE.height}
      loading="lazy"
      decoding="async"
      style={{ width: "100%", height: "auto" }}
    />
  )
}

export type ProjectMarkProps = {
  /** A project's `mark`, looked up in `projects` to find that project's logo. */
  seed: string
}

/**
 * The square logo mark on project cards and case-study headers.
 *
 * It takes a `mark` and looks the project up, rather than taking the image path,
 * because the case-study page has only the `mark` to hand and this component
 * cannot reach into that file. `mark` has no other purpose now that the art is
 * not generated from it — passing the project straight in and deleting the field
 * would be the better shape.
 *
 * Decorative: every mark sits next to the project title it belongs to, so an
 * alt text would only repeat the adjacent heading. Hence `alt=""`.
 */
export function ProjectMark({ seed }: ProjectMarkProps) {
  const src = projects.find((project) => project.mark === seed)?.image ?? SPARE_MARK

  return (
    <span className="projectMark" aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        loading="lazy"
        decoding="async"
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    </span>
  )
}
