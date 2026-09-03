/**
 * Every image in this template is drawn here, in SVG, from a string.
 *
 * The original of this design shipped six PNGs — a photographic collage and five
 * logo glyphs. Bitmaps in a registry item mean binary assets to download, a
 * licence to carry, and someone else's face in your repository. Generating the
 * artwork instead means the whole template is text: it diffs, it themes off the
 * same CSS variables, and it stays sharp at any size.
 *
 * Nothing here is random. Marks are derived from a hash of their seed so the
 * server and the client draw the same thing and hydration stays quiet.
 */

/** FNV-1a, 32-bit. Small, stable, and good enough to pick shapes with. */
function hash(seed: string): number {
  let h = 0x811c9dc5
  for (let i = 0; i < seed.length; i += 1) {
    h ^= seed.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return h >>> 0
}

/** Deterministic integer in [min, max] for the nth draw off a seed. */
function pick(seed: number, index: number, min: number, max: number): number {
  const mixed = Math.imul(seed ^ Math.imul(index + 1, 0x9e3779b9), 0x85ebca6b) >>> 0
  return min + (mixed % (max - min + 1))
}

export type ProjectMarkProps = {
  /** Any stable string. The same seed always draws the same mark. */
  seed: string
}

/**
 * The square glyph on project cards and case-study pages.
 *
 * Ink ground, cut-paper shape, halftone dots — the same three ingredients every
 * time, arranged differently per project so the grid reads as a set.
 */
export function ProjectMark({ seed }: ProjectMarkProps) {
  const h = hash(seed)
  const dots = `pm-dots-${h.toString(36)}`
  const shape = pick(h, 0, 0, 3)
  const cx = pick(h, 1, 38, 62)
  const cy = pick(h, 2, 38, 62)
  const size = pick(h, 3, 30, 42)
  const tilt = pick(h, 4, -18, 18)
  const barY = pick(h, 5, 62, 78)

  return (
    <span className="projectMark" aria-hidden="true">
      <svg viewBox="0 0 100 100" role="presentation" focusable="false">
        <defs>
          <pattern id={dots} width="6" height="6" patternUnits="userSpaceOnUse">
            <circle cx="1.4" cy="1.4" r="1.1" fill="#f6f1e6" opacity="0.22" />
          </pattern>
        </defs>

        <rect width="100" height="100" fill="#14130f" />
        <rect width="100" height="100" fill={`url(#${dots})`} />

        <g transform={`rotate(${tilt} ${cx} ${cy})`}>
          {shape === 0 && <circle cx={cx} cy={cy} r={size / 2} fill="#f3eee3" />}
          {shape === 1 && (
            <rect x={cx - size / 2} y={cy - size / 2} width={size} height={size} fill="#f3eee3" />
          )}
          {shape === 2 && (
            <path
              d={`M ${cx} ${cy - size / 2} L ${cx + size / 2} ${cy + size / 2} L ${cx - size / 2} ${cy + size / 2} Z`}
              fill="#f3eee3"
            />
          )}
          {shape === 3 && (
            <path
              d={`M ${cx - size / 2} ${cy + size / 2} A ${size / 2} ${size / 2} 0 0 1 ${cx + size / 2} ${cy + size / 2} Z`}
              fill="#f3eee3"
            />
          )}
          <circle cx={cx} cy={cy} r={size / 6} fill="#e8622b" />
        </g>

        <rect x="10" y={barY} width={pick(h, 6, 24, 52)} height="3" fill="#f1cf58" />
        <rect x="10" y={barY + 7} width={pick(h, 7, 12, 30)} height="3" fill="#f6f1e6" opacity="0.5" />
      </svg>
    </span>
  )
}

/**
 * The hero artwork — a torn-paper collage.
 *
 * Deliberately abstract. A portrait belongs to a person; this is meant to be
 * dropped into anyone's site, so it reads as cut paper rather than as a face.
 */
export function TornCollage() {
  return (
    <svg viewBox="0 0 565 520" role="img" aria-label="Torn paper collage" focusable="false">
      <defs>
        <pattern id="pp-halftone" width="7" height="7" patternUnits="userSpaceOnUse">
          <circle cx="1.6" cy="1.6" r="1.3" fill="#f6f1e6" opacity="0.28" />
        </pattern>
        <pattern id="pp-hatch" width="8" height="8" patternUnits="userSpaceOnUse">
          <path d="M0 8 L8 0" stroke="#11100d" strokeWidth="0.9" opacity="0.35" />
        </pattern>
      </defs>

      {/* back sheet, torn along the bottom */}
      <path
        d="M28 34 L508 18 L520 452 L470 440 L432 462 L392 438 L350 464 L306 438 L262 462 L214 436 L170 460 L124 436 L76 458 L34 434 Z"
        fill="#e9dfce"
        stroke="#c7baa5"
        strokeWidth="1.5"
      />

      {/* the photo block */}
      <path
        d="M74 92 L470 72 L478 372 L436 382 L398 366 L352 384 L306 364 L258 384 L208 362 L158 382 L112 360 L80 378 Z"
        fill="#14130f"
      />
      <path
        d="M74 92 L470 72 L478 372 L436 382 L398 366 L352 384 L306 364 L258 384 L208 362 L158 382 L112 360 L80 378 Z"
        fill="url(#pp-halftone)"
      />

      {/* cut-paper figure: shoulders and a head, no features */}
      <path d="M168 380 Q276 236 386 380 Z" fill="#f3eee3" />
      <circle cx="277" cy="204" r="62" fill="#f3eee3" />
      <circle cx="277" cy="204" r="62" fill="url(#pp-hatch)" />
      <path d="M215 204 A62 62 0 0 1 339 204 Z" fill="#f1cf58" opacity="0.85" />

      {/* ink marks */}
      <path
        d="M96 418 C 168 396 236 430 300 408 S 430 424 468 402"
        stroke="#11100d"
        strokeWidth="2.4"
        fill="none"
        strokeLinecap="round"
      />
      <path d="M112 442 L146 442" stroke="#e8622b" strokeWidth="4" strokeLinecap="round" />
      <path
        d="M492 118 l9 26 27 2 -21 17 7 27 -22-15 -23 15 7-27 -21-17 27-2 Z"
        fill="#f1cf58"
        stroke="#11100d"
        strokeWidth="1.2"
      />

      {/* corner tape */}
      <rect x="42" y="60" width="92" height="26" rx="2" fill="#d7c29d" opacity="0.72" transform="rotate(-9 88 73)" />
      <rect x="406" y="46" width="86" height="24" rx="2" fill="#d7c29d" opacity="0.72" transform="rotate(7 449 58)" />
    </svg>
  )
}

/**
 * The about-page portrait slot. Same idea as {@link TornCollage}, taller crop,
 * built to sit inside a bordered paper panel.
 */
export function StudioPortrait() {
  return (
    <svg viewBox="0 0 420 460" role="img" aria-label="Cut paper studio portrait" focusable="false">
      <defs>
        <pattern id="pp-portrait-dots" width="6" height="6" patternUnits="userSpaceOnUse">
          <circle cx="1.3" cy="1.3" r="1.1" fill="#f6f1e6" opacity="0.24" />
        </pattern>
      </defs>

      <rect x="0" y="0" width="420" height="460" fill="#14130f" />
      <rect x="0" y="0" width="420" height="460" fill="url(#pp-portrait-dots)" />

      <path d="M64 460 Q210 236 356 460 Z" fill="#f3eee3" />
      <circle cx="210" cy="188" r="84" fill="#f3eee3" />
      <path d="M126 188 A84 84 0 0 1 294 188 Z" fill="#e8622b" opacity="0.82" />
      <path
        d="M52 402 C 130 380 196 414 268 392 S 366 408 392 388"
        stroke="#f1cf58"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      <rect x="28" y="34" width="120" height="26" rx="2" fill="#d7c29d" opacity="0.6" transform="rotate(-7 88 47)" />
    </svg>
  )
}
