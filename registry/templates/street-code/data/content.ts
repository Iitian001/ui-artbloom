/**
 * Everything the street-code portfolio says, in one file.
 *
 * The page and its components hold no copy of their own — they read from here.
 * Re-voicing the whole site for a different developer is one file to edit and no
 * JSX to touch. Swap the palette in `street-code.css`, swap the words here, drop
 * in a new portrait at `/street-code/portrait.png`, and it is someone else's site.
 *
 * The demo persona is a Brooklyn street-artist-turned-developer, because the
 * template's whole reason for existing is attitude and this is a voice that can
 * carry it. Replace it with yours.
 */

/** Where the template is mounted. The brand mark links here; nav uses in-page hashes. */
export const BASE = "/street-code"

export const brand = {
  /** The tag. Sprayed big in the header and footer — keep it short and loud. */
  tag: "RIOT",
  name: "Marcus Vega",
  handle: "@riot.codes",
  role: "Full-stack dev & creative technologist",
  city: "Brooklyn, NY",
  email: "hey@riot.codes",
  year: 2026,
} as const

/** In-page anchors — this is one long scroll, so nav jumps rather than routes. */
export const nav = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
] as const

/**
 * The hero. `headline` is set one word per line at display size — three short,
 * hard words read best, and the line breaks are the composition. `circled` names
 * the word that gets the hand-drawn scribble loop around it.
 */
export const hero = {
  kicker: "Freelance dev for hire — Brooklyn, since '14",
  headline: ["IDEAS", "INTO", "CODE"] as const,
  circled: "CODE",
  lede:
    "I build loud, fast, unmistakable web things for brands that refuse to blend in. Ten years turning half-baked 2am ideas into production code that actually ships.",
  primary: { label: "See the work", href: "#work" },
  secondary: { label: "Start something", href: "#contact" },
  portrait: {
    src: `${BASE}/portrait.png`,
    alt: "Marcus Vega — hood up, shades on, against a black wall",
  },
  /** The scribbled note pinned to the portrait. */
  portraitNote: "yeah, that's me",
  stats: [
    { value: "10+", label: "years shipping" },
    { value: "60+", label: "projects live" },
    { value: "3k", label: "github stars" },
  ] as const,
} as const

/**
 * The strip that scrolls under the hero. Short, punchy, no punctuation — half
 * slogans, half skills, all attitude. Rendered twice so the loop never jumps.
 */
export const marquee = [
  "IDEAS INTO CODE",
  "SHIP IT LOUD",
  "NO ROUNDED CORNERS",
  "TYPESCRIPT ALL DAY",
  "MADE IN BROOKLYN",
  "STAY DANGEROUS",
] as const

export const about = {
  label: "Who's asking",
  heading: "I write code like it's on a wall — bold, fast, and impossible to ignore.",
  body: [
    "Started tagging HTML in a Bushwick basement in 2014 and never really stopped. Somewhere between the spray cans and the standups I worked out that shipping software is the same game as painting a wall: show up, commit to the line, and don't second-guess it halfway through.",
    "These days I run point on front-of-stack builds — design systems, WebGL toys, audio experiments, the occasional Rust CLI when I'm feeling feral. I care about type that hits, motion that actually means something, and code the next person can read without cursing my name.",
    "No agencies, no middlemen, no “it depends.” You bring the idea. I bring the paint.",
  ] as const,
  signature: "— RIOT",
} as const

export const projects = {
  label: "Selected work",
  heading: "Four things I shipped and would ship again",
  items: [
    {
      index: "01",
      title: "HALFTONE",
      blurb:
        "A design-token pipeline that syncs Figma variables to CSS, Swift, and Kotlin on every merge. Runs the design system at two YC-backed startups.",
      tags: ["TypeScript", "Figma API", "Turborepo"],
      year: "2025",
      link: { label: "Source", href: "https://github.com/riotcodes/halftone" },
    },
    {
      index: "02",
      title: "RIOT.FM",
      blurb:
        "A browser drum machine and step sequencer built on raw Web Audio — no samples, no backend. Forty thousand beats made and counting.",
      tags: ["Web Audio", "React", "Canvas"],
      year: "2024",
      link: { label: "Live demo", href: "https://riot.fm" },
    },
    {
      index: "03",
      title: "DEADLINE",
      blurb:
        "A terminal-first release tool that turns messy git history into a changelog you'd actually publish. Three thousand stars, one long weekend.",
      tags: ["Rust", "CLI", "Git"],
      year: "2023",
      link: { label: "Source", href: "https://github.com/riotcodes/deadline" },
    },
    {
      index: "04",
      title: "CONCRETE",
      blurb:
        "A brutalist React component library. Heavy borders, hard offset shadows, zero rounded corners, and WCAG-clean straight out of the box.",
      tags: ["React", "CSS", "a11y"],
      year: "2025",
      link: { label: "Docs", href: "https://concrete.riot.codes" },
    },
  ] as const,
} as const

export const skills = {
  label: "The kit",
  heading: "What's in the bag",
  groups: [
    {
      title: "Front of stack",
      items: ["React", "Next.js", "TypeScript", "WebGL / Three", "Motion"],
    },
    {
      title: "Back of stack",
      items: ["Node", "Postgres", "Rust", "Redis", "Edge functions"],
    },
    {
      title: "The craft",
      items: ["Design systems", "Creative coding", "Accessibility", "Performance", "Type"],
    },
  ] as const,
} as const

export const contact = {
  label: "Say something",
  heading: "Got something that shouldn't look like everything else?",
  lede:
    "Freelance slots open for Q3. Tell me what you're building — I reply within a day, usually a lot less.",
  emailLabel: "Hit the line",
  socials: [
    { label: "GitHub", handle: "github.com/riotcodes", href: "https://github.com/riotcodes" },
    { label: "Twitter / X", handle: "@riotcodes", href: "https://x.com/riotcodes" },
    { label: "Read.cv", handle: "read.cv/riot", href: "https://read.cv/riot" },
  ] as const,
} as const

export const footer = {
  blurb:
    "RIOT is the working name of Marcus Vega, a full-stack developer and creative technologist in Brooklyn. This is a demo of the street-code portfolio template — every word on it lives in one file.",
} as const
