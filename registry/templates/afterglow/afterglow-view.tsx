"use client"

import { useEffect, useRef, useState } from "react"

/* -------------------------------------------------------------------------
   AFTERGLOW — prom-night view.

   MECHANIC (same family as ../sillage-lumen): dependency-free native
   `video.currentTime` scrubbing eased by a requestAnimationFrame loop toward
   a scroll-derived target, CSS sticky stage, duration captured with the
   cached-load readyState guard, prefers-reduced-motion static fallback.

   TWO THINGS THAT SET IT APART:
   1. It keeps the warm film WARM — a champagne grade, not a cool one — and
      the one luminous moment (a golden bloom) lands at the END, on the
      confetti finale, not the centre.
   2. When the scroll bottoms out, the film stops scrubbing and PLAYS ON A
      LOOP — the night keeps living. Scrolling back up hands control to the
      scrub again.

   Panels FADE THROUGH (never crossfade): each dissolves fully to the film
   before the next appears, so two centred lines never stack.
------------------------------------------------------------------------- */

type Beat = {
  key: string
  note: string
  title: string
  body: string
  still: string
}

const HERO = {
  eyebrow: "you're invited",
  wordmark: "Afterglow",
  tagline: "one night the whole year has been leaning toward",
  meta: "Senior Prom, Saturday the sixteenth of May. Doors open at eight."
}

/* the arc of the evening, riding the film's real light beats:
   arrival (blue hour) → the floor (warm peak) → the slow ones (dark warm) */
const BEATS: Beat[] = [
  {
    key: "arrival",
    note: "half past eight",
    title: "The arrival",
    body: "Headlights on the drive, a held breath at the door. The room goes quiet for a second when you walk in — then it doesn't.",
    still: "/afterglow/still-bluehour.jpg"
  },
  {
    key: "floor",
    note: "somewhere near eleven",
    title: "The floor",
    body: "The lights drop, the bass finds your chest, and the whole grade is one crowd. This is the part you'll be talking about for years.",
    still: "/afterglow/still-dance.jpg"
  },
  {
    key: "slow",
    note: "the last few songs",
    title: "The slow ones",
    body: "When the tempo finally falls and the room softens to gold. Whoever you came with, this is the one you stay for.",
    still: "/afterglow/still-slow.jpg"
  }
]

const CLOSING = {
  line: "Come be unforgettable.",
  cta: "reserve your spot"
}

/* ---- content below the film: the complete invitation ------------------- */

const THEME = {
  title: "A golden hour that doesn't end",
  body:
    "Afterglow is the light just after sunset — warm, gold, gone too soon, the one you always wish you'd stayed in longer. That's the night we're building: string lights and slow songs, the whole class in one room, an evening that keeps glowing long after you've gone home.",
  figure: "/afterglow/still-confetti.jpg"
}

/* a real sequence, so the clock earns its place as the structure */
type Moment = { time: string; title: string; detail: string }
const EVENING: Moment[] = [
  { time: "8:00", title: "Doors & red carpet", detail: "Arrivals, the photo wall, and a welcome mocktail bar." },
  { time: "8:45", title: "Dinner is served", detail: "A plated dinner with vegetarian and halal options." },
  { time: "9:30", title: "The floor opens", detail: "Live DJ set. Requests taken all night at the booth." },
  { time: "11:00", title: "Court & crowning", detail: "This year's prom court announced under the lights." },
  { time: "11:30", title: "The slow set", detail: "The tempo falls. Grab someone. Stay for it." },
  { time: "Midnight", title: "Confetti finale", detail: "The whole room, one last song, and a ceiling full of gold." }
]

/* the immersive breath between the schedule and the practicalities */
const BAND = {
  still: "/afterglow/still-slow.jpg",
  line: "Long after the lights come up, this is the part that stays with you."
}

