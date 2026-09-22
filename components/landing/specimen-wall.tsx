"use client"

import { motion, useReducedMotion } from "motion/react"

import { ItemPreview } from "@/components/item-preview"
import type { Kind } from "@/lib/categories"
import { cn } from "@/lib/utils"

/**
 * The hero's argument, made of the product itself.
 *
 * Every tile here is a real registry item mounted live — the same `ItemPreview`
 * the catalogue uses, not a screenshot — so the wall can never show something the
 * library doesn't actually ship. The whole grid blooms in once on load (the one
 * orchestrated motion moment on the page) and then holds still; the only motion
 * after that answers a pointer. `prefers-reduced-motion` drops the bloom entirely
 * and the wall is simply there.
 *
 * Curated, not `featured()`: the hero wants pieces that read at a glance in a
 * narrow column and look composed next to each other. The five that always show
 * are the argument — two templates (a live SaaS surface and a cinematic stay), a
 * date-range picker, and two solved-physics micro-interactions you can grab: a
 * pile of chips and a switch you pull. Two more templates ride the widest layout
 * only. The date picker follows the page theme, so its light card breaks up the
 * dark stages rather than sitting in a block. Order within a column is
 * top-to-bottom; the stagger follows a flat index so the reveal sweeps
 * down-and-across rather than all at once.
 */
type Specimen = { name: string; kind: Kind; height: number; dark?: boolean }

const COLUMNS: Specimen[][] = [
  [
    { name: "pull-cord", kind: "animations", height: 240, dark: true },
    { name: "solstice", kind: "templates", height: 240 },
  ],
  [
    { name: "chip-pile", kind: "animations", height: 240, dark: true },
    { name: "date-range-picker", kind: "components", height: 248 },
    { name: "slate", kind: "templates", height: 240, dark: true },
  ],
  [
    { name: "afterglow", kind: "templates", height: 236, dark: true },
    { name: "sillage", kind: "templates", height: 312, dark: true },
  ],
]

/** Per-column vertical offset, so the three columns read as a composed wall
 *  rather than three stacks with level tops. The middle column rides highest. */
const COLUMN_OFFSET = ["lg:mt-16", "lg:mt-0", "lg:mt-24"]

/** Columns beyond the first two only appear when there's room for them. */
const COLUMN_VISIBILITY = ["", "", "hidden xl:flex"]

function Tile({
  specimen,
  index,
  still,
}: {
  specimen: Specimen
  index: number
  still: boolean
}) {
  return (
    <motion.div
      initial={still ? false : { opacity: 0, y: 28, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        delay: still ? 0 : 0.15 + index * 0.09,
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group/tile relative overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-[0_8px_30px_-12px_var(--brand)]"
    >
      <ItemPreview
        name={specimen.name}
        kind={specimen.kind}
        height={specimen.height}
        dark={specimen.dark}
        compact
      />
      {/* A whisper of the accent on hover — the wall answers the pointer without
          a gradient wash sitting on every tile at rest. */}
      <div className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover/tile:opacity-100 [background:radial-gradient(120%_80%_at_50%_0%,var(--brand),transparent_45%)] mix-blend-soft-light" />
    </motion.div>
  )
}

export function SpecimenWall({ className }: { className?: string }) {
  const reduced = useReducedMotion()
  let running = 0

  return (
    <div
      aria-hidden
      className={cn(
        "relative flex gap-4 sm:gap-5",
        // The wall is taller than it shows: the bottom is clipped and faded, so
        // it reads as a window onto a larger library rather than a fixed panel.
        "max-h-[560px] overflow-hidden [mask-image:linear-gradient(to_bottom,#000_78%,transparent)]",
        className,
      )}
    >
      {COLUMNS.map((column, colIndex) => (
        <div
          key={colIndex}
          className={cn(
            "flex flex-1 flex-col gap-4 sm:gap-5",
            COLUMN_OFFSET[colIndex],
            COLUMN_VISIBILITY[colIndex],
          )}
        >
          {column.map((specimen) => (
            <Tile
              key={specimen.name}
              specimen={specimen}
              index={running++}
              still={!!reduced}
            />
          ))}
        </div>
      ))}
    </div>
  )
}
