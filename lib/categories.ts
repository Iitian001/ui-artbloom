/**
 * The browse taxonomy. Three groups, each rendered as a column in the command
 * panel and as its own catalog route. Counts are never written here — they are
 * derived from the registry in `lib/registry/index.ts`, so a category cannot
 * advertise items that do not exist.
 *
 * Every slug below is claimed by at least one item in `lib/registry/items.ts`.
 * That is the rule this file is kept to: a category that filters to nothing is
 * a dead end, not a promise, so aspirational slugs are not parked here. Add the
 * category in the same change as the first item that uses it, and drop it in the
 * same change as the last item that leaves.
 */

/**
 * Four kinds, and that is the whole catalogue. Each entered this union in the
 * same change that added its first item to `ITEMS` — `blocks` did, and now
 * `components` does too (the five interactive primitives: a command palette, a
 * segmented control, a combobox, a date-range picker and a file dropzone). The
 * rule is symmetric: a kind is admitted only with something to fill it, and it
 * would leave in the change that removed its last item.
 *
 * Routing follows the count, not the union: `isBrowsableKind` is
 * `isKind(value) && kindCount(value) > 0`, so a kind with no items 404s on the
 * count regardless of whether the word is spelled here.
 */
export type Kind = "templates" | "animations" | "blocks" | "components"

export type Category = {
  /** URL segment under /community/{kind}/s/{slug} */
  slug: string
  /** Label shown in the nav panel */
  label: string
  kind: Kind
}

export type CategoryGroup = {
  kind: Kind
  label: string
  blurb: string
  categories: Category[]
}

function c(kind: Kind, label: string, slug: string): Category {
  return { kind, label, slug }
}

export const TEMPLATE_CATEGORIES: Category[] = [
  c("templates", "Landing Pages", "landing"),
  c("templates", "Portfolios", "portfolio"),
  c("templates", "Agencies", "agency"),
  c("templates", "Personal Sites", "personal"),
  c("templates", "Resumes", "resume"),
  c("templates", "Restaurants", "restaurant"),
  c("templates", "Editorial", "editorial"),
  c("templates", "Events", "events"),
  c("templates", "Experiences", "experiences"),
  // No "E-commerce" / `store` slug here on purpose. The four footwear sites that
  // claimed it were cut, so nothing in `ITEMS` claims it — and listing it anyway
  // would pre-render /community/templates/s/store as an empty "coming soon" page,
  // which is the one thing the rule at the top of this file forbids. It comes
  // back in the same change that adds the first storefront.
]

export const ANIMATION_CATEGORIES: Category[] = [
  c("animations", "Text Effects", "text"),
  c("animations", "Page Transitions", "transitions"),
  c("animations", "Backgrounds", "backgrounds"),
  c("animations", "Gradients", "gradients"),
  c("animations", "Loaders", "loaders"),
  c("animations", "Marquees", "marquees"),
  c("animations", "Particles", "particles"),
  c("animations", "Morphing", "morph"),
  c("animations", "Number Tickers", "numbers"),
  c("animations", "Springs", "springs"),
  c("animations", "Stagger", "stagger"),
  c("animations", "Draggable", "draggable"),
  c("animations", "3D & Perspective", "three-d"),
  c("animations", "Micro-interactions", "micro"),
  c("animations", "Infinite Loops", "infinite"),
  c("animations", "Masks & Clips", "masks"),
  c("animations", "Noise & Grain", "noise"),
]

export const BLOCK_CATEGORIES: Category[] = [
  c("blocks", "Pricing", "pricing"),
  c("blocks", "Testimonials", "testimonials"),
  c("blocks", "Call to Action", "cta"),
  c("blocks", "FAQ", "faq"),
  c("blocks", "Logo Clouds", "logos"),
  c("blocks", "Team", "team"),
  c("blocks", "Contact", "contact"),
]

export const COMPONENT_CATEGORIES: Category[] = [
  c("components", "Command Menus", "command"),
  c("components", "Inputs", "inputs"),
  c("components", "Pickers", "pickers"),
  c("components", "Upload", "upload"),
]

export const CATEGORY_GROUPS: CategoryGroup[] = [
  {
    kind: "templates",
    label: "Templates",
    blurb: "Complete, deployable sites — every page, every asset.",
    categories: TEMPLATE_CATEGORIES,
  },
  {
    kind: "blocks",
    label: "Blocks",
    blurb: "Self-contained page sections — one file, paste and ship.",
    categories: BLOCK_CATEGORIES,
  },
  {
    kind: "components",
    label: "Components",
    blurb: "Interactive UI primitives — command menus, pickers, inputs.",
    categories: COMPONENT_CATEGORIES,
  },
  {
    kind: "animations",
    label: "Animations",
    blurb: "Drop-in motion, from one-line text effects to canvas scenes.",
    categories: ANIMATION_CATEGORIES,
  },
]

export const ALL_CATEGORIES: Category[] = CATEGORY_GROUPS.flatMap((g) => g.categories)

export const KIND_LABEL: Record<Kind, string> = {
  templates: "Templates",
  blocks: "Blocks",
  components: "Components",
  animations: "Animations",
}

/** Singular, for detail-page breadcrumbs. */
export const KIND_SINGULAR: Record<Kind, string> = {
  templates: "Template",
  blocks: "Block",
  components: "Component",
  animations: "Animation",
}

export function findCategory(kind: Kind, slug: string) {
  return ALL_CATEGORIES.find((x) => x.kind === kind && x.slug === slug)
}

export function categoryLabel(kind: Kind, slug: string) {
  return findCategory(kind, slug)?.label ?? slug
}

export function isKind(value: string): value is Kind {
  return (
    value === "templates" ||
    value === "animations" ||
    value === "blocks" ||
    value === "components"
  )
}
