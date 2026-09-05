"use client"

import { useEffect, useRef } from "react"
import { useInView, useMotionValue, useReducedMotion, useSpring } from "motion/react"

import { cn } from "@/lib/utils"

export type NumberTickerProps = {
  value: number
  /** Count down from `value` to 0 instead of up to it. */
  direction?: "up" | "down"
  /** Seconds to wait after entering the viewport. */
  delay?: number
  decimals?: number
  className?: string
}

/** Thousands separators, fixed decimals. One place, so a jump and a count agree. */
function format(n: number, decimals: number) {
  return n.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

/**
 * Counts to `value` the first time it scrolls into view. The spring runs on a
 * MotionValue and writes straight to textContent, so React never re-renders
 * during the count.
 *
 * THE SERVER RENDERS THE REAL NUMBER, NOT ZERO. It used to render `0` and only
 * reach `value` once JavaScript had run and the element had been scrolled to,
 * which meant the static HTML of every page using this component carried a figure
 * that was false — and that HTML is what a reader with JavaScript off, a crawler,
 * and every link-preview scraper actually see. A component whose entire job is to
 * display a number should not ship a wrong one as its markup. So the markup is the
 * final figure, and the count-up is arranged around it:
 *
 *  - Off screen at mount: rewound to the start with `jump()`, which sets the value
 *    without animating, and counted up when it scrolls in. Nobody sees the rewind
 *    because nobody is looking at it.
 *  - Already on screen at mount: left exactly as rendered. A reader looking at a
 *    correct number does not get to watch it reset itself to zero and climb back.
 *    Checked with `getBoundingClientRect`, because `useInView` reports `false` on
 *    the first render whether or not the element is visible — the observer has not
 *    fired yet — so it cannot answer this question.
 *
 * Under `prefers-reduced-motion` the spring is bypassed and the target is written
 * once, on mount. A count-up is a number moving, so the preference has to be
 * honoured by arriving rather than by travelling slower — and the figure the reader
 * came for is on screen either way.
 */
export function NumberTicker({
  value,
  direction = "up",
  delay = 0,
  decimals = 0,
  className,
}: NumberTickerProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const motionValue = useMotionValue(direction === "down" ? value : 0)
  const spring = useSpring(motionValue, { damping: 60, stiffness: 100 })
  const inView = useInView(ref, { once: true, margin: "0px" })
  const reduced = useReducedMotion()
  const start = direction === "down" ? value : 0
  const target = direction === "down" ? 0 : value
  /** Set when the number was already on screen, so the count is skipped entirely. */
  const settled = useRef(false)

  useEffect(() => {
    if (reduced) return
    const node = ref.current
    if (!node) return

    const rect = node.getBoundingClientRect()
    if (rect.bottom > 0 && rect.top < window.innerHeight) {
      settled.current = true
      // Keep the MotionValue consistent with the text, so a later `set(target)`
      // is a no-op rather than a jump back down.
      motionValue.jump(target)
      spring.jump(target)
      return
    }

    motionValue.jump(start)
    spring.jump(start)
    // Mount only: this is about what was on screen when the page arrived.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!inView || reduced || settled.current) return
    const timer = setTimeout(() => {
      motionValue.set(target)
    }, delay * 1000)
    return () => clearTimeout(timer)
  }, [inView, reduced, delay, motionValue, target])

  useEffect(() => {
    if (reduced) {
      if (ref.current) ref.current.textContent = format(target, decimals)
      return
    }
    return spring.on("change", (latest: number) => {
      if (!ref.current) return
      ref.current.textContent = format(latest, decimals)
    })
  }, [spring, decimals, reduced, target])

  return (
    <span ref={ref} className={cn("inline-block tabular-nums tracking-tight", className)}>
      {/* The resting figure for a count-up, the opening one for a count-down —
          which is `value` either way, and formatted, so the first paint and the
          last frame of the count use the same separators. */}
      {format(direction === "down" ? value : target, decimals)}
    </span>
  )
}
