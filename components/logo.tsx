import Link from "next/link"

import { brand } from "@/lib/brand"
import { cn } from "@/lib/utils"

/**
 * The mark: a six-petal bloom on a rounded tile. Drawn rather than imported so
 * it inherits currentColor and never ships an extra request.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      aria-hidden
      className={cn("size-7 shrink-0", className)}
      fill="none"
    >
      <rect width="32" height="32" rx="8" className="fill-foreground" />
      <g className="fill-background">
        {[0, 60, 120, 180, 240, 300].map((angle) => (
          <ellipse
            key={angle}
            cx="16"
            cy="10.2"
            rx="3.05"
            ry="5.3"
            transform={`rotate(${angle} 16 16)`}
            opacity="0.9"
          />
        ))}
        <circle cx="16" cy="16" r="2.5" />
      </g>
    </svg>
  )
}

export function Logo({
  className,
  showWordmark = true,
  href = "/",
}: {
  className?: string
  showWordmark?: boolean
  href?: string
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2 rounded-md transition-opacity hover:opacity-80 focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none",
        className,
      )}
    >
      <LogoMark />
      {showWordmark && (
        <span className="text-[15px] font-semibold tracking-tight whitespace-nowrap">
          {brand.wordmark}
        </span>
      )}
      <span className="sr-only">{brand.name} home</span>
    </Link>
  )
}
