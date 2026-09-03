"use client"

import { useEffect, useRef } from "react"
import { useInView, useMotionValue, useSpring } from "motion/react"

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

/**
 * Counts to `value` the first time it scrolls into view. The spring runs on a
 * MotionValue and writes straight to textContent, so React never re-renders
 * during the count.
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

  useEffect(() => {
    if (!inView) return
    const timer = setTimeout(() => {
      motionValue.set(direction === "down" ? 0 : value)
    }, delay * 1000)
    return () => clearTimeout(timer)
  }, [inView, delay, direction, motionValue, value])

  useEffect(() => {
    return spring.on("change", (latest: number) => {
      if (!ref.current) return
      ref.current.textContent = latest.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    })
  }, [spring, decimals])

  return (
    <span
      ref={ref}
      className={cn("inline-block tabular-nums tracking-tight", className)}
    >
      {direction === "down" ? value : 0}
    </span>
  )
}
