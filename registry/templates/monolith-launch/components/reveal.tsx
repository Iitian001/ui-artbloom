"use client"

import { useEffect, useRef, useState } from "react"

type RevealProps = {
  children: React.ReactNode
  /** Merged after `monoReveal`, so this is where the layout class goes. */
  className?: string
  /** Stagger, in milliseconds. Feeds `--mono-delay` in the stylesheet. */
  delay?: number
}

/**
 * Fades and lifts its children in when they first scroll into view.
 *
 * It renders a plain `<div>` and merges `className`, which means the revealed
 * element *is* the layout element — `<Reveal className="monoPillar">` is a grid
 * child of `.monoPillars`, not a wrapper that breaks the grid. That is the whole
 * reason it does not try to be polymorphic.
 *
 * Three details are deliberate:
 *
 *   - The observer disconnects on the first intersection. Re-hiding content the
 *     reader has already passed is motion for its own sake, and it means a long
 *     page keeps zero observers alive by the time you reach the footer.
 *   - The hidden state lives in CSS, not here, so nothing flashes in before
 *     hydration and `prefers-reduced-motion` can switch the whole thing off
 *     without this component knowing.
 *   - If `IntersectionObserver` is missing, the content shows immediately.
 *     Failing open is the only acceptable direction for a fade-in.
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
      /* Held back slightly from the bottom edge so it reads as a reveal, not a pop. */
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [shown])

  return (
    <div
      ref={ref}
      className={className ? `monoReveal ${className}` : "monoReveal"}
      data-shown={shown ? "true" : "false"}
      style={delay ? ({ "--mono-delay": `${delay}ms` } as React.CSSProperties) : undefined}
    >
      {children}
    </div>
  )
}
