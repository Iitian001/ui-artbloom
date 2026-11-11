import type { Metadata } from "next"

import "./horologe.css"

/**
 * A luxury watchmaker: a live 3D watch keeps the visitor’s own time, winds as they scroll and opens into its movement, with craft, editions and a private-appointment form.
 *
 * The site is a built, self-contained document in `public/horologe/`, and this
 * route frames it the same way Developer Room is framed. It runs its own render loop,
 * scrolling and pointer handling against its own document, so it is kept out of React.
 * Assets load by relative path, so the folder works wherever it is served from.
 */
export const metadata: Metadata = {
  title: "Horologe",
  description: "A luxury watchmaker: a live 3D watch keeps the visitor’s own time, winds as they scroll and opens into its movement, with craft, editions and a private-appointment form.",
}

export default function HorologePage() {
  return (
    <div className="horologe-shell">
      <iframe
        className="horologe-frame"
        src="/horologe/index.html"
        title="Horologe"
        allow="autoplay; fullscreen; clipboard-write"
      />
    </div>
  )
}
