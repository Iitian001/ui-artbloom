"use client"

import type { ReactNode } from "react"

import { AuroraBackground } from "@/registry/animations/aurora-background"
import { AuroraThreadLoom } from "@/registry/animations/aurora-thread-loom"
import { BlurReveal } from "@/registry/animations/blur-reveal"
import { BubbleBurst } from "@/registry/animations/bubble-burst"
import { CurtainSequence } from "@/registry/animations/curtain-sequence"
import { DestructibleMembrane } from "@/registry/animations/destructible-membrane"
import { DominoWord } from "@/registry/animations/domino-word"
import { KineticKerning } from "@/registry/animations/kinetic-kerning"
import { KineticTextureMesh } from "@/registry/animations/kinetic-texture-mesh"
import { LenticularShift } from "@/registry/animations/lenticular-shift"
import { Magnetic } from "@/registry/animations/magnetic"
import { Marquee } from "@/registry/animations/marquee"
import { MercuryDropletChoir } from "@/registry/animations/mercury-droplet-choir"
import { NumberTicker } from "@/registry/animations/number-ticker"
import { PulseChoir } from "@/registry/animations/pulse-choir"
import { RollbackOrbit } from "@/registry/animations/rollback-orbit"
import { SplitShutter } from "@/registry/animations/split-shutter"
import { SpotlightCard } from "@/registry/animations/spotlight-card"
import { TextShimmer } from "@/registry/animations/text-shimmer"
import { Typewriter } from "@/registry/animations/typewriter"
import { AnimatedTestimonials } from "@/registry/components/animated-testimonials"
import { BentoGrid, BentoCard } from "@/registry/components/bento-grid"
import { PricingTable } from "@/registry/components/pricing-table"
import { ShimmerButton } from "@/registry/components/shimmer-button"

const AVATARS = [
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&h=600&fit=crop",
]

/**
 * One demo per registry item, keyed by `name`.
 *
 * These are the *only* thing a card renders — no screenshots. That means the
 * catalog can never drift from the code, and it is why adding an item requires
 * an entry here.
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

  typewriter: (
    <div className="flex size-full items-center justify-center p-6 text-xl font-medium tracking-tight">
      <span className="text-muted-foreground">Build&nbsp;</span>
      <Typewriter words={["landing pages", "portfolios", "dashboards", "anything"]} />
    </div>
  ),

  "blur-reveal": (
    <div className="flex size-full items-center p-6">
      <BlurReveal className="space-y-2.5" once={false} stagger={0.16}>
        <p className="text-xs uppercase tracking-widest text-muted-foreground">Introducing</p>
        <h3 className="text-2xl font-semibold tracking-tight">One command, one component</h3>
        <p className="text-sm text-muted-foreground">Every child reveals in sequence.</p>
      </BlurReveal>
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

  "spotlight-card": (
    <div className="flex size-full items-center justify-center p-6">
      <SpotlightCard className="w-full max-w-xs">
        <div className="p-6">
          <h3 className="font-medium tracking-tight">Move your cursor here</h3>
          <p className="mt-1.5 text-sm text-muted-foreground">
            The glow tracks the pointer without a single re-render.
          </p>
        </div>
      </SpotlightCard>
    </div>
  ),

  magnetic: (
    <div className="flex size-full items-center justify-center p-6">
      <Magnetic strength={0.4}>
        <span className="inline-flex h-11 items-center rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground">
          Pull me
        </span>
      </Magnetic>
    </div>
  ),

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

  "shimmer-button": (
    <div className="flex size-full items-center justify-center p-6">
      <ShimmerButton>Get started →</ShimmerButton>
    </div>
  ),

  "bento-grid": (
    <div className="size-full p-4">
      <BentoGrid className="h-full auto-rows-[minmax(0,1fr)] gap-3">
        <BentoCard
          className="md:col-span-2"
          title="Full-bleed"
          description="Spans two columns."
          visual={<div className="size-full bg-gradient-to-br from-violet-500/20 to-blue-500/5" />}
        />
        <BentoCard title="Compact" description="One cell." />
        <BentoCard title="Aside" description="One cell." />
        <BentoCard
          className="md:col-span-2"
          title="Wide again"
          description="Alternating rhythm."
          visual={<div className="size-full bg-gradient-to-tr from-rose-500/20 to-amber-400/5" />}
        />
      </BentoGrid>
    </div>
  ),

  "animated-testimonials": (
    <div className="size-full overflow-hidden p-5">
      <AnimatedTestimonials
        autoplay={4200}
        testimonials={[
          {
            quote: "We replaced three weeks of design work with an afternoon of copy-paste.",
            name: "Priya Raman",
            role: "Founder, Meridian",
            src: AVATARS[0],
          },
          {
            quote: "The code that lands in my repo is code I would have written myself.",
            name: "Jonas Lindqvist",
            role: "Staff engineer, Halcyon",
            src: AVATARS[1],
          },
          {
            quote: "Every animation is already tuned. Nothing feels bolted on.",
            name: "Amara Diallo",
            role: "Design lead, Northwind",
            src: AVATARS[2],
          },
        ]}
      />
    </div>
  ),

  "pricing-table": (
    <div className="size-full overflow-hidden p-5">
      <PricingTable
        showToggle={false}
        plans={[
          {
            name: "Free",
            monthly: "Free",
            blurb: "Two copies a day.",
            features: ["Browse everything", "2 copies / day"],
            cta: "Start free",
          },
          {
            name: "Pro",
            monthly: 12,
            yearly: 96,
            blurb: "Unlimited, forever.",
            features: ["Unlimited copies", "All templates", "Private lists"],
            cta: "Go Pro",
            highlight: true,
            badge: "Popular",
          },
          {
            name: "Team",
            monthly: 32,
            yearly: 288,
            blurb: "Shared lists and seats.",
            features: ["Everything in Pro", "5 seats", "Shared lists"],
            cta: "Contact us",
          },
        ]}
      />
    </div>
  ),
}
