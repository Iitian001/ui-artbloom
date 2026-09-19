"use client"

import { useEffect, useRef, useState } from "react"

/**
 * Slate — a product-led dark showcase for a planning / issue-tracking SaaS.
 *
 * The whole page is built to Linear-tier polish, and the thesis is that the
 * product markets itself by *working* in front of you: the hero is a live,
 * DOM-built app surface (no screenshots, no photography) with a cursor that
 * moves on its own and an autonomous agent that picks up an issue and walks it
 * through its statuses in real time. Everything else — the bento pillars, the
 * alternating feature captures, the changelog, the marquee — stays quiet so the
 * one live moment lands. All motion is gated on prefers-reduced-motion.
 *
 * Deliberate against the tells: the base is a cool near-black (never a
 * brown-tinted black), the single chrome accent is one calm blue (status
 * colours are muted and live only inside the simulated product), there are no
 * tracked-uppercase eyebrows, no middle-dot metas, no em-dash fragment labels,
 * no decorative 01/02/03 numbering, no glassmorphism, and no arrow glyphs on
 * links. Monospace is used only where it is real product data.
 */

type Status = "backlog" | "todo" | "inprogress" | "inreview" | "done"

const STATUS_LABEL: Record<Status, string> = {
  backlog: "Backlog",
  todo: "Todo",
  inprogress: "In Progress",
  inreview: "In Review",
  done: "Done",
}

type Priority = "urgent" | "high" | "medium" | "low"

type Issue = {
  id: string
  title: string
  status: Status
  priority: Priority
  who: string
  hue: number
  label?: { text: string; tone: "blue" | "violet" | "green" | "amber" }
}

/** The issue list rendered inside the hero's live product surface. */
const HERO_ISSUES: Issue[] = [
  { id: "SLT-241", title: "Cursor jumps when a card crosses two columns", status: "inprogress", priority: "high", who: "Mara Ito", hue: 210, label: { text: "board", tone: "blue" } },
  { id: "SLT-238", title: "Realtime session drops silently on reconnect", status: "inreview", priority: "urgent", who: "Dev Rao", hue: 280, label: { text: "sync", tone: "violet" } },
  { id: "SLT-236", title: "Auto-triage inbound reports from the inbox", status: "todo", priority: "medium", who: "Agent", hue: 150 },
  { id: "SLT-233", title: "Migrate workspace settings to the new schema", status: "todo", priority: "low", who: "Lena Fox", hue: 30 },
  { id: "SLT-229", title: "Quick-switcher should rank by recency", status: "backlog", priority: "medium", who: "Sam Ojo", hue: 340, label: { text: "keyboard", tone: "green" } },
  { id: "SLT-224", title: "Export a project timeline as a shareable link", status: "backlog", priority: "low", who: "Mara Ito", hue: 210 },
]

/** The agent target row walks these statuses on a loop. */
const AGENT_FLOW: Status[] = ["todo", "inprogress", "inreview", "done"]
const AGENT_ROW = "SLT-236"

const CYCLE_WORDS = ["ship", "plan", "track"]

/** Reveal children once, when they scroll into view. Reduced-motion shows instantly. */
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
      { threshold: 0.2 },
    )
    io.observe(node)
    return () => io.disconnect()
  }, [])
  return [ref, shown] as const
}

/** A gentle position-based parallax for a panel. Returns 0 under reduced-motion. */
function useParallax<T extends HTMLElement>(strength = 0.06) {
  const ref = useRef<T>(null)
  const [y, setY] = useState(0)
  useEffect(() => {
    const node = ref.current
    if (!node) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    let raf = 0
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        const r = node.getBoundingClientRect()
        const delta = r.top + r.height / 2 - window.innerHeight / 2
        setY(-delta * strength)
        raf = 0
      })
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()
    return () => {
      window.removeEventListener("scroll", onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [strength])
  return [ref, y] as const
}

/** Count from 0 to target once `shown` turns true. */
function useCountUp(target: number, shown: boolean, dur = 1500) {
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!shown) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setN(target)
      return
    }
    let raf = 0
    const start = performance.now()
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur)
      const eased = 1 - Math.pow(1 - p, 3)
      setN(Math.round(target * eased))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, shown, dur])
  return n
}

function Avatar({ name, hue, size = 22 }: { name: string; hue: number; size?: number }) {
  const initials =
    name === "Agent"
      ? "◆"
      : name
          .split(" ")
          .map((w) => w[0])
          .slice(0, 2)
          .join("")
  return (
    <span
      className="sl-ava"
      style={{
        width: size,
        height: size,
        background: name === "Agent" ? "rgba(91,141,239,0.16)" : `hsl(${hue} 34% 26%)`,
        color: name === "Agent" ? "var(--blue-2)" : `hsl(${hue} 44% 82%)`,
        fontSize: size < 24 ? "0.6rem" : "0.72rem",
      }}
      aria-hidden="true"
    >
      {initials}
    </span>
  )
}

function StatusDot({ s }: { s: Status }) {
  return <span className={`sl-sd sl-sd-${s}`} title={STATUS_LABEL[s]} aria-hidden="true" />
}

function PriorityIcon({ level }: { level: Priority }) {
  if (level === "urgent") {
    return <span className="sl-pri sl-pri-urgent" title="Urgent" aria-hidden="true" />
  }
  const lit = level === "high" ? 3 : level === "medium" ? 2 : 1
  return (
    <span className="sl-pri" title={level} aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <i key={i} className={i < lit ? "on" : ""} />
      ))}
    </span>
  )
}

const LOGOS = ["Heliary", "Quanta", "Fathom", "Lumen", "Basis", "Orbital", "Verge"]

function LogoStrip() {
  return (
    <section className="sl-logos" aria-label="Teams that build on Slate">
      <p className="sl-logos-cap">The teams shipping fastest already run on Slate</p>
      <div className="sl-logos-row">
        {LOGOS.map((name) => (
          <span className="sl-logo" key={name}>
            <span className="sl-logo-mark" aria-hidden="true" />
            {name}
          </span>
        ))}
      </div>
    </section>
  )
}

function Sparkline({ shown }: { shown: boolean }) {
  const d =
    "M0,62 L25,54 L50,58 L75,44 L100,48 L125,34 L150,40 L175,26 L200,30 L225,20 L250,24 L275,13 L300,9"
  return (
    <svg className="sl-spark" viewBox="0 0 300 80" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id="sl-spark-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--blue)" stopOpacity="0.28" />
          <stop offset="100%" stopColor="var(--blue)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        className="sl-spark-area"
        d={`${d} L300,80 L0,80 Z`}
        fill="url(#sl-spark-fill)"
        style={{ opacity: shown ? 1 : 0 }}
      />
      <path
        className="sl-spark-line"
        d={d}
        fill="none"
        stroke="var(--blue-2)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        style={{ strokeDasharray: 1, strokeDashoffset: shown ? 0 : 1 }}
      />
      <circle className="sl-spark-tip" cx="300" cy="9" r="3.5" fill="var(--blue-2)" style={{ opacity: shown ? 1 : 0 }} />
    </svg>
  )
}

function ToggleRow() {
  const [done, setDone] = useState(false)
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDone(true)
      return
    }
    const id = setInterval(() => setDone((d) => !d), 1900)
    return () => clearInterval(id)
  }, [])
  return (
    <div className="sl-toggle">
      <div className={`sl-toggle-row ${done ? "is-done" : ""}`}>
        <span className="sl-toggle-box" aria-hidden="true">
          <svg viewBox="0 0 12 12" width="10" height="10">
            <path d="M2.5 6.2 L5 8.6 L9.5 3.4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <span className="sl-toggle-label">Update the changelog draft</span>
      </div>
      <div className="sl-keys" aria-hidden="true">
        <kbd>E</kbd>
        <span>marks it {done ? "done" : "open"}</span>
      </div>
    </div>
  )
}

