import { notFound } from "next/navigation"

import { getItem } from "@/lib/registry"
import { contentTypeOf } from "@/lib/registry/mime"
import { readRegistryBytes, registrySourceBytes } from "@/lib/registry/source"

/**
 * Serves a template's own `public/` space on this site.
 *
 * A template's document loads its images, models and audio by absolute path —
 * `/paper-portfolio/hero-collage.png`, `/cinematic-supercar/models/aventador/aventador.gltf` —
 * because that is where an install puts them in a consumer's project. For the catalog
 * preview to be the real page rather than an approximation, those exact URLs have to
 * resolve here too. Mapping them to the registry copy is what avoids keeping a second
 * copy of identical bytes in `public/` just so the site can look at them.
 *
 * The served paths come from the item's own `files` and `assets`, so a route can only
 * ever hand out what its template actually ships. Nothing is read from the request
 * path except as a key into that map, so `..` and absolute paths cannot escape.
 */
export function templatePublicSpace(item: string) {
  const prefix = `public/${item}/`

  /** Served path (below /<item>/) -> registry source. */
  const served = new Map<string, string>()
  for (const entry of [...(getItem(item)?.files ?? []), ...(getItem(item)?.assets ?? [])]) {
    const target = entry.target.replace(/\\/g, "/")
    if (target.startsWith(prefix)) served.set(target.slice(prefix.length), entry.source)
  }

  return {
    /** One prerendered path per shipped asset. */
    params: () => [...served.keys()].map((path) => ({ path: path.split("/") })),

    async get(path: string[]) {
      const source = served.get(path.map(decodeURIComponent).join("/"))
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
    },
  }
}
