import { templatePublicSpace } from "@/lib/registry/template-public"

/**
 * Serves `/cinematic-supercar/<asset>` — the template's own `public/` space, which is
 * where its document expects its model, audio and photograph to live.
 *
 * See {@link templatePublicSpace} for why the preview reads the registry copy instead
 * of a second 15MB of identical bytes under `public/`.
 */
export const dynamic = "force-static"

/** Unlisted paths 404 rather than reaching the handler — see app/r/[name]/route.ts. */
export const dynamicParams = false

const space = templatePublicSpace("cinematic-supercar")

export function generateStaticParams() {
  return space.params()
}

export async function GET(_request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params
  return space.get(path)
}
