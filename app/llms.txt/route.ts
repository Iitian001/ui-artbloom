import { brand, installCommand, registryUrl, siteOrigin } from "@/lib/brand"
import { categoryLabel, KIND_LABEL } from "@/lib/categories"
import { itemUrl } from "@/lib/hrefs"
import {
  browsableKinds,
  itemsByKind,
  kindCount,
  populatedCategories,
  type RegistryItem,
} from "@/lib/registry"

/**
 * `/llms.txt` — the catalogue as one page of plain text, in the llmstxt.org shape:
 * an H1, a blockquote summary, then `- [name](url): notes` lists under H2s.
 *
 * Why it exists at all, when `/sitemap.xml` already lists every URL and
 * `/r/registry.json` already lists every item: neither one answers the question a
 * model actually arrives with. The sitemap is 70 URLs with no titles, so reading it
 * costs 38 more fetches to learn what is here. The registry index has the titles but
 * is machine JSON keyed for a CLI, and it does not carry the install command — the
 * one string a model needs in order to be useful to whoever asked it. This file is
 * the short answer: what the library is, what is in it, and the command per item.
 *
 * There is deliberately no `/llms-full.txt`. The convention reserves that name for
 * the whole corpus inlined, and here that means every source file of all 38 items:
 * 1.2 MB, most of it canvas maths, which is both larger than most context windows
 * and the wrong thing to spend one on. `/mcp` answers that need properly — it can
 * hand back one item's files on request — and this file points at it.
 */
export const dynamic = "force-static"

/** One catalogue line: title, page, what it is, and the command that installs it. */
function itemLine(item: RegistryItem) {
  const category = categoryLabel(item.kind, item.categories[0] ?? "")
  return `- [${item.title}](${itemUrl(siteOrigin, item)}): ${item.description} Category: ${category}. Install: \`${installCommand(item.name)}\`. JSON: ${registryUrl(item.name)}`
}

function body() {
  const total = browsableKinds().reduce((sum, kind) => sum + kindCount(kind), 0)

  const lines: string[] = [
    `# ${brand.name}`,
    "",
    `> ${brand.description}`,
    "",
    `${total} pieces, all free, all MIT, no account and no key. Every one of them`,
    "installs into an existing project with a single command, which is written out on",
    "each line below. Nothing here is published by anyone else, so there is no",
    "quality floor to guess at: one person built all of it.",
    "",
    "## Installing",
    "",
    `- Our CLI: \`${installCommand("<name>")}\` — writes the files, appends any CSS the piece needs, and installs its npm dependencies.`,
    `- Any shadcn-compatible CLI: \`npx shadcn@latest add ${registryUrl("<name>")}\` — same files, no need for our package.`,
    `- Raw JSON: \`${registryUrl("<name>")}\` — the payload both commands read. Public, CORS-open, no key.`,
    `- Whole index: \`${siteOrigin}/r/registry.json\` — every item with its title, kind, author and payload URL.`,
    `- MCP: \`${siteOrigin}/mcp\` — search the catalogue and read one piece's source over the Model Context Protocol.`,
    "",
  ]

  for (const kind of browsableKinds()) {
    const items = itemsByKind(kind)
    const categories = populatedCategories(kind)
      .map((category) => `${category.label} (${category.slug})`)
      .join(", ")

    lines.push(
      `## ${KIND_LABEL[kind]} (${items.length})`,
      "",
      `Categories: ${categories}.`,
      "",
      ...items.map(itemLine),
      "",
    )
  }

  lines.push(
    "## Reference",
    "",
    `- [Docs](${siteOrigin}/docs): what a registry item is, what an install writes, and how to undo it.`,
    `- [CLI reference](${siteOrigin}/docs/cli): every command and flag, including \`--dry-run\` and \`--no-telemetry\`.`,
    `- [Item schema](${siteOrigin}/schema/registry-item.json): JSON Schema for a payload at \`/r/<name>.json\`.`,
    `- [Themes](${siteOrigin}/themes): the CSS variables the pieces read, and what they fall back to.`,
    `- [License](${siteOrigin}/license): MIT, and what that does and does not cover.`,
    "",
  )

  return lines.join("\n")
}

export function GET() {
  return new Response(body(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      /*
       * Same caching posture as `/r/`: revalidate at the edge hourly, serve stale
       * for a day while doing it. The file only changes when the catalogue does.
       */
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
      "Access-Control-Allow-Origin": "*",
    },
  })
}
