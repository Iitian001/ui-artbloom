"use client"

import { useEffect, useRef, useState } from "react"

/**
 * Flux — a generative image & video model, sold the only honest way for a tool
 * whose whole pitch is "look what it makes": the model's own output is the hero.
 *
 * The base is a true neutral near-black (#08080a, not brown-tinted) so the
 * generated frames carry every bit of colour. Chrome is quiet frost-on-black
 * with a single electric-violet accent that mostly echoes the violet already
 * living inside the imagery. No tracked-caps eyebrows, no middle-dot metas, no
 * em-dash fragment labels, no arrow-suffixed links, no glass blur. Monospace is
 * used only where the text is a literal prompt. The one loud move is the
 * full-bleed generative reel; everything else stays out of its way. All motion
 * — the crossfade reel, hover-scrub, prompt→output morph — is gated on
 * prefers-reduced-motion.
 */

const HERO_REEL = ["/flux/g1.png", "/flux/g5.png", "/flux/g4.png", "/flux/g2.png"]

/**
 * The output gallery. Each tile is one generated frame; `frames` holds a couple
 * of palette-kin outputs so hovering scrubs through them like a short reel, and
 * `prompt` is the line that made the primary one. `w`/`h` seed the aspect ratio
 * so the masonry is stable before any image loads.
 */
type Shot = { name: string; w: number; h: number; label: string; prompt: string; frames: string[] }
const GALLERY: Shot[] = [
  {
    name: "g1", w: 1536, h: 1024, label: "Dreamscape",
    prompt: "endless mirror-calm sea of liquid mercury, three floating stone islands pouring light, a lone figure at the shore",
    frames: ["/flux/g1.png", "/flux/g5.png"],
  },
  {
    name: "g3", w: 1024, h: 1536, label: "Portrait",
    prompt: "explorer with braided hair woven with glowing filaments, half cyan light half warm amber, painterly concept-art finish",
    frames: ["/flux/g3.png", "/flux/g6.png"],
  },
  {
    name: "g2", w: 1024, h: 1024, label: "Product",
    prompt: "frosted-glass perfume bottle sculpted like a river stone, faint violet liquid, wet black reflective surface",
    frames: ["/flux/g2.png", "/flux/g4.png"],
  },
  {
    name: "g5", w: 1536, h: 1024, label: "Architecture",
    prompt: "monumental brutalist megastructure carved into a canyon at blue hour, a single glowing violet atrium at its heart",
    frames: ["/flux/g5.png", "/flux/g1.png"],
  },
  {
    name: "g6", w: 1024, h: 1536, label: "Macro",
    prompt: "jewel-toned beetle with iridescent violet carapace on a dew-covered fern, droplets acting as tiny lenses at dawn",
    frames: ["/flux/g6.png", "/flux/g4.png"],
  },
  {
    name: "g7", w: 1536, h: 1024, label: "Retro-future",
    prompt: "lone chrome concept car on a wet desert highway facing a giant sun, airbrushed synthwave sky of magenta and teal",
    frames: ["/flux/g2.png", "/flux/g5.png"],
  },
  {
    name: "g4", w: 1024, h: 1024, label: "Abstract 3D",
    prompt: "collision of glossy iridescent chrome blobs and matte violet spheres in a black void, oil-slick rainbow highlights",
    frames: ["/flux/g4.png", "/flux/g2.png"],
  },
  {
    name: "g9", w: 1024, h: 1536, label: "Cityscape",
    prompt: "rain-soaked back alley at night, stacked signage glowing violet and cyan reflected in deep puddles, a figure with an umbrella",
    frames: ["/flux/g5.png", "/flux/g2.png"],
  },
  {
    name: "g8", w: 1536, h: 1024, label: "Painterly",
    prompt: "rolling northern mountains under swirling twilight clouds, thick impasto oil strokes, warm ochre light on the peaks",
    frames: ["/flux/g4.png", "/flux/g5.png"],
  },
  {
    name: "g10", w: 1024, h: 1024, label: "Claymation",
    prompt: "round handmade clay creature with big curious eyes on a mossy diorama, visible fingerprints, cozy stop-motion still",
    frames: ["/flux/g6.png", "/flux/g3.png"],
  },
]

/** Model lineage — a real sequence, so the years carry the order (no 01/02/03). */
const LINEAGE = [
  { year: "2023", name: "Flux Alpha", note: "The first internal model. 512px, painterly, and slow — but the first time a text line came back as something we wanted to keep." },
  { year: "2024", name: "Flux 1", note: "Public preview. Coherent 1K stills, real material response, and a prompt language people could actually reason about." },
  { year: "2025", name: "Flux 2 Pro", note: "Photoreal quality at native 1.5K, consistent characters across a set, and the style system that powers the presets above." },
  { year: "2026", name: "Flux Motion", note: "Stills learned to move. Short generative clips that hold their world frame to frame — the reel at the top of this page is Motion." },
]

