"use client"

import { useEffect, useRef, useState } from "react"

/**
 * RIOT — a kinetic typographic manifesto for a design festival and the studio
 * behind it. Type is the whole design: Geist's weight axis is the instrument.
 *
 * Deliberate against the usual tells: the base is warm bone paper (not a tinted
 * near-black, not the cream-serif-terracotta editorial cliché), the register is
 * a two-colour riso gig-poster — electric cobalt as the signature with vermilion
 * only ever on paper (never on black), a grotesk display face (never a serif).
 * No tracked-caps eyebrows (the big caps are display, not label chrome), no
 * middle-dot metas (an asterisk motif separates the ticker), no arrow links, no
 * glassmorphism. One bold move — kinetic type — everything around it kept quiet.
 *
 * Signature moments:
 *  - the headline reveals per-character on load and animates its variable weight
 *    per-character on hover (heavier is wider in Geist, so weight carries width);
 *    the word "quiet" is set thin on purpose.
 *  - the marquee ribbons run at different speeds and *couple to scroll velocity* —
 *    scroll faster and they accelerate and skew. All motion is off under
 *    prefers-reduced-motion.
 */

type RTStyle = React.CSSProperties & Record<string, string | number>

const TICKER = [
  "RIOT 07",
  "14–17 May",
  "The Forge, Manchester",
  "120 speakers, four stages",
  "Early tickets close Friday",
  "Make something loud",
]

const HERO_LINES: { t: string; quiet?: boolean }[][] = [
  [{ t: "NOBODY" }],
  [{ t: "REMEMBERS" }],
  [{ t: "THE" }, { t: "QUIET", quiet: true }],
  [{ t: "ONES." }],
]

const SESSIONS = [
  { name: "The death of the safe choice", format: "Keynote", field: "Identity", room: "Main stage" },
  { name: "Set it twice as big", format: "Workshop", field: "Type", room: "Studio 2" },
  { name: "Riso till the ink runs out", format: "Print lab", field: "Hands-on", room: "The Press Room" },
  { name: "Break the grid on purpose", format: "Talk", field: "Layout", room: "Main stage" },
  { name: "Make the motion mean something", format: "Talk", field: "Motion", room: "Studio 1" },
  { name: "Arguing with clients, and winning", format: "Panel", field: "Practice", room: "Main stage" },
]

const PARTNERS = [
  "PULP",
  "VERSO",
  "COARSE",
  "NOON",
  "GRAIN",
  "OFFCUT",
  "RIOT RECORDS",
  "THE FORGE",
  "BOLD MATTER",
  "STUDIO NEON",
]

const WORKS = [
  { t: "Festival identity 07", k: "Brand" },
  { t: "Riso poster series", k: "Print" },
  { t: "Stage motion package", k: "Motion" },
  { t: "The programme, in print", k: "Editorial" },
  { t: "Type specimen zine", k: "Type" },
]

const STATS = [
  { v: 9400, suffix: "+", label: "troublemakers through the doors" },
  { v: 120, suffix: "", label: "speakers across four stages" },
  { v: 42, suffix: "", label: "talks, labs and workshops" },
  { v: 4, suffix: "", label: "days in one very loud room" },
]

const TESTIMONIALS = [
  {
    q: "I walked in with a house style and left having burned it down. Best decision I made all year.",
    who: "Priya Nair",
    role: "Studio lead, Pulp",
  },
  {
    q: "The only festival where the argument in the hallway beat the keynote — and the keynote was extraordinary.",
    who: "Marcus Dodd",
    role: "Art director",
  },
  {
    q: "Loud, generous, a little unhinged. I've been to fifty of these. It's the one I re-book before I've even left.",
    who: "Lena Kessler",
    role: "Type designer",
  },
]

/** Reveal once when scrolled into view. Reduced-motion shows instantly. */
function useReveal<T extends HTMLElement>(threshold = 0.25) {
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
      { threshold },
    )
    io.observe(node)
    return () => io.disconnect()
  }, [threshold])
  return [ref, shown] as const
}

/** One big count-up stat, triggered when it scrolls into view. */
function Stat({ v, suffix, label }: { v: number; suffix: string; label: string }) {
  const [ref, shown] = useReveal<HTMLDivElement>(0.5)
  const n = useCountUp(v, shown)
  return (
    <div className="rt-stat" ref={ref}>
      <span className="rt-stat-num">
        {n.toLocaleString("en-US")}
        {suffix}
      </span>
      <span className="rt-stat-label">{label}</span>
    </div>
  )
}

/** Count from 0 to target once `run` flips true. Reduced-motion jumps to target. */
function useCountUp(target: number, run: boolean, dur = 1500) {
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!run) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setN(target)
      return
    }
    let raf = 0
    let start = 0
    const step = (t: number) => {
      if (!start) start = t
      const p = Math.min(1, (t - start) / dur)
      const eased = 1 - Math.pow(1 - p, 3)
      setN(Math.round(eased * target))
      if (p < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [target, run, dur])
  return n
}

