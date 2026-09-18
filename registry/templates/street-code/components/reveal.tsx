"use client"

import { useEffect, useRef, useState } from "react"

type RevealProps = {
  children: React.ReactNode
  /** Merged after `scReveal`, so this is where the layout class goes. */
  className?: string
  /** Stagger, in milliseconds. Feeds `--sc-delay` in the stylesheet. */
  delay?: number
}

/**
 * Fades and lifts its children in when they first scroll into view.
 *
 * It renders a plain `<div>` and merges `className`, so the revealed element *is*
 * the layout element — `<Reveal className="scCard">` is a grid child, not a
 * wrapper that breaks the grid. Modelled on the monolith-launch Reveal, with the
 * same three deliberate choices:
 *
 *   - The observer disconnects on first intersection. Re-hiding content the
 *     reader has already passed is motion for its own sake, and a long page keeps
 *     zero observers alive by the time you reach the footer.
 *   - The hidden state lives in CSS, not here, so nothing flashes in before
 *     hydration and `prefers-reduced-motion` can switch it all off.
 *   - If `IntersectionObserver` is missing, the content shows immediately.
 *     Failing open is the only acceptable direction for a fade-in.
 *
 * `data-shown` also drives the marker doodles inside a revealed block: their
 * stroke draws in on the same flip (see `.scReveal[data-shown="true"]` in the
 * stylesheet).
 */
export function Reveal({ children, className, delay = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node || shown) return

    if (typeof IntersectionObserver === "undefined") {
      setShown(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return
        setShown(true)
        observer.disconnect()
      },
      /* Held back from the bottom edge so it reads as a reveal, not a pop. */
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [shown])

  return (
    <div
      ref={ref}
      className={className ? `scReveal ${className}` : "scReveal"}
      data-shown={shown ? "true" : "false"}
      style={delay ? ({ "--sc-delay": `${delay}ms` } as React.CSSProperties) : undefined}
    >
      {children}
    </div>
  )
}
