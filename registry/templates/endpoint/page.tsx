"use client"

import { useEffect, useRef, useState } from "react"

/**
 * Endpoint — an API-first developer landing page where the code IS the marketing.
 *
 * Deliberate against the usual tells: the base is a true deep blue-black (not a
 * brown-tinted fake black), there is exactly ONE blue accent, and monospace is used
 * only where there is actual code, terminal, or API surface — never as decorative
 * chrome on prose labels. No tracked all-caps eyebrows, no middle-dot metas, no
 * em-dash fragment labels, no arrow-suffixed links, no glassmorphism. The one bold
 * move is the live multi-SDK code hero with a streaming HTTP response; the rest is
 * quiet. All motion is real, and every bit of it is gated on prefers-reduced-motion.
 *
 * Syntax highlighting is hand-tokenised: each snippet is an array of lines, each line
 * an array of [text, class] tokens. Nothing is parsed at runtime and no code sample
 * lives inside the CSS template literal.
 */

type Tok = [string, string]
type Line = Tok[]

const SDK_TABS: { id: string; label: string; lines: Line[] }[] = [
  {
    id: "node",
    label: "Node",
    lines: [
      [["import", "k"], [" { Endpoint } ", ""], ["from", "k"], [" ", ""], ["\"endpoint\"", "s"], [";", "o"]],
      [],
      [["const", "k"], [" endpoint ", ""], ["=", "o"], [" ", ""], ["new", "k"], [" ", ""], ["Endpoint", "f"], ["(", ""], ["process", ""], [".", "o"], ["env", ""], [".", "o"], ["EP_KEY", "y"], [")", ""], [";", "o"]],
      [],
      [["const", "k"], [" { id } ", ""], ["=", "o"], [" ", ""], ["await", "k"], [" endpoint", ""], [".", "o"], ["emails", ""], [".", "o"], ["send", "f"], ["({", ""]],
      [["  from", "y"], [": ", "o"], ["\"ci@acme.dev\"", "s"], [",", "o"]],
      [["  to", "y"], [": ", "o"], ["\"dev@example.com\"", "s"], [",", "o"]],
      [["  subject", "y"], [": ", "o"], ["\"Your build passed\"", "s"], [",", "o"]],
      [["  html", "y"], [": ", "o"], ["\"<b>All 214 checks green.</b>\"", "s"], [",", "o"]],
      [["});", "o"]],
    ],
  },
  {
    id: "python",
    label: "Python",
    lines: [
      [["import", "k"], [" endpoint", ""]],
      [],
      [["client ", ""], ["=", "o"], [" endpoint", ""], [".", "o"], ["Client", "f"], ["(os", ""], [".", "o"], ["environ", ""], ["[", ""], ["\"EP_KEY\"", "s"], ["])", ""]],
      [],
      [["email ", ""], ["=", "o"], [" client", ""], [".", "o"], ["emails", ""], [".", "o"], ["send", "f"], ["(", ""]],
      [["    from_", "y"], ["=", "o"], ["\"ci@acme.dev\"", "s"], [",", "o"]],
      [["    to", "y"], ["=", "o"], ["\"dev@example.com\"", "s"], [",", "o"]],
      [["    subject", "y"], ["=", "o"], ["\"Your build passed\"", "s"], [",", "o"]],
      [["    html", "y"], ["=", "o"], ["\"<b>All 214 checks green.</b>\"", "s"], [",", "o"]],
      [[")", ""]],
    ],
  },
  {
    id: "ruby",
    label: "Ruby",
    lines: [
      [["require", "k"], [" ", ""], ["\"endpoint\"", "s"]],
      [],
      [["client ", ""], ["=", "o"], [" Endpoint", "f"], ["::", "o"], ["Client", ""], [".", "o"], ["new", "f"], ["(ENV", ""], ["[", ""], ["\"EP_KEY\"", "s"], ["])", ""]],
      [],
      [["email ", ""], ["=", "o"], [" client", ""], [".", "o"], ["emails", ""], [".", "o"], ["send", "f"], ["(", ""]],
      [["  from", "y"], [": ", "o"], ["\"ci@acme.dev\"", "s"], [",", "o"]],
      [["  to", "y"], [": ", "o"], ["\"dev@example.com\"", "s"], [",", "o"]],
      [["  subject", "y"], [": ", "o"], ["\"Your build passed\"", "s"], [",", "o"]],
      [["  html", "y"], [": ", "o"], ["\"<b>All 214 checks green.</b>\"", "s"]],
      [[")", ""]],
    ],
  },
  {
    id: "curl",
    label: "curl",
    lines: [
      [["curl", "f"], [" https://api.endpoint.dev/v1/emails ", ""], ["\\", "o"]],
      [["  -H", "y"], [" ", ""], ["\"Authorization: Bearer $EP_KEY\"", "s"], [" ", ""], ["\\", "o"]],
      [["  -H", "y"], [" ", ""], ["\"Content-Type: application/json\"", "s"], [" ", ""], ["\\", "o"]],
      [["  -d", "y"], [" ", ""], ["'{", "s"]],
      [["    ", ""], ["\"from\"", "y"], [": ", "o"], ["\"ci@acme.dev\"", "s"], [",", "o"]],
      [["    ", ""], ["\"to\"", "y"], [": ", "o"], ["\"dev@example.com\"", "s"], [",", "o"]],
      [["    ", ""], ["\"subject\"", "y"], [": ", "o"], ["\"Your build passed\"", "s"]],
      [["  }'", "s"]],
    ],
  },
]

