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
 *
 * Under `prefers-reduced-motion` the track is paused rather than removed. It
 * holds at 0%, which is the position the content would occupy with no animation
 * at all, so nothing moves and nothing is hidden. The pause is a class and the
 * animation is an inline style, so they set different properties and neither has
 * to out-specify the other.
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
            "motion-reduce:[animation-play-state:paused]",
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
          {/*
           * The fade is a share of the track, not a fixed 96px. At hero width the two
           * behave the same — 12% of 1340px clamps straight back to 6rem — but a
           * marquee dropped into a sidebar or a 298px card had 192px of gradient over
           * 296px of content, so two thirds of every name was under a vignette and the
           * rest read as clipped. A percentage keeps the edge soft at any width the
           * component is actually given.
           */}
          <div
            aria-hidden
            className={cn(
              "pointer-events-none absolute from-background to-transparent",
              vertical
                ? "inset-x-0 top-0 h-[clamp(1.5rem,12%,6rem)] bg-gradient-to-b"
                : "inset-y-0 left-0 w-[clamp(1.5rem,12%,6rem)] bg-gradient-to-r",
            )}
          />
          <div
            aria-hidden
            className={cn(
              "pointer-events-none absolute from-background to-transparent",
              vertical
                ? "inset-x-0 bottom-0 h-[clamp(1.5rem,12%,6rem)] bg-gradient-to-t"
                : "inset-y-0 right-0 w-[clamp(1.5rem,12%,6rem)] bg-gradient-to-l",
            )}
          />
        </>
      )}
    </div>
  )
}
