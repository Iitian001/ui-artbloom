"use client"

import { useCallback, useEffect, useRef, useState } from "react"

/**
 * The canvas preamble every 2D scene needs, in one place: a DPR-scaled backing
 * store, a rebuild on resize, a loop that stops when the stage scrolls out of
 * view, pointer tracking with per-frame deltas, and teardown.
 *
 * A scene supplies two functions. `setup` builds whatever mutable state the
 * animation owns and is re-run whenever the stage changes size, so the state can
 * be sized to the stage without ever being resized in place. `draw` paints one
 * frame from that state — it is called with the transform already scaled to
 * device pixels, so every coordinate in it is a CSS pixel.
 */

export type ScenePointer = {
  x: number
  y: number
  /** Position at the previous painted frame, so `x - lastX` is a frame delta. */
  lastX: number
  lastY: number
  down: boolean
  inside: boolean
}

export type SceneSetupContext = {
  context: CanvasRenderingContext2D
  width: number
  height: number
  dpr: number
}

export type SceneDrawContext<State> = SceneSetupContext & {
  state: State
  pointer: ScenePointer
  /** Painted frames since the last rebuild. Useful for every-Nth-frame work. */
  frame: number
}

export type CanvasSceneOptions<State> = {
  setup: (context: SceneSetupContext) => State
  draw: (context: SceneDrawContext<State>) => void
}

export type CanvasScene = {
  /** The sizing element. Owns the pointer listeners and is what is observed. */
  stageRef: (node: HTMLDivElement | null) => void
  canvasRef: (node: HTMLCanvasElement | null) => void
  /** Paint one frame now. The escape hatch for a paused or reduced-motion loop. */
  requestRender: () => void
}

/** Live `prefers-reduced-motion`. False during SSR and the first paint. */
export function useReducedMotion() {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReduced(query.matches)
    const onChange = () => setReduced(query.matches)
    query.addEventListener("change", onChange)
    return () => query.removeEventListener("change", onChange)
  }, [])

  return reduced
}

