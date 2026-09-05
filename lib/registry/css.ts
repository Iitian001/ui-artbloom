import type { CssBlock, CssValue } from "./schema"

/**
 * Flatten an item's nested `css` into the text that goes in a stylesheet.
 *
 * Items declare CSS as an object because that is the shape shadcn's registry-item
 * schema requires (see `CssBlock` in `./schema.ts`), but a code block on an item page
 * has to show a reader the CSS they will paste, and the docs page counts `@keyframes`
 * in it. So the object is the wire and the source of truth, and this is the one place
 * that turns it back into CSS.
 *
 * `cli/src/registry.ts` has the same function, deliberately duplicated: the CLI is a
 * separate package that talks to this registry over HTTP and cannot import from the
 * site. Change one and change the other — the output is compared by eye on the item
 * page against what an install actually appends.
 */
function rule(selector: string, value: CssValue, indent: string): string {
  // A string at the top of a block is a raw body: `@media print { … }`.
  if (typeof value === "string") return `${indent}${selector} { ${value} }`

  const inner: string[] = []
  for (const [key, nested] of Object.entries(value)) {
    // A string one level in is a declaration: `transform: translateX(0);`
    if (typeof nested === "string") inner.push(`${indent}  ${key}: ${nested};`)
    else inner.push(rule(key, nested, `${indent}  `))
  }

  // An at-rule with no body is legal — `@layer base;` — so an empty block is written
  // rather than dropped.
  if (inner.length === 0) return `${indent}${selector} {}`
  return `${indent}${selector} {\n${inner.join("\n")}\n${indent}}`
}

export function cssText(block: CssBlock | undefined): string {
  if (!block) return ""
  return Object.entries(block)
    .map(([selector, value]) => rule(selector, value, ""))
    .join("\n\n")
}
