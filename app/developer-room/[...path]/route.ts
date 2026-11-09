import { templatePublicSpace } from "@/lib/registry/template-public"

/**
 * Serves `/developer-room/<asset>` — the template's own `public/` space, which is
 * where its document expects its scripts, panorama and images to live.
 *
 * See {@link templatePublicSpace} for why the preview reads the registry copy instead
 * of a second 11MB of identical bytes under `public/`.
 */
export const dynamic = "force-static"

/** Unlisted paths 404 rather than reaching the handler — see app/r/[name]/route.ts. */
export const dynamicParams = false

const space = templatePublicSpace("developer-room")

export function generateStaticParams() {
  return space.params()
}

export async function GET(_request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params
  return space.get(path)
}
