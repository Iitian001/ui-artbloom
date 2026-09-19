"use client"

import { useEffect, useRef, useState } from "react"

/**
 * Assembly — a dated-event / ticketing site for "Assembly 2026", a three-day
 * design + technology conference in Lisbon.
 *
 * The archetype is organized around WHEN: a poster-grade hero carries a live
 * countdown to the doors, the lineup cascades in staggered by billing, the
 * agenda is tabbed by day, tickets tier with a deadline nudge tied to that same
 * countdown, and a buy bar rides along after the fold so the path to purchase is
 * never more than a glance away.
 *
 * Deliberate against the house tells: the base is a cool ink (not a brown-tinted
 * black), the bold move is the cobalt poster and the clock — everything else is
 * quiet off-white. No tracked-uppercase eyebrows, no middle-dot meta strings, no
 * em-dash fragment labels, no arrow-suffixed links, no glassmorphism. The only
 * numbering is the clock and the schedule, both of which are genuine sequences.
 * All decorative motion is gated on prefers-reduced-motion; the countdown keeps
 * ticking because it is live data, not decoration.
 */

// Fixed points in time. The countdown runs to the doors; the early-bird nudge
// runs to its own deadline. Both are UTC so server and client agree.
const EVENT_START = Date.UTC(2026, 10, 12, 9, 0, 0) // 12 Nov 2026, 09:00
const EARLYBIRD_END = Date.UTC(2026, 9, 15, 23, 59, 59) // 15 Oct 2026
const DAY_MS = 86_400_000

const SPEAKERS = [
  {
    name: "Amara Okafor",
    role: "Principal Designer, Figma",
    talk: "Designing for a billion cursors",
    img: "/assembly/speaker1.png",
    bill: "headliner",
  },
  {
    name: "Rohan Mehta",
    role: "VP Engineering, Vercel",
    talk: "The edge is the interface",
    img: "/assembly/speaker2.png",
    bill: "headliner",
  },
  {
    name: "Yuki Tanaka",
    role: "Founder, Studio Kojo",
    talk: "Motion as material",
    img: "/assembly/speaker3.png",
    bill: "feature",
  },
  {
    name: "Anders Holm",
    role: "Creative Director, Palm Type",
    talk: "In praise of slow tools",
    img: "/assembly/speaker4.png",
    bill: "feature",
  },
  {
    name: "Sofía Reyes",
    role: "Head of Design Systems, Stripe",
    talk: "Systems that bend, not break",
    img: "/assembly/speaker5.png",
    bill: "feature",
  },
]

const VALUES = [
  {
    head: "Three stages, one ticket",
    body: "Main stage keynotes, a hands-on craft track, and a systems track running in parallel. Move freely; nothing is gated.",
  },
  {
    head: "Built for the hallway",
    body: "Long breaks, a real lunch, and a floor plan designed so the conversation you came for actually happens.",
  },
  {
    head: "Work you can take home",
    body: "Every talk is recorded and yours to keep. Workshop files, slides, and starter repos ship the week after.",
  },
  {
    head: "A room worth the flight",
    body: "Eighteen hundred designers and engineers who ship. The kind of peers who answer the question you have been sitting on.",
  },
]

const DAYS = [
  {
    id: "d1",
    label: "Day one",
    date: "Thu 12 Nov",
    theme: "Foundations",
    sessions: [
      { time: "09:00", title: "Doors, coffee, and the floor opens", track: "All", who: "" },
      { time: "10:00", title: "Designing for a billion cursors", track: "Main stage", who: "Amara Okafor" },
      { time: "11:15", title: "Motion as material", track: "Craft", who: "Yuki Tanaka" },
      { time: "11:15", title: "Systems that bend, not break", track: "Systems", who: "Sofía Reyes" },
      { time: "13:30", title: "The edge is the interface", track: "Main stage", who: "Rohan Mehta" },
      { time: "15:00", title: "Workshop: prototyping with real data", track: "Craft", who: "Studio Kojo" },
      { time: "18:00", title: "Opening night, rooftop", track: "All", who: "" },
    ],
  },
  {
    id: "d2",
    label: "Day two",
    date: "Fri 13 Nov",
    theme: "Craft",
    sessions: [
      { time: "09:30", title: "Morning pages, quiet room", track: "All", who: "" },
      { time: "10:00", title: "In praise of slow tools", track: "Main stage", who: "Anders Holm" },
      { time: "11:15", title: "Interfaces that write themselves", track: "Systems", who: "Karim Nassar" },
      { time: "11:15", title: "Type on screens, ten years on", track: "Craft", who: "Palm Type" },
      { time: "13:30", title: "Panel: shipping design at scale", track: "Main stage", who: "Okafor, Reyes, Mehta" },
      { time: "15:00", title: "Workshop: motion systems in code", track: "Craft", who: "Yuki Tanaka" },
      { time: "20:00", title: "Community dinner, the long tables", track: "All", who: "" },
    ],
  },
  {
    id: "d3",
    label: "Day three",
    date: "Sat 14 Nov",
    theme: "What's next",
    sessions: [
      { time: "10:00", title: "Office hours with the speakers", track: "All", who: "" },
      { time: "11:00", title: "The next interface is a conversation", track: "Main stage", who: "Karim Nassar" },
      { time: "12:30", title: "Lightning talks from the floor", track: "Craft", who: "You, maybe" },
      { time: "14:00", title: "Closing keynote", track: "Main stage", who: "Amara Okafor" },
      { time: "15:30", title: "Last call, the send-off", track: "All", who: "" },
    ],
  },
]

const TICKETS = [
  {
    id: "early",
    name: "Early bird",
    price: "€390",
    note: "",
    features: ["All three days, every stage", "Talk recordings to keep", "Waitlist for workshops", "Access to the attendee app"],
    cta: "Get early bird",
    featured: false,
    urgent: true,
  },
  {
    id: "standard",
    name: "Standard",
    price: "€590",
    note: "Most people pick this",
    features: [
      "Everything in Early bird",
      "Guaranteed workshop seats",
      "Community dinner, Friday",
      "Slides and starter repos",
    ],
    cta: "Get standard",
    featured: true,
    urgent: false,
  },
  {
    id: "vip",
    name: "Patron",
    price: "€1,190",
    note: "",
    features: [
      "Everything in Standard",
      "Front two rows, reserved",
      "Speaker dinner, Thursday",
      "Backstage and the quiet lounge",
      "A 1:1 office-hours slot",
    ],
    cta: "Get patron",
    featured: false,
    urgent: false,
  },
]

const SPONSORS = [
  { name: "Figma", mark: "circle" },
  { name: "Vercel", mark: "triangle" },
  { name: "Linear", mark: "bars" },
  { name: "Stripe", mark: "slash" },
  { name: "Framer", mark: "square" },
  { name: "Notion", mark: "grid" },
  { name: "Raycast", mark: "ray" },
  { name: "Supabase", mark: "bolt" },
  { name: "Retool", mark: "wrench" },
  { name: "Arc", mark: "arc" },
  { name: "Amplitude", mark: "wave" },
  { name: "Cloudflare", mark: "cloud" },
]

