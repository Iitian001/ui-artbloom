"use client"

import { useEffect, useRef, useState } from "react"

/**
 * Momentum — a light-mode Conversion Stack landing page for a scheduling SaaS.
 *
 * The one bold move is interaction, not decoration: a live DOM scheduling widget
 * that picks a date, fans in time-slot chips, and confirms a booking on a gentle
 * loop; a pricing toggle whose numbers roll between monthly and annual; case-study
 * stats that count up on reveal. Everything else stays quiet — a single indigo
 * accent, hairline borders, generous white, sentence-case labels. A muted green is
 * used only for success semantics (a booked check, an "available" dot), never as a
 * second brand colour. All motion is gated on prefers-reduced-motion: reduce.
 */

/* ----------------------------------------------------------------- icons -- */

function IconChevron({ dir = "right" }: { dir?: "left" | "right" }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d={dir === "left" ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"}
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconClock() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 7.5V12l3 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconVideo() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="6" width="12" height="12" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M15 10l6-3v10l-6-3" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  )
}

function IconCheck() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12.5l4.2 4.2L19 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function Logo() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="mo-logo">
      <rect x="1" y="1" width="22" height="22" rx="7" fill="currentColor" />
      <path
        d="M6.5 15.5 11 10.5 14 13.2 17.5 8.5"
        stroke="#fff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/* ------------------------------------------------------------------ hooks -- */

/** Reveal children once when they scroll into view. Reduced-motion shows instantly. */
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
      { threshold: 0.25 },
    )
    io.observe(node)
    return () => io.disconnect()
  }, [])
  return [ref, shown] as const
}

/** Ease a number toward `target` whenever it changes, once `active`. Reduced-motion jumps. */
function useTween(target: number, active: boolean, reduced: boolean, duration = 1100) {
  const [val, setVal] = useState(0)
  const valRef = useRef(0)
  useEffect(() => {
    if (!active) return
    if (reduced) {
      valRef.current = target
      setVal(target)
      return
    }
    const from = valRef.current
    const start = performance.now()
    let raf = 0
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      const v = from + (target - from) * eased
      valRef.current = v
      setVal(v)
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, active, reduced, duration])
  return val
}

