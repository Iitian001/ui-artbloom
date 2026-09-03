"use client"

import { useCallback, useEffect, useState } from "react"
import { AnimatePresence, motion } from "motion/react"

import { cn } from "@/lib/utils"

export type Testimonial = {
  quote: string
  name: string
  role: string
  /** Square image works best. */
  src: string
}

export type AnimatedTestimonialsProps = {
  testimonials: Testimonial[]
  /** Advance on a timer. Set 0 to disable. */
  autoplay?: number
  className?: string
}

/**
 * Card-stack testimonials. The image deck rotates each card by a stable
 * pseudo-random amount so the pile looks hand-placed rather than tiled, and the
 * quote reveals word by word.
 */
export function AnimatedTestimonials({
  testimonials,
  autoplay = 5000,
  className,
}: AnimatedTestimonialsProps) {
  const [active, setActive] = useState(0)
  const count = testimonials.length

  const next = useCallback(() => setActive((i) => (i + 1) % count), [count])
  const prev = useCallback(() => setActive((i) => (i - 1 + count) % count), [count])

  useEffect(() => {
    if (!autoplay || count < 2) return
    const id = setInterval(next, autoplay)
    return () => clearInterval(id)
  }, [autoplay, next, count])

  if (count === 0) return null
  const current = testimonials[active]

  // Deterministic tilt keyed to index — same on server and client.
  const tilt = (i: number) => ((i * 37) % 21) - 10

  return (
    <div className={cn("mx-auto grid max-w-4xl gap-12 md:grid-cols-2 md:gap-20", className)}>
      <div className="relative h-72 w-full sm:h-80">
        <AnimatePresence>
          {testimonials.map((item, i) => (
            <motion.div
              key={item.src + i}
              initial={{ opacity: 0, scale: 0.92, y: 24, rotate: tilt(i) }}
              animate={{
                opacity: i === active ? 1 : 0.65,
                scale: i === active ? 1 : 0.94,
                y: i === active ? 0 : 12,
                zIndex: i === active ? count : count - Math.abs(i - active),
                rotate: i === active ? 0 : tilt(i),
              }}
              exit={{ opacity: 0, scale: 0.92, y: -24 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 origin-bottom"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.src}
                alt={item.name}
                draggable={false}
                className="size-full rounded-2xl border border-border object-cover object-center"
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="flex flex-col justify-between py-2">
        <motion.div
          key={active}
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <h3 className="text-xl font-semibold tracking-tight">{current.name}</h3>
          <p className="text-sm text-muted-foreground">{current.role}</p>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            {current.quote.split(" ").map((word, i) => (
              <motion.span
                key={`${active}-${i}`}
                initial={{ filter: "blur(8px)", opacity: 0, y: 4 }}
                animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
                transition={{ duration: 0.2, ease: "easeOut", delay: 0.015 * i }}
                className="inline-block"
              >
                {word}&nbsp;
              </motion.span>
            ))}
          </p>
        </motion.div>

        <div className="flex gap-3 pt-10">
          <button
            type="button"
            onClick={prev}
            aria-label="Previous testimonial"
            className="group/btn flex size-8 items-center justify-center rounded-full border border-border bg-secondary transition-colors hover:bg-accent"
          >
            <span aria-hidden className="transition-transform group-hover/btn:-translate-x-0.5">←</span>
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next testimonial"
            className="group/btn flex size-8 items-center justify-center rounded-full border border-border bg-secondary transition-colors hover:bg-accent"
          >
            <span aria-hidden className="transition-transform group-hover/btn:translate-x-0.5">→</span>
          </button>
        </div>
      </div>
    </div>
  )
}
