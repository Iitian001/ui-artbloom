import { siteOrigin } from "@/lib/brand"
import { itemUrl } from "@/lib/hrefs"
import { ITEMS, getItem } from "@/lib/registry"
import { buildPayload } from "@/lib/registry/source"

/**
 * The public registry API: `GET /r/{name}.json`.
 *
 * Read-only and CORS-open (headers live in next.config.ts) because a user's
 * machine fetches this directly during `npx ui.artbloom add <name>`. Static —
 * every payload is built at compile time from files on disk.
 */
export const dynamic = "force-static"

export function generateStaticParams() {
  return [{ name: "registry.json" }, ...ITEMS.map((item) => ({ name: `${item.name}.json` }))]
}

function index() {
  return {
    $schema: `${siteOrigin}/schema/registry-item.json`,
    name: "ui.artbloom",
    homepage: siteOrigin,
    items: ITEMS.map((item) => ({
      name: item.name,
      type: item.files[0]?.type ?? "registry:ui",
      title: item.title,
      description: item.description,
      kind: item.kind,
      author: `@${item.author.handle}`,
      url: `${siteOrigin}/r/${item.name}.json`,
      docs: itemUrl(siteOrigin, item),
    })),
  }
}

export async function GET(_request: Request, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params
  const bare = name.endsWith(".json") ? name.slice(0, -5) : name

  if (bare === "registry") return Response.json(index())

  if (!getItem(bare)) {
    return Response.json(
      { error: `Unknown registry item: ${bare}`, browse: `${siteOrigin}/r/registry.json` },
      { status: 404 },
    )
  }

  const payload = await buildPayload(bare, siteOrigin)
  return Response.json(payload)
}
