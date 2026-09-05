import { BIN, NAME } from "./pkg.js"
import { CliError } from "./ui.js"

export type PayloadFile = {
  path: string
  target: string
  content: string
  type: string
}

export type PayloadAsset = {
  url: string
  target: string
  bytes: number
}

export type Payload = {
  name: string
  type: string
  title?: string
  description?: string
  author?: string
  dependencies?: string[]
  registryDependencies?: string[]
  files: PayloadFile[]
  assets?: PayloadAsset[]
  cssVars?: Record<string, string>
  css?: string
  meta?: { kind?: string; categories?: string[]; docs?: string }
}

export type IndexEntry = {
  name: string
  kind?: string
  title?: string
  description?: string
  author?: string
}

/** Install names are restricted, so a name can never reshape the request URL. */
const NAME_RE = /^[a-z0-9]+(?:[-.][a-z0-9]+)*$/

export function assertName(name: string) {
  if (!NAME_RE.test(name)) {
    throw new CliError(
      `"${name}" is not a valid item name.`,
      "Names are lowercase letters, digits, and dashes.",
    )
  }
}

async function getJson(url: string, notFound?: [string, string]): Promise<unknown> {
  let response: Response
  try {
    response = await fetch(url, {
      headers: { accept: "application/json" },
      redirect: "follow",
    })
  } catch (cause) {
    throw new CliError(
      `Could not reach ${url}`,
      cause instanceof Error ? cause.message : "Check your connection.",
    )
  }

  if (response.status === 404) {
    if (notFound) throw new CliError(notFound[0], notFound[1])
    throw new CliError(`Not found: ${url}`)
  }
  if (!response.ok) throw new CliError(`${url} responded ${response.status}.`)

  try {
    return (await response.json()) as unknown
  } catch {
    throw new CliError(`${url} did not return JSON.`)
  }
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((entry) => typeof entry === "string")
}

/**
 * Turn the payload's `css` into the CSS text the rest of the CLI appends.
 *
 * The wire format is nested — `{ "@keyframes x": { from: { transform: "…" } } }` —
 * because that is the shape shadcn's registry-item schema declares, and every item
 * this registry serves is meant to install with either CLI. Everything downstream of
 * here works on text: `plan.ts` collects it, `apply.ts` splits it into top-level
 * blocks and skips any `@keyframes` the project already has. So the conversion
 * happens once, at the edge.
 *
 * A plain string is still accepted. Older deployments served one, and a registry the
 * user points `--registry` at may still.
 */
function cssRule(selector: string, value: unknown, indent: string): string | null {
  if (typeof value === "string") return `${indent}${selector} { ${value} }`
  if (typeof value !== "object" || value === null) return null

  const inner: string[] = []
  for (const [key, nested] of Object.entries(value as Record<string, unknown>)) {
    if (typeof nested === "string") {
      // A property, not a selector: `transform: translateX(0);`
      inner.push(`${indent}  ${key}: ${nested};`)
      continue
    }
    const block = cssRule(key, nested, `${indent}  `)
    if (block) inner.push(block)
  }

  // An at-rule with no body is legal CSS — `@layer base;` — so an empty object is
  // written out rather than dropped.
  if (inner.length === 0) return `${indent}${selector} {}`
  return `${indent}${selector} {\n${inner.join("\n")}\n${indent}}`
}

function parseCss(value: unknown): string | undefined {
  if (typeof value === "string") return value.trim() || undefined
  if (typeof value !== "object" || value === null || Array.isArray(value)) return undefined

  const rules: string[] = []
  for (const [selector, rule] of Object.entries(value as Record<string, unknown>)) {
    const block = cssRule(selector, rule, "")
    if (block) rules.push(block)
  }
  return rules.length > 0 ? rules.join("\n\n") : undefined
}

/** A single asset must not exceed this, and the whole set must not either. */
const MAX_ASSET_BYTES = 200 * 1024 * 1024
const MAX_TOTAL_ASSET_BYTES = 600 * 1024 * 1024

/**
 * Validate the asset list, including where each byte is allowed to come from.
 *
 * `url` decides what the CLI connects to, so it is checked against the registry
 * the user actually asked for. Without that, a payload could name any host and
 * the install would fetch from it — and the request would carry whatever the
 * user's environment attaches to outbound calls.
 */