function Pillars() {
  const [ref, shown] = useReveal<HTMLDivElement>()
  const triaged = useCountUp(1284, shown)
  return (
    <section className="sl-sec" id="product">
      <div className="sl-sec-head">
        <h2 className="sl-h2">Fast is a feature</h2>
        <p className="sl-sec-lede">
          The parts of the day that used to be overhead — syncing, triaging, closing out — Slate
          takes care of, so momentum is the default state, not something you have to protect.
        </p>
      </div>
      <div className="sl-bento" ref={ref}>
        <article className={`sl-tile sl-tile-lg ${shown ? "is-shown" : ""}`}>
          <div className="sl-tile-top">
            <h3 className="sl-tile-h">Everything stays in sync</h3>
            <p className="sl-tile-p">
              Every change lands for everyone the instant it happens. No refresh, no two people
              overwriting a status, no board that is stale the moment someone else touches it.
            </p>
          </div>
          <div className="sl-spark-wrap">
            <Sparkline shown={shown} />
            <span className="sl-spark-cap">Updates delivered in the last minute</span>
          </div>
        </article>
        <article className={`sl-tile ${shown ? "is-shown" : ""}`} style={{ transitionDelay: "0.08s" }}>
          <div className="sl-stat">
            <span className="sl-stat-n">{triaged.toLocaleString()}</span>
            <span className="sl-stat-l">reports triaged by agents this week</span>
          </div>
          <p className="sl-tile-p">
            Slate reads what comes in, tags it, and routes it to the right team before you open your
            laptop.
          </p>
        </article>
        <article className={`sl-tile ${shown ? "is-shown" : ""}`} style={{ transitionDelay: "0.16s" }}>
          <h3 className="sl-tile-h">Built for the keyboard</h3>
          <ToggleRow />
          <p className="sl-tile-p">
            Create, assign, and close without reaching for the mouse. The actions you repeat are a
            single key away.
          </p>
        </article>
      </div>
    </section>
  )
}

function BoardPanel() {
  return (
    <div className="sl-board" aria-hidden="true">
      <div className="sl-col">
        <div className="sl-col-head"><span className="sl-sd sl-sd-todo" />Todo<span className="sl-col-n">2</span></div>
        <div className="sl-bcard"><p>Rework the onboarding checklist</p><div className="sl-bcard-f"><span className="sl-issue-id">SLT-251</span><span className="sl-ava" style={{ width: 18, height: 18, background: "hsl(210 34% 26%)", color: "hsl(210 44% 82%)", fontSize: "0.56rem" }}>MI</span></div></div>
        <div className="sl-bcard"><p>Empty states for the roadmap view</p><div className="sl-bcard-f"><span className="sl-issue-id">SLT-248</span><span className="sl-ava" style={{ width: 18, height: 18, background: "hsl(30 34% 26%)", color: "hsl(30 44% 82%)", fontSize: "0.56rem" }}>LF</span></div></div>
      </div>
      <div className="sl-col">
        <div className="sl-col-head"><span className="sl-sd sl-sd-inprogress" />In Progress<span className="sl-col-n">1</span></div>
        <div className="sl-bcard is-drag">
          <p>Drag a card and the board reflows live</p>
          <div className="sl-bcard-f"><span className="sl-issue-id">SLT-244</span><span className="sl-ava" style={{ width: 18, height: 18, background: "hsl(280 34% 26%)", color: "hsl(280 44% 82%)", fontSize: "0.56rem" }}>DR</span></div>
        </div>
        <div className="sl-drop" />
      </div>
      <div className="sl-col">
        <div className="sl-col-head"><span className="sl-sd sl-sd-done" />Done<span className="sl-col-n">2</span></div>
        <div className="sl-bcard is-muted"><p>Ship keyboard-driven quick switcher</p><div className="sl-bcard-f"><span className="sl-issue-id">SLT-239</span><span className="sl-ava" style={{ width: 18, height: 18, background: "hsl(340 34% 26%)", color: "hsl(340 44% 82%)", fontSize: "0.56rem" }}>SO</span></div></div>
        <div className="sl-bcard is-muted"><p>Real-time presence on every view</p><div className="sl-bcard-f"><span className="sl-issue-id">SLT-235</span><span className="sl-ava" style={{ width: 18, height: 18, background: "hsl(210 34% 26%)", color: "hsl(210 44% 82%)", fontSize: "0.56rem" }}>MI</span></div></div>
      </div>
    </div>
  )
}

const ROADMAP = [
  { name: "Realtime sync v2", team: "Core", start: 0, span: 5, tone: "blue" },
  { name: "Agent auto-triage", team: "Core", start: 3, span: 6, tone: "violet" },
  { name: "Roadmap sharing", team: "Web", start: 6, span: 4, tone: "green" },
  { name: "Mobile offline mode", team: "Mobile", start: 8, span: 4, tone: "amber" },
]

