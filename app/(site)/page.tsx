import { AgentMockups } from "@/components/landing/agent-mockups"
import { ClosingCta } from "@/components/landing/closing-cta"
import { CodeShowcase } from "@/components/landing/code-showcase"
import { CollectionsGrid } from "@/components/landing/collections-grid"
import { Faq } from "@/components/landing/faq"
import { Hero } from "@/components/landing/hero"
import { ListsSection } from "@/components/landing/lists-section"
import { SocialProof } from "@/components/landing/social-proof"
import { ItemCard } from "@/components/item-card"
import { Rail } from "@/components/rail"
import { featured, newest } from "@/lib/registry"

export default function HomePage() {
  const spotlight = featured(8)
  const fresh = newest(8)

  return (
    <>
      <Hero />

      <div className="border-b border-border py-16">
        <Rail title="Featured" subtitle="Hand-picked this week" viewAllHref="/community/templates">
          {spotlight.map((item) => (
            <ItemCard key={item.name} item={item} height={220} />
          ))}
        </Rail>
      </div>

      <div className="border-b border-border py-16">
        <Rail title="Just added" viewAllHref="/community/animations">
          {fresh.map((item) => (
            <ItemCard key={item.name} item={item} height={220} />
          ))}
        </Rail>
      </div>

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