/** Subtle scroll-linked drift, written imperatively so it stays off the render path. */
function useParallax<T extends HTMLElement>(rate: number, reduced: boolean) {
  const ref = useRef<T>(null)
  useEffect(() => {
    const el = ref.current
    if (!el || reduced) return
    let raf = 0
    const update = () => {
      raf = 0
      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight || 1
      const center = rect.top + rect.height / 2
      const prog = (center - vh / 2) / (vh / 2 + rect.height / 2)
      el.style.transform = `translate3d(0, ${(prog * rate).toFixed(2)}px, 0)`
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    update()
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [rate, reduced])
  return ref
}

/* ------------------------------------------------------------- widget data -- */

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"]
const CAL_LEAD = 2 // September 2026 opens on a Tuesday
const CAL_DATES = Array.from({ length: 30 }, (_, i) => i + 1)
const TARGET_DATE = 24
const SLOTS = ["9:00 am", "9:30 am", "10:00 am", "10:30 am", "11:00 am", "1:30 pm"]
const TARGET_SLOT = 3

function calDisabled(d: number) {
  const col = (CAL_LEAD + d - 1) % 7
  return d < 16 || col === 0 || col === 6
}

/**
 * The live scheduling widget. A five-step loop:
 * 0 empty calendar → 1 date picked → 2 slots fan in → 3 slot picked → 4 booked.
 * Reduced-motion settles on step 3, a fully populated, calm state.
 */
function SchedulingWidget({ reduced }: { reduced: boolean }) {
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (reduced) {
      setStep(3)
      return
    }
    const holds = [1300, 1150, 1250, 1500, 2500]
    let i = 0
    let timer: ReturnType<typeof setTimeout>
    const run = () => {
      timer = setTimeout(() => {
        i = (i + 1) % holds.length
        setStep(i)
        run()
      }, holds[i])
    }
    setStep(0)
    run()
    return () => clearTimeout(timer)
  }, [reduced])

  const dateOn = step >= 1
  const slotsOn = step >= 2
  const slotOn = step >= 3
  const booked = step >= 4

  return (
    <div className="mo-widget" role="img" aria-label="Momentum scheduling widget booking a 30-minute meeting">
      <div className="mo-w-side">
        <div className="mo-w-host">
          <span className="mo-w-avatar" aria-hidden="true">AR</span>
          <div>
            <p className="mo-w-org">Ana Ruiz</p>
            <p className="mo-w-title">30-minute product intro</p>
          </div>
        </div>
        <ul className="mo-w-meta">
          <li>
            <IconClock /> 30 min
          </li>
          <li>
            <IconVideo /> Zoom, added on confirm
          </li>
        </ul>
        <p className="mo-w-tz">Times shown in your local time zone.</p>
      </div>

      <div className="mo-w-main">
        <div className="mo-w-calhead">
          <span>September 2026</span>
          <div className="mo-w-nav" aria-hidden="true">
            <button type="button" tabIndex={-1}>
              <IconChevron dir="left" />
            </button>
            <button type="button" tabIndex={-1}>
              <IconChevron dir="right" />
            </button>
          </div>
        </div>

        <div className="mo-w-body">
          <div className="mo-w-cal">
            <div className="mo-w-dow">
              {WEEKDAYS.map((d, i) => (
                <span key={i}>{d}</span>
              ))}
            </div>
            <div className="mo-w-grid">
              {Array.from({ length: CAL_LEAD }).map((_, i) => (
                <span key={`b${i}`} className="mo-w-blank" />
              ))}
              {CAL_DATES.map((d) => {
                const off = calDisabled(d)
                const sel = dateOn && d === TARGET_DATE
                return (
                  <span
                    key={d}
                    className={`mo-w-date${off ? " is-off" : ""}${sel ? " is-sel" : ""}${
                      !off && !sel ? " is-open" : ""
                    }`}
                  >
                    {d}
                  </span>
                )
              })}
            </div>
          </div>

          <div className={`mo-w-slots${slotsOn ? " is-open" : ""}`}>
            <p className="mo-w-slotday">Thursday, Sep 24</p>
            <div className="mo-w-sloplist">
              {SLOTS.map((s, i) => (
                <span
                  key={s}
                  className={`mo-w-slot${slotOn && i === TARGET_SLOT ? " is-sel" : ""}`}
                  style={{ transitionDelay: `${i * 55}ms` }}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className={`mo-w-confirm${booked ? " is-open" : ""}`} aria-hidden={!booked}>
        <span className="mo-w-tick">
          <IconCheck />
        </span>
        <p className="mo-w-cf-head">You&rsquo;re booked</p>
        <p className="mo-w-cf-when">Thursday, September 24 at 10:30 am</p>
        <p className="mo-w-cf-sub">Calendar invite and Zoom link on their way to both of you.</p>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------- trust cloud -- */

const TRUST = ["Northwind", "Lumen", "Cadence", "Verve", "Atlas Freight", "Poste"]

/* ================================================================== page == */

export default function Momentum() {
  const [reduced, setReduced] = useState(false)
  const [stuck, setStuck] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReduced(mq.matches)
    const onMq = () => setReduced(mq.matches)
    mq.addEventListener("change", onMq)

    let raf = 0
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        setStuck(window.scrollY > 8)
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

  return (
    <div className="mo-root">
      <style>{css}</style>

      <header className={`mo-nav${stuck ? " is-stuck" : ""}`}>
        <a className="mo-brand" href="#top">
          <span className="mo-brand-mark">
            <Logo />
          </span>
          Momentum
        </a>
        <nav className="mo-nav-links">
          <a href="#features">Features</a>
          <a href="#pricing">Pricing</a>
          <a href="#customers">Customers</a>
        </nav>
        <div className="mo-nav-cta">
          <a href="#demo" className="mo-btn mo-btn-ghost">
            Book a demo
          </a>
          <a href="#start" className="mo-btn mo-btn-solid">
            Start free
          </a>
        </div>
      </header>

      {/* HERO */}
      <section className="mo-hero" id="top">
        <div className="mo-hero-copy">
          <span className="mo-pill">
            <span className="mo-pill-dot" aria-hidden="true" />
            New: team round-robin routing
          </span>
          <h1 className="mo-h1">The last scheduling link you&rsquo;ll send.</h1>
          <p className="mo-lede">
            Momentum reads your real calendar, offers only the times you&rsquo;re actually free, and books
            the meeting the second a guest picks one. No back-and-forth, no 2 a.m. double-bookings.
          </p>
          <div className="mo-hero-actions">
            <a href="#start" className="mo-btn mo-btn-solid mo-btn-lg">
              Start free
            </a>
            <a href="#demo" className="mo-btn mo-btn-ghost mo-btn-lg">
              Book a demo
            </a>
          </div>
          <p className="mo-hero-fine">Free for individuals. No credit card required.</p>
        </div>
        <div className="mo-hero-visual">
          <SchedulingWidget reduced={reduced} />
        </div>
      </section>

      {/* TRUST */}
      <section className="mo-trust">
        <p className="mo-trust-lead">The teams closing more meetings run on Momentum</p>
        <ul className="mo-trust-row">
          {TRUST.map((name) => (
            <li key={name} className="mo-wordmark">
              <span className="mo-wordmark-glyph" aria-hidden="true" />
              {name}
            </li>
          ))}
        </ul>
      </section>

      {/* BEFORE / AFTER */}
      <BeforeAfter />

      {/* FEATURES */}
      <section className="mo-features" id="features">
        <div className="mo-sec-head">
          <span className="mo-eyebrow">How teams use it</span>
          <h2 className="mo-h2">Everything that made scheduling a chore, handled quietly.</h2>
        </div>
        {FEATURES.map((f, i) => (
          <FeatureRow key={f.title} feature={f} flip={i % 2 === 1} reduced={reduced} />
        ))}
      </section>

      {/* SOCIAL PROOF */}
      <ProofSection reduced={reduced} />

      {/* PRICING */}
      <Pricing reduced={reduced} />

      {/* INTEGRATIONS */}
      <section className="mo-integ">
        <div className="mo-integ-head">
          <span className="mo-eyebrow">Works with your stack</span>
          <h2 className="mo-h2">It lands where your team already works.</h2>
          <p className="mo-integ-sub">
            Sync every calendar, drop meetings into your CRM, and let the tools you already pay for do
            the busywork.
          </p>
        </div>
        <ul className="mo-integ-grid">
          {INTEGRATIONS.map((it) => (
            <li key={it.name} className="mo-integ-cell">
              <span className="mo-integ-glyph" style={{ background: it.tint }} aria-hidden="true">
                {it.i}
              </span>
              <span className="mo-integ-name">{it.name}</span>
              <span className="mo-integ-kind">{it.kind}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* FINAL CTA */}
      <section className="mo-cta" id="start">
        <div className="mo-cta-inner">
          <h2 className="mo-cta-title">Send your last scheduling link today.</h2>
          <p className="mo-cta-lede">
            Set it up in the time this page took to read. Your next meeting can book itself.
          </p>
          <div className="mo-hero-actions mo-cta-actions">
            <a href="#start" className="mo-btn mo-btn-lg mo-cta-solid">
              Start free
            </a>
            <a href="#demo" className="mo-btn mo-btn-lg mo-cta-ghost">
              Book a demo
            </a>
          </div>
          <p className="mo-cta-fine">No credit card required. Free forever for individuals.</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mo-footer">
        <div className="mo-footer-inner">
          <div className="mo-footer-brand">
            <a className="mo-brand" href="#top">
              <span className="mo-brand-mark">
                <Logo />
              </span>
              Momentum
            </a>
            <p className="mo-footer-note">Scheduling that books itself. Made for teams who&rsquo;d rather be in the meeting than arranging it.</p>
          </div>
          <div className="mo-footer-cols">
            {FOOTER.map((col) => (
              <div key={col.head} className="mo-footer-col">
                <p className="mo-footer-head">{col.head}</p>
                <ul>
                  {col.links.map((l) => (
                    <li key={l}>
                      <a href="#">{l}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mo-footer-base">
          <span>&copy; 2026 Momentum Labs, Inc.</span>
          <span className="mo-footer-legal">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Status</a>
          </span>
        </div>
      </footer>
    </div>
  )
}

/* ----------------------------------------------------------- integrations -- */

const INTEGRATIONS = [
  { name: "Google Calendar", kind: "Calendar", i: "G", tint: "#eef2ff" },
  { name: "Outlook", kind: "Calendar", i: "O", tint: "#eaf3fb" },
  { name: "Zoom", kind: "Conferencing", i: "Z", tint: "#eaf1fe" },
  { name: "Google Meet", kind: "Conferencing", i: "M", tint: "#eafaf1" },
  { name: "Salesforce", kind: "CRM", i: "S", tint: "#eef4fb" },
  { name: "HubSpot", kind: "CRM", i: "H", tint: "#fdf0ec" },
  { name: "Slack", kind: "Notifications", i: "#", tint: "#f3eefb" },
  { name: "Stripe", kind: "Payments", i: "$", tint: "#eef0fe" },
  { name: "Zapier", kind: "Automation", i: "Z", tint: "#fbf1ea" },
  { name: "Webhooks", kind: "Developer API", i: "{}", tint: "#eef1f4" },
]

const FOOTER = [
  { head: "Product", links: ["Features", "Pricing", "Round-robin", "Integrations", "Changelog"] },
  { head: "Company", links: ["About", "Customers", "Careers", "Contact"] },
  { head: "Resources", links: ["Help center", "Scheduling guide", "API docs", "Status"] },
]

/* --------------------------------------------------------- social proof -- */

type Stat = { value: number; suffix: string; prefix?: string; label: string; decimals?: number }
const STATS: Stat[] = [
  { value: 63, suffix: "%", label: "fewer no-shows in the first quarter" },
  { value: 9400, suffix: "", label: "meetings booked without a single email" },
  { value: 4.2, suffix: " days", label: "saved per rep every month", decimals: 1 },
]

function StatCard({ stat, shown, reduced }: { stat: Stat; shown: boolean; reduced: boolean }) {
  const v = useTween(shown ? stat.value : 0, shown, reduced, 1400)
  const text = stat.decimals ? v.toFixed(stat.decimals) : Math.round(v).toLocaleString("en-US")
  return (
    <div className="mo-stat">
      <span className="mo-stat-num">
        {stat.prefix}
        {text}
        {stat.suffix}
      </span>
      <span className="mo-stat-label">{stat.label}</span>
    </div>
  )
}

function ProofSection({ reduced }: { reduced: boolean }) {
  const [ref, shown] = useReveal<HTMLDivElement>()
  return (
    <section className="mo-proof" id="customers" ref={ref}>
      <div className={`mo-proof-inner${shown ? " is-in" : ""}`}>
        <figure className="mo-quote">
          <blockquote>
            &ldquo;We cut a full week off our sales cycle the month we switched. Prospects book
            themselves while they&rsquo;re still excited, and my reps stopped playing email
            tennis.&rdquo;
          </blockquote>
          <figcaption>
            <span className="mo-quote-av" aria-hidden="true">DO</span>
            <span>
              <span className="mo-quote-name">Dana Okafor</span>
              <span className="mo-quote-role">VP Revenue, Cadence</span>
            </span>
          </figcaption>
        </figure>
        <div className="mo-stats">
          {STATS.map((s) => (
            <StatCard key={s.label} stat={s} shown={shown} reduced={reduced} />
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- pricing -- */

type Tier = {
  name: string
  monthly: number
  blurb: string
  features: string[]
  popular?: boolean
  cta: string
}
const TIERS: Tier[] = [
  {
    name: "Free",
    monthly: 0,
    blurb: "For individuals scheduling their own meetings.",
    features: ["One booking link", "Connect one calendar", "Automated email reminders", "Zoom & Google Meet"],
    cta: "Start free",
  },
  {
    name: "Team",
    monthly: 12,
    blurb: "For teams that book together and route smartly.",
    features: ["Everything in Free", "Round-robin & collective links", "Availability rules & buffers", "SMS reminders", "Salesforce & HubSpot"],
    popular: true,
    cta: "Start free trial",
  },
  {
    name: "Scale",
    monthly: 24,
    blurb: "For companies that need control and reporting.",
    features: ["Everything in Team", "SAML single sign-on", "Routing forms & analytics", "Managed onboarding", "Priority support"],
    cta: "Talk to sales",
  },
]

function Price({ monthly, annual, reduced }: { monthly: number; annual: boolean; reduced: boolean }) {
  const target = annual ? Math.round(monthly * 0.8) : monthly
  const [ref, shown] = useReveal<HTMLSpanElement>()
  const v = useTween(shown ? target : monthly, shown, reduced, 550)
  return (
    <span className="mo-price" ref={ref}>
      <span className="mo-price-cur">$</span>
      <span className="mo-price-num">{Math.round(v)}</span>
      <span className="mo-price-per">/user, mo</span>
    </span>
  )
}

function Pricing({ reduced }: { reduced: boolean }) {
  const [annual, setAnnual] = useState(true)
  return (
    <section className="mo-pricing" id="pricing">
      <div className="mo-sec-head mo-pricing-head">
        <span className="mo-eyebrow">Pricing</span>
        <h2 className="mo-h2">Start free. Upgrade when your calendar earns it.</h2>
        <div className="mo-toggle" role="group" aria-label="Billing period">
          <button
            type="button"
            className={`mo-toggle-opt${!annual ? " is-active" : ""}`}
            aria-pressed={!annual}
            onClick={() => setAnnual(false)}
          >
            Monthly
          </button>
          <button
            type="button"
            className={`mo-toggle-opt${annual ? " is-active" : ""}`}
            aria-pressed={annual}
            onClick={() => setAnnual(true)}
          >
            Annual
          </button>
          <span className={`mo-toggle-thumb${annual ? " is-right" : ""}`} aria-hidden="true" />
          <span className="mo-toggle-save">Save 20%</span>
        </div>
      </div>
      <div className="mo-tiers">
        {TIERS.map((t) => (
          <div key={t.name} className={`mo-tier${t.popular ? " is-popular" : ""}`}>
            {t.popular && <span className="mo-tier-flag">Most popular</span>}
            <h3 className="mo-tier-name">{t.name}</h3>
            <p className="mo-tier-blurb">{t.blurb}</p>
            {t.monthly === 0 ? (
              <span className="mo-price">
                <span className="mo-price-num">Free</span>
              </span>
            ) : (
              <Price monthly={t.monthly} annual={annual} reduced={reduced} />
            )}
            <a href="#start" className={`mo-btn mo-btn-lg ${t.popular ? "mo-btn-solid" : "mo-btn-ghost"} mo-tier-cta`}>
              {t.cta}
            </a>
            <ul className="mo-tier-feats">
              {t.features.map((f) => (
                <li key={f}>
                  <span className="mo-frow-tick" aria-hidden="true">
                    <IconCheck />
                  </span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ------------------------------------------------------- before / after -- */

function BeforeAfter() {
  const [ref, shown] = useReveal<HTMLDivElement>()
  return (
    <section className="mo-ba" ref={ref}>
      <div className={`mo-ba-inner${shown ? " is-in" : ""}`}>
        <div className="mo-ba-copy">
          <span className="mo-eyebrow">The difference</span>
          <h2 className="mo-h2">One link beats six emails across three time zones.</h2>
          <p className="mo-ba-lede">
            The old way is a thread that never quite lands. The Momentum way is a link that already
            knows when you&rsquo;re free.
          </p>
        </div>
        <div className="mo-ba-grid">
          <div className="mo-ba-card is-before">
            <span className="mo-ba-tag">Before</span>
            <ul className="mo-thread">
              <li>&ldquo;Does Tuesday work?&rdquo;</li>
              <li className="mo-thread-them">&ldquo;Tuesday&rsquo;s full &mdash; Thursday?&rdquo;</li>
              <li>&ldquo;Thursday I&rsquo;m in Berlin, so&hellip;&rdquo;</li>
              <li className="mo-thread-them">&ldquo;What&rsquo;s that in your time?&rdquo;</li>
              <li className="mo-thread-late">Re: Re: Re: quick sync?</li>
            </ul>
          </div>
          <div className="mo-ba-card is-after">
            <span className="mo-ba-tag is-ok">After</span>
            <div className="mo-after-row">
              <span className="mo-after-dot" aria-hidden="true" />
              <div>
                <p className="mo-after-line">Thursday, 10:30 am</p>
                <p className="mo-after-sub">Confirmed the moment they picked it</p>
              </div>
              <span className="mo-after-check" aria-hidden="true">
                <IconCheck />
              </span>
            </div>
            <p className="mo-after-foot">Invite sent. Reminder scheduled. Nothing left in your inbox.</p>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ----------------------------------------------------------- feature rows -- */

type Feature = {
  title: string
  benefit: string
  points: string[]
  mock: "rules" | "team" | "reminders"
}

const FEATURES: Feature[] = [
  {
    title: "Availability rules that guard your focus",
    benefit:
      "Set working hours, daily meeting caps, and buffers once. Momentum enforces them on every link, so nobody books over your deep-work block or stacks eight calls back to back.",
    points: ["Automatic buffers between meetings", "A cap on how many book per day", "Minimum notice before anyone grabs a slot"],
    mock: "rules",
  },
  {
    title: "Round-robin that shares the load fairly",
    benefit:
      "Pool a team behind one link and Momentum routes each guest to whoever is free and next in line. Weight it by capacity when your senior reps need lighter days.",
    points: ["Routes by real-time availability", "Weighted by fairness or capacity", "Falls back to a teammate automatically"],
    mock: "team",
  },
  {
    title: "Reminders that quietly kill no-shows",
    benefit:
      "Email and text nudges go out on your schedule, with a one-tap reschedule link. Teams switching to Momentum see attendance climb without lifting a finger.",
    points: ["Email and SMS on your cadence", "One-tap reschedule, no email chain", "Follow-ups fire after the call ends"],
    mock: "reminders",
  },
]

function FeatureMock({ kind }: { kind: Feature["mock"] }) {
  if (kind === "rules") {
    return (
      <div className="mo-mock mo-mock-rules">
        <div className="mo-mock-bar">
          <span>Working hours</span>
          <span className="mo-mock-val">9:00 am &ndash; 5:00 pm</span>
        </div>
        <div className="mo-mock-bar">
          <span>Buffer before &amp; after</span>
          <span className="mo-mock-pill">15 min</span>
        </div>
        <div className="mo-mock-bar">
          <span>Max meetings per day</span>
          <span className="mo-mock-pill">6</span>
        </div>
        <div className="mo-mock-toggle">
          <span>Protect Fridays for focus</span>
          <span className="mo-switch is-on" aria-hidden="true"><span /></span>
        </div>
      </div>
    )
  }
  if (kind === "team") {
    return (
      <div className="mo-mock mo-mock-team">
        <p className="mo-mock-label">Next in rotation</p>
        {[
          { n: "Ana Ruiz", i: "AR", free: true, load: "3 today" },
          { n: "Dev Patel", i: "DP", free: true, load: "2 today" },
          { n: "Mara Kane", i: "MK", free: false, load: "full" },
        ].map((m, idx) => (
          <div key={m.n} className={`mo-team-row${idx === 0 ? " is-next" : ""}`}>
            <span className="mo-team-av">{m.i}</span>
            <span className="mo-team-name">{m.n}</span>
            <span className={`mo-team-state${m.free ? " is-free" : ""}`}>
              {m.free ? "available" : "at capacity"}
            </span>
            <span className="mo-team-load">{m.load}</span>
          </div>
        ))}
        <p className="mo-mock-foot">Guest is routed to Ana, next in line and free.</p>
      </div>
    )
  }
  return (
    <div className="mo-mock mo-mock-rem">
      <div className="mo-rem-row">
        <span className="mo-rem-when">24h before</span>
        <span className="mo-rem-what">Email reminder</span>
        <span className="mo-rem-ok" aria-hidden="true"><IconCheck /></span>
      </div>
      <div className="mo-rem-row">
        <span className="mo-rem-when">1h before</span>
        <span className="mo-rem-what">Text with join link</span>
        <span className="mo-rem-ok" aria-hidden="true"><IconCheck /></span>
      </div>
      <div className="mo-rem-row is-pending">
        <span className="mo-rem-when">After call</span>
        <span className="mo-rem-what">Follow-up &amp; recap</span>
        <span className="mo-rem-dot" aria-hidden="true" />
      </div>
      <p className="mo-mock-foot">Attendance up, and not one message you had to send.</p>
    </div>
  )
}

function FeatureRow({ feature, flip, reduced }: { feature: Feature; flip: boolean; reduced: boolean }) {
  const [ref, shown] = useReveal<HTMLDivElement>()
  const parRef = useParallax<HTMLDivElement>(reduced ? 0 : -26, reduced)
  return (
    <div className={`mo-frow${flip ? " is-flip" : ""}${shown ? " is-in" : ""}`} ref={ref}>
      <div className="mo-frow-copy">
        <h3 className="mo-frow-title">{feature.title}</h3>
        <p className="mo-frow-benefit">{feature.benefit}</p>
        <ul className="mo-frow-points">
          {feature.points.map((p) => (
            <li key={p}>
              <span className="mo-frow-tick" aria-hidden="true">
                <IconCheck />
              </span>
              {p}
            </li>
          ))}
        </ul>
      </div>
      <div className="mo-frow-visual">
        <div className="mo-frow-par" ref={parRef}>
          <FeatureMock kind={feature.mock} />
        </div>
      </div>
    </div>
  )
}

const css = `
.mo-root {
  --bg: #fbfbfd;
  --card: #ffffff;
  --ink: #12141a;
  --muted: #5b6270;
  --faint: #9aa0ad;
  --accent: #4b47e0;
  --accent-press: #3d39c9;
  --accent-soft: rgba(75, 71, 224, 0.08);
  --accent-line: rgba(75, 71, 224, 0.22);
  --ok: #0f9d6a;
  --ok-soft: rgba(15, 157, 106, 0.12);
  --line: rgba(18, 20, 26, 0.09);
  --line-2: rgba(18, 20, 26, 0.14);
  --shadow-sm: 0 1px 2px rgba(18, 20, 26, 0.05), 0 4px 12px -6px rgba(18, 20, 26, 0.1);
  --shadow-lg: 0 24px 60px -28px rgba(28, 30, 60, 0.4), 0 8px 24px -16px rgba(18, 20, 26, 0.14);
  background: var(--bg);
  color: var(--ink);
  font-family: var(--font-geist), system-ui, -apple-system, sans-serif;
  -webkit-font-smoothing: antialiased;
  line-height: 1.6;
  overflow-x: hidden;
}
.mo-root *,
.mo-root *::before,
.mo-root *::after { box-sizing: border-box; }
.mo-root ::selection { background: var(--accent); color: #fff; }

/* buttons */
.mo-btn {
  display: inline-flex; align-items: center; justify-content: center;
  font: inherit; font-weight: 550; font-size: 0.95rem; text-decoration: none;
  padding: 0.62rem 1.15rem; border-radius: 10px; border: 1px solid transparent;
  cursor: pointer; white-space: nowrap;
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), background 0.2s, box-shadow 0.3s, border-color 0.2s, color 0.2s;
}
.mo-btn-solid { background: var(--accent); color: #fff; box-shadow: 0 1px 2px rgba(75, 71, 224, 0.4), 0 10px 24px -14px rgba(75, 71, 224, 0.9); }
.mo-btn-solid:hover { background: var(--accent-press); transform: translateY(-2px); box-shadow: 0 8px 24px -8px rgba(75, 71, 224, 0.7); }
.mo-btn-ghost { background: var(--card); color: var(--ink); border-color: var(--line-2); }
.mo-btn-ghost:hover { border-color: var(--ink); transform: translateY(-2px); }
.mo-btn-lg { padding: 0.85rem 1.5rem; font-size: 1rem; border-radius: 11px; }

/* NAV */
.mo-nav {
  position: sticky; top: 0; z-index: 60;
  display: flex; align-items: center; gap: 1.5rem;
  padding: 0.85rem clamp(1.1rem, 4vw, 3rem);
  background: rgba(251, 251, 253, 0.82);
  border-bottom: 1px solid transparent;
  transition: border-color 0.3s, box-shadow 0.3s, background 0.3s;
}
.mo-nav.is-stuck { background: rgba(251, 251, 253, 0.97); border-bottom-color: var(--line); box-shadow: 0 1px 0 rgba(18,20,26,0.02), 0 8px 24px -20px rgba(18,20,26,0.4); }
.mo-brand {
  display: inline-flex; align-items: center; gap: 0.55rem;
  font-weight: 650; font-size: 1.12rem; letter-spacing: -0.02em;
  color: var(--ink); text-decoration: none; margin-right: auto;
}
.mo-brand-mark { color: var(--accent); display: inline-flex; }
.mo-logo { display: block; }
.mo-nav-links { display: flex; gap: 1.6rem; }
.mo-nav-links a { color: var(--muted); text-decoration: none; font-size: 0.95rem; font-weight: 500; transition: color 0.2s; }
.mo-nav-links a:hover { color: var(--ink); }
.mo-nav-cta { display: flex; align-items: center; gap: 0.6rem; }
@media (max-width: 860px) { .mo-nav-links { display: none; } }
@media (max-width: 560px) { .mo-nav-cta .mo-btn-ghost { display: none; } }

/* HERO */
.mo-hero {
  display: grid; grid-template-columns: 1.02fr 1fr; align-items: center;
  gap: clamp(2rem, 5vw, 4.5rem);
  max-width: 1200px; margin: 0 auto;
  padding: clamp(3rem, 7vw, 6rem) clamp(1.1rem, 4vw, 3rem) clamp(3rem, 6vw, 5rem);
}
.mo-pill {
  display: inline-flex; align-items: center; gap: 0.5rem;
  background: var(--accent-soft); color: var(--accent-press);
  border: 1px solid var(--accent-line);
  font-size: 0.85rem; font-weight: 550; padding: 0.32rem 0.75rem; border-radius: 999px;
  margin-bottom: 1.5rem;
}
.mo-pill-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--accent); box-shadow: 0 0 0 3px var(--accent-soft); }
.mo-h1 {
  font-size: clamp(2.5rem, 5.4vw, 4.2rem); line-height: 1.02; letter-spacing: -0.035em;
  font-weight: 640; margin: 0 0 1.3rem; max-width: 14ch;
}
.mo-lede { font-size: clamp(1.08rem, 1.5vw, 1.28rem); color: var(--muted); margin: 0 0 2rem; max-width: 34rem; }
.mo-hero-actions { display: flex; gap: 0.75rem; flex-wrap: wrap; }
.mo-hero-fine { color: var(--faint); font-size: 0.9rem; margin: 1.1rem 0 0; }
@media (max-width: 900px) {
  .mo-hero { grid-template-columns: 1fr; }
  .mo-h1 { max-width: 18ch; }
}

/* SCHEDULING WIDGET */
.mo-widget {
  position: relative;
  display: grid; grid-template-columns: 12rem 1fr;
  background: var(--card); border: 1px solid var(--line);
  border-radius: 18px; box-shadow: var(--shadow-lg);
  overflow: hidden; min-height: 20rem;
}
.mo-w-side { padding: 1.4rem; border-right: 1px solid var(--line); background: linear-gradient(180deg, #fcfcff, #f7f7fb); }
.mo-w-host { display: flex; gap: 0.7rem; align-items: center; margin-bottom: 1.1rem; }
.mo-w-avatar {
  flex: 0 0 auto; width: 2.35rem; height: 2.35rem; border-radius: 50%;
  background: var(--accent); color: #fff; font-size: 0.82rem; font-weight: 600;
  display: grid; place-items: center; letter-spacing: 0.01em;
}
.mo-w-org { font-size: 0.82rem; color: var(--muted); margin: 0; }
.mo-w-title { font-size: 0.98rem; font-weight: 600; margin: 0.05rem 0 0; letter-spacing: -0.01em; }
.mo-w-meta { list-style: none; margin: 0; padding: 0; display: grid; gap: 0.5rem; }
.mo-w-meta li { display: flex; align-items: center; gap: 0.5rem; font-size: 0.86rem; color: var(--muted); }
.mo-w-meta svg { color: var(--faint); flex: 0 0 auto; }
.mo-w-tz { font-size: 0.78rem; color: var(--faint); margin: 1.1rem 0 0; }

.mo-w-main { padding: 1.3rem 1.4rem; }
.mo-w-calhead { display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.9rem; }
.mo-w-calhead > span { font-size: 0.95rem; font-weight: 600; letter-spacing: -0.01em; }
.mo-w-nav { display: flex; gap: 0.3rem; }
.mo-w-nav button {
  display: grid; place-items: center; width: 1.8rem; height: 1.8rem; padding: 0;
  border: 1px solid var(--line); border-radius: 8px; background: var(--card); color: var(--muted); cursor: default;
}
.mo-w-body { display: grid; grid-template-columns: 1fr 8.5rem; gap: 1.1rem; }
.mo-w-dow, .mo-w-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 3px; }
.mo-w-dow { margin-bottom: 5px; }
.mo-w-dow span { text-align: center; font-size: 0.7rem; color: var(--faint); font-weight: 600; }
.mo-w-date {
  aspect-ratio: 1; display: grid; place-items: center;
  font-size: 0.82rem; border-radius: 8px; font-variant-numeric: tabular-nums;
  color: var(--ink); transition: background 0.3s, color 0.3s, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.mo-w-blank { aspect-ratio: 1; }
.mo-w-date.is-off { color: var(--faint); opacity: 0.55; }
.mo-w-date.is-open { background: var(--accent-soft); color: var(--accent-press); font-weight: 550; }
.mo-w-date.is-sel { background: var(--accent); color: #fff; font-weight: 600; transform: scale(1.06); box-shadow: 0 6px 16px -8px rgba(75,71,224,0.9); }

.mo-w-slots { border-left: 1px solid var(--line); padding-left: 1.1rem; opacity: 0; transition: opacity 0.4s ease; }
.mo-w-slots.is-open { opacity: 1; }
.mo-w-slotday { font-size: 0.82rem; font-weight: 600; margin: 0 0 0.6rem; letter-spacing: -0.01em; }
.mo-w-sloplist { display: grid; gap: 0.4rem; }
.mo-w-slot {
  font-size: 0.82rem; font-weight: 550; text-align: center; padding: 0.42rem 0;
  border: 1px solid var(--accent-line); border-radius: 8px; color: var(--accent-press);
  background: var(--card);
  opacity: 0; transform: translateY(6px);
  transition: opacity 0.45s ease, transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), background 0.3s, color 0.3s;
}
.mo-w-slots.is-open .mo-w-slot { opacity: 1; transform: none; }
.mo-w-slot.is-sel { background: var(--accent); color: #fff; border-color: var(--accent); }

.mo-w-confirm {
  position: absolute; inset: 0; background: var(--card);
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  text-align: center; padding: 1.5rem; gap: 0.3rem;
  opacity: 0; transform: scale(0.985); pointer-events: none;
  transition: opacity 0.5s ease, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}
.mo-w-confirm.is-open { opacity: 1; transform: none; }
.mo-w-tick {
  width: 3.1rem; height: 3.1rem; border-radius: 50%; display: grid; place-items: center;
  background: var(--ok-soft); color: var(--ok); margin-bottom: 0.6rem;
}
.mo-w-cf-head { font-size: 1.25rem; font-weight: 640; letter-spacing: -0.02em; margin: 0; }
.mo-w-cf-when { font-size: 0.95rem; font-weight: 550; margin: 0.1rem 0 0; }
.mo-w-cf-sub { font-size: 0.86rem; color: var(--muted); margin: 0.5rem 0 0; max-width: 22rem; }

@media (max-width: 460px) {
  .mo-widget { grid-template-columns: 1fr; }
  .mo-w-side { border-right: none; border-bottom: 1px solid var(--line); }
  .mo-w-body { grid-template-columns: 1fr; }
  .mo-w-slots { border-left: none; border-top: 1px solid var(--line); padding-left: 0; padding-top: 0.9rem; }
  .mo-w-sloplist { grid-template-columns: repeat(3, 1fr); }
}

/* TRUST CLOUD */
.mo-trust {
  max-width: 1120px; margin: 0 auto;
  padding: clamp(1rem, 3vw, 2rem) clamp(1.1rem, 4vw, 3rem) clamp(3rem, 6vw, 5rem);
  text-align: center;
}
.mo-trust-lead { font-size: 0.92rem; color: var(--muted); margin: 0 0 1.6rem; }
.mo-trust-row {
  list-style: none; margin: 0; padding: 0;
  display: flex; flex-wrap: wrap; align-items: center; justify-content: center;
  gap: clamp(1.5rem, 5vw, 3.5rem);
}
.mo-wordmark {
  display: inline-flex; align-items: center; gap: 0.5rem;
  font-size: 1.1rem; font-weight: 640; letter-spacing: -0.02em;
  color: var(--ink); opacity: 0.42; filter: grayscale(1);
  transition: opacity 0.3s;
}
.mo-wordmark:hover { opacity: 0.72; }
.mo-wordmark-glyph {
  width: 1.05rem; height: 1.05rem; border-radius: 5px;
  background: var(--ink); opacity: 0.85;
  clip-path: polygon(0 0, 100% 0, 100% 70%, 70% 100%, 0 100%);
}
.mo-wordmark:nth-child(2) .mo-wordmark-glyph { border-radius: 50%; clip-path: none; }
.mo-wordmark:nth-child(3) .mo-wordmark-glyph { clip-path: polygon(50% 0, 100% 100%, 0 100%); }
.mo-wordmark:nth-child(4) .mo-wordmark-glyph { border-radius: 50%; clip-path: polygon(0 0, 100% 0, 100% 100%); }
.mo-wordmark:nth-child(5) .mo-wordmark-glyph { border-radius: 2px; clip-path: polygon(0 20%, 100% 0, 100% 80%, 0 100%); }
.mo-wordmark:nth-child(6) .mo-wordmark-glyph { border-radius: 50%; }

/* shared section furniture */
.mo-eyebrow { display: block; font-size: 0.9rem; font-weight: 600; color: var(--accent); margin-bottom: 0.7rem; }
.mo-h2 {
  font-size: clamp(1.8rem, 3.6vw, 2.9rem); line-height: 1.06; letter-spacing: -0.03em;
  font-weight: 640; margin: 0; max-width: 18ch;
}
.mo-sec-head { max-width: 1120px; margin: 0 auto clamp(2.5rem, 5vw, 4rem); padding: 0 clamp(1.1rem, 4vw, 3rem); }

/* BEFORE / AFTER */
.mo-ba { background: var(--card); border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); }
.mo-ba-inner {
  max-width: 1120px; margin: 0 auto;
  padding: clamp(3.5rem, 7vw, 6rem) clamp(1.1rem, 4vw, 3rem);
  display: grid; grid-template-columns: 0.85fr 1.15fr; gap: clamp(2rem, 5vw, 4rem); align-items: center;
}
.mo-ba-lede { color: var(--muted); font-size: 1.08rem; margin: 1.1rem 0 0; }
.mo-ba-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.mo-ba-card {
  border-radius: 14px; padding: 1.3rem; border: 1px solid var(--line);
  opacity: 0; transform: translateY(20px); transition: opacity 0.7s ease, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
}
.mo-ba-inner.is-in .mo-ba-card { opacity: 1; transform: none; }
.mo-ba-inner.is-in .mo-ba-card.is-after { transition-delay: 0.12s; }
.mo-ba-card.is-before { background: #fafafa; }
.mo-ba-card.is-after { background: linear-gradient(180deg, #fff, #fbfbff); box-shadow: var(--shadow-sm); border-color: var(--accent-line); }
.mo-ba-tag {
  display: inline-block; font-size: 0.75rem; font-weight: 600; color: var(--muted);
  background: rgba(18,20,26,0.05); padding: 0.2rem 0.55rem; border-radius: 6px; margin-bottom: 0.9rem;
}
.mo-ba-tag.is-ok { color: var(--ok); background: var(--ok-soft); }
.mo-thread { list-style: none; margin: 0; padding: 0; display: grid; gap: 0.5rem; }
.mo-thread li {
  font-size: 0.86rem; color: var(--muted); background: var(--card); border: 1px solid var(--line);
  padding: 0.5rem 0.7rem; border-radius: 9px 9px 9px 2px; max-width: 15rem;
}
.mo-thread li.mo-thread-them { margin-left: auto; border-radius: 9px 9px 2px 9px; background: #f2f2f5; }
.mo-thread li.mo-thread-late { max-width: none; color: var(--faint); font-style: italic; text-align: center; border-style: dashed; background: transparent; }
.mo-after-row { display: flex; align-items: center; gap: 0.75rem; padding: 0.4rem 0 1rem; }
.mo-after-dot { width: 9px; height: 9px; border-radius: 50%; background: var(--ok); flex: 0 0 auto; box-shadow: 0 0 0 4px var(--ok-soft); }
.mo-after-line { font-size: 1.05rem; font-weight: 640; margin: 0; letter-spacing: -0.01em; }
.mo-after-sub { font-size: 0.82rem; color: var(--muted); margin: 0.1rem 0 0; }
.mo-after-check { margin-left: auto; color: var(--ok); display: inline-flex; }
.mo-after-foot { font-size: 0.86rem; color: var(--muted); margin: 0; padding-top: 0.9rem; border-top: 1px solid var(--line); }
@media (max-width: 820px) { .mo-ba-inner { grid-template-columns: 1fr; } }
@media (max-width: 520px) { .mo-ba-grid { grid-template-columns: 1fr; } }

/* FEATURE ROWS */
.mo-features {
  max-width: 1120px; margin: 0 auto;
  padding: clamp(4rem, 8vw, 7rem) clamp(1.1rem, 4vw, 3rem) clamp(2rem, 4vw, 3rem);
}
.mo-frow {
  display: grid; grid-template-columns: 1fr 1fr; align-items: center;
  gap: clamp(2rem, 6vw, 5rem); margin-bottom: clamp(3.5rem, 7vw, 6rem);
}
.mo-frow.is-flip .mo-frow-copy { order: 2; }
.mo-frow-copy, .mo-frow-visual { opacity: 0; transform: translateY(26px); transition: opacity 0.8s ease, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1); }
.mo-frow-visual { transition-delay: 0.14s; }
.mo-frow.is-in .mo-frow-copy, .mo-frow.is-in .mo-frow-visual { opacity: 1; transform: none; }
.mo-frow-title { font-size: clamp(1.4rem, 2.6vw, 1.95rem); line-height: 1.1; letter-spacing: -0.025em; font-weight: 620; margin: 0 0 0.9rem; }
.mo-frow-benefit { color: var(--muted); font-size: 1.05rem; margin: 0 0 1.4rem; }
.mo-frow-points { list-style: none; margin: 0; padding: 0; display: grid; gap: 0.65rem; }
.mo-frow-points li { display: flex; align-items: flex-start; gap: 0.6rem; font-size: 0.98rem; color: var(--ink); }
.mo-frow-tick { flex: 0 0 auto; width: 1.25rem; height: 1.25rem; margin-top: 0.05rem; border-radius: 50%; display: grid; place-items: center; background: var(--accent-soft); color: var(--accent); }
.mo-frow-tick svg { width: 15px; height: 15px; }
@media (max-width: 820px) {
  .mo-frow { grid-template-columns: 1fr; gap: 1.8rem; }
  .mo-frow.is-flip .mo-frow-copy { order: 0; }
}

/* feature mocks */
.mo-frow-par { will-change: transform; }
.mo-mock { background: var(--card); border: 1px solid var(--line); border-radius: 16px; padding: 1.4rem; box-shadow: var(--shadow-sm); }
.mo-mock-label { font-size: 0.78rem; font-weight: 600; color: var(--faint); margin: 0 0 0.9rem; }
.mo-mock-foot { font-size: 0.84rem; color: var(--muted); margin: 1rem 0 0; padding-top: 0.9rem; border-top: 1px solid var(--line); }
.mo-mock-bar { display: flex; align-items: center; justify-content: space-between; padding: 0.7rem 0; border-bottom: 1px solid var(--line); font-size: 0.92rem; }
.mo-mock-bar:last-of-type { border-bottom: none; }
.mo-mock-val { font-weight: 550; font-variant-numeric: tabular-nums; }
.mo-mock-pill { background: var(--accent-soft); color: var(--accent-press); font-weight: 600; font-size: 0.82rem; padding: 0.15rem 0.6rem; border-radius: 999px; font-variant-numeric: tabular-nums; }
.mo-mock-toggle { display: flex; align-items: center; justify-content: space-between; margin-top: 0.7rem; padding-top: 0.9rem; border-top: 1px solid var(--line); font-size: 0.92rem; }
.mo-switch { width: 2.3rem; height: 1.3rem; border-radius: 999px; background: rgba(18,20,26,0.14); position: relative; transition: background 0.3s; flex: 0 0 auto; }
.mo-switch span { position: absolute; top: 2px; left: 2px; width: calc(1.3rem - 4px); height: calc(1.3rem - 4px); border-radius: 50%; background: #fff; box-shadow: 0 1px 2px rgba(0,0,0,0.2); transition: transform 0.3s cubic-bezier(0.16,1,0.3,1); }
.mo-switch.is-on { background: var(--accent); }
.mo-switch.is-on span { transform: translateX(1rem); }

.mo-team-row { display: grid; grid-template-columns: auto 1fr auto auto; align-items: center; gap: 0.7rem; padding: 0.6rem 0.7rem; border-radius: 10px; margin-bottom: 0.35rem; }
.mo-team-row.is-next { background: var(--accent-soft); box-shadow: inset 0 0 0 1px var(--accent-line); }
.mo-team-av { width: 1.9rem; height: 1.9rem; border-radius: 50%; background: var(--ink); color: #fff; font-size: 0.72rem; font-weight: 600; display: grid; place-items: center; }
.mo-team-row.is-next .mo-team-av { background: var(--accent); }
.mo-team-name { font-size: 0.92rem; font-weight: 550; }
.mo-team-state { font-size: 0.76rem; font-weight: 600; color: var(--faint); }
.mo-team-state.is-free { color: var(--ok); }
.mo-team-load { font-size: 0.78rem; color: var(--faint); font-variant-numeric: tabular-nums; }

.mo-rem-row { display: grid; grid-template-columns: 5.5rem 1fr auto; align-items: center; gap: 0.6rem; padding: 0.7rem 0; border-bottom: 1px solid var(--line); }
.mo-rem-when { font-size: 0.78rem; font-weight: 600; color: var(--faint); font-variant-numeric: tabular-nums; }
.mo-rem-what { font-size: 0.92rem; font-weight: 500; }
.mo-rem-ok { color: var(--ok); display: inline-flex; }
.mo-rem-ok svg { width: 18px; height: 18px; }
.mo-rem-dot { width: 9px; height: 9px; border-radius: 50%; border: 2px solid var(--faint); }
.mo-rem-row.is-pending .mo-rem-what { color: var(--muted); }

/* SOCIAL PROOF */
.mo-proof { background: var(--ink); color: #fff; }
.mo-proof-inner {
  max-width: 1120px; margin: 0 auto;
  padding: clamp(4rem, 8vw, 6.5rem) clamp(1.1rem, 4vw, 3rem);
  display: grid; grid-template-columns: 1.15fr 1fr; gap: clamp(2.5rem, 6vw, 5rem); align-items: center;
}
.mo-quote { margin: 0; opacity: 0; transform: translateY(20px); transition: opacity 0.8s ease, transform 0.8s cubic-bezier(0.16,1,0.3,1); }
.mo-proof-inner.is-in .mo-quote { opacity: 1; transform: none; }
.mo-quote blockquote {
  font-size: clamp(1.35rem, 2.6vw, 2rem); line-height: 1.32; letter-spacing: -0.02em;
  font-weight: 520; margin: 0 0 1.6rem;
}
.mo-quote figcaption { display: flex; align-items: center; gap: 0.8rem; }
.mo-quote-av { width: 2.6rem; height: 2.6rem; border-radius: 50%; background: var(--accent); color: #fff; font-weight: 600; font-size: 0.85rem; display: grid; place-items: center; flex: 0 0 auto; }
.mo-quote-name { display: block; font-weight: 600; }
.mo-quote-role { display: block; font-size: 0.9rem; color: #a7abb8; }
.mo-stats { display: grid; gap: 1.6rem; }
.mo-stat { border-left: 2px solid var(--accent); padding-left: 1.1rem; }
.mo-stat-num { display: block; font-size: clamp(2.2rem, 4.5vw, 3.2rem); font-weight: 660; letter-spacing: -0.03em; line-height: 1; font-variant-numeric: tabular-nums; }
.mo-stat-label { display: block; font-size: 0.95rem; color: #a7abb8; margin-top: 0.5rem; max-width: 22rem; }
@media (max-width: 820px) { .mo-proof-inner { grid-template-columns: 1fr; } }

/* PRICING */
.mo-pricing { max-width: 1120px; margin: 0 auto; padding: clamp(4rem, 8vw, 7rem) clamp(1.1rem, 4vw, 3rem); }
.mo-pricing-head { margin-bottom: clamp(2rem, 4vw, 3rem); }
.mo-toggle {
  position: relative; display: inline-flex; margin-top: 1.6rem;
  background: rgba(18,20,26,0.05); border: 1px solid var(--line); border-radius: 999px; padding: 4px;
}
.mo-toggle-opt {
  position: relative; z-index: 1; border: none; background: none; cursor: pointer;
  font: inherit; font-size: 0.9rem; font-weight: 600; color: var(--muted);
  padding: 0.45rem 1.1rem; border-radius: 999px; transition: color 0.3s;
}
.mo-toggle-opt.is-active { color: var(--ink); }
.mo-toggle-thumb {
  position: absolute; top: 4px; left: 4px; z-index: 0; height: calc(100% - 8px); width: calc(50% - 4px);
  background: var(--card); border-radius: 999px; box-shadow: var(--shadow-sm);
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.mo-toggle-thumb.is-right { transform: translateX(100%); }
.mo-toggle-save { align-self: center; margin-left: 0.8rem; font-size: 0.82rem; font-weight: 600; color: var(--ok); }
.mo-tiers { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.2rem; align-items: start; }
.mo-tier {
  position: relative; background: var(--card); border: 1px solid var(--line); border-radius: 16px;
  padding: 1.8rem 1.6rem; box-shadow: var(--shadow-sm);
  transition: transform 0.4s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s;
}
.mo-tier.is-popular { border-color: var(--accent); box-shadow: var(--shadow-lg); transform: translateY(-10px); z-index: 1; }
.mo-tier-flag { position: absolute; top: -0.75rem; left: 1.6rem; background: var(--accent); color: #fff; font-size: 0.74rem; font-weight: 600; padding: 0.25rem 0.7rem; border-radius: 999px; }
.mo-tier-name { font-size: 1.25rem; font-weight: 640; letter-spacing: -0.02em; margin: 0 0 0.35rem; }
.mo-tier-blurb { font-size: 0.9rem; color: var(--muted); margin: 0 0 1.2rem; min-height: 2.6rem; }
.mo-price { display: flex; align-items: baseline; gap: 0.1rem; margin-bottom: 1.3rem; }
.mo-price-cur { font-size: 1.4rem; font-weight: 600; align-self: flex-start; margin-top: 0.35rem; }
.mo-price-num { font-size: clamp(2.6rem, 5vw, 3.2rem); font-weight: 680; letter-spacing: -0.03em; line-height: 1; font-variant-numeric: tabular-nums; }
.mo-price-per { font-size: 0.9rem; color: var(--muted); margin-left: 0.25rem; }
.mo-tier-cta { width: 100%; margin-bottom: 1.5rem; }
.mo-tier-feats { list-style: none; margin: 0; padding: 1.3rem 0 0; border-top: 1px solid var(--line); display: grid; gap: 0.7rem; }
.mo-tier-feats li { display: flex; align-items: flex-start; gap: 0.6rem; font-size: 0.92rem; }
@media (max-width: 860px) {
  .mo-tiers { grid-template-columns: 1fr; max-width: 26rem; margin: 0 auto; }
  .mo-tier.is-popular { transform: none; order: -1; }
}

/* INTEGRATIONS */
.mo-integ { background: var(--card); border-top: 1px solid var(--line); }
.mo-integ-head { max-width: 1120px; margin: 0 auto; padding: clamp(4rem, 8vw, 6.5rem) clamp(1.1rem, 4vw, 3rem) clamp(2rem, 4vw, 3rem); }
.mo-integ-sub { color: var(--muted); font-size: 1.05rem; margin: 1rem 0 0; max-width: 38rem; }
.mo-integ-grid {
  max-width: 1120px; margin: 0 auto; padding: 0 clamp(1.1rem, 4vw, 3rem) clamp(4rem, 8vw, 6.5rem);
  list-style: none; display: grid; grid-template-columns: repeat(5, 1fr); gap: 1rem;
}
.mo-integ-cell {
  display: flex; flex-direction: column; align-items: flex-start; gap: 0.15rem;
  background: var(--bg); border: 1px solid var(--line); border-radius: 13px; padding: 1.1rem;
  transition: transform 0.35s cubic-bezier(0.16,1,0.3,1), border-color 0.25s, box-shadow 0.35s;
}
.mo-integ-cell:hover { transform: translateY(-4px); border-color: var(--line-2); box-shadow: var(--shadow-sm); }
.mo-integ-glyph {
  width: 2.4rem; height: 2.4rem; border-radius: 9px; display: grid; place-items: center;
  font-weight: 700; font-size: 1.05rem; color: var(--ink); margin-bottom: 0.6rem;
}
.mo-integ-name { font-size: 0.95rem; font-weight: 600; letter-spacing: -0.01em; }
.mo-integ-kind { font-size: 0.8rem; color: var(--faint); }
@media (max-width: 900px) { .mo-integ-grid { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 520px) { .mo-integ-grid { grid-template-columns: repeat(2, 1fr); } }

/* FINAL CTA */
.mo-cta {
  background: linear-gradient(135deg, var(--accent), #6a5cf0 55%, #7b53ef);
  color: #fff;
}
.mo-cta-inner { max-width: 46rem; margin: 0 auto; text-align: center; padding: clamp(4.5rem, 9vw, 7rem) clamp(1.1rem, 4vw, 3rem); }
.mo-cta-title { font-size: clamp(2rem, 4.6vw, 3.4rem); line-height: 1.04; letter-spacing: -0.03em; font-weight: 660; margin: 0 0 1.1rem; }
.mo-cta-lede { font-size: 1.15rem; margin: 0 auto 2rem; max-width: 32rem; color: rgba(255,255,255,0.88); }
.mo-cta-actions { justify-content: center; }
.mo-cta-solid { background: #fff; color: var(--accent-press); box-shadow: 0 12px 30px -12px rgba(0,0,0,0.4); }
.mo-cta-solid:hover { transform: translateY(-2px); background: #fff; box-shadow: 0 16px 36px -12px rgba(0,0,0,0.5); }
.mo-cta-ghost { background: transparent; color: #fff; border-color: rgba(255,255,255,0.5); }
.mo-cta-ghost:hover { border-color: #fff; background: rgba(255,255,255,0.1); transform: translateY(-2px); }
.mo-cta-fine { color: rgba(255,255,255,0.8); font-size: 0.9rem; margin: 1.2rem 0 0; }

/* FOOTER */
.mo-footer { background: var(--bg); border-top: 1px solid var(--line); }
.mo-footer-inner {
  max-width: 1120px; margin: 0 auto; padding: clamp(3rem, 6vw, 4.5rem) clamp(1.1rem, 4vw, 3rem) 2.5rem;
  display: grid; grid-template-columns: 1.3fr 2fr; gap: clamp(2rem, 5vw, 4rem);
}
.mo-footer-note { color: var(--muted); font-size: 0.92rem; margin: 1rem 0 0; max-width: 22rem; }
.mo-footer-cols { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
.mo-footer-head { font-size: 0.82rem; font-weight: 600; color: var(--ink); margin: 0 0 0.9rem; }
.mo-footer-col ul { list-style: none; margin: 0; padding: 0; display: grid; gap: 0.55rem; }
.mo-footer-col a { color: var(--muted); text-decoration: none; font-size: 0.9rem; transition: color 0.2s; }
.mo-footer-col a:hover { color: var(--accent); }
.mo-footer-base {
  max-width: 1120px; margin: 0 auto; padding: 1.5rem clamp(1.1rem, 4vw, 3rem);
  border-top: 1px solid var(--line);
  display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;
  font-size: 0.86rem; color: var(--faint);
}
.mo-footer-legal { display: flex; gap: 1.3rem; }
.mo-footer-legal a { color: var(--faint); text-decoration: none; transition: color 0.2s; }
.mo-footer-legal a:hover { color: var(--ink); }
@media (max-width: 720px) {
  .mo-footer-inner { grid-template-columns: 1fr; }
  .mo-footer-cols { grid-template-columns: repeat(3, 1fr); }
}
@media (max-width: 480px) { .mo-footer-cols { grid-template-columns: 1fr 1fr; } }

/* reduced motion: settle everything into its final, quiet state */
@media (prefers-reduced-motion: reduce) {
  .mo-root * { animation: none !important; transition: none !important; }
  .mo-frow-copy, .mo-frow-visual, .mo-ba-card, .mo-quote { opacity: 1 !important; transform: none !important; }
  .mo-frow-par { transform: none !important; }
}

/* __CSS_END__ */
`
