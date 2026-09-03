"use client"

import type { CSSProperties, ReactNode } from "react"

import { cn } from "@/lib/utils"

export type AuroraBackgroundProps = {
  children?: ReactNode
  className?: string
  /** Two or more CSS colors blended into the drifting field. */
  colors?: string[]
  /** Seconds for one drift cycle. Slower reads calmer. */
  duration?: number
  /** Add a faint film-grain overlay. */
  grain?: boolean
  /** Fade the aurora toward the bottom instead of filling the box. */
  fadeBottom?: boolean
}

/**
 * A soft, slowly drifting colour field for hero sections. Pure CSS — two
 * blurred conic layers moving at different rates, so there is no canvas, no
 * rAF loop, and it costs nothing on the main thread.
 */
export function AuroraBackground({
  children,
  className,
  colors = ["#7c3aed", "#2563eb", "#db2777", "#0ea5e9"],
  duration = 22,
  grain = true,
  fadeBottom = true,
}: AuroraBackgroundProps) {
  const stops = colors.join(", ")

  return (
    <div className={cn("relative isolate overflow-hidden bg-background", className)}>
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-[35%] opacity-45 blur-[90px] dark:opacity-40"
        style={
          {
            backgroundImage: `conic-gradient(from 0deg at 50% 50%, ${stops}, ${colors[0]})`,
            animation: `aurora-spin ${duration}s linear infinite`,
          } as CSSProperties
        }
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-[25%] opacity-30 blur-[110px] mix-blend-screen"
        style={
          {
            backgroundImage: `conic-gradient(from 180deg at 40% 60%, ${stops}, ${colors[0]})`,
            animation: `aurora-spin ${duration * 1.6}s linear infinite reverse`,
          } as CSSProperties
        }
      />

      {grain && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.16] mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")",
          }}
        />
      )}

      {fadeBottom && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-background to-transparent"
        />
      )}

      {children && <div className="relative">{children}</div>}
    </div>
  )
}
