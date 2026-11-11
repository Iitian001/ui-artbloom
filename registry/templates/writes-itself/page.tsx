import type { Metadata } from "next"

import "./writes-itself.css"

/**
 * A portfolio that starts as one prompt: ask a question and the page streams in token by token like an AI reply, then assembles into headings, cards and pictures that denoise into view.
 *
 * The site is a built, self-contained document in `public/writes-itself/`, and this
 * route frames it the same way Developer Room is framed. It runs its own render loop,
 * scrolling and pointer handling against its own document, so it is kept out of React.
 * Assets load by relative path, so the folder works wherever it is served from.
 */
export const metadata: Metadata = {
  title: "Writes Itself",
  description: "A portfolio that starts as one prompt: ask a question and the page streams in token by token like an AI reply, then assembles into headings, cards and pictures that denoise into view.",
}

export default function WritesItselfPage() {
  return (
    <div className="writes-itself-shell">
      <iframe
        className="writes-itself-frame"
        src="/writes-itself/index.html"
        title="Writes Itself"
        allow="autoplay; fullscreen; clipboard-write"
      />
    </div>
  )
}
