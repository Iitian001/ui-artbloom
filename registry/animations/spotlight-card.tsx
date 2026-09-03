"use client"

import { type ReactNode, useCallback, useRef, useState } from "react"
import { motion, useMotionTemplate, useMotionValue } from "motion/react"

import { cn } from "@/lib/utils"

export type SpotlightCardProps = {
  children: ReactNode
  className?: string
  /** Radius of the glow in px. */
  size?: number
  /** Any CSS color. Keep the alpha low — this sits on top of content. */
  color?: string
}

/**
 * A card that lights up under the cursor. Pointer position lives in
 * MotionValues, so tracking never triggers a React render — only the mask's
 * CSS custom properties change.
 */
export function SpotlightCard({
  children,
  className,
  size = 340,
  color = "rgba(255,255,255,0.10)",
}: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(-size)
  const mouseY = useMotionValue(-size)
  const [visible, setVisible] = useState(false)

  const onMove = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const bounds = ref.current?.getBoundingClientRect()
      if (!bounds) return
      mouseX.set(event.clientX - bounds.left)
      mouseY.set(event.clientY - bounds.top)
    },
    [mouseX, mouseY],
  )

  const background = useMotionTemplate`radial-gradient(${size}px circle at ${mouseX}px ${mouseY}px, ${color}, transparent 70%)`

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      className={cn(
        "group relative overflow-hidden rounded-xl border border-border bg-card",
        className,
      )}
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{ background, opacity: visible ? 1 : 0 }}
      />
      <div className="relative">{children}</div>
    </div>
  )
}
