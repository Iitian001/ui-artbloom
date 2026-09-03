import { notFound } from "next/navigation"

import CinematicSupercar from "@/registry/templates/cinematic-supercar/page"
import LaunchLanding from "@/registry/templates/launch-landing/page"
import StudioPortfolio from "@/registry/templates/studio-portfolio/page"

/** Template name -> the real page component that ships to a consumer. */
const TEMPLATE_PAGES: Record<string, () => React.ReactNode> = {
  "cinematic-supercar": CinematicSupercar,
  "launch-landing": LaunchLanding,
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
