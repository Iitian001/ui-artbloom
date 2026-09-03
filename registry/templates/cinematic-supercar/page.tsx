import type { Metadata } from "next"

import "./cinematic-supercar.css"

/**
 * A cinematic scroll story: assembly, ignition, road, braking, showroom.
 *
 * The experience itself is one self-contained document in `public/`, and this route
 * frames it. That is deliberate rather than lazy. It drives a WebGL scene off raw
 * scroll position with its own cursor, grain, and audio, all of it written against
 * the document it ships in — porting that to JSX would mean React re-rendering
 * around a `requestAnimationFrame` loop it has no business touching, and every
 * scroll handler would need rewriting against a tree it did not expect. Framed, it
 * runs exactly as authored, and the frame's origin keeps its `document`-wide styles
 * from reaching the rest of your app.
 *
 * Editing it means editing `public/cinematic-supercar/experience.html` — one file,
 * no build step, refresh to see it.
 *
 * `allow="autoplay"` is what lets the V12 audio play on the first scroll gesture;
 * without it the frame is denied autoplay independently of the parent page.
 */
export const metadata: Metadata = {
  title: "Cinematic Supercar — V12 Machine Story",
  description:
    "An independent cinematic supercar concept experience: assembly, ignition, road, braking, and showroom sequences.",
}

export default function CinematicSupercarPage() {
  return (
    <div className="supercar-shell">
      <iframe
        className="supercar-frame"
        src="/cinematic-supercar/experience.html"
        title="Cinematic supercar machine story"
        allow="autoplay; fullscreen"
      />
    </div>
  )
}
