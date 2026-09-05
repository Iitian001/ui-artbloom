import { readFile, stat } from "node:fs/promises"
import path from "node:path"

import type { CssBlock, RegistryItem, RegistryPayload } from "./schema"
import { getItem, resolveTree } from "./index"
import { itemUrl } from "@/lib/hrefs"

/** Everything shippable lives under this root and nothing outside it is served. */
const REGISTRY_ROOT = path.resolve(process.cwd(), "registry")

/**
 * Resolve a registry-relative path to an absolute one, or refuse.
 *
 * `source` comes from our own item metadata, but it also arrives from the URL on
 * the asset route, so containment is enforced here rather than assumed. Backslashes
 * are normalised first so a Windows-style separator cannot slip past the check.
 */
function resolveInsideRegistry(source: string): string {
  const absolute = path.resolve(REGISTRY_ROOT, source.replace(/\\/g, "/"))
  const relative = path.relative(REGISTRY_ROOT, absolute)
  if (relative === "" || relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`Refusing to read outside the registry root: ${source}`)
  }
  return absolute
}

/** Read one registry source file off disk as text. */
export async function readRegistrySource(source: string): Promise<string> {
  return readFile(resolveInsideRegistry(source), "utf8")
}

/** Read one registry file off disk as bytes, for the asset route. */
export async function readRegistryBytes(source: string): Promise<Buffer> {
  return readFile(resolveInsideRegistry(source))
}

/** Size in bytes, or null when the path is missing or is not a file. */
export async function registrySourceBytes(source: string): Promise<number | null> {
  try {
    const info = await stat(resolveInsideRegistry(source))
    return info.isFile() ? info.size : null
  } catch {
    return null
  }
}

export type LoadedFile = {
  source: string
  target: string
  type: RegistryItem["files"][number]["type"]
  content: string
  lang: string
}

export async function loadFiles(item: RegistryItem): Promise<LoadedFile[]> {
  return Promise.all(
    item.files.map(async (file) => ({
      ...file,
      content: await readRegistrySource(file.source),
      lang: languageOf(file.source),
    })),
  )
}

/**
 * What `add <name>` actually writes, counted across the whole resolved tree.
 *
 * The item page used to say "Writes N files" from `loadFiles(item)`, which is the
 * item's *own* source files and nothing else. That undercounted twice: it ignored
 * the files pulled in by `registryDependencies`, and it ignored `assets`
 * entirely — so `cinematic-supercar` advertised 6 files while an install put 17
 * on disk, 14.6 MB of which the page never mentioned. Assets are the whole reason
 * a template is worth installing rather than copying, and they are also the only
 * part of it big enough to care about, so the size is stated rather than implied.
 *
 * Cheap enough to call from a prerendered page: this runs at build time, reads the
 * same files the payload route already reads, and `stat`s the assets instead of
 * loading them.
 */
export type InstallFootprint = { files: number; assets: number; assetBytes: number }

export async function installFootprint(name: string): Promise<InstallFootprint> {
  const targets = new Set<string>()
  const assetTargets = new Set<string>()
  let assetBytes = 0

  for (const node of resolveTree(name)) {
    for (const file of node.files) targets.add(file.target)
    for (const asset of node.assets ?? []) {
      if (assetTargets.has(asset.target)) continue
      const bytes = await registrySourceBytes(asset.source)
      if (bytes === null) continue
      assetTargets.add(asset.target)
      assetBytes += bytes
    }
  }

  return { files: targets.size, assets: assetTargets.size, assetBytes }
}

export function languageOf(filePath: string) {
  const ext = path.extname(filePath).slice(1)
  switch (ext) {
    case "tsx":
    case "ts":
      return "tsx"
    case "jsx":
    case "js":
      return "jsx"
    case "css":
      return "css"
    case "json":
      return "json"
    case "md":
    case "mdx":
      return "md"
    default:
      return "text"
  }
}

/**
 * Turn an item's declared assets into downloadable entries.
 *
 * A missing file is dropped rather than served as a broken URL: the CLI would
 * otherwise fail halfway through an install with a 404 it cannot act on.
 */
async function loadAssets(
  item: RegistryItem,
  origin: string,
): Promise<NonNullable<RegistryPayload["assets"]>> {
  const out: NonNullable<RegistryPayload["assets"]> = []
  for (const asset of item.assets ?? []) {
    const bytes = await registrySourceBytes(asset.source)
    if (bytes === null) continue
    const url = `${origin}/r/asset/${asset.source.replace(/\\/g, "/").split("/").map(encodeURIComponent).join("/")}`
    out.push({ url, target: asset.target, bytes })
  }
  return out
}

/**
 * Build the JSON served at /r/{name}.json.
 *
 * Registry dependencies are flattened into `files` so a single fetch installs a
 * whole template — the CLI never has to walk the graph itself — while the
 * shadcn-compatible `registryDependencies` field is preserved for other tools.
 */
export async function buildPayload(
  name: string,
  origin: string,
): Promise<RegistryPayload | null> {
  const item = getItem(name)
  if (!item) return null

  const tree = resolveTree(name)
  const files: RegistryPayload["files"] = []
  const assets: NonNullable<RegistryPayload["assets"]> = []
  const dependencies = new Set<string>()
  /*
   * Merged across the tree, first declaration winning, which matches how `files`
   * de-duplicates by target just below. It used to be `tree.map(node => node.css)`
   * joined with newlines — concatenation was fine for text but would produce a
   * malformed object here, and a template that pulls in two animations declaring the
   * same `@keyframes` should append it once.
   */
  const css: CssBlock = {}

  for (const node of tree) {
    for (const dep of node.dependencies ?? []) dependencies.add(dep)
    for (const [selector, rule] of Object.entries(node.css ?? {})) {
      if (!(selector in css)) css[selector] = rule
    }
    for (const file of await loadFiles(node)) {
      if (files.some((f) => f.target === file.target)) continue
      files.push({
        path: file.target,
        target: file.target,
        content: file.content,
        type: file.type,
      })
    }
    for (const asset of await loadAssets(node, origin)) {
      if (assets.some((a) => a.target === asset.target)) continue
      assets.push(asset)
    }
  }

  return {
    $schema: `${origin}/schema/registry-item.json`,
    name: item.name,
    type: item.files[0]?.type ?? "registry:ui",
    title: item.title,
    description: item.description,
    author: `@${item.author.handle}`,
    dependencies: [...dependencies],
    registryDependencies: item.registryDependencies ?? [],
    files,
    ...(assets.length > 0 ? { assets } : {}),
    ...(Object.keys(css).length > 0 ? { css } : {}),
    meta: {
      kind: item.kind,
      categories: item.categories,
      docs: itemUrl(origin, item),
    },
  }
}
