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
 * Under `prefers-reduced-motion` the spring is bypassed and the target is
 * written once, on mount. A count-up is a number moving, so the preference has
 * to be honoured by arriving rather than by travelling slower — and the figure
 * the reader came for is on screen either way.
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
  const target = direction === "down" ? 0 : value

  useEffect(() => {
    if (!inView || reduced) return
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
    <span
      ref={ref}
      className={cn("inline-block tabular-nums tracking-tight", className)}
    >
      {direction === "down" ? value : 0}
    </span>
  )
}
