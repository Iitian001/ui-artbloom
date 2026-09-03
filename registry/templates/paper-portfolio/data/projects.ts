/**
 * Content and routing for the paper-portfolio template.
 *
 * Everything a consumer needs to change lives here. The copy is placeholder copy
 * — replace it with your own before shipping.
 */

/**
 * Where the template is mounted. The install writes it to
 * `app/paper-portfolio/`, so every internal link is prefixed with this. Move the
 * folder and change this one string; nothing else hard-codes a path.
 *
 * Mounting it at the root (`""`) works too, but then the template owns `/work`,
 * `/about`, `/contact` and friends — decide that deliberately.
 */
export const BASE = "/paper-portfolio"

/** Prefix a template-internal path with {@link BASE}. */
export function href(path: string): string {
  return path === "/" ? BASE || "/" : `${BASE}${path}`
}

/** Identity shown in the header, footer, hero and resume. */
export const profile = {
  name: "Field Notes",
  surname: "Studio",
  role: "Interface design · front-end · systems",
  location: "Remote · working worldwide",
  studio: "Field Notes Studio",
  site: "your-site.com",
  siteUrl: "https://your-site.com",
  email: "hello@your-site.com",
  handle: "your-handle",
  repoUrl: "https://github.com/your-handle",
} as const

export type Project = {
  slug: string
  title: string
  category: string
  year: string
  /** Seed for the generated paper glyph on cards and case studies. */
  mark: string
  short: string
  statement: string
  challenge: string
  solution: string
  stack: string[]
  status: string
  /** Optional outbound link shown as "Open repository" on the case study. */
  external?: string
}

export const projects: Project[] = [
  {
    slug: "ledger-atlas",
    title: "Ledger Atlas",
    category: "Finance Dashboard",
    year: "2026",
    mark: "atlas",
    short: "A reporting surface that turns twelve scattered spreadsheets into one readable page.",
    statement:
      "Finance teams do not need another chart library. They need one page they trust enough to forward without editing it first.",
    challenge:
      "Six data sources, three reconciliation rules and a monthly close that lived in someone's inbox.",
    solution:
      "One canonical table, drill-downs that keep their place, and every number traceable to the row it came from.",
    stack: ["Next.js", "PostgreSQL", "Server Actions", "Recharts", "Design system"],
    status: "Shipped",
  },
  {
    slug: "kiln-scheduler",
    title: "Kiln",
    category: "Studio Scheduling",
    year: "2025",
    mark: "kiln",
    short: "Booking software for shared workshops, built around the way makers actually queue for machines.",
    statement:
      "The hard part of scheduling is not the calendar. It is telling somebody their slot moved without making them feel bumped.",
    challenge:
      "Overlapping resources, half-hour granularity and a membership tier system that changed twice mid-build.",
    solution:
      "A single availability model with tiers as a policy layer on top, so pricing changes never touch the booking logic.",
    stack: ["React", "Node", "SQLite", "Realtime sync", "Interaction design"],
    status: "In production",
  },
  {
    slug: "field-recorder",
    title: "Field Recorder",
    category: "Audio Tooling",
    year: "2025",
    mark: "recorder",
    short: "A browser recorder for interviews that transcribes locally and never uploads the raw take.",
    statement:
      "Recording someone is an act of trust. The software should not quietly ship their voice to a third party.",
    challenge: "Long sessions, low-end laptops, and transcription that had to run without a server.",
    solution:
      "Chunked capture to IndexedDB with a WebAssembly transcriber, so the tab can crash and the take survives.",
    stack: ["WebAudio", "WebAssembly", "IndexedDB", "Web Workers"],
    status: "Beta",
  },
  {
    slug: "paper-trail",
    title: "Paper Trail",
    category: "Documentation Engine",
    year: "2024",
    mark: "trail",
    short: "Docs that are generated from the code they describe, so they cannot drift from it.",
    statement:
      "Every documentation site rots. The only fix is making the source of truth impossible to edit separately.",
    challenge: "Four repositories, two languages and a docs site nobody had updated in eight months.",
    solution:
      "A build step that reads annotations out of the source and fails CI when a documented symbol disappears.",
    stack: ["TypeScript", "AST tooling", "MDX", "CI pipelines"],
    status: "Maintained",
  },
  {
    slug: "signal-garden",
    title: "Signal Garden",
    category: "Monitoring",
    year: "2024",
    mark: "garden",
    short: "An alerting layer that groups noise into incidents instead of paging on every spike.",
    statement:
      "An alert that fires forty times is not forty problems. Treating it as one is most of the work.",
    challenge: "A team receiving hundreds of pages a week and had learned to ignore all of them.",
    solution:
      "Correlation windows, a deduplication key per service, and a digest that replaced the 3am page for anything non-urgent.",
    stack: ["Go", "Prometheus", "Event correlation", "On-call design"],
    status: "Shipped",
  },
  {
    slug: "kerning-club",
    title: "Kerning Club",
    category: "Type Experiment",
    year: "2023",
    mark: "kerning",
    short: "A small game that teaches letter spacing by making you fix it under time pressure.",
    statement: "You cannot explain kerning. You can only make someone stare at it until they see it.",
    challenge: "Scoring subjective spacing without a right answer to compare against.",
    solution: "Optical area comparison against a reference set, scored on relative error rather than pixels.",
    stack: ["Canvas", "TypeScript", "Font metrics"],
    status: "Weekend build",
  },
]

/** The four shown on the home page. */
export const featuredProjects: Project[] = projects.slice(0, 4)

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug)
}
