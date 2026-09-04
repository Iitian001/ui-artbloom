/**
 * Everything the template says, in one file.
 *
 * The pages read from here and hold no copy of their own, so re-voicing the whole
 * site for a different product is one file to edit and no JSX to touch. Swap the
 * palette in `monolith-launch.css` and the words here and nothing else needs to
 * change.
 *
 * The demo product is a single-dose espresso machine because a launch page needs
 * something with real specifications to talk about. Replace it with yours.
 */

/** Where the template is mounted. Change this and every internal link follows. */
export const BASE = "/monolith-launch"

export const brand = {
  name: "Monolith",
  product: "Monolith One",
  /** Sits in the corner of the header. Keep it to three or four words. */
  descriptor: "Single-dose espresso",
  email: "hello@monolith.example",
  /** Shown in the footer and used for the reserve confirmation copy. */
  city: "Turin",
  year: 2026,
} as const

export const nav = [
  { label: "Story", href: `${BASE}/story` },
  { label: "Specifications", href: `${BASE}/specs` },
  { label: "Reserve", href: `${BASE}/reserve` },
] as const

/**
 * The opening. `words` is set one per line at display size, so three or four
 * short ones read best — the line breaks are the composition.
 */
export const hero = {
  eyebrow: "A machine that holds its temperature",
  words: ["Pressure", "and", "patience"] as const,
  lede:
    "Ninety-two degrees, held to a tenth, for as long as the shot takes. Everything else on this machine exists to protect that one number.",
  primary: { label: "Reserve one", href: `${BASE}/reserve` },
  secondary: { label: "Read the story", href: `${BASE}/story` },
  /** The strip that scrolls under the hero. Short phrases, no punctuation. */
  ticker: [
    "Brushed 316 steel",
    "58mm basket",
    "PID to 0.1°C",
    "Nine bar, flat",
    "Built in Turin",
    "Ten year parts",
  ] as const,
} as const

/** The quiet full-width statement between the hero and the detail. */
export const manifesto = {
  heading: "We removed everything that was not the shot",
  body: [
    "A pressure gauge tells you what already happened. A second boiler solves a problem you do not have at home. A screen asks you to read while your coffee cools.",
    "So none of them are here. What is here is a thermal core that recovers in four seconds, a pump curve you can shape, and a body heavy enough that nothing moves when you lock the basket in.",
  ] as const,
} as const

/** Three or four. Each one is a claim you can defend with a number. */
export const pillars = [
  {
    index: "01",
    title: "Holds its heat",
    body:
      "A 1.4kg brass core under PID control, sampled forty times a second. Group temperature stays inside a tenth of a degree from first shot to twentieth.",
    metric: "±0.1°C",
    metricLabel: "at the group",
  },
  {
    index: "02",
    title: "Shapes the pressure",
    body:
      "A geared pump instead of a vibration one, so the ramp is yours: pre-infuse low and long, hold at nine, then decline into the tail without touching a paddle.",
    metric: "0–12 bar",
    metricLabel: "programmable",
  },
  {
    index: "03",
    title: "Recovers immediately",
    body:
      "Four seconds back to setpoint after a double. Two people, two shots, one after the other, with no waiting and no compromise on the second.",
    metric: "4s",
    metricLabel: "to setpoint",
  },
  {
    index: "04",
    title: "Opens with two screws",
    body:
      "Every part inside is a part you can buy from us for ten years, with the diagrams published. Gaskets, the pump, the controller — all of it, all replaceable at the kitchen table.",
    metric: "10 yr",
    metricLabel: "parts guarantee",
  },
] as const

/**
 * Section labels and headings for the home page.
 *
 * These are here rather than in the JSX for the same reason as everything else:
 * so that re-voicing the site never means opening a component.
 */
export const sections = {
  manifesto: "Position",
  pillars: {
    label: "The machine",
    heading: "Four claims, each with a number behind it",
  },
  specs: {
    label: "Specifications",
    heading: "The short version",
    cta: { label: "Every specification", href: `${BASE}/specs` },
  },
  offer: "Availability",
} as const

/** The opener on the specifications page. */
export const specsIntro = {
  eyebrow: "Specifications",
  heading: "Every number we will stand behind",
  lede:
    "Measured on production units at 22°C ambient, not modelled. Where a figure carries a tolerance, the tolerance is the figure.",
} as const

