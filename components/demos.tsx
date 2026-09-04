"use client"

import type { ReactNode } from "react"

import { AuroraBackground } from "@/registry/animations/aurora-background"
import { BalanceProgress } from "@/registry/animations/balance-progress"
import { ChipPile } from "@/registry/animations/chip-pile"
import { EulerDiskSpinner } from "@/registry/animations/euler-disk-spinner"
import { FlockSearch } from "@/registry/animations/flock-search"
import { HeatGrid } from "@/registry/animations/heat-grid"
import { LiquidNav } from "@/registry/animations/liquid-nav"
import { Marquee } from "@/registry/animations/marquee"
import { MorphogenWordmark } from "@/registry/animations/morphogen-wordmark"
import { NumberTicker } from "@/registry/animations/number-ticker"
import { PressureButton } from "@/registry/animations/pressure-button"
import { PullCord } from "@/registry/animations/pull-cord"
import { ShadowCaster } from "@/registry/animations/shadow-caster"
import { SloshGauge } from "@/registry/animations/slosh-gauge"
import { TextShimmer } from "@/registry/animations/text-shimmer"

/**
 * One demo per registry item, keyed by `name`.
 *
 * These are the *only* thing a card renders — no screenshots. That means the
 * catalog can never drift from the code, and it is why adding an item requires
 * an entry here.
 *
 * Templates are the exception: `ItemPreview` renders `kind: "templates"` in an
 * iframe pointed at `/preview/<name>`, so the templates in the catalog are
 * absent from this map by design, not by omission.
 */
export const DEMOS: Record<string, ReactNode> = {
  "text-shimmer": (
    <div className="flex size-full items-center justify-center p-6">
      <TextShimmer className="text-2xl font-medium tracking-tight" duration={2.2}>
        Generating your interface…
      </TextShimmer>
    </div>
  ),

  "number-ticker": (
    <div className="flex size-full flex-col items-center justify-center gap-1 p-6">
      <span className="text-5xl font-semibold tracking-tighter">
        <NumberTicker value={25431} />
      </span>
      <span className="text-xs text-muted-foreground">installs this week</span>
    </div>
  ),

  marquee: (
    <div className="flex size-full items-center">
      <Marquee duration={18} gap="2.5rem" pauseOnHover>
        {["Vercel", "Linear", "Raycast", "Framer", "Stripe", "Notion"].map((name) => (
          <span key={name} className="text-lg font-medium tracking-tight text-muted-foreground">
            {name}
          </span>
        ))}
      </Marquee>
    </div>
  ),

  // Not a catalog item — the site's own chrome renders `AuroraBackground`, so the
  // file stays on disk while the entry stays unreachable. `ItemPreview` only ever
  // reads `DEMOS[item.name]`, so this key renders nowhere and advertises nothing.
  // It exists to keep the import honest; delete both together or neither.
  "aurora-background": (
    <AuroraBackground className="flex size-full items-center justify-center" fadeBottom={false}>
      <p className="px-6 text-center text-xl font-semibold tracking-tight">
        Slow light, no canvas
      </p>
    </AuroraBackground>
  ),

  /* The stage animations. Each one paints its own full-bleed surface and owns its
     own controls, so the demo is the component and nothing else — no wrapper, no
     padding. Every one integrates its equation at a fixed step, so what a card
     shows is what the install runs. */
  "chip-pile": <ChipPile />,
  "liquid-nav": <LiquidNav />,
  "pull-cord": <PullCord />,
  "shadow-caster": <ShadowCaster />,
  "slosh-gauge": <SloshGauge />,
  "balance-progress": <BalanceProgress />,
  "euler-disk-spinner": <EulerDiskSpinner />,
  "flock-search": <FlockSearch />,
  "heat-grid": <HeatGrid />,
  "morphogen-wordmark": <MorphogenWordmark />,
  "pressure-button": <PressureButton />,
}