/** Community creators + the output each is known for. */
const CREATORS = [
  { handle: "nyx.render", craft: "Product & still-life", img: "/flux/g2.png", grad: "linear-gradient(135deg, #8b5cf6, #4c1d95)" },
  { handle: "atlas.frames", craft: "Cinematic worlds", img: "/flux/g5.png", grad: "linear-gradient(135deg, #06b6d4, #1e3a8a)" },
  { handle: "kiln.studio", craft: "Painterly landscapes", img: "/flux/g4.png", grad: "linear-gradient(135deg, #f59e0b, #7c2d12)" },
  { handle: "vero.macro", craft: "Nature macro", img: "/flux/g6.png", grad: "linear-gradient(135deg, #10b981, #064e3b)" },
  { handle: "sable.co", craft: "Character design", img: "/flux/g3.png", grad: "linear-gradient(135deg, #ec4899, #831843)" },
  { handle: "form.void", craft: "Abstract 3D", img: "/flux/g4.png", grad: "linear-gradient(135deg, #a78bfa, #312e81)" },
]

/** Prompt→output pairs for the morph demo; loops through these on reveal. */
const MORPHS = [
  { prompt: "a lone chrome concept car on a wet desert highway, facing a giant setting sun, synthwave sky", img: "/flux/g2.png" },
  { prompt: "rain-soaked alley at night, stacked neon signage in violet and cyan mirrored in the puddles", img: "/flux/g5.png" },
  { prompt: "a jewel-toned beetle on a dew-covered fern at dawn, droplets acting as tiny lenses", img: "/flux/g6.png" },
  { prompt: "a brutalist megastructure carved into a canyon at blue hour, one glowing violet atrium", img: "/flux/g5.png" },
]

/** Style presets for the deep-dive: each chip swaps the featured render. */
const STYLES = [
  { id: "photoreal", label: "Photoreal", img: "/flux/g2.png", blurb: "Studio-grade product and still-life renders — accurate materials, real reflections, controllable light." },
  { id: "cinematic", label: "Cinematic", img: "/flux/g5.png", blurb: "Anamorphic depth, volumetric haze and colour grades pulled straight from film — a frame that could open a title sequence." },
  { id: "painterly", label: "Painterly", img: "/flux/g4.png", blurb: "Visible brushwork and canvas grain, from loose impasto to fine glazing, without ever tipping into a filter." },
  { id: "render3d", label: "3D render", img: "/flux/g4.png", blurb: "Clean product-viz geometry — subsurface glow, oil-slick chrome and soft studio bounce, no scene to build." },
  { id: "portrait", label: "Portrait", img: "/flux/g3.png", blurb: "Character work with real skin texture and directable lighting, holding a consistent face across a whole set." },
]

/**
 * One masonry tile. Owns its hover state: while hovered (and motion allowed) it
 * crossfades through its `frames` on a fast timer — a simulated scrub — and lifts
 * the prompt into view. Reduced motion just shows the still and reveals the prompt
 * on hover with no cycling.
 */
function FluxTile({ shot, reduced }: { shot: Shot; reduced: boolean }) {
  const [hover, setHover] = useState(false)
  const [frame, setFrame] = useState(0)

  useEffect(() => {
    if (!hover || reduced || shot.frames.length < 2) return
    const id = window.setInterval(() => {
      setFrame((f) => (f + 1) % shot.frames.length)
    }, 780)
    return () => window.clearInterval(id)
  }, [hover, reduced, shot.frames.length])

  useEffect(() => {
    if (!hover) setFrame(0)
  }, [hover])

  return (
    <figure
      className={`fx-tile ${hover ? "is-hover" : ""}`}
      style={{ aspectRatio: `${shot.w} / ${shot.h}` }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
      tabIndex={0}
    >
      <div className="fx-tile-frames" aria-hidden="true">
        {shot.frames.map((src, i) => (
          <div
            key={src}
            className={`fx-tile-img ${i === (reduced ? 0 : frame) ? "is-on" : ""}`}
            style={{ backgroundImage: `url(${src})` }}
          />
        ))}
      </div>
      <figcaption className="fx-tile-cap">
        <span className="fx-tile-label">{shot.label}</span>
        <span className="fx-tile-prompt">{shot.prompt}</span>
      </figcaption>
      <span className="fx-tile-scrub" aria-hidden="true">
        {shot.frames.map((src, i) => (
          <span key={src} className={i === (reduced ? 0 : frame) ? "is-on" : ""} />
        ))}
      </span>
    </figure>
  )
}

/**
 * Prompt→output demo. Once on screen it loops the pairs: the prompt writes in on
 * the left, then the output wipes open on the right, holds, and advances. Under
 * reduced motion it just shows the first pair fully resolved, no loop, no wipe.
 */
function MorphDemo({ reduced }: { reduced: boolean }) {
  const [ref, shown] = useReveal<HTMLDivElement>()
  const [i, setI] = useState(0)
  const [phase, setPhase] = useState<"typing" | "output">("output")

  useEffect(() => {
    if (!shown || reduced) return
    // Kick the first cycle in, then run the loop.
    setPhase("typing")
    const toOutput = window.setTimeout(() => setPhase("output"), 2200)
    const next = window.setTimeout(() => {
      setI((n) => (n + 1) % MORPHS.length)
      setPhase("typing")
    }, 5200)
    return () => {
      window.clearTimeout(toOutput)
      window.clearTimeout(next)
    }
  }, [shown, reduced, i])

  const cur = MORPHS[i]
  const resolved = reduced || phase === "output"

  return (
    <div className={`fx-morph ${shown ? "is-shown" : ""}`} ref={ref}>
      <div className="fx-morph-in">
        <span className="fx-morph-tag">Prompt</span>
        <p className="fx-morph-prompt" key={`p-${i}`}>
          {cur.prompt}
          {!reduced && <span className="fx-caret" aria-hidden="true" />}
        </p>
      </div>
      <div className="fx-morph-arrow" aria-hidden="true">
        <span />
      </div>
      <div className="fx-morph-out">
        <span className="fx-morph-tag">Output</span>
        <div className="fx-morph-frame">
          {MORPHS.map((m, n) => (
            <div
              key={m.img}
              className={`fx-morph-img ${n === i && resolved ? "is-on" : ""}`}
              style={{ backgroundImage: `url(${m.img})` }}
              aria-hidden="true"
            />
          ))}
          <span className={`fx-morph-wipe ${resolved ? "is-open" : ""}`} aria-hidden="true" />
        </div>
      </div>
    </div>
  )
}

/** True when the visitor has asked for reduced motion; kept live on change. */
function useReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReduced(mq.matches)
    const on = () => setReduced(mq.matches)
    mq.addEventListener("change", on)
    return () => mq.removeEventListener("change", on)
  }, [])
  return reduced
}