/** Grouped for the specifications page and the short list on the home page. */
export const specs = [
  {
    group: "Thermal",
    rows: [
      ["Core", "1.4kg machined brass, insulated"],
      ["Control", "PID, 40Hz sampling, 0.1°C band"],
      ["Recovery", "4 seconds to setpoint after a double"],
      ["Range", "86–96°C, set in tenths"],
    ],
  },
  {
    group: "Pressure",
    rows: [
      ["Pump", "Geared rotary, 48V brushless"],
      ["Profile", "Six programmable points, 0–12 bar"],
      ["Flow", "0.5–9 ml/s, measured not inferred"],
      ["Basket", "58mm, 18g and 21g included"],
    ],
  },
  {
    group: "Body",
    rows: [
      ["Shell", "Brushed 316 stainless, 3mm"],
      ["Mass", "14.2kg"],
      ["Footprint", "245 × 310mm, 360mm tall"],
      ["Water", "2.1L side-fill, or plumbed"],
    ],
  },
  {
    group: "Electrical",
    rows: [
      ["Supply", "220–240V, 50/60Hz, 1400W"],
      ["Standby", "Under 0.4W"],
      ["Warm-up", "11 minutes from cold"],
      ["Certification", "CE, UKCA, cETLus"],
    ],
  },
] as const

/** The commercial line. `note` carries the honest caveat. */
export const offer = {
  eyebrow: "First run",
  price: "€2,400",
  priceNote: "including VAT, shipped within the EU",
  heading: "Four hundred machines, then we stop and listen",
  body:
    "The first run is built to order in Turin and ships in the order it was reserved. A reservation costs nothing and holds your place; we ask for payment when your machine is two weeks from the bench.",
  cta: { label: "Reserve without paying", href: `${BASE}/reserve` },
  note: "No card, no deposit, and cancel with one email.",
} as const

/**
 * The brand story page. Each beat is a year and a paragraph, which is enough
 * structure to carry a page without inventing a timeline component.
 */
export const story = {
  eyebrow: "Story",
  heading: "It started as a complaint",
  lede:
    "Two of us spent a decade building thermal controllers for laboratory equipment, then went home and made coffee on machines that could not hold a temperature.",
  beats: [
    {
      year: "2021",
      title: "The complaint",
      body:
        "A borrowed lab thermocouple in the group of a well-reviewed machine. Eleven degrees of swing across five shots. We stopped blaming the beans.",
    },
    {
      year: "2023",
      title: "The core",
      body:
        "Forty brass cores, each one heavier and more insulated than the last, until the curve went flat. The one that worked is the one in the machine — we stopped when it stopped mattering.",
    },
    {
      year: "2025",
      title: "The body",
      body:
        "Steel, because it can be refinished and it does not creak when you lock in a basket. Heavier than it needs to be for the same reason a good anvil is.",
    },
    {
      year: "2026",
      title: "The first four hundred",
      body:
        "Built to order, in the order reserved. When they are gone we will fix what we got wrong before building any more.",
    },
  ] as const,
} as const

/** Reserve page copy. The form itself posts nowhere until you wire it. */
export const reserve = {
  eyebrow: "Reserve",
  heading: "Hold a place in the first run",
  lede:
    "One machine per person. We will email you once when your slot is two weeks out, and never otherwise.",
  fields: {
    name: "Your name",
    email: "Email",
    country: "Shipping country",
    note: "Anything you want us to know (optional)",
  },
  submit: "Reserve my place",
  /** The three lines in the card beside the form. */
  terms: [
    "No payment now and no card stored — a reservation is a place in the queue.",
    `Built to order in ${brand.city}, and shipped in the order reserved.`,
    "Cancel with one reply to the email we send you.",
  ] as const,
  finePrint:
    "No payment now, and nothing stored beyond what is in this form. Cancelling is one reply to that email.",
} as const

export const footer = {
  blurb:
    "A single-dose espresso machine built around one number, in a shop in Turin. This is a demo of the Monolith launch template — every word on it lives in one file.",
  columns: [
    {
      heading: "Product",
      links: [
        { label: "Story", href: `${BASE}/story` },
        { label: "Specifications", href: `${BASE}/specs` },
        { label: "Reserve", href: `${BASE}/reserve` },
      ],
    },
  ],
} as const