/**
 * A looping ribbon whose speed and skew are coupled to scroll velocity via the
 * shared refs. Two identical segments wrap seamlessly. Static under reduced motion.
 */
function Ribbon({
  children,
  speed,
  dir,
  velMagRef,
  velSignedRef,
  reduced,
  className,
}: {
  children: React.ReactNode
  speed: number
  dir: 1 | -1
  velMagRef: React.MutableRefObject<number>
  velSignedRef: React.MutableRefObject<number>
  reduced: boolean
  className?: string
}) {
  const trackRef = useRef<HTMLDivElement>(null)
  const segRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (reduced || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const track = trackRef.current
    const seg = segRef.current
    if (!track || !seg) return
    let raf = 0
    let last = performance.now()
    let off = 0
    const loop = (t: number) => {
      const dt = Math.min(64, t - last) || 16
      last = t
      const w = seg.offsetWidth || 1
      const boost = 1 + velMagRef.current * 4.5
      off = (off + (speed / 1000) * dt * boost) % w
      const base = dir < 0 ? -off : off - w
      const skew = Math.max(-9, Math.min(9, velSignedRef.current * 2.6))
      track.style.transform = `translate3d(${base.toFixed(2)}px,0,0) skewX(${skew.toFixed(2)}deg)`
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [reduced, speed, dir, velMagRef, velSignedRef])
  return (
    <div className={`rt-ribbon ${className || ""}`}>
      <div className="rt-ribbon-track" ref={trackRef}>
        <div className="rt-ribbon-seg" ref={segRef}>
          {children}
        </div>
        <div className="rt-ribbon-seg" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  )
}

export default function Riot() {
  const [reduced, setReduced] = useState(false)
  const [loaded, setLoaded] = useState(false)

  const velMagRef = useRef(0)
  const velSignedRef = useRef(0)
  const rowsRef = useRef<(HTMLElement | null)[]>([])

  const [ti, setTi] = useState(0)
  const [paused, setPaused] = useState(false)
  const [signed, setSigned] = useState(false)

  const [maniRef, maniShown] = useReveal<HTMLDivElement>(0.3)

  useEffect(() => {
    setLoaded(true)
  }, [])

  useEffect(() => {
    if (paused) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const id = window.setInterval(() => setTi((i) => (i + 1) % TESTIMONIALS.length), 5200)
    return () => window.clearInterval(id)
  }, [paused])

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    const sync = () => setReduced(mq.matches)
    sync()
    mq.addEventListener("change", sync)
    if (mq.matches) {
      return () => mq.removeEventListener("change", sync)
    }

    let raf = 0
    let lastY = window.scrollY
    let lastT = performance.now()
    const loop = (t: number) => {
      const dt = Math.min(64, t - lastT) || 16
      lastT = t
      const y = window.scrollY
      const inst = (y - lastY) / dt // px per ms
      lastY = y
      velSignedRef.current += (inst - velSignedRef.current) * 0.12
      const mag = Math.min(1, Math.abs(velSignedRef.current) / 3)
      velMagRef.current += (mag - velMagRef.current) * 0.15

      const rows = rowsRef.current
      if (rows.length) {
        const vh = window.innerHeight
        for (const el of rows) {
          if (!el) continue
          const r = el.getBoundingClientRect()
          const d = (r.top + r.height / 2 - vh / 2) / vh
          const cl = Math.max(-1, Math.min(1, d))
          const skew = Math.max(-5, Math.min(5, velSignedRef.current * 3.2))
          const scale = 1 - Math.min(0.05, Math.abs(cl) * 0.05)
          el.style.transform = `skewX(${skew.toFixed(2)}deg) scale(${scale.toFixed(3)})`
        }
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => {
      mq.removeEventListener("change", sync)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div className="riot-root">
      <style>{css}</style>

      {/* TICKER — announcement marquee, scrolls away above the sticky nav */}
      <div className="rt-ticker" aria-hidden="true">
        <div className={`rt-ticker-track ${reduced ? "" : "is-run"}`}>
          {[0, 1].map((seg) => (
            <div className="rt-ticker-seg" key={seg}>
              {TICKER.map((item) => (
                <span className="rt-ti-item" key={item}>
                  <span className="rt-ti-text">{item}</span>
                  <span className="rt-ast" aria-hidden="true">
                    ✳
                  </span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* NAV — sticky */}
      <header className="rt-nav">
        <a className="rt-word" href="#top">
          RIOT
        </a>
        <nav className="rt-nav-links" aria-label="Primary">
          <a href="#programme">Programme</a>
          <a href="#work">Studio</a>
          <a href="#manifesto">Manifesto</a>
          <a className="rt-btn rt-btn-sm" href="#tickets">
            Get tickets
          </a>
        </nav>
      </header>

      {/* HERO — the centerpiece manifesto headline */}
      <section className="rt-hero" id="top">
        <div className="rt-hero-inner">
          <p className="rt-stamp">Edition 07 / May 2026 / Manchester</p>
          <h1 className={`rt-hero-title ${loaded ? "rt-in" : ""}`} aria-label="Nobody remembers the quiet ones.">
            <span aria-hidden="true">
              {(() => {
                let ci = 0
                return HERO_LINES.map((line, li) => (
                  <span className="rt-line" key={li}>
                    {line.map((word, wi) => (
                      <span className="rt-wordgrp" key={wi}>
                        {Array.from(word.t).map((c, k) => (
                          <span
                            className={`rt-ch ${word.quiet ? "rt-ch-quiet" : ""}`}
                            style={{ "--i": ci++ } as RTStyle}
                            key={k}
                          >
                            {c}
                          </span>
                        ))}
                      </span>
                    ))}
                  </span>
                ))
              })()}
            </span>
          </h1>
          <p className="rt-lede">
            RIOT is a four-day design festival and the studio behind it — talks, type, print and a lot of noise,
            for people who refuse to blend in.
          </p>
          <div className="rt-hero-cta">
            <a className="rt-btn rt-btn-lg" href="#tickets">
              Get tickets
            </a>
            <p className="rt-hero-note">14–17 May at The Forge, Manchester. Early birds close Friday.</p>
          </div>
        </div>
      </section>

      {/* PROGRAMME — full-bleed lineup stack, rows skew/scale on scroll velocity */}
      <section className="rt-prog" id="programme">
        <div className="rt-prog-head">
          <h2 className="rt-h2">The programme</h2>
          <p className="rt-prog-sub">
            Six of the loudest sessions from RIOT 07. The full schedule lands with your ticket.
          </p>
        </div>
        <div className="rt-prog-list">
          {SESSIONS.map((s, i) => (
            <article
              className="rt-row"
              key={s.name}
              ref={(el) => {
                rowsRef.current[i] = el
              }}
            >
              <div className="rt-row-main">
                <span className="rt-row-fmt">{s.format}</span>
                <h3 className="rt-row-name">{s.name}</h3>
              </div>
              <div className="rt-row-meta">
                <span className="rt-row-field">{s.field}</span>
                <span className="rt-row-room">{s.room}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* RIBBONS — speed + skew couple to scroll velocity */}
      <section className="rt-ribbons" id="work" aria-label="In motion">
        <Ribbon
          speed={90}
          dir={-1}
          velMagRef={velMagRef}
          velSignedRef={velSignedRef}
          reduced={reduced}
          className="rt-ribbon-word"
        >
          {Array.from({ length: 4 }).map((_, i) => (
            <span className="rt-rib-word" key={i}>
              LOUDER <span className="rt-rib-star">✳</span> BIGGER <span className="rt-rib-star">✳</span> RUDER{" "}
              <span className="rt-rib-star">✳</span>{" "}
            </span>
          ))}
        </Ribbon>

        <Ribbon
          speed={55}
          dir={1}
          velMagRef={velMagRef}
          velSignedRef={velSignedRef}
          reduced={reduced}
          className="rt-ribbon-logos"
        >
          {Array.from({ length: 3 }).map((_, rep) => (
            <span className="rt-rib-logos-grp" key={rep}>
              {PARTNERS.map((p) => (
                <span className="rt-rib-logo" key={p}>
                  {p}
                </span>
              ))}
            </span>
          ))}
        </Ribbon>

        <Ribbon
          speed={34}
          dir={-1}
          velMagRef={velMagRef}
          velSignedRef={velSignedRef}
          reduced={reduced}
          className="rt-ribbon-work"
        >
          {Array.from({ length: 3 }).map((_, rep) => (
            <span className="rt-rib-work-grp" key={rep}>
              {WORKS.map((w, i) => (
                <span className={`rt-tile rt-tile-${i % 4}`} key={`${rep}-${w.t}`}>
                  <span className="rt-tile-k">{w.k}</span>
                  <span className="rt-tile-t">{w.t}</span>
                </span>
              ))}
            </span>
          ))}
        </Ribbon>
      </section>

      {/* STATS + VOICES */}
      <section className="rt-stats-wrap">
        <div className="rt-stats">
          {STATS.map((s) => (
            <Stat key={s.label} v={s.v} suffix={s.suffix} label={s.label} />
          ))}
        </div>

        <div
          className="rt-voices"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
        >
          <div className="rt-voices-quote" aria-live="polite">
            <blockquote key={ti} className="rt-voices-q">
              <p>{TESTIMONIALS[ti].q}</p>
              <cite>
                <span className="rt-voices-who">{TESTIMONIALS[ti].who}</span>
                <span className="rt-voices-role">{TESTIMONIALS[ti].role}</span>
              </cite>
            </blockquote>
          </div>
          <div className="rt-voices-nav">
            <button
              type="button"
              className="rt-voices-arrow"
              aria-label="Previous quote"
              onClick={() => setTi((i) => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)}
            >
              ‹
            </button>
            <div className="rt-dots" role="tablist" aria-label="Choose a quote">
              {TESTIMONIALS.map((t, i) => (
                <button
                  key={t.who}
                  type="button"
                  role="tab"
                  aria-selected={i === ti}
                  aria-label={`Quote ${i + 1} of ${TESTIMONIALS.length}`}
                  className={`rt-dot ${i === ti ? "is-on" : ""}`}
                  onClick={() => setTi(i)}
                />
              ))}
            </div>
            <button
              type="button"
              className="rt-voices-arrow"
              aria-label="Next quote"
              onClick={() => setTi((i) => (i + 1) % TESTIMONIALS.length)}
            >
              ›
            </button>
          </div>
        </div>
      </section>

      {/* MANIFESTO — cobalt field, the edition statement */}
      <section className="rt-mani" id="manifesto" ref={maniRef}>
        <span className="rt-mani-ed" aria-hidden="true">
          07
        </span>
        <div className={`rt-mani-inner ${maniShown ? "rt-in" : ""}`}>
          <p className="rt-mani-kick">What RIOT believes</p>
          <p className="rt-mani-text">
            Design should pick a side. Safe is the expensive option. If nobody argues, you didn&apos;t say
            anything. We&apos;d rather be <span className="rt-mani-hot">wrong and loud</span> than right and quiet.
          </p>
        </div>
      </section>

      {/* TICKETS — CTA */}
      <section className="rt-tickets" id="tickets">
        <div className="rt-tickets-inner">
          <h2 className="rt-tickets-title">Tickets for RIOT 07 are live</h2>
          <p className="rt-tickets-sub">
            Four days, one pass. Early-bird pricing holds until Friday, then it goes up and we don&apos;t feel bad
            about it.
          </p>
          {signed ? (
            <p className="rt-tickets-done" role="status">
              See you in May. Check your inbox for the reservation.
            </p>
          ) : (
            <form
              className="rt-form"
              onSubmit={(e) => {
                e.preventDefault()
                setSigned(true)
              }}
            >
              <label className="rt-visually-hidden" htmlFor="rt-email">
                Email address
              </label>
              <input
                id="rt-email"
                className="rt-input"
                type="email"
                required
                placeholder="you@studio.com"
                autoComplete="email"
              />
              <button className="rt-btn rt-btn-lg rt-form-btn" type="submit">
                Hold my spot
              </button>
            </form>
          )}
          <p className="rt-tickets-note">Group rates for studios of five or more. Students get in for a tenner.</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="rt-footer">
        <div className="rt-footer-cols">
          <div className="rt-footer-col">
            <h3 className="rt-footer-h">Festival</h3>
            <a href="#programme">Programme</a>
            <a href="#tickets">Tickets</a>
            <a href="#manifesto">Manifesto</a>
          </div>
          <div className="rt-footer-col">
            <h3 className="rt-footer-h">Studio</h3>
            <a href="#work">Work</a>
            <a href="#tickets">Hire us</a>
            <a href="#top">About</a>
          </div>
          <div className="rt-footer-col">
            <h3 className="rt-footer-h">Follow</h3>
            <a href="#top">Instagram</a>
            <a href="#top">Newsletter</a>
            <a href="#top">Say hello</a>
          </div>
        </div>
        <p className="rt-footer-line">
          RIOT is a design festival, and a studio, based wherever there&apos;s an argument worth having.
        </p>
        <div className="rt-footer-word" aria-hidden="true">
          RIOT
        </div>
      </footer>

    </div>
  )
}

const css = `
.riot-root {
  --paper: #eee7d9;
  --paper-hi: #f7f3ea;
  --ink: #141414;
  --blue: #2b34ff;
  --blue-deep: #1c25e6;
  --hot: #ff3a1f;
  --line: rgba(20, 20, 20, 0.16);
  --line-soft: rgba(20, 20, 20, 0.09);
  background: var(--paper);
  color: var(--ink);
  font-family: var(--font-inter), system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
  line-height: 1.55;
  overflow-x: hidden;
}
.riot-root *,
.riot-root *::before,
.riot-root *::after { box-sizing: border-box; }
.riot-root ::selection { background: var(--blue); color: var(--paper-hi); }
.riot-root a { color: inherit; }
.riot-root a:focus-visible,
.riot-root button:focus-visible,
.riot-root input:focus-visible {
  outline: 3px solid var(--blue);
  outline-offset: 3px;
}

.rt-word {
  font-family: var(--font-geist), system-ui, sans-serif;
  font-weight: 900;
  font-variation-settings: "wght" 900;
  letter-spacing: -0.04em;
  text-decoration: none;
  font-size: 1.5rem;
  line-height: 1;
}

/* BUTTONS */
.rt-btn {
  display: inline-flex; align-items: center; justify-content: center;
  background: var(--blue); color: var(--paper-hi);
  font-family: var(--font-geist), system-ui, sans-serif;
  font-weight: 700; font-variation-settings: "wght" 700;
  border: none; cursor: pointer; text-decoration: none;
  border-radius: 2px; letter-spacing: -0.01em;
  padding: 0.72rem 1.1rem; font-size: 0.98rem;
  transition: transform 0.28s cubic-bezier(0.2, 0.8, 0.2, 1), background 0.28s;
}
.rt-btn:hover { transform: translateY(-2px); background: var(--blue-deep); }
.rt-btn:active { transform: translateY(0); }
.rt-btn-lg { padding: 1rem 1.7rem; font-size: 1.12rem; }
.rt-btn-sm { padding: 0.5rem 0.95rem; font-size: 0.9rem; }

/* TICKER */
.rt-ticker {
  background: var(--blue); color: var(--paper-hi);
  overflow: hidden; border-bottom: 2px solid var(--ink);
}
.rt-ticker-track { display: flex; width: max-content; }
.rt-ticker-track.is-run { animation: rtMarquee 26s linear infinite; }
.rt-ticker-seg { display: flex; flex: 0 0 auto; }
.rt-ti-item {
  display: inline-flex; align-items: center; gap: 1.1rem;
  padding: 0.5rem 1.1rem;
  font-family: var(--font-geist-mono), ui-monospace, monospace;
  font-size: 0.82rem; white-space: nowrap;
}
.rt-ti-text { opacity: 0.96; }
.rt-ast { color: var(--paper-hi); font-size: 0.7rem; opacity: 0.85; }
@keyframes rtMarquee { from { transform: translate3d(0,0,0); } to { transform: translate3d(-50%,0,0); } }

/* NAV */
.rt-nav {
  position: sticky; top: 0; z-index: 60;
  display: flex; align-items: center; justify-content: space-between;
  gap: 1rem;
  padding: 0.9rem clamp(1.1rem, 4vw, 3rem);
  background: var(--paper);
  border-bottom: 2px solid var(--ink);
}
.rt-nav-links { display: flex; align-items: center; gap: clamp(1rem, 2.4vw, 2rem); }
.rt-nav-links a {
  text-decoration: none; font-size: 0.98rem; font-weight: 500;
  color: var(--ink);
}
.rt-nav-links a:not(.rt-btn) { position: relative; }
.rt-nav-links a:not(.rt-btn)::after {
  content: ""; position: absolute; left: 0; right: 100%; bottom: -3px;
  height: 2px; background: var(--blue); transition: right 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.rt-nav-links a:not(.rt-btn):hover::after { right: 0; }
@media (max-width: 620px) { .rt-nav-links a:not(.rt-btn) { display: none; } }

/* HERO */
.rt-hero {
  padding: clamp(2.5rem, 7vw, 6rem) clamp(1.1rem, 4vw, 3rem) clamp(3rem, 8vw, 6rem);
  border-bottom: 2px solid var(--ink);
}
.rt-hero-inner { max-width: min(96vw, 90rem); margin: 0 auto; }
.rt-stamp {
  font-family: var(--font-geist-mono), ui-monospace, monospace;
  font-size: 0.9rem; color: var(--ink); opacity: 0.7;
  margin: 0 0 clamp(1.2rem, 3vw, 2.4rem);
}
.rt-hero-title {
  margin: 0;
  font-family: var(--font-geist), system-ui, sans-serif;
  font-weight: 850;
  line-height: 0.86;
  letter-spacing: -0.045em;
  text-transform: none;
  font-size: clamp(3.4rem, 15.5vw, 15rem);
}
.rt-line { display: flex; flex-wrap: wrap; gap: 0.26em; align-items: baseline; }
.rt-wordgrp { display: inline-flex; }
.rt-ch {
  display: inline-block;
  font-variation-settings: "wght" 850;
  font-weight: 850;
  color: var(--ink);
  opacity: 0;
  transform: translateY(0.55em);
  transition: font-variation-settings 0.35s cubic-bezier(0.2, 0.8, 0.2, 1), color 0.35s;
  will-change: font-variation-settings;
}
.rt-hero-title.rt-in .rt-ch {
  animation: rtCharIn 0.72s cubic-bezier(0.16, 1, 0.3, 1) both;
  animation-delay: calc(var(--i) * 0.028s);
}
.rt-ch:hover { font-variation-settings: "wght" 900; color: var(--blue); }
.rt-ch-quiet {
  font-variation-settings: "wght" 220;
  font-weight: 220;
  color: var(--blue);
  font-style: italic;
}
.rt-ch-quiet:hover { font-variation-settings: "wght" 900; color: var(--ink); }
@keyframes rtCharIn { from { opacity: 0; transform: translateY(0.6em); } to { opacity: 1; transform: none; } }

.rt-lede {
  max-width: 42rem;
  margin: clamp(1.6rem, 4vw, 3rem) 0 0;
  font-size: clamp(1.1rem, 1.9vw, 1.5rem);
  line-height: 1.4;
  color: var(--ink);
}
.rt-hero-cta {
  display: flex; align-items: center; flex-wrap: wrap; gap: 1.2rem;
  margin-top: clamp(1.6rem, 3.5vw, 2.6rem);
}
.rt-hero-note {
  margin: 0; font-size: 0.98rem; opacity: 0.72; max-width: 22rem;
}

@media (prefers-reduced-motion: reduce) {
  .rt-ticker-track.is-run { animation: none; }
  .rt-hero-title.rt-in .rt-ch { animation: none; }
  .rt-ch { opacity: 1; transform: none; transition: none; }
  .rt-nav-links a:not(.rt-btn)::after { transition: none; }
  .rt-btn { transition: none; }
}

/* PROGRAMME */
.rt-prog { padding: clamp(3.5rem, 8vw, 7rem) 0 0; }
.rt-prog-head {
  max-width: min(96vw, 90rem); margin: 0 auto;
  padding: 0 clamp(1.1rem, 4vw, 3rem) clamp(1.5rem, 4vw, 2.8rem);
}
.rt-h2 {
  font-family: var(--font-geist), system-ui, sans-serif;
  font-weight: 800; font-variation-settings: "wght" 800;
  font-size: clamp(2rem, 5.5vw, 4rem); line-height: 0.95;
  letter-spacing: -0.04em; margin: 0 0 0.7rem;
}
.rt-prog-sub { margin: 0; max-width: 34rem; font-size: 1.05rem; opacity: 0.75; }
.rt-prog-list { border-top: 2px solid var(--ink); }
.rt-row {
  display: flex; align-items: center; justify-content: space-between; gap: 1.5rem;
  padding: clamp(1.3rem, 3.4vw, 2.7rem) clamp(1.1rem, 4vw, 3rem);
  border-bottom: 2px solid var(--ink);
  transform-origin: left center; will-change: transform;
  transition: background 0.3s, color 0.3s;
}
.rt-row:hover { background: var(--ink); color: var(--paper); }
.rt-row-main { display: flex; align-items: baseline; gap: clamp(0.8rem, 2vw, 1.8rem); min-width: 0; }
.rt-row-fmt {
  flex: 0 0 auto;
  font-family: var(--font-geist-mono), ui-monospace, monospace;
  font-size: 0.85rem; opacity: 0.7; padding-top: 0.4em;
}
.rt-row-name {
  margin: 0;
  font-family: var(--font-geist), system-ui, sans-serif;
  font-weight: 750; font-variation-settings: "wght" 750;
  font-size: clamp(1.6rem, 5.2vw, 4.4rem); line-height: 0.98;
  letter-spacing: -0.035em;
}
.rt-row:hover .rt-row-name { font-variation-settings: "wght" 880; }
.rt-row-meta {
  flex: 0 0 auto; display: flex; flex-direction: column; align-items: flex-end;
  gap: 0.15rem; text-align: right;
}
.rt-row-field {
  font-family: var(--font-geist), system-ui, sans-serif;
  font-weight: 700; font-variation-settings: "wght" 700;
  font-size: clamp(1rem, 1.6vw, 1.25rem); color: var(--blue); letter-spacing: -0.01em;
}
.rt-row:hover .rt-row-field { color: var(--hot); }
.rt-row-room { font-size: 0.9rem; opacity: 0.65; }
@media (max-width: 620px) {
  .rt-row { flex-direction: column; align-items: flex-start; gap: 0.5rem; }
  .rt-row-meta { flex-direction: row; align-items: baseline; gap: 0.8rem; }
}
@media (prefers-reduced-motion: reduce) {
  .rt-row { transform: none !important; transition: background 0.3s, color 0.3s; }
}

/* RIBBONS */
.rt-ribbons { border-top: 2px solid var(--ink); }
.rt-ribbon { overflow: hidden; border-bottom: 2px solid var(--ink); }
.rt-ribbon-track { display: flex; width: max-content; will-change: transform; }
.rt-ribbon-seg { display: flex; flex: 0 0 auto; align-items: center; }

.rt-ribbon-word { background: var(--paper); }
.rt-rib-word {
  display: inline-block; white-space: nowrap;
  font-family: var(--font-geist), system-ui, sans-serif;
  font-weight: 900; font-variation-settings: "wght" 900;
  font-size: clamp(2.4rem, 7vw, 6rem); line-height: 1.1;
  letter-spacing: -0.04em; padding: 0.35em 0;
  color: var(--ink);
}
.rt-rib-star { color: var(--hot); }

.rt-ribbon-logos { background: var(--blue); }
.rt-rib-logos-grp { display: inline-flex; align-items: center; }
.rt-rib-logo {
  display: inline-block; white-space: nowrap;
  font-family: var(--font-geist), system-ui, sans-serif;
  font-weight: 800; font-variation-settings: "wght" 800;
  font-size: clamp(1.3rem, 3vw, 2.4rem); letter-spacing: -0.02em;
  color: var(--paper-hi); opacity: 0.92;
  padding: 0.7rem clamp(1.2rem, 3vw, 2.6rem);
}

.rt-ribbon-work { background: var(--paper-hi); }
.rt-rib-work-grp { display: inline-flex; align-items: stretch; }
.rt-tile {
  display: inline-flex; flex-direction: column; justify-content: space-between;
  white-space: normal;
  width: clamp(13rem, 22vw, 18rem); min-height: clamp(8rem, 13vw, 11rem);
  margin: clamp(1rem, 2vw, 1.6rem); padding: 1.1rem 1.2rem;
  border: 2px solid var(--ink); border-radius: 2px;
}
.rt-tile-0 { background: var(--blue); color: var(--paper-hi); border-color: var(--blue); }
.rt-tile-1 { background: var(--paper); color: var(--ink); }
.rt-tile-2 { background: var(--ink); color: var(--paper); border-color: var(--ink); }
.rt-tile-3 { background: var(--hot); color: var(--ink); border-color: var(--hot); }
.rt-tile-k {
  font-family: var(--font-geist-mono), ui-monospace, monospace;
  font-size: 0.78rem; opacity: 0.85;
}
.rt-tile-t {
  font-family: var(--font-geist), system-ui, sans-serif;
  font-weight: 750; font-variation-settings: "wght" 750;
  font-size: clamp(1.1rem, 1.7vw, 1.4rem); line-height: 1.05; letter-spacing: -0.02em;
}

/* STATS + VOICES */
.rt-stats-wrap { border-bottom: 2px solid var(--ink); }
.rt-stats {
  display: grid; grid-template-columns: repeat(4, 1fr);
}
.rt-stat {
  padding: clamp(2rem, 5vw, 4rem) clamp(1.1rem, 2.5vw, 2rem);
  border-right: 2px solid var(--ink); border-bottom: 2px solid var(--ink);
  display: flex; flex-direction: column; gap: 0.5rem;
}
.rt-stat:last-child { border-right: none; }
.rt-stat-num {
  font-family: var(--font-geist), system-ui, sans-serif;
  font-weight: 850; font-variation-settings: "wght" 850;
  font-size: clamp(2.6rem, 7vw, 5.5rem); line-height: 0.9;
  letter-spacing: -0.05em; font-variant-numeric: tabular-nums;
}
.rt-stat:nth-child(2) .rt-stat-num { color: var(--blue); }
.rt-stat:nth-child(4) .rt-stat-num { color: var(--hot); }
.rt-stat-label { font-size: 0.95rem; opacity: 0.72; line-height: 1.3; max-width: 15rem; }
@media (max-width: 760px) {
  .rt-stats { grid-template-columns: repeat(2, 1fr); }
  .rt-stat:nth-child(2n) { border-right: none; }
}
@media (max-width: 440px) {
  .rt-stats { grid-template-columns: 1fr; }
  .rt-stat { border-right: none; }
}

.rt-voices {
  max-width: min(96vw, 66rem); margin: 0 auto;
  padding: clamp(2.5rem, 7vw, 6rem) clamp(1.1rem, 4vw, 3rem);
  display: flex; flex-direction: column; gap: clamp(1.5rem, 4vw, 2.5rem);
}
.rt-voices-quote { min-height: clamp(9rem, 22vw, 12rem); display: flex; }
.rt-voices-q { margin: 0; animation: rtFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) both; }
.rt-voices-q p {
  margin: 0 0 1.4rem;
  font-family: var(--font-geist), system-ui, sans-serif;
  font-weight: 500; font-variation-settings: "wght" 500;
  font-size: clamp(1.4rem, 3.6vw, 2.6rem); line-height: 1.18; letter-spacing: -0.025em;
}
.rt-voices-q cite { font-style: normal; display: flex; flex-direction: column; gap: 0.1rem; }
.rt-voices-who { font-weight: 700; font-size: 1.05rem; }
.rt-voices-role { opacity: 0.65; font-size: 0.95rem; }
.rt-voices-nav { display: flex; align-items: center; gap: 1.1rem; }
.rt-voices-arrow {
  width: 2.6rem; height: 2.6rem; flex: 0 0 auto;
  background: var(--paper); color: var(--ink);
  border: 2px solid var(--ink); border-radius: 2px; cursor: pointer;
  font-size: 1.5rem; line-height: 1; display: grid; place-items: center;
  transition: background 0.25s, color 0.25s;
}
.rt-voices-arrow:hover { background: var(--ink); color: var(--paper); }
.rt-dots { display: flex; gap: 0.5rem; }
.rt-dot {
  width: 0.85rem; height: 0.85rem; padding: 0; border-radius: 999px;
  border: 2px solid var(--ink); background: transparent; cursor: pointer;
  transition: background 0.25s;
}
.rt-dot.is-on { background: var(--blue); border-color: var(--blue); }
@keyframes rtFade { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
@media (prefers-reduced-motion: reduce) {
  .rt-voices-q { animation: none; }
  .rt-voices-arrow { transition: none; }
}

/* MANIFESTO */
.rt-mani {
  position: relative; overflow: hidden;
  background: var(--blue); color: var(--paper-hi);
  border-bottom: 2px solid var(--ink);
  padding: clamp(3.5rem, 10vw, 8rem) clamp(1.1rem, 4vw, 3rem);
}
.rt-mani-ed {
  position: absolute; right: -0.08em; bottom: -0.32em; margin: 0;
  font-family: var(--font-geist), system-ui, sans-serif;
  font-weight: 900; font-variation-settings: "wght" 900;
  font-size: clamp(16rem, 42vw, 42rem); line-height: 0.7;
  color: var(--blue-deep); letter-spacing: -0.06em; pointer-events: none;
  z-index: 0;
}
.rt-mani-inner {
  position: relative; z-index: 1; max-width: min(96vw, 62rem); margin: 0 auto;
  opacity: 0; transform: translateY(24px);
  transition: opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1), transform 0.9s cubic-bezier(0.16, 1, 0.3, 1);
}
.rt-mani-inner.rt-in { opacity: 1; transform: none; }
.rt-mani-kick {
  font-family: var(--font-geist-mono), ui-monospace, monospace;
  font-size: 0.9rem; opacity: 0.8; margin: 0 0 1.4rem;
}
.rt-mani-text {
  margin: 0;
  font-family: var(--font-geist), system-ui, sans-serif;
  font-weight: 650; font-variation-settings: "wght" 650;
  font-size: clamp(1.7rem, 5vw, 4rem); line-height: 1.08; letter-spacing: -0.035em;
}
.rt-mani-hot { color: var(--hot); }

/* TICKETS */
.rt-tickets {
  border-bottom: 2px solid var(--ink);
  padding: clamp(3.5rem, 9vw, 7rem) clamp(1.1rem, 4vw, 3rem);
}
.rt-tickets-inner { max-width: min(96vw, 56rem); margin: 0 auto; text-align: center; }
.rt-tickets-title {
  margin: 0 0 1rem;
  font-family: var(--font-geist), system-ui, sans-serif;
  font-weight: 850; font-variation-settings: "wght" 850;
  font-size: clamp(2.2rem, 7vw, 5.5rem); line-height: 0.92; letter-spacing: -0.045em;
}
.rt-tickets-sub { margin: 0 auto 2.2rem; max-width: 38rem; font-size: 1.1rem; opacity: 0.78; }
.rt-form {
  display: flex; gap: 0.7rem; max-width: 30rem; margin: 0 auto; flex-wrap: wrap;
}
.rt-input {
  flex: 1 1 14rem; min-width: 0;
  padding: 1rem 1.1rem; font-size: 1.05rem;
  background: var(--paper-hi); color: var(--ink);
  border: 2px solid var(--ink); border-radius: 2px;
  font-family: inherit;
}
.rt-input::placeholder { color: rgba(20, 20, 20, 0.45); }
.rt-form-btn { flex: 0 0 auto; }
.rt-tickets-done {
  font-family: var(--font-geist), system-ui, sans-serif;
  font-weight: 700; font-variation-settings: "wght" 700;
  font-size: 1.3rem; color: var(--blue); margin: 0.5rem 0 0;
}
.rt-tickets-note { margin: 1.6rem 0 0; font-size: 0.9rem; opacity: 0.6; }
.rt-visually-hidden {
  position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
  overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0;
}

/* FOOTER */
.rt-footer { padding: clamp(3rem, 6vw, 5rem) clamp(1.1rem, 4vw, 3rem) 0; overflow: hidden; }
.rt-footer-cols {
  display: flex; flex-wrap: wrap; gap: clamp(2rem, 8vw, 6rem);
  max-width: min(96vw, 90rem); margin: 0 auto;
}
.rt-footer-col { display: flex; flex-direction: column; gap: 0.55rem; }
.rt-footer-h {
  margin: 0 0 0.5rem;
  font-family: var(--font-geist-mono), ui-monospace, monospace;
  font-size: 0.85rem; font-weight: 500; opacity: 0.6; text-transform: none;
}
.rt-footer-col a { text-decoration: none; font-weight: 600; font-size: 1.05rem; width: fit-content; }
.rt-footer-col a:hover { color: var(--blue); }
.rt-footer-line {
  max-width: 34rem; margin: clamp(2.5rem, 6vw, 4rem) auto clamp(1.5rem, 4vw, 2.5rem) 0;
  font-size: 1.05rem; opacity: 0.7;
}
.rt-footer-word {
  font-family: var(--font-geist), system-ui, sans-serif;
  font-weight: 900; font-variation-settings: "wght" 900;
  font-size: clamp(6rem, 27vw, 26rem); line-height: 0.72;
  letter-spacing: -0.05em; color: var(--ink);
  margin: 0 0 -0.14em; user-select: none;
}

`
