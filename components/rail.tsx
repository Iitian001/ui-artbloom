"use client"

import { type ReactNode, useCallback, useEffect, useRef, useState } from "react"
import Link from "next/link"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

import { cn } from "@/lib/utils"

export type RailProps = {
  title: string
  subtitle?: string
  viewAllHref?: string
  children: ReactNode
  /** Tailwind basis classes controlling how many cards fit per screen. */
  itemClassName?: string
  className?: string
}

/**
 * A horizontally scrolling row of cards with a heading and an optional "View
 * all". Arrows appear only when there is somewhere to scroll, and only on
 * pointer devices — touch users just swipe.
 */
export function Rail({
  title,
  subtitle,
  viewAllHref,
  children,
  itemClassName = "w-[19rem] sm:w-[21rem] lg:w-[23rem]",
  className,
}: RailProps) {
  const scroller = useRef<HTMLDivElement>(null)
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(true)

  const measure = useCallback(() => {
    const node = scroller.current
    if (!node) return
    const max = node.scrollWidth - node.clientWidth
    setAtStart(node.scrollLeft <= 2)
    setAtEnd(node.scrollLeft >= max - 2)
  }, [])

  useEffect(() => {
    measure()
    const node = scroller.current
    if (!node) return
    const observer = new ResizeObserver(measure)
    observer.observe(node)
    return () => observer.disconnect()
  }, [measure])

  function nudge(direction: 1 | -1) {
    const node = scroller.current
    if (!node) return
    node.scrollBy({ left: direction * node.clientWidth * 0.85, behavior: "smooth" })
  }

  const hasArrows = !(atStart && atEnd)

  return (
    <section className={cn("min-w-0", className)}>
      <div className="container-page mb-4 flex items-end justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
          {subtitle && <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p>}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {viewAllHref && (
            <Link
              href={viewAllHref}
              className="text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              View all
            </Link>
          )}
          {hasArrows && (
            <div className="hidden items-center gap-1 md:flex">
              <button
                type="button"
                aria-label={`Scroll ${title} left`}
                onClick={() => nudge(-1)}
                disabled={atStart}
                className="flex size-7 cursor-pointer items-center justify-center rounded-full border border-border bg-secondary/60 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:opacity-35"
              >
                <ChevronLeftIcon className="size-4" />
              </button>
              <button
                type="button"
                aria-label={`Scroll ${title} right`}
                onClick={() => nudge(1)}
                disabled={atEnd}
                className="flex size-7 cursor-pointer items-center justify-center rounded-full border border-border bg-secondary/60 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:opacity-35"
              >
                <ChevronRightIcon className="size-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      <div
        ref={scroller}
        onScroll={measure}
        className="scrollbar-none flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-4 pb-1 sm:px-6 lg:px-8"
      >
        {/* Each child is wrapped so callers pass plain cards. */}
        {Array.isArray(children)
          ? children.map((child, i) => (
              <div key={i} className={cn("shrink-0 snap-start", itemClassName)}>
                {child}
              </div>
            ))
          : children}
      </div>
    </section>
  )
}
