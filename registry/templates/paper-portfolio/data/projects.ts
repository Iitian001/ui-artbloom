/**
 * Content and routing for the paper-portfolio template.
 *
 * Everything a consumer needs to change lives here: the identity in
 * {@link profile} and the case studies in {@link projects}. Both hold the real
 * content of the portfolio this template was cut from — Shreyash Mishra's site
 * — deliberately, so the preview and a fresh install read the same. Swap both
 * objects for your own before you deploy it as yours.
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

/**
 * Identity shown in the header, footer, hero and resume.
 *
 * These are real: a real person, a real domain, a real inbox. If you install
 * this template, replace every field before you publish — otherwise you ship
 * someone else's name and portrait.
 */
export const profile = {
  name: "Shreyash",
  surname: "Mishra",
  role: "AI Engineer · Developer · Builder",
  location: "India · working worldwide",
  studio: "Bloom Kernel Labs",
  site: "shreyashmishra.in",
  siteUrl: "https://shreyashmishra.in",
  email: "shreyash.aiml.dev@gmail.com",
  handle: "Iitian001",
  repoUrl: "https://github.com/Iitian001",
  /**
   * Portrait collage for the hero and the about page. Same asset contract as
   * {@link Project.image}: it installs to `public/paper-portfolio/` and is
   * served from the base URL, not from {@link BASE}.
   */
  portrait: "/paper-portfolio/hero-collage.png",
} as const

export type Project = {
  slug: string
  title: string
  category: string
  year: string
  /**
   * Screenshot shown on the card and in the case-study header.
   *
   * The file lives at `assets/<name>` inside this template, the install copies
   * it to `public/paper-portfolio/<name>`, and Next serves anything in `public`
   * from the base URL — so the path written here is `/paper-portfolio/<name>`.
   * It is deliberately independent of {@link BASE}: moving the routes does not
   * move the images.
   */
  image: string
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
    slug: "bloom-chat",
    title: "Bloom Chat",
    category: "Multimodal AI Workspace",
    year: "2026",
    image: "/paper-portfolio/bloom-chat.png",
    mark: "bloom-chat",
    short: "A multimodal AI workspace for research, memory, creation and focused work.",
    statement:
      "I wanted an AI workspace to feel like a place you think in—not another empty prompt box.",
    challenge:
      "Bring chat, research, image creation and persistent memory into one product without burying the user in controls.",
    solution:
      "A modular workspace with a quiet conversational core, project context, memory surfaces and deliberate tool entry points.",
    stack: ["Next.js", "React", "AI orchestration", "Memory systems", "Multimodal UX"],
    status: "In development",
  },
  {
    slug: "artbloom",
    title: "ArtBloom",
    category: "AI Creative Studio",
    year: "2026",
    image: "/paper-portfolio/artbloom.png",
    mark: "artbloom",
    short:
      "An expressive AI image studio designed to make generation feel like a creative process.",
    statement:
      "The goal is to make AI image generation feel less like filling a form and more like entering a studio.",
    challenge:
      "Keep an advanced image workflow understandable while supporting iteration, editing and visual exploration.",
    solution:
      "A visual-first interface built around creation states, galleries, focused controls and an art-directed identity.",
    stack: ["Next.js", "FastAPI", "FLUX", "Image pipelines", "Product design"],
    status: "Active build",
    external: "https://github.com/Iitian001/Art-bloom",
  },
  {
    slug: "pandu-pet",
    title: "Pandu Pet",
    category: "Animated Desktop Companion",
    year: "2026",
    image: "/paper-portfolio/pandu.png",
    mark: "pandu-pet",
    short:
      "A desktop companion that moves, reacts and grows into a small presence on your screen.",
    statement:
      "Pandu started with one question: can a desktop utility have enough character that people miss it when it is gone?",
    challenge:
      "Blend animation, lightweight desktop behavior and expressive states without making the companion distracting.",
    solution:
      "A state-driven pet system with reusable animation loops, interactions and room for future adaptive behavior.",
    stack: ["Godot", "Python tooling", "Animation pipelines", "Desktop UX"],
    status: "Prototype series",
    external: "https://github.com/Iitian001/Pandu_pet",
  },
  {
    slug: "bloom-browser",
    title: "Bloom Browser",
    category: "AI-native Browser",
    year: "2026",
    image: "/paper-portfolio/browser.png",
    mark: "bloom-browser",
    short:
      "A privacy-minded browser concept that treats AI as part of the browsing workflow rather than a sidebar.",
    statement:
      "The browser is where most digital work already happens. Bloom asks what it becomes when intelligence is native to that space.",
    challenge:
      "Introduce agentic capabilities without turning browsing into a noisy dashboard or compromising user control.",
    solution:
      "A browser shell centered on intentional actions, contextual assistance and visible user control over AI behavior.",
    stack: ["Browser architecture", "React", "Agent systems", "Privacy UX", "Product design"],
    status: "In development",
    external: "https://github.com/Iitian001/Bloom_browser",
  },
  {
    slug: "bloom-code",
    title: "Bloom Code",
    category: "Terminal Coding Agent",
    year: "2026",
    image: "/paper-portfolio/star.png",
    mark: "bloom-code",
    short:
      "A terminal-first coding agent exploring reliable multi-model execution and developer workflows.",
    statement:
      "Coding agents should feel fast and decisive, but also transparent enough that developers stay in control.",
    challenge:
      "Coordinate models, tools and repository context while keeping terminal interaction predictable.",
    solution:
      "A compact agent loop with explicit tool states, provider fallback concepts and benchmark-driven iteration.",
    stack: ["Node.js", "LLM APIs", "Terminal UX", "Agent orchestration"],
    status: "Research / build",
  },
  {
    slug: "bloom-call",
    title: "Bloom Call",
    category: "Voice AI Assistant",
    year: "2026",
    image: "/paper-portfolio/star.png",
    mark: "bloom-call",
    short: "A voice assistant concept for handling incoming and outgoing conversational calls.",
    statement:
      "Voice systems need to feel immediate, interruptible and human-paced rather than like a phone tree with an LLM attached.",
    challenge:
      "Join speech, reasoning and call state while keeping latency and failures understandable.",
    solution:
      "A provider-flexible voice pipeline with separated speech, reasoning and call-control layers.",
    stack: ["Voice AI", "LLM orchestration", "Realtime systems", "FastAPI"],
    status: "Exploration",
  },
]

/** The four shown on the home page. */
export const featuredProjects: Project[] = projects.slice(0, 4)

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug)
}
