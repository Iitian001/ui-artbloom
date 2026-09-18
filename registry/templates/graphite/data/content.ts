/**
 * Everything the template says, in one file.
 *
 * The page and its components read from here and hold no copy of their own, so
 * re-voicing the whole portfolio for a different person is one file to edit and
 * no JSX to touch. Swap the palette in `graphite.css` and the words here and
 * nothing else needs to change.
 *
 * The demo persona is a design engineer who trained as an illustrator, because
 * the graphite/sketchbook aesthetic wants someone who genuinely works by hand.
 * Replace it with yours — keep it specific, and it will keep feeling real.
 */

/** Where the template is mounted. Change this and every internal link follows. */
export const BASE = "/graphite"

export const profile = {
  name: "Rowan Ashcroft",
  /** Sits under the name in the header and drives the metadata title. */
  role: "Design engineer & illustrator",
  location: "Edinburgh",
  year: 2026,
  email: "rowan@ashcroft.studio",
} as const

/** In-page anchors — this is one long scroll, not a set of routes. */
export const nav = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
] as const

/**
 * The opening. `title` is set line by line at display size, so keep each line
 * short — the line breaks are the composition. The line flagged `mark` gets the
 * hand-drawn underline drawn under it.
 */
export const hero = {
  kicker: "Design engineer, illustrator — Edinburgh",
  title: [
    { text: "Drawn first,", mark: false },
    { text: "then built.", mark: true },
  ] as const,
  lede:
    "I'm Rowan — a design engineer who still reaches for a 2B pencil before a text editor. I make interfaces that feel considered, tactile, and quietly alive.",
  primary: { label: "See the work", href: "#work" },
  secondary: { label: "Say hello", href: "#contact" },
  portrait: {
    src: `${BASE}/portrait.png`,
    alt: "Graphite pencil self-portrait of Rowan Ashcroft on cream sketchbook paper.",
    caption: "Self-portrait — 2B on cartridge paper",
  },
} as const

/**
 * The essay-like About. `note` is the handwritten margin annotation; `pull` is
 * the one line big enough to stop on. Paragraphs read as one continuous voice,
 * set in editorial columns on a wide screen.
 */
export const about = {
  label: "About",
  lead: "The short version, in my own hand.",
  pull: "A pencil is the most honest prototyping tool I own.",
  note: "still drawing strangers on the train, badly and happily",
  paragraphs: [
    "For ten years I've worked in the seam between design and engineering — the place where a flat mockup becomes something you can actually click, and where most of the good decisions quietly get made or lost.",
    "I trained as an illustrator long before I wrote a line of code, and it shows. I still sketch every interface on paper first, because a pencil is faster than any prototyping tool and far more honest about what isn't working yet.",
    "These days I build design systems and the front-of-the-frontend for studios and small product teams. I like problems that need both halves of the brain: a type scale that has to survive real content, an animation that has to feel inevitable rather than decorative.",
    "The work I care about looks calm and reads slow, but it's held together by an obsessive amount of small craft — the easing on a menu, the weight of a rule, the half-second before a page settles into place.",
  ] as const,
} as const

/** A tidy, understated grid. Four groups, four items each. */
export const skills = {
  label: "Toolkit",
  heading: "What I reach for",
  note: "no framework loyalty, only taste",
  groups: [
    {
      title: "Interface & interaction",
      items: ["React & TypeScript", "Motion & micro-interaction", "Accessibility first", "Progressive enhancement"],
    },
    {
      title: "Type & layout",
      items: ["Editorial typography", "Design systems", "Variable fonts", "CSS architecture"],
    },
    {
      title: "By hand",
      items: ["Illustration", "Hand-lettering", "Figma & prototyping", "Storyboarding"],
    },
    {
      title: "Foundations",
      items: ["Next.js", "Node & APIs", "Web performance", "Design tokens"],
    },
  ],
} as const

/**
 * Selected work. Each project is a sketchbook entry — an index, a kind, a year,
 * a title, a couple of lines, its stack, and one link out. Three or four reads
 * best; the cards are meant to feel pinned to the page.
 */
export const work = {
  label: "Selected work",
  heading: "A few things I've drawn and built",
  projects: [
    {
      index: "01",
      kind: "Product",
      year: "2025",
      title: "Marginalia",
      body:
        "A reading app that turns your highlights and marginal notes into a searchable personal index. I built the reading surface, the annotation model, and offline-first sync.",
      tags: ["React", "TypeScript", "IndexedDB", "PWA"],
      link: { label: "Read the notes", href: "https://github.com" },
    },
    {
      index: "02",
      kind: "Tool",
      year: "2024",
      title: "Silverpoint",
      body:
        "A browser drawing tool with pressure-sensitive vector strokes and a real paper-grain canvas. I wrote the stroke engine and a WASM smoothing pipeline that keeps lines honest.",
      tags: ["Canvas", "WebGL", "Rust · WASM", "Pointer Events"],
      link: { label: "See it move", href: "https://github.com" },
    },
    {
      index: "03",
      kind: "System",
      year: "2024",
      title: "Foundry",
      body:
        "An editorial design system for a books publisher — 200+ tokens, a variable type scale, and a Figma-to-code pipeline that kept design and engineering telling the same story.",
      tags: ["Design tokens", "Style Dictionary", "Figma API", "Storybook"],
      link: { label: "Open the case study", href: "https://github.com" },
    },
    {
      index: "04",
      kind: "Concept",
      year: "2023",
      title: "Nightpost",
      body:
        "A slow reader for long-form writing. I designed the calm typographic reading experience and a quiet notification model that respects your evening instead of interrupting it.",
      tags: ["Next.js", "Postgres", "Typography", "Motion"],
      link: { label: "Read the notes", href: "https://github.com" },
    },
  ],
} as const

/** The quiet close. `heading` is split so one word can be circled by hand. */
export const contact = {
  label: "Contact",
  heading: { lead: "Let's make something", accent: "considered", tail: "." },
  body:
    "I take on a small number of studio and product projects each year — design systems, tricky front-end, the occasional illustration. If that sounds like your kind of thing, say hello.",
  note: "usually a reply within a day or two",
  cta: { label: "Email me", href: `mailto:${profile.email}` },
  socials: [
    { label: "GitHub", handle: "rowanashcroft", href: "https://github.com", icon: "github" },
    { label: "LinkedIn", handle: "in/rowanashcroft", href: "https://linkedin.com", icon: "linkedin" },
    { label: "Email", handle: profile.email, href: `mailto:${profile.email}`, icon: "mail" },
  ],
} as const

export const footer = {
  blurb:
    "Design engineer and illustrator, drawn and coded in Edinburgh. This is a demo of the graphite portfolio template — every word on it lives in one file.",
  links: [
    { label: "Work", href: "#work" },
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact" },
    { label: "Email", href: `mailto:${profile.email}` },
  ],
  note: "Drawn & built in Edinburgh",
} as const
