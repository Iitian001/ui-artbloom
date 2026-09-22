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

/**
 * Nested CSS, in the shape shadcn's registry-item schema declares for its `css`
 * field: an object keyed by at-rule or selector, whose values are either a
 * declaration value or a further nested block.
 *
 * NOT A STRING, WHICH IS WHAT IT USED TO BE. `cli/README.md` says every item here
 * is also a valid shadcn registry item, and `marquee` was the counter-example: it
 * carried its two `@keyframes` as one minified line of CSS text, and shadcn's schema
 * declares `css` as an object. So `shadcn add …/marquee.json` had a schema error
 * waiting for it while the README promised it would work. The object form says the
 * same thing in the shape both tools accept.
 */
export type CssValue = string | { [key: string]: CssValue }
export type CssBlock = Record<string, CssValue>

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
  /**
   * Keyframes, custom properties and any other global CSS this item needs appended
   * to the consumer's stylesheet. Put variables under `":root"` or `"@theme"` here.
   *
   * There is deliberately no `cssVars` field. shadcn has one, but it is grouped —
   * `{ theme, light, dark }`, each a flat map — and ours was a single flat map, which
   * would not have validated against its schema. Nothing in the registry ever set it,
   * so rather than keep two ways to declare a variable and have one of them quietly
   * break `shadcn add`, there is one. The CLI still reads `cssVars` off a payload for
   * compatibility with anything already deployed.
   */
  css?: CssBlock
  /** ISO dates. */
  createdAt: string
  updatedAt?: string
  /*
   * No `installs` or `bookmarks` here on purpose.
   *
   * They used to be required fields, and every entry in `items.ts` carried `0`,
   * because nothing in this repo ever held a real count: the numbers lived in a
   * Supabase table fed by an install endpoint. That backend has since been
   * removed along with accounts and saves, so there is no live number to seed
   * and nowhere for one to come from. A field whose only possible value was `0`
   * made the cards render "0" and sorted every item by a key equal to every
   * other — worse than no field, so it is gone. If real counts ever matter
   * again they arrive with the system that produces them, not as a zero here.
   */
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
  css?: CssBlock
  meta: {
    kind: Kind
    categories: string[]
    docs: string
  }
}
