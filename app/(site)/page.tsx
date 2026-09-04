import Link from "next/link"

import { AgentMockups } from "@/components/landing/agent-mockups"
import { ClosingCta } from "@/components/landing/closing-cta"
import { CodeShowcase } from "@/components/landing/code-showcase"
import { CollectionsGrid } from "@/components/landing/collections-grid"
import { Faq } from "@/components/landing/faq"
import { Hero } from "@/components/landing/hero"
import { ListsSection } from "@/components/landing/lists-section"
import { SocialProof } from "@/components/landing/social-proof"
import { ItemGrid } from "@/components/item-grid"
import { featured, newest, type RegistryItem } from "@/lib/registry"
import { cn } from "@/lib/utils"

/**
 * A heading, a blurb and a link to the full listing, above a grid.
 *
 * Both of these used to be horizontally scrolling rails. Eight cards at 23rem
 * apiece is about 3100px of track, so a 1340px window showed three and a half of
 * them and put the other four and a half behind a sideways gesture — on the one
 * page whose whole job is to show what the library contains. A grid of eight is
 * two rows and no gesture.
 */
function Showcase({
  title,
  subtitle,
  viewAllHref,
  viewAllText,
  items,
  className,
}: {
  title: string
  subtitle?: string
  viewAllHref: string
  viewAllText: string
  items: RegistryItem[]
  className?: string
}) {
  if (items.length === 0) return null

  return (
    <div className={cn("border-b border-border py-16", className)}>
      <div className="container-page">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div className="min-w-0">
            <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
            {subtitle && <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p>}
          </div>
          <Link
            href={viewAllHref}
            className="shrink-0 text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            {viewAllText}
          </Link>
        </div>
        <ItemGrid items={items} />
      </div>
    </div>
  )
}

export default function HomePage() {
  /*
   * No cap on either grid, which is the fix for an item that was registered,
   * flagged `featured`, and visible on neither.
   *
   * Two grids of eight is sixteen slots for seventeen items, and the ninth
   * `featured: true` entry fell through both of them. `featured(8)` cut it on
   * declaration order — every item has `installs: 0`, so that sort is a no-op —
   * and then `Just added`, taking eight of the nine left over, cut the same item
   * again. `monolith-launch`, the newest template and flagged both featured and
   * new, was reachable from nowhere but /community/templates.
   *
   * A cap is worth having again once the catalogue is big enough for one to mean
   * something, but only paired with somewhere for the overflow to go. The
   * property to keep either way is the one restored here: every registered item
   * appears on this page, and the `picked` filter below means each appears once.
   */
  const spotlight = featured()
  // Newest, minus anything already standing in the Featured grid above, so the
  // two grids partition the catalogue instead of overlapping on most of it.
  const picked = new Set(spotlight.map((item) => item.name))
  const fresh = newest(undefined).filter((item) => !picked.has(item.name))

  return (
    <>
      <Hero />

      <Showcase
        title="Featured"
        subtitle="Hand-picked this week"
        viewAllHref="/community/templates"
        viewAllText="All templates"
        items={spotlight}
      />

      <Showcase
        title="Just added"
        viewAllHref="/community/animations"
        viewAllText="All animations"
        items={fresh}
      />

      <SocialProof />
      <AgentMockups />
      <CodeShowcase />
      <ListsSection />
      <CollectionsGrid />
      <ClosingCta />
      <Faq />
    </>
  )
}
