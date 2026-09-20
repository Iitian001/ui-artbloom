"use client"

import { useEffect, useRef, useState } from "react"

/* -------------------------------------------------------------------------
   SILLAGE — LUMEN view. LUMINESCENCE direction: botanical night.

   MECHANIC (reused from ../sillage/sillage-view.tsx, visual layer replaced):
   dependency-free native `video.currentTime` scrubbing eased by a
   requestAnimationFrame loop toward a scroll-derived target, CSS sticky
   stage, duration captured with the cached-load readyState guard, and a
   prefers-reduced-motion static fallback.

   The film runs 30s / dusk → deep night. Its native grade drifts warm/amber
   at the base beats; we hold it COOL and DARK with fixed overlays so the
   whole thing reads as a night garden.

   The signature is ONE orchestrated luminous moment: as the HEART beat
   (night jasmine) reaches center, a soft silver-jade radial glow blooms
   behind the type — a single reveal tied to the scrub position, peaking at
   mid-scroll then receding. Everything else is kept quiet and dark.
------------------------------------------------------------------------- */

type Beat = {
  key: string
  /* delicate italic descriptor, in place of a tracked-out caps eyebrow */
  note: string
  title: string
  body: string
  still: string
}

/* Copy is written, not lorem — the real arc of the fragrance, dusk into
   deep night: bergamot (first light) → night jasmine (the bloom, the
   emotional center) → oud & amber (the warm trail that lingers). */
const HERO = {
  wordmark: "sillage",
  tagline: "the trail a scent keeps in a room after you have gone",
  meta: "A night-blooming botanical. Eau de parfum, opened at dusk."
}

const BEATS: Beat[] = [
  {
    key: "top",
    note: "the first light",
    title: "Bergamot, cold-pressed",
    body: "Green rind and a thread of oil, bright for a breath before the dark takes it back.",
    still: "/sillage/still-2.jpg"
  },
  {
    key: "heart",
    note: "the bloom, opening in the dark",
    title: "Night jasmine",
    body: "Sambac unfurling in the warm hours, saffron drawn through it like a wire. The flower the night is named for.",
    still: "/sillage/still-3.jpg"
  },
  {
    key: "base",
    note: "what lingers",
    title: "Oud and amber",
    body: "Aged wood and resin kept low against the skin, the warmth that stays long after the flowers have gone quiet.",
    still: "/sillage/still-4.jpg"
  }
]

const CLOSING = {
  line: "What remains is the sillage.",
  cta: "read the composition"
}

/* ---- content below the film: the complete site ------------------------- *
   The scrub film is the ouverture. Once it releases, the page becomes a real
   fragrance house: the composition read plainly, the bottle you can buy, where
   the jasmine is grown, the rest of the house, and the ground matter. All of it
   holds the same night — deep ink, one silver-jade light, serif voice. */

/* the olfactory pyramid, stated as reference rather than re-narrated */
type Accord = { note: string; matter: string }
const COMPOSITION: { tier: string; accord: Accord[] }[] = [
  {
    tier: "Top",
    accord: [
      { note: "Bergamot", matter: "cold-pressed, Calabria" },
      { note: "Green mandarin", matter: "leaf and rind" }
    ]
  },
  {
    tier: "Heart",
    accord: [
      { note: "Sambac jasmine", matter: "night-picked, Grasse" },
      { note: "Saffron", matter: "a single thread" }
    ]
  },
  {
    tier: "Base",
    accord: [
      { note: "Oud", matter: "aged twelve years" },
      { note: "Amber", matter: "labdanum resin" },
      { note: "Musk", matter: "kept close to the skin" }
    ]
  }
]

