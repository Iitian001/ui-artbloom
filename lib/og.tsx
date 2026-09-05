import { readFile } from "node:fs/promises"
import { join } from "node:path"

import { brand } from "@/lib/brand"

/**
 * The shared face of a shared link: one card layout, used by the `(site)` group's
 * `opengraph-image` and by the per-item one under `[handle]/[kind]/[slug]`.
 *
 * Two constraints shape everything below, and neither is negotiable.
 *
 * `next/og` renders through Satori, which supports flexbox and a subset of CSS —
 * no grid, no `inset` shorthand, no `oklch()`. Every colour in this file is
 * therefore a hex literal converted from the token it mirrors in
 * `app/globals.css`: `--background` (0.145) is #0a0a0a, `--foreground` (0.985) is
 * #fafafa, `--muted-foreground` (0.678) is #979797, `--border` (0.268) is #262626.
 * If those tokens move, these move with them.
 *
 * And there is no font file in this repository — the site's three faces all come
 * from `next/font/google`, which caches into `.next` rather than anywhere a
 * module can read. So the card uses Satori's own bundled face, which has one
 * weight. Nothing here asks for bold, because asking would silently render
 * regular; hierarchy is size, colour and letter-spacing instead.
 *
 * The palette is grey on purpose. `--brand` exists in `globals.css` and is
 * referenced by nothing, so the site has no accent colour, and a card that
 * invented one would be the only place it appeared.
 */

export const OG_SIZE = { width: 1200, height: 630 }

const BG = "#0a0a0a"
const FG = "#fafafa"
const MUTED = "#979797"
const BORDER = "#262626"
const PILL = "#101010"

/**
 * The mark, as a data URI, read from the same `app/icon.svg` the browser tab
 * gets so the two cannot drift.
 *
 * Read once and cached: this does not vary per request, and the 38 item cards are
 * generated in one build. Failure is not an error — a card without the mark is a
 * card, so a read that fails (a route rendered on demand from a bundle that did
 * not trace the file, say) falls back to the wordmark alone rather than taking
 * the image down.
 */
let markPromise: Promise<string | undefined> | undefined

export function loadMark() {
  markPromise ??= readFile(join(process.cwd(), "app", "icon.svg"), "base64")
    .then((data) => `data:image/svg+xml;base64,${data}`)
    .catch(() => undefined)
  return markPromise
}

/** Trim to a word boundary, so a card never ends mid-word. */
export function clamp(text: string, max: number) {
  if (text.length <= max) return text
  const cut = text.slice(0, max)
  const stop = cut.lastIndexOf(" ")
  return `${(stop > max * 0.6 ? cut.slice(0, stop) : cut).replace(/[,.;:]$/, "")}…`
}

export function OgCard({
  eyebrow,
  title,
  lede,
  command,
  mark,
}: {
  /** Small caps line, top right. Kind and category, or the catalogue's size. */
  eyebrow: string
  title: string
  lede: string
  /** The command that installs the thing the card is about. */
  command: string
  mark: string | undefined
}) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: BG,
        color: FG,
        padding: "72px 76px",
        position: "relative",
      }}
    >
      {/* A hairline frame, drawn rather than bordered so the padding above stays
          independent of it. `inset` is not supported; the four sides are. */}
      <div
        style={{
          position: "absolute",
          top: 28,
          left: 28,
          right: 28,
          bottom: 28,
          border: `1px solid ${BORDER}`,
          borderRadius: 28,
        }}
      />

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          {mark ? <img src={mark} width={46} height={46} alt="" /> : null}
          <div style={{ marginLeft: 18, fontSize: 32, letterSpacing: -0.6, color: FG }}>
            {brand.wordmark}
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 20, letterSpacing: 3.4, color: MUTED }}>
          {eyebrow.toUpperCase()}
        </div>
      </div>

      <div style={{ display: "flex", flexGrow: 1 }} />

      <div
        style={{
          display: "flex",
          fontSize: title.length > 22 ? 68 : 82,
          lineHeight: 1.04,
          letterSpacing: -2.4,
          color: FG,
          maxWidth: 1000,
        }}
      >
        {title}
      </div>

      <div
        style={{
          display: "flex",
          marginTop: 26,
          fontSize: 29,
          lineHeight: 1.42,
          letterSpacing: -0.2,
          color: MUTED,
          maxWidth: 940,
        }}
      >
        {clamp(lede, 132)}
      </div>

      <div style={{ display: "flex", marginTop: 46 }}>
        <div
          style={{
            display: "flex",
            fontSize: 26,
            letterSpacing: 0.4,
            color: FG,
            background: PILL,
            border: `1px solid ${BORDER}`,
            borderRadius: 14,
            padding: "14px 24px",
          }}
        >
          {command}
        </div>
      </div>
    </div>
  )
}
