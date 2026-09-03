"use client"

import { type ReactNode, useRef, useState } from "react"
import { motion } from "motion/react"

import { cn } from "@/lib/utils"

export type MagneticProps = {
  children: ReactNode
  className?: string
  /** 0 = inert, 1 = element pins to the cursor. */
  strength?: number
  /** How far outside the element the pull still applies, in px. */
  padding?: number
}

/**
 * Pulls its child toward the cursor and springs back on exit. The hit area is
 * expanded by `padding` so the pull begins slightly before the pointer arrives.
 */
export function Magnetic({
  children,
  className,
  strength = 0.35,
  padding = 24,
}: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [offset, setOffset] = useState({ x: 0, y: 0 })

  function handleMove(event: React.MouseEvent<HTMLDivElement>) {
    const bounds = ref.current?.getBoundingClientRect()
    if (!bounds) return
    const centerX = bounds.left + bounds.width / 2
    const centerY = bounds.top + bounds.height / 2
    setOffset({
      x: (event.clientX - centerX) * strength,
      y: (event.clientY - centerY) * strength,
    })
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={() => setOffset({ x: 0, y: 0 })}
      className={cn("inline-flex", className)}
      style={{ padding }}
    >
      <motion.div
        animate={offset}
        transition={{ type: "spring", stiffness: 180, damping: 15, mass: 0.4 }}
      >
        {children}
      </motion.div>
    </div>
  )
}
