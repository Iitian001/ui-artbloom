import { hero } from "../data/product"

/**
 * The scrolling strip under the hero.
 *
 * The list is rendered twice because `@keyframes monoTickerScroll` translates the
 * track by exactly -50% — with one copy the loop would jump. The second copy is
 * `aria-hidden`, so a screen reader hears each phrase once rather than twice.
 */
export function Ticker() {
  return (
    <div className="monoTicker">
      <div className="monoTickerTrack">
        {hero.ticker.map((line) => (
          <span key={line} className="monoTickerItem">
            {line}
          </span>
        ))}
        {hero.ticker.map((line) => (
          <span key={`echo-${line}`} className="monoTickerItem" aria-hidden="true">
            {line}
          </span>
        ))}
      </div>
    </div>
  )
}
