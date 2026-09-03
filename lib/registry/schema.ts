import type { Kind } from "@/lib/categories"

/** Mirrors the shadcn registry item file types so the JSON we serve at
 *  /r/{name}.json is consumable by `shadcn add` as well as our own CLI. */
export type RegistryFileType =
  | "registry:ui"
  | "registry:component"
  | "registry:block"
  | "registry:hook"
  | "registry:lib"
  | "registry:page"
  | "registry:style"
  | "registry:file"

export type RegistryFile = {
  /** Path inside this repo, relative to the `registry/` root. */
  source: string
  /** Where the CLI writes it in the consumer's project. */
  target: string
  type: RegistryFileType
}

/**
 * A file that is delivered as bytes rather than as text in the payload.
 *
 * `files` are inlined into the JSON, which is right for source but wrong for a
 * 14MB `.bin` model or an mp3: the CLI would have to hold the whole thing as a
 * UTF-8 string, and anything non-textual would not survive the round trip. Assets
 * are listed with a URL instead and streamed to disk one at a time.
 */
export type RegistryAsset = {
  /** Path inside this repo, relative to the `registry/` root. */
  source: string
  /** Where the CLI writes it in the consumer's project. */
  target: string
}

export type Author = {
  handle: string
  name: string
  /** Optional avatar URL. Falls back to an initials monogram. */
  avatar?: string
  /** Organisation accounts render without initials, like 21st does. */
  org?: boolean
  bio?: string
}

export type RegistryItem = {
  /** The install name: `npx ui.artbloom add <name>`. Unique across all kinds. */
  name: string
  title: string
  kind: Kind
  description: string
  /** Category slugs from lib/categories.ts. First one is the primary. */
  categories: string[]
  author: Author
  files: RegistryFile[]
  /** Binary or oversized files, served as bytes instead of inlined text. */
  assets?: RegistryAsset[]
  /** npm packages the consumer needs. Pinned. */
  dependencies?: string[]
  /** Other registry items pulled in transitively, by `name`. */
  registryDependencies?: string[]
  /** CSS vars / keyframes this item needs appended to globals.css. */
  cssVars?: Record<string, string>
  css?: string
  /** ISO dates. */
  createdAt: string
  updatedAt?: string
  installs: number
  bookmarks: number
  featured?: boolean
  /** Renders the "New" pill in rails. */
  isNew?: boolean
  /** Height of the live preview frame in the catalog card, px. */
  previewHeight?: number
  /** Preview needs a dark surface to read correctly (shaders, beams). */
  previewDark?: boolean
  /** Static screenshot used before the live frame hydrates, if any. */
  image?: string
  imageDark?: string
}

/** What the CLI receives from /r/{name}.json. */
export type RegistryPayload = {
  $schema: string
  name: string
  type: RegistryFileType
  title: string
  description: string
  author: string
  dependencies: string[]
  registryDependencies: string[]
  files: { path: string; content: string; type: RegistryFileType; target: string }[]
  /**
   * Assets to download. `url` is absolute and always on the same origin as the
   * payload — the CLI rejects any other host — and `bytes` lets it show progress
   * and refuse a response that is not the size it was promised.
   */
  assets?: { url: string; target: string; bytes: number }[]
  cssVars?: Record<string, string>
  css?: string
  meta: {
    kind: Kind
    categories: string[]
    docs: string
  }
}