/** Reveal a block once when it scrolls into view. Reduced-motion shows instantly. */
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
      { threshold: 0.18 },
    )
    io.observe(node)
    return () => io.disconnect()
  }, [])
  return [ref, shown] as const
}

export default function Flux() {
  const reduced = useReducedMotion()
  const [slide, setSlide] = useState(0)
  const [scrollY, setScrollY] = useState(0)
  const [styleId, setStyleId] = useState(STYLES[0].id)
  const activeStyle = STYLES.find((s) => s.id === styleId) ?? STYLES[0]

  // Hero reel: slow crossfade between the strongest landscape outputs.
  useEffect(() => {
    if (reduced) return
    const id = window.setInterval(() => {
      setSlide((s) => (s + 1) % HERO_REEL.length)
    }, 5200)
    return () => window.clearInterval(id)
  }, [reduced])

  // Gentle hero parallax for depth (skipped entirely under reduced motion).
  useEffect(() => {
    if (reduced) return
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
      window.removeEventListener("scroll", onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [reduced])

  const par = reduced ? 0 : scrollY

  return (
    <div className={`flux-root ${reduced ? "is-still" : ""}`}>
      <style>{css}</style>

      <header className="fx-nav">
        <a className="fx-mark" href="#top" aria-label="Flux home">
          <span className="fx-mark-dot" aria-hidden="true" />
          Flux
        </a>
        <nav className="fx-links">
          <a href="#gallery">Gallery</a>
          <a href="#styles">Styles</a>
          <a href="#models">Models</a>
          <a href="#start" className="fx-nav-cta">
            Start creating
          </a>
        </nav>
      </header>

      {/* HERO — full-bleed crossfading generative reel behind an oversized line */}
      <section className="fx-hero" id="top">
        <div className="fx-reel" aria-hidden="true">
          {HERO_REEL.map((src, i) => (
            <div
              key={src}
              className={`fx-reel-slide ${i === slide ? "is-active" : ""}`}
              style={{ backgroundImage: `url(${src})` }}
            />
          ))}
          <div className="fx-reel-scrim" />
        </div>

        <div className="fx-hero-inner" style={{ transform: `translate3d(0, ${par * -0.08}px, 0)` }}>
          <p className="fx-hero-kicker">Generative image and video model</p>
          <h1 className="fx-hero-title">
            Describe it.
            <br />
            Flux draws the rest.
          </h1>
          <p className="fx-hero-lede">
            Type a scene, a style, a mood. Flux renders it as a finished image or a moving shot in
            seconds — and every frame is yours to use.
          </p>
          <div className="fx-hero-actions">
            <a className="fx-btn fx-btn-primary" href="#start">
              Start creating
            </a>
            <a className="fx-btn fx-btn-ghost" href="#gallery">
              See what it makes
            </a>
          </div>
        </div>

        <div className="fx-reel-dots" role="presentation">
          {HERO_REEL.map((src, i) => (
            <span key={src} className={i === slide ? "is-active" : ""} />
          ))}
        </div>
      </section>

      {/* GALLERY — masonry of outputs; hover a tile to scrub frames + read the prompt */}
      <section className="fx-section fx-gallery" id="gallery">
        <div className="fx-gallery-head">
          <div>
            <p className="fx-eyebrow">Made with Flux</p>
            <h2 className="fx-h2">Ten prompts, ten worlds</h2>
          </div>
          <p className="fx-sub">
            Everything here came out of a single line of text. Hover any frame to scrub through the
            takes and see the prompt behind it.
          </p>
        </div>
        <div className="fx-masonry">
          {GALLERY.map((shot) => (
            <FluxTile key={shot.name} shot={shot} reduced={reduced} />
          ))}
        </div>
      </section>

      {/* STYLES — chips swap the featured render, proving range from one control */}
      <section className="fx-section fx-styles" id="styles">
        <div className="fx-styles-copy">
          <p className="fx-eyebrow">One model, any look</p>
          <h2 className="fx-h2">Steer the style with a word</h2>
          <p className="fx-sub">
            Flux isn't tuned for a single aesthetic. Name the look you're after and the whole render
            shifts to match. Try a few.
          </p>
          <div className="fx-chips" role="tablist" aria-label="Style presets">
            {STYLES.map((s) => (
              <button
                key={s.id}
                role="tab"
                aria-selected={s.id === styleId}
                className={`fx-chip ${s.id === styleId ? "is-active" : ""}`}
                onClick={() => setStyleId(s.id)}
              >
                {s.label}
              </button>
            ))}
          </div>
          <p className="fx-style-blurb" key={activeStyle.id}>{activeStyle.blurb}</p>
        </div>
        <div className="fx-styles-stage">
          {STYLES.map((s) => (
            <div
              key={s.id}
              className={`fx-style-img ${s.id === styleId ? "is-on" : ""}`}
              style={{ backgroundImage: `url(${s.img})` }}
              aria-hidden={s.id !== styleId}
            />
          ))}
          <span className="fx-style-tag">{activeStyle.label}</span>
        </div>
      </section>

      {/* PROMPT → OUTPUT — a line of text wipes open into the render it produced */}
      <section className="fx-section fx-morph-section">
        <div className="fx-morph-head">
          <p className="fx-eyebrow">How it feels</p>
          <h2 className="fx-h2">From a sentence to a frame</h2>
          <p className="fx-sub">
            No dials to learn. You write what you want, Flux resolves it. Here it is, on repeat.
          </p>
        </div>
        <MorphDemo reduced={reduced} />
      </section>

      {/* MODELS — lineage timeline */}
      <section className="fx-section fx-lineage" id="models">
        <div className="fx-lineage-head">
          <p className="fx-eyebrow">The models behind it</p>
          <h2 className="fx-h2">Three years, four models</h2>
          <p className="fx-sub">
            Every release traded a limitation for a capability. Here's the line that led to the one
            you're using now.
          </p>
        </div>
        <ol className="fx-timeline">
          {LINEAGE.map((m) => (
            <li className="fx-tl-item" key={m.year}>
              <span className="fx-tl-year">{m.year}</span>
              <span className="fx-tl-node" aria-hidden="true" />
              <div className="fx-tl-body">
                <h3 className="fx-tl-name">{m.name}</h3>
                <p className="fx-tl-note">{m.note}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* COMMUNITY — creators + their work */}
      <section className="fx-section fx-community">
        <div className="fx-community-head">
          <p className="fx-eyebrow">In the wild</p>
          <h2 className="fx-h2">What people are making</h2>
          <p className="fx-sub">
            Two million creators have generated with Flux this month. A few whose work we keep coming
            back to.
          </p>
        </div>
        <div className="fx-creators">
          {CREATORS.map((c) => (
            <article className="fx-creator" key={c.handle}>
              <div className="fx-creator-img" style={{ backgroundImage: `url(${c.img})` }} />
              <div className="fx-creator-row">
                <span className="fx-creator-avatar" style={{ background: c.grad }} aria-hidden="true">
                  {c.handle.slice(0, 1).toUpperCase()}
                </span>
                <div>
                  <p className="fx-creator-handle">{c.handle}</p>
                  <p className="fx-creator-craft">{c.craft}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* START — final CTA over a quiet output */}
      <section className="fx-section fx-start" id="start">
        <div className="fx-start-bg" style={{ backgroundImage: "url(/flux/g1.png)" }} aria-hidden="true" />
        <div className="fx-start-scrim" />
        <div className="fx-start-inner">
          <h2 className="fx-start-title">The next image is a sentence away</h2>
          <p className="fx-start-lede">
            Start free with fifty generations a day. No card, no watermark, and every frame you make
            is yours to keep.
          </p>
          <div className="fx-hero-actions fx-start-actions">
            <a className="fx-btn fx-btn-primary" href="#top">
              Start creating
            </a>
            <a className="fx-btn fx-btn-ghost" href="#models">
              Read the model card
            </a>
          </div>
        </div>
      </section>

      <footer className="fx-footer" id="start-footer">
        <div className="fx-footer-top">
          <a className="fx-mark" href="#top">
            <span className="fx-mark-dot" aria-hidden="true" />
            Flux
          </a>
          <p className="fx-footer-tag">A generative model for images and video. Made for people who make things.</p>
        </div>
        <div className="fx-footer-cols">
          <div>
            <h4>Product</h4>
            <a href="#gallery">Gallery</a>
            <a href="#styles">Styles</a>
            <a href="#models">Models</a>
          </div>
          <div>
            <h4>Company</h4>
            <a href="#top">About</a>
            <a href="#top">Research</a>
            <a href="#top">Careers</a>
          </div>
          <div>
            <h4>Use</h4>
            <a href="#top">Licence</a>
            <a href="#top">Guidelines</a>
            <a href="#top">API</a>
          </div>
        </div>
        <p className="fx-footer-fine">
          Every image on this page was generated by Flux. Outputs are yours to use, commercially or otherwise.
        </p>
      </footer>
    </div>
  )
}

const css = `
.flux-root {
  --bg: #08080a;
  --bg-2: #0e0e13;
  --panel: #121218;
  --frost: #f4f4f7;
  --mist: #9a9aa8;
  --faint: #6a6a78;
  --line: rgba(244, 244, 247, 0.09);
  --line-2: rgba(244, 244, 247, 0.16);
  --violet: #8b5cf6;
  --violet-lo: rgba(139, 92, 246, 0.16);
  --violet-glow: rgba(139, 92, 246, 0.45);
  background: var(--bg);
  color: var(--frost);
  font-family: var(--font-geist), system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
  line-height: 1.55;
  overflow-x: hidden;
}
.flux-root *,
.flux-root *::before,
.flux-root *::after { box-sizing: border-box; }
.flux-root ::selection { background: var(--violet); color: #fff; }

.fx-mark {
  display: inline-flex; align-items: center; gap: 0.5rem;
  font-weight: 600; font-size: 1.2rem; letter-spacing: -0.02em;
  color: var(--frost); text-decoration: none;
}
.fx-mark-dot {
  width: 0.62rem; height: 0.62rem; border-radius: 50%;
  background: var(--violet);
  box-shadow: 0 0 14px var(--violet-glow);
}

/* NAV */
.fx-nav {
  position: fixed; inset: 0 0 auto 0; z-index: 60;
  display: flex; align-items: center; justify-content: space-between;
  padding: 1.15rem clamp(1.1rem, 4vw, 3rem);
  background: linear-gradient(to bottom, rgba(8, 8, 10, 0.72), rgba(8, 8, 10, 0));
}
.fx-links { display: flex; align-items: center; gap: clamp(1rem, 2.2vw, 2rem); }
.fx-links a { color: var(--mist); text-decoration: none; font-size: 0.94rem; transition: color 0.25s; }
.fx-links a:hover { color: var(--frost); }
.fx-nav-cta {
  color: var(--frost) !important; font-weight: 550;
  border: 1px solid var(--line-2); border-radius: 999px; padding: 0.5rem 1.05rem;
  transition: border-color 0.25s, background 0.25s;
}
.fx-nav-cta:hover { border-color: var(--violet); background: var(--violet-lo); }
@media (max-width: 620px) { .fx-links a:not(.fx-nav-cta) { display: none; } }

/* BUTTONS */
.fx-btn {
  display: inline-flex; align-items: center; justify-content: center;
  font-weight: 550; font-size: 1rem; text-decoration: none;
  padding: 0.9rem 1.7rem; border-radius: 999px;
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s, background 0.25s, border-color 0.25s;
}
.fx-btn-primary { background: var(--violet); color: #fff; }
.fx-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 16px 38px -12px var(--violet-glow); }
.fx-btn-ghost { color: var(--frost); border: 1px solid var(--line-2); }
.fx-btn-ghost:hover { border-color: var(--frost); transform: translateY(-2px); }

/* HERO */
.fx-hero { position: relative; height: 100svh; min-height: 640px; overflow: hidden; }
.fx-reel { position: absolute; inset: 0; }
.fx-reel-slide {
  position: absolute; inset: 0;
  background-size: cover; background-position: center;
  opacity: 0; transform: scale(1.06);
  transition: opacity 1.6s ease-in-out;
  will-change: opacity, transform;
}
.fx-reel-slide.is-active { opacity: 1; animation: fxKen 7s ease-out forwards; }
@keyframes fxKen {
  from { transform: scale(1.05) translate3d(0, 0, 0); }
  to { transform: scale(1.15) translate3d(-1.4%, -1.6%, 0); }
}
.fx-reel-scrim {
  position: absolute; inset: 0;
  background:
    linear-gradient(to top, var(--bg) 3%, rgba(8, 8, 10, 0.2) 46%, rgba(8, 8, 10, 0.55) 100%),
    linear-gradient(to right, rgba(8, 8, 10, 0.72) 0%, rgba(8, 8, 10, 0.1) 60%, transparent 100%);
}
.fx-hero-inner {
  position: absolute; left: clamp(1.1rem, 6vw, 6rem); right: clamp(1.1rem, 6vw, 6rem);
  bottom: clamp(3rem, 12vh, 7.5rem); max-width: 52rem; will-change: transform;
}
.fx-hero-kicker { color: var(--violet); font-size: 0.98rem; font-weight: 500; margin: 0 0 1.1rem; }
.fx-hero-title {
  font-weight: 620; font-size: clamp(2.9rem, 8.6vw, 7rem); line-height: 0.96;
  letter-spacing: -0.035em; margin: 0;
}
.fx-hero-lede {
  color: var(--frost); opacity: 0.9; font-size: clamp(1.05rem, 1.5vw, 1.28rem);
  max-width: 36rem; margin: 1.5rem 0 2rem;
}
.fx-hero-actions { display: flex; flex-wrap: wrap; gap: 0.9rem; }
.fx-reel-dots {
  position: absolute; right: clamp(1.1rem, 6vw, 6rem); bottom: clamp(3rem, 12vh, 7.5rem);
  display: flex; gap: 0.5rem;
}
.fx-reel-dots span { width: 22px; height: 3px; border-radius: 999px; background: var(--line-2); transition: background 0.4s; }
.fx-reel-dots span.is-active { background: var(--violet); }
@media (max-width: 720px) { .fx-reel-dots { display: none; } }

/* SHARED SECTION SCAFFOLD */
.fx-section { padding: clamp(4.5rem, 10vw, 8rem) clamp(1.1rem, 6vw, 6rem); }
.fx-eyebrow { color: var(--violet); font-size: 0.95rem; font-weight: 550; margin: 0 0 0.9rem; }
.fx-h2 {
  font-weight: 600; font-size: clamp(2rem, 5vw, 3.5rem); line-height: 1.02;
  letter-spacing: -0.03em; margin: 0;
}
.fx-sub { color: var(--mist); font-size: 1.08rem; max-width: 40rem; margin: 1rem 0 0; }

/* FOOTER */
.fx-footer { background: var(--bg-2); border-top: 1px solid var(--line); padding: clamp(3.5rem, 7vw, 5.5rem) clamp(1.1rem, 6vw, 6rem) 2.5rem; }
.fx-footer-top { display: flex; flex-wrap: wrap; gap: 1.2rem 3rem; align-items: baseline; justify-content: space-between; padding-bottom: 2.5rem; border-bottom: 1px solid var(--line); }
.fx-footer-tag { color: var(--mist); max-width: 30rem; margin: 0; }
.fx-footer-cols { display: flex; flex-wrap: wrap; gap: 2.5rem 4rem; padding: 2.5rem 0; }
.fx-footer-cols h4 { font-size: 0.95rem; font-weight: 600; margin: 0 0 0.9rem; }
.fx-footer-cols a { display: block; color: var(--mist); text-decoration: none; font-size: 0.95rem; margin-bottom: 0.55rem; transition: color 0.25s; }
.fx-footer-cols a:hover { color: var(--frost); }
.fx-footer-fine { color: var(--faint); font-size: 0.88rem; margin: 0; }

/* Reduced-motion: kill every non-essential animation. */
@media (prefers-reduced-motion: reduce) {
  .flux-root * { animation: none !important; transition: none !important; }
  .fx-reel-slide { transform: none !important; }
}
/* GALLERY */
.fx-gallery-head { display: flex; flex-wrap: wrap; gap: 1.2rem 3rem; align-items: end; justify-content: space-between; margin-bottom: clamp(2.2rem, 4vw, 3.2rem); }
.fx-gallery-head .fx-sub { margin-top: 0; }
.fx-masonry { columns: 3 320px; column-gap: 1rem; }
@media (max-width: 900px) { .fx-masonry { columns: 2 240px; } }
@media (max-width: 560px) { .fx-masonry { columns: 1; } }

.fx-tile {
  position: relative; margin: 0 0 1rem; break-inside: avoid;
  border-radius: 14px; overflow: hidden; background: var(--panel);
  border: 1px solid var(--line); cursor: pointer; outline: none;
  transition: border-color 0.35s, box-shadow 0.4s, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}
.fx-tile.is-hover { border-color: var(--violet); box-shadow: 0 24px 60px -24px var(--violet-glow); transform: translateY(-4px); }
.fx-tile:focus-visible { border-color: var(--violet); }
.fx-tile-frames { position: absolute; inset: 0; }
.fx-tile-img {
  position: absolute; inset: 0; background-size: cover; background-position: center;
  opacity: 0; transition: opacity 0.55s ease, transform 4s ease-out;
}
.fx-tile-img.is-on { opacity: 1; }
.fx-tile.is-hover .fx-tile-img.is-on { transform: scale(1.08); }
.fx-tile-cap {
  position: absolute; inset: auto 0 0 0; z-index: 2;
  padding: 1.5rem 1.1rem 1rem;
  background: linear-gradient(to top, rgba(8, 8, 10, 0.92), rgba(8, 8, 10, 0.55) 60%, transparent);
  transform: translateY(0);
}
.fx-tile-label {
  display: inline-block; font-size: 0.82rem; font-weight: 600; color: var(--frost);
  background: var(--violet); padding: 0.18rem 0.6rem; border-radius: 999px; margin-bottom: 0.55rem;
}
.fx-tile-prompt {
  display: block; font-family: var(--font-geist-mono), ui-monospace, monospace;
  font-size: 0.82rem; line-height: 1.45; color: var(--mist);
  max-height: 0; opacity: 0; overflow: hidden;
  transition: max-height 0.5s ease, opacity 0.4s ease;
}
.fx-tile.is-hover .fx-tile-prompt { max-height: 8rem; opacity: 1; }
.fx-tile-scrub { position: absolute; top: 0.8rem; left: 0.8rem; z-index: 2; display: flex; gap: 0.3rem; opacity: 0; transition: opacity 0.3s; }
.fx-tile.is-hover .fx-tile-scrub { opacity: 1; }
.fx-tile-scrub span { width: 14px; height: 3px; border-radius: 999px; background: rgba(244,244,247,0.35); transition: background 0.3s; }
.fx-tile-scrub span.is-on { background: var(--violet); }

/* STYLES */
.fx-styles { display: grid; grid-template-columns: 1fr 1.05fr; gap: clamp(2rem, 5vw, 4.5rem); align-items: center; background: var(--bg-2); }
@media (max-width: 860px) { .fx-styles { grid-template-columns: 1fr; } }
.fx-styles-copy .fx-sub { margin-bottom: 1.8rem; }
.fx-chips { display: flex; flex-wrap: wrap; gap: 0.6rem; margin-bottom: 1.5rem; }
.fx-chip {
  font-family: inherit; font-size: 0.95rem; font-weight: 500; color: var(--mist);
  background: transparent; border: 1px solid var(--line-2); border-radius: 999px;
  padding: 0.55rem 1.1rem; cursor: pointer;
  transition: color 0.25s, border-color 0.25s, background 0.25s;
}
.fx-chip:hover { color: var(--frost); border-color: var(--frost); }
.fx-chip.is-active { color: #fff; background: var(--violet); border-color: var(--violet); }
.fx-style-blurb { color: var(--frost); opacity: 0.9; font-size: 1.05rem; max-width: 34rem; margin: 0; min-height: 3.4rem; animation: fxFade 0.5s ease; }
@keyframes fxFade { from { opacity: 0; transform: translateY(6px); } to { opacity: 0.9; transform: none; } }
.fx-styles-stage {
  position: relative; aspect-ratio: 4 / 3; border-radius: 16px; overflow: hidden;
  border: 1px solid var(--line); box-shadow: 0 30px 80px -40px rgba(0,0,0,0.9);
}
.fx-style-img { position: absolute; inset: 0; background-size: cover; background-position: center; opacity: 0; transform: scale(1.04); transition: opacity 0.7s ease, transform 0.9s ease; }
.fx-style-img.is-on { opacity: 1; transform: scale(1); }
.fx-style-tag { position: absolute; left: 1rem; bottom: 1rem; font-size: 0.85rem; font-weight: 600; color: #fff; background: rgba(8,8,10,0.7); border: 1px solid var(--line-2); padding: 0.35rem 0.85rem; border-radius: 999px; }

/* PROMPT → OUTPUT MORPH */
.fx-morph-head { max-width: 40rem; margin-bottom: clamp(2.2rem, 4vw, 3.2rem); }
.fx-morph-head .fx-sub { margin-top: 1rem; }
.fx-morph {
  display: grid; grid-template-columns: 1fr auto 1.1fr; gap: clamp(1.2rem, 3vw, 2.5rem); align-items: center;
  opacity: 0; transform: translateY(20px);
  transition: opacity 0.9s cubic-bezier(0.16,1,0.3,1), transform 0.9s cubic-bezier(0.16,1,0.3,1);
}
.fx-morph.is-shown { opacity: 1; transform: none; }
@media (max-width: 780px) { .fx-morph { grid-template-columns: 1fr; } .fx-morph-arrow { transform: rotate(90deg); justify-self: center; } }
.fx-morph-tag { display: block; font-size: 0.8rem; font-weight: 600; color: var(--violet); margin-bottom: 0.8rem; }
.fx-morph-in {
  background: var(--panel); border: 1px solid var(--line); border-radius: 14px;
  padding: 1.5rem 1.6rem; min-height: 11rem; display: flex; flex-direction: column; justify-content: center;
}
.fx-morph-prompt {
  font-family: var(--font-geist-mono), ui-monospace, monospace;
  font-size: clamp(1rem, 1.7vw, 1.3rem); line-height: 1.5; color: var(--frost); margin: 0;
}
.fx-caret { display: inline-block; width: 0.6ch; height: 1.1em; vertical-align: -0.15em; margin-left: 0.15rem; background: var(--violet); animation: fxBlink 1s steps(2) infinite; }
@keyframes fxBlink { 0%, 50% { opacity: 1; } 50.01%, 100% { opacity: 0; } }
.fx-morph-arrow { display: grid; place-items: center; }
.fx-morph-arrow span { position: relative; width: 2.4rem; height: 1px; background: var(--line-2); }
.fx-morph-arrow span::after { content: ""; position: absolute; right: 0; top: 50%; width: 7px; height: 7px; border-top: 1px solid var(--violet); border-right: 1px solid var(--violet); transform: translateY(-50%) rotate(45deg); }
.fx-morph-out .fx-morph-tag { text-align: left; }
.fx-morph-frame {
  position: relative; aspect-ratio: 3 / 2; border-radius: 14px; overflow: hidden;
  border: 1px solid var(--line); background: var(--panel);
}
.fx-morph-img { position: absolute; inset: 0; background-size: cover; background-position: center; opacity: 0; transform: scale(1.05); transition: opacity 0.8s ease, transform 1.2s ease; }
.fx-morph-img.is-on { opacity: 1; transform: scale(1); }
.fx-morph-wipe {
  position: absolute; inset: 0; z-index: 2; background: var(--bg);
  clip-path: inset(0 0 0 0);
  transition: clip-path 1.1s cubic-bezier(0.76, 0, 0.24, 1);
}
.fx-morph-wipe.is-open { clip-path: inset(0 0 0 100%); }

/* LINEAGE TIMELINE */
.fx-lineage { background: var(--bg-2); }
.fx-lineage-head { max-width: 40rem; margin-bottom: clamp(2.5rem, 5vw, 4rem); }
.fx-lineage-head .fx-sub { margin-top: 1rem; }
.fx-timeline { list-style: none; margin: 0; padding: 0; position: relative; }
.fx-timeline::before { content: ""; position: absolute; left: 6.5rem; top: 0.4rem; bottom: 0.4rem; width: 1px; background: var(--line); }
@media (max-width: 620px) { .fx-timeline::before { left: 0.3rem; } }
.fx-tl-item { position: relative; display: grid; grid-template-columns: 6.5rem 1fr; gap: 0 2rem; padding: 0 0 clamp(2rem, 4vw, 3rem); }
.fx-tl-item:last-child { padding-bottom: 0; }
@media (max-width: 620px) { .fx-tl-item { grid-template-columns: 1fr; gap: 0.4rem; padding-left: 1.6rem; } }
.fx-tl-year { font-variant-numeric: tabular-nums; font-weight: 600; font-size: 1.05rem; color: var(--violet); padding-top: 0.05rem; }
@media (max-width: 620px) { .fx-tl-year { grid-row: 1; } }
.fx-tl-node { position: absolute; left: 6.5rem; top: 0.5rem; width: 11px; height: 11px; border-radius: 50%; background: var(--violet); transform: translateX(-5px); box-shadow: 0 0 0 4px var(--bg-2), 0 0 14px var(--violet-glow); }
@media (max-width: 620px) { .fx-tl-node { left: 0.3rem; } }
.fx-tl-name { font-weight: 600; font-size: clamp(1.2rem, 2.4vw, 1.6rem); letter-spacing: -0.02em; margin: 0 0 0.5rem; }
.fx-tl-note { color: var(--mist); font-size: 1.02rem; margin: 0; max-width: 42rem; }

/* COMMUNITY */
.fx-community-head { max-width: 40rem; margin-bottom: clamp(2.2rem, 4vw, 3.2rem); }
.fx-community-head .fx-sub { margin-top: 1rem; }
.fx-creators { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
@media (max-width: 820px) { .fx-creators { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 520px) { .fx-creators { grid-template-columns: 1fr; } }
.fx-creator { border: 1px solid var(--line); border-radius: 14px; overflow: hidden; background: var(--panel); transition: border-color 0.35s, transform 0.5s cubic-bezier(0.16,1,0.3,1); }
.fx-creator:hover { border-color: var(--line-2); transform: translateY(-4px); }
.fx-creator-img { aspect-ratio: 4 / 3; background-size: cover; background-position: center; }
.fx-creator-row { display: flex; align-items: center; gap: 0.75rem; padding: 0.9rem 1rem 1.05rem; }
.fx-creator-avatar { display: grid; place-items: center; width: 2.1rem; height: 2.1rem; border-radius: 50%; color: #fff; font-weight: 600; font-size: 0.95rem; flex: 0 0 auto; }
.fx-creator-handle { font-weight: 550; font-size: 0.98rem; margin: 0; }
.fx-creator-craft { color: var(--faint); font-size: 0.86rem; margin: 0.1rem 0 0; }

/* START CTA */
.fx-start { position: relative; text-align: center; display: grid; place-items: center; min-height: 82vh; overflow: hidden; }
.fx-start-bg { position: absolute; inset: -4% 0; background-size: cover; background-position: center; }
.fx-start-scrim { position: absolute; inset: 0; background: radial-gradient(ellipse at center, rgba(8,8,10,0.55), rgba(8,8,10,0.9)); }
.fx-start-inner { position: relative; max-width: 42rem; padding: 0 1rem; }
.fx-start-title { font-weight: 620; font-size: clamp(2.1rem, 6vw, 4.2rem); line-height: 1.0; letter-spacing: -0.035em; margin: 0 0 1.2rem; }
.fx-start-lede { color: var(--frost); opacity: 0.9; font-size: 1.15rem; max-width: 34rem; margin: 0 auto 2rem; }
.fx-start-actions { justify-content: center; }

/* fx-css-end */
`
