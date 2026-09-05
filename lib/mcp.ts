import { version as siteVersion } from "@/package.json"

import { brand, installCommand, registryUrl, siteOrigin } from "@/lib/brand"
import { isKind, KIND_LABEL, type Kind } from "@/lib/categories"
import { itemUrl } from "@/lib/hrefs"
import {
  browsableKinds,
  getItem,
  ITEMS,
  itemsByKind,
  populatedCategories,
  search,
  type RegistryItem,
  type RegistryPayload,
} from "@/lib/registry"

/**
 * What the MCP server knows. The HTTP and JSON-RPC framing lives next door in
 * `app/mcp/route.ts`; this file is only the catalogue half — the tool list, the
 * two tool implementations, and the constants both halves need.
 *
 * The split matters because the framing is the part with the fiddly rules
 * (mirrored headers, two protocol eras, which failures are HTTP status codes and
 * which are JSON-RPC error objects) and the tools are the part worth reading.
 */

/** Per-request `_meta` versions: no handshake, every request declares its own. */
export const MODERN_VERSIONS = ["2026-07-28"]

/**
 * `initialize`-handshake versions. Kept because that is what shipped clients
 * actually speak — Claude Desktop, Cursor and the reference SDKs were all still
 * on `2025-06-18` when this was written — and a server that only answered the
 * current revision would be a spec exhibit nothing could connect to.
 */
export const LEGACY_VERSIONS = ["2025-11-25", "2025-06-18", "2025-03-26"]

export const SUPPORTED_VERSIONS = [...MODERN_VERSIONS, ...LEGACY_VERSIONS]

/** Newest legacy version, which is what an `initialize` we cannot match falls to. */
export const LEGACY_DEFAULT = LEGACY_VERSIONS[0]

export const SERVER_INFO = { name: brand.name, version: siteVersion }

/** Only tools. No resources, no prompts, no subscriptions, nothing to notify. */
export const CAPABILITIES = { tools: {} }

/** JSON-RPC codes, plus the two the MCP transport adds. */
export const RPC = {
  PARSE: -32700,
  INVALID_REQUEST: -32600,
  METHOD_NOT_FOUND: -32601,
  INVALID_PARAMS: -32602,
  INTERNAL: -32603,
  /** Mirrored header missing, or disagreeing with the body it mirrors. */
  HEADER_MISMATCH: -32020,
  /** Version in `_meta` is not one of `SUPPORTED_VERSIONS`. */
  UNSUPPORTED_VERSION: -32022,
} as const

/**
 * The `instructions` string both eras return, counted from the catalogue rather
 * than written down, so it cannot advertise a category that has nothing in it or
 * a total that is a commit out of date.
 */
export function instructions() {
  const kinds = browsableKinds()
  const total = kinds.reduce((sum, kind) => sum + itemsByKind(kind).length, 0)
  const slugs = kinds.map(
    (kind) =>
      `${KIND_LABEL[kind]} (kind \`${kind}\`): ${populatedCategories(kind)
        .map((category) => category.slug)
        .join(", ")}`,
  )

  return [
    `${brand.name} — ${total} free MIT interface pieces, all by one author, each installable`,
    "into an existing project with one command. Call `search_registry` to find something,",
    "then `get_item` for the install command and, with `includeSource: true`, the code.",
    "",
    "Categories, by kind:",
    ...slugs.map((line) => `- ${line}`),
    "",
    `Nothing here needs an account or a key. The payload every install reads is public JSON at ${siteOrigin}/r/<name>.json.`,
  ].join("\n")
}

export type ToolResult = {
  content: { type: "text"; text: string }[]
  structuredContent?: Record<string, unknown>
  isError?: boolean
}

/**
 * Cap on the source characters one `get_item` will hand back.
 *
 * 120,000 is not a round number picked for looks: it is just above the largest
 * item in the catalogue. `cinematic-supercar` is 115,509 characters across six
 * files, 110,531 of them in a single `experience.html`, so any smaller budget
 * drops the one file that *is* that template and spends the room on its three
 * asset licences instead. At this size every piece arrives whole, and the
 * truncation path below exists for the item that one day does not fit.
 */
