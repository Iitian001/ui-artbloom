import type { Metadata } from "next"

import "./film-reel.css"

/**
 * A portfolio that plays like a film: a countdown leader, letterbox and 24 fps grain, film-burn transitions between project scenes, lower-third credits, rolling end credits and a post-credits contact scene.
 *
 * The site is a built, self-contained document in `public/film-reel/`, and this
 * route frames it the same way Developer Room is framed. It runs its own render loop,
 * scrolling and pointer handling against its own document, so it is kept out of React.
 * Assets load by relative path, so the folder works wherever it is served from.
 */
export const metadata: Metadata = {
  title: "Film Reel",
  description: "A portfolio that plays like a film: a countdown leader, letterbox and 24 fps grain, film-burn transitions between project scenes, lower-third credits, rolling end credits and a post-credits contact scene.",
}

export default function FilmReelPage() {
  return (
    <div className="film-reel-shell">
      <iframe
        className="film-reel-frame"
        src="/film-reel/index.html"
        title="Film Reel"
        allow="autoplay; fullscreen; clipboard-write"
      />
    </div>
  )
}
