import { notFound } from "next/navigation"

import CinematicSupercar from "@/registry/templates/cinematic-supercar/page"
import DaylightLayout from "@/registry/templates/daylight/layout"
import DaylightHome from "@/registry/templates/daylight/page"
import GraphiteLayout from "@/registry/templates/graphite/layout"
import GraphiteHome from "@/registry/templates/graphite/page"
import MonolithLaunchLayout from "@/registry/templates/monolith-launch/layout"
import MonolithLaunchHome from "@/registry/templates/monolith-launch/page"
import PaperPortfolioLayout from "@/registry/templates/paper-portfolio/layout"
import PaperPortfolioHome from "@/registry/templates/paper-portfolio/page"
import StreetCodeLayout from "@/registry/templates/street-code/layout"
import StreetCodeHome from "@/registry/templates/street-code/page"
import Umbra from "@/registry/templates/umbra/page"
import Slate from "@/registry/templates/slate/page"
import Solstice from "@/registry/templates/solstice/page"
import Momentum from "@/registry/templates/momentum/page"
import Sprig from "@/registry/templates/sprig/page"
import Riot from "@/registry/templates/riot/page"
import Flux from "@/registry/templates/flux/page"
import Assembly from "@/registry/templates/assembly/page"
import Endpoint from "@/registry/templates/endpoint/page"
import Folio from "@/registry/templates/folio/page"

import ContactForm from "@/registry/blocks/contact-form/contact-form"
import CtaBanner from "@/registry/blocks/cta-banner/cta-banner"
import Faq from "@/registry/blocks/faq/faq"
import LogoCloud from "@/registry/blocks/logo-cloud/logo-cloud"
import PricingTiers from "@/registry/blocks/pricing-tiers/pricing-tiers"
import TeamGrid from "@/registry/blocks/team-grid/team-grid"
import Testimonials from "@/registry/blocks/testimonials/testimonials"

/**
 * Multi-page templates ship a nested layout that the consumer's router would
 * normally apply. Nothing applies it here, so the preview composes it by hand —
 * otherwise the card shows a bare page with no header, footer or stylesheet.
 */
function PaperPortfolio() {
  return (
    <PaperPortfolioLayout>
      <PaperPortfolioHome />
    </PaperPortfolioLayout>
  )
}

function MonolithLaunch() {
  return (
    <MonolithLaunchLayout>
      <MonolithLaunchHome />
    </MonolithLaunchLayout>
  )
}

function Daylight() {
  return (
    <DaylightLayout>
      <DaylightHome />
    </DaylightLayout>
  )
}

function Graphite() {
  return (
    <GraphiteLayout>
      <GraphiteHome />
    </GraphiteLayout>
  )
}

function StreetCode() {
  return (
    <StreetCodeLayout>
      <StreetCodeHome />
    </StreetCodeLayout>
  )
}

/**
 * Preview name -> the real component that ships to a consumer. One entry per
 * framed item in `lib/registry/items.ts` — every `kind: "templates"` and every
 * `kind: "blocks"` item, the two kinds that render through this route (see
 * `components/item-preview.tsx`); animations mount their demo directly instead.
 * Blocks are single self-contained sections, so they map to their own default
 * export with no layout to compose.
 *
 * A `Map` rather than an object literal because `name` is whatever the URL says:
 * a plain object answers `/preview/constructor` with something inherited from
 * `Object.prototype`, which is truthy, so the 404 below would be skipped and
 * React handed a value that is not a component. A `Map` knows only these keys.
 */
const TEMPLATE_PAGES = new Map<string, () => React.ReactNode>([
  ["cinematic-supercar", CinematicSupercar],
  ["daylight", Daylight],
  ["graphite", Graphite],
  ["monolith-launch", MonolithLaunch],
  ["paper-portfolio", PaperPortfolio],
  ["street-code", StreetCode],
  ["umbra", Umbra],
  ["slate", Slate],
  ["solstice", Solstice],
  ["momentum", Momentum],
  ["sprig", Sprig],
  ["riot", Riot],
  ["flux", Flux],
  ["assembly", Assembly],
  ["endpoint", Endpoint],
  ["folio", Folio],
  // Blocks — each a single self-contained section component.
  ["contact-form", ContactForm],
  ["cta-banner", CtaBanner],
  ["faq", Faq],
  ["logo-cloud", LogoCloud],
  ["pricing-tiers", PricingTiers],
  ["team-grid", TeamGrid],
  ["testimonials", Testimonials],
])

/**
 * Only the templates above exist on disk, so only those are worth prerendering —
 * a name in this list with no source behind it fails the build. `dynamicParams`
 * closes the other half: without it every other name is rendered on demand, and
 * with it production 404s them at the routing level, before this module runs.
 * `next dev` still renders on demand either way, which is what `notFound()` is
 * for below.
 */
export const dynamicParams = false

export function generateStaticParams() {
  return [...TEMPLATE_PAGES.keys()].map((name) => ({ name }))
}

export default async function TemplatePreviewPage({
  params,
}: {
  params: Promise<{ name: string }>
}) {
  const { name } = await params
  const Template = TEMPLATE_PAGES.get(name)
  // Throws, so nothing below runs and `Template` is narrowed past `undefined`.
  // Nothing here streams, so the response is a real 404 rather than a soft one.
  if (!Template) notFound()
  return <Template />
}