export const SOURCE_BUDGET = 120_000

const READ_ONLY = {
  readOnlyHint: true,
  destructiveHint: false,
  idempotentHint: true,
  /* The only thing either tool reads is this site's own catalogue. */
  openWorldHint: false,
} as const

export const TOOLS = [
  {
    name: "search_registry",
    title: "Search the catalogue",
    description: [
      `Find pieces in ${brand.name} by free text, kind or category. Returns each match's`,
      "registry name, title, one-line description, categories and install command —",
      "enough to answer 'what is there' and to pick one. Call with no arguments to list",
      "the whole catalogue. For a piece's code, follow up with `get_item`.",
    ].join(" "),
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description:
            "Free text, matched case-insensitively against title, registry name, description, categories and author. Omit to browse rather than search.",
        },
        kind: {
          type: "string",
          enum: ["animations", "templates"],
          description:
            "`animations` are single components or effects; `templates` are whole multi-page sites.",
        },
        category: {
          type: "string",
          description:
            "Category slug to filter by, e.g. `draggable`. The valid slugs per kind are listed in the server instructions; an unknown one comes back with the list.",
        },
        limit: {
          type: "integer",
          minimum: 1,
          maximum: 50,
          description: "How many matches to return. Defaults to 20.",
        },
      },
      additionalProperties: false,
    },
    outputSchema: {
      type: "object",
      properties: {
        total: { type: "integer", description: "Matches before `limit` was applied." },
        returned: { type: "integer" },
        items: {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: { type: "string" },
              title: { type: "string" },
              kind: { type: "string" },
              description: { type: "string" },
              categories: { type: "array", items: { type: "string" } },
              install: { type: "string" },
              page: { type: "string" },
            },
            required: ["name", "title", "kind", "description", "install"],
          },
        },
      },
      required: ["total", "returned", "items"],
    },
    annotations: READ_ONLY,
  },
  {
    name: "get_item",
    title: "Read one piece",
    description: [
      "Everything about one piece by its registry name: what it installs, which npm",
      "dependencies and sibling registry items come with it, the exact files it writes,",
      "and both install commands. Pass `includeSource: true` to also get the code, which",
      "arrives as one text block per file after the metadata — not in the structured",
      "result, so it is never sent twice. Call it without source first if size matters:",
      "`writes` gives every file's exact byte count, which is the cost of asking again",
      `with source. Source is capped at ${SOURCE_BUDGET.toLocaleString("en-US")} characters; anything dropped is`,
      "named in `sourceOmitted` and can still be read from the JSON URL.",
    ].join(" "),
    inputSchema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description:
            "Registry name, exactly as `search_registry` returns it — e.g. `snap-toggle`, not `Snap Toggle`.",
        },
        includeSource: {
          type: "boolean",
          description:
            "Include the file contents. Defaults to false, because a template can be tens of thousands of characters and the metadata alone answers most questions.",
        },
      },
      required: ["name"],
      additionalProperties: false,
    },
    /*
     * Metadata only, deliberately. File contents go in `content` as text blocks;
     * putting them here too would double the bytes on the wire for the one call
     * where the bytes are already the whole cost.
     */
    outputSchema: {
      type: "object",
      properties: {
        name: { type: "string" },
        title: { type: "string" },
        kind: { type: "string" },
        description: { type: "string" },
        categories: { type: "array", items: { type: "string" } },
        author: { type: "string" },
        page: { type: "string" },
        json: { type: "string", description: "Public payload URL both CLIs read." },
        install: { type: "string" },
        shadcnInstall: { type: "string" },
        dependencies: { type: "array", items: { type: "string" } },
        registryDependencies: { type: "array", items: { type: "string" } },
        writes: {
          type: "array",
          items: {
            type: "object",
            properties: {
              target: { type: "string" },
              type: { type: "string" },
              bytes: { type: "integer" },
            },
            required: ["target", "bytes"],
          },
        },
        assets: {
          type: "array",
          items: {
            type: "object",
            properties: { target: { type: "string" }, bytes: { type: "integer" } },
            required: ["target", "bytes"],
          },
        },
        css: { type: "boolean", description: "Whether the install appends CSS variables." },
        sourceIncluded: { type: "array", items: { type: "string" } },
        sourceOmitted: { type: "array", items: { type: "string" } },
      },
      required: ["name", "title", "kind", "install", "json", "writes"],
    },
    annotations: READ_ONLY,
  },
] as const

