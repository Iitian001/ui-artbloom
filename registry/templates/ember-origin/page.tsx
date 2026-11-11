import type { Metadata } from "next"

import "./ember-origin.css"

/**
 * A specialty coffee roastery where scrolling pours the coffee: a WebGL cup fills with crema you can draw latte art in, three single origins with their own pour, a brew guide and a café.
 *
 * The site is a built, self-contained document in `public/ember-origin/`, and this
 * route frames it the same way Developer Room is framed. It runs its own render loop,
 * scrolling and pointer handling against its own document, so it is kept out of React.
 * Assets load by relative path, so the folder works wherever it is served from.
 */
export const metadata: Metadata = {
  title: "Ember & Origin",
  description: "A specialty coffee roastery where scrolling pours the coffee: a WebGL cup fills with crema you can draw latte art in, three single origins with their own pour, a brew guide and a café.",
}

export default function EmberOriginPage() {
  return (
    <div className="ember-origin-shell">
      <iframe
        className="ember-origin-frame"
        src="/ember-origin/index.html"
        title="Ember & Origin"
        allow="autoplay; fullscreen; clipboard-write"
      />
    </div>
  )
}
