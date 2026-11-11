import type { Metadata } from "next"

import "./sketchbook.css"

/**
 * A pencil-sketchbook portfolio that paints itself: a full-screen desk drawing you colour in with a watercolour lens, a WebGL sketchbook whose pages curl as you scroll, a graphite cursor trail and a physics toolbox.
 *
 * The site is a built, self-contained document in `public/sketchbook/`, and this
 * route frames it the same way Developer Room is framed. It runs its own render loop,
 * scrolling and pointer handling against its own document, so it is kept out of React.
 * Assets load by relative path, so the folder works wherever it is served from.
 */
export const metadata: Metadata = {
  title: "Sketchbook Portfolio",
  description: "A pencil-sketchbook portfolio that paints itself: a full-screen desk drawing you colour in with a watercolour lens, a WebGL sketchbook whose pages curl as you scroll, a graphite cursor trail and a physics toolbox.",
}

export default function SketchbookPage() {
  return (
    <div className="sketchbook-shell">
      <iframe
        className="sketchbook-frame"
        src="/sketchbook/index.html"
        title="Sketchbook Portfolio"
        allow="autoplay; fullscreen; clipboard-write"
      />
    </div>
  )
}