const DETAILS = [
  { label: "When", value: "Saturday, May 16", sub: "Doors at eight, dancing till midnight" },
  { label: "Where", value: "The Grand Marigold", sub: "1400 Ellery Ave, downtown" },
  { label: "Dress", value: "Black tie, your way", sub: "Gowns, suits, however you shine" },
  { label: "Tickets", value: "$65 single", sub: "$120 a pair, on sale till May 9" }
]

const TICKETS = {
  title: "Get your tickets",
  body: "Sold through the front office and here online until May 9, or while they last. Tables of ten can be reserved together — bring the whole group.",
  tiers: [
    { name: "Single", price: "$65", detail: "one ticket, one unforgettable night" },
    { name: "Pair", price: "$120", detail: "two tickets, save fifteen" },
    { name: "Table of ten", price: "$560", detail: "reserve together, sit together" }
  ],
  cta: "reserve your spot"
}

const FOOTER = {
  statement: "Thrown by the Senior Class Committee, for the class that made it.",
  columns: [
    { head: "The night", links: ["Theme", "The evening", "Details", "Tickets"] },
    { head: "Good to know", links: ["Dress code", "Getting there", "Safe rides", "Accessibility"] },
    { head: "Ask us", links: ["Committee", "Email", "Instagram", "Front office"] }
  ],
  reminderNote: "We'll send one reminder before the night. Nothing else.",
  fine: "© Afterglow. Organised by the Senior Class Committee."
}

/** smoothstep — soft ends so the beats trade cleanly */
function smooth(t: number) {
  const x = Math.min(1, Math.max(0, t))
  return x * x * (3 - 2 * x)
}

export function AfterglowView() {
  const [reduced, setReduced] = useState(false)
  const [decided, setDecided] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    const apply = () => setReduced(mq.matches)
    apply()
    setDecided(true)
    mq.addEventListener?.("change", apply)
    return () => mq.removeEventListener?.("change", apply)
  }, [])

  if (decided && reduced) return <PromStatic />
  return <PromMotion />
}

/* ---- motion mode -------------------------------------------------------- */

/** past this scroll progress the finale has arrived — let the film play/loop */
const END = 0.995

