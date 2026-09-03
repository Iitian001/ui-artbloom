import { createHighlighter, type Highlighter } from "shiki"

const THEMES = { light: "github-light-default", dark: "github-dark-default" } as const

const LANGS = ["tsx", "jsx", "ts", "js", "css", "json", "bash", "md"] as const

let highlighterPromise: Promise<Highlighter> | null = null

/** One highlighter for the whole process — loading grammars is the expensive part. */
function getHighlighter() {
  highlighterPromise ??= createHighlighter({
    themes: [THEMES.light, THEMES.dark],
    langs: [...LANGS],
  })
  return highlighterPromise
}

/**
 * Server-side syntax highlighting. Emits both themes as CSS variables in one
 * pass (`defaultColor: false`) so switching light/dark is a class flip with no
 * re-highlight and no flash.
 */
export async function highlight(code: string, lang: string) {
  const highlighter = await getHighlighter()
  const loaded = highlighter.getLoadedLanguages()
  return highlighter.codeToHtml(code.trimEnd(), {
    lang: loaded.includes(lang) ? lang : "text",
    themes: THEMES,
    defaultColor: false,
  })
}
