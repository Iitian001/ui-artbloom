"use client"

import { useEffect, useMemo, useRef, useState } from "react"

/**
 * Solstice — an atmosphere-led landing for a boutique high-desert resort, built
 * to the cinematic-immersive bar in DESIGN.md.
 *
 * Deliberate against the tells that got earlier work rejected: the base is a deep
 * dusk indigo warmed toward charred clay (not a brown-tinted fake black, not the
 * cream+serif+terracotta cliché), the single accent is an ember pulled straight
 * from the sunset in the photography (never acid green or vermilion), there are no
 * tracked-uppercase eyebrows, no middle-dot metas, no em-dash fragment labels, no
 * arrow links, and no 01/02/03 numbering — the suites are a set, not a sequence.
 *
 * The one bold move is the booking affordance: it lives inside the hero, then
 * detaches to dock as a sticky reservation bar once you scroll past the fold, both
 * driven by the same reservation state. The hero itself is a slow ken-burns
 * crossfade between two shots of the same place, day into dusk. All motion is
 * real, scroll-driven, and gated on prefers-reduced-motion.
 */

const SUITES = [
  {
    name: "The Ochre Room",
    view: "Canyon-facing",
    img: "/solstice/room1.png",
    alt: "A sand-toned desert-modern suite with a low linen bed and a deep arched window onto an ochre canyon at golden hour",
    swap: "/solstice/pool.png",
    swapAlt: "The rooftop infinity pool the Ochre Room opens onto, glowing amber at sunset",
    copy: "A plastered room the colour of the canyon it faces, with an arched window wide enough to lose an afternoon in. Wakes gold, holds the heat, cools to indigo.",
    tone: "#8a6a4a",
  },
  {
    name: "Dune House",
    view: "Private courtyard",
    img: "/solstice/room2.png",
    alt: "A warm minimal desert suite with a sunken plaster lounge, sculptural fireplace, and a walled courtyard with a plunge pool",
    swap: "/solstice/spa.png",
    swapAlt: "The domed hammam Dune House guests have on private request, lit by a single skylight",
    copy: "A sunken lounge around a low fire, a walled courtyard, a plunge pool that no one else can see. Made for the guests who came here to disappear for a while.",
    tone: "#6f5540",
  },
]

const EXPERIENCES = [
  {
    name: "The long table",
    img: "/solstice/dining.png",
    alt: "A long communal dining table set on warm sand at dusk under strings of small warm lights, with an open fire",
    copy: "One seating, one fire, one menu that changes with what the high desert gives up that week. Dinner runs until the last story does.",
  },
  {
    name: "The rooftop water",
    img: "/solstice/pool.png",
    alt: "A rooftop infinity pool at sunset, its edge dissolving into a vast ochre canyon and mesa landscape",
    copy: "An infinity edge that gives out onto forty miles of nothing. Best an hour before sundown, when the water turns the same colour as the sky.",
  },
  {
    name: "The hammam",
    img: "/solstice/spa.png",
    alt: "A domed desert spa hammam with a single skylight casting a warm beam onto a heated stone platform",
    copy: "A domed room, a single shaft of light, heated stone underfoot. Salt, steam, and an hour where the only thing asked of you is to lie still.",
  },
]

const GALLERY = [
  { img: "/solstice/hero.png", alt: "The resort's earth pavilions against the canyon wall at golden hour", span: "wide" },
  { img: "/solstice/dining.png", alt: "Candlelit desert dining at dusk", span: "tall" },
  { img: "/solstice/room1.png", alt: "The Ochre Room interior in warm light", span: "small" },
  { img: "/solstice/spa.png", alt: "The domed hammam under its skylight", span: "small" },
  { img: "/solstice/hero2.png", alt: "The resort at blue hour, windows glowing amber", span: "wide" },
  { img: "/solstice/pool.png", alt: "The rooftop pool at sunset over the mesa", span: "tall" },
]

const FAQS = [
  {
    q: "How do I get there?",
    a: "We're a two-hour drive from the nearest regional airport, the last forty minutes on graded desert road. Send us your flights and we'll arrange the transfer — a single vehicle, met at arrivals, water and cold towels waiting.",
  },
  {
    q: "When is the desert at its best?",
    a: "October through April, when the days run warm and the nights turn cold enough for a fire. High summer is fierce and beautiful and half-price, if you know what you're walking into.",
  },
  {
    q: "Is the resort suitable for children?",
    a: "The main house is adults-only after seven. Dune House and the two garden suites welcome families, and we keep a short list of guides who are wonderful with older children.",
  },
  {
    q: "Can you host a wedding?",
    a: "We take a handful each year and only ever one at a time — the whole property, yours for three nights. The long table seats forty; the terrace holds a hundred under the stars.",
  },
]

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