function PromMotion() {
  const stageRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const panelsRef = useRef<HTMLDivElement>(null)
  const bloomRef = useRef<HTMLDivElement>(null)
  const cueRef = useRef<HTMLDivElement>(null)

  const durationRef = useRef(0)
  const targetTimeRef = useRef(0)
  const rafRef = useRef(0)
  const runningRef = useRef(false)
  const idleFramesRef = useRef(0)
  const playingRef = useRef(false) // true once the finale is playing on a loop

  useEffect(() => {
    const video = videoRef.current
    const stage = stageRef.current
    if (!video || !stage) return

    const captureDuration = () => {
      const d = video.duration
      if (Number.isFinite(d) && d > 0) durationRef.current = d
    }
    if (video.readyState >= 1) captureDuration()
    video.addEventListener("loadedmetadata", captureDuration)

    const tick = () => {
      const dur = durationRef.current
      const vh = window.innerHeight
      const rect = stage.getBoundingClientRect()
      const travel = rect.height - vh
      const progress = travel > 0 ? Math.min(1, Math.max(0, -rect.top / travel)) : 0

      // ---- video: scrub to scroll, then PLAY + LOOP once the finale lands ----
      // At the bottom of the scrub the film would otherwise freeze on its last
      // frame. Instead we let it play on its own in a loop — the confetti keeps
      // falling, the night keeps living. Scrolling back up drops progress below
      // END, so we pause, snap the frame to the scroll position, and hand
      // control back to the scrub.
      if (dur > 0) {
        if (progress >= END) {
          if (!playingRef.current) {
            playingRef.current = true
            video.loop = true
            const played = video.play()
            if (played && typeof played.catch === "function") played.catch(() => {})
          }
          idleFramesRef.current += 1 // native playback advances the film; rAF may idle
        } else {
          if (playingRef.current) {
            playingRef.current = false
            video.loop = false
            video.pause()
            try {
              video.currentTime = Math.min(dur - 0.05, Math.max(0, progress * dur))
            } catch {
              /* re-seek on the next tick */
            }
          }
          const target = Math.min(dur - 0.05, progress * dur)
          targetTimeRef.current = target
          const cur = video.currentTime
          const diff = target - cur
          if (Math.abs(diff) > 0.012) {
            const next = cur + diff * 0.18
            if (video.readyState >= 1 && !video.seeking) {
              try {
                video.currentTime = Math.min(dur - 0.05, Math.max(0, next))
              } catch {
                /* seeking can throw mid-load; the next tick retries */
              }
            }
            idleFramesRef.current = 0
          } else {
            idleFramesRef.current += 1
          }
        }
      }

      // ---- panels FADE THROUGH — one line on screen at a time ----
      // Every panel is full-screen centred text, so two visible at once read as
      // a double-exposure. The curve holds a panel full near its centre, then
      // fades it to EXACTLY 0 by the midpoint to its neighbour (d = 0.5): at
      // each hand-off only the graded film shows for a beat, then the next
      // words emerge.
      const panels = panelsRef.current?.children
      if (panels) {
        const n = panels.length
        const seg = 1 / n
        for (let i = 0; i < panels.length; i++) {
          const el = panels[i] as HTMLElement
          const center = (i + 0.5) * seg
          const d = Math.abs(progress - center) / seg
          let o = 1 - smooth((d - 0.34) / 0.16)
          if (i === 0 && progress < center) o = 1
          if (i === n - 1 && progress > center) o = 1
          el.style.opacity = o.toFixed(3)
          el.style.transform = `translate3d(0, ${((1 - o) * 16).toFixed(1)}px, 0)`
          el.style.visibility = o < 0.01 ? "hidden" : "visible"
        }
      }

      // ---- THE signature: one golden bloom, centred on the FINALE ----
      // Panels are [hero, arrival, floor, slow, closing] → closing centre = 0.9.
      // The confetti peaks at ~90% too, so the bloom, the film, and the RSVP
      // all crest together. A resting ember keeps it alive before then.
      const bloom = bloomRef.current
      if (bloom) {
        const dist = Math.abs(progress - 0.9) / 0.26
        const hump = 1 - smooth(dist)
        const intensity = 0.1 + hump * 0.9
        bloom.style.opacity = intensity.toFixed(3)
        bloom.style.transform = `translate(-50%, -50%) scale(${(0.8 + hump * 0.5).toFixed(3)})`
      }

      if (cueRef.current) {
        cueRef.current.style.opacity = Math.max(0, 1 - progress * 9).toFixed(3)
      }

      if (idleFramesRef.current < 6) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        runningRef.current = false
      }
    }

    const kick = () => {
      idleFramesRef.current = 0
      if (!runningRef.current) {
        runningRef.current = true
        rafRef.current = requestAnimationFrame(tick)
      }
    }

    kick()
    video.addEventListener("loadeddata", kick)
    window.addEventListener("scroll", kick, { passive: true })
    window.addEventListener("resize", kick)

    return () => {
      cancelAnimationFrame(rafRef.current)
      runningRef.current = false
      window.removeEventListener("scroll", kick)
      window.removeEventListener("resize", kick)
      video.removeEventListener("loadedmetadata", captureDuration)
      video.removeEventListener("loadeddata", kick)
    }
  }, [])

  return (
    <div className="pnRoot" id="top">
      <div className="pnStage" ref={stageRef}>
        <div className="pnSticky">
          <video
            className="pnVideo"
            ref={videoRef}
            src="/afterglow/journey.mp4"
            poster="/afterglow/poster.jpg"
            muted
            playsInline
            preload="auto"
            aria-hidden="true"
          />
          {/* keep the warm film warm: a champagne wash + a deepening vignette */}
          <div className="pnWarm" aria-hidden="true" />
          <div className="pnDeepen" aria-hidden="true" />

          {/* the one luminous moment — a golden bloom behind the finale */}
          <div className="pnBloom" ref={bloomRef} aria-hidden="true" />

          <div className="pnPanels" ref={panelsRef}>
            <section className="pnPanel pnPanel--hero" aria-label="Afterglow">
              <div className="pnPanelInner">
                <p className="pnEyebrow">{HERO.eyebrow}</p>
                <h1 className="pnWordmark">{HERO.wordmark}</h1>
                <p className="pnTagline">{HERO.tagline}</p>
                <p className="pnMeta">{HERO.meta}</p>
              </div>
            </section>

            {BEATS.map((b) => (
              <section
                className={`pnPanel pnPanel--${b.key}`}
                key={b.key}
                aria-label={b.title}
              >
                <div className="pnPanelInner">
                  <p className="pnNote">{b.note}</p>
                  <h2 className="pnTitle">{b.title}</h2>
                  <p className="pnBody">{b.body}</p>
                </div>
              </section>
            ))}

            <section className="pnPanel pnPanel--closing" aria-label="Come be unforgettable">
              <div className="pnPanelInner">
                <p className="pnClosing">{CLOSING.line}</p>
                <a className="pnCta" href="#tickets">
                  {CLOSING.cta}
                </a>
              </div>
            </section>
          </div>

          <div className="pnCue" ref={cueRef} aria-hidden="true">
            <span className="pnCueWord">scroll into the night</span>
            <span className="pnCueLine" />
          </div>
        </div>
      </div>

      <PromSite />
    </div>
  )
}

