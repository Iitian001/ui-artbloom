import { notFound } from "next/navigation"

import CinematicSupercar from "@/registry/templates/cinematic-supercar/page"
import LaunchLanding from "@/registry/templates/launch-landing/page"
import PaperPortfolioLayout from "@/registry/templates/paper-portfolio/layout"
import PaperPortfolioHome from "@/registry/templates/paper-portfolio/page"
import StudioPortfolio from "@/registry/templates/studio-portfolio/page"

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

/** Template name -> the real page component that ships to a consumer. */
const TEMPLATE_PAGES: Record<string, () => React.ReactNode> = {
  "cinematic-supercar": CinematicSupercar,
  "launch-landing": LaunchLanding,
  "paper-portfolio": PaperPortfolio,
  "studio-portfolio": StudioPortfolio,
}

export function generateStaticParams() {
  return Object.keys(TEMPLATE_PAGES).map((name) => ({ name }))
}

export default async function TemplatePreviewPage({
  params,
}: {
  params: Promise<{ name: string }>
}) {
  const { name } = await params
  const Template = TEMPLATE_PAGES[name]
  if (!Template) notFound()
  return <Template />
}
