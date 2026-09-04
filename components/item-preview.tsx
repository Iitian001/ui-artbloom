"use client"

import { useEffect, useRef, useState } from "react"

import { CARD_DEMOS, DEMOS } from "@/components/demos"
import type { Kind } from "@/lib/categories"
import { cn } from "@/lib/utils"

/** How close to the viewport the frame has to get before its demo mounts. */
const REACH = 300

/**
 * Renders children once the box has been near the viewport.
 *
 * Two ways in, because a card that never mounts its demo is the worst failure
 * this component has: the visitor gets a grey pulsing rectangle, indistinguishable
 * from a slow network, and the catalogue looks broken rather than empty.
 *
 * 1. A synchronous rect check. Everything already on screen is decided on the
 *    first effect — no callback and no frame to wait for.
 * 2. The observer, for everything scrolled to later, with `scroll` and `resize`
 *    behind it doing the same rect check. An `IntersectionObserver` that is
 *    constructed and then never called is indistinguishable from one that is
 *    correctly waiting, and that is not hypothetical: in a non-composited or
 *    embedded view the callbacks simply never arrive and every frame on the page
 *    stays on its skeleton for good.
 *
 * Deliberately not a timeout, which was the other way to cover the silent
 * observer: several of these scenes do real work in `setup` — the reaction-
 * diffusion field warms 1.8e7 cell-steps before its first paint — so mounting
 * fourteen of them at once on a timer trades a stuck skeleton for a stall. The
 * rect check mounts a demo only when it is genuinely within reach, which is what
 * the observer was for.
 */
function useNearViewport<T extends HTMLElement>(rootMargin = `${REACH}px`) {
  const ref = useRef<T>(null)
  const [near, setNear] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node || near) return

    const reached = () => {
      const box = node.getBoundingClientRect()
      // `innerHeight` reads 0 in a hidden tab, which makes this false rather than
      // true — the listeners below are what pick it up once the view has a size.
      return box.bottom > -REACH && box.top < window.innerHeight + REACH
    }
    if (reached()) {
      setNear(true)
      return
    }

    const observer =
      typeof IntersectionObserver === "undefined"
        ? undefined
        : new IntersectionObserver(
            ([entry]) => {
              if (entry.isIntersecting) setNear(true)
            },
            { rootMargin },
          )
    observer?.observe(node)

    // Capture, so a grid that scrolls inside its own container is heard too:
    // `scroll` does not bubble, but it does pass through the capture phase.
    const settle = () => {
      if (!reached()) return
      setNear(true)
      drop()
    }
    const drop = () => {
      window.removeEventListener("scroll", settle, true)
      window.removeEventListener("resize", settle)
    }
    window.addEventListener("scroll", settle, { capture: true, passive: true })
    window.addEventListener("resize", settle)

    return () => {
      observer?.disconnect()
      drop()
    }
  }, [near, rootMargin])

  return [ref, near] as const
}

export type ItemPreviewProps = {
  name: string
  kind: Kind
  /** Frame height in px. */
  height?: number
  /** Force a dark surface behind the demo. */
  dark?: boolean
  className?: string
  /** Viewport width the template iframe is rendered at before scaling. */
  frameWidth?: number
  /**
   * The stage height the demo was authored against — normally the item's own
   * `previewHeight`. Only consulted for the scaled fallback below: an animation
   * with no card composition yet is rendered at its authored height and the whole
   * box scaled down, instead of being cropped.
   */
  designHeight?: number
  /**
   * Render the animation's *card* composition — `CARD_DEMOS[name]` — and let the
   * visitor touch it.
   *
   * The full stage is a marketing section: a headline in `vw`, a paragraph, a
   * button, and a 27rem canvas under all of it. Dropped in a 298x240 card and
   * scaled to 0.55 it became a 19px headline over 8px body copy with the chips
   * landing on the words. The card composition is the same component with the
   * copy dropped and the mechanism made the whole subject, authored for this box
   * at this size, so nothing is scaled and nothing overlaps.
   *
   * Live, not a poster: no `pointer-events-none` and no `inert`, so the pile can
   * be dragged and the cord pulled without leaving the grid. `aria-hidden`
   * instead, because the card's own title link already names the item and a card
   * composition renders nothing tabbable — that is a requirement of every entry
   * in `CARD_DEMOS`, not an accident of the ones written so far.
   */
  compact?: boolean
  /**
   * Mount the full stage at natural size, fully interactive and focusable —
   * pointer coordinates, canvas resolution and 11px hint type all exactly what an
   * install produces. The item page and the landing showcase use this; neither
   * wraps the preview in a link.
   */
  interactive?: boolean
}