/* ---- reduced-motion / static mode --------------------------------------- */

function PromStatic() {
  return (
    <div className="pnRoot pnRoot--static" id="top">
      <header className="pnHeroStatic">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="pnHeroStaticImg" src="/afterglow/poster.jpg" alt="" />
        <div className="pnWarm" aria-hidden="true" />
        <div className="pnDeepen" aria-hidden="true" />
        <div className="pnPanelInner pnHeroStaticInner">
          <p className="pnEyebrow">{HERO.eyebrow}</p>
          <h1 className="pnWordmark">{HERO.wordmark}</h1>
          <p className="pnTagline">{HERO.tagline}</p>
          <p className="pnMeta">{HERO.meta}</p>
        </div>
      </header>

      <div className="pnSections">
        {BEATS.map((b) => (
          <section
            className={`pnSection pnSection--${b.key}`}
            key={b.key}
            aria-label={b.title}
          >
            <figure className="pnSectionFig">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={b.still} alt={`${b.title}, ${b.note}`} loading="lazy" decoding="async" />
              <span className="pnSectionGrade" aria-hidden="true" />
            </figure>
            <div className="pnSectionText">
              <p className="pnNote">{b.note}</p>
              <h2 className="pnTitle">{b.title}</h2>
              <p className="pnBody">{b.body}</p>
            </div>
          </section>
        ))}
      </div>

      <section className="pnClosingStatic" aria-label="Come be unforgettable">
        <span className="pnBloom pnBloom--static" aria-hidden="true" />
        <p className="pnClosing">{CLOSING.line}</p>
        <a className="pnCta" href="#tickets">
          {CLOSING.cta}
        </a>
      </section>

      <PromSite />
    </div>
  )
}

/* ---- the complete invitation, below the hero (shared by both modes) ----- *
   An immersive warm DESCENT, not a drop to flat black. The page stays lit by
   the same golden light as the film (soft ambient glows on the ground); one
   full-bleed graded still carries the film's world down as a quiet breath; the
   evening runs as a real gold-threaded timeline. No eyebrow labels, no dotted
   meta strings, no numbered chrome except the evening's own clock. The hero
   film is the one spectacle — everything here is quiet, but richly lit. */

