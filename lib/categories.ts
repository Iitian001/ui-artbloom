/**
 * The browse taxonomy. Two groups, each rendered as a column in the command
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
 * `components` is still in the union because `RegistryItem.kind`, the published
 * schema at /schema/registry-item.json and the landing hero all name it — but
 * the catalog holds no components, so no category is declared for it below and
 * `isBrowsableKind` 404s `/community/components`. Narrowing the union is a
 * separate change that has to move those call sites first.
 */
export type Kind = "templates" | "animations" | "components"

export type Category = {
  /** URL segment under /community/{kind}/s/{slug} */
  slug: string
  /** Label shown in the nav panel */
  label: string
  kind: Kind
  /** Renders the "New" pill instead of a count */
  isNew?: boolean
}

export type CategoryGroup = {
  kind: Kind
  label: string
  blurb: string
  categories: Category[]
}

function c(kind: Kind, label: string, slug: string, isNew?: boolean): Category {
  return { kind, label, slug, ...(isNew ? { isNew } : {}) }
}

export const TEMPLATE_CATEGORIES: Category[] = [
  c("templates", "Landing Pages", "landing"),
  c("templates", "Portfolios", "portfolio"),
  c("templates", "Agencies", "agency"),
  c("templates", "Personal Sites", "personal"),
  c("templates", "Resumes", "resume"),
]

export const ANIMATION_CATEGORIES: Category[] = [
  c("animations", "Text Effects", "text"),
  c("animations", "Page Transitions", "transitions"),
  c("animations", "Backgrounds", "backgrounds"),
  c("animations", "Gradients", "gradients", true),
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

export const CATEGORY_GROUPS: CategoryGroup[] = [
  {
    kind: "templates",
    label: "Templates",
    blurb: "Complete, deployable sites — every page, every asset.",
    categories: TEMPLATE_CATEGORIES,
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
  animations: "Animations",
  components: "Components",
}

/** Singular, for detail-page breadcrumbs. */
export const KIND_SINGULAR: Record<Kind, string> = {
  templates: "Template",
  animations: "Animation",
  components: "Component",
}

export function findCategory(kind: Kind, slug: string) {
  return ALL_CATEGORIES.find((x) => x.kind === kind && x.slug === slug)
}

export function categoryLabel(kind: Kind, slug: string) {
  return findCategory(kind, slug)?.label ?? slug
}

export function isKind(value: string): value is Kind {
  return value === "templates" || value === "animations" || value === "components"
}
