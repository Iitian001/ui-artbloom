"use client"

import { useEffect, useRef, useState } from "react"

type RevealProps = {
  children: React.ReactNode
  /** Merged after `dlReveal`, so this is where the layout class goes. */
  className?: string
  /** Stagger, in milliseconds. Feeds `--dl-delay` in the stylesheet. */
  delay?: number
  /** Render as something other than a `<div>` — e.g. "section", "li". */
  as?: "div" | "section" | "li" | "article"
}

/**
 * Fades and lifts its children in when they first scroll into view.
 *
 * It merges `className` onto the element it renders, so the revealed element
 * *is* the layout element — `<Reveal className="dlCard">` is a grid child, not
 * a wrapper that breaks the grid.
 *
 * Three details are deliberate:
 *
 *   - The observer disconnects on the first intersection. Re-hiding content the
 *     reader has already passed is motion for its own sake, and a long page
 *     keeps zero observers alive by the time you reach the footer.
 *   - The hidden state lives in CSS, not here, so nothing flashes in before
 *     hydration and `prefers-reduced-motion` can switch it off without this
 *     component knowing.
 *   - If `IntersectionObserver` is missing, the content shows immediately.
 *     Failing open is the only acceptable direction for a fade-in.
 */
export function Reveal({ children, className, delay = 0, as = "div" }: RevealProps) {
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

  const Tag = as
  return (
    <Tag
      ref={ref as React.Ref<never>}
      className={className ? `dlReveal ${className}` : "dlReveal"}
      data-shown={shown ? "true" : "false"}
      style={delay ? ({ "--dl-delay": `${delay}ms` } as React.CSSProperties) : undefined}
    >
      {children}
    </Tag>
  )
}