const RESPONSE_LINES: Line[] = [
  [["$", "o"], [" ", ""], ["endpoint", "f"], [" emails send ", ""], ["--to", "y"], [" dev@example.com", ""]],
  [],
  [["<", "o"], [" HTTP/2 ", ""], ["200", "n"], [" OK", ""]],
  [["<", "o"], [" x-request-id: ", ""], ["req_5b1e9c2a", "s"]],
  [],
  [["{", "o"]],
  [["  ", ""], ["\"id\"", "y"], [": ", "o"], ["\"em_9f2c4a7d\"", "s"], [",", "o"]],
  [["  ", ""], ["\"object\"", "y"], [": ", "o"], ["\"email\"", "s"], [",", "o"]],
  [["  ", ""], ["\"status\"", "y"], [": ", "o"], ["\"delivered\"", "s"], [",", "o"]],
  [["  ", ""], ["\"to\"", "y"], [": ", "o"], ["\"dev@example.com\"", "s"], [",", "o"]],
  [["  ", ""], ["\"created_at\"", "y"], [": ", "o"], ["\"2026-09-20T18:04:11Z\"", "s"], [",", "o"]],
  [["  ", ""], ["\"latency_ms\"", "y"], [": ", "o"], ["38", "n"]],
  [["}", "o"]],
]

const CAPS = [
  {
    title: "Idempotency, on by default",
    body: "Every write takes an idempotency key. Retry a timed-out request as many times as you like — it resolves to one send, never two.",
    stat: "0",
    statSuffix: "",
    proof: "duplicate sends across 2.1B messages",
    by: "Groundwork",
  },
  {
    title: "Webhooks that survive",
    body: "Signed events, exponential backoff for three days, and one-click replay from the dashboard. Your consumer can go down without losing a thing.",
    stat: "99.998",
    statSuffix: "%",
    proof: "webhook delivery over 90 days",
    by: "Cadence",
  },
  {
    title: "A sandbox that mirrors prod",
    body: "Test keys, seeded data, and the same latency profile as live. What passes in test behaves identically the moment you flip to production.",
    stat: "2",
    statSuffix: " days",
    proof: "from first call to shipped, not two sprints",
    by: "Northwind",
  },
  {
    title: "Logs you can actually read",
    body: "Thirty days of full request and response bodies, a copyable curl to reproduce any call, and latency traces down to the millisecond.",
    stat: "74",
    statSuffix: "%",
    proof: "drop in mean time to debug",
    by: "Fathom",
  },
]

const STATS = [
  { value: 99.99, decimals: 2, suffix: "%", label: "API uptime", sub: "trailing twelve months" },
  { value: 40, decimals: 0, suffix: "ms", label: "Median latency", sub: "p50, every region" },
  { value: 8, decimals: 1, suffix: "B", label: "Requests / month", sub: "and climbing" },
  { value: 19, decimals: 0, suffix: "", label: "Edge regions", sub: "on six continents" },
]

const SHIPPED = [
  { name: "Batch send", body: "Queue up to 100 messages in a single idempotent call.", ver: "v2.6.0", date: "Sep 2026" },
  { name: "Inbound parsing", body: "Route replies straight to a webhook as structured JSON.", ver: "v2.5.0", date: "Aug 2026" },
  { name: "EU data residency", body: "Pin storage and processing to eu-central-1.", ver: "v2.4.0", date: "Jul 2026" },
  { name: "Scheduled sends", body: "Send at a future timestamp, cancellable to the minute.", ver: "v2.3.0", date: "Jun 2026" },
  { name: "Suppression lists", body: "Programmatic bounce and complaint handling.", ver: "v2.2.0", date: "May 2026" },
  { name: "Typed async SDKs", body: "Fully typed clients for Node, Python 3.13, and Go.", ver: "v2.1.0", date: "Apr 2026" },
]

const TIERS = [
  {
    name: "Free",
    price: "$0",
    unit: "forever",
    blurb: "Everything you need to ship a side project.",
    features: ["3,000 emails / month", "1 sending domain", "1-day log retention", "Community support"],
    cta: "Start building",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$20",
    unit: "/ month",
    blurb: "For products in production with real traffic.",
    features: ["50,000 emails / month", "10 sending domains", "30-day log retention", "Webhooks and replay", "Email support"],
    cta: "Start free trial",
    highlight: true,
  },
  {
    name: "Scale",
    price: "Custom",
    unit: "",
    blurb: "Volume pricing, residency, and a signed SLA.",
    features: ["Millions of emails / month", "Unlimited domains", "90-day log retention", "SSO and SAML", "99.99% uptime SLA", "Priority support"],
    cta: "Talk to us",
    highlight: false,
  },
]

/** Reveal a node once when it scrolls into view. Reduced-motion shows instantly. */
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

/** Count from 0 to target with an ease-out cubic once `run` is true. */
function useCountUp(target: number, run: boolean, dur = 1600) {
  const [v, setV] = useState(0)
  useEffect(() => {
    if (!run) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setV(target)
      return
    }
    let raf = 0
    const t0 = performance.now()
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / dur)
      const e = 1 - Math.pow(1 - p, 3)
      setV(target * e)
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, run, dur])
  return v
}

/** Render a tokenised snippet. Empty arrays become a non-breaking space to hold height. */
function Code({ lines }: { lines: Line[] }) {
  return (
    <>
      {lines.map((line, i) => (
        <span className="ep-line" key={i}>
          {line.length === 0
            ? " "
            : line.map((tok, j) => (
                <span key={j} className={tok[1] ? "ep-t-" + tok[1] : undefined}>
                  {tok[0]}
                </span>
              ))}
        </span>
      ))}
    </>
  )
}

const plain = (lines: Line[]) => lines.map((l) => l.map((t) => t[0]).join("")).join("\n")

/** Copy-to-clipboard whose clipboard icon morphs into a checkmark on success. */
function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [done, setDone] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      /* clipboard may be unavailable; the morph still confirms intent */
    }
    setDone(true)
    window.setTimeout(() => setDone(false), 1600)
  }
  return (
    <button
      type="button"
      className={`ep-copy ${done ? "is-done" : ""}`}
      onClick={copy}
      aria-label={done ? "Copied" : label}
    >
      <svg className="ep-ico ep-ico-copy" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="9" y="9" width="11" height="11" rx="2.4" stroke="currentColor" strokeWidth="1.9" />
        <path d="M5 15.5A2 2 0 0 1 4 14V6a2 2 0 0 1 2-2h8a2 2 0 0 1 1.5.7" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
      </svg>
      <svg className="ep-ico ep-ico-check" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M5 12.5l4.2 4.2L19 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  )
}

