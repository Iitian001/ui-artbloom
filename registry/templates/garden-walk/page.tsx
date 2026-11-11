import type { Metadata } from "next"

import "./garden-walk.css"

/**
 * An illustrated character walks visitors through a garden from dawn to night: projects bloom out of the ground, skills drift as dandelion seeds, certificates glow as lanterns, with a synthesised day-and-night soundscape.
 *
 * The site is a built, self-contained document in `public/garden-walk/`, and this
 * route frames it the same way Developer Room is framed. It runs its own render loop,
 * scrolling and pointer handling against its own document, so it is kept out of React.
 * Assets load by relative path, so the folder works wherever it is served from.
 */
export const metadata: Metadata = {
  title: "Garden Walk",
  description: "An illustrated character walks visitors through a garden from dawn to night: projects bloom out of the ground, skills drift as dandelion seeds, certificates glow as lanterns, with a synthesised day-and-night soundscape.",
}

export default function GardenWalkPage() {
  return (
    <div className="garden-walk-shell">
      <iframe
        className="garden-walk-frame"
        src="/garden-walk/index.html"
        title="Garden Walk"
        allow="autoplay; fullscreen; clipboard-write"
      />
    </div>
  )
}