const FAQ = [
  {
    q: "Where exactly is it held?",
    a: "The Arsenal, a converted shipyard on the Lisbon waterfront in the Beato district. Full address and doors on your ticket.",
  },
  {
    q: "Are talks recorded?",
    a: "Yes. Every stage is captured and every attendee keeps the recordings, ad-free, the week after the event.",
  },
  {
    q: "Can I switch tracks during the day?",
    a: "Freely. Standard and Patron tickets guarantee workshop seats; otherwise every room is first-come, and the stages are steps apart.",
  },
  {
    q: "What is your refund policy?",
    a: "Full refund up to 30 days before doors. After that, transfer your ticket to anyone you like at no charge, right up to the morning of.",
  },
  {
    q: "Do you help with visas or access needs?",
    a: "We issue invitation letters for visa applications and the venue is step-free throughout. Reply to your ticket email and a human answers.",
  },
]

const RECAP = [
  { n: "1,800", l: "in the room" },
  { n: "42", l: "talks and workshops" },
  { n: "31", l: "countries" },
  { n: "96%", l: "would return" },
]

/** Reveal a block once it scrolls into view. Reduced-motion shows it instantly. */
function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [shown, setShown] = useState(false)
  useEffect(() => {
    const node = ref.current
    if (!node) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(true)
      return
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true)
          io.disconnect()
        }
      },
      { threshold: 0.15 },
    )
    io.observe(node)
    return () => io.disconnect()
  }, [])
  return [ref, shown] as const
}

