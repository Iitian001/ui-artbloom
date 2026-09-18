/**
 * Hand-drawn marks, as inline SVG.
 *
 * Every stroke sets `pathLength={1}`, so the stylesheet can animate it with a
 * `stroke-dasharray: 1; stroke-dashoffset: 1 → 0` and never has to measure the
 * real path. When a mark sits inside a `<Reveal>`, `.grReveal[data-shown]` drives
 * the draw-in; anywhere else it simply renders already inked (the CSS default
 * transitions only under a revealed ancestor).
 *
 * The paths are deliberately a little wobbly — a perfectly straight line or a
 * true ellipse would read as a border, not as something drawn by a hand.
 */

/** The sweeping underline drawn beneath a headline word. Stretched by CSS. */
export function Underline({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 300 24"
      preserveAspectRatio="none"
      fill="none"
      aria-hidden="true"
    >
      <path
        className="grStroke"
        pathLength={1}
        d="M4 15 C 60 8, 120 20, 180 12 S 260 6, 296 14"
      />
      <path
        className="grStroke"
        pathLength={1}
        style={{ transitionDelay: "calc(var(--gr-delay, 0ms) + 320ms)" } as React.CSSProperties}
        d="M10 20 C 80 15, 150 23, 220 17 S 270 16, 290 19"
        opacity={0.5}
      />
    </svg>
  )
}

/** The rough ellipse circled around an annotated word. Stretched by CSS. */
export function Circle({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 240 90"
      preserveAspectRatio="none"
      fill="none"
      aria-hidden="true"
    >
      <path
        className="grStroke"
        pathLength={1}
        d="M139 6 C 66 1, 12 18, 10 44 C 8 71, 78 85, 140 84 C 205 83, 236 66, 231 42 C 227 21, 190 9, 120 8"
      />
    </svg>
  )
}

/** A fixed-size forward arrow for buttons and links. */
export function Arrow({ className, size = 18 }: { className?: string; size?: number }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h13" />
      <path d="M13 6l6 6-6 6" />
    </svg>
  )
}

/** A curved margin arrow that points down-left at a note. */
export function ArrowNote({ className, size = 26 }: { className?: string; size?: number }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
    >
      <path className="grStroke" pathLength={1} d="M25 5 C 26 15, 20 24, 9 26" />
      <path className="grStroke" pathLength={1} d="M14 21 L 8 27 L 16 28" />
    </svg>
  )
}

/** A small hand-drawn tick, used in place of a bullet. */
export function Tick({ className, size = 15 }: { className?: string; size?: number }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.25}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 11 L 8 16 L 17 4" />
    </svg>
  )
}