const PRODUCT = {
  kicker: "Eau de parfum",
  name: "Sillage",
  subtitle: "No. 1 — Night Jasmine",
  copy:
    "A night-blooming botanical, composed to be opened at dusk. It wears close for the first hour, then leaves the room slowly — the trail it keeps is the point.",
  concentration: "24% · extrait strength",
  sizes: [
    { ml: "50 ml", price: "$220" },
    { ml: "100 ml", price: "$340" }
  ],
  cta: "add to bag",
  still: "/sillage/still-5.jpg"
}

const PROVENANCE = {
  note: "where it begins",
  title: "Picked in the dark, in Grasse",
  body:
    "Sambac jasmine gives up the most of itself in the hours before dawn, so it is harvested by hand between three and sunrise, while the flower is still open. It takes roughly eight thousand blossoms to draw a single gram of the absolute at the heart of this scent.",
  figure: "/sillage/still-6.jpg",
  stat: [
    { value: "8,000", label: "blossoms to the gram" },
    { value: "03:00", label: "harvest, before first light" },
    { value: "Grasse", label: "the only fields we use" }
  ]
}

type Companion = { name: string; note: string; mood: string; still: string }
const COLLECTION: Companion[] = [
  {
    name: "Brume",
    note: "No. 2 — Cold Morning",
    mood: "Iris and wet stone, the fog before the sun burns it off.",
    still: "/sillage/still-1.jpg"
  },
  {
    name: "Cendre",
    note: "No. 3 — After the Fire",
    mood: "Birch smoke and warm ash, the room once the flame is out.",
    still: "/sillage/still-4.jpg"
  },
  {
    name: "Sel",
    note: "No. 4 — Low Tide",
    mood: "Salt, driftwood and skin, the coast at the turn of the night.",
    still: "/sillage/still-2.jpg"
  }
]

const FOOTER = {
  statement: "A small house making night-blooming botanicals in Grasse.",
  columns: [
    { head: "Shop", links: ["The fragrance", "Discovery set", "Refills", "Gift cards"] },
    { head: "House", links: ["Our story", "The atelier", "Sourcing", "Journal"] },
    { head: "Care", links: ["Shipping", "Returns", "Contact", "Stockists"] }
  ],
  newsletterNote: "Word before each release. Nothing else.",
  fine: "© Sillage Parfums — Grasse & New York"
}

/** smoothstep — soft ends so the beats trade cleanly */
function smooth(t: number) {
  const x = Math.min(1, Math.max(0, t))
  return x * x * (3 - 2 * x)
}

export function SillageView() {
  const [reduced, setReduced] = useState(false)
  const [decided, setDecided] = useState(false)

  // detect prefers-reduced-motion after mount so SSR stays deterministic
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    const apply = () => setReduced(mq.matches)
    apply()
    setDecided(true)
    mq.addEventListener?.("change", apply)
    return () => mq.removeEventListener?.("change", apply)
  }, [])

  if (decided && reduced) return <LumenStatic />
  return <LumenMotion />
}

/* ---- motion mode -------------------------------------------------------- */