function PromSite() {
  return (
    <div className="pnSite">
      {/* warm ambient — the party's light spilling onto the page */}
      <div className="pnAmbient" aria-hidden="true" />

      {/* THE THEME — what the night is */}
      <section className="pnTheme" id="theme" aria-label="This year's theme">
        <figure className="pnThemeFig">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={THEME.figure} alt="The dance floor under string lights" loading="lazy" decoding="async" />
          <span className="pnSectionGrade" aria-hidden="true" />
        </figure>
        <div className="pnThemeText">
          <h2 className="pnThemeTitle">{THEME.title}</h2>
          <p className="pnThemeBody">{THEME.body}</p>
        </div>
      </section>

      {/* THE EVENING — a real timed sequence, on a gold thread */}
      <section className="pnEvening" id="evening" aria-label="The evening">
        <div className="pnEveningHead">
          <h2 className="pnBigTitle">The evening</h2>
          <p className="pnEveningLede">
            From the first pair of headlights on the drive to a ceiling full of gold — how the night unfolds.
          </p>
        </div>
        <ol className="pnTimeline">
          {EVENING.map((m, i) => (
            <li
              className={`pnMoment${i === EVENING.length - 1 ? " pnMoment--finale" : ""}`}
              key={m.title}
            >
              <span className="pnMomentTime">{m.time}</span>
              <div className="pnMomentText">
                <h3 className="pnMomentTitle">{m.title}</h3>
                <p className="pnMomentDetail">{m.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* THE BREATH — one full-bleed graded still, a line of voice */}
      <section className="pnBand" aria-label="The part that stays">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="pnBandImg" src={BAND.still} alt="" loading="lazy" decoding="async" />
        <span className="pnBandScrim" aria-hidden="true" />
        <p className="pnBandLine">{BAND.line}</p>
      </section>

      {/* THE DETAILS — when / where / dress / tickets, read plainly */}
      <section className="pnDetails" id="details" aria-label="The details">
        <dl className="pnDetailGrid">
          {DETAILS.map((d) => (
            <div className="pnDetail" key={d.label}>
              <dt className="pnDetailLabel">{d.label}</dt>
              <dd className="pnDetailValue">{d.value}</dd>
              <dd className="pnDetailSub">{d.sub}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* TICKETS — the CTA, three tiers, one action, in a warm glow */}
      <section className="pnTickets" id="tickets" aria-label="Tickets">
        <span className="pnTicketsGlow" aria-hidden="true" />
        <div className="pnTicketsHead">
          <h2 className="pnBigTitle">{TICKETS.title}</h2>
          <p className="pnTicketsBody">{TICKETS.body}</p>
        </div>
        <ul className="pnTiers">
          {TICKETS.tiers.map((t) => (
            <li className="pnTier" key={t.name}>
              <p className="pnTierName">{t.name}</p>
              <p className="pnTierPrice">{t.price}</p>
              <p className="pnTierDetail">{t.detail}</p>
            </li>
          ))}
        </ul>
        <button className="pnBuy" type="button">
          {TICKETS.cta}
        </button>
      </section>

      {/* FOOTER */}
      <footer className="pnFooter" aria-label="Footer">
        <div className="pnFootTop">
          <div className="pnFootBrand">
            <span className="pnFootMark">Afterglow</span>
            <p className="pnFootStatement">{FOOTER.statement}</p>
          </div>
          <nav className="pnFootNav">
            {FOOTER.columns.map((col) => (
              <div className="pnFootCol" key={col.head}>
                <p className="pnFootHead">{col.head}</p>
                <ul>
                  {col.links.map((l) => (
                    <li key={l}>
                      <a href="#tickets">{l}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <form
          className="pnSignup"
          aria-label="Prom reminder"
          onSubmit={(e) => e.preventDefault()}
        >
          <label className="pnSignupLabel" htmlFor="pn-email">
            {FOOTER.reminderNote}
          </label>
          <div className="pnSignupRow">
            <input
              id="pn-email"
              className="pnSignupInput"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="your email"
            />
            <button className="pnSignupBtn" type="submit">
              remind me
            </button>
          </div>
        </form>

        <p className="pnFine">{FOOTER.fine}</p>
      </footer>
    </div>
  )
}
