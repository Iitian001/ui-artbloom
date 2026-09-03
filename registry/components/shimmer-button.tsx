"use client"

import type { CSSProperties, ComponentProps } from "react"

import { cn } from "@/lib/utils"

export type ShimmerButtonProps = ComponentProps<"button"> & {
  /** Colour of the travelling highlight. */
  shimmerColor?: string
  /** Thickness of the lit border. */
  shimmerSize?: string
  /** Seconds for one lap. */
  shimmerDuration?: number
  background?: string
  borderRadius?: string
}

/**
 * A button with a highlight that laps its border. The spinning conic gradient
 * is masked to a 1px ring by an inset child, which keeps the fill flat and the
 * motion confined to the edge.
 */
export function ShimmerButton({
  children,
  className,
  shimmerColor = "#ffffff",
  shimmerSize = "0.06em",
  shimmerDuration = 2.4,
  background = "rgba(9, 9, 11, 1)",
  borderRadius = "100px",
  ...props
}: ShimmerButtonProps) {
  return (
    <button
      {...props}
      style={
        {
          "--shimmer-color": shimmerColor,
          "--radius": borderRadius,
          "--speed": `${shimmerDuration}s`,
          "--cut": shimmerSize,
          "--bg": background,
          "--spread": "90deg",
        } as CSSProperties
      }
      className={cn(
        "group relative z-0 flex cursor-pointer items-center justify-center overflow-hidden",
        "whitespace-nowrap border border-white/10 px-6 py-3 text-sm font-medium text-white",
        "[background:var(--bg)] [border-radius:var(--radius)]",
        "transition-transform duration-300 active:translate-y-px",
        "focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:outline-none",
        className,
      )}
    >
      {/* The lit ring: a spinning conic gradient clipped to the border box. */}
      <span
        aria-hidden
        className="absolute inset-0 -z-30 overflow-visible blur-[2px] [container-type:size]"
      >
        <span className="absolute inset-0 h-[100cqh] animate-[spin-around_calc(var(--speed)*2)_infinite_linear] [aspect-ratio:1] [border-radius:0] [mask:none]">
          <span className="absolute inset-[-100%] w-auto rotate-0 [background:conic-gradient(from_calc(270deg-(var(--spread)*0.5)),transparent_0,var(--shimmer-color)_var(--spread),transparent_var(--spread))] [translate:0_0]" />
        </span>
      </span>

      <span className="relative z-10">{children}</span>

      {/* Highlight sweep across the face on hover. */}
      <span
        aria-hidden
        className={cn(
          "absolute inset-0 size-full",
          "rounded-2xl px-4 py-1.5 text-sm font-medium shadow-[inset_0_-8px_10px_#ffffff1f]",
          "transform-gpu transition-all duration-300 ease-in-out",
          "group-hover:shadow-[inset_0_-6px_10px_#ffffff3f]",
          "group-active:shadow-[inset_0_-10px_10px_#ffffff3f]",
        )}
      />

      {/* Flat backdrop that hides the gradient everywhere except the edge. */}
      <span
        aria-hidden
        className="absolute -z-20 [background:var(--bg)] [border-radius:var(--radius)] [inset:var(--cut)]"
      />
    </button>
  )
}
