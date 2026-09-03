"use client"

import { useEffect, useRef } from "react"

/**
 * Parallaxes the hero artwork against the pointer.
 *
 * Two things worth keeping if you edit this: the listener is passive (it never
 * calls preventDefault, so it must not block scrolling), and it writes CSS custom
 * properties instead of `transform` directly — the transform stays in the
 * stylesheet where the transition lives.
 */
export function HeroMotion({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    /*
     * Skip the effect entirely for anyone who asked for less motion, and on the
     * mobile layout where the artwork is in the flow rather than floating.
     */
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")
    const narrow = window.matchMedia("(max-width: 900px)")

    const move = (event: PointerEvent) => {
      if (reduced.matches || narrow.matches) return
      const x = (event.clientX / window.innerWidth - 0.5) * 8
      const y = (event.clientY / window.innerHeight - 0.5) * 6
      node.style.setProperty("--hero-x", `${x}px`)
      node.style.setProperty("--hero-y", `${y}px`)
    }

    const reset = () => {
      node.style.removeProperty("--hero-x")
      node.style.removeProperty("--hero-y")
    }

    window.addEventListener("pointermove", move, { passive: true })
    reduced.addEventListener("change", reset)
    narrow.addEventListener("change", reset)
    return () => {
      window.removeEventListener("pointermove", move)
      reduced.removeEventListener("change", reset)
      narrow.removeEventListener("change", reset)
    }
  }, [])

  return (
    <div ref={ref} className="heroMotion">
      {children}
    </div>
  )
}
