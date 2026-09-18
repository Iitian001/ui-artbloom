"use client"

import {
  createElement,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from "react"

type RevealProps = {
  children: ReactNode
  /** Merged after `grReveal`, so this is where the layout class goes. */
  className?: string
  /** Stagger, in milliseconds. Feeds `--gr-delay` in the stylesheet. */
  delay?: number
  /** The element to render. Defaults to a `<div>`; pass `"figure"`, `"li"`, etc. */
  as?: ElementType
}

/**
 * Fades and lifts its children in when they first scroll into view, and — via a
 * `data-shown` attribute the stylesheet reads — triggers any hand-drawn SVG mark
 * inside it to draw its stroke on.
 *
 * It renders the element you ask for and merges `className`, so the revealed
 * element *is* the layout element: `<Reveal as="article" className="grCard">` is
 * a real grid child, not a wrapper that breaks the grid.
 *
 * Three details are deliberate, and copied from the house pattern:
 *   - The observer disconnects on first intersection. Re-hiding content the
 *     reader has passed is motion for its own sake, and a long page then keeps
 *     zero observers alive by the time you reach the footer.
 *   - The hidden state lives in CSS, so nothing flashes in before hydration and
 *     `prefers-reduced-motion` can switch it all off without this component
 *     knowing.
 *   - If `IntersectionObserver` is missing, the content shows immediately.
 *     Failing open is the only acceptable direction for a fade-in.
 */
export function Reveal({ children, className, delay = 0, as = "div" }: RevealProps) {
  const ref = useRef<HTMLElement>(null)
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

  // Rendered via `createElement` rather than `<Tag>` JSX: a polymorphic
  // `ElementType` tag makes the JSX prop inference collapse to `never` under
  // this TypeScript (bare `tsc` tolerates it; `next build` does not), so the
  // explicit call is the reliable way to render the chosen tag.
  return createElement(
    as,
    {
      ref,
      className: className ? `grReveal ${className}` : "grReveal",
      "data-shown": shown ? "true" : "false",
      style: delay ? ({ "--gr-delay": `${delay}ms` } as CSSProperties) : undefined,
    },
    children,
  )
}
