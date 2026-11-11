import { templatePublicSpace } from "@/lib/registry/template-public"

/** Serves `/sketchbook/<asset>`: the template's own `public/` space. See {@link templatePublicSpace}. */
export const dynamic = "force-static"

/** Unlisted paths 404 rather than reaching the handler. */
export const dynamicParams = false

const space = templatePublicSpace("sketchbook")

export function generateStaticParams() {
  return space.params()
}

export async function GET(_request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params
  return space.get(path)
}
