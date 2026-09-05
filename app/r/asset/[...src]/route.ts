import { siteOrigin } from "@/lib/brand"
import { ITEMS } from "@/lib/registry"
import { contentTypeOf } from "@/lib/registry/mime"
import { readRegistryBytes, registrySourceBytes } from "@/lib/registry/source"

/**
 * Byte delivery for registry assets: `GET /r/asset/{source}`.
 *
 * The JSON payload inlines source files as text, which a 14MB model or an mp3
 * cannot survive. Those are declared as `assets` instead and fetched from here,
 * one request each, so the CLI streams them to disk without ever holding the
 * whole set in memory.
 *
 * Read-only and CORS-open (headers live in next.config.ts), same as the payload
 * route, because the consumer's machine fetches this during `add`.
 */
export const dynamic = "force-static"

/** Unlisted paths 404 rather than reaching the handler — see app/r/[name]/route.ts. */
export const dynamicParams = false

/** Only paths an item actually declares are servable — not any file under registry/. */
const DECLARED = new Set(
  ITEMS.flatMap((item) => item.assets ?? []).map((asset) => asset.source.replace(/\\/g, "/")),
)

export function generateStaticParams() {
  return [...DECLARED].map((source) => ({ src: source.split("/") }))
}

export async function GET(_request: Request, { params }: { params: Promise<{ src: string[] }> }) {
  const { src } = await params
  const source = src.map(decodeURIComponent).join("/")

  if (!DECLARED.has(source)) {
    return Response.json(
      { error: `Not a registry asset: ${source}`, browse: `${siteOrigin}/r/registry.json` },
      { status: 404 },
    )
  }

  const bytes = await registrySourceBytes(source)
  if (bytes === null) {
    return Response.json({ error: `Missing asset file: ${source}` }, { status: 404 })
  }

  const body = await readRegistryBytes(source)
  return new Response(new Uint8Array(body), {
    headers: {
      "content-type": contentTypeOf(source),
      "content-length": String(bytes),
      "cache-control": "public, max-age=31536000, immutable",
    },
  })
}
