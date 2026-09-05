import { templatePublicSpace } from "@/lib/registry/template-public"

/**
 * Serves `/paper-portfolio/<asset>` — the template's own `public/` space.
 *
 * The template's pages live in `app/(bare)/paper-portfolio/`, which owns this same URL
 * prefix. That is fine: those are literal segments and win over this catch-all, so
 * `/paper-portfolio/about` still renders its page and only unclaimed paths like
 * `/paper-portfolio/hero-collage.png` fall through to here.
 */
export const dynamic = "force-static"

/** Unlisted paths 404 rather than reaching the handler — see app/r/[name]/route.ts. */
export const dynamicParams = false

const space = templatePublicSpace("paper-portfolio")

export function generateStaticParams() {
  return space.params()
}

export async function GET(_request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params
  return space.get(path)
}