/** Live time-to-target. Mounts to null so SSR and first paint agree, then ticks. */
function useCountdown(target: number) {
  const [now, setNow] = useState<number | null>(null)
  useEffect(() => {
    setNow(Date.now())
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])
  const diff = now === null ? 0 : Math.max(0, target - now)
  return {
    mounted: now !== null,
    days: Math.floor(diff / DAY_MS),
    hours: Math.floor((diff / 3_600_000) % 24),
    minutes: Math.floor((diff / 60_000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

const pad = (n: number) => String(n).padStart(2, "0")

/** Abstract monochrome sponsor marks, drawn so the wall reads as one system. */
function SponsorMark({ kind }: { kind: string }) {
  const common = { width: 26, height: 26, viewBox: "0 0 26 26", fill: "none", "aria-hidden": true } as const
  const s = { stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const }
  switch (kind) {
    case "circle": return <svg {...common}><circle cx="13" cy="13" r="9" {...s} /><circle cx="13" cy="13" r="3" fill="currentColor" /></svg>
    case "triangle": return <svg {...common}><path d="M13 4 L22 21 L4 21 Z" {...s} /></svg>
    case "bars": return <svg {...common}><path d="M6 20V9M13 20V5M20 20v-7" {...s} /></svg>
    case "slash": return <svg {...common}><path d="M17 5 L9 21M8 8h2M16 18h2" {...s} /></svg>
    case "square": return <svg {...common}><rect x="5" y="5" width="16" height="16" rx="3" {...s} /><path d="M5 13h16" {...s} /></svg>
    case "grid": return <svg {...common}><rect x="5" y="5" width="7" height="7" rx="1.5" {...s} /><rect x="14" y="5" width="7" height="7" rx="1.5" {...s} /><rect x="5" y="14" width="7" height="7" rx="1.5" {...s} /><rect x="14" y="14" width="7" height="7" rx="1.5" fill="currentColor" /></svg>
    case "ray": return <svg {...common}><path d="M13 5v3M13 18v3M5 13h3M18 13h3M7.3 7.3l2 2M16.7 16.7l-2-2" {...s} /><circle cx="13" cy="13" r="2.5" fill="currentColor" /></svg>
    case "bolt": return <svg {...common}><path d="M14 4 L7 14h5l-1 8 7-11h-5z" {...s} /></svg>
    case "wrench": return <svg {...common}><path d="M18 6a4 4 0 0 1-5 5l-6 6-2-2 6-6a4 4 0 0 1 5-5l-2 2 1 2 2 1z" {...s} /></svg>
    case "arc": return <svg {...common}><path d="M5 19a8 8 0 0 1 16 0" {...s} /><circle cx="13" cy="19" r="1.6" fill="currentColor" /></svg>
    case "wave": return <svg {...common}><path d="M4 13c3-6 6 6 9 0s6-6 9 0" {...s} /></svg>
    case "cloud": return <svg {...common}><path d="M8 18a4 4 0 0 1 0-8 5 5 0 0 1 9.5 1.5A3.5 3.5 0 0 1 17 18z" {...s} /></svg>
    default: return <svg {...common}><circle cx="13" cy="13" r="8" {...s} /></svg>
  }
}

/** A stylised map of the venue's corner of Lisbon — river, transit, hotels, doors. */
function VenueMap() {
  return (
    <svg viewBox="0 0 400 320" role="img" aria-label="Stylised map showing the venue on the Lisbon waterfront with nearby transit and hotels" className="asm-map-svg">
      <rect x="0" y="0" width="400" height="320" rx="18" fill="#12151f" />
      {/* river */}
      <path d="M0 250 C120 232 210 300 400 262 L400 320 L0 320 Z" fill="#1c2ee0" opacity="0.9" />
      <path d="M0 250 C120 232 210 300 400 262" stroke="#4553ff" strokeWidth="2" fill="none" opacity="0.7" />
      {/* blocks */}
      <g fill="#1a1e2b">
        <rect x="28" y="40" width="70" height="52" rx="6" />
        <rect x="112" y="34" width="86" height="60" rx="6" />
        <rect x="214" y="46" width="64" height="48" rx="6" />
        <rect x="296" y="38" width="78" height="58" rx="6" />
        <rect x="40" y="112" width="80" height="60" rx="6" />
        <rect x="250" y="118" width="96" height="56" rx="6" />
      </g>
      {/* transit line */}
      <path d="M20 100 L180 150 L360 120" stroke="#ff6a2b" strokeWidth="2.5" strokeDasharray="2 7" strokeLinecap="round" fill="none" />
      {/* venue pin */}
      <g transform="translate(178 150)">
        <circle r="22" fill="#2b39ff" opacity="0.22" />
        <circle r="9" fill="#2b39ff" />
        <circle r="3.4" fill="#fff" />
      </g>
      {/* hotel dots */}
      <g fill="#f4f3ee">
        <circle cx="70" cy="130" r="4" /><circle cx="300" cy="140" r="4" /><circle cx="150" cy="70" r="4" />
      </g>
      <text x="196" y="146" fill="#f6f6f4" fontSize="13" fontWeight="600" fontFamily="var(--font-geist), sans-serif">The Arsenal</text>
    </svg>
  )
}

export default function Assembly() {
  const [scrollY, setScrollY] = useState(0)
  const [reduced, setReduced] = useState(false)
  const clock = useCountdown(EVENT_START)

  // Days until early-bird pricing ends, for the ticket nudge.
  const earlybirdDays = clock.mounted ? Math.max(0, Math.ceil((EARLYBIRD_END - Date.now()) / DAY_MS)) : null

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReduced(mq.matches)
    const onMq = () => setReduced(mq.matches)
    mq.addEventListener("change", onMq)

    let raf = 0
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        setScrollY(window.scrollY)
        raf = 0
      })
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()
    return () => {
      mq.removeEventListener("change", onMq)
      window.removeEventListener("scroll", onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  const par = (rate: number) => (reduced ? 0 : scrollY * rate)
  const barShown = scrollY > 640

  const [valuesRef, valuesShown] = useReveal<HTMLDivElement>()
  const [lineupRef, lineupShown] = useReveal<HTMLDivElement>()
  const [agendaRef, agendaShown] = useReveal<HTMLDivElement>()
  const [ticketsRef, ticketsShown] = useReveal<HTMLDivElement>()
  const [venueRef, venueShown] = useReveal<HTMLDivElement>()
  const [recapRef, recapShown] = useReveal<HTMLDivElement>()
  const [activeDay, setActiveDay] = useState(0)
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  const units = [
    { v: clock.days, l: "days" },
    { v: clock.hours, l: "hrs" },
    { v: clock.minutes, l: "min" },
    { v: clock.seconds, l: "sec" },
  ]

  return (
    <div className="asm-root">
      <style>{css}</style>

      <header className="asm-nav">
        <a className="asm-mark" href="#top">
          <span className="asm-mark-dot" aria-hidden="true" />
          Assembly
        </a>
        <nav className="asm-nav-links">
          <a href="#lineup">Lineup</a>
          <a href="#agenda">Agenda</a>
          <a href="#tickets">Tickets</a>
          <a href="#venue">Venue</a>
          <a className="asm-nav-cta" href="#tickets">
            Get tickets
          </a>
        </nav>
      </header>

      {/* HERO — poster texture, big wordmark, live countdown, path to purchase */}
      <section className="asm-hero" id="top">
        <div
          className="asm-hero-img"
          style={{ transform: `translate3d(0, ${par(0.18)}px, 0) scale(1.06)` }}
        />
        <div className="asm-hero-scrim" />
        <div className="asm-hero-glow" data-reduced={reduced} />
        <div className="asm-hero-inner">
          <p className="asm-hero-kicker">The design and technology conference</p>
          <h1 className="asm-hero-title">
            Assembly<span className="asm-hero-year">2026</span>
          </h1>
          <div className="asm-hero-meta">
            <span>12&ndash;14 November 2026</span>
            <span className="asm-rule" aria-hidden="true" />
            <span>Lisbon, Portugal</span>
          </div>
          <p className="asm-hero-lede">
            Three days, three stages, and eighteen hundred people who make the things you use. The
            doors open in:
          </p>

          <div className="asm-clock" role="timer" aria-label="Time until doors open">
            {units.map((u) => (
              <div className="asm-clock-unit" key={u.l}>
                <span className="asm-clock-num">{clock.mounted ? pad(u.v) : "––"}</span>
                <span className="asm-clock-lab">{u.l}</span>
              </div>
            ))}
          </div>

          <div className="asm-hero-cta">
            <a className="asm-btn asm-btn-lg" href="#tickets">
              Get tickets
            </a>
            <a className="asm-btn-ghost asm-btn-lg" href="#lineup">
              See the lineup
            </a>
          </div>
        </div>
        <div className="asm-scrollcue" aria-hidden="true">
          <span />
        </div>
      </section>

      {/* WHY ATTEND */}
      <section className="asm-section asm-why">
        <div className="asm-why-head">
          <p className="asm-eyebrow">Why come to Lisbon</p>
          <h2 className="asm-h2">A conference that respects your three days</h2>
        </div>
        <div className={`asm-why-grid ${valuesShown ? "is-shown" : ""}`} ref={valuesRef}>
          {VALUES.map((v, i) => (
            <div className="asm-why-card" key={v.head} style={{ transitionDelay: `${i * 90}ms` }}>
              <span className="asm-why-index" aria-hidden="true" />
              <h3>{v.head}</h3>
              <p>{v.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* LINEUP — kinetic staggered reveal, headliners largest */}
      <section className="asm-section asm-lineup" id="lineup">
        <div className="asm-lineup-head">
          <p className="asm-eyebrow">The lineup</p>
          <h2 className="asm-h2">Forty-two talks. Here are the ones people fly in for.</h2>
          <p className="asm-sub">
            A first look at the 2026 program. The full schedule, lightning talks, and workshop
            leads land closer to the doors.
          </p>
        </div>
        <div className={`asm-speakers ${lineupShown ? "is-shown" : ""}`} ref={lineupRef}>
          {SPEAKERS.map((s, i) => (
            <article
              className={`asm-speaker ${s.bill === "headliner" ? "is-headliner" : ""}`}
              key={s.name}
              style={{ transitionDelay: `${i * 110}ms` }}
            >
              <div className="asm-speaker-img" style={{ backgroundImage: `url(${s.img})` }}>
                <span className="asm-speaker-bill">{s.bill === "headliner" ? "Keynote" : "Speaking"}</span>
              </div>
              <div className="asm-speaker-body">
                <h3 className="asm-speaker-name">{s.name}</h3>
                <p className="asm-speaker-role">{s.role}</p>
                <p className="asm-speaker-talk">{s.talk}</p>
              </div>
            </article>
          ))}
        </div>
      </section>


      {/* AGENDA — tabbed by day, times as a real sequence */}
      <section className="asm-section asm-agenda" id="agenda" ref={agendaRef}>
        <div className="asm-agenda-head">
          <p className="asm-eyebrow">Three days</p>
          <h2 className="asm-h2">The shape of the week</h2>
        </div>
        <div className="asm-tabs" role="tablist" aria-label="Choose a day">
          {DAYS.map((d, i) => (
            <button
              key={d.id}
              role="tab"
              aria-selected={activeDay === i}
              className={`asm-tab ${activeDay === i ? "is-active" : ""}`}
              onClick={() => setActiveDay(i)}
            >
              <span className="asm-tab-label">{d.label}</span>
              <span className="asm-tab-date">{d.date}</span>
            </button>
          ))}
        </div>
        <div className={`asm-schedule ${agendaShown ? "is-shown" : ""}`} key={DAYS[activeDay].id}>
          <div className="asm-schedule-theme">
            <span className="asm-schedule-daynum">{DAYS[activeDay].date}</span>
            <span className="asm-schedule-word">{DAYS[activeDay].theme}</span>
          </div>
          <ol className="asm-schedule-list">
            {DAYS[activeDay].sessions.map((s, i) => (
              <li className="asm-slot" key={`${s.time}-${s.title}`} style={{ animationDelay: `${i * 55}ms` }}>
                <span className="asm-slot-time">{s.time}</span>
                <div className="asm-slot-body">
                  <p className="asm-slot-title">{s.title}</p>
                  {s.who && <p className="asm-slot-who">{s.who}</p>}
                </div>
                <span className={`asm-slot-track track-${s.track.replace(/\\s+/g, "").toLowerCase()}`}>{s.track}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* TICKETS — tiers, one highlighted, deadline nudge tied to the clock */}
      <section className="asm-section asm-tickets" id="tickets" ref={ticketsRef}>
        <div className="asm-tickets-head">
          <p className="asm-eyebrow">Tickets</p>
          <h2 className="asm-h2">One pass, all three days</h2>
          {earlybirdDays !== null && earlybirdDays > 0 && (
            <p className="asm-nudge">
              <span className="asm-nudge-dot" aria-hidden="true" />
              Early-bird pricing ends in {earlybirdDays} {earlybirdDays === 1 ? "day" : "days"}. Prices
              rise after that.
            </p>
          )}
        </div>
        <div className={`asm-tier-grid ${ticketsShown ? "is-shown" : ""}`}>
          {TICKETS.map((t, i) => (
            <article
              className={`asm-tier ${t.featured ? "is-featured" : ""}`}
              key={t.id}
              style={{ transitionDelay: `${i * 90}ms` }}
            >
              {t.note && <span className="asm-tier-note">{t.note}</span>}
              <h3 className="asm-tier-name">{t.name}</h3>
              <p className="asm-tier-price">
                {t.price}
                {t.urgent && earlybirdDays !== null && earlybirdDays > 0 && (
                  <span className="asm-tier-urgent">for {earlybirdDays} more days</span>
                )}
              </p>
              <ul className="asm-tier-feats">
                {t.features.map((f) => (
                  <li key={f}>
                    <span className="asm-check" aria-hidden="true" />
                    {f}
                  </li>
                ))}
              </ul>
              <a className={t.featured ? "asm-btn asm-tier-cta" : "asm-btn-line asm-tier-cta"} href="#tickets">
                {t.cta}
              </a>
            </article>
          ))}
        </div>
      </section>

      {/* SPONSORS — CSS/SVG logo wall */}
      <section className="asm-section asm-sponsors">
        <div className="asm-sponsors-head">
          <p className="asm-eyebrow">Backed by the teams you use</p>
          <h2 className="asm-h2">Partners for 2026</h2>
        </div>
        <div className="asm-logo-wall">
          {SPONSORS.map((s) => (
            <div className="asm-logo" key={s.name}>
              <SponsorMark kind={s.mark} />
              <span>{s.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* VENUE + TRAVEL — stylised SVG map */}
      <section className="asm-section asm-venue" id="venue" ref={venueRef}>
        <div className={`asm-venue-grid ${venueShown ? "is-shown" : ""}`}>
          <div className="asm-venue-copy">
            <p className="asm-eyebrow">Venue and travel</p>
            <h2 className="asm-h2">The Arsenal, on the Lisbon waterfront</h2>
            <p className="asm-sub">
              A converted shipyard in Beato, ten minutes east of the centre by tram or river taxi.
              Step-free throughout, with the river on one side and the roof terrace on the other.
            </p>
            <div className="asm-venue-facts">
              <div className="asm-fact">
                <h4>Getting there</h4>
                <p>Lisbon Airport sits 15 minutes away by cab. The 728 bus and the 25E tram both stop at the door.</p>
              </div>
              <div className="asm-fact">
                <h4>Where to stay</h4>
                <p>We hold room blocks at three hotels in Beato and Alfama. Codes arrive with your ticket.</p>
              </div>
              <div className="asm-fact">
                <h4>Around the venue</h4>
                <p>The old bakery quarter next door is full of late tables. We publish a map of our favourites.</p>
              </div>
            </div>
          </div>
          <div className="asm-map">
            <VenueMap />
          </div>
        </div>
      </section>

      {/* RECAP — last year in numbers + texture strip */}
      <section className="asm-section asm-recap" ref={recapRef}>
        <div className="asm-recap-head">
          <p className="asm-eyebrow">Assembly 2025</p>
          <h2 className="asm-h2">How last year went</h2>
        </div>
        <div className={`asm-recap-grid ${recapShown ? "is-shown" : ""}`}>
          {RECAP.map((r, i) => (
            <div className="asm-stat" key={r.l} style={{ transitionDelay: `${i * 80}ms` }}>
              <span className="asm-stat-num">{r.n}</span>
              <span className="asm-stat-lab">{r.l}</span>
            </div>
          ))}
        </div>
        <div className="asm-recap-strip" aria-hidden="true">
          <span className="asm-recap-tile t1" />
          <span className="asm-recap-tile t2" />
          <span className="asm-recap-tile t3" />
          <span className="asm-recap-tile t4" />
        </div>
      </section>

      {/* FAQ + FINAL CTA */}
      <section className="asm-section asm-faq" id="faq">
        <div className="asm-faq-grid">
          <div className="asm-faq-head">
            <p className="asm-eyebrow">Good to know</p>
            <h2 className="asm-h2">Questions, answered</h2>
            <p className="asm-sub">Anything else, reply to your ticket email and a person writes back.</p>
          </div>
          <div className="asm-faq-list">
            {FAQ.map((f, i) => (
              <div className={`asm-faq-item ${openFaq === i ? "is-open" : ""}`} key={f.q}>
                <button
                  className="asm-faq-q"
                  aria-expanded={openFaq === i}
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span>{f.q}</span>
                  <span className="asm-faq-icon" aria-hidden="true" />
                </button>
                <div className="asm-faq-a">
                  <p>{f.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="asm-final">
          <div className="asm-final-clock" aria-hidden="true">
            {units.map((u) => (
              <div className="asm-final-unit" key={u.l}>
                <span className="asm-final-num">{clock.mounted ? pad(u.v) : "––"}</span>
                <span className="asm-final-lab">{u.l}</span>
              </div>
            ))}
          </div>
          <h2 className="asm-final-title">The room fills up. Get your pass.</h2>
          <p className="asm-final-lede">
            12&ndash;14 November 2026, Lisbon. Early-bird pricing while it lasts.
          </p>
          <a className="asm-btn asm-btn-lg" href="#tickets">
            Get tickets
          </a>
        </div>
      </section>

      {/* PERSISTENT BUY BAR — rides along once the hero is behind you */}
      <div className={`asm-bar ${barShown ? "is-shown" : ""}`} aria-hidden={!barShown}>
        <div className="asm-bar-left">
          <span className="asm-bar-title">Assembly 2026</span>
          <span className="asm-bar-sub">
            {clock.mounted ? `${clock.days} days to doors` : "Lisbon, November"}
          </span>
        </div>
        <a className="asm-btn" href="#tickets" tabIndex={barShown ? 0 : -1}>
          Get tickets
        </a>
      </div>

      <footer className="asm-footer">
        <div className="asm-footer-top">
          <a className="asm-mark" href="#top">
            <span className="asm-mark-dot" aria-hidden="true" />
            Assembly
          </a>
          <div className="asm-footer-cols">
            <div>
              <h4>Event</h4>
              <a href="#lineup">Lineup</a>
              <a href="#agenda">Agenda</a>
              <a href="#venue">Venue and travel</a>
            </div>
            <div>
              <h4>Attend</h4>
              <a href="#tickets">Tickets</a>
              <a href="#faq">FAQ</a>
              <a href="#tickets">Group rates</a>
            </div>
            <div>
              <h4>Stay close</h4>
              <a href="#top">Newsletter</a>
              <a href="#top">Speaking</a>
              <a href="#top">Sponsor</a>
            </div>
          </div>
        </div>
        <div className="asm-footer-fine">
          <p>Assembly 2026. The Arsenal, Beato, Lisbon. 12&ndash;14 November.</p>
          <p>A three-day conference for designers and engineers.</p>
        </div>
      </footer>
    </div>
  )
}

const css = `
.asm-root {
  --ink: #0b0d16;
  --ink-2: #12151f;
  --paper: #f4f3ee;
  --paper-2: #eceae2;
  --cobalt: #2b39ff;
  --cobalt-lift: #4553ff;
  --orange: #ff6a2b;
  --text: #14161d;
  --muted: #5b5f6b;
  --frost: #f6f6f4;
  --line: rgba(20, 22, 29, 0.12);
  --line-dark: rgba(246, 246, 244, 0.14);
  background: var(--paper);
  color: var(--text);
  font-family: var(--font-geist), system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
  line-height: 1.6;
  overflow-x: hidden;
}
.asm-root *,
.asm-root *::before,
.asm-root *::after { box-sizing: border-box; }
.asm-root ::selection { background: var(--cobalt); color: #fff; }

/* MARK */
.asm-mark {
  display: inline-flex; align-items: center; gap: 0.55rem;
  font-weight: 600; font-size: 1.25rem; letter-spacing: -0.02em;
  color: inherit; text-decoration: none;
}
.asm-mark-dot {
  width: 0.7rem; height: 0.7rem; border-radius: 999px;
  background: var(--cobalt);
  box-shadow: 0 0 0 3px rgba(43, 57, 255, 0.18);
}

/* NAV */
.asm-nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 60;
  display: flex; align-items: center; justify-content: space-between;
  padding: 1.15rem clamp(1.1rem, 4vw, 3.25rem);
  color: var(--frost);
  background: linear-gradient(to bottom, rgba(11, 13, 22, 0.65), transparent);
}
.asm-nav .asm-mark { color: var(--frost); }
.asm-nav-links { display: flex; align-items: center; gap: clamp(0.9rem, 2.2vw, 2rem); }
.asm-nav-links a { color: var(--frost); text-decoration: none; font-size: 0.95rem; opacity: 0.82; transition: opacity 0.25s; }
.asm-nav-links a:hover { opacity: 1; }
.asm-nav-cta {
  border: 1px solid rgba(246, 246, 244, 0.4); border-radius: 999px;
  padding: 0.45rem 1.05rem; opacity: 1 !important;
}
.asm-nav-cta:hover { background: var(--frost); color: var(--ink) !important; }
@media (max-width: 760px) { .asm-nav-links a:not(.asm-nav-cta) { display: none; } }

/* BUTTONS */
.asm-btn {
  display: inline-flex; align-items: center; justify-content: center;
  background: var(--cobalt); color: #fff; font-weight: 600; font-size: 0.98rem;
  text-decoration: none; padding: 0.7rem 1.4rem; border-radius: 999px; border: 0;
  cursor: pointer;
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s, background 0.25s;
}
.asm-btn:hover { background: var(--cobalt-lift); transform: translateY(-2px); box-shadow: 0 16px 34px -14px rgba(43, 57, 255, 0.75); }
.asm-btn-lg { padding: 0.95rem 1.9rem; font-size: 1.05rem; }
.asm-btn-ghost {
  display: inline-flex; align-items: center; justify-content: center;
  color: var(--frost); font-weight: 600; text-decoration: none;
  padding: 0.95rem 1.7rem; border-radius: 999px; border: 1px solid rgba(246, 246, 244, 0.4);
  transition: background 0.25s, color 0.25s, border-color 0.25s;
}
.asm-btn-ghost:hover { background: var(--frost); color: var(--ink); border-color: var(--frost); }

/* HERO */
.asm-hero { position: relative; min-height: 100svh; overflow: hidden; display: grid; align-items: center;
  background: var(--ink); }
.asm-hero-img {
  position: absolute; inset: -4% 0;
  background: url(/assembly/poster.png) center/cover no-repeat;
  will-change: transform;
}
.asm-hero-scrim {
  position: absolute; inset: 0;
  background:
    linear-gradient(105deg, rgba(11, 13, 22, 0.92) 8%, rgba(11, 13, 22, 0.5) 46%, rgba(11, 13, 22, 0.22) 100%),
    linear-gradient(to top, var(--ink) 1%, transparent 32%);
}
.asm-hero-glow {
  position: absolute; inset: 0; pointer-events: none; mix-blend-mode: screen;
  background: radial-gradient(42% 55% at 78% 30%, rgba(43, 57, 255, 0.55), transparent 70%);
  animation: asm-pulse 9s ease-in-out infinite;
}
.asm-hero-glow[data-reduced="true"] { animation: none; }
@keyframes asm-pulse { 0%, 100% { opacity: 0.55; transform: scale(1); } 50% { opacity: 0.95; transform: scale(1.08); } }
.asm-hero-inner {
  position: relative; z-index: 2; color: var(--frost);
  padding: 7rem clamp(1.25rem, 6vw, 6rem) 5rem; max-width: 60rem;
}
.asm-hero-kicker { color: #cdd2ff; font-size: 1rem; margin: 0 0 1.4rem; font-weight: 500; }
.asm-hero-title {
  display: flex; align-items: flex-start; gap: clamp(0.6rem, 1.6vw, 1.4rem);
  font-weight: 640; font-size: clamp(3.6rem, 14vw, 11rem); line-height: 0.86;
  letter-spacing: -0.045em; margin: 0;
}
.asm-hero-year {
  font-size: clamp(1.1rem, 3vw, 2.1rem); font-weight: 600; letter-spacing: -0.01em;
  color: var(--orange); margin-top: 0.6em; font-variant-numeric: tabular-nums;
}
.asm-hero-meta {
  display: flex; align-items: center; gap: 1rem; flex-wrap: wrap;
  margin: 1.6rem 0 1.4rem; font-size: clamp(1.05rem, 1.8vw, 1.4rem); font-weight: 500;
}
.asm-rule { width: 1px; height: 1.25em; background: rgba(246, 246, 244, 0.4); display: inline-block; }
.asm-hero-lede { color: rgba(246, 246, 244, 0.86); font-size: 1.12rem; max-width: 34rem; margin: 0 0 1.8rem; }

/* CLOCK */
.asm-clock { display: flex; gap: clamp(0.6rem, 2vw, 1.4rem); margin: 0 0 2.2rem; }
.asm-clock-unit {
  display: grid; gap: 0.3rem; justify-items: center;
  min-width: clamp(4.2rem, 12vw, 6.5rem);
  padding: 0.9rem 0.6rem; border-radius: 14px;
  background: rgba(246, 246, 244, 0.06); border: 1px solid rgba(246, 246, 244, 0.12);
}
.asm-clock-num {
  font-size: clamp(2rem, 6vw, 3.6rem); font-weight: 640; line-height: 1;
  letter-spacing: -0.03em; font-variant-numeric: tabular-nums; color: var(--frost);
}
.asm-clock-lab { font-size: 0.82rem; color: rgba(246, 246, 244, 0.66); }
.asm-hero-cta { display: flex; flex-wrap: wrap; gap: 0.9rem; }
.asm-scrollcue { position: absolute; left: 50%; bottom: 1.4rem; transform: translateX(-50%); z-index: 2; }
.asm-scrollcue span {
  display: block; width: 1px; height: 42px;
  background: linear-gradient(to bottom, transparent, var(--frost));
  animation: asm-cue 2.4s ease-in-out infinite;
}
@keyframes asm-cue { 0%, 100% { opacity: 0.2; transform: scaleY(0.6); transform-origin: top; } 50% { opacity: 1; transform: scaleY(1); } }

/* SECTION SHELL */
.asm-section { padding: clamp(4.5rem, 9vw, 8rem) clamp(1.25rem, 6vw, 6rem); }
.asm-eyebrow { color: var(--cobalt); font-weight: 600; font-size: 1rem; margin: 0 0 0.9rem; }
.asm-h2 {
  font-weight: 620; font-size: clamp(2.1rem, 5.2vw, 4rem); line-height: 1.0;
  letter-spacing: -0.035em; margin: 0 0 1rem; max-width: 20ch;
}
.asm-sub { color: var(--muted); font-size: 1.12rem; max-width: 42rem; margin: 0; }

/* PERSISTENT BUY BAR */
.asm-bar {
  position: fixed; left: 0; right: 0; bottom: 0; z-index: 70;
  display: flex; align-items: center; justify-content: space-between; gap: 1rem;
  padding: 0.85rem clamp(1rem, 5vw, 3rem);
  background: var(--ink); color: var(--frost);
  border-top: 1px solid var(--line-dark);
  transform: translateY(110%); transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}
.asm-bar.is-shown { transform: translateY(0); }
.asm-bar-left { display: flex; flex-direction: column; line-height: 1.25; }
.asm-bar-title { font-weight: 600; font-size: 1.05rem; letter-spacing: -0.01em; }
.asm-bar-sub { color: rgba(246, 246, 244, 0.66); font-size: 0.88rem; }

/* FOOTER */
.asm-footer { background: var(--ink); color: var(--frost); padding: clamp(3.5rem, 7vw, 5.5rem) clamp(1.25rem, 6vw, 6rem) 6.5rem; }
.asm-footer-top { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 2.5rem; }
.asm-footer .asm-mark { color: var(--frost); }
.asm-footer-cols { display: flex; flex-wrap: wrap; gap: clamp(2rem, 6vw, 5rem); }
.asm-footer-cols h4 { font-size: 0.95rem; font-weight: 600; margin: 0 0 0.9rem; color: var(--frost); }
.asm-footer-cols a { display: block; color: rgba(246, 246, 244, 0.68); text-decoration: none; font-size: 0.95rem; margin: 0.4rem 0; transition: color 0.2s; }
.asm-footer-cols a:hover { color: var(--frost); }
.asm-footer-fine { margin-top: 3rem; padding-top: 1.6rem; border-top: 1px solid var(--line-dark); }
.asm-footer-fine p { color: rgba(246, 246, 244, 0.55); font-size: 0.9rem; margin: 0.25rem 0; }

/* WHY ATTEND */
.asm-why { background: var(--paper); }
.asm-why-head { max-width: 44rem; margin-bottom: clamp(2.5rem, 5vw, 4rem); }
.asm-why-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; }
@media (max-width: 980px) { .asm-why-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 560px) { .asm-why-grid { grid-template-columns: 1fr; } }
.asm-why-card {
  padding: 1.9rem 1.6rem; border-radius: 16px; background: var(--frost);
  border: 1px solid var(--line);
  opacity: 0; transform: translateY(22px);
  transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s;
}
.asm-why-grid.is-shown .asm-why-card { opacity: 1; transform: none; }
.asm-why-card:hover { border-color: rgba(43, 57, 255, 0.4); }
.asm-why-index { display: block; width: 2.1rem; height: 3px; border-radius: 999px; background: var(--cobalt); margin-bottom: 1.3rem; }
.asm-why-card:nth-child(2) .asm-why-index { background: var(--orange); }
.asm-why-card h3 { font-size: 1.28rem; font-weight: 600; letter-spacing: -0.02em; margin: 0 0 0.6rem; }
.asm-why-card p { color: var(--muted); font-size: 0.98rem; margin: 0; }

/* LINEUP */
.asm-lineup { background: var(--paper-2); }
.asm-lineup-head { max-width: 48rem; margin-bottom: clamp(2.5rem, 5vw, 4rem); }
.asm-speakers { display: grid; grid-template-columns: repeat(6, 1fr); gap: 1.4rem; }
@media (max-width: 900px) { .asm-speakers { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 480px) { .asm-speakers { grid-template-columns: 1fr; } }
.asm-speaker {
  grid-column: span 2; background: var(--frost); border: 1px solid var(--line);
  border-radius: 16px; overflow: hidden;
  opacity: 0; transform: translateY(30px) scale(0.98);
  transition: opacity 0.75s cubic-bezier(0.16, 1, 0.3, 1), transform 0.75s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s;
}
.asm-speakers.is-shown .asm-speaker { opacity: 1; transform: none; }
.asm-speaker.is-headliner { grid-column: span 3; }
@media (max-width: 900px) {
  .asm-speaker, .asm-speaker.is-headliner { grid-column: span 1; }
}
.asm-speaker:hover { box-shadow: 0 22px 48px -26px rgba(11, 13, 22, 0.45); }
.asm-speaker-img {
  position: relative; aspect-ratio: 5 / 4; background-size: cover; background-position: center top;
}
.asm-speaker.is-headliner .asm-speaker-img { aspect-ratio: 16 / 11; }
.asm-speaker-bill {
  position: absolute; left: 0.9rem; top: 0.9rem;
  background: var(--ink); color: var(--frost); font-size: 0.78rem; font-weight: 500;
  padding: 0.28rem 0.7rem; border-radius: 999px;
}
.asm-speaker.is-headliner .asm-speaker-bill { background: var(--cobalt); }
.asm-speaker-body { padding: 1.25rem 1.35rem 1.5rem; }
.asm-speaker-name { font-size: 1.3rem; font-weight: 600; letter-spacing: -0.02em; margin: 0; }
.asm-speaker.is-headliner .asm-speaker-name { font-size: clamp(1.5rem, 2.6vw, 2rem); }
.asm-speaker-role { color: var(--muted); font-size: 0.92rem; margin: 0.2rem 0 0.9rem; }
.asm-speaker-talk {
  font-size: 1.02rem; font-weight: 500; margin: 0; letter-spacing: -0.01em;
  padding-top: 0.9rem; border-top: 1px solid var(--line); color: var(--text);
}
.asm-speaker.is-headliner .asm-speaker-talk { font-size: 1.14rem; }

/* AGENDA */
.asm-agenda { background: var(--paper); }
.asm-agenda-head { max-width: 42rem; margin-bottom: 2.2rem; }
.asm-tabs { display: flex; gap: 0.6rem; flex-wrap: wrap; margin-bottom: 2rem; }
.asm-tab {
  display: flex; flex-direction: column; gap: 0.15rem; text-align: left;
  padding: 0.75rem 1.3rem; border-radius: 12px; cursor: pointer;
  background: var(--frost); border: 1px solid var(--line); color: var(--muted);
  font-family: inherit; transition: background 0.25s, color 0.25s, border-color 0.25s;
}
.asm-tab:hover { border-color: rgba(43, 57, 255, 0.4); }
.asm-tab.is-active { background: var(--ink); color: var(--frost); border-color: var(--ink); }
.asm-tab-label { font-weight: 600; font-size: 1rem; }
.asm-tab-date { font-size: 0.85rem; opacity: 0.8; }
.asm-schedule {
  border: 1px solid var(--line); border-radius: 18px; overflow: hidden; background: var(--frost);
  opacity: 0; transform: translateY(18px); transition: opacity 0.6s, transform 0.6s;
}
.asm-schedule.is-shown { opacity: 1; transform: none; }
.asm-schedule-theme {
  display: flex; align-items: baseline; gap: 1rem; flex-wrap: wrap;
  padding: 1.3rem clamp(1.2rem, 3vw, 2rem); border-bottom: 1px solid var(--line);
  background: linear-gradient(105deg, rgba(43, 57, 255, 0.08), transparent);
}
.asm-schedule-daynum { font-weight: 600; font-size: 1.05rem; color: var(--cobalt); font-variant-numeric: tabular-nums; }
.asm-schedule-word { font-size: clamp(1.5rem, 3.4vw, 2.4rem); font-weight: 620; letter-spacing: -0.03em; }
.asm-schedule-list { list-style: none; margin: 0; padding: 0; }
.asm-slot {
  display: grid; grid-template-columns: 5.5rem 1fr auto; align-items: center; gap: 1.2rem;
  padding: 1.15rem clamp(1.2rem, 3vw, 2rem); border-bottom: 1px solid var(--line);
}
.asm-slot:last-child { border-bottom: 0; }
.asm-schedule.is-shown .asm-slot { animation: asm-slot-in 0.55s cubic-bezier(0.16, 1, 0.3, 1) both; }
@keyframes asm-slot-in { from { opacity: 0; transform: translateX(-14px); } to { opacity: 1; transform: none; } }
.asm-slot-time { font-variant-numeric: tabular-nums; font-weight: 600; font-size: 1.02rem; color: var(--text); }
.asm-slot-title { font-weight: 500; font-size: 1.05rem; margin: 0; letter-spacing: -0.01em; }
.asm-slot-who { color: var(--muted); font-size: 0.9rem; margin: 0.15rem 0 0; }
.asm-slot-track {
  font-size: 0.8rem; font-weight: 500; padding: 0.3rem 0.7rem; border-radius: 999px;
  white-space: nowrap; border: 1px solid var(--line); color: var(--muted);
}
.asm-slot-track.track-mainstage { background: rgba(43, 57, 255, 0.1); color: var(--cobalt); border-color: transparent; }
.asm-slot-track.track-craft { background: rgba(255, 106, 43, 0.12); color: #b8410f; border-color: transparent; }
.asm-slot-track.track-systems { background: rgba(20, 22, 29, 0.06); color: var(--text); border-color: transparent; }
@media (max-width: 640px) {
  .asm-slot { grid-template-columns: 4rem 1fr; }
  .asm-slot-track { grid-column: 2; justify-self: start; }
}

/* TICKETS */
.asm-tickets { background: var(--paper-2); }
.asm-tickets-head { max-width: 42rem; margin-bottom: clamp(2.2rem, 5vw, 3.5rem); }
.asm-nudge {
  display: inline-flex; align-items: center; gap: 0.55rem; margin: 1.2rem 0 0;
  background: rgba(255, 106, 43, 0.12); color: #b8410f; font-weight: 500; font-size: 0.95rem;
  padding: 0.5rem 0.95rem; border-radius: 999px;
}
.asm-nudge-dot { width: 0.55rem; height: 0.55rem; border-radius: 999px; background: var(--orange); animation: asm-blink 1.6s ease-in-out infinite; }
@keyframes asm-blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
.asm-tier-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; align-items: start; }
@media (max-width: 900px) { .asm-tier-grid { grid-template-columns: 1fr; max-width: 30rem; } }
.asm-tier {
  position: relative; padding: 2rem 1.8rem; border-radius: 18px;
  background: var(--frost); border: 1px solid var(--line);
  opacity: 0; transform: translateY(24px);
  transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
}
.asm-tier-grid.is-shown .asm-tier { opacity: 1; transform: none; }
.asm-tier.is-featured {
  background: var(--ink); color: var(--frost); border-color: var(--ink);
  box-shadow: 0 28px 60px -30px rgba(43, 57, 255, 0.6);
}
@media (min-width: 901px) { .asm-tier.is-featured { transform: translateY(-14px); } .asm-tier-grid.is-shown .asm-tier.is-featured { transform: translateY(-14px); } }
.asm-tier-note {
  position: absolute; top: -0.75rem; left: 1.8rem;
  background: var(--cobalt); color: #fff; font-size: 0.78rem; font-weight: 500;
  padding: 0.3rem 0.8rem; border-radius: 999px;
}
.asm-tier-name { font-size: 1.15rem; font-weight: 600; margin: 0 0 0.4rem; letter-spacing: -0.01em; }
.asm-tier-price {
  display: flex; align-items: baseline; gap: 0.6rem; flex-wrap: wrap;
  font-size: clamp(2.4rem, 5vw, 3.2rem); font-weight: 640; letter-spacing: -0.03em; margin: 0 0 1.4rem;
}
.asm-tier-urgent { font-size: 0.85rem; font-weight: 500; letter-spacing: 0; color: var(--orange); }
.asm-tier-feats { list-style: none; margin: 0 0 1.8rem; padding: 0; display: grid; gap: 0.7rem; }
.asm-tier-feats li { display: flex; align-items: flex-start; gap: 0.65rem; font-size: 0.96rem; }
.asm-check { flex: 0 0 auto; width: 1.05rem; height: 1.05rem; margin-top: 0.15rem; border-radius: 999px; background: rgba(43, 57, 255, 0.15); position: relative; }
.asm-check::after { content: ""; position: absolute; left: 0.34rem; top: 0.18rem; width: 0.28rem; height: 0.52rem; border: solid var(--cobalt); border-width: 0 2px 2px 0; transform: rotate(45deg); }
.asm-tier.is-featured .asm-check { background: rgba(255, 255, 255, 0.18); }
.asm-tier.is-featured .asm-check::after { border-color: var(--frost); }
.asm-tier-cta { width: 100%; }
.asm-btn-line {
  display: inline-flex; align-items: center; justify-content: center;
  border: 1px solid var(--ink); color: var(--ink); background: transparent;
  font-weight: 600; font-size: 0.98rem; text-decoration: none;
  padding: 0.7rem 1.4rem; border-radius: 999px; transition: background 0.25s, color 0.25s;
}
.asm-btn-line:hover { background: var(--ink); color: var(--frost); }

/* SPONSORS */
.asm-sponsors { background: var(--paper); }
.asm-sponsors-head { max-width: 40rem; margin-bottom: clamp(2.2rem, 5vw, 3.5rem); }
.asm-logo-wall {
  display: grid; grid-template-columns: repeat(6, 1fr); gap: 1px;
  background: var(--line); border: 1px solid var(--line); border-radius: 16px; overflow: hidden;
}
@media (max-width: 860px) { .asm-logo-wall { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 480px) { .asm-logo-wall { grid-template-columns: repeat(2, 1fr); } }
.asm-logo {
  display: flex; align-items: center; justify-content: center; gap: 0.65rem;
  padding: 1.7rem 1rem; background: var(--frost); color: var(--muted);
  font-weight: 600; font-size: 1.05rem; letter-spacing: -0.01em;
  transition: color 0.25s, background 0.25s;
}
.asm-logo svg { color: var(--muted); transition: color 0.25s, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
.asm-logo:hover { color: var(--text); background: #fff; }
.asm-logo:hover svg { color: var(--cobalt); transform: rotate(-8deg) scale(1.08); }

/* VENUE */
.asm-venue { background: var(--paper-2); }
.asm-venue-grid { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(2rem, 5vw, 4.5rem); align-items: center;
  opacity: 0; transform: translateY(22px); transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1); }
.asm-venue-grid.is-shown { opacity: 1; transform: none; }
@media (max-width: 880px) { .asm-venue-grid { grid-template-columns: 1fr; } }
.asm-venue-facts { display: grid; gap: 1.4rem; margin-top: 2.2rem; }
.asm-fact h4 { font-size: 1.02rem; font-weight: 600; margin: 0 0 0.3rem; letter-spacing: -0.01em; }
.asm-fact p { color: var(--muted); font-size: 0.96rem; margin: 0; }
.asm-map { border-radius: 18px; overflow: hidden; box-shadow: 0 30px 60px -34px rgba(11, 13, 22, 0.5); }
.asm-map-svg { display: block; width: 100%; height: auto; }

/* RECAP */
.asm-recap { background: var(--ink); color: var(--frost); }
.asm-recap-head { max-width: 40rem; margin-bottom: clamp(2rem, 4vw, 3rem); }
.asm-recap .asm-eyebrow { color: var(--cobalt-lift); }
.asm-recap .asm-h2 { color: var(--frost); }
.asm-recap-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; margin-bottom: 3rem; }
@media (max-width: 720px) { .asm-recap-grid { grid-template-columns: repeat(2, 1fr); } }
.asm-stat {
  padding: 1.6rem 0; border-top: 2px solid rgba(246, 246, 244, 0.18);
  opacity: 0; transform: translateY(18px); transition: opacity 0.7s, transform 0.7s;
}
.asm-recap-grid.is-shown .asm-stat { opacity: 1; transform: none; }
.asm-stat-num { display: block; font-size: clamp(2.4rem, 6vw, 4rem); font-weight: 640; letter-spacing: -0.04em; line-height: 1; font-variant-numeric: tabular-nums; }
.asm-stat:nth-child(1) .asm-stat-num { color: var(--cobalt-lift); }
.asm-stat:nth-child(3) .asm-stat-num { color: var(--orange); }
.asm-stat-lab { display: block; color: rgba(246, 246, 244, 0.66); font-size: 0.98rem; margin-top: 0.5rem; }
.asm-recap-strip { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; }
@media (max-width: 720px) { .asm-recap-strip { grid-template-columns: repeat(2, 1fr); } }
.asm-recap-tile { aspect-ratio: 4 / 3; border-radius: 12px; background-size: cover; background-position: center; }
.asm-recap-tile.t1 { background-image: linear-gradient(135deg, rgba(43, 57, 255, 0.85), rgba(11, 13, 22, 0.4)), url(/assembly/poster.png); }
.asm-recap-tile.t2 { background-image: linear-gradient(135deg, rgba(255, 106, 43, 0.7), rgba(11, 13, 22, 0.5)), url(/assembly/poster.png); background-position: right center; }
.asm-recap-tile.t3 { background-image: linear-gradient(135deg, rgba(11, 13, 22, 0.3), rgba(43, 57, 255, 0.6)), url(/assembly/poster.png); background-position: left bottom; }
.asm-recap-tile.t4 { background-image: linear-gradient(135deg, rgba(11, 13, 22, 0.55), rgba(255, 106, 43, 0.4)), url(/assembly/poster.png); background-position: center bottom; }

/* FAQ + FINAL */
.asm-faq { background: var(--paper); }
.asm-faq-grid { display: grid; grid-template-columns: 0.85fr 1.15fr; gap: clamp(2rem, 5vw, 4rem); }
@media (max-width: 860px) { .asm-faq-grid { grid-template-columns: 1fr; } }
.asm-faq-head { max-width: 26rem; }
.asm-faq-list { border-top: 1px solid var(--line); }
.asm-faq-item { border-bottom: 1px solid var(--line); }
.asm-faq-q {
  display: flex; align-items: center; justify-content: space-between; gap: 1rem; width: 100%;
  padding: 1.4rem 0; background: none; border: 0; cursor: pointer; text-align: left;
  font-family: inherit; font-size: 1.15rem; font-weight: 500; letter-spacing: -0.01em; color: var(--text);
}
.asm-faq-icon { position: relative; flex: 0 0 auto; width: 1.1rem; height: 1.1rem; }
.asm-faq-icon::before, .asm-faq-icon::after { content: ""; position: absolute; background: var(--cobalt); border-radius: 2px; transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s; }
.asm-faq-icon::before { left: 0; top: 50%; width: 100%; height: 2px; transform: translateY(-50%); }
.asm-faq-icon::after { top: 0; left: 50%; width: 2px; height: 100%; transform: translateX(-50%); }
.asm-faq-item.is-open .asm-faq-icon::after { transform: translateX(-50%) scaleY(0); opacity: 0; }
.asm-faq-a { overflow: hidden; max-height: 0; transition: max-height 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
.asm-faq-item.is-open .asm-faq-a { max-height: 12rem; }
.asm-faq-a p { color: var(--muted); font-size: 1rem; margin: 0; padding: 0 0 1.4rem; max-width: 44rem; }

.asm-final {
  margin-top: clamp(3.5rem, 7vw, 6rem); padding: clamp(2.8rem, 6vw, 5rem) clamp(1.5rem, 5vw, 4rem);
  background: var(--ink); color: var(--frost); border-radius: 24px; text-align: center;
  position: relative; overflow: hidden;
}
.asm-final::before {
  content: ""; position: absolute; inset: 0; pointer-events: none;
  background: radial-gradient(60% 80% at 50% 0%, rgba(43, 57, 255, 0.4), transparent 70%);
}
.asm-final-clock { position: relative; display: flex; justify-content: center; gap: 0.7rem; margin-bottom: 1.8rem; }
.asm-final-unit { display: grid; justify-items: center; gap: 0.2rem; min-width: 3.6rem; }
.asm-final-num { font-size: clamp(1.4rem, 4vw, 2.2rem); font-weight: 640; letter-spacing: -0.03em; font-variant-numeric: tabular-nums; }
.asm-final-lab { font-size: 0.72rem; color: rgba(246, 246, 244, 0.6); }
.asm-final-title { position: relative; font-size: clamp(1.9rem, 5vw, 3.4rem); font-weight: 620; letter-spacing: -0.035em; line-height: 1.02; margin: 0 0 0.9rem; }
.asm-final-lede { position: relative; color: rgba(246, 246, 244, 0.82); font-size: 1.1rem; margin: 0 auto 2rem; max-width: 32rem; }

/* REDUCED MOTION — kill decorative transitions/animations, reveal everything */
@media (prefers-reduced-motion: reduce) {
  .asm-root *, .asm-root *::before, .asm-root *::after {
    animation-duration: 0.001ms !important; animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
  }
  .asm-why-card, .asm-speaker, .asm-tier, .asm-stat, .asm-venue-grid, .asm-schedule { opacity: 1 !important; transform: none !important; }
  .asm-slot { animation: none !important; }
}

/* == END == */
`
