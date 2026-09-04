"use client"

import type { CSSProperties } from "react"
import { motion, useReducedMotion } from "motion/react"

import { cn } from "@/lib/utils"

export type TextShimmerProps = {
  children: string
  className?: string
  /** Seconds for one sweep. */
  duration?: number
  /** Width of the bright band, multiplied by character count. */
  spread?: number
}

/**
 * A light band that sweeps across text. The gradient is painted into the text
 * itself via background-clip, so it inherits font weight and letter spacing
 * with no extra markup.
 *
 * Under `prefers-reduced-motion` the band parks mid-word instead of sweeping
 * forever. The treatment still reads as a highlight, and nothing moves — which
 * matters because an endless sweep is the exact thing the preference asks to be
 * spared, and `backgroundPosition` is not a transform, so Motion's own reduced
 * -motion handling would not have caught it.
 */
export function TextShimmer({
  children,
  className,
  duration = 2,
  spread = 2,
}: TextShimmerProps) {
  const reduced = useReducedMotion()

  return (
    <motion.span
      className={cn(
        "relative inline-block bg-[length:250%_100%,auto] bg-clip-text text-transparent",
        "[--base:#71717b] [--highlight:#09090b]",
        "dark:[--base:#52525c] dark:[--highlight:#ffffff]",
        className,
      )}
      style={
        {
          "--spread": `${children.length * spread}px`,
          backgroundImage:
            "linear-gradient(90deg, transparent calc(50% - var(--spread)), var(--highlight), transparent calc(50% + var(--spread))), linear-gradient(var(--base), var(--base))",
          backgroundRepeat: "no-repeat, padding-box",
        } as CSSProperties
      }
      initial={{ backgroundPosition: reduced ? "50% center" : "100% center" }}
      animate={{ backgroundPosition: reduced ? "50% center" : "0% center" }}
      transition={reduced ? { duration: 0 } : { duration, ease: "linear", repeat: Infinity }}
    >
      {children}
    </motion.span>
  )
}