function parseAssets(value: unknown, name: string, registry: string): PayloadAsset[] {
  if (value === undefined) return []
  if (!Array.isArray(value)) {
    throw new CliError(`The assets of "${name}" are not a list.`)
  }

  let expected: URL
  try {
    expected = new URL(registry)
  } catch {
    throw new CliError(`"${registry}" is not a usable registry URL.`)
  }

  let total = 0
  return value.map((entry, index) => {
    if (typeof entry !== "object" || entry === null) {
      throw new CliError(`Asset ${index} of "${name}" is malformed.`)
    }
    const asset = entry as Record<string, unknown>
    if (typeof asset.url !== "string" || typeof asset.target !== "string") {
      throw new CliError(`Asset ${index} of "${name}" has no url or target.`)
    }

    let url: URL
    try {
      url = new URL(asset.url)
    } catch {
      throw new CliError(`Asset ${index} of "${name}" has a url that is not a URL.`)
    }
    if (url.origin !== expected.origin) {
      throw new CliError(
        `"${name}" asks for an asset from ${url.origin}.`,
        `Only ${expected.origin} is allowed here. Refusing to download it.`,
      )
    }

    const bytes = typeof asset.bytes === "number" && Number.isFinite(asset.bytes) ? asset.bytes : 0
    if (bytes < 0 || bytes > MAX_ASSET_BYTES) {
      throw new CliError(`Asset ${asset.target} of "${name}" reports an implausible size.`)
    }
    total += bytes
    if (total > MAX_TOTAL_ASSET_BYTES) {
      throw new CliError(`"${name}" asks to download more than 600MB of assets.`)
    }

    return { url: url.toString(), target: asset.target, bytes }
  })
}

/**
 * Validate the payload before anything touches disk.
 *
 * This is remote data being turned into local files, so shape is checked here
 * rather than trusted — a field that is not the type we expect is a hard stop.
 */
function parsePayload(raw: unknown, name: string, registry: string): Payload {
  if (typeof raw !== "object" || raw === null) {
    throw new CliError(`The registry returned something that is not an item for "${name}".`)
  }
  const value = raw as Record<string, unknown>

  if (typeof value.name !== "string" || !Array.isArray(value.files) || value.files.length === 0) {
    throw new CliError(`The payload for "${name}" is missing a name or files.`)
  }

  const files: PayloadFile[] = value.files.map((entry, index) => {
    if (typeof entry !== "object" || entry === null) {
      throw new CliError(`File ${index} of "${name}" is malformed.`)
    }
    const file = entry as Record<string, unknown>
    const target = typeof file.target === "string" ? file.target : file.path
    if (typeof target !== "string" || typeof file.content !== "string") {
      throw new CliError(`File ${index} of "${name}" has no target or content.`)
    }
    return {
      path: typeof file.path === "string" ? file.path : target,
      target,
      content: file.content,
      type: typeof file.type === "string" ? file.type : "registry:file",
    }
  })

  return {
    name: value.name,
    type: typeof value.type === "string" ? value.type : "registry:file",
    title: typeof value.title === "string" ? value.title : undefined,
    description: typeof value.description === "string" ? value.description : undefined,
    author: typeof value.author === "string" ? value.author : undefined,
    dependencies: isStringArray(value.dependencies) ? value.dependencies : [],
    registryDependencies: isStringArray(value.registryDependencies)
      ? value.registryDependencies
      : [],
    files,
    assets: parseAssets(value.assets, name, registry),
    cssVars:
      typeof value.cssVars === "object" && value.cssVars !== null
        ? (value.cssVars as Record<string, string>)
        : undefined,
    css: parseCss(value.css),
    meta: typeof value.meta === "object" && value.meta !== null ? (value.meta as Payload["meta"]) : undefined,
  }
}

export async function fetchItem(registry: string, name: string): Promise<Payload> {
  assertName(name)
  const raw = await getJson(`${registry}/r/${name}.json`, [
    `There is nothing called "${name}" in this registry.`,
    `Run \`${BIN} list\` to see what there is.`,
  ])
  return parsePayload(raw, name, registry)
}

export async function fetchIndex(registry: string): Promise<IndexEntry[]> {
  const raw = await getJson(`${registry}/r/registry.json`, [
    `${registry} does not serve a registry index.`,
    "Check --registry, or the origin in your config file.",
  ])
  const items = (raw as { items?: unknown }).items
  if (!Array.isArray(items)) throw new CliError("The registry index is malformed.")
  return items.filter(
    (entry): entry is IndexEntry =>
      typeof entry === "object" && entry !== null && typeof (entry as IndexEntry).name === "string",
  )
}