/**
 * The live preview shown on every card and item page.
 *
 * Templates load the real page in an iframe at desktop width and scale it down,
 * so a card shows the actual rendered template rather than a screenshot that can
 * go stale. Everything else mounts its real demo — either the card composition
 * (`compact`) or the full stage.
 */
export function ItemPreview({
  name,
  kind,
  height = 240,
  dark = false,
  className,
  frameWidth = 1440,
  designHeight,
  compact = false,
  interactive = false,
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

  /**
   * A card composition, when the item has one. This is the only branch that is
   * both unscaled and touchable, and it is what the catalogue grid renders.
   */
  const card = compact && !isTemplate ? CARD_DEMOS[name] : undefined

  /**
   * The fallback, for an animation registered before its card composition is
   * written: render the full stage at its authored height and scale the whole box
   * down, so the card is a miniature of the composition rather than a crop of its
   * top-left corner. Kept deliberately — a new item shows up legibly on day one
   * instead of showing its top half — but it is the worse of the two, and an entry
   * in `CARD_DEMOS` retires it for that item.
   */
  const wantsScale =
    !isTemplate && !card && !interactive && !!designHeight && designHeight > height
  const demoScale = wantsScale ? height / designHeight! : 1
  /*
   * Both branches that are sized from the measured width — the template iframe and
   * the scaled fallback — have to wait for the `ResizeObserver` to report one.
   *
   * Without the template half of this test a card spent a commit with `near` true,
   * `demoReady` true and `scale` still 0, which satisfies the skeleton's condition
   * and fails the iframe's: an empty frame with nothing in it at all. That was one
   * frame back when `near` could only flip on an intersection callback, by which
   * time a width had long since arrived. It is the *first* commit now that the rect
   * check answers synchronously, and it never resolves at all in a view where the
   * observers are the thing that stays silent.
   */
  const demoReady = isTemplate || wantsScale ? width > 0 : true
  /** Pointer-live: the card composition, or the full stage on a page. */
  const live = !!card || interactive

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
      {(!near || !demoReady) && <div className="size-full animate-pulse bg-muted/40" />}

      {near && isTemplate && scale > 0 && (
        <iframe
          src={`/preview/${name}`}
          title={`${name} preview`}
          loading="lazy"
          tabIndex={-1}
          aria-hidden
          inert
          sandbox="allow-scripts allow-same-origin"
          className="pointer-events-none absolute top-0 left-0 origin-top-left border-0"
          style={{
            width: frameWidth,
            height: height / scale,
            transform: `scale(${scale})`,
          }}
        />
      )}
      {near && !isTemplate && demoReady && (
        // `interactive` is the only branch that joins the tab order and the
        // accessibility tree. A card composition is pointer-live but hidden from
        // AT — the card's title link names the item, and the composition renders
        // nothing tabbable, so there is no focusable content behind the
        // `aria-hidden`. The scaled fallback is a poster: `inert` on top of
        // `tabIndex={-1}`, because `tabIndex` only blanks this node and `inert` is
        // the part that reaches a demo's own button inside it.
        <div
          tabIndex={interactive ? undefined : -1}
          aria-hidden={interactive ? undefined : true}
          inert={live ? undefined : true}
          className={cn(
            !live && "pointer-events-none",
            wantsScale ? "absolute top-0 left-0 origin-top-left" : "size-full",
          )}
          style={
            wantsScale
              ? {
                  width: width / demoScale,
                  height: designHeight,
                  transform: `scale(${demoScale})`,
                }
              : undefined
          }
        >
          {card ??
            DEMOS[name] ?? (
              <div className="flex size-full items-center justify-center text-xs text-muted-foreground">
                No demo yet
              </div>
            )}
        </div>
      )}
    </div>
  )
}