function LumenMotion() {
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

  useEffect(() => {
    const video = videoRef.current
    const stage = stageRef.current
    if (!video || !stage) return

    const captureDuration = () => {
      const d = video.duration
      if (Number.isFinite(d) && d > 0) durationRef.current = d
    }
    // GOTCHA: on a cached/fast load, loadedmetadata can fire before this
    // effect runs. Read readyState immediately as well as listening.
    if (video.readyState >= 1) captureDuration()
    video.addEventListener("loadedmetadata", captureDuration)

    /* one frame: ease currentTime toward the scroll target, then write the
       panel opacities and the single jasmine bloom from scroll position. */
    const tick = () => {
      const dur = durationRef.current
      const vh = window.innerHeight
      const rect = stage.getBoundingClientRect()
      const travel = rect.height - vh
      const progress = travel > 0 ? Math.min(1, Math.max(0, -rect.top / travel)) : 0

      // ---- video scrub (eased) ----
      if (dur > 0) {
        const target = Math.min(dur - 0.05, progress * dur)
        targetTimeRef.current = target
        const cur = video.currentTime
        const diff = target - cur
        if (Math.abs(diff) > 0.012) {
          const next = cur + diff * 0.18 // ease ~18% of the gap per frame
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

      // ---- panels: hero, 3 beats, closing — crossfade on their centers ----
      // 5 panels across the scroll; the HEART panel sits dead center (0.5).
      const panels = panelsRef.current?.children
      if (panels) {
        const n = panels.length
        const seg = 1 / n
        for (let i = 0; i < panels.length; i++) {
          const el = panels[i] as HTMLElement
          const center = (i + 0.5) * seg
          const d = Math.abs(progress - center) / seg
          let o = 1 - smooth((d - 0.34) / 0.16)
          // hold the hero at the very top and the closing at the very bottom
          if (i === 0 && progress < center) o = 1
          if (i === n - 1 && progress > center) o = 1
          el.style.opacity = o.toFixed(3)
          el.style.transform = `translate3d(0, ${((1 - o) * 20).toFixed(1)}px, 0)`
          el.style.visibility = o < 0.01 ? "hidden" : "visible"
        }
      }

      // ---- THE signature: one luminous bloom, centered on the heart beat ----
      // Panels are [hero, top, heart, base, closing] → heart center = 2.5/5 = 0.5.
      // A single smooth hump peaks at 0.5 and falls away either side; the glow
      // exists (dim) at rest and swells to full exactly as jasmine opens.
      const bloom = bloomRef.current
      if (bloom) {
        const dist = Math.abs(progress - 0.5) / 0.24 // full within ~0.12 of center
        const hump = 1 - smooth(dist) // 1 at center → 0 by ~0.24 away
        const intensity = 0.14 + hump * 0.86 // never fully dark: a resting ember
        bloom.style.opacity = intensity.toFixed(3)
        bloom.style.transform = `translate(-50%, -50%) scale(${(0.82 + hump * 0.42).toFixed(3)})`
      }

      // ---- scroll cue fades once scrubbing begins ----
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

    // paint the initial frame (progress 0) even before duration is known
    kick()
    // once metadata/first frame land, sync the film to the loaded scroll pos
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
    <div className="lmRoot" id="top">
      <div className="lmStage" ref={stageRef}>
        <div className="lmSticky">
          <video
            className="lmVideo"
            ref={videoRef}
            src="/sillage/journey.mp4"
            poster="/sillage/poster.jpg"
            muted
            playsInline
            preload="auto"
            aria-hidden="true"
          />
          {/* grade the warm film COOL + DARK so it reads as night */}
          <div className="lmTint" aria-hidden="true" />
          <div className="lmDeepen" aria-hidden="true" />

          {/* the one luminous moment — a soft silver-jade bloom behind the type */}
          <div className="lmBloom" ref={bloomRef} aria-hidden="true" />

          <div className="lmPanels" ref={panelsRef}>
            <section className="lmPanel lmPanel--hero" aria-label="Sillage">
              <div className="lmPanelInner">
                <h1 className="lmWordmark">{HERO.wordmark}</h1>
                <p className="lmTagline">{HERO.tagline}</p>
                <p className="lmMeta">{HERO.meta}</p>
              </div>
            </section>

            {BEATS.map((b) => (
              <section
                className={`lmPanel lmPanel--${b.key}`}
                key={b.key}
                aria-label={b.title}
              >
                <div className="lmPanelInner">
                  <p className="lmNote">{b.note}</p>
                  <h2 className="lmTitle">{b.title}</h2>
                  <p className="lmBody">{b.body}</p>
                </div>
              </section>
            ))}

            <section className="lmPanel lmPanel--closing" aria-label="What remains">
              <div className="lmPanelInner">
                <p className="lmClosing">{CLOSING.line}</p>
                <a className="lmCta" href="#top">
                  {CLOSING.cta}
                </a>
              </div>
            </section>
          </div>

          <div className="lmCue" ref={cueRef} aria-hidden="true">
            <span className="lmCueWord">scroll into the dark</span>
            <span className="lmCueLine" />
          </div>
        </div>
      </div>

      <LumenSite />
    </div>
  )
}

/* ---- reduced-motion / static mode --------------------------------------
   No scrubbing, no rAF. The poster carries the hero; each beat is a still.
   The jasmine bloom is CSS-only here (does not depend on motion) so the
   signature still reads. */

function LumenStatic() {
  return (
    <div className="lmRoot lmRoot--static" id="top">
      <header className="lmHeroStatic">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="lmHeroStaticImg" src="/sillage/poster.jpg" alt="" />
        <div className="lmTint" aria-hidden="true" />
        <div className="lmDeepen" aria-hidden="true" />
        <div className="lmPanelInner lmHeroStaticInner">
          <h1 className="lmWordmark">{HERO.wordmark}</h1>
          <p className="lmTagline">{HERO.tagline}</p>
          <p className="lmMeta">{HERO.meta}</p>
        </div>
      </header>

      <div className="lmSections">
        {BEATS.map((b) => (
          <section
            className={`lmSection lmSection--${b.key}`}
            key={b.key}
            aria-label={b.title}
          >
            <figure className="lmSectionFig">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={b.still} alt={`${b.title}, ${b.note}`} loading="lazy" decoding="async" />
              <span className="lmSectionGrade" aria-hidden="true" />
              {/* the heart keeps its bloom, CSS-only, so the signature survives */}
              {b.key === "heart" ? <span className="lmBloom lmBloom--static" aria-hidden="true" /> : null}
            </figure>
            <div className="lmSectionText">
              <p className="lmNote">{b.note}</p>
              <h2 className="lmTitle">{b.title}</h2>
              <p className="lmBody">{b.body}</p>
            </div>
          </section>
        ))}
      </div>

      <section className="lmClosingStatic" aria-label="What remains">
        <p className="lmClosing">{CLOSING.line}</p>
        <a className="lmCta" href="#composition">
          {CLOSING.cta}
        </a>
      </section>

      <LumenSite />
    </div>
  )
}

/* ---- the complete site, below the hero (shared by both modes) ----------- *
   These sections scroll normally after the cinematic opening. They keep the
   night — deep ink ground, one silver-jade accent, Fraunces/Instrument serifs —
   and spend no second bold moment: no cards, no shadows, no numbered chrome,
   just graded imagery, generous space, and the type doing the work. */

function LumenSite() {
  return (
    <div className="lmSite">
      {/* THE COMPOSITION — the pyramid, read plainly, not re-narrated */}
      <section className="lmComposition" id="composition" aria-label="The composition">
        <div className="lmCompHead">
          <p className="lmNote">how it is built</p>
          <h2 className="lmCompTitle">The composition</h2>
        </div>
        <ol className="lmPyramid">
          {COMPOSITION.map((tier) => (
            <li className="lmTier" key={tier.tier}>
              <span className="lmTierName">{tier.tier}</span>
              <div className="lmTierNotes">
                {tier.accord.map((a) => (
                  <p className="lmAccord" key={a.note}>
                    <span className="lmAccordNote">{a.note}</span>
                    <span className="lmAccordMatter">{a.matter}</span>
                  </p>
                ))}
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* THE BOTTLE — the object you can buy. Graded still, price as quiet
          text, a hairline CTA — no e-commerce card. */}
      <section className="lmProduct" id="fragrance" aria-label={PRODUCT.name}>
        <figure className="lmProductFig">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={PRODUCT.still}
            alt="Sillage No. 1, Night Jasmine — the bottle at dusk"
            loading="lazy"
            decoding="async"
          />
          <span className="lmSectionGrade" aria-hidden="true" />
        </figure>
        <div className="lmProductText">
          <p className="lmNote">{PRODUCT.kicker}</p>
          <h2 className="lmProductName">{PRODUCT.name}</h2>
          <p className="lmProductSub">{PRODUCT.subtitle}</p>
          <p className="lmProductCopy">{PRODUCT.copy}</p>
          <p className="lmProductConc">{PRODUCT.concentration}</p>
          <div className="lmPrices">
            {PRODUCT.sizes.map((s) => (
              <p className="lmPrice" key={s.ml}>
                <span className="lmPriceMl">{s.ml}</span>
                <span className="lmPriceValue">{s.price}</span>
              </p>
            ))}
          </div>
          <button className="lmBuy" type="button">
            {PRODUCT.cta}
          </button>
        </div>
      </section>

      {/* PROVENANCE — where the jasmine comes from. Full-bleed graded still,
          text over the deepened frame, three quiet figures. */}
      <section className="lmProvenance" aria-label={PROVENANCE.title}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="lmProvImg"
          src={PROVENANCE.figure}
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
        />
        <div className="lmTint" aria-hidden="true" />
        <div className="lmProvScrim" aria-hidden="true" />
        <div className="lmProvInner">
          <p className="lmNote">{PROVENANCE.note}</p>
          <h2 className="lmProvTitle">{PROVENANCE.title}</h2>
          <p className="lmProvBody">{PROVENANCE.body}</p>
          <dl className="lmStats">
            {PROVENANCE.stat.map((s) => (
              <div className="lmStat" key={s.label}>
                <dt className="lmStatValue">{s.value}</dt>
                <dd className="lmStatLabel">{s.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* THE HOUSE — companion scents, an editorial list, not a card grid.
          Each is a full-width row: large graded still, name in serif. */}
      <section className="lmCollection" id="house" aria-label="The house">
        <div className="lmCollHead">
          <p className="lmNote">the rest of the house</p>
          <h2 className="lmCompTitle">Four scents, one night</h2>
        </div>
        <ul className="lmCompanions">
          {COLLECTION.map((c) => (
            <li className="lmCompanion" key={c.name}>
              <a className="lmCompanionLink" href="#fragrance">
                <figure className="lmCompanionFig">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={c.still}
                    alt={`${c.name} — ${c.note}`}
                    loading="lazy"
                    decoding="async"
                  />
                  <span className="lmSectionGrade" aria-hidden="true" />
                </figure>
                <div className="lmCompanionText">
                  <p className="lmNote">{c.note}</p>
                  <h3 className="lmCompanionName">{c.name}</h3>
                  <p className="lmCompanionMood">{c.mood}</p>
                  <span className="lmCompanionCue" aria-hidden="true">
                    smell it
                  </span>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </section>

      {/* FOOTER — brand ground matter and the one form on the page */}
      <footer className="lmFooter" aria-label="Footer">
        <div className="lmFootTop">
          <div className="lmFootBrand">
            <span className="lmFootMark">sillage</span>
            <p className="lmFootStatement">{FOOTER.statement}</p>
          </div>
          <nav className="lmFootNav">
            {FOOTER.columns.map((col) => (
              <div className="lmFootCol" key={col.head}>
                <p className="lmFootHead">{col.head}</p>
                <ul>
                  {col.links.map((l) => (
                    <li key={l}>
                      <a href="#fragrance">{l}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <form
          className="lmSignup"
          aria-label="Release notices"
          onSubmit={(e) => e.preventDefault()}
        >
          <label className="lmSignupLabel" htmlFor="lm-email">
            {FOOTER.newsletterNote}
          </label>
          <div className="lmSignupRow">
            <input
              id="lm-email"
              className="lmSignupInput"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="your email"
            />
            <button className="lmSignupBtn" type="submit">
              join
            </button>
          </div>
        </form>

        <p className="lmFine">{FOOTER.fine}</p>
      </footer>
    </div>
  )
}
