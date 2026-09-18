/**
 * Everything the daylight portfolio says, in one file.
 *
 * The page and its components read from here and hold no copy of their own, so
 * re-voicing the whole site for a different person is one file to edit and no
 * JSX to touch. Swap the palette in `daylight.css` and the words here and
 * nothing else needs to change.
 *
 * The persona is a fictional senior engineer. Every string is meant to sound
 * like a real portfolio, not filler — replace it with yours.
 */

/**
 * Where the template is mounted. The home link uses it; the in-page nav uses
 * the `#anchor` hashes below, which do not move when `BASE` changes.
 */
export const BASE = "/daylight"

export const profile = {
  name: "Adrian",
  surname: "Vale",
  /** Sits in the header beside the name and drives the page title. */
  role: "Senior Software Engineer",
  location: "Lisbon, Portugal",
  email: "hello@example.com",
  github: { label: "github.com/adrianvale", href: "https://github.com/adrianvale" },
  linkedin: { label: "in/adrianvale", href: "https://www.linkedin.com/in/adrianvale" },
  /** Friendly professional headshot, served from `public/daylight/`. */
  portrait: { src: `${BASE}/portrait.png`, width: 1024, height: 1024 },
  year: 2026,
} as const

/** In-page anchors. `href` is a hash so it works no matter where BASE points. */
export const nav = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Work", href: "#work" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
] as const

/** The opening. Kept short — the whitespace does the rest of the work. */
export const hero = {
  greeting: "Hi, I'm Adrian.",
  headline: "I build calm, reliable software that people actually enjoy using.",
  lede:
    "Senior engineer with a decade of shipping web platforms end to end — from the data model to the last pixel. I care about clarity, performance, and interfaces that stay out of the way.",
  primary: { label: "See my work", href: "#work" },
  secondary: { label: "Get in touch", href: "#contact" },
} as const

/** The quick-facts strip under the hero. Four numbers, no more. */
export const stats = [
  { value: "10+", label: "Years shipping" },
  { value: "40+", label: "Projects delivered" },
  { value: "12", label: "Teams mentored" },
  { value: "99.9%", label: "Uptime maintained" },
] as const

/** The about section: a small heading and a couple of grounded paragraphs. */
export const about = {
  label: "About",
  heading: "A senior engineer who sweats the details so users never have to.",
  body: [
    "I've spent the last ten years building products across fintech, health, and developer tooling — usually as the person who owns a feature from the first sketch to the graphs the morning after launch. I like being close to the problem and close to the people it affects.",
    "My happiest work sits at the seam between design and engineering: turning a fuzzy idea into something that loads fast, reads clearly, and holds up under real traffic. I write tests I'd trust at 3am, document the decisions that mattered, and leave codebases calmer than I found them.",
  ],
  /** A bright, clean workspace photo, served from `public/daylight/`. */
  image: { src: `${BASE}/workspace.png`, width: 1024, height: 1024, alt: "A bright, tidy desk with a laptop and notebook" },
  /** The small caption pinned to the workspace image. */
  caption: "Where the work happens — Lisbon, most mornings.",
} as const

/** Skills, grouped. Each group is a titled cluster of chips. */
export const skills = {
  label: "Skills",
  heading: "The tools I reach for.",
  lede: "A working set built over years, not a wishlist. These are the things I use well and often.",
  groups: [
    {
      title: "Languages",
      items: ["TypeScript", "JavaScript", "Python", "Go", "SQL"],
    },
    {
      title: "Frontend",
      items: ["React", "Next.js", "Tailwind", "Design systems", "Accessibility"],
    },
    {
      title: "Backend",
      items: ["Node.js", "PostgreSQL", "GraphQL", "REST APIs", "Redis"],
    },
    {
      title: "Platform",
      items: ["AWS", "Docker", "CI/CD", "Observability", "Terraform"],
    },
  ],
} as const

/** Featured projects. Three or four, each defensible. */
export const projects = {
  label: "Selected work",
  heading: "Projects I'm proud of.",
  items: [
    {
      title: "Ledgerline",
      blurb:
        "A double-entry accounting engine for small studios. I designed the data model and the reconciliation flow, cutting month-end close from two days to twenty minutes.",
      tags: ["Next.js", "PostgreSQL", "TypeScript"],
      /** A soft gradient stands in for a screenshot — see `daylight.css`. */
      accent: "aurora",
      links: [
        { label: "Live site", href: "https://example.com/ledgerline" },
        { label: "Case study", href: "https://example.com/ledgerline/case-study" },
      ],
    },
    {
      title: "Northwind Health",
      blurb:
        "A patient-facing scheduling app used by nine clinics. Built the availability engine and the accessible booking UI; it now handles 4,000 appointments a week without a hitch.",
      tags: ["React", "Go", "Accessibility"],
      accent: "meadow",
      links: [{ label: "Read more", href: "https://example.com/northwind" }],
    },
    {
      title: "Beacon CLI",
      blurb:
        "An open-source tool that turns flaky CI logs into a single readable timeline. Started as a weekend fix for my own frustration; now 3k stars and a dozen contributors.",
      tags: ["Go", "Open source", "DX"],
      accent: "dusk",
      links: [
        { label: "GitHub", href: "https://github.com/adrianvale/beacon" },
        { label: "Docs", href: "https://example.com/beacon" },
      ],
    },
    {
      title: "Studio Workspace",
      blurb:
        "A collaborative whiteboard for distributed design teams, rebuilt for speed. Rewrote the sync layer to CRDTs and brought p95 render latency under 40ms on 50-person boards.",
      tags: ["TypeScript", "WebSockets", "Performance"],
      /** This card uses the real workspace photo instead of a gradient. */
      image: about.image,
      links: [{ label: "Live site", href: "https://example.com/studio" }],
    },
  ],
} as const

/** Experience timeline. Newest first. */
export const experience = {
  label: "Experience",
  heading: "Where I've been.",
  roles: [
    {
      period: "2022 — Now",
      title: "Staff Engineer",
      company: "Meridian Labs",
      body:
        "Lead the platform team behind a payments product handling millions in monthly volume. Set the technical direction, mentor five engineers, and still ship the hard bits myself.",
    },
    {
      period: "2019 — 2022",
      title: "Senior Software Engineer",
      company: "Northwind Health",
      body:
        "Owned the patient scheduling platform end to end. Rebuilt it for accessibility and scale, and grew the frontend guild from a habit into a practice.",
    },
    {
      period: "2016 — 2019",
      title: "Software Engineer",
      company: "Fieldnote",
      body:
        "Second engineer at an early-stage startup. Wore every hat — shipped the first web app, the mobile client, and the on-call rotation that kept them running.",
    },
    {
      period: "2014 — 2016",
      title: "Frontend Developer",
      company: "Studio Cobalt",
      body:
        "Built marketing sites and product prototypes for agency clients. Learned to make things fast, make them accessible, and make them on time.",
    },
  ],
} as const

/** The closing call to action. */
export const contact = {
  label: "Contact",
  heading: "Let's build something worth using.",
  lede:
    "I'm open to freelance projects, fractional engineering leadership, and the occasional interesting conversation. The fastest way to reach me is email.",
  cta: { label: "Say hello", href: "mailto:hello@example.com" },
} as const

export const footer = {
  blurb:
    "Adrian Vale — senior software engineer in Lisbon. This is a demo of the daylight portfolio template; every word on it lives in one file.",
  builtWith: "Built with Next.js. Designed to stay out of the way.",
} as const