/**
 * The *card* demo for each item, keyed by `name` — what the catalogue grid
 * renders, and the only preview a visitor can touch without leaving the page.
 *
 * Why a second map instead of reusing `DEMOS` at a smaller size: a stage demo is
 * a marketing section — a headline in `vw`, a paragraph under it, a button, and a
 * ~27rem canvas behind all of it. A 298x240 card cannot hold that, and scaling it
 * to fit produced the thing it replaced: a 19px headline over 8px body copy with
 * the mechanism landing on the words. So the card demo is the same component with
 * `compact` set — copy dropped, padding cut, the mechanism given the whole box —
 * authored for this size rather than shrunk into it.
 *
 * Two hard requirements for every entry, because `ItemPreview` marks the card
 * frame `aria-hidden` and leaves it pointer-live:
 *
 * 1. Nothing tabbable. The card's own title link is the accessible path to the
 *    item; controls inside a compact demo stay clickable but take `tabIndex={-1}`.
 * 2. Vertical scrolling still works. A drag surface that claims `touch-action:
 *    none` traps the page on a touch screen, so compact stages use `pan-y`.
 *
 * An item with no entry here falls back to the scaled full stage, which is worse
 * but legible — see `ItemPreview`'s `wantsScale`.
 */
export const CARD_DEMOS: Record<string, ReactNode> = {
  /* The three fluid ones size themselves to whatever box they are given, so a
     card entry is just tighter type — no `compact` prop to pass. `pauseOnHover`
     stays on the marquee: it is the one place where hovering a card is meant to
     do something. */
  "text-shimmer": (
    <div className="flex size-full items-center justify-center p-5">
      <TextShimmer className="text-lg font-medium tracking-tight" duration={2.2}>
        Generating your interface…
      </TextShimmer>
    </div>
  ),

  "number-ticker": (
    <div className="flex size-full flex-col items-center justify-center gap-1 p-5">
      <span className="text-4xl font-semibold tracking-tighter">
        <NumberTicker value={25431} />
      </span>
      <span className="text-[11px] text-muted-foreground">installs this week</span>
    </div>
  ),

  /* Three rows, not one. A single band of names centred in a 240px frame left the
     card ninety percent empty and put one of the component's six props on screen;
     three rows at different speeds with the middle one reversed fills the box and
     shows `reverse`, `duration` and `fade` at a glance. `pauseOnHover` is on every
     row, so the whole card stops together under one pointer.

     13px on a 1.5rem gap, not the 15px/2rem this started at: at 296px the wider
     setting fitted about two and a half names between the edge fades, so most of
     what was on screen was a partial word and the card read as clipped text. */
  marquee: (
    <div className="flex size-full flex-col justify-center gap-3.5">
      {[
        { back: false, d: 22, key: "a", names: ["Vercel", "Linear", "Raycast", "Framer"] },
        { back: true, d: 17, key: "b", names: ["Stripe", "Notion", "Figma", "Supabase"] },
        { back: false, d: 27, key: "c", names: ["Cloudflare", "Resend", "Clerk", "Neon"] },
      ].map((row) => (
        <Marquee duration={row.d} fade gap="1.5rem" key={row.key} pauseOnHover reverse={row.back}>
          {row.names.map((name) => (
            <span
              className="text-[13px] font-medium tracking-tight whitespace-nowrap text-muted-foreground"
              key={name}
            >
              {name}
            </span>
          ))}
        </Marquee>
      ))}
    </div>
  ),

  /* The stage animations, each in its own card variant. */
  "chip-pile": <ChipPile compact />,
  "liquid-nav": <LiquidNav compact />,
  "pull-cord": <PullCord compact />,
  "shadow-caster": <ShadowCaster compact />,
  "slosh-gauge": <SloshGauge compact />,
  "balance-progress": <BalanceProgress compact />,
  "euler-disk-spinner": <EulerDiskSpinner compact />,
  "flock-search": <FlockSearch compact />,
  "heat-grid": <HeatGrid compact />,
  "morphogen-wordmark": <MorphogenWordmark compact />,
  "pressure-button": <PressureButton compact />,
}

