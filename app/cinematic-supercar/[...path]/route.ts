import { notFound } from "next/navigation"

import { getItem } from "@/lib/registry"
import { contentTypeOf } from "@/lib/registry/mime"
import { readRegistryBytes, registrySourceBytes } from "@/lib/registry/source"

/**
 * Serves the cinematic-supercar template's own `public/` space on this site.
 *
 * The template's document loads its model, audio and photograph by absolute path —
 * `/cinematic-supercar/models/aventador/aventador.gltf` and so on — because that is
 * where an install puts them in a consumer's project. For the catalog preview to be
 * the real page rather than an approximation, those exact URLs have to resolve here
 * too. Mapping them to the registry copy is what avoids keeping a second 15MB of
 * identical bytes in `public/` just so the site can look at them.
 *
 * The served paths come from the item's own `files` and `assets`, so this can only
 * ever hand out what the template actually ships. When a second asset-bearing
 * template arrives, this is the thing to generalise.
 */
export const dynamic = "force-static"

const ITEM = "cinematic-supercar"
const PREFIX = `public/${ITEM}/`

/** Served path (below /cinematic-supercar/) -> registry source. */
const SERVED = new Map<string, string>()
for (const entry of [...(getItem(ITEM)?.files ?? []), ...(getItem(ITEM)?.assets ?? [])]) {
  const target = entry.target.replace(/\\/g, "/")
  if (target.startsWith(PREFIX)) SERVED.set(target.slice(PREFIX.length), entry.source)
}

export function generateStaticParams() {
  return [...SERVED.keys()].map((served) => ({ path: served.split("/") }))
}

export async function GET(_request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params
  const source = SERVED.get(path.map(decodeURIComponent).join("/"))
  if (!source) notFound()

  const bytes = await registrySourceBytes(source)
  if (bytes === null) notFound()

  const body = await readRegistryBytes(source)
  return new Response(new Uint8Array(body), {
    headers: {
      "content-type": contentTypeOf(source),
      "content-length": String(bytes),
      // Short, unlike /r/asset: this path is the preview, and editing the template
      // should show up on a refresh rather than after a cache eviction.
      "cache-control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  })
}