function RoadmapPanel() {
  return (
    <div className="sl-road" aria-hidden="true">
      <div className="sl-road-head">
        <span>Q1</span>
        <div className="sl-road-months"><span>Jan</span><span>Feb</span><span>Mar</span></div>
      </div>
      <div className="sl-road-body">
        <span className="sl-road-now" style={{ left: "42%" }} />
        {ROADMAP.map((r) => (
          <div className="sl-road-row" key={r.name}>
            <div className="sl-road-label"><span className="sl-road-name">{r.name}</span><span className="sl-road-team">{r.team}</span></div>
            <div className="sl-road-track">
              <span className={`sl-road-bar sl-bar-${r.tone}`} style={{ left: `${(r.start / 12) * 100}%`, width: `${(r.span / 12) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const DIFF = [
  { n: 41, t: "context", s: "  function assignee(issue: Issue) {" },
  { n: 42, t: "del", s: "    return issue.owner ?? null" },
  { n: 42, t: "add", s: "    if (issue.status === 'triage')" },
  { n: 43, t: "add", s: "      return agents.pick(issue)" },
  { n: 44, t: "add", s: "    return issue.owner ?? null" },
  { n: 45, t: "context", s: "  }" },
]

function DiffPanel() {
  return (
    <div className="sl-diff" aria-hidden="true">
      <div className="sl-diff-head">
        <span className="sl-diff-file">lib/triage.ts</span>
        <span className="sl-diff-stat"><span className="sl-plus">+3</span> <span className="sl-minus">-1</span></span>
      </div>
      <div className="sl-diff-body">
        {DIFF.map((l, i) => (
          <div className={`sl-diff-line sl-dl-${l.t}`} key={i}>
            <span className="sl-diff-n">{l.n}</span>
            <span className="sl-diff-sign">{l.t === "add" ? "+" : l.t === "del" ? "-" : " "}</span>
            <code>{l.s}</code>
          </div>
        ))}
      </div>
      <div className="sl-diff-comment">
        <span className="sl-ava" style={{ width: 22, height: 22, background: "hsl(280 34% 26%)", color: "hsl(280 44% 82%)", fontSize: "0.6rem" }}>DR</span>
        <div className="sl-diff-bubble"><span className="sl-diff-author">Dev Rao</span>Nice — this hands new reports straight to the agent. Approving.</div>
      </div>
    </div>
  )
}

const FEATURES = [
  {
    id: "features",
    kicker: "Boards",
    h: "A board that keeps up with the room",
    p: "Drag a card and everyone watching sees it move in the same instant. Slate reflows the columns live, keeps counts honest, and never asks a second person to refresh before they trust what they are looking at.",
    panel: <BoardPanel />,
    flip: false,
    parallax: 0.05,
  },
  {
    id: "roadmap",
    kicker: "Roadmaps",
    h: "Plans your team can actually read",
    p: "Every initiative sits on one timeline with the team that owns it and the weeks it spans. Change a date and the roadmap, the board, and the issues underneath it all agree — because they were never separate views to begin with.",
    panel: <RoadmapPanel />,
    flip: true,
    parallax: 0.07,
  },
  {
    id: "reviews",
    kicker: "Reviews",
    h: "Review where the work already lives",
    p: "Pull requests, diffs, and the conversation around them sit next to the issue they close. Approve a change and the issue moves itself — no tab-hopping, no copy-pasting a link into a status update nobody reads.",
    panel: <DiffPanel />,
    flip: false,
    parallax: 0.05,
  },
]

function FeatureSection({ f }: { f: (typeof FEATURES)[number] }) {
  const [ref, shown] = useReveal<HTMLDivElement>()
  const [pRef, y] = useParallax<HTMLDivElement>(f.parallax)
  return (
    <section className={`sl-feat ${f.flip ? "is-flip" : ""}`} id={f.id} ref={ref}>
      <div className={`sl-feat-copy ${shown ? "is-shown" : ""}`}>
        <span className="sl-kicker">{f.kicker}</span>
        <h2 className="sl-h2">{f.h}</h2>
        <p className="sl-sec-lede">{f.p}</p>
      </div>
      <div className="sl-feat-panel-wrap">
        <div
          className={`sl-feat-panel ${shown ? "is-shown" : ""}`}
          ref={pRef}
          style={{ transform: `translateY(${y}px)` }}
        >
          {f.panel}
        </div>
      </div>
    </section>
  )
}

const CHANGELOG = [
  { date: "Sep 18", version: "v2.14", title: "Agents can now close issues", body: "When a linked pull request merges, the assigned agent moves the issue to Done and posts the summary in the thread." },
  { date: "Sep 9", version: "v2.13", title: "Roadmap sharing links", body: "Share a read-only roadmap with anyone. Dates and status stay live; nothing else about the workspace is exposed." },
  { date: "Aug 28", version: "v2.12", title: "Faster quick switcher", body: "The command menu now ranks by what you touched most recently, so the thing you want is almost always the first result." },
]

function Changelog() {
  const [ref, shown] = useReveal<HTMLDivElement>()
  return (
    <section className="sl-sec sl-change" id="changelog">
      <div className="sl-sec-head">
        <h2 className="sl-h2">Shipped recently</h2>
        <p className="sl-sec-lede">
          We ship most weeks, and we write down what changed. Here is the last little while.
        </p>
      </div>
      <div className="sl-change-list" ref={ref}>
        {CHANGELOG.map((c, i) => (
          <article className={`sl-change-item ${shown ? "is-shown" : ""}`} key={c.version} style={{ transitionDelay: `${i * 0.08}s` }}>
            <div className="sl-change-meta">
              <span className="sl-change-date">{c.date}</span>
              <span className="sl-change-ver">{c.version}</span>
            </div>
            <div className="sl-change-body">
              <h3 className="sl-change-title">{c.title}</h3>
              <p>{c.body}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

const QUOTES = [
  { q: "We turned off three other tools the week we moved to Slate. Nothing else kept up with how we actually work.", who: "Priya Nadel", role: "VP Engineering, Quanta", hue: 280 },
  { q: "The agents quietly clear our triage queue overnight. I stopped dreading Monday mornings.", who: "Tom Ackerman", role: "Eng Lead, Fathom", hue: 210 },
  { q: "It is the first planning tool the whole team opens without being told to. That never happens.", who: "Sofia Reyes", role: "Head of Product, Lumen", hue: 150 },
  { q: "Real-time actually means real-time here. Two of us edit the same board and it just works.", who: "Marcus Bell", role: "CTO, Basis", hue: 30 },
  { q: "Reviews live next to the issue now. Our status meetings got shorter and then mostly disappeared.", who: "Ada Owusu", role: "Staff Engineer, Orbital", hue: 340 },
]

function StatBand() {
  const [ref, shown] = useReveal<HTMLDivElement>()
  const teams = useCountUp(12000, shown, 1800)
  return (
    <div className="sl-statband" ref={ref}>
      <span className="sl-statband-n">{teams.toLocaleString()}+</span>
      <span className="sl-statband-l">product teams plan their week in Slate</span>
    </div>
  )
}

function Testimonials() {
  const loop = [...QUOTES, ...QUOTES]
  return (
    <section className="sl-quotes">
      <StatBand />
      <div className="sl-marquee">
        <div className="sl-marquee-track">
          {loop.map((t, i) => (
            <figure className="sl-quote" key={i}>
              <blockquote>{t.q}</blockquote>
              <figcaption>
                <Avatar name={t.who} hue={t.hue} size={30} />
                <span>
                  <span className="sl-quote-who">{t.who}</span>
                  <span className="sl-quote-role">{t.role}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}

const TRUST = [
  { h: "SOC 2 Type II", p: "Audited annually, report available under NDA." },
  { h: "99.98% uptime", p: "Measured over the last twelve months, status page public." },
  { h: "Encrypted throughout", p: "TLS in transit, AES-256 at rest, on every plan." },
  { h: "SSO and SCIM", p: "SAML sign-in and directory sync on the team plan." },
]

function Trust() {
  return (
    <section className="sl-trust" id="trust">
      <div className="sl-trust-grid">
        {TRUST.map((t) => (
          <div className="sl-trust-item" key={t.h}>
            <h3 className="sl-trust-h">{t.h}</h3>
            <p>{t.p}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function FinalCTA() {
  return (
    <section className="sl-final" id="start">
      <div className="sl-final-glow" aria-hidden="true" />
      <div className="sl-final-inner">
        <h2 className="sl-final-title">Get your team on the same page</h2>
        <p className="sl-final-lede">
          Start free with your whole team today. Move a project over in an afternoon and see how much
          quieter the week gets.
        </p>
        <div className="sl-hero-actions">
          <a className="sl-btn" href="#start">Start building</a>
          <a className="sl-ghost" href="#product">Talk to us</a>
        </div>
        <p className="sl-hero-note">Free for teams up to ten. No card to start.</p>
      </div>
    </section>
  )
}

export default function Slate() {
  const [scrolled, setScrolled] = useState(false)
  const [word, setWord] = useState(0)
  const [agentPhase, setAgentPhase] = useState(0)

  const appRef = useRef<HTMLDivElement>(null)
  const cursorRef = useRef<HTMLDivElement>(null)

  // nav shade on scroll + cycling hero verb + agent status walk
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    let raf = 0
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        setScrolled(window.scrollY > 8)
        raf = 0
      })
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()

    let wordId: ReturnType<typeof setInterval> | undefined
    let agentId: ReturnType<typeof setInterval> | undefined
    if (reduced) {
      setAgentPhase(AGENT_FLOW.length - 1) // resting = resolved
    } else {
      wordId = setInterval(() => setWord((w) => (w + 1) % CYCLE_WORDS.length), 2200)
      agentId = setInterval(() => setAgentPhase((p) => (p + 1) % AGENT_FLOW.length), 2600)
    }

    return () => {
      window.removeEventListener("scroll", onScroll)
      if (raf) cancelAnimationFrame(raf)
      if (wordId) clearInterval(wordId)
      if (agentId) clearInterval(agentId)
    }
  }, [])

  // self-moving cursor over the hero app surface
  useEffect(() => {
    const cur = cursorRef.current
    const app = appRef.current
    if (!cur || !app) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      cur.style.opacity = "0"
      return
    }
    const pts = [
      [0.66, 0.16],
      [0.4, 0.52],
      [0.72, 0.6],
      [0.52, 0.78],
      [0.66, 0.16],
    ]
    const seg = 1700
    const pause = 520
    const step = seg + pause
    const cycle = pts.length - 1
    const start = performance.now()
    const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2)
    let raf = 0
    const loop = (now: number) => {
      const rect = app.getBoundingClientRect()
      let e = (now - start) % (cycle * step)
      let i = 0
      while (e > step) {
        e -= step
        i++
      }
      const localT = Math.min(1, e / seg)
      const a = pts[i]
      const b = pts[i + 1]
      const k = ease(localT)
      const x = (a[0] + (b[0] - a[0]) * k) * rect.width
      const y = (a[1] + (b[1] - a[1]) * k) * rect.height
      cur.style.transform = `translate3d(${x}px, ${y}px, 0)`
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  const agentStatus = AGENT_FLOW[agentPhase]
  const agentWorking = agentStatus === "inprogress" || agentStatus === "inreview"

  return (
    <div className="slate-root">
      <style>{css}</style>

      <header className={`sl-nav ${scrolled ? "is-scrolled" : ""}`}>
        <a className="sl-brand" href="#top">
          <span className="sl-brand-mark" aria-hidden="true" />
          Slate
        </a>
        <nav className="sl-nav-links">
          <a href="#product">Product</a>
          <a href="#features">Features</a>
          <a href="#changelog">Changelog</a>
          <a href="#pricing">Pricing</a>
        </nav>
        <div className="sl-nav-cta">
          <a href="#app" className="sl-ghost sl-ghost-sm">
            Log in
          </a>
          <a href="#start" className="sl-btn sl-btn-sm">
            Start building
          </a>
        </div>
      </header>

      {/* HERO — copy over a large, self-driving product surface */}
      <section className="sl-hero" id="top">
        <div className="sl-hero-glow" aria-hidden="true" />
        <div className="sl-hero-grid" aria-hidden="true" />

        <div className="sl-hero-copy">
          <span className="sl-pill">
            <span className="sl-pill-dot" aria-hidden="true" />
            Slate Agents is live
          </span>
          <h1 className="sl-title">
            The fastest way to{" "}
            <span className="sl-flip-wrap">
              <span className="sl-flip" key={word}>
                {CYCLE_WORDS[word]}
              </span>
            </span>{" "}
            software.
          </h1>
          <p className="sl-lede">
            Slate is the issue tracker and planner built for how fast good teams actually move.
            Keyboard-first, real-time to the millisecond, and quietly automated so you spend the day
            building instead of updating tickets.
          </p>
          <div className="sl-hero-actions">
            <a className="sl-btn" href="#start">
              Start building
            </a>
            <a className="sl-ghost" href="#app">
              Open app
            </a>
          </div>
          <p className="sl-hero-note">Free for small teams. No card to start.</p>
        </div>

        {/* the live, DOM-built app surface */}
        <div className="sl-app" id="app" ref={appRef}>
          <div className="sl-app-cursor" ref={cursorRef} aria-hidden="true">
            <svg viewBox="0 0 20 20" width="18" height="18">
              <path
                d="M2 2 L2 15 L6 11.5 L8.5 17 L11 16 L8.5 10.5 L14 10.5 Z"
                fill="#fff"
                stroke="rgba(0,0,0,0.35)"
                strokeWidth="1"
              />
            </svg>
            <span className="sl-app-cursor-tag">Agent</span>
          </div>

          <aside className="sl-side">
            <div className="sl-ws">
              <span className="sl-ws-mark" aria-hidden="true" />
              <span className="sl-ws-name">Northwind</span>
              <svg className="sl-ws-caret" viewBox="0 0 12 12" width="12" height="12" aria-hidden="true">
                <path d="M3 5 L6 8 L9 5" fill="none" stroke="currentColor" strokeWidth="1.4" />
              </svg>
            </div>
            <nav className="sl-nav-list">
              <a className="sl-nav-item is-current">
                <span className="sl-ni-ico sl-ni-inbox" aria-hidden="true" />
                Inbox
                <span className="sl-ni-count">3</span>
              </a>
              <a className="sl-nav-item">
                <span className="sl-ni-ico sl-ni-mine" aria-hidden="true" />
                My issues
              </a>
              <a className="sl-nav-item">
                <span className="sl-ni-ico sl-ni-views" aria-hidden="true" />
                Views
              </a>
            </nav>
            <div className="sl-side-group">
              <span className="sl-side-label">Teams</span>
              <a className="sl-team is-current">
                <span className="sl-team-dot" style={{ background: "var(--blue)" }} aria-hidden="true" />
                Core
              </a>
              <a className="sl-team">
                <span className="sl-team-dot" style={{ background: "var(--violet)" }} aria-hidden="true" />
                Web
              </a>
              <a className="sl-team">
                <span className="sl-team-dot" style={{ background: "var(--ok)" }} aria-hidden="true" />
                Mobile
              </a>
            </div>
          </aside>

          <div className="sl-main">
            <div className="sl-main-top">
              <div className="sl-view-title">
                Active issues
                <span className="sl-view-count">{HERO_ISSUES.length}</span>
              </div>
              <div className="sl-main-tools">
                <span className="sl-live" aria-hidden="true">
                  <span className="sl-live-dot" />
                  Live
                </span>
                <span className="sl-chip">Priority</span>
                <span className="sl-chip">Assignee</span>
              </div>
            </div>
            <ul className="sl-issues">
              {HERO_ISSUES.map((it) => {
                const isAgent = it.id === AGENT_ROW
                const status = isAgent ? agentStatus : it.status
                const active = isAgent && agentWorking
                return (
                  <li key={it.id} className={`sl-issue ${active ? "is-active" : ""}`}>
                    <PriorityIcon level={it.priority} />
                    <StatusDot s={status} />
                    <span className="sl-issue-id">{it.id}</span>
                    <span className="sl-issue-title">{it.title}</span>
                    {isAgent && agentWorking && <span className="sl-agent-chip">Agent</span>}
                    {it.label && <span className={`sl-tag sl-tag-${it.label.tone}`}>{it.label.text}</span>}
                    <span className="sl-issue-status">{STATUS_LABEL[status]}</span>
                    <Avatar name={isAgent ? it.who : it.who} hue={it.hue} />
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </section>

      <LogoStrip />
      <Pillars />

      <div className="sl-feats" id="features">
        {FEATURES.map((f) => (
          <FeatureSection f={f} key={f.id} />
        ))}
      </div>

      <Changelog />
      <Testimonials />
      <Trust />
      <FinalCTA />

      <footer className="sl-footer" id="pricing">
        <div className="sl-foot-top">
          <div className="sl-foot-brand">
            <a className="sl-brand" href="#top">
              <span className="sl-brand-mark" aria-hidden="true" />
              Slate
            </a>
            <p className="sl-foot-tag">The planner your team stops noticing, because it keeps up.</p>
          </div>
          <div className="sl-foot-cols">
            <div className="sl-foot-col">
              <span className="sl-foot-h">Product</span>
              <a href="#product">Issues</a>
              <a href="#features">Roadmaps</a>
              <a href="#features">Reviews</a>
              <a href="#app">Agents</a>
            </div>
            <div className="sl-foot-col">
              <span className="sl-foot-h">Company</span>
              <a href="#top">About</a>
              <a href="#changelog">Changelog</a>
              <a href="#top">Careers</a>
              <a href="#top">Blog</a>
            </div>
            <div className="sl-foot-col">
              <span className="sl-foot-h">Resources</span>
              <a href="#top">Docs</a>
              <a href="#top">API</a>
              <a href="#top">Guides</a>
              <a href="#top">Status</a>
            </div>
            <div className="sl-foot-col">
              <span className="sl-foot-h">Legal</span>
              <a href="#top">Privacy</a>
              <a href="#top">Terms</a>
              <a href="#trust">Security</a>
              <a href="#trust">DPA</a>
            </div>
          </div>
        </div>
        <div className="sl-foot-fine">
          <span>Slate Labs, Inc.</span>
          <span>Made for teams who would rather be building.</span>
        </div>
      </footer>
    </div>
  )
}

const css = `
.slate-root {
  --bg: #0b0d10;
  --bg-2: #0e1116;
  --panel: #14171c;
  --panel-2: #191d24;
  --raise: #1e232b;
  --frost: #e6e9ef;
  --muted: #8b93a3;
  --dim: #5c6472;
  --blue: #5b8def;
  --blue-2: #7aa2f2;
  --violet: #9b8cf0;
  --line: rgba(255, 255, 255, 0.08);
  --line-2: rgba(255, 255, 255, 0.05);
  --ok: #4ea373;
  --warn: #d9a441;
  --urgent: #e5687a;
  --radius: 14px;
  background: var(--bg);
  color: var(--frost);
  font-family: var(--font-geist), system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
  line-height: 1.6;
  overflow-x: hidden;
}
.slate-root *,
.slate-root *::before,
.slate-root *::after { box-sizing: border-box; }
.slate-root a { color: inherit; text-decoration: none; }
.slate-root :focus-visible {
  outline: 2px solid var(--blue);
  outline-offset: 2px;
  border-radius: 4px;
}

/* shared buttons */
.sl-btn {
  display: inline-flex; align-items: center; justify-content: center;
  background: var(--blue); color: #05070c; font-weight: 600; font-size: 0.95rem;
  padding: 0.7rem 1.25rem; border-radius: 9px; border: 1px solid transparent;
  transition: transform 0.35s cubic-bezier(0.16,1,0.3,1), box-shadow 0.35s, background 0.2s;
}
.sl-btn:hover { transform: translateY(-2px); box-shadow: 0 14px 34px -14px rgba(91,141,239,0.7); background: var(--blue-2); }
.sl-btn-sm { padding: 0.5rem 0.9rem; font-size: 0.88rem; border-radius: 8px; }
.sl-ghost {
  display: inline-flex; align-items: center; justify-content: center;
  color: var(--frost); font-weight: 500; font-size: 0.95rem;
  padding: 0.7rem 1.2rem; border-radius: 9px; border: 1px solid var(--line);
  background: rgba(255,255,255,0.02); transition: border-color 0.3s, background 0.3s, transform 0.35s;
}
.sl-ghost:hover { border-color: rgba(255,255,255,0.2); background: rgba(255,255,255,0.05); transform: translateY(-2px); }
.sl-ghost-sm { padding: 0.5rem 0.85rem; font-size: 0.88rem; border-radius: 8px; }

.sl-brand {
  display: inline-flex; align-items: center; gap: 0.5rem;
  font-weight: 600; font-size: 1.12rem; letter-spacing: -0.02em; color: var(--frost);
}
.sl-brand-mark {
  width: 18px; height: 18px; border-radius: 6px;
  background: linear-gradient(150deg, var(--blue), var(--violet));
  box-shadow: inset 0 0 0 1px rgba(255,255,255,0.14);
}

/* NAV */
.sl-nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 60;
  display: flex; align-items: center; justify-content: space-between; gap: 1.5rem;
  padding: 0.95rem clamp(1.1rem, 4vw, 2.6rem);
  border-bottom: 1px solid transparent; transition: background 0.3s, border-color 0.3s;
}
.sl-nav.is-scrolled { background: rgba(11,13,16,0.92); border-bottom-color: var(--line); }
.sl-nav-links { display: flex; align-items: center; gap: clamp(1rem, 2.4vw, 2rem); }
.sl-nav-links a { color: var(--muted); font-size: 0.92rem; transition: color 0.25s; }
.sl-nav-links a:hover { color: var(--frost); }
.sl-nav-cta { display: flex; align-items: center; gap: 0.6rem; }
@media (max-width: 860px) { .sl-nav-links { display: none; } }
@media (max-width: 560px) { .sl-nav-cta .sl-ghost-sm { display: none; } }

/* HERO */
.sl-hero { position: relative; padding: clamp(6.5rem, 12vw, 9rem) clamp(1.1rem, 4vw, 2.6rem) clamp(3rem, 6vw, 5rem); overflow: hidden; }
.sl-hero-glow {
  position: absolute; top: -12%; left: 50%; transform: translateX(-50%);
  width: min(1100px, 120vw); height: 620px; pointer-events: none;
  background:
    radial-gradient(closest-side, rgba(91,141,239,0.16), transparent 70%),
    radial-gradient(closest-side, rgba(155,124,240,0.12), transparent 72%);
  background-position: 30% 20%, 72% 30%; background-repeat: no-repeat;
  background-size: 70% 90%, 60% 80%;
}
.sl-hero-grid {
  position: absolute; inset: 0; pointer-events: none; opacity: 0.5;
  background-image:
    linear-gradient(var(--line-2) 1px, transparent 1px),
    linear-gradient(90deg, var(--line-2) 1px, transparent 1px);
  background-size: 44px 44px;
  -webkit-mask-image: radial-gradient(ellipse 80% 60% at 50% 8%, #000 25%, transparent 75%);
          mask-image: radial-gradient(ellipse 80% 60% at 50% 8%, #000 25%, transparent 75%);
}
.sl-hero-copy { position: relative; max-width: 44rem; margin: 0 auto; text-align: center; }
.sl-pill {
  display: inline-flex; align-items: center; gap: 0.5rem;
  padding: 0.34rem 0.75rem 0.34rem 0.6rem; border-radius: 999px;
  border: 1px solid var(--line); background: rgba(255,255,255,0.03);
  color: var(--muted); font-size: 0.82rem;
}
.sl-pill-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--blue); box-shadow: 0 0 0 4px rgba(91,141,239,0.18); }
.sl-title {
  font-size: clamp(2.5rem, 6.4vw, 4.7rem); line-height: 1.02; letter-spacing: -0.035em;
  font-weight: 600; margin: 1.3rem 0 0;
}
.sl-flip-wrap {
  display: inline-flex; overflow: hidden; vertical-align: bottom;
  color: var(--blue-2);
}
.sl-flip { display: inline-block; animation: slFlip 0.5s cubic-bezier(0.16,1,0.3,1); }
@keyframes slFlip { from { transform: translateY(0.9em); opacity: 0; } to { transform: none; opacity: 1; } }
.sl-lede {
  color: var(--muted); font-size: clamp(1.02rem, 1.5vw, 1.22rem);
  max-width: 36rem; margin: 1.35rem auto 0;
}
.sl-hero-actions { display: flex; align-items: center; justify-content: center; gap: 0.75rem; margin-top: 1.9rem; flex-wrap: wrap; }
.sl-hero-note { color: var(--dim); font-size: 0.85rem; margin: 1rem 0 0; }

/* APP SURFACE */
.sl-app {
  position: relative; max-width: 1080px; margin: clamp(2.6rem, 6vw, 4.5rem) auto 0;
  display: grid; grid-template-columns: 216px 1fr;
  background: var(--panel); border: 1px solid var(--line); border-radius: 16px;
  overflow: hidden; min-height: 430px;
  box-shadow: 0 40px 120px -50px rgba(0,0,0,0.9), 0 2px 0 0 rgba(255,255,255,0.04) inset;
}
.sl-app-cursor { position: absolute; top: 0; left: 0; z-index: 20; pointer-events: none; will-change: transform; }
.sl-app-cursor svg { display: block; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5)); }
.sl-app-cursor-tag {
  position: absolute; left: 14px; top: 16px; white-space: nowrap;
  background: var(--blue); color: #05070c; font-size: 0.66rem; font-weight: 700;
  padding: 0.1rem 0.4rem; border-radius: 5px;
}

/* sidebar */
.sl-side { border-right: 1px solid var(--line); background: var(--bg-2); padding: 0.85rem 0.7rem; display: flex; flex-direction: column; gap: 1.1rem; }
.sl-ws { display: flex; align-items: center; gap: 0.5rem; padding: 0.35rem 0.4rem; border-radius: 8px; }
.sl-ws-mark { width: 20px; height: 20px; border-radius: 6px; background: linear-gradient(150deg, var(--blue), var(--violet)); }
.sl-ws-name { font-weight: 600; font-size: 0.9rem; }
.sl-ws-caret { color: var(--dim); margin-left: auto; }
.sl-nav-list { display: flex; flex-direction: column; gap: 0.1rem; }
.sl-nav-item { display: flex; align-items: center; gap: 0.55rem; padding: 0.4rem 0.5rem; border-radius: 7px; color: var(--muted); font-size: 0.86rem; }
.sl-nav-item.is-current { background: rgba(255,255,255,0.05); color: var(--frost); }
.sl-ni-count { margin-left: auto; font-size: 0.72rem; color: var(--dim); background: rgba(255,255,255,0.06); padding: 0.02rem 0.35rem; border-radius: 5px; }
.sl-ni-ico { width: 15px; height: 15px; border-radius: 4px; border: 1.4px solid currentColor; opacity: 0.8; }
.sl-ni-inbox { border-radius: 4px; }
.sl-ni-mine { border-radius: 50%; }
.sl-ni-views { border-radius: 3px; border-style: dashed; }
.sl-side-group { display: flex; flex-direction: column; gap: 0.1rem; }
.sl-side-label { font-size: 0.72rem; color: var(--dim); padding: 0.2rem 0.5rem 0.4rem; }
.sl-team { display: flex; align-items: center; gap: 0.55rem; padding: 0.35rem 0.5rem; border-radius: 7px; color: var(--muted); font-size: 0.85rem; }
.sl-team.is-current { color: var(--frost); }
.sl-team-dot { width: 8px; height: 8px; border-radius: 3px; }

/* main */
.sl-main { min-width: 0; }
.sl-main-top { display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding: 0.85rem 1.1rem; border-bottom: 1px solid var(--line); }
.sl-view-title { display: flex; align-items: center; gap: 0.55rem; font-weight: 600; font-size: 0.95rem; }
.sl-view-count { font-size: 0.75rem; color: var(--dim); background: rgba(255,255,255,0.06); padding: 0.05rem 0.4rem; border-radius: 6px; }
.sl-main-tools { display: flex; align-items: center; gap: 0.5rem; }
.sl-live { display: inline-flex; align-items: center; gap: 0.4rem; font-size: 0.76rem; color: var(--ok); }
.sl-live-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--ok); box-shadow: 0 0 0 0 rgba(78,163,115,0.5); animation: slPulse 2.4s ease-out infinite; }
@keyframes slPulse { 0% { box-shadow: 0 0 0 0 rgba(78,163,115,0.5); } 70% { box-shadow: 0 0 0 7px rgba(78,163,115,0); } 100% { box-shadow: 0 0 0 0 rgba(78,163,115,0); } }
.sl-chip { font-size: 0.76rem; color: var(--muted); border: 1px solid var(--line); padding: 0.2rem 0.55rem; border-radius: 7px; }
@media (max-width: 640px) { .sl-chip { display: none; } }

.sl-issues { list-style: none; margin: 0; padding: 0; }
.sl-issue {
  display: flex; align-items: center; gap: 0.7rem; padding: 0.66rem 1.1rem;
  border-bottom: 1px solid var(--line-2); transition: background 0.3s;
}
.sl-issue:hover { background: rgba(255,255,255,0.02); }
.sl-issue.is-active { background: rgba(91,141,239,0.08); box-shadow: inset 2px 0 0 0 var(--blue); }
.sl-issue-id { font-family: var(--font-geist-mono), ui-monospace, monospace; font-size: 0.76rem; color: var(--dim); flex: 0 0 auto; width: 3.6rem; }
.sl-issue-title { font-size: 0.88rem; color: var(--frost); flex: 1 1 auto; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.sl-issue-status { font-size: 0.76rem; color: var(--muted); flex: 0 0 auto; width: 5.5rem; text-align: right; }
@media (max-width: 720px) { .sl-issue-status { display: none; } }

.sl-agent-chip {
  font-size: 0.68rem; font-weight: 600; color: var(--blue-2); flex: 0 0 auto;
  background: rgba(91,141,239,0.14); border: 1px solid rgba(91,141,239,0.3);
  padding: 0.08rem 0.4rem; border-radius: 6px; animation: slFadeIn 0.4s ease;
}
@keyframes slFadeIn { from { opacity: 0; transform: translateY(-2px); } to { opacity: 1; transform: none; } }
.sl-tag { font-size: 0.7rem; flex: 0 0 auto; padding: 0.08rem 0.45rem; border-radius: 6px; border: 1px solid var(--line); }
.sl-tag-blue { color: var(--blue-2); border-color: rgba(91,141,239,0.3); }
.sl-tag-violet { color: var(--violet); border-color: rgba(155,124,240,0.3); }
.sl-tag-green { color: var(--ok); border-color: rgba(78,163,115,0.3); }
.sl-tag-amber { color: var(--warn); border-color: rgba(217,164,65,0.3); }
@media (max-width: 720px) { .sl-tag { display: none; } }

.sl-ava { display: inline-flex; align-items: center; justify-content: center; border-radius: 50%; font-weight: 600; flex: 0 0 auto; }

/* status dots */
.sl-sd { width: 13px; height: 13px; border-radius: 50%; flex: 0 0 auto; box-sizing: border-box; }
.sl-sd-backlog { border: 1.6px dashed var(--dim); }
.sl-sd-todo { border: 1.6px solid var(--muted); }
.sl-sd-inprogress { border: 1.6px solid var(--warn); background: conic-gradient(var(--warn) 55%, transparent 0); }
.sl-sd-inreview { border: 1.6px solid var(--blue); background: conic-gradient(var(--blue) 82%, transparent 0); }
.sl-sd-done { background: var(--ok); border: 1.6px solid var(--ok); }

/* priority */
.sl-pri { display: inline-flex; align-items: flex-end; gap: 2px; height: 13px; flex: 0 0 auto; width: 13px; justify-content: center; }
.sl-pri i { width: 3px; background: var(--dim); border-radius: 1px; opacity: 0.55; }
.sl-pri i:nth-child(1) { height: 5px; }
.sl-pri i:nth-child(2) { height: 8px; }
.sl-pri i:nth-child(3) { height: 11px; }
.sl-pri i.on { background: var(--muted); opacity: 1; }
.sl-pri-urgent { width: 13px; height: 13px; border-radius: 3px; background: var(--urgent); box-shadow: 0 0 0 3px rgba(229,104,122,0.16); }

@media (max-width: 720px) {
  .sl-app { grid-template-columns: 1fr; }
  .sl-side { display: none; }
}

/* honour reduced motion everywhere as a safety net */
@media (prefers-reduced-motion: reduce) {
  .slate-root *, .slate-root *::before, .slate-root *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
    scroll-behavior: auto !important;
  }
}

/* LOGO STRIP */
.sl-logos { max-width: 1080px; margin: 0 auto; padding: clamp(3.5rem, 7vw, 6rem) clamp(1.1rem, 4vw, 2.6rem) clamp(1rem, 3vw, 2rem); text-align: center; }
.sl-logos-cap { color: var(--dim); font-size: 0.9rem; margin: 0 0 1.8rem; }
.sl-logos-row { display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: clamp(1.4rem, 4vw, 3.2rem); }
.sl-logo {
  display: inline-flex; align-items: center; gap: 0.5rem;
  font-size: 1.12rem; font-weight: 600; letter-spacing: -0.02em;
  color: var(--muted); opacity: 0.5; filter: grayscale(1);
  transition: opacity 0.3s, color 0.3s, filter 0.3s;
}
.sl-logo:hover { opacity: 1; color: var(--frost); filter: none; }
.sl-logo-mark { width: 15px; height: 15px; border-radius: 5px; border: 2px solid currentColor; }
.sl-logo:nth-child(2) .sl-logo-mark { border-radius: 50%; }
.sl-logo:nth-child(3) .sl-logo-mark { transform: rotate(45deg); border-radius: 3px; }
.sl-logo:nth-child(5) .sl-logo-mark { border-radius: 50% 50% 50% 3px; }
.sl-logo:nth-child(6) .sl-logo-mark { border-style: dashed; }

/* SECTION SCAFFOLD */
.sl-sec { max-width: 1080px; margin: 0 auto; padding: clamp(4rem, 9vw, 7.5rem) clamp(1.1rem, 4vw, 2.6rem); }
.sl-sec-head { max-width: 40rem; margin: 0 0 clamp(2.2rem, 5vw, 3.4rem); }
.sl-h2 { font-size: clamp(1.9rem, 4vw, 3rem); line-height: 1.05; letter-spacing: -0.03em; font-weight: 600; margin: 0; }
.sl-sec-lede { color: var(--muted); font-size: clamp(1rem, 1.4vw, 1.15rem); margin: 1rem 0 0; }

/* BENTO */
.sl-bento { display: grid; grid-template-columns: 1.55fr 1fr; grid-auto-rows: 1fr; gap: 1rem; }
.sl-tile {
  background: var(--panel); border: 1px solid var(--line); border-radius: var(--radius);
  padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem;
  opacity: 0; transform: translateY(20px);
  transition: opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1), border-color 0.3s;
}
.sl-tile.is-shown { opacity: 1; transform: none; }
.sl-tile:hover { border-color: rgba(255,255,255,0.16); }
.sl-tile-lg { grid-row: span 2; justify-content: space-between; }
.sl-tile-top { display: flex; flex-direction: column; gap: 0.7rem; }
.sl-tile-h { font-size: 1.2rem; font-weight: 600; letter-spacing: -0.01em; margin: 0; }
.sl-tile-p { color: var(--muted); font-size: 0.92rem; margin: 0; }

.sl-spark-wrap { margin-top: auto; }
.sl-spark { display: block; width: 100%; height: 96px; }
.sl-spark-line { transition: stroke-dashoffset 1.7s cubic-bezier(0.4,0,0.2,1); }
.sl-spark-area { transition: opacity 1s ease 0.5s; }
.sl-spark-tip { transition: opacity 0.4s ease 1.5s; }
.sl-spark-cap { display: block; color: var(--dim); font-size: 0.78rem; margin-top: 0.5rem; }

.sl-stat { display: flex; flex-direction: column; gap: 0.15rem; }
.sl-stat-n { font-size: clamp(2.2rem, 4vw, 2.8rem); font-weight: 600; letter-spacing: -0.03em; font-variant-numeric: tabular-nums; line-height: 1; }
.sl-stat-l { color: var(--muted); font-size: 0.85rem; }

.sl-toggle { display: flex; flex-direction: column; gap: 0.6rem; margin-top: auto; }
.sl-toggle-row { display: flex; align-items: center; gap: 0.6rem; padding: 0.6rem 0.7rem; background: var(--bg-2); border: 1px solid var(--line); border-radius: 9px; }
.sl-toggle-box {
  width: 17px; height: 17px; border-radius: 5px; border: 1.6px solid var(--dim); color: transparent;
  display: inline-flex; align-items: center; justify-content: center; flex: 0 0 auto;
  transition: background 0.3s, border-color 0.3s, color 0.3s;
}
.sl-toggle-row.is-done .sl-toggle-box { background: var(--ok); border-color: var(--ok); color: #05070c; }
.sl-toggle-label { font-size: 0.85rem; transition: color 0.3s; }
.sl-toggle-row.is-done .sl-toggle-label { color: var(--dim); text-decoration: line-through; }
.sl-keys { display: flex; align-items: center; gap: 0.5rem; color: var(--dim); font-size: 0.78rem; }
.sl-keys kbd {
  font-family: var(--font-geist-mono), ui-monospace, monospace; font-size: 0.72rem;
  background: var(--raise); border: 1px solid var(--line); border-bottom-width: 2px;
  border-radius: 5px; padding: 0.05rem 0.4rem; color: var(--frost);
}
@media (max-width: 720px) { .sl-bento { grid-template-columns: 1fr; } .sl-tile-lg { grid-row: auto; } }

/* FEATURE SECTIONS */
.sl-feats { border-top: 1px solid var(--line); }
.sl-feat {
  max-width: 1080px; margin: 0 auto; padding: clamp(4rem, 9vw, 7rem) clamp(1.1rem, 4vw, 2.6rem);
  display: grid; grid-template-columns: 0.9fr 1.1fr; gap: clamp(2rem, 5vw, 4rem); align-items: center;
}
.sl-feat.is-flip .sl-feat-copy { order: 2; }
.sl-kicker { display: inline-block; color: var(--blue-2); font-size: 0.9rem; font-weight: 500; margin-bottom: 0.9rem; }
.sl-feat-copy { opacity: 0; transform: translateY(18px); transition: opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1); }
.sl-feat-copy.is-shown { opacity: 1; transform: none; }
.sl-feat-copy .sl-sec-lede { margin-top: 1rem; }
.sl-feat-panel-wrap { position: relative; }
.sl-feat-panel {
  position: relative; background: var(--panel); border: 1px solid var(--line); border-radius: var(--radius);
  padding: 1rem; box-shadow: 0 30px 80px -50px rgba(0,0,0,0.8);
  opacity: 0; transition: opacity 0.8s ease;
}
.sl-feat-panel.is-shown { opacity: 1; }
@media (max-width: 820px) {
  .sl-feat { grid-template-columns: 1fr; gap: 1.8rem; }
  .sl-feat.is-flip .sl-feat-copy { order: 0; }
}

/* board */
.sl-board { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.7rem; }
.sl-col { display: flex; flex-direction: column; gap: 0.55rem; }
.sl-col-head { display: flex; align-items: center; gap: 0.45rem; font-size: 0.8rem; color: var(--muted); padding: 0.1rem 0.2rem 0.4rem; }
.sl-col-n { margin-left: auto; color: var(--dim); }
.sl-bcard { background: var(--panel-2); border: 1px solid var(--line); border-radius: 9px; padding: 0.6rem 0.65rem; display: flex; flex-direction: column; gap: 0.5rem; }
.sl-bcard p { margin: 0; font-size: 0.8rem; line-height: 1.35; }
.sl-bcard-f { display: flex; align-items: center; justify-content: space-between; }
.sl-bcard.is-muted { opacity: 0.55; }
.sl-bcard.is-drag {
  border-color: rgba(91,141,239,0.55); box-shadow: 0 16px 34px -14px rgba(0,0,0,0.8);
  transform: rotate(-1.6deg) translateY(-3px); cursor: grabbing;
}
.sl-drop { height: 46px; border: 1.6px dashed var(--line); border-radius: 9px; background: rgba(91,141,239,0.05); }

/* roadmap */
.sl-road { display: flex; flex-direction: column; gap: 0.7rem; }
.sl-road-head { display: flex; align-items: center; gap: 1rem; font-size: 0.78rem; color: var(--muted); padding-left: 38%; }
.sl-road-months { display: flex; flex: 1; justify-content: space-between; }
.sl-road-body { position: relative; display: flex; flex-direction: column; gap: 0.55rem; }
.sl-road-now { position: absolute; top: -0.2rem; bottom: 0; width: 1px; background: var(--urgent); opacity: 0.6; z-index: 2; }
.sl-road-now::before { content: ""; position: absolute; top: 0; left: -3px; width: 7px; height: 7px; border-radius: 50%; background: var(--urgent); }
.sl-road-row { display: grid; grid-template-columns: 38% 1fr; align-items: center; gap: 0.6rem; }
.sl-road-label { display: flex; flex-direction: column; min-width: 0; }
.sl-road-name { font-size: 0.8rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.sl-road-team { font-size: 0.72rem; color: var(--dim); }
.sl-road-track { position: relative; height: 22px; background: var(--bg-2); border-radius: 6px; }
.sl-road-bar { position: absolute; top: 3px; bottom: 3px; border-radius: 5px; }
.sl-bar-blue { background: linear-gradient(90deg, rgba(91,141,239,0.85), rgba(91,141,239,0.5)); }
.sl-bar-violet { background: linear-gradient(90deg, rgba(155,124,240,0.85), rgba(155,124,240,0.5)); }
.sl-bar-green { background: linear-gradient(90deg, rgba(78,163,115,0.85), rgba(78,163,115,0.5)); }
.sl-bar-amber { background: linear-gradient(90deg, rgba(217,164,65,0.85), rgba(217,164,65,0.5)); }

/* diff */
.sl-diff { font-family: var(--font-geist-mono), ui-monospace, monospace; }
.sl-diff-head { display: flex; align-items: center; justify-content: space-between; padding: 0.2rem 0.5rem 0.7rem; font-size: 0.78rem; color: var(--muted); }
.sl-diff-file { color: var(--frost); }
.sl-plus { color: var(--ok); }
.sl-minus { color: var(--urgent); }
.sl-diff-body { background: var(--bg-2); border: 1px solid var(--line); border-radius: 9px; overflow: hidden; }
.sl-diff-line { display: flex; align-items: center; font-size: 0.76rem; line-height: 1.9; }
.sl-diff-line code { font-family: inherit; white-space: pre; }
.sl-diff-n { width: 2.2rem; text-align: right; padding-right: 0.7rem; color: var(--dim); flex: 0 0 auto; }
.sl-diff-sign { width: 1rem; text-align: center; flex: 0 0 auto; color: var(--dim); }
.sl-dl-add { background: rgba(78,163,115,0.12); }
.sl-dl-add code, .sl-dl-add .sl-diff-sign { color: #8fd3ac; }
.sl-dl-del { background: rgba(229,104,122,0.12); }
.sl-dl-del code, .sl-dl-del .sl-diff-sign { color: #f0a4b0; }
.sl-dl-context code { color: var(--muted); }
.sl-diff-comment { display: flex; gap: 0.6rem; margin-top: 0.8rem; font-family: var(--font-geist), sans-serif; }
.sl-diff-bubble { background: var(--panel-2); border: 1px solid var(--line); border-radius: 9px; padding: 0.55rem 0.7rem; font-size: 0.82rem; color: var(--muted); }
.sl-diff-author { display: block; color: var(--frost); font-weight: 600; font-size: 0.8rem; margin-bottom: 0.15rem; }

/* CHANGELOG */
.sl-change { border-top: 1px solid var(--line); }
.sl-change-list { display: flex; flex-direction: column; }
.sl-change-item {
  display: grid; grid-template-columns: 8rem 1fr; gap: clamp(1rem, 3vw, 2.4rem);
  padding: 1.6rem 0; border-top: 1px solid var(--line-2);
  opacity: 0; transform: translateY(16px); transition: opacity 0.6s ease, transform 0.6s cubic-bezier(0.16,1,0.3,1);
}
.sl-change-item:first-child { border-top: none; }
.sl-change-item.is-shown { opacity: 1; transform: none; }
.sl-change-meta { display: flex; flex-direction: column; gap: 0.4rem; }
.sl-change-date { color: var(--muted); font-size: 0.85rem; }
.sl-change-ver { font-family: var(--font-geist-mono), ui-monospace, monospace; font-size: 0.74rem; color: var(--blue-2); border: 1px solid rgba(91,141,239,0.3); border-radius: 6px; padding: 0.05rem 0.4rem; width: fit-content; }
.sl-change-title { font-size: 1.12rem; font-weight: 600; margin: 0 0 0.4rem; letter-spacing: -0.01em; }
.sl-change-body p { color: var(--muted); font-size: 0.95rem; margin: 0; max-width: 42rem; }
@media (max-width: 620px) { .sl-change-item { grid-template-columns: 1fr; gap: 0.6rem; } .sl-change-meta { flex-direction: row; align-items: center; } }

/* TESTIMONIALS */
.sl-quotes { padding: clamp(4rem, 8vw, 6.5rem) 0; border-top: 1px solid var(--line); overflow: hidden; }
.sl-statband { text-align: center; max-width: 1080px; margin: 0 auto clamp(2.6rem, 5vw, 3.6rem); padding: 0 clamp(1.1rem, 4vw, 2.6rem); display: flex; flex-direction: column; gap: 0.4rem; }
.sl-statband-n { font-size: clamp(2.6rem, 6vw, 4rem); font-weight: 600; letter-spacing: -0.03em; font-variant-numeric: tabular-nums; line-height: 1; }
.sl-statband-l { color: var(--muted); font-size: 1rem; }
.sl-marquee { position: relative; -webkit-mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent); mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent); }
.sl-marquee-track { display: flex; gap: 1rem; width: max-content; animation: slMarquee 48s linear infinite; }
.sl-marquee:hover .sl-marquee-track { animation-play-state: paused; }
@keyframes slMarquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
.sl-quote { flex: 0 0 clamp(20rem, 30vw, 24rem); background: var(--panel); border: 1px solid var(--line); border-radius: var(--radius); padding: 1.4rem 1.5rem; margin: 0; display: flex; flex-direction: column; justify-content: space-between; gap: 1.2rem; }
.sl-quote blockquote { margin: 0; font-size: 0.98rem; line-height: 1.55; color: var(--frost); }
.sl-quote figcaption { display: flex; align-items: center; gap: 0.65rem; }
.sl-quote-who { display: block; font-size: 0.88rem; font-weight: 600; }
.sl-quote-role { display: block; font-size: 0.8rem; color: var(--dim); }

/* TRUST */
.sl-trust { max-width: 1080px; margin: 0 auto; padding: clamp(3.5rem, 7vw, 5.5rem) clamp(1.1rem, 4vw, 2.6rem); border-top: 1px solid var(--line); }
.sl-trust-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: clamp(1.4rem, 3vw, 2.5rem); }
.sl-trust-item { display: flex; flex-direction: column; gap: 0.4rem; }
.sl-trust-h { font-size: 1.02rem; font-weight: 600; margin: 0; letter-spacing: -0.01em; }
.sl-trust-item p { color: var(--muted); font-size: 0.88rem; margin: 0; }
@media (max-width: 760px) { .sl-trust-grid { grid-template-columns: 1fr 1fr; } }
@media (max-width: 440px) { .sl-trust-grid { grid-template-columns: 1fr; } }

/* FINAL CTA */
.sl-final { position: relative; max-width: 1080px; margin: 0 auto; padding: clamp(4.5rem, 10vw, 8rem) clamp(1.1rem, 4vw, 2.6rem); text-align: center; overflow: hidden; }
.sl-final-glow { position: absolute; inset: 0; pointer-events: none; background: radial-gradient(ellipse 60% 80% at 50% 120%, rgba(91,141,239,0.2), transparent 70%); }
.sl-final-inner { position: relative; max-width: 40rem; margin: 0 auto; }
.sl-final-title { font-size: clamp(2rem, 5vw, 3.4rem); line-height: 1.04; letter-spacing: -0.03em; font-weight: 600; margin: 0; }
.sl-final-lede { color: var(--muted); font-size: clamp(1rem, 1.5vw, 1.18rem); margin: 1.2rem auto 2rem; max-width: 34rem; }
.sl-final .sl-hero-actions { justify-content: center; }

/* FOOTER */
.sl-footer { border-top: 1px solid var(--line); background: var(--bg-2); padding: clamp(3rem, 6vw, 4.5rem) clamp(1.1rem, 4vw, 2.6rem) 2.2rem; }
.sl-foot-top { max-width: 1080px; margin: 0 auto; display: grid; grid-template-columns: 1.4fr 2fr; gap: clamp(2rem, 5vw, 4rem); }
.sl-foot-brand .sl-brand { margin-bottom: 0.9rem; }
.sl-foot-tag { color: var(--muted); font-size: 0.92rem; max-width: 20rem; margin: 0; }
.sl-foot-cols { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; }
.sl-foot-col { display: flex; flex-direction: column; gap: 0.6rem; }
.sl-foot-h { font-size: 0.82rem; color: var(--frost); font-weight: 600; margin-bottom: 0.15rem; }
.sl-foot-col a { color: var(--muted); font-size: 0.88rem; transition: color 0.25s; }
.sl-foot-col a:hover { color: var(--frost); }
.sl-foot-fine { max-width: 1080px; margin: clamp(2.5rem, 5vw, 3.5rem) auto 0; padding-top: 1.5rem; border-top: 1px solid var(--line-2); display: flex; justify-content: space-between; gap: 1rem; flex-wrap: wrap; color: var(--dim); font-size: 0.82rem; }
@media (max-width: 760px) { .sl-foot-top { grid-template-columns: 1fr; gap: 2rem; } .sl-foot-cols { grid-template-columns: 1fr 1fr; } }

/* @@APPEND@@ */
`