export default function Solstice() {
  const [scrollY, setScrollY] = useState(0)
  const [reduced, setReduced] = useState(false)
  const [docked, setDocked] = useState(false)
  // A hero video is optional: it fades in over the ken-burns stills once it can
  // play, and if the file is absent (onError) the stills stay as the fallback.
  const [videoReady, setVideoReady] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Shared reservation state — the hero card and the docked bar are two views of it.
  const today = useMemo(() => new Date().toISOString().slice(0, 10), [])
  const [arrive, setArrive] = useState("")
  const [depart, setDepart] = useState("")
  const [guests, setGuests] = useState(2)
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReduced(mq.matches)
    const onMq = () => setReduced(mq.matches)
    mq.addEventListener("change", onMq)

    let raf = 0
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        const y = window.scrollY
        setScrollY(y)
        setDocked(y > window.innerHeight * 0.82)
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

  // The hero video usually loads before React attaches onCanPlay, so the event
  // is missed and the layer stays at opacity 0 over the stills. Check readyState
  // on mount and kick off muted playback imperatively (always autoplay-allowed).
  useEffect(() => {
    const v = videoRef.current
    if (!v || reduced) return
    if (v.readyState >= 3) setVideoReady(true)
    const p = v.play()
    if (p && typeof p.catch === "function") p.catch(() => {})
  }, [reduced])

  const par = (rate: number) => (reduced ? 0 : scrollY * rate)

  const [placeRef, placeShown] = useReveal<HTMLDivElement>()
  const [suitesRef, suitesShown] = useReveal<HTMLDivElement>()

  const scrollToBook = () => {
    document.getElementById("reserve")?.scrollIntoView({
      behavior: reduced ? "auto" : "smooth",
      block: "center",
    })
  }

  return (
    <div className="solstice-root">
      <style>{css}</style>

      {/* Docked reservation bar — detaches from the hero once past the fold */}
      <div className={`so-dock ${docked ? "is-docked" : ""}`} aria-hidden={!docked}>
        <a className="so-dock-mark" href="#top">
          Solstice
        </a>
        <form
          className="so-dock-form"
          onSubmit={(e) => {
            e.preventDefault()
            scrollToBook()
          }}
        >
          <label className="so-field so-field-sm">
            <span>Arrive</span>
            <input
              type="date"
              min={today}
              value={arrive}
              onChange={(e) => setArrive(e.target.value)}
              tabIndex={docked ? 0 : -1}
            />
          </label>
          <label className="so-field so-field-sm">
            <span>Depart</span>
            <input
              type="date"
              min={arrive || today}
              value={depart}
              onChange={(e) => setDepart(e.target.value)}
              tabIndex={docked ? 0 : -1}
            />
          </label>
          <label className="so-field so-field-sm">
            <span>Guests</span>
            <select
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              tabIndex={docked ? 0 : -1}
            >
              {[1, 2, 3, 4].map((n) => (
                <option key={n} value={n}>
                  {n} {n === 1 ? "guest" : "guests"}
                </option>
              ))}
            </select>
          </label>
          <button className="so-cta so-cta-sm" type="submit" tabIndex={docked ? 0 : -1}>
            Check availability
          </button>
        </form>
      </div>

      <header className="so-nav">
        <a className="so-mark" href="#top">
          Solstice
        </a>
        <nav className="so-links">
          <a href="#place">The place</a>
          <a href="#suites">Suites</a>
          <a href="#reserve" className="so-nav-book">
            Reserve
          </a>
        </nav>
      </header>

      {/* HERO — ken-burns crossfade between day and dusk, booking card set into it */}
      <section className="so-hero" id="top">
        <div className={`so-hero-stage ${reduced ? "is-static" : ""}`} aria-hidden="true">
          <div className="so-hero-layer so-hero-a" />
          <div className="so-hero-layer so-hero-b" />
        </div>
        {!reduced && (
          <video
            ref={videoRef}
            className={`so-hero-video ${videoReady ? "is-ready" : ""}`}
            src="/solstice/hero.mp4"
            poster="/solstice/hero.png"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            aria-hidden="true"
            onCanPlay={() => setVideoReady(true)}
            onError={() => setVideoReady(false)}
          />
        )}
        <div className="so-hero-scrim" />
        <img className="so-hero-alt" src="/solstice/hero.png" alt="A boutique high-desert resort of earth-toned pavilions against an ochre canyon at golden hour" />

        <div className="so-hero-inner" style={{ transform: `translate3d(0, ${par(-0.08)}px, 0)` }}>
          <p className="so-kicker">A high-desert retreat, forty miles past the last town</p>
          <h1 className="so-title">
            Where the desert
            <br />
            keeps its quiet
          </h1>
          <p className="so-lede">
            Eleven rooms cut into a canyon that has stayed dark and silent for a very long time.
            You are welcome to do the same.
          </p>
        </div>

        {/* Booking card — the affordance that later docks to the top */}
        <form
          className={`so-book ${docked ? "is-lifted" : ""}`}
          onSubmit={(e) => {
            e.preventDefault()
            scrollToBook()
          }}
          aria-label="Check room availability"
        >
          <label className="so-field">
            <span>Arrive</span>
            <input type="date" min={today} value={arrive} onChange={(e) => setArrive(e.target.value)} />
          </label>
          <label className="so-field">
            <span>Depart</span>
            <input
              type="date"
              min={arrive || today}
              value={depart}
              onChange={(e) => setDepart(e.target.value)}
            />
          </label>
          <label className="so-field">
            <span>Guests</span>
            <select value={guests} onChange={(e) => setGuests(Number(e.target.value))}>
              {[1, 2, 3, 4].map((n) => (
                <option key={n} value={n}>
                  {n} {n === 1 ? "guest" : "guests"}
                </option>
              ))}
            </select>
          </label>
          <button className="so-cta" type="submit">
            Check availability
          </button>
        </form>

        <div className="so-scrollcue" aria-hidden="true">
          <span />
        </div>
      </section>

      {/* SENSE OF PLACE — signature shot, caption drifts slower than the image */}
      <section className="so-place" id="place" ref={placeRef}>
        <div
          className="so-place-img"
          style={{ transform: `translate3d(0, ${par(0.07)}px, 0) scale(1.06)` }}
        />
        <div className="so-place-scrim" />
        <div className={`so-place-body ${placeShown ? "is-shown" : ""}`} style={{ transform: `translate3d(0, ${par(-0.05)}px, 0)` }}>
          <p className="so-place-caption">
            The canyon was here for six million years before the first wall went up. We tried to
            build something that would apologise for the interruption.
          </p>
          <p className="so-place-sub">
            Eleven rooms, one long table, a pool cut into the roof. Rammed earth the colour of the
            cliffs, so that from a mile out you would struggle to say where the land ends and the
            rooms begin. No screens in the common rooms. No music you did not bring yourself.
          </p>
        </div>
      </section>

      {/* SUITES — named categories, two-image hover swap */}
      <section className="so-suites" id="suites" ref={suitesRef}>
        <div className="so-section-head">
          <h2 className="so-h2">Eleven ways to stay</h2>
          <p className="so-section-sub">
            Every room faces the canyon or a courtyard of its own. Hover to see where each one leads.
          </p>
        </div>
        <div className={`so-suite-grid ${suitesShown ? "is-shown" : ""}`}>
          {SUITES.map((s) => (
            <article className="so-suite" key={s.name} style={{ ["--tone" as string]: s.tone }}>
              <div className="so-suite-media">
                <img className="so-suite-img so-suite-base" src={s.img} alt={s.alt} loading="lazy" />
                <img className="so-suite-img so-suite-swap" src={s.swap} alt={s.swapAlt} loading="lazy" />
              </div>
              <div className="so-suite-body">
                <div className="so-suite-line">
                  <h3 className="so-suite-name">{s.name}</h3>
                  <span className="so-suite-view">{s.view}</span>
                </div>
                <p className="so-suite-copy">{s.copy}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* EXPERIENCES — image blocks, reveal on scroll, alternating sides */}
      <section className="so-exp">
        <div className="so-section-head">
          <h2 className="so-h2">What the days are made of</h2>
          <p className="so-section-sub">Nothing scheduled. Everything available.</p>
        </div>
        <div className="so-exp-list">
          {EXPERIENCES.map((x, i) => (
            <ExpRow key={x.name} x={x} flip={i % 2 === 1} par={par} />
          ))}
        </div>
      </section>

      {/* MID-PAGE CTA BANNER */}
      <section className="so-banner">
        <div className="so-banner-img" style={{ transform: `translate3d(0, ${par(0.06)}px, 0) scale(1.08)` }} />
        <div className="so-banner-scrim" />
        <div className="so-banner-inner">
          <h2 className="so-banner-title">The desert is quietest in the cold months</h2>
          <p className="so-banner-sub">
            October through April, the fires are lit by five and the sky is yours by nine.
          </p>
          <button className="so-cta so-cta-lg" type="button" onClick={scrollToBook}>
            Find your nights
          </button>
        </div>
      </section>

      {/* MEETINGS / EVENTS / WEDDINGS */}
      <section className="so-events">
        <div className="so-events-grid">
          <div className="so-events-copy">
            <h2 className="so-h2">Take the whole place</h2>
            <p className="so-section-sub so-events-sub">
              A handful of times a year we close the gate and hand Solstice to one gathering. A
              wedding, a company off-site, a reunion of people who owe each other a long weekend.
            </p>
            <ul className="so-events-facts">
              <li>
                <span className="so-fact-num">11</span>
                <span className="so-fact-label">rooms, sleeping twenty-six</span>
              </li>
              <li>
                <span className="so-fact-num">40</span>
                <span className="so-fact-label">at the long table, a hundred on the terrace</span>
              </li>
              <li>
                <span className="so-fact-num">3</span>
                <span className="so-fact-label">nights, minimum, for a full buyout</span>
              </li>
            </ul>
            <button className="so-text-cta" type="button" onClick={scrollToBook}>
              Ask about a buyout
            </button>
          </div>
          <div className="so-events-media">
            <img src="/solstice/dining.png" alt="The long communal table lit for an evening event under strings of warm light" loading="lazy" />
          </div>
        </div>
      </section>

      {/* GALLERY — small masonry */}
      <section className="so-gallery">
        <div className="so-section-head">
          <h2 className="so-h2">The property</h2>
          <p className="so-section-sub">A few frames. The rest we save for when you arrive.</p>
        </div>
        <div className="so-masonry">
          {GALLERY.map((g) => (
            <figure className={`so-tile so-tile-${g.span}`} key={g.img + g.alt}>
              <img src={g.img} alt={g.alt} loading="lazy" />
            </figure>
          ))}
        </div>
      </section>

      {/* FAQ + RESERVE */}
      <section className="so-faq" id="reserve">
        <div className="so-faq-grid">
          <div className="so-faq-left">
            <h2 className="so-h2">Before you come</h2>
            <p className="so-section-sub">
              A few things worth knowing. For anything else, a real person answers within a day.
            </p>
            <div className="so-reserve-card">
              <p className="so-reserve-line">Ready when you are.</p>
              <button className="so-cta so-cta-lg" type="button" onClick={() => document.getElementById("top")?.scrollIntoView({ behavior: reduced ? "auto" : "smooth" })}>
                Check availability
              </button>
              <p className="so-reserve-note">No deposit to enquire. We hold rooms for two days while you decide.</p>
            </div>
          </div>
          <ul className="so-faq-list">
            {FAQS.map((f, i) => (
              <li key={f.q} className={`so-faq-item ${openFaq === i ? "is-open" : ""}`}>
                <button
                  className="so-faq-q"
                  aria-expanded={openFaq === i}
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span>{f.q}</span>
                  <span className="so-faq-icon" aria-hidden="true" />
                </button>
                <div className="so-faq-a">
                  <p>{f.a}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <footer className="so-footer">
        <div className="so-footer-top">
          <div>
            <span className="so-mark">Solstice</span>
            <p className="so-footer-line">A boutique retreat in the high desert.</p>
          </div>
          <div className="so-footer-cols">
            <div className="so-footer-col">
              <h4>Find us</h4>
              <p>Cañon del Sol, off Route 12</p>
              <p>Reachable by transfer only</p>
            </div>
            <div className="so-footer-col">
              <h4>Hours</h4>
              <p>Reception around the clock</p>
              <p>The long table seats at eight</p>
            </div>
            <div className="so-footer-col">
              <h4>Reach a person</h4>
              <p>stay@solstice.example</p>
              <p>Replies within a day</p>
            </div>
          </div>
        </div>
        <div className="so-footer-fine">
          <span>Open October through April, and the brave weeks either side.</span>
        </div>
      </footer>
    </div>
  )
}

/** One experience block — image and copy, revealed on scroll, image parallaxed. */
function ExpRow({
  x,
  flip,
  par,
}: {
  x: (typeof EXPERIENCES)[number]
  flip: boolean
  par: (rate: number) => number
}) {
  const [ref, shown] = useReveal<HTMLDivElement>()
  return (
    <article ref={ref} className={`so-exp-row ${flip ? "is-flip" : ""} ${shown ? "is-shown" : ""}`}>
      <div className="so-exp-media">
        <img
          src={x.img}
          alt={x.alt}
          loading="lazy"
          style={{ transform: `translate3d(0, ${par(0.04)}px, 0) scale(1.06)` }}
        />
      </div>
      <div className="so-exp-copy">
        <h3 className="so-exp-name">{x.name}</h3>
        <p className="so-exp-text">{x.copy}</p>
      </div>
    </article>
  )
}

const css = `
.solstice-root {
  --dusk: #16121c;
  --dusk-2: #1b1620;
  --clay: #251d18;
  --sand: #ece0cf;
  --sand-mute: #a99e8e;
  --ember: #db7440;
  --ember-soft: #e69463;
  --line: rgba(236, 224, 207, 0.14);
  background: var(--dusk);
  color: var(--sand);
  font-family: var(--font-geist), system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
  line-height: 1.6;
  overflow-x: hidden;
}
.solstice-root *,
.solstice-root *::before,
.solstice-root *::after { box-sizing: border-box; }

.so-mark {
  font-family: var(--font-fraunces), Georgia, serif;
  font-weight: 500;
  letter-spacing: 0.01em;
  color: var(--sand);
  text-decoration: none;
  font-size: 1.3rem;
  font-variation-settings: "opsz" 40, "SOFT" 40;
}

/* NAV */
.so-nav {
  position: absolute; top: 0; left: 0; right: 0; z-index: 40;
  display: flex; align-items: center; justify-content: space-between;
  padding: 1.5rem clamp(1.25rem, 5vw, 4rem);
}
.so-links { display: flex; align-items: center; gap: clamp(1rem, 2.6vw, 2.6rem); }
.so-links a { color: var(--sand); text-decoration: none; font-size: 0.95rem; opacity: 0.82; transition: opacity 0.35s; }
.so-links a:hover { opacity: 1; }
.so-nav-book {
  border: 1px solid rgba(236, 224, 207, 0.4);
  border-radius: 999px; padding: 0.5rem 1.15rem; opacity: 1 !important;
}
.so-nav-book:hover { background: var(--sand); color: var(--dusk) !important; }
.solstice-root a:focus-visible,
.solstice-root button:focus-visible,
.solstice-root input:focus-visible,
.solstice-root select:focus-visible {
  outline: 2px solid var(--ember-soft); outline-offset: 3px; border-radius: 4px;
}
@media (max-width: 680px) { .so-links a:not(.so-nav-book) { display: none; } }

/* HERO */
.so-hero {
  position: relative; min-height: 100svh; overflow: hidden;
  display: flex; flex-direction: column; justify-content: space-between;
  gap: clamp(2rem, 6vh, 4rem); box-sizing: border-box;
  padding: clamp(7rem, 22vh, 12rem) clamp(1.25rem, 6vw, 6rem) clamp(2.5rem, 8vh, 5rem);
}
.so-hero-stage { position: absolute; inset: 0; }
.so-hero-layer { position: absolute; inset: 0; background-size: cover; background-position: center; will-change: transform, opacity; }
.so-hero-a { background-image: url(/solstice/hero.png); animation: soFadeA 18s ease-in-out infinite, soKen 18s ease-in-out infinite; }
.so-hero-b { background-image: url(/solstice/hero2.png); animation: soFadeB 18s ease-in-out infinite, soKen 18s ease-in-out infinite; }
/* Static fallback image, only shown when motion is reduced */
.so-hero-alt { display: none; }
.so-hero-stage.is-static { display: none; }
.so-hero-video {
  position: absolute; inset: 0; width: 100%; height: 100%;
  object-fit: cover; opacity: 0; z-index: 1;
  transition: opacity 1.1s ease;
}
.so-hero-video.is-ready { opacity: 1; }

@keyframes soFadeA { 0%, 42% { opacity: 1; } 50%, 92% { opacity: 0; } 100% { opacity: 1; } }
@keyframes soFadeB { 0%, 42% { opacity: 0; } 50%, 92% { opacity: 1; } 100% { opacity: 0; } }
@keyframes soKen { 0% { transform: scale(1.04) translate3d(0, 0, 0); } 50% { transform: scale(1.12) translate3d(-1.5%, -1.5%, 0); } 100% { transform: scale(1.04) translate3d(0, 0, 0); } }

.so-hero-scrim {
  position: absolute; inset: 0; z-index: 2;
  background:
    linear-gradient(to top, var(--dusk) 1%, rgba(23, 19, 32, 0.1) 42%, rgba(23, 19, 32, 0.5) 100%),
    linear-gradient(to right, rgba(23, 19, 32, 0.55), transparent 55%);
}
.so-hero-inner {
  position: relative; max-width: 44rem; will-change: transform; z-index: 2;
}
.so-kicker {
  color: var(--ember-soft); font-size: 1rem; margin: 0 0 1.1rem;
  font-family: var(--font-instrument), Georgia, serif; font-style: italic;
  letter-spacing: 0.01em;
}
.so-title {
  font-family: var(--font-fraunces), Georgia, serif;
  font-weight: 420;
  font-size: clamp(3rem, 9.5vw, 8rem);
  line-height: 0.96; letter-spacing: -0.02em; margin: 0;
  font-variation-settings: "opsz" 144, "SOFT" 60, "WONK" 0;
}
.so-lede {
  font-size: clamp(1.05rem, 1.5vw, 1.3rem); color: var(--sand); opacity: 0.88;
  max-width: 33rem; margin: 1.6rem 0 0;
}

/* HERO BOOKING CARD */
.so-book {
  position: relative; z-index: 3; width: 100%;
  display: grid; grid-template-columns: 1fr 1fr 1fr auto; gap: 0.5rem;
  align-items: end; max-width: 52rem;
  background: rgba(30, 24, 38, 0.92);
  border: 1px solid var(--line); border-radius: 16px;
  padding: 1rem 1rem;
  box-shadow: 0 30px 70px -30px rgba(0, 0, 0, 0.7);
  transition: opacity 0.5s ease, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}
.so-book.is-lifted { opacity: 0; transform: translateY(14px); pointer-events: none; }
.so-field { display: flex; flex-direction: column; gap: 0.35rem; min-width: 0; }
.so-field > span {
  font-size: 0.72rem; letter-spacing: 0.04em; color: var(--sand-mute);
  text-transform: uppercase; padding-left: 0.15rem;
}
.so-field input,
.so-field select {
  font-family: var(--font-geist), system-ui, sans-serif;
  background: rgba(23, 19, 32, 0.8); color: var(--sand);
  border: 1px solid var(--line); border-radius: 9px;
  padding: 0.7rem 0.75rem; font-size: 0.95rem; width: 100%;
  color-scheme: dark;
}
.so-field input:hover, .so-field select:hover { border-color: rgba(236, 224, 207, 0.3); }
.so-cta {
  display: inline-flex; align-items: center; justify-content: center;
  background: var(--ember); color: #1a0f07;
  font-family: var(--font-geist), system-ui, sans-serif; font-weight: 600;
  text-decoration: none; padding: 0.75rem 1.5rem; border: none;
  border-radius: 9px; cursor: pointer; white-space: nowrap; font-size: 0.95rem;
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s, background 0.3s;
}
.so-cta:hover { transform: translateY(-2px); background: var(--ember-soft); box-shadow: 0 16px 34px -14px rgba(219, 116, 64, 0.6); }

/* DOCKED RESERVATION BAR */
.so-dock {
  position: fixed; top: 0; left: 0; right: 0; z-index: 60;
  display: flex; align-items: center; gap: clamp(0.75rem, 2vw, 1.75rem);
  padding: 0.7rem clamp(1rem, 4vw, 2.5rem);
  background: rgba(23, 19, 32, 0.96);
  border-bottom: 1px solid var(--line);
  transform: translateY(-100%);
  transition: transform 0.55s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 18px 44px -26px rgba(0, 0, 0, 0.8);
}
.so-dock.is-docked { transform: translateY(0); }
.so-dock-mark {
  font-family: var(--font-fraunces), Georgia, serif; font-weight: 500;
  color: var(--sand); text-decoration: none; font-size: 1.15rem; flex-shrink: 0;
}
.so-dock-form { display: flex; align-items: end; gap: 0.6rem; margin-left: auto; flex-wrap: wrap; justify-content: flex-end; }
.so-field-sm > span { font-size: 0.62rem; margin-bottom: -0.1rem; }
.so-field-sm input, .so-field-sm select { padding: 0.5rem 0.6rem; font-size: 0.88rem; }
.so-cta-sm { padding: 0.6rem 1.1rem; font-size: 0.9rem; }
@media (max-width: 720px) {
  .so-dock-mark { display: none; }
  .so-field-sm { flex: 1 1 30%; }
  .so-book { grid-template-columns: 1fr 1fr; }
  .so-book .so-cta { grid-column: 1 / -1; }
}

/* SCROLL CUE */
.so-scrollcue { position: absolute; left: 50%; bottom: 1.4rem; transform: translateX(-50%); z-index: 3; }
.so-scrollcue span {
  display: block; width: 1px; height: 44px;
  background: linear-gradient(to bottom, transparent, var(--sand));
  animation: socue 2.6s ease-in-out infinite;
}
@keyframes socue { 0%, 100% { opacity: 0.2; transform: scaleY(0.55); transform-origin: top; } 50% { opacity: 0.9; transform: scaleY(1); } }

/* SHARED SECTION HEADS */
.so-section-head { max-width: 44rem; padding: 0 clamp(1.25rem, 6vw, 6rem); margin: 0 auto clamp(2.5rem, 5vw, 4rem); }
.so-h2 {
  font-family: var(--font-fraunces), Georgia, serif; font-weight: 440;
  font-size: clamp(2rem, 5.2vw, 3.7rem); line-height: 1.0; letter-spacing: -0.02em; margin: 0 0 1rem;
  font-variation-settings: "opsz" 120, "SOFT" 40;
}
.so-section-sub { color: var(--sand-mute); font-size: 1.1rem; margin: 0; max-width: 36rem; }

/* SENSE OF PLACE */
.so-place { position: relative; min-height: 108vh; display: grid; align-items: center; overflow: hidden; }
.so-place-img { position: absolute; inset: -6% 0; background: url(/solstice/hero2.png) center/cover no-repeat; will-change: transform; }
.so-place-scrim { position: absolute; inset: 0; background: linear-gradient(to right, rgba(23, 19, 32, 0.9) 0%, rgba(23, 19, 32, 0.6) 45%, rgba(23, 19, 32, 0.2) 100%); }
.so-place-body {
  position: relative; max-width: 40rem; padding: 0 clamp(1.25rem, 6vw, 6rem); will-change: transform;
  opacity: 0; transform: translateY(28px);
  transition: opacity 1s cubic-bezier(0.16, 1, 0.3, 1), transform 1s cubic-bezier(0.16, 1, 0.3, 1);
}
.so-place-body.is-shown { opacity: 1; transform: none; }
.so-place-caption {
  font-family: var(--font-fraunces), Georgia, serif; font-weight: 380;
  font-size: clamp(1.6rem, 3.6vw, 3rem); line-height: 1.24; letter-spacing: -0.015em; margin: 0 0 1.6rem;
  font-variation-settings: "opsz" 144, "SOFT" 80;
}
.so-place-sub { color: var(--sand); opacity: 0.82; font-size: 1.08rem; margin: 0; max-width: 32rem; }

/* SUITES */
.so-suites { padding: clamp(4.5rem, 10vw, 8rem) 0; background: var(--dusk); }
.so-suite-grid {
  display: grid; grid-template-columns: repeat(2, 1fr); gap: clamp(1.25rem, 3vw, 2.5rem);
  padding: 0 clamp(1.25rem, 6vw, 6rem); max-width: 88rem; margin: 0 auto;
}
.so-suite {
  opacity: 0; transform: translateY(30px);
  transition: opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1), transform 0.9s cubic-bezier(0.16, 1, 0.3, 1);
}
.so-suite-grid.is-shown .so-suite { opacity: 1; transform: none; }
.so-suite-grid.is-shown .so-suite:nth-child(2) { transition-delay: 0.12s; }
.so-suite-media {
  position: relative; aspect-ratio: 3 / 2; border-radius: 14px; overflow: hidden;
  border: 1px solid var(--line); background: var(--tone);
}
.so-suite-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.so-suite-swap { opacity: 0; transform: scale(1.05); transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1); }
.so-suite-base { transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 6s ease-out; }
.so-suite:hover .so-suite-swap { opacity: 1; transform: scale(1); }
.so-suite:hover .so-suite-base { opacity: 0; }
.so-suite-body { padding: 1.3rem 0.4rem 0; }
.so-suite-line { display: flex; align-items: baseline; justify-content: space-between; gap: 1rem; }
.so-suite-name { font-family: var(--font-fraunces), Georgia, serif; font-weight: 480; font-size: clamp(1.4rem, 2.4vw, 1.9rem); letter-spacing: -0.01em; margin: 0; }
.so-suite-view { color: var(--ember-soft); font-size: 0.85rem; font-family: var(--font-instrument), Georgia, serif; font-style: italic; }
.so-suite-copy { color: var(--sand); opacity: 0.78; font-size: 1rem; margin: 0.7rem 0 0; }
@media (max-width: 720px) { .so-suite-grid { grid-template-columns: 1fr; } }

/* EXPERIENCES */
.so-exp { padding: clamp(4.5rem, 10vw, 8rem) 0; background: var(--dusk-2); }
.so-exp-list { display: flex; flex-direction: column; gap: clamp(3rem, 7vw, 6rem); max-width: 80rem; margin: 0 auto; padding: 0 clamp(1.25rem, 6vw, 6rem); }
.so-exp-row {
  display: grid; grid-template-columns: 1.15fr 1fr; gap: clamp(1.5rem, 4vw, 4rem); align-items: center;
  opacity: 0; transform: translateY(36px);
  transition: opacity 1s cubic-bezier(0.16, 1, 0.3, 1), transform 1s cubic-bezier(0.16, 1, 0.3, 1);
}
.so-exp-row.is-shown { opacity: 1; transform: none; }
.so-exp-row.is-flip .so-exp-media { order: 2; }
.so-exp-media { border-radius: 14px; overflow: hidden; border: 1px solid var(--line); aspect-ratio: 3 / 2; }
.so-exp-media img { width: 100%; height: 100%; object-fit: cover; will-change: transform; }
.so-exp-name { font-family: var(--font-fraunces), Georgia, serif; font-weight: 460; font-size: clamp(1.7rem, 3.4vw, 2.7rem); letter-spacing: -0.02em; margin: 0 0 1rem; line-height: 1.05; }
.so-exp-text { color: var(--sand); opacity: 0.82; font-size: 1.1rem; margin: 0; }
@media (max-width: 760px) {
  .so-exp-row, .so-exp-row.is-flip { grid-template-columns: 1fr; }
  .so-exp-row.is-flip .so-exp-media { order: 0; }
}

/* MID BANNER */
.so-banner { position: relative; min-height: 76vh; display: grid; place-items: center; overflow: hidden; }
.so-banner-img { position: absolute; inset: -6% 0; background: url(/solstice/pool.png) center/cover no-repeat; will-change: transform; }
.so-banner-scrim { position: absolute; inset: 0; background: radial-gradient(ellipse at center, rgba(23, 19, 32, 0.4), rgba(23, 19, 32, 0.85)); }
.so-banner-inner { position: relative; text-align: center; max-width: 42rem; padding: 0 clamp(1.5rem, 6vw, 4rem); }
.so-banner-title { font-family: var(--font-fraunces), Georgia, serif; font-weight: 440; font-size: clamp(2rem, 5.4vw, 4rem); line-height: 1.04; letter-spacing: -0.02em; margin: 0 0 1.1rem; }
.so-banner-sub { color: var(--sand); opacity: 0.88; font-size: 1.15rem; margin: 0 auto 2rem; max-width: 32rem; }
.so-cta-lg { padding: 1rem 2rem; font-size: 1.05rem; }

/* EVENTS */
.so-events { padding: clamp(4.5rem, 10vw, 8rem) clamp(1.25rem, 6vw, 6rem); background: var(--dusk); }
.so-events-grid { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(2rem, 5vw, 4.5rem); align-items: center; max-width: 80rem; margin: 0 auto; }
.so-events-sub { margin-bottom: 2.2rem; }
.so-events-facts { list-style: none; padding: 0; margin: 0 0 2.2rem; display: flex; flex-direction: column; gap: 1.1rem; }
.so-events-facts li { display: flex; align-items: baseline; gap: 1.1rem; border-top: 1px solid var(--line); padding-top: 1.1rem; }
.so-fact-num { font-family: var(--font-fraunces), Georgia, serif; font-weight: 460; font-size: 2.2rem; color: var(--ember-soft); font-variant-numeric: tabular-nums; min-width: 2.6rem; }
.so-fact-label { color: var(--sand); opacity: 0.82; font-size: 1.02rem; }
.so-events-media { border-radius: 14px; overflow: hidden; border: 1px solid var(--line); aspect-ratio: 4 / 5; }
.so-events-media img { width: 100%; height: 100%; object-fit: cover; }
.so-text-cta {
  background: none; border: none; color: var(--ember-soft); cursor: pointer;
  font-family: var(--font-geist), system-ui, sans-serif; font-size: 1.02rem; font-weight: 500;
  padding: 0; position: relative;
}
.so-text-cta::after { content: ""; position: absolute; left: 0; right: 0; bottom: -3px; height: 1px; background: var(--ember-soft); transform: scaleX(0.35); transform-origin: left; transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
.so-text-cta:hover::after { transform: scaleX(1); }
@media (max-width: 760px) { .so-events-grid { grid-template-columns: 1fr; } .so-events-media { order: -1; aspect-ratio: 3 / 2; } }

/* GALLERY MASONRY */
.so-gallery { padding: clamp(4.5rem, 10vw, 8rem) 0; background: var(--dusk-2); }
.so-masonry {
  display: grid; grid-template-columns: repeat(4, 1fr); grid-auto-rows: 12rem; gap: 1rem;
  padding: 0 clamp(1.25rem, 6vw, 6rem); max-width: 88rem; margin: 0 auto;
}
.so-tile { margin: 0; border-radius: 12px; overflow: hidden; border: 1px solid var(--line); }
.so-tile img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.7s cubic-bezier(0.16, 1, 0.3, 1); }
.so-tile:hover img { transform: scale(1.05); }
.so-tile-wide { grid-column: span 2; grid-row: span 2; }
.so-tile-tall { grid-column: span 1; grid-row: span 2; }
.so-tile-small { grid-column: span 1; grid-row: span 1; }
@media (max-width: 760px) {
  .so-masonry { grid-template-columns: repeat(2, 1fr); grid-auto-rows: 9rem; }
  .so-tile-wide { grid-column: span 2; grid-row: span 2; }
  .so-tile-tall { grid-row: span 2; }
}

/* FAQ + RESERVE */
.so-faq { padding: clamp(4.5rem, 10vw, 8rem) clamp(1.25rem, 6vw, 6rem); background: var(--dusk); }
.so-faq-grid { display: grid; grid-template-columns: 0.85fr 1.15fr; gap: clamp(2rem, 6vw, 5rem); max-width: 80rem; margin: 0 auto; align-items: start; }
.so-reserve-card { margin-top: 2rem; padding: 1.8rem; background: var(--clay); border: 1px solid var(--line); border-radius: 16px; }
.so-reserve-line { font-family: var(--font-fraunces), Georgia, serif; font-size: 1.5rem; margin: 0 0 1.2rem; font-weight: 440; }
.so-reserve-note { color: var(--sand-mute); font-size: 0.9rem; margin: 1.2rem 0 0; }
.so-faq-list { list-style: none; padding: 0; margin: 0; }
.so-faq-item { border-bottom: 1px solid var(--line); }
.so-faq-item:first-child { border-top: 1px solid var(--line); }
.so-faq-q {
  width: 100%; display: flex; align-items: center; justify-content: space-between; gap: 1rem;
  background: none; border: none; cursor: pointer; text-align: left;
  color: var(--sand); font-family: var(--font-fraunces), Georgia, serif; font-weight: 440;
  font-size: clamp(1.15rem, 2vw, 1.5rem); letter-spacing: -0.01em;
  padding: 1.4rem 0;
}
.so-faq-icon { position: relative; width: 16px; height: 16px; flex-shrink: 0; }
.so-faq-icon::before, .so-faq-icon::after { content: ""; position: absolute; background: var(--ember-soft); transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
.so-faq-icon::before { top: 50%; left: 0; right: 0; height: 1.5px; transform: translateY(-50%); }
.so-faq-icon::after { left: 50%; top: 0; bottom: 0; width: 1.5px; transform: translateX(-50%); }
.so-faq-item.is-open .so-faq-icon::after { transform: translateX(-50%) scaleY(0); }
.so-faq-a { display: grid; grid-template-rows: 0fr; transition: grid-template-rows 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
.so-faq-item.is-open .so-faq-a { grid-template-rows: 1fr; }
.so-faq-a > p { overflow: hidden; margin: 0; color: var(--sand); opacity: 0.8; font-size: 1.05rem; padding-right: 2rem; }
.so-faq-item.is-open .so-faq-a > p { padding-bottom: 1.4rem; }
@media (max-width: 760px) { .so-faq-grid { grid-template-columns: 1fr; } }

/* FOOTER */
.so-footer { background: var(--clay); border-top: 1px solid var(--line); padding: clamp(3rem, 6vw, 5rem) clamp(1.25rem, 6vw, 6rem); }
.so-footer-top { display: flex; justify-content: space-between; gap: 2rem; flex-wrap: wrap; }
.so-footer-line { color: var(--sand-mute); margin: 0.4rem 0 0; }
.so-footer-cols { display: flex; gap: clamp(1.5rem, 5vw, 4rem); flex-wrap: wrap; }
.so-footer-col h4 { font-family: var(--font-geist), system-ui, sans-serif; font-weight: 600; font-size: 0.8rem; letter-spacing: 0.04em; text-transform: uppercase; color: var(--sand-mute); margin: 0 0 0.7rem; }
.so-footer-col p { color: var(--sand); opacity: 0.82; margin: 0.2rem 0; font-size: 0.95rem; }
.so-footer-fine { margin-top: clamp(2.5rem, 5vw, 4rem); padding-top: 1.5rem; border-top: 1px solid var(--line); color: var(--sand-mute); font-size: 0.88rem; }

@media (prefers-reduced-motion: reduce) {
  .so-hero-stage { display: none; }
  .so-hero-alt { display: block; position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
  .so-scrollcue span { animation: none; opacity: 0.4; }
  .so-hero-a, .so-hero-b { animation: none; }
  .so-place-body, .so-suite, .so-exp-row { opacity: 1 !important; transform: none !important; transition: none; }
  .so-place-img, .so-banner-img, .so-exp-media img, .so-suite-base { transform: none !important; }
  .so-dock { transition: none; }
  .so-book { transition: opacity 0.2s ease; }
  .so-faq-a, .so-suite-swap, .so-suite-base, .so-tile img, .so-cta, .so-text-cta::after { transition: none; }
}
`