export function useCanvasScene<State>(options: CanvasSceneOptions<State>): CanvasScene {
  const reduced = useReducedMotion()

  /*
   * `draw` is usually an inline closure, so it is a new function on every
   * render. Reading it through a ref keeps the loop from being torn down and
   * the scene from being rebuilt each time the component re-renders.
   */
  const optionsRef = useRef(options)
  optionsRef.current = options

  const stage = useRef<HTMLDivElement | null>(null)
  const canvas = useRef<HTMLCanvasElement | null>(null)
  const [mounted, setMounted] = useState(0)

  const stageRef = useCallback((node: HTMLDivElement | null) => {
    stage.current = node
    setMounted((n) => n + 1)
  }, [])
  const canvasRef = useCallback((node: HTMLCanvasElement | null) => {
    canvas.current = node
    setMounted((n) => n + 1)
  }, [])

  /** Set once the scene is live, so `requestRender` before that is a no-op. */
  const render = useRef<(() => void) | null>(null)
  const requestRender = useCallback(() => render.current?.(), [])

  useEffect(() => {
    const stageNode = stage.current
    const canvasNode = canvas.current
    if (!stageNode || !canvasNode) return

    const context = canvasNode.getContext("2d")
    if (!context) return

    const pointer: ScenePointer = {
      x: 0,
      y: 0,
      lastX: 0,
      lastY: 0,
      down: false,
      inside: false,
    }

    let state: State | null = null
    let width = 0
    let height = 0
    let dpr = 1
    let frame = 0
    let loop = 0
    let pending = 0
    let visible = true

    /** Rebuild the backing store and the scene state for the current size. */
    const measure = () => {
      const rect = stageNode.getBoundingClientRect()
      const nextWidth = Math.max(1, Math.round(rect.width))
      const nextHeight = Math.max(1, Math.round(rect.height))
      const nextDpr = Math.min(2, window.devicePixelRatio || 1)
      if (nextWidth === width && nextHeight === height && nextDpr === dpr && state) return

      width = nextWidth
      height = nextHeight
      dpr = nextDpr
      canvasNode.width = Math.round(width * dpr)
      canvasNode.height = Math.round(height * dpr)
      canvasNode.style.width = `${width}px`
      canvasNode.style.height = `${height}px`
      frame = 0
      state = optionsRef.current.setup({ context, width, height, dpr })
    }

    const paint = () => {
      if (!state) return
      // Re-applied every frame: a scene is free to install its own transform
      // for a cell or a sprite, and most do.
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
      optionsRef.current.draw({ context, width, height, dpr, state, pointer, frame })
      pointer.lastX = pointer.x
      pointer.lastY = pointer.y
      frame += 1
    }

    /** One frame on the next tick, coalescing however many were asked for. */
    const paintOnce = () => {
      if (pending) return
      pending = requestAnimationFrame(() => {
        pending = 0
        measure()
        paint()
      })
    }
    render.current = paintOnce

    const tick = () => {
      loop = requestAnimationFrame(tick)
      if (visible) paint()
    }

    const start = () => {
      if (loop || reduced) return
      loop = requestAnimationFrame(tick)
    }
    const stop = () => {
      if (!loop) return
      cancelAnimationFrame(loop)
      loop = 0
    }

    const at = (event: PointerEvent) => {
      const rect = stageNode.getBoundingClientRect()
      pointer.x = event.clientX - rect.left
      pointer.y = event.clientY - rect.top
      // A frozen loop still owes the user feedback for a drag.
      if (reduced) paintOnce()
    }

    const onEnter = (event: PointerEvent) => {
      pointer.inside = true
      at(event)
      pointer.lastX = pointer.x
      pointer.lastY = pointer.y
    }
    const onMove = (event: PointerEvent) => {
      pointer.inside = true
      at(event)
    }
    const onDown = (event: PointerEvent) => {
      pointer.down = true
      at(event)
      // Capture keeps a drag alive past the edge of the stage, which is where
      // a hard throw naturally ends up.
      stageNode.setPointerCapture(event.pointerId)
    }
    const onUp = (event: PointerEvent) => {
      pointer.down = false
      at(event)
      if (stageNode.hasPointerCapture(event.pointerId)) {
        stageNode.releasePointerCapture(event.pointerId)
      }
    }
    const onLeave = () => {
      pointer.inside = false
      pointer.down = false
      if (reduced) paintOnce()
    }

    stageNode.addEventListener("pointerenter", onEnter)
    stageNode.addEventListener("pointermove", onMove)
    stageNode.addEventListener("pointerdown", onDown)
    stageNode.addEventListener("pointerup", onUp)
    stageNode.addEventListener("pointercancel", onUp)
    stageNode.addEventListener("pointerleave", onLeave)

    const resizes = new ResizeObserver(() => paintOnce())
    resizes.observe(stageNode)

    /*
     * An animation nobody can see is heat. The observer both pauses the loop
     * and, on the way back in, repaints immediately rather than waiting a frame.
     */
    const views = new IntersectionObserver(
      (entries) => {
        visible = entries.some((entry) => entry.isIntersecting)
        if (visible) {
          start()
          paintOnce()
        } else {
          stop()
        }
      },
      { rootMargin: "120px" },
    )
    views.observe(stageNode)

    measure()
    paint()
    start()

    return () => {
      render.current = null
      stop()
      if (pending) cancelAnimationFrame(pending)
      resizes.disconnect()
      views.disconnect()
      stageNode.removeEventListener("pointerenter", onEnter)
      stageNode.removeEventListener("pointermove", onMove)
      stageNode.removeEventListener("pointerdown", onDown)
      stageNode.removeEventListener("pointerup", onUp)
      stageNode.removeEventListener("pointercancel", onUp)
      stageNode.removeEventListener("pointerleave", onLeave)
    }
  }, [mounted, reduced])

  return { stageRef, canvasRef, requestRender }
}
