import type { Metadata } from "next"

import "./monolith-atelier.css"

/**
 * An architecture studio where the visitor moves the sun: a real-time concrete building casts live shadows from dawn to dusk, then turns into a self-drawing blueprint for each project.
 *
 * The site is a built, self-contained document in `public/monolith-atelier/`, and this
 * route frames it the same way Developer Room is framed. It runs its own render loop,
 * scrolling and pointer handling against its own document, so it is kept out of React.
 * Assets load by relative path, so the folder works wherever it is served from.
 */
export const metadata: Metadata = {
  title: "Monolith Atelier",
  description: "An architecture studio where the visitor moves the sun: a real-time concrete building casts live shadows from dawn to dusk, then turns into a self-drawing blueprint for each project.",
}

export default function MonolithAtelierPage() {
  return (
    <div className="monolith-atelier-shell">
      <iframe
        className="monolith-atelier-frame"
        src="/monolith-atelier/index.html"
        title="Monolith Atelier"
        allow="autoplay; fullscreen; clipboard-write"
      />
    </div>
  )
}
