import { marquee } from "../data/content"

/**
 * The spray-paint marquee under the hero.
 *
 * The list is rendered twice because `@keyframes scMarquee` translates the track
 * by exactly -50% — with one copy the loop would jump at the seam. The second
 * copy is `aria-hidden`, so a screen reader hears each phrase once, not twice.
 *
 * A `prefers-reduced-motion` rule in the stylesheet stops the animation and lets
 * the row scroll on overflow instead, so the phrases are still all reachable.
 */
export function Ticker() {
  return (
    <div className="scMarquee" aria-label="What I'm about">
      <div className="scMarqueeTrack">
        {marquee.map((line) => (
          <span key={line} className="scMarqueeItem">
            {line}
          </span>
        ))}
        {marquee.map((line) => (
          <span key={`echo-${line}`} className="scMarqueeItem" aria-hidden="true">
            {line}
          </span>
        ))}
      </div>
    </div>
  )
}
