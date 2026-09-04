import { notFound } from "next/navigation"

import CinematicSupercar from "@/registry/templates/cinematic-supercar/page"
import MonolithLaunchLayout from "@/registry/templates/monolith-launch/layout"
import MonolithLaunchHome from "@/registry/templates/monolith-launch/page"
import PaperPortfolioLayout from "@/registry/templates/paper-portfolio/layout"
import PaperPortfolioHome from "@/registry/templates/paper-portfolio/page"

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

/**
 * Template name -> the real page component that ships to a consumer. One entry
 * per `kind: "templates"` item in `lib/registry/items.ts`; templates are the only
 * kind that gets framed through this route (see `components/item-preview.tsx`),
 * everything else mounts its demo directly.
 *
 * A `Map` rather than an object literal because `name` is whatever the URL says:
 * a plain object answers `/preview/constructor` with something inherited from
 * `Object.prototype`, which is truthy, so the 404 below would be skipped and
 * React handed a value that is not a component. A `Map` knows only these keys.
 */
const TEMPLATE_PAGES = new Map<string, () => React.ReactNode>([
  ["cinematic-supercar", CinematicSupercar],
  ["monolith-launch", MonolithLaunch],
  ["paper-portfolio", PaperPortfolio],
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