function Stat({ s }: { s: (typeof STATS)[number] }) {
  const [ref, shown] = useReveal<HTMLDivElement>()
  const v = useCountUp(s.value, shown)
  return (
    <div className="ep-stat" ref={ref}>
      <div className="ep-stat-num">
        {v.toFixed(s.decimals)}
        <span className="ep-stat-suffix">{s.suffix}</span>
      </div>
      <div className="ep-stat-label">{s.label}</div>
      <div className="ep-stat-sub">{s.sub}</div>
    </div>
  )
}

export default function Endpoint() {
  const [reduced, setReduced] = useState(false)
  const [active, setActive] = useState(SDK_TABS[0].id)
  const [bodyH, setBodyH] = useState<number | undefined>(undefined)
  const panelRefs = useRef<Record<string, HTMLPreElement | null>>({})

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReduced(mq.matches)
    const onMq = () => setReduced(mq.matches)
    mq.addEventListener("change", onMq)
    return () => mq.removeEventListener("change", onMq)
  }, [])

  // Measure the active SDK panel so the card can height-animate between snippets.
  useEffect(() => {
    const measure = () => {
      const el = panelRefs.current[active]
      if (el) setBodyH(el.offsetHeight)
    }
    measure()
    const t = window.setTimeout(measure, 60)
    window.addEventListener("resize", measure)
    return () => {
      clearTimeout(t)
      window.removeEventListener("resize", measure)
    }
  }, [active])

  // Stream the HTTP response line by line, then pause and loop.
  const [respRef, respShown] = useReveal<HTMLDivElement>()
  const [visible, setVisible] = useState(0)
  useEffect(() => {
    if (!respShown) return
    if (reduced) {
      setVisible(RESPONSE_LINES.length)
      return
    }
    let timer = 0
    let i = 0
    setVisible(0)
    const step = () => {
      i += 1
      setVisible(i)
      if (i < RESPONSE_LINES.length) {
        timer = window.setTimeout(step, 165)
      } else {
        timer = window.setTimeout(() => {
          i = 0
          setVisible(0)
          timer = window.setTimeout(step, 150)
        }, 2600)
      }
    }
    timer = window.setTimeout(step, 420)
    return () => clearTimeout(timer)
  }, [respShown, reduced])

  const activeTab = SDK_TABS.find((t) => t.id === active) ?? SDK_TABS[0]

  return (
    <div className="endpoint-root">
      <style>{css}</style>

      <header className="ep-nav">
        <a className="ep-mark" href="#top" aria-label="Endpoint home">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="ep-mark-ico">
            <rect x="2.5" y="2.5" width="19" height="19" rx="5" stroke="currentColor" strokeWidth="1.7" />
            <circle cx="12" cy="12" r="3.1" fill="currentColor" />
            <path d="M12 2.6v3.4M12 18v3.4M2.6 12h3.4M18 12h3.4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          </svg>
          <span>Endpoint</span>
        </a>
        <nav className="ep-links">
          <a href="#capabilities">Product</a>
          <a href="#changelog">Changelog</a>
          <a href="#pricing">Pricing</a>
          <a href="#docs" className="ep-nav-cta">
            Read the docs
          </a>
        </nav>
      </header>

      {/* HERO — capability statement + copyable install, paired with the live SDK card */}
      <section className="ep-hero" id="top">
        <div className="ep-hero-glow" aria-hidden="true" />
        <div className="ep-hero-grid">
          <div className="ep-hero-copy">
            <p className="ep-kicker">The email API for developers</p>
            <h1 className="ep-title">
              Send email with
              <br />
              one API call.
            </h1>
            <p className="ep-lede">
              A single, well-typed request from the SDK you already use. Delivery, retries, and
              logs are handled. You write the call and move on.
            </p>
            <div className="ep-hero-actions">
              <a className="ep-btn ep-btn-primary" href="#docs">
                Read the docs
              </a>
              <div className="ep-npm">
                <span className="ep-npm-prompt" aria-hidden="true">
                  $
                </span>
                <code className="ep-npm-cmd">npm install endpoint</code>
                <CopyButton text="npm install endpoint" label="Copy install command" />
              </div>
            </div>
            <p className="ep-hero-note">No credit card. 3,000 emails a month on the free tier.</p>
          </div>

          {/* Live code card: multi-language SDK switcher with height-animated cross-fade */}
          <div className="ep-card" role="group" aria-label="Send an email in your language">
            <div className="ep-card-bar">
              <div className="ep-tabs" role="tablist" aria-label="SDK language">
                {SDK_TABS.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    role="tab"
                    aria-selected={active === t.id}
                    className={`ep-tab ${active === t.id ? "is-active" : ""}`}
                    onClick={() => setActive(t.id)}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
              <CopyButton text={plain(activeTab.lines)} label="Copy code sample" />
            </div>
            <div className="ep-card-body" style={{ height: bodyH }}>
              {SDK_TABS.map((t) => (
                <pre
                  key={t.id}
                  ref={(el) => {
                    panelRefs.current[t.id] = el
                  }}
                  className={`ep-panel ${active === t.id ? "is-active" : ""}`}
                  aria-hidden={active !== t.id}
                >
                  <code>
                    <Code lines={t.lines} />
                  </code>
                </pre>
              ))}
            </div>
            <div className="ep-card-foot">
              <span className="ep-dot" aria-hidden="true" />
              <span>POST /v1/emails</span>
              <span className="ep-card-foot-spacer" />
              <span className="ep-card-foot-mut">returns in ~38ms</span>
            </div>
          </div>
        </div>
      </section>

      {/* RESPONSE — paired terminal that streams the JSON back line by line */}
      <section className="ep-resp-sec">
        <div className="ep-resp-head">
          <p className="ep-kicker">And this comes back</p>
          <h2 className="ep-h2">Every call is a clean round trip.</h2>
          <p className="ep-section-lede">
            One request, one predictable JSON body, one request id you can grep for in the logs.
            No polling, no guessing what state the send is in.
          </p>
        </div>
        <div className="ep-term" ref={respRef}>
          <div className="ep-term-bar">
            <span className="ep-status">
              <span className="ep-status-dot" aria-hidden="true" />
              200 OK
            </span>
            <span className="ep-term-latency">38 ms</span>
          </div>
          <pre className="ep-term-body">
            <code>
              {RESPONSE_LINES.map((line, i) => (
                <span className={`ep-rline ${i < visible ? "is-in" : ""}`} key={i}>
                  {line.length === 0 ? (
                    " "
                  ) : (
                    <>
                      {line.map((tok, j) => (
                        <span key={j} className={tok[1] ? "ep-t-" + tok[1] : undefined}>
                          {tok[0]}
                        </span>
                      ))}
                      {!reduced && i === visible - 1 && visible < RESPONSE_LINES.length && (
                        <span className="ep-caret" aria-hidden="true" />
                      )}
                    </>
                  )}
                </span>
              ))}
            </code>
          </pre>
        </div>
      </section>

      {/* CAPABILITIES — each block pinned to an inline customer proof stat */}
      <section className="ep-caps" id="capabilities">
        <div className="ep-caps-head">
          <p className="ep-kicker">Built for the boring parts</p>
          <h2 className="ep-h2">The reliability work, already done.</h2>
          <p className="ep-section-lede">
            The things you would otherwise build twice and still get wrong — retries, signatures,
            a sandbox that tells the truth — are the product.
          </p>
        </div>
        <div className="ep-caps-grid">
          {CAPS.map((c) => (
            <article className="ep-cap" key={c.title}>
              <h3 className="ep-cap-title">{c.title}</h3>
              <p className="ep-cap-body">{c.body}</p>
              <div className="ep-cap-proof">
                <span className="ep-cap-stat">
                  {c.stat}
                  {c.statSuffix}
                </span>
                <span className="ep-cap-proof-txt">
                  {c.proof}
                  <span className="ep-cap-by">{c.by}</span>
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* STATS BAND — counts up on reveal */}
      <section className="ep-band">
        <div className="ep-band-inner">
          {STATS.map((s) => (
            <Stat s={s} key={s.label} />
          ))}
        </div>
      </section>

      {/* RECENTLY SHIPPED — version tags + dates */}
      <section className="ep-shipped" id="changelog">
        <div className="ep-shipped-head">
          <p className="ep-kicker">Recently shipped</p>
          <h2 className="ep-h2">We ship primitives, not press releases.</h2>
        </div>
        <div className="ep-shipped-grid">
          {SHIPPED.map((s) => (
            <article className="ep-ship" key={s.name}>
              <div className="ep-ship-top">
                <code className="ep-ver">{s.ver}</code>
                <span className="ep-ship-date">{s.date}</span>
              </div>
              <h3 className="ep-ship-name">{s.name}</h3>
              <p className="ep-ship-body">{s.body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* PRICING — three tiers, generous free tier, one highlighted */}
      <section className="ep-pricing" id="pricing">
        <div className="ep-pricing-head">
          <p className="ep-kicker">Pricing</p>
          <h2 className="ep-h2">Free until it's real. Fair after.</h2>
          <p className="ep-section-lede">
            No per-seat fees, no charge for teammates, no surprise overage bill. You pay for the
            email you send, and the first few thousand are on us.
          </p>
        </div>
        <div className="ep-tiers">
          {TIERS.map((t) => (
            <article className={`ep-tier ${t.highlight ? "is-hi" : ""}`} key={t.name}>
              {t.highlight && <span className="ep-tier-badge">Most popular</span>}
              <h3 className="ep-tier-name">{t.name}</h3>
              <div className="ep-tier-price">
                <span className="ep-tier-amount">{t.price}</span>
                {t.unit && <span className="ep-tier-unit">{t.unit}</span>}
              </div>
              <p className="ep-tier-blurb">{t.blurb}</p>
              <ul className="ep-tier-feats">
                {t.features.map((f) => (
                  <li key={f}>
                    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="ep-tick">
                      <path d="M4 10.5l3.5 3.5L16 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <a href="#docs" className={`ep-btn ep-tier-cta ${t.highlight ? "ep-btn-primary" : "ep-btn-ghost"}`}>
                {t.cta}
              </a>
            </article>
          ))}
        </div>
      </section>

      {/* DOCS-FORWARD FINAL CTA + GitHub */}
      <section className="ep-final" id="docs">
        <div className="ep-final-glow" aria-hidden="true" />
        <div className="ep-final-inner">
          <h2 className="ep-final-title">The docs are the demo.</h2>
          <p className="ep-final-lede">
            Every endpoint has a runnable example in four languages and a copyable curl. Read for
            ten minutes, ship before lunch.
          </p>
          <div className="ep-final-actions">
            <a className="ep-btn ep-btn-primary" href="#docs">
              Read the docs
            </a>
            <a className="ep-btn ep-btn-ghost ep-gh" href="#docs">
              <svg viewBox="0 0 24 24" aria-hidden="true" className="ep-gh-ico">
                <path
                  fill="currentColor"
                  d="M12 .5C5.73.5.75 5.48.75 11.75c0 4.98 3.23 9.2 7.71 10.69.56.1.77-.24.77-.54 0-.27-.01-1.15-.02-2.09-3.14.68-3.8-1.34-3.8-1.34-.51-1.3-1.25-1.65-1.25-1.65-1.03-.7.08-.69.08-.69 1.13.08 1.73 1.16 1.73 1.16 1.01 1.73 2.65 1.23 3.3.94.1-.73.39-1.23.71-1.51-2.51-.29-5.15-1.25-5.15-5.58 0-1.23.44-2.24 1.16-3.03-.12-.29-.5-1.44.11-3 0 0 .95-.3 3.1 1.16a10.7 10.7 0 0 1 2.82-.38c.96 0 1.92.13 2.82.38 2.15-1.46 3.1-1.16 3.1-1.16.61 1.56.23 2.71.11 3 .72.79 1.16 1.8 1.16 3.03 0 4.34-2.64 5.28-5.16 5.57.4.35.76 1.03.76 2.08 0 1.5-.01 2.71-.01 3.08 0 .3.2.65.78.54a11.26 11.26 0 0 0 7.7-10.69C23.25 5.48 18.27.5 12 .5Z"
                />
              </svg>
              Star on GitHub
            </a>
          </div>
          <div className="ep-final-cmd">
            <span className="ep-npm-prompt" aria-hidden="true">
              $
            </span>
            <code className="ep-npm-cmd">npm install endpoint</code>
            <CopyButton text="npm install endpoint" label="Copy install command" />
          </div>
        </div>
      </section>

      <footer className="ep-footer">
        <div className="ep-footer-inner">
          <div className="ep-footer-brand">
            <span className="ep-mark">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="ep-mark-ico">
                <rect x="2.5" y="2.5" width="19" height="19" rx="5" stroke="currentColor" strokeWidth="1.7" />
                <circle cx="12" cy="12" r="3.1" fill="currentColor" />
                <path d="M12 2.6v3.4M12 18v3.4M2.6 12h3.4M18 12h3.4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
              </svg>
              <span>Endpoint</span>
            </span>
            <p className="ep-footer-tag">The email API for developers.</p>
          </div>
          <div className="ep-footer-cols">
            <div className="ep-footer-col">
              <h4>Product</h4>
              <a href="#capabilities">Features</a>
              <a href="#pricing">Pricing</a>
              <a href="#changelog">Changelog</a>
            </div>
            <div className="ep-footer-col">
              <h4>Developers</h4>
              <a href="#docs">Documentation</a>
              <a href="#docs">API reference</a>
              <a href="#docs">SDKs</a>
            </div>
            <div className="ep-footer-col">
              <h4>Company</h4>
              <a href="#docs">About</a>
              <a href="#docs">Status</a>
              <a href="#docs">Contact</a>
            </div>
          </div>
        </div>
        <div className="ep-footer-fine">
          <span>Endpoint, Inc.</span>
          <span>SOC 2 Type II. GDPR ready.</span>
        </div>
      </footer>
    </div>
  )
}

const css = `
.endpoint-root {
  --ep-base: #10131c;
  --ep-base-2: #0b0e16;
  --ep-panel: #171b26;
  --ep-panel-2: #12151f;
  --ep-frost: #e9eef7;
  --ep-code: #cdd6e6;
  --ep-mute: #96a0b5;
  --ep-faint: #626d84;
  --ep-accent: #4f8ff7;
  --ep-accent-hi: #7cb0ff;
  --ep-line: rgba(148, 163, 184, 0.14);
  --ep-line-2: rgba(148, 163, 184, 0.08);
  --sx-key: #ff8b7e;
  --sx-str: #8fdf9f;
  --sx-num: #f2b366;
  --sx-com: #69748a;
  --sx-fn: #c9a3ff;
  --sx-prop: #7cc4ff;
  --sx-op: #9aa6bd;
  background: var(--ep-base);
  color: var(--ep-frost);
  font-family: var(--font-geist), system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
  line-height: 1.6;
  overflow-x: hidden;
}
.endpoint-root *,
.endpoint-root *::before,
.endpoint-root *::after { box-sizing: border-box; }
.endpoint-root ::selection { background: rgba(79, 143, 247, 0.28); }

/* shared type */
.ep-kicker {
  color: var(--ep-accent);
  font-size: 0.92rem;
  font-weight: 500;
  margin: 0 0 1rem;
}
.ep-h2 {
  font-size: clamp(1.9rem, 4vw, 3rem);
  font-weight: 600;
  line-height: 1.05;
  letter-spacing: -0.025em;
  margin: 0 0 1rem;
}
.ep-section-lede {
  color: var(--ep-mute);
  font-size: clamp(1.02rem, 1.4vw, 1.18rem);
  max-width: 40rem;
  margin: 0;
}

/* code token colours (only ever inside code) */
.ep-t-k { color: var(--sx-key); }
.ep-t-s { color: var(--sx-str); }
.ep-t-n { color: var(--sx-num); }
.ep-t-c { color: var(--sx-com); }
.ep-t-f { color: var(--sx-fn); }
.ep-t-y { color: var(--sx-prop); }
.ep-t-o { color: var(--sx-op); }
.ep-line { display: block; }

/* NAV */
.ep-nav {
  position: sticky; top: 0; z-index: 50;
  display: flex; align-items: center; justify-content: space-between;
  padding: 1rem clamp(1.25rem, 4vw, 3.5rem);
  background: rgba(16, 19, 28, 0.82);
  border-bottom: 1px solid var(--ep-line-2);
}
.ep-mark {
  display: inline-flex; align-items: center; gap: 0.6rem;
  color: var(--ep-frost); text-decoration: none;
  font-weight: 600; font-size: 1.12rem; letter-spacing: -0.01em;
}
.ep-mark-ico { width: 22px; height: 22px; color: var(--ep-accent); }
.ep-links { display: flex; align-items: center; gap: clamp(1rem, 2.2vw, 2rem); }
.ep-links a { color: var(--ep-mute); text-decoration: none; font-size: 0.95rem; transition: color 0.25s; }
.ep-links a:hover { color: var(--ep-frost); }
.ep-nav-cta {
  color: var(--ep-frost) !important;
  border: 1px solid var(--ep-line);
  border-radius: 8px;
  padding: 0.45rem 0.95rem;
  transition: border-color 0.25s, background 0.25s;
}
.ep-nav-cta:hover { border-color: var(--ep-accent); background: rgba(79, 143, 247, 0.1); }
@media (max-width: 720px) { .ep-links a:not(.ep-nav-cta) { display: none; } }

/* BUTTONS */
.ep-btn {
  display: inline-flex; align-items: center; justify-content: center;
  font-weight: 600; font-size: 1rem; text-decoration: none;
  padding: 0.85rem 1.4rem; border-radius: 10px;
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s, background 0.25s, border-color 0.25s;
}
.ep-btn-primary { background: var(--ep-accent); color: #06101f; }
.ep-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 16px 34px -14px rgba(79, 143, 247, 0.7); }

/* HERO */
.ep-hero { position: relative; padding: clamp(3rem, 7vw, 6.5rem) clamp(1.25rem, 5vw, 5rem) clamp(3rem, 6vw, 5rem); overflow: hidden; }
.ep-hero-glow {
  position: absolute; top: -22%; right: -8%; width: 60rem; height: 40rem; pointer-events: none;
  background: radial-gradient(circle at 60% 40%, rgba(79, 143, 247, 0.22), transparent 62%);
}
.ep-hero-grid {
  position: relative; display: grid; grid-template-columns: 1fr 1.04fr;
  gap: clamp(2rem, 5vw, 4.5rem); align-items: center;
  max-width: 78rem; margin: 0 auto;
}
.ep-hero-copy { max-width: 34rem; }
.ep-title {
  font-size: clamp(2.6rem, 6vw, 4.6rem);
  font-weight: 620;
  line-height: 1.0;
  letter-spacing: -0.035em;
  margin: 0 0 1.4rem;
}
.ep-lede { color: var(--ep-mute); font-size: clamp(1.06rem, 1.5vw, 1.25rem); margin: 0 0 2rem; }
.ep-hero-actions { display: flex; flex-wrap: wrap; align-items: center; gap: 0.9rem; }
.ep-npm {
  display: inline-flex; align-items: center; gap: 0.65rem;
  background: var(--ep-panel-2); border: 1px solid var(--ep-line);
  border-radius: 10px; padding: 0.55rem 0.6rem 0.55rem 0.95rem;
}
.ep-npm-prompt { color: var(--ep-accent); font-family: var(--font-geist-mono), monospace; font-weight: 700; }
.ep-npm-cmd { font-family: var(--font-geist-mono), monospace; font-size: 0.95rem; color: var(--ep-frost); }
.ep-hero-note { color: var(--ep-faint); font-size: 0.9rem; margin: 1.3rem 0 0; }

/* COPY BUTTON with morphing icon */
.ep-copy {
  position: relative; width: 34px; height: 34px; flex: none;
  display: inline-grid; place-items: center;
  background: transparent; border: 1px solid var(--ep-line); border-radius: 8px;
  color: var(--ep-mute); cursor: pointer; padding: 0;
  transition: color 0.25s, border-color 0.25s, background 0.25s;
}
.ep-copy:hover { color: var(--ep-frost); border-color: var(--ep-accent); background: rgba(79, 143, 247, 0.08); }
.ep-copy.is-done { color: var(--sx-str); border-color: rgba(143, 223, 159, 0.5); }
.ep-ico { grid-area: 1 / 1; width: 17px; height: 17px; transition: opacity 0.28s ease, transform 0.28s cubic-bezier(0.34, 1.56, 0.64, 1); }
.ep-ico-copy { opacity: 1; transform: scale(1) rotate(0deg); }
.ep-ico-check { opacity: 0; transform: scale(0.5) rotate(-25deg); }
.ep-copy.is-done .ep-ico-copy { opacity: 0; transform: scale(0.5) rotate(25deg); }
.ep-copy.is-done .ep-ico-check { opacity: 1; transform: scale(1) rotate(0deg); }

/* CODE CARD */
.ep-card {
  background: var(--ep-panel);
  border: 1px solid var(--ep-line);
  border-radius: 14px;
  box-shadow: 0 40px 90px -50px rgba(0, 0, 0, 0.9), 0 0 0 1px rgba(255, 255, 255, 0.02) inset;
  overflow: hidden;
}
.ep-card-bar {
  display: flex; align-items: center; justify-content: space-between;
  padding: 0.55rem 0.7rem 0.55rem 0.85rem;
  border-bottom: 1px solid var(--ep-line-2);
  background: var(--ep-panel-2);
}
.ep-tabs { display: flex; gap: 0.15rem; }
.ep-tab {
  position: relative;
  font-family: var(--font-geist-mono), monospace;
  font-size: 0.85rem; color: var(--ep-mute);
  background: transparent; border: 0; cursor: pointer;
  padding: 0.4rem 0.7rem; border-radius: 6px;
  transition: color 0.25s, background 0.25s;
}
.ep-tab:hover { color: var(--ep-frost); }
.ep-tab.is-active { color: var(--ep-frost); background: rgba(79, 143, 247, 0.12); }
.ep-tab.is-active::after {
  content: ""; position: absolute; left: 0.7rem; right: 0.7rem; bottom: -0.56rem; height: 2px;
  background: var(--ep-accent);
}
.ep-card-body { position: relative; min-height: 17rem; transition: height 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
.ep-panel {
  position: absolute; inset: 0; margin: 0;
  padding: 1.2rem 1.35rem;
  font-family: var(--font-geist-mono), monospace;
  font-size: 0.86rem; line-height: 1.72; color: var(--ep-code);
  white-space: pre; overflow-x: auto;
  opacity: 0; transform: translateY(8px); pointer-events: none;
  transition: opacity 0.42s ease, transform 0.42s cubic-bezier(0.16, 1, 0.3, 1);
}
.ep-panel.is-active { opacity: 1; transform: none; pointer-events: auto; }
.ep-card-foot {
  display: flex; align-items: center; gap: 0.5rem;
  padding: 0.7rem 1.1rem; border-top: 1px solid var(--ep-line-2);
  font-family: var(--font-geist-mono), monospace; font-size: 0.8rem; color: var(--ep-mute);
  background: var(--ep-panel-2);
}
.ep-card-foot-spacer { flex: 1; }
.ep-card-foot-mut { color: var(--ep-faint); }
.ep-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--ep-accent); }

/* RESPONSE / TERMINAL */
.ep-resp-sec {
  display: grid; grid-template-columns: 0.85fr 1.15fr; gap: clamp(2rem, 5vw, 4rem);
  align-items: center;
  max-width: 78rem; margin: 0 auto;
  padding: clamp(3rem, 7vw, 6rem) clamp(1.25rem, 5vw, 5rem);
  border-top: 1px solid var(--ep-line-2);
}
.ep-resp-head { max-width: 30rem; }
.ep-term {
  background: var(--ep-panel); border: 1px solid var(--ep-line); border-radius: 14px;
  overflow: hidden; box-shadow: 0 40px 90px -55px rgba(0, 0, 0, 0.9);
}
.ep-term-bar {
  display: flex; align-items: center; justify-content: space-between;
  padding: 0.7rem 1.1rem; border-bottom: 1px solid var(--ep-line-2); background: var(--ep-panel-2);
}
.ep-status {
  display: inline-flex; align-items: center; gap: 0.5rem;
  font-family: var(--font-geist-mono), monospace; font-size: 0.82rem; color: var(--sx-str);
}
.ep-status-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--sx-str); box-shadow: 0 0 0 3px rgba(143, 223, 159, 0.16); }
.ep-term-latency { font-family: var(--font-geist-mono), monospace; font-size: 0.82rem; color: var(--ep-mute); }
.ep-term-body {
  margin: 0; padding: 1.2rem 1.4rem 1.5rem;
  font-family: var(--font-geist-mono), monospace;
  font-size: 0.87rem; line-height: 1.8; color: var(--ep-code);
  white-space: pre; overflow-x: auto; min-height: 20rem;
}
.ep-rline {
  display: block; opacity: 0; transform: translateY(3px);
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.ep-rline.is-in { opacity: 1; transform: none; }
.ep-caret {
  display: inline-block; width: 0.5rem; height: 1.02em; margin-left: 0.15rem;
  background: var(--ep-accent); vertical-align: text-bottom;
  animation: epblink 1s steps(2, start) infinite;
}
@keyframes epblink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }

/* CAPABILITIES */
.ep-caps {
  max-width: 78rem; margin: 0 auto;
  padding: clamp(3rem, 7vw, 6rem) clamp(1.25rem, 5vw, 5rem);
  border-top: 1px solid var(--ep-line-2);
}
.ep-caps-head { max-width: 40rem; margin-bottom: clamp(2.4rem, 5vw, 3.6rem); }
.ep-caps-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.2rem; }
.ep-cap {
  background: var(--ep-panel-2); border: 1px solid var(--ep-line);
  border-radius: 14px; padding: 1.8rem 1.9rem;
  transition: border-color 0.3s, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.ep-cap:hover { border-color: rgba(79, 143, 247, 0.4); transform: translateY(-4px); }
.ep-cap-title { font-size: 1.28rem; font-weight: 600; letter-spacing: -0.02em; margin: 0 0 0.7rem; }
.ep-cap-body { color: var(--ep-mute); font-size: 1rem; margin: 0 0 1.5rem; }
.ep-cap-proof { display: flex; align-items: baseline; gap: 0.9rem; padding-top: 1.2rem; border-top: 1px solid var(--ep-line-2); }
.ep-cap-stat {
  font-size: 1.9rem; font-weight: 650; letter-spacing: -0.03em; color: var(--ep-accent);
  font-variant-numeric: tabular-nums; line-height: 1; flex: none;
}
.ep-cap-proof-txt { color: var(--ep-mute); font-size: 0.9rem; line-height: 1.35; }
.ep-cap-by { display: block; color: var(--ep-faint); font-size: 0.82rem; margin-top: 0.15rem; }
@media (max-width: 720px) { .ep-caps-grid { grid-template-columns: 1fr; } }

/* STATS BAND */
.ep-band { background: var(--ep-base-2); border-top: 1px solid var(--ep-line-2); border-bottom: 1px solid var(--ep-line-2); }
.ep-band-inner {
  max-width: 78rem; margin: 0 auto;
  padding: clamp(2.6rem, 5vw, 4rem) clamp(1.25rem, 5vw, 5rem);
  display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem;
}
.ep-stat { text-align: left; }
.ep-stat-num {
  font-size: clamp(2.4rem, 4.4vw, 3.4rem); font-weight: 650; letter-spacing: -0.035em;
  line-height: 1; font-variant-numeric: tabular-nums;
}
.ep-stat-suffix { color: var(--ep-accent); }
.ep-stat-label { font-size: 1rem; font-weight: 500; margin-top: 0.7rem; }
.ep-stat-sub { color: var(--ep-faint); font-size: 0.85rem; margin-top: 0.15rem; }
@media (max-width: 720px) { .ep-band-inner { grid-template-columns: repeat(2, 1fr); gap: 2rem 1.5rem; } }

/* SHIPPED */
.ep-shipped {
  max-width: 78rem; margin: 0 auto;
  padding: clamp(3rem, 7vw, 6rem) clamp(1.25rem, 5vw, 5rem);
}
.ep-shipped-head { max-width: 40rem; margin-bottom: clamp(2.2rem, 5vw, 3.2rem); }
.ep-shipped-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.2rem; }
.ep-ship {
  background: var(--ep-panel-2); border: 1px solid var(--ep-line);
  border-radius: 12px; padding: 1.4rem 1.5rem;
  transition: border-color 0.3s;
}
.ep-ship:hover { border-color: rgba(79, 143, 247, 0.4); }
.ep-ship-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.9rem; }
.ep-ver {
  font-family: var(--font-geist-mono), monospace; font-size: 0.78rem;
  color: var(--ep-accent-hi); background: rgba(79, 143, 247, 0.14);
  border: 1px solid rgba(79, 143, 247, 0.24); border-radius: 6px; padding: 0.16rem 0.5rem;
}
.ep-ship-date { color: var(--ep-faint); font-size: 0.85rem; }
.ep-ship-name { font-size: 1.12rem; font-weight: 600; letter-spacing: -0.015em; margin: 0 0 0.4rem; }
.ep-ship-body { color: var(--ep-mute); font-size: 0.94rem; margin: 0; }
@media (max-width: 860px) { .ep-shipped-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 560px) { .ep-shipped-grid { grid-template-columns: 1fr; } }

/* PRICING */
.ep-pricing {
  max-width: 78rem; margin: 0 auto;
  padding: clamp(3rem, 7vw, 6rem) clamp(1.25rem, 5vw, 5rem);
  border-top: 1px solid var(--ep-line-2);
}
.ep-pricing-head { max-width: 40rem; margin-bottom: clamp(2.4rem, 5vw, 3.6rem); }
.ep-tiers { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.2rem; align-items: start; }
.ep-tier {
  position: relative; background: var(--ep-panel-2);
  border: 1px solid var(--ep-line); border-radius: 16px; padding: 2rem 1.9rem;
  display: flex; flex-direction: column; gap: 0.9rem;
}
.ep-tier.is-hi {
  border-color: rgba(79, 143, 247, 0.55);
  background: linear-gradient(180deg, rgba(79, 143, 247, 0.08), var(--ep-panel-2) 60%);
  box-shadow: 0 30px 70px -45px rgba(79, 143, 247, 0.6);
}
.ep-tier-badge {
  position: absolute; top: -0.7rem; left: 1.9rem;
  background: var(--ep-accent); color: #06101f;
  font-size: 0.75rem; font-weight: 600; padding: 0.22rem 0.65rem; border-radius: 999px;
}
.ep-tier-name { font-size: 1.05rem; font-weight: 600; margin: 0; color: var(--ep-mute); }
.ep-tier-price { display: flex; align-items: baseline; gap: 0.4rem; }
.ep-tier-amount { font-size: 2.6rem; font-weight: 680; letter-spacing: -0.04em; line-height: 1; }
.ep-tier-unit { color: var(--ep-faint); font-size: 0.95rem; }
.ep-tier-blurb { color: var(--ep-mute); font-size: 0.95rem; margin: 0; min-height: 2.6em; }
.ep-tier-feats { list-style: none; padding: 0; margin: 0.4rem 0 0.4rem; display: flex; flex-direction: column; gap: 0.7rem; }
.ep-tier-feats li { display: flex; align-items: flex-start; gap: 0.6rem; font-size: 0.95rem; color: var(--ep-frost); }
.ep-tick { width: 18px; height: 18px; flex: none; color: var(--ep-accent); margin-top: 0.1rem; }
.ep-tier-cta { margin-top: 0.6rem; width: 100%; }
.ep-btn-ghost { background: transparent; color: var(--ep-frost); border: 1px solid var(--ep-line); }
.ep-btn-ghost:hover { border-color: var(--ep-accent); background: rgba(79, 143, 247, 0.08); transform: translateY(-2px); }
@media (max-width: 860px) { .ep-tiers { grid-template-columns: 1fr; max-width: 30rem; margin-inline: auto; } .ep-tier-blurb { min-height: 0; } }

/* FINAL CTA */
.ep-final { position: relative; border-top: 1px solid var(--ep-line-2); overflow: hidden; }
.ep-final-glow {
  position: absolute; inset: 0; pointer-events: none;
  background: radial-gradient(ellipse 70% 100% at 50% 100%, rgba(79, 143, 247, 0.18), transparent 70%);
}
.ep-final-inner {
  position: relative; max-width: 46rem; margin: 0 auto; text-align: center;
  padding: clamp(4rem, 9vw, 7rem) clamp(1.5rem, 5vw, 4rem);
}
.ep-final-title { font-size: clamp(2.1rem, 5vw, 3.4rem); font-weight: 640; letter-spacing: -0.03em; line-height: 1.04; margin: 0 0 1.1rem; }
.ep-final-lede { color: var(--ep-mute); font-size: clamp(1.05rem, 1.5vw, 1.2rem); margin: 0 auto 2rem; max-width: 34rem; }
.ep-final-actions { display: flex; flex-wrap: wrap; justify-content: center; gap: 0.9rem; margin-bottom: 1.8rem; }
.ep-gh { display: inline-flex; align-items: center; gap: 0.55rem; }
.ep-gh-ico { width: 19px; height: 19px; }
.ep-final-cmd {
  display: inline-flex; align-items: center; gap: 0.65rem;
  background: var(--ep-panel-2); border: 1px solid var(--ep-line);
  border-radius: 10px; padding: 0.55rem 0.6rem 0.55rem 0.95rem;
}

/* FOOTER */
.ep-footer { background: var(--ep-base-2); border-top: 1px solid var(--ep-line-2); }
.ep-footer-inner {
  max-width: 78rem; margin: 0 auto;
  padding: clamp(3rem, 6vw, 4.5rem) clamp(1.25rem, 5vw, 5rem) 2.5rem;
  display: grid; grid-template-columns: 1.3fr 2fr; gap: 2.5rem;
}
.ep-footer-brand .ep-mark { display: inline-flex; align-items: center; gap: 0.6rem; font-weight: 600; font-size: 1.12rem; color: var(--ep-frost); }
.ep-footer-tag { color: var(--ep-mute); font-size: 0.95rem; margin: 0.9rem 0 0; }
.ep-footer-cols { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
.ep-footer-col h4 { font-size: 0.9rem; font-weight: 600; color: var(--ep-frost); margin: 0 0 0.9rem; }
.ep-footer-col a { display: block; color: var(--ep-mute); text-decoration: none; font-size: 0.92rem; margin-bottom: 0.55rem; transition: color 0.25s; }
.ep-footer-col a:hover { color: var(--ep-frost); }
.ep-footer-fine {
  max-width: 78rem; margin: 0 auto;
  padding: 1.4rem clamp(1.25rem, 5vw, 5rem); border-top: 1px solid var(--ep-line-2);
  display: flex; justify-content: space-between; gap: 1rem; flex-wrap: wrap;
  color: var(--ep-faint); font-size: 0.85rem;
}
@media (max-width: 720px) { .ep-footer-inner { grid-template-columns: 1fr; gap: 2rem; } }

@media (max-width: 900px) {
  .ep-hero-grid { grid-template-columns: 1fr; }
  .ep-resp-sec { grid-template-columns: 1fr; }
}

@media (prefers-reduced-motion: reduce) {
  .endpoint-root * { transition: none !important; animation: none !important; }
  .ep-rline { opacity: 1; transform: none; }
  .ep-panel.is-active { opacity: 1; transform: none; }
}
`