/**
 * A successful result, in both shapes at once: the structured object for a client
 * that reads `structuredContent`, and the same thing serialized as the first text
 * block for one that only reads `content` — which every pre-2025-06-18 client does.
 * `extra` blocks follow it, and are the only place file source ever appears.
 */
function ok(structured: Record<string, unknown>, extra: string[] = []): ToolResult {
  return {
    content: [
      { type: "text", text: JSON.stringify(structured, null, 2) },
      ...extra.map((text) => ({ type: "text" as const, text })),
    ],
    structuredContent: structured,
  }
}

/**
 * A tool *execution* error: a well-formed call that could not be answered, like a
 * name that is not in the catalogue. It is a result, not a JSON-RPC error, so the
 * model sees the message and can correct itself — which is the whole point of
 * `isError` existing separately from the protocol's error channel.
 */
function fail(message: string): ToolResult {
  return { content: [{ type: "text", text: message }], isError: true }
}

/** One search hit: what you need to choose between pieces, and nothing else. */
function hit(item: RegistryItem) {
  return {
    name: item.name,
    title: item.title,
    kind: item.kind,
    description: item.description,
    categories: [...item.categories],
    install: installCommand(item.name),
    page: itemUrl(siteOrigin, item),
  }
}

/** Every category slug that has something in it, across both kinds. */
function knownSlugs() {
  return browsableKinds().flatMap((kind) => populatedCategories(kind).map((c) => c.slug))
}

function searchTool(args: Record<string, unknown>): ToolResult {
  const query = typeof args.query === "string" ? args.query : ""

  let kind: Kind | undefined
  if (args.kind !== undefined) {
    if (typeof args.kind !== "string" || !isKind(args.kind)) {
      return fail(
        `\`kind\` must be "animations" or "templates". Got ${JSON.stringify(args.kind)}.`,
      )
    }
    kind = args.kind
  }

  /* `search` already returns the whole pool for an empty query, so no branch here. */
  let results = search(query, kind)

  if (args.category !== undefined) {
    if (typeof args.category !== "string") {
      return fail(`\`category\` must be a string. Got ${JSON.stringify(args.category)}.`)
    }
    const slug = args.category.trim().toLowerCase()
    const known = knownSlugs()
    if (!known.includes(slug)) {
      return fail(
        `No category \`${slug}\`. The ones with something in them: ${known.join(", ")}.`,
      )
    }
    results = results.filter((item) => item.categories.includes(slug))
  }

  const limit = Math.min(50, Math.max(1, Math.floor(Number(args.limit ?? 20)) || 20))

  return ok({
    total: results.length,
    returned: Math.min(results.length, limit),
    items: results.slice(0, limit).map(hit),
  })
}

const FENCE: Record<string, string> = {
  ts: "ts",
  tsx: "tsx",
  js: "js",
  jsx: "jsx",
  mjs: "js",
  css: "css",
  json: "json",
  md: "md",
  mdx: "mdx",
  html: "html",
  svg: "xml",
}

function fence(target: string) {
  return FENCE[target.split(".").pop()?.toLowerCase() ?? ""] ?? ""
}

const encoder = new TextEncoder()

/**
 * The payload an install actually reads, fetched over HTTP from this same
 * deployment rather than assembled from disk.
 *
 * `lib/registry/source.ts` could build it in process — `buildPayload` is exactly
 * that function — but it reads `registry/**` through `process.cwd()`, and this is
 * the one dynamic route on the site. Next traces a dynamic route's file
 * dependencies statically, cannot see a runtime `path.join`, and would ship a
 * function with no registry inside it. The escape hatch,
 * `outputFileTracingIncludes`, works by glob, so covering the registry would drag
 * all of `cinematic-supercar`'s assets into the bundle to answer a question about
 * a 2 KB toggle. `/r/<name>.json` is already prerendered and CDN-cached, so going
 * through HTTP is cheaper, cannot go stale against the CLI, and guarantees the
 * bytes reported here are the bytes an install writes.
 */
