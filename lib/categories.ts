/**
 * The browse taxonomy. Three groups, each rendered as a column in the command
 * panel and as its own catalog route. Counts are never written here — they are
 * derived from the registry in `lib/registry/index.ts`, so a category cannot
 * advertise items that do not exist.
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
  c("templates", "SaaS", "saas"),
  c("templates", "Portfolios", "portfolio"),
  c("templates", "Agencies", "agency"),
  c("templates", "Dashboards", "dashboard"),
  c("templates", "E-commerce", "ecommerce"),
  c("templates", "Blogs", "blog"),
  c("templates", "Documentation", "docs"),
  c("templates", "AI Products", "ai"),
  c("templates", "Startups", "startup"),
  c("templates", "Personal Sites", "personal"),
  c("templates", "Pricing Pages", "pricing"),
  c("templates", "Auth Pages", "auth"),
  c("templates", "Waitlists", "waitlist"),
  c("templates", "Changelogs", "changelog"),
  c("templates", "Events", "events"),
  c("templates", "Restaurants", "restaurant"),
  c("templates", "Real Estate", "real-estate"),
  c("templates", "Fitness", "fitness"),
  c("templates", "Education", "education"),
  c("templates", "Podcasts", "podcast"),
  c("templates", "Newsletters", "newsletter"),
  c("templates", "Web3", "web3"),
  c("templates", "Mobile Apps", "mobile"),
  c("templates", "Link in Bio", "link-in-bio", true),
  c("templates", "Resumes", "resume"),
  c("templates", "Directories", "directory"),
  c("templates", "Job Boards", "jobs"),
]

export const ANIMATION_CATEGORIES: Category[] = [
  c("animations", "Text Effects", "text"),
  c("animations", "Scroll Reveals", "scroll"),
  c("animations", "Page Transitions", "transitions"),
  c("animations", "Hover Effects", "hover"),
  c("animations", "Backgrounds", "backgrounds"),
  c("animations", "Shaders", "shaders", true),
  c("animations", "Gradients", "gradients", true),
  c("animations", "Loaders", "loaders"),
  c("animations", "Cursors", "cursors"),
  c("animations", "Marquees", "marquees"),
  c("animations", "Parallax", "parallax"),
  c("animations", "Particles", "particles"),
  c("animations", "Morphing", "morph"),
  c("animations", "Number Tickers", "numbers"),
  c("animations", "Typewriters", "typewriter"),
  c("animations", "Beams & Spotlights", "beams"),
  c("animations", "Glitch", "glitch"),
  c("animations", "Blur & Focus", "blur"),
  c("animations", "Magnetic", "magnetic"),
  c("animations", "Springs", "springs"),
  c("animations", "Stagger", "stagger"),
  c("animations", "Draggable", "draggable"),
  c("animations", "3D & Perspective", "three-d"),
  c("animations", "SVG Paths", "svg"),
  c("animations", "Micro-interactions", "micro"),
  c("animations", "Infinite Loops", "infinite"),
  c("animations", "Masks & Clips", "masks"),
  c("animations", "Noise & Grain", "noise"),
]

export const COMPONENT_CATEGORIES: Category[] = [
  c("components", "Accordions", "accordion"),
  c("components", "AI Chats", "ai-chat"),
  c("components", "Alerts", "alert"),
  c("components", "Avatars", "avatar"),
  c("components", "Badges", "badge"),
  c("components", "Buttons", "button"),
  c("components", "Calendars", "calendar"),
  c("components", "Cards", "card"),
  c("components", "Carousels", "carousel"),
  c("components", "Charts & Data Viz", "data-visualization"),
  c("components", "Checkboxes", "checkbox"),
  c("components", "Dialogs / Modals", "modal"),
  c("components", "Dropdowns", "dropdown"),
  c("components", "Empty States", "empty-state"),
  c("components", "File Uploads", "upload-download"),
  c("components", "Footers", "footer"),
  c("components", "Forms", "form"),
  c("components", "Grids & Bento", "grid"),
  c("components", "Heroes", "hero"),
  c("components", "Icons", "icon"),
  c("components", "Inputs", "input"),
  c("components", "Lists", "list"),
  c("components", "Menus", "menu"),
  c("components", "Navigation Menus", "navbar"),
  c("components", "Notifications", "notification"),
  c("components", "Paginations", "pagination"),
  c("components", "Popovers", "popover"),
  c("components", "Pricing Sections", "pricing-section"),
  c("components", "Progress", "progress"),
  c("components", "Search Bars", "search"),
  c("components", "Selects", "select"),
  c("components", "Sidebars", "sidebar"),
  c("components", "Sign Ins", "sign-in"),
  c("components", "Sliders", "slider"),
  c("components", "Spinner Loaders", "spinner"),
  c("components", "Steppers", "steps"),
  c("components", "Tables", "table"),
  c("components", "Tabs", "tabs"),
  c("components", "Tags", "chip"),
  c("components", "Testimonials", "testimonial"),
  c("components", "Text Areas", "textarea"),
  c("components", "Toasts", "toast"),
  c("components", "Toggles", "toggle"),
  c("components", "Tooltips", "tooltip"),
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
    blurb: "Drop-in motion, from one-line text effects to full shaders.",
    categories: ANIMATION_CATEGORIES,
  },
  {
    kind: "components",
    label: "UI Components",
    blurb: "The primitives the templates are built from.",
    categories: COMPONENT_CATEGORIES,
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
