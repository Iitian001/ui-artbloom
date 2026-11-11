import type { Metadata } from "next"

import "./the-descent.css"

/**
 * An ocean-conservation nonprofit told as a dive: scroll from the surface to 10,935 m with live depth gauges, real animals at their real depths, a flashlight cursor in the dark and a donation at the trench floor.
 *
 * The site is a built, self-contained document in `public/the-descent/`, and this
 * route frames it the same way Developer Room is framed. It runs its own render loop,
 * scrolling and pointer handling against its own document, so it is kept out of React.
 * Assets load by relative path, so the folder works wherever it is served from.
 */
export const metadata: Metadata = {
  title: "The Descent",
  description: "An ocean-conservation nonprofit told as a dive: scroll from the surface to 10,935 m with live depth gauges, real animals at their real depths, a flashlight cursor in the dark and a donation at the trench floor.",
}

export default function TheDescentPage() {
  return (
    <div className="the-descent-shell">
      <iframe
        className="the-descent-frame"
        src="/the-descent/index.html"
        title="The Descent"
        allow="autoplay; fullscreen; clipboard-write"
      />
    </div>
  )
}