async function fetchPayload(name: string, origin: string): Promise<RegistryPayload> {
  const res = await fetch(`${origin}/r/${name}.json`, { headers: { accept: "application/json" } })
  if (!res.ok) throw new Error(`${origin}/r/${name}.json responded ${res.status}`)
  return (await res.json()) as RegistryPayload
}

async function getItemTool(args: Record<string, unknown>, origin: string): Promise<ToolResult> {
  const raw = typeof args.name === "string" ? args.name.trim() : ""
  if (!raw) {
    return fail("`name` is required: the registry name of a piece, e.g. `snap-toggle`.")
  }

  const item = getItem(raw)
  if (!item) {
    /* A wrong name is the likeliest failure, so spend the error on fixing it. */
    const near = search(raw)
      .slice(0, 5)
      .map((other) => other.name)
    return fail(
      `Nothing in the catalogue is named \`${raw}\`.` +
        (near.length > 0 ? ` Closest by text: ${near.join(", ")}.` : "") +
        ` There are ${ITEMS.length} pieces — \`search_registry\` lists them.`,
    )
  }

  let payload: RegistryPayload
  try {
    payload = await fetchPayload(item.name, origin)
  } catch (error) {
    return fail(
      `Could not read ${registryUrl(item.name)}: ${error instanceof Error ? error.message : String(error)}`,
    )
  }

  const wantsSource = args.includeSource === true
  const included: string[] = []
  const omitted: string[] = []
  const blocks: string[] = []
  let spent = 0

  if (wantsSource) {
    for (const file of payload.files) {
      /*
       * Whole files only, in payload order, until the next one would not fit.
       * Truncating mid-file would hand back code that looks complete and is not.
       */
      if (spent + file.content.length > SOURCE_BUDGET) {
        omitted.push(file.target)
        continue
      }
      spent += file.content.length
      included.push(file.target)
      blocks.push(`${file.target}\n\n\`\`\`${fence(file.target)}\n${file.content}\n\`\`\``)
    }
  }

  if (omitted.length > 0) {
    blocks.push(
      `${omitted.length} more ${omitted.length === 1 ? "file" : "files"} did not fit in the ` +
        `${SOURCE_BUDGET.toLocaleString("en-US")}-character budget: ${omitted.join(", ")}. ` +
        `All of them are in ${registryUrl(item.name)}.`,
    )
  }

  return ok(
    {
      name: item.name,
      title: item.title,
      kind: item.kind,
      description: item.description,
      categories: [...item.categories],
      author: item.author.name,
      page: itemUrl(siteOrigin, item),
      json: registryUrl(item.name),
      install: installCommand(item.name),
      shadcnInstall: `npx shadcn@latest add ${registryUrl(item.name)}`,
      dependencies: payload.dependencies,
      registryDependencies: payload.registryDependencies,
      /*
       * `payload.files` is already the flattened tree, so this is the real install
       * footprint — a piece that pulls in a hook lists the hook's file too.
       */
      writes: payload.files.map((file) => ({
        target: file.target,
        type: file.type,
        bytes: encoder.encode(file.content).length,
      })),
      assets: (payload.assets ?? []).map((asset) => ({
        target: asset.target,
        bytes: asset.bytes,
      })),
      css: Boolean(payload.css),
      sourceIncluded: included,
      sourceOmitted: omitted,
    },
    blocks,
  )
}

/**
 * Run one tool. `origin` is this request's own origin, so a preview deployment
 * reads its own payloads rather than production's.
 *
 * Unknown *tool* is the caller's problem, not this function's: that is a protocol
 * error and the route raises it as JSON-RPC `-32602` before getting here.
 */
export function callTool(
  name: string,
  args: Record<string, unknown>,
  origin: string,
): Promise<ToolResult> {
  if (name === "search_registry") return Promise.resolve(searchTool(args))
  if (name === "get_item") return getItemTool(args, origin)
  return Promise.resolve(fail(`No tool named \`${name}\`.`))
}

/** Tool names, for the route's unknown-tool check and its error message. */
export const TOOL_NAMES: string[] = TOOLS.map((tool) => tool.name)
