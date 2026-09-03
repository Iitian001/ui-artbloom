"use client"

import { useEffect, useRef, useState } from "react"

import { DEMOS } from "@/components/demos"
import { cn } from "@/lib/utils"

/** Renders children only once the box has been near the viewport. */
function useNearViewport<T extends HTMLElement>(rootMargin = "300px") {
  const ref = useRef<T>(null)
  const [near, setNear] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node || near) return
    if (typeof IntersectionObserver === "undefined") {
      setNear(true)
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true)
          observer.disconnect()
        }
      },
      { rootMargin },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [near, rootMargin])

  return [ref, near] as const
}

export type ItemPreviewProps = {
  name: string
  kind: "templates" | "animations" | "components"
  /** Frame height in px. */
  height?: number
  /** Force a dark surface behind the demo. */
  dark?: boolean
  className?: string
  /** Viewport width the template iframe is rendered at before scaling. */
  frameWidth?: number
}

/**
 * The live preview shown on every card and item page.
 *
 * Animations and components mount their real demo. Templates load the real page
 * in an iframe at desktop width and scale it down, so a card shows the actual
 * rendered template rather than a screenshot that can go stale.
 */
export function ItemPreview({
  name,
  kind,
  height = 240,
  dark = false,
  className,
  frameWidth = 1440,
}: ItemPreviewProps) {
  const [wrapRef, near] = useNearViewport<HTMLDivElement>()
  const [width, setWidth] = useState(0)

  useEffect(() => {
    const node = wrapRef.current
    if (!node) return
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width))
    observer.observe(node)
    return () => observer.disconnect()
  }, [wrapRef])

  const isTemplate = kind === "templates"
  const scale = width > 0 ? width / frameWidth : 0

  return (
    <div
      ref={wrapRef}
      style={{ height }}
      className={cn(
        "relative w-full overflow-hidden bg-subtle",
        dark && "dark bg-[oklch(0.145_0_0)]",
        className,
      )}
    >
      {!near && <div className="size-full animate-pulse bg-muted/40" />}

      {near && isTemplate && scale > 0 && (
        <iframe
          src={`/preview/${name}`}
          title={`${name} preview`}
          loading="lazy"
          tabIndex={-1}
          aria-hidden
          sandbox="allow-scripts allow-same-origin"
          className="pointer-events-none absolute top-0 left-0 origin-top-left border-0"
          style={{
            width: frameWidth,
            height: height / scale,
            transform: `scale(${scale})`,
          }}
        />
      )}

      {near && !isTemplate && (
        <div className="size-full">
          {DEMOS[name] ?? (
            <div className="flex size-full items-center justify-center text-xs text-muted-foreground">
              No demo yet
            </div>
          )}
        </div>
      )}
    </div>
  )
}
