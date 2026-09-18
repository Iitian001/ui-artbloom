/**
 * Hand-drawn graffiti marks, in inline SVG.
 *
 * These are the whole theme. A dark page with a green button is a dark page with
 * a green button; the crown over the headline, the marker loop around a word and
 * the scribbled underline are what make it read as street art. So they are drawn
 * by hand here rather than pulled from an icon set — every path is a little
 * irregular on purpose, because a perfect circle looks like a border, not paint.
 *
 * Each mark is presentational and `aria-hidden`, takes a `className` for
 * placement, and paints in `currentColor` so the accent colour is set by CSS.
 *
 * The line-drawing marks (`Underline`, `CircleLoop`) use `pathLength={1}` so the
 * stylesheet can animate the stroke on a 0..1 scale without knowing the real path
 * length. The CSS draws them in when a `data-shown` ancestor flips, or immediately
 * when they carry `scDrawNow`.
 */

type MarkProps = {
  className?: string
}

/** The Basquiat crown. Goes above and to the side of the headline. */
export function Crown({ className }: MarkProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 80"
      fill="none"
      stroke="currentColor"
      strokeWidth={7}
      strokeLinejoin="round"
      strokeLinecap="round"
      aria-hidden="true"
      focusable="false"
    >
      <path pathLength={1} d="M8 68 L16 20 L40 50 L60 12 L80 50 L104 20 L112 68 Z" />
      {/* Jewels — three quick dabs across the band. */}
      <path pathLength={1} d="M34 60 L36 60" />
      <path pathLength={1} d="M60 58 L62 58" />
      <path pathLength={1} d="M86 60 L88 60" />
    </svg>
  )
}

/** A loose marker loop, meant to circle a single word. Draws in. */
export function CircleLoop({ className }: MarkProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 320 140"
      fill="none"
      stroke="currentColor"
      strokeWidth={6}
      strokeLinecap="round"
      aria-hidden="true"
      focusable="false"
    >
      {/* Overshoots past the start, the way a hand does — never a clean join. */}
      <path
        pathLength={1}
        d="M228 18 C120 -8 30 20 20 68 C12 108 96 128 178 126 C268 124 320 96 306 58 C296 30 232 16 150 20"
      />
    </svg>
  )
}

/** A double-stroke marker underline. The hero and section headings sit on it. */
export function Underline({ className }: MarkProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 340 36"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      aria-hidden="true"
      focusable="false"
    >
      {/* Heavy first pass. */}
      <path pathLength={1} strokeWidth={9} d="M8 18 C90 8 210 8 332 16" />
      {/* A lighter second pass, offset — the classic marker double-take. */}
      <path
        pathLength={1}
        strokeWidth={4}
        d="M14 27 C120 22 220 24 320 25"
        className="scUnderlineSecond"
      />
    </svg>
  )
}

/** A curved arrow with a marker head. Points from a scribbled note to its target. */
export function Arrow({ className }: MarkProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 130 120"
      fill="none"
      stroke="currentColor"
      strokeWidth={6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path pathLength={1} d="M18 12 C70 18 108 44 100 96" />
      {/* Arrowhead. */}
      <path pathLength={1} d="M78 82 L100 100 L118 74" />
    </svg>
  )
}

/** A four-point spark / star burst. A quick accent near numbers and CTAs. */
export function Spark({ className }: MarkProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 60 60"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M30 0 C33 20 40 27 60 30 C40 33 33 40 30 60 C27 40 20 33 0 30 C20 27 27 20 30 0 Z" />
    </svg>
  )
}

/** A scribbled bracket, like a hand-drawn corner mark. Frames the portrait. */
export function CornerScribble({ className }: MarkProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      stroke="currentColor"
      strokeWidth={6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M6 40 C4 22 10 8 30 6 C46 5 58 9 70 8" />
      <path d="M12 34 C11 24 16 16 28 15" opacity={0.55} />
    </svg>
  )
}
