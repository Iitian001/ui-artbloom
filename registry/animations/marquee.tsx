"use client"

import type { CSSProperties, ReactNode } from "react"

import { cn } from "@/lib/utils"

export type MarqueeProps = {
  children: ReactNode
  className?: string
  /** Scroll right-to-left (default) or left-to-right. */
  reverse?: boolean
  /** Seconds for one full pass. */
  duration?: number
  /** Gap between repetitions, any CSS length. */
  gap?: string
  vertical?: boolean
  /** How many copies to render. 2 is enough for a seamless loop. */
  repeat?: number
  pauseOnHover?: boolean
  /** Fade the leading and trailing edges into the background. */
  fade?: boolean
}

/**
 * Seamless infinite scroller. The track is duplicated `repeat` times and shifted
 * by exactly one copy's width, so the seam never lands mid-frame.
 *
 * Requires the `marquee-x` / `marquee-y` keyframes in your global stylesheet.
 */
export function Marquee({
  children,
  className,
  reverse = false,
  duration = 30,
  gap = "3rem",
  vertical = false,
  repeat = 2,
  pauseOnHover = false,
  fade = true,
}: MarqueeProps) {
  return (
    <div
      className={cn(
        "group relative flex overflow-hidden",
        vertical ? "h-full flex-col" : "w-full flex-row",
        className,
      )}
      style={{ "--marquee-gap": gap, gap } as CSSProperties}
    >
      {Array.from({ length: repeat }, (_, i) => (
        <div
          key={i}
          aria-hidden={i > 0}
          className={cn(
            "flex shrink-0 items-center justify-around",
            vertical ? "flex-col" : "flex-row",
            pauseOnHover && "group-hover:[animation-play-state:paused]",
          )}
          style={{
            gap,
            animationName: vertical ? "marquee-y" : "marquee-x",
            animationDuration: `${duration}s`,
            animationTimingFunction: "linear",
            animationIterationCount: "infinite",
            animationDirection: reverse ? "reverse" : "normal",
          }}
        >
          {children}
        </div>
      ))}

      {fade && (
        <>
          <div
            aria-hidden
            className={cn(
              "pointer-events-none absolute from-background to-transparent",
              vertical ? "inset-x-0 top-0 h-24 bg-gradient-to-b" : "inset-y-0 left-0 w-24 bg-gradient-to-r",
            )}
          />
          <div
            aria-hidden
            className={cn(
              "pointer-events-none absolute from-background to-transparent",
              vertical ? "inset-x-0 bottom-0 h-24 bg-gradient-to-t" : "inset-y-0 right-0 w-24 bg-gradient-to-l",
            )}
          />
        </>
      )}
    </div>
  )
}
