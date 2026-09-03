"use client"

import type { ReactNode } from "react"

import { AuroraBackground } from "@/registry/animations/aurora-background"
import { AuroraThreadLoom } from "@/registry/animations/aurora-thread-loom"
import { BubbleBurst } from "@/registry/animations/bubble-burst"
import { CurtainSequence } from "@/registry/animations/curtain-sequence"
import { DestructibleMembrane } from "@/registry/animations/destructible-membrane"
import { DominoWord } from "@/registry/animations/domino-word"
import { KineticKerning } from "@/registry/animations/kinetic-kerning"
import { KineticTextureMesh } from "@/registry/animations/kinetic-texture-mesh"
import { LenticularShift } from "@/registry/animations/lenticular-shift"
import { Marquee } from "@/registry/animations/marquee"
import { MercuryDropletChoir } from "@/registry/animations/mercury-droplet-choir"
import { NumberTicker } from "@/registry/animations/number-ticker"
import { PulseChoir } from "@/registry/animations/pulse-choir"
import { RollbackOrbit } from "@/registry/animations/rollback-orbit"
import { SplitShutter } from "@/registry/animations/split-shutter"
import { TextShimmer } from "@/registry/animations/text-shimmer"

/**
 * One demo per registry item, keyed by `name`.
 *
 * These are the *only* thing a card renders — no screenshots. That means the
 * catalog can never drift from the code, and it is why adding an item requires
 * an entry here.
 *
 * Templates are the exception: `ItemPreview` renders `kind: "templates"` in an
 * iframe pointed at `/preview/<name>`, so the two templates in the catalog are
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

  // The stage animations. Each one paints its own full-bleed surface, so the
  // demo is the component and nothing else — no wrapper, no padding.
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
}
