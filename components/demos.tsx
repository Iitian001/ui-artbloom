"use client"

import type { ReactNode } from "react"

import { AuroraThreadLoom } from "@/registry/animations/aurora-thread-loom"
import { BalanceProgress } from "@/registry/animations/balance-progress"
import { BubbleBurst } from "@/registry/animations/bubble-burst"
import { ChipPile } from "@/registry/animations/chip-pile"
import { CurtainSequence } from "@/registry/animations/curtain-sequence"
import { DestructibleMembrane } from "@/registry/animations/destructible-membrane"
import { DetentSlider } from "@/registry/animations/detent-slider"
import { DockMagnify } from "@/registry/animations/dock-magnify"
import { DominoWord } from "@/registry/animations/domino-word"
import { EulerDiskSpinner } from "@/registry/animations/euler-disk-spinner"
import { FlockSearch } from "@/registry/animations/flock-search"
import { FrostSpoiler } from "@/registry/animations/frost-spoiler"
import { GaltonHistogram } from "@/registry/animations/galton-histogram"
import { HeatGrid } from "@/registry/animations/heat-grid"
import { KelvinRamp } from "@/registry/animations/kelvin-ramp"
import { KineticKerning } from "@/registry/animations/kinetic-kerning"
import { KineticTextureMesh } from "@/registry/animations/kinetic-texture-mesh"
import { LenticularShift } from "@/registry/animations/lenticular-shift"
import { LiquidNav } from "@/registry/animations/liquid-nav"
import { LloydAvatars } from "@/registry/animations/lloyd-avatars"
import { Marquee } from "@/registry/animations/marquee"
import { MercuryDropletChoir } from "@/registry/animations/mercury-droplet-choir"
import { MoireScratch } from "@/registry/animations/moire-scratch"
import { MorphogenWordmark } from "@/registry/animations/morphogen-wordmark"
import { NumberTicker } from "@/registry/animations/number-ticker"
import { PhotonThumbnail } from "@/registry/animations/photon-thumbnail"
import { PressureButton } from "@/registry/animations/pressure-button"
import { PullCord } from "@/registry/animations/pull-cord"
import { PulseChoir } from "@/registry/animations/pulse-choir"
import { RelaxationTyping } from "@/registry/animations/relaxation-typing"
import { RippleTank } from "@/registry/animations/ripple-tank"
import { RollbackOrbit } from "@/registry/animations/rollback-orbit"
import { ScanlineMarquee } from "@/registry/animations/scanline-marquee"
import { ShadowCaster } from "@/registry/animations/shadow-caster"
import { SheetFold } from "@/registry/animations/sheet-fold"
import { ShutterCompare } from "@/registry/animations/shutter-compare"
import { SloshGauge } from "@/registry/animations/slosh-gauge"
import { SnapToggle } from "@/registry/animations/snap-toggle"
import { SplitShutter } from "@/registry/animations/split-shutter"
import { TextShimmer } from "@/registry/animations/text-shimmer"
import { ToastStack } from "@/registry/animations/toast-stack"
import { WettingReveal } from "@/registry/animations/wetting-reveal"
import { Combobox } from "@/registry/components/combobox"
import { CommandPalette } from "@/registry/components/command-palette"
import { DateRangePicker } from "@/registry/components/date-range-picker"
import { FileDropzone } from "@/registry/components/file-dropzone"
import { SegmentedControl } from "@/registry/components/segmented-control"

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

  /* The first catalogue round. These twelve were registered and live before the
     batch above existed, and they are back here verbatim — the full stage each
     was authored at, unchanged. Their card compositions are in `CARD_DEMOS`
     below, which is the part they never had. */
  "aurora-thread-loom": <AuroraThreadLoom />,
  "bubble-burst": <BubbleBurst />,
  "curtain-sequence": <CurtainSequence />,
  "destructible-membrane": <DestructibleMembrane />,
  "domino-word": <DominoWord />,
  "kinetic-kerning": <KineticKerning />,
  "kinetic-texture-mesh": <KineticTextureMesh />,
  "lenticular-shift": <LenticularShift />,
  "mercury-droplet-choir": <MercuryDropletChoir />,
  "pulse-choir": <PulseChoir />,
  "rollback-orbit": <RollbackOrbit />,
  "split-shutter": <SplitShutter />,

  /* The lab round, in the order they were reviewed in. Nine controls, nine
     unrelated solvers, and the same rule as the two batches above: the demo is the
     component at the size it was authored, with no wrapper of its own. */
  "snap-toggle": <SnapToggle />,
  "toast-stack": <ToastStack />,
  "detent-slider": <DetentSlider />,
  "sheet-fold": <SheetFold />,
  "shutter-compare": <ShutterCompare />,
  "dock-magnify": <DockMagnify />,
  "galton-histogram": <GaltonHistogram />,
  "relaxation-typing": <RelaxationTyping />,
  "lloyd-avatars": <LloydAvatars />,

  /* The thin-category round, in the order they were reviewed in. Aimed at the four
     categories with the fewest items rather than picked for variety, so there is one
     gradient, one marquee, one noise and three masks — but they share no solver: a
     black-body locus, a scanline exposure, a photon estimator, a diffusion-limited
     cluster, a wetting front, and a pair of gratings beating against each other. */
  "kelvin-ramp": <KelvinRamp />,
  "scanline-marquee": <ScanlineMarquee />,
  "photon-thumbnail": <PhotonThumbnail />,
  "frost-spoiler": <FrostSpoiler />,
  "wetting-reveal": <WettingReveal />,
  "moire-scratch": <MoireScratch />,

  /* A shallow-water ripple tank: drips fall on a clock, their rings interfere, and
     the wake reflects off the walls of the tank. */
  "ripple-tank": <RippleTank />,

  /* Components — interactive UI primitives, mounted like animations rather than
     framed. Each owns its own surface and controls, so the demo is the component. */
  "command-palette": <CommandPalette />,
  "segmented-control": <SegmentedControl />,
  combobox: <Combobox />,
  "date-range-picker": <DateRangePicker />,
  "file-dropzone": <FileDropzone />,
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

  /* The first catalogue round, given the card composition they were missing.
     Registering these twelve without an entry here would drop each one onto
     `ItemPreview`'s `wantsScale` fallback — a full marketing stage rendered at
     roughly a third of its design size behind an `inert` poster — which is the
     presentation that was rejected, and which also puts the two canvas ones
     (`destructible-membrane`, `kinetic-texture-mesh`) through a transform their
     own `measure()` reads back as the true frame size. An entry here keeps that
     branch dead. */
  "aurora-thread-loom": <AuroraThreadLoom compact />,
  "bubble-burst": <BubbleBurst compact />,
  "curtain-sequence": <CurtainSequence compact />,
  "destructible-membrane": <DestructibleMembrane compact />,
  "domino-word": <DominoWord compact />,
  "kinetic-kerning": <KineticKerning compact />,
  "kinetic-texture-mesh": <KineticTextureMesh compact />,
  "lenticular-shift": <LenticularShift compact />,
  "mercury-droplet-choir": <MercuryDropletChoir compact />,
  "pulse-choir": <PulseChoir compact />,
  "rollback-orbit": <RollbackOrbit compact />,
  "split-shutter": <SplitShutter compact />,

  /* The lab round. Each of these nine was authored with the card in mind rather
     than reduced to it: the stage's copy is dropped, the padding is cut, and the
     control keeps the whole box. Both requirements above hold in every one — the
     interactive parts take `tabIndex={-1}` under `compact`, and every stage that
     claimed the gesture with `touch-action: none` relaxes to `pan-y`. */
  "snap-toggle": <SnapToggle compact />,
  "toast-stack": <ToastStack compact />,
  "detent-slider": <DetentSlider compact />,
  "sheet-fold": <SheetFold compact />,
  "shutter-compare": <ShutterCompare compact />,
  "dock-magnify": <DockMagnify compact />,
  "galton-histogram": <GaltonHistogram compact />,
  "relaxation-typing": <RelaxationTyping compact />,
  "lloyd-avatars": <LloydAvatars compact />,

  /* The thin-category round. Each card keeps exactly one thing: the strip on
     `kelvin-ramp`, the belt on `scanline-marquee`, the picture on the two that are
     pictures, the frosted pane, the film. What goes is the copy — every one of these
     six was authored as a marketing section first, so the compact variant drops a
     kicker, a headline, a lead and a hint before it touches the mechanism.

     The `[data-compact='true']` block in each stylesheet is deliberately more
     specific than that file's own `@media (max-width: 26rem)` rules, which set stage
     heights of 27–38rem. A media query adds no specificity, so the attribute
     selector wins on its own merits and a 390px catalogue cannot hand a 240px card a
     31rem stage. */
  "kelvin-ramp": <KelvinRamp compact />,
  "scanline-marquee": <ScanlineMarquee compact />,
  "photon-thumbnail": <PhotonThumbnail compact />,
  "frost-spoiler": <FrostSpoiler compact />,
  "wetting-reveal": <WettingReveal compact />,
  "moire-scratch": <MoireScratch compact />,

  /* The catalog-expansion scene and components, each in its own card variant —
     same component as the stage above with `compact` set, so the card is authored
     for the box rather than a scaled crop of the full stage. */
  "ripple-tank": <RippleTank compact />,
  "command-palette": <CommandPalette compact />,
  "segmented-control": <SegmentedControl compact />,
  combobox: <Combobox compact />,
  "date-range-picker": <DateRangePicker compact />,
  "file-dropzone": <FileDropzone compact />,
}

