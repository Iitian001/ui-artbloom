"use client"

import { useEffect, useLayoutEffect, useRef, useState } from "react"

/**
 * Umbra — an immersive, GPU-feel experience for a digital experience studio.
 *
 * The whole site sits on ONE persistent full-viewport canvas: a flow-field of
 * glowing particles that drift on their own, get pushed and swirled by cursor
 * velocity, and knit into a constellation wherever the pointer rests. Scroll acts
 * as a timeline scrubber — density, speed and hue morph through the journey — and
 * the field is the studio's proof of craft, so there is no photography anywhere.
 *
 * Deliberately against the tells: base is a pure cool graphite (not brown-tinted
 * near-black), the single accent is the brief's electric indigo (never a second
 * acid colour — hue only drifts inside the indigo family), no glass/backdrop-blur,
 * no arrow glyphs on links, no middle-dot metas, no tracked-caps eyebrows. Numbering
 * appears only on the chapters, which are a genuine three-part process. Every bit of
 * motion — preloader, canvas, custom cursor, reveals, FLIP — is gated on
 * prefers-reduced-motion, which renders a single calm static frame instead.
 */

const useIso = typeof window !== "undefined" ? useLayoutEffect : useEffect

type Project = {
  title: string
  client: string
  kind: string
  year: string
  copy: string
  results: string[]
}

const PROJECTS: Project[] = [
  {
    title: "Aurora",
    client: "Kist Audio",
    kind: "Launch experience",
    year: "2025",
    copy: "Kist built a synthesiser you play by moving your hands through the air. The site had to feel the same way, so we made a browser instrument: a field of tones you sculpt with the cursor, tuned to the hardware's real oscillators.",
    results: ["4:12 average session", "Awwwards Site of the Day", "First run sold out in nine days"],
  },
  {
    title: "Tide",
    client: "Blue Current",
    kind: "Interactive data story",
    year: "2024",
    copy: "Forty years of ocean-temperature readings, told as a single scroll. We rendered each reading as a moving current so the warming reads as motion rather than a chart, and let readers scrub any year to feel the shift.",
    results: ["1.2M reads in the first month", "Cited in two UN briefings", "Webby nomination"],
  },
  {
    title: "Meridian",
    client: "Relay Logistics",
    kind: "Realtime globe",
    year: "2025",
    copy: "A live globe on Relay's homepage drawing every shipment in motion on the GPU, so a hundred thousand arcs hold sixty frames. The sales team now opens every pitch by spinning it.",
    results: ["100k live routes", "60fps on a four-year-old laptop", "Halved the pitch deck"],
  },
  {
    title: "Loom",
    client: "Atelier Vurn",
    kind: "Fashion film site",
    year: "2024",
    copy: "A film-first site for a Paris atelier, where the collection unspools as you scroll and the cloth keeps moving even after you stop. No stock imagery, no grid — only fabric, type and time.",
    results: ["Featured at Paris Fashion Week", "Zero stock photos", "Bounce rate under nine percent"],
  },
]

const OBJECTS: { title: string; kind: string }[] = [
  { title: "Aurora", kind: "Browser instrument" },
  { title: "Tide", kind: "Data story" },
  { title: "Meridian", kind: "Realtime globe" },
  { title: "Loom", kind: "Film site" },
  { title: "Prism", kind: "Museum installation" },
  { title: "Kern", kind: "Type playground" },
]

const CHAPTERS: { n: string; title: string; copy: string }[] = [
  {
    n: "01",
    title: "Signal",
    copy: "Every project starts as one behaviour — a single hover, load, or transition — that we get obsessively right before anything else is allowed to exist.",
  },
  {
    n: "02",
    title: "Field",
    copy: "Then we build the system around it. A particle field, a physics model, a shader — whatever it takes to make the whole thing move as one piece.",
  },
  {
    n: "03",
    title: "Light",
    copy: "By launch it should feel inevitable. You stop noticing the engineering. You just don't want to close the tab.",
  },
]

const CAPABILITIES = [
  "Immersive websites",
  "WebGL and canvas",
  "Realtime and shaders",
  "Product launches",
  "Brand systems in motion",
  "Installations and spatial",
  "Rapid prototyping",
  "Art direction",
]

/** Reveal children once, when they scroll into view. Reduced-motion shows instantly. */
function useReveal<T extends HTMLElement>(threshold = 0.2) {
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

/** One scroll-scrubbed narrative chapter. */
function Chapter({ n, title, copy }: { n: string; title: string; copy: string }) {
  const [ref, shown] = useReveal<HTMLDivElement>(0.45)
  return (
    <div className={`um-chapter ${shown ? "is-shown" : ""}`} ref={ref}>
      <span className="um-ch-index">{n}</span>
      <h3 className="um-ch-title">{title}</h3>
      <p className="um-ch-copy">{copy}</p>
    </div>
  )
}

export default function Umbra() {
  const reducedRef = useRef(false)
  const [reduced, setReduced] = useState(false)

  // preloader
  const [count, setCount] = useState(0)
  const [wipe, setWipe] = useState(false)
  const [gone, setGone] = useState(false)

  // canvas + cursor plumbing (refs, so the loop never re-renders React)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const cursorRef = useRef<HTMLDivElement>(null)
  const hudRef = useRef<HTMLSpanElement>(null)
  const pointer = useRef({ x: -9999, y: -9999, vx: 0, vy: 0, active: false })
  const ring = useRef({ x: 0, y: 0, scale: 1 })
  const scroll = useRef({ p: 0 })
  const [hasCursor, setHasCursor] = useState(false)
  const [floatCta, setFloatCta] = useState(false)

  // magnetic label over the objects grid
  const magRef = useRef<HTMLDivElement>(null)
  const [magText, setMagText] = useState(OBJECTS[0])
  const [magOn, setMagOn] = useState(false)

  // FLIP project panel
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([])
  const panelRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState<number | null>(null)
  const [panelReady, setPanelReady] = useState(false)

  const [capsRef, capsShown] = useReveal<HTMLDivElement>(0.3)
  const [objHeadRef, objHeadShown] = useReveal<HTMLDivElement>(0.3)
  const [workHeadRef, workHeadShown] = useReveal<HTMLDivElement>(0.3)

  /* ---- preloader: 0 -> 100 counter, then a wipe reveal ---- */
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    reducedRef.current = mq.matches
    setReduced(mq.matches)
    const onMq = () => {
      reducedRef.current = mq.matches
      setReduced(mq.matches)
    }
    mq.addEventListener("change", onMq)

    if (mq.matches) {
      setCount(100)
      setGone(true)
      return () => mq.removeEventListener("change", onMq)
    }

    document.body.style.overflow = "hidden"
    const start = performance.now()
    const DUR = 1900
    let raf = 0
    let done = 0
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / DUR)
      const eased = 1 - Math.pow(1 - t, 3)
      setCount(Math.round(eased * 100))
      if (t < 1) raf = requestAnimationFrame(tick)
      else {
        setWipe(true)
        done = window.setTimeout(() => {
          setGone(true)
          document.body.style.overflow = ""
        }, 950)
      }
    }
    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      window.clearTimeout(done)
      mq.removeEventListener("change", onMq)
      document.body.style.overflow = ""
    }
  }, [])

  /* ---- scroll telemetry: progress drives the canvas + surfaces the floating CTA ---- */
  useEffect(() => {
    let raf = 0
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight
        const p = max > 0 ? window.scrollY / max : 0
        scroll.current.p = p
        setFloatCta(p > 0.55 && p < 0.985)
        raf = 0
      })
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    onScroll()
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  /* ---- the canvas engine: flow-field particles, cursor forces, custom cursor ---- */
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d", { alpha: false })
    if (!ctx) return

    let w = 0
    let h = 0
    let dpr = 1
    const resize = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1)
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      canvas.style.width = w + "px"
      canvas.style.height = h + "px"
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()

    const N = Math.max(160, Math.min(820, Math.floor((w * h) / 1900)))
    const P = Array.from({ length: N }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: 0,
      vy: 0,
      z: 0.4 + Math.random() * 0.9,
    }))

    const field = (x: number, y: number, t: number) => {
      const s = 0.0016
      return (
        (Math.sin(x * s + t * 0.15) +
          Math.cos(y * s * 1.3 - t * 0.12) +
          Math.sin((x + y) * s * 0.6 + t * 0.08)) *
        1.05
      )
    }

    // reduced motion: settle the field once and freeze it, no listeners, no loop
    if (reducedRef.current) {
      ctx.fillStyle = "#070709"
      ctx.fillRect(0, 0, w, h)
      ctx.globalCompositeOperation = "lighter"
      for (let step = 0; step < 70; step++) {
        for (let i = 0; i < N; i++) {
          const a = P[i]
          const ang = field(a.x, a.y, step * 0.05) * Math.PI
          a.x += Math.cos(ang) * 1.25
          a.y += Math.sin(ang) * 1.25
        }
      }
      for (let i = 0; i < N; i++) {
        const a = P[i]
        ctx.beginPath()
        ctx.fillStyle = "hsla(248, 95%, 66%, 0.5)"
        ctx.arc(((a.x % w) + w) % w, ((a.y % h) + h) % h, a.z * 1.5, 0, 6.283)
        ctx.fill()
      }
      const onR = () => {
        resize()
        ctx.fillStyle = "#070709"
        ctx.fillRect(0, 0, w, h)
      }
      window.addEventListener("resize", onR)
      return () => window.removeEventListener("resize", onR)
    }

    const coarse = window.matchMedia("(pointer: coarse)").matches
    if (!coarse) setHasCursor(true)

    const onMove = (e: PointerEvent) => {
      const pt = pointer.current
      let dx = e.clientX - pt.x
      let dy = e.clientY - pt.y
      if (!pt.active) {
        dx = 0
        dy = 0
      }
      pt.vx = Math.max(-42, Math.min(42, dx))
      pt.vy = Math.max(-42, Math.min(42, dy))
      pt.x = e.clientX
      pt.y = e.clientY
      pt.active = true
    }
    const onLeave = () => {
      pointer.current.active = false
    }
    const onOver = (e: PointerEvent) => {
      const el = (e.target as HTMLElement)?.closest("a, button, .um-tile, .um-card")
      ring.current.scale = el ? 2 : 1
      if (cursorRef.current) cursorRef.current.classList.toggle("is-hover", !!el)
    }
    window.addEventListener("pointermove", onMove, { passive: true })
    window.addEventListener("pointerover", onOver, { passive: true })
    window.addEventListener("pointerleave", onLeave)
    window.addEventListener("blur", onLeave)
    window.addEventListener("resize", resize)

    ctx.fillStyle = "#070709"
    ctx.fillRect(0, 0, w, h)

    let t = 0
    let frames = 0
    let raf = 0
    const loop = () => {
      t += 0.016
      frames++
      const p = scroll.current.p
      const speed = 0.6 + p * 1.15
      const hue = 250 - p * 26 // stays inside the indigo family (250 -> 224)
      const density = 0.55 + p * 0.45
      const pt = pointer.current

      // motion trails instead of a hard clear -> the additive-glow bloom look
      ctx.globalCompositeOperation = "source-over"
      ctx.fillStyle = "rgba(7, 7, 9, 0.14)"
      ctx.fillRect(0, 0, w, h)

      ctx.globalCompositeOperation = "lighter"
      for (let i = 0; i < N; i++) {
        const a = P[i]
        const ang = field(a.x, a.y, t) * Math.PI
        a.vx += Math.cos(ang) * 0.06 * speed * a.z
        a.vy += Math.sin(ang) * 0.06 * speed * a.z
        if (pt.active) {
          const dx = a.x - pt.x
          const dy = a.y - pt.y
          const d2 = dx * dx + dy * dy
          const R = 175
          if (d2 < R * R) {
            const d = Math.sqrt(d2) || 1
            const f = 1 - d / R
            a.vx += (dx / d) * f * 2.5 + (-dy / d) * f * 1.15 + pt.vx * 0.045 * f
            a.vy += (dy / d) * f * 2.5 + (dx / d) * f * 1.15 + pt.vy * 0.045 * f
          }
        }
        a.vx *= 0.92
        a.vy *= 0.92
        a.x += a.vx
        a.y += a.vy
        if (a.x < -12) a.x = w + 12
        else if (a.x > w + 12) a.x = -12
        if (a.y < -12) a.y = h + 12
        else if (a.y > h + 12) a.y = -12
        const size = a.z * 1.5 * (0.7 + density * 0.6)
        ctx.beginPath()
        ctx.fillStyle = `hsla(${hue}, 95%, ${60 + a.z * 10}%, ${0.45 * density + 0.2})`
        ctx.arc(a.x, a.y, size, 0, 6.283)
        ctx.fill()
      }

      // constellation: the field knits into a network only where the cursor rests
      if (pt.active) {
        const near: { x: number; y: number }[] = []
        const R = 150
        for (let i = 0; i < N; i++) {
          const a = P[i]
          const dx = a.x - pt.x
          const dy = a.y - pt.y
          if (dx * dx + dy * dy < R * R) near.push(a)
        }
        ctx.lineWidth = 1
        for (let i = 0; i < near.length; i++) {
          for (let j = i + 1; j < near.length; j++) {
            const a = near[i]
            const b = near[j]
            const dx = a.x - b.x
            const dy = a.y - b.y
            const d2 = dx * dx + dy * dy
            if (d2 < 3600) {
              const al = (1 - Math.sqrt(d2) / 60) * 0.5
              ctx.strokeStyle = `hsla(${hue}, 95%, 72%, ${al})`
              ctx.beginPath()
              ctx.moveTo(a.x, a.y)
              ctx.lineTo(b.x, b.y)
              ctx.stroke()
            }
          }
        }
      }
      pt.vx *= 0.86
      pt.vy *= 0.86

      // custom cursor ring: lags the pointer, grows over interactive targets
      const r = ring.current
      r.x += (pt.x - r.x) * 0.18
      r.y += (pt.y - r.y) * 0.18
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${r.x}px, ${r.y}px, 0) translate(-50%, -50%) scale(${r.scale})`
      }
      // live pointer telemetry in the HUD, a few times a second
      if (frames % 6 === 0 && hudRef.current && pt.active) {
        hudRef.current.textContent = `x ${String(Math.round(pt.x)).padStart(4, "0")}  y ${String(
          Math.round(pt.y),
        ).padStart(4, "0")}`
      }

      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("pointerover", onOver)
      window.removeEventListener("pointerleave", onLeave)
      window.removeEventListener("blur", onLeave)
      window.removeEventListener("resize", resize)
    }
  }, [])

  /* ---- FLIP: a card grows into the detail panel from its own rect ---- */
  useIso(() => {
    if (active === null) return
    const panel = panelRef.current
    const src = cardRefs.current[active]
    if (!panel) return
    if (reducedRef.current || !src) {
      panel.style.transform = "none"
      panel.style.opacity = "1"
      setPanelReady(true)
      return
    }
    const s = src.getBoundingClientRect()
    const pr = panel.getBoundingClientRect()
    const dx = s.left - pr.left
    const dy = s.top - pr.top
    const sx = s.width / pr.width
    const sy = s.height / pr.height
    panel.style.transformOrigin = "top left"
    panel.style.transition = "none"
    panel.style.opacity = "1"
    panel.style.transform = `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`
    void panel.offsetWidth
    requestAnimationFrame(() => {
      panel.style.transition = "transform 0.62s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease"
      panel.style.transform = "none"
      setPanelReady(true)
    })
  }, [active])

  const closePanel = () => {
    const panel = panelRef.current
    const src = active !== null ? cardRefs.current[active] : null
    if (!panel || !src || reducedRef.current) {
      setActive(null)
      setPanelReady(false)
      return
    }
    const s = src.getBoundingClientRect()
    const pr = panel.getBoundingClientRect()
    const dx = s.left - pr.left
    const dy = s.top - pr.top
    const sx = s.width / pr.width
    const sy = s.height / pr.height
    setPanelReady(false)
    panel.style.transition = "transform 0.5s cubic-bezier(0.7, 0, 0.84, 0), opacity 0.4s ease"
    panel.style.transformOrigin = "top left"
    panel.style.transform = `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`
    panel.style.opacity = "0"
    const finish = () => {
      panel.removeEventListener("transitionend", finish)
      setActive(null)
    }
    panel.addEventListener("transitionend", finish)
  }

  /* ---- lock scroll + wire Escape while the panel is open ---- */
  useEffect(() => {
    if (active === null) return
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closePanel()
    }
    window.addEventListener("keydown", onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener("keydown", onKey)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active])

  const onGridMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reducedRef.current || !magRef.current) return
    const box = e.currentTarget.getBoundingClientRect()
    magRef.current.style.transform = `translate(${e.clientX - box.left}px, ${e.clientY - box.top}px) translate(-50%, -140%)`
  }

  return (
    <div className={`umbra-root ${hasCursor ? "has-cursor" : ""} ${gone ? "is-ready" : "is-loading"}`}>
      <style>{css}</style>

      <canvas ref={canvasRef} className="um-canvas" aria-hidden="true" />

      {/* CUSTOM CURSOR — a ring that lags the pointer (hidden on touch / reduced motion) */}
      <div ref={cursorRef} className="um-cursor" aria-hidden="true" />

      {/* PRELOADER */}
      {!gone && (
        <div className={`um-pre ${wipe ? "is-wipe" : ""}`} aria-hidden="true">
          <div className="um-pre-num">
            <span className="um-pre-count">{count}</span>
            <span className="um-pre-pct">%</span>
          </div>
          <div className="um-pre-bar">
            <span className="um-pre-bar-fill" style={{ width: `${count}%` }} />
          </div>
          <span className="um-pre-label">Umbra — compiling the field</span>
        </div>
      )}

      {/* HUD NAV */}
      <header className={`um-nav ${gone ? "um-in" : ""}`}>
        <a className="um-mark" href="#top">
          Umbra
        </a>
        <nav className="um-nav-links">
          <a className="um-nav-a" href="#work">
            Work
          </a>
          <a className="um-nav-a" href="#studio">
            Studio
          </a>
          <a className="um-nav-a" href="#studio">
            Capabilities
          </a>
          <a className="um-nav-cta" href="#start">
            Start a project
          </a>
        </nav>
        <div className="um-hud" aria-hidden="true">
          <span className="um-hud-dot" />
          <span className="um-hud-read" ref={hudRef}>
            live field
          </span>
        </div>
      </header>

      {/* HERO */}
      <section className="um-hero" id="top">
        <div className={`um-hero-inner ${gone ? "um-in" : ""}`}>
          <p className="um-kicker">A digital experience studio in Lisbon</p>
          <h1 className="um-title">
            <span className="um-title-line">Interfaces that</span>
            <span className="um-title-line">behave like</span>
            <span className="um-title-line um-title-accent">light.</span>
          </h1>
          <p className="um-lede">
            Umbra builds immersive websites, product launches, and installations for people who want the
            work itself to be the proof. This page is running the same engine we ship.
          </p>
          <div className="um-hero-meta">
            <a className="um-hero-cta" href="#work">
              See selected work
            </a>
            <span className="um-hero-note">Move your cursor. The field is listening.</span>
          </div>
        </div>
        <div className="um-scrollcue" aria-hidden="true">
          <span />
        </div>
      </section>

      {/* CHAPTERS — scroll is the scrubber; the field morphs as these reveal */}
      <section className="um-chapters" id="studio">
        <div className="um-scrub" aria-hidden="true">
          <span className="um-scrub-line" />
        </div>
        <div className="um-chapters-head">
          <p className="um-eyebrow">How the work gets made</p>
          <p className="um-chapters-sub">
            Three moves, in order. The field behind you shifts a little with each one.
          </p>
        </div>
        {CHAPTERS.map((c) => (
          <Chapter key={c.n} n={c.n} title={c.title} copy={c.copy} />
        ))}
      </section>

      {/* OBJECTS — a hover-reactive grid with a magnetic label */}
      <section className="um-objects">
        <div className={`um-obj-head ${objHeadShown ? "is-shown" : ""}`} ref={objHeadRef}>
          <h2 className="um-h2">Six things we made move</h2>
          <p className="um-obj-sub">Hover to bring one forward. The label follows your cursor.</p>
        </div>
        <div className="um-grid" onPointerMove={onGridMove} onPointerLeave={() => setMagOn(false)}>
          {OBJECTS.map((o, i) => (
            <div
              className="um-tile"
              key={o.title}
              style={{ "--i": i } as React.CSSProperties}
              onPointerEnter={() => {
                setMagText(o)
                setMagOn(true)
              }}
            >
              <div className="um-tile-art" data-v={i % 4} />
              <span className="um-tile-name">{o.title}</span>
            </div>
          ))}
          <div ref={magRef} className={`um-mag ${magOn ? "is-on" : ""}`} aria-hidden="true">
            <span className="um-mag-title">{magText.title}</span>
            <span className="um-mag-kind">{magText.kind}</span>
          </div>
        </div>
      </section>

      {/* WORK — cards that FLIP-grow into a detail panel */}
      <section className="um-work" id="work">
        <div className={`um-work-head ${workHeadShown ? "is-shown" : ""}`} ref={workHeadRef}>
          <h2 className="um-h2">Selected work</h2>
          <p className="um-work-sub">Four we can talk about. Open one.</p>
        </div>
        <div className="um-cards">
          {PROJECTS.map((p, i) => (
            <button
              className="um-card"
              key={p.title}
              ref={(el) => {
                cardRefs.current[i] = el
              }}
              onClick={() => {
                setActive(i)
                setPanelReady(false)
              }}
              aria-label={`Open ${p.title} for ${p.client}`}
            >
              <div className="um-card-art" data-v={i % 4} />
              <div className="um-card-body">
                <div className="um-card-top">
                  <h3 className="um-card-title">{p.title}</h3>
                  <span className="um-card-year">{p.year}</span>
                </div>
                <p className="um-card-client">{p.client}</p>
                <p className="um-card-kind">{p.kind}</p>
              </div>
              <span className="um-card-open">Open</span>
            </button>
          ))}
        </div>
      </section>

      {/* CAPABILITIES — kinetic list, no numbering (not a sequence) */}
      <section className="um-caps">
        <div className={`um-caps-inner ${capsShown ? "is-shown" : ""}`} ref={capsRef}>
          <p className="um-eyebrow">What we do</p>
          <ul className="um-caps-list">
            {CAPABILITIES.map((c, i) => (
              <li className="um-cap" key={c} style={{ "--d": `${i * 60}ms` } as React.CSSProperties}>
                <span className="um-cap-text">{c}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA — surfaces at the end of the journey */}
      <section className="um-cta" id="start">
        <div className="um-cta-inner">
          <h2 className="um-cta-title">Have something that should feel alive?</h2>
          <p className="um-cta-lede">
            Tell us what you're launching and what you want people to feel. We reply the same day, with an
            honest read on whether we're the right studio for it.
          </p>
          <a className="um-cta-btn" href="mailto:studio@umbra.work">
            Start a project
          </a>
          <div className="um-cta-contact">
            <a href="mailto:studio@umbra.work">studio@umbra.work</a>
            <span>Rua do Século, Lisbon</span>
          </div>
        </div>
      </section>

      <footer className="um-footer">
        <span className="um-mark">Umbra</span>
        <p className="um-foot-copy">A digital experience studio. We make the screen worth looking at.</p>
        <div className="um-foot-links">
          <a href="#work">Work</a>
          <a href="#studio">Studio</a>
          <a href="mailto:studio@umbra.work">Contact</a>
        </div>
        <p className="um-foot-fine">Booking select projects for 2026.</p>
      </footer>

      {/* FLOATING CTA — anchored, appears deep in the journey */}
      <a className={`um-float ${floatCta ? "is-on" : ""}`} href="#start">
        Start a project
      </a>

      {/* FLIP DETAIL PANEL */}
      {active !== null && (
        <div className={`um-overlay ${panelReady ? "is-open" : ""}`}>
          <button className="um-scrim" aria-label="Close" onClick={closePanel} />
          <div className="um-panel" ref={panelRef}>
            <div className="um-panel-art" data-v={active % 4} />
            <div className={`um-panel-body ${panelReady ? "is-in" : ""}`}>
              <button className="um-panel-close" onClick={closePanel} aria-label="Close panel">
                Close
              </button>
              <span className="um-panel-kind">{PROJECTS[active].kind}</span>
              <h3 className="um-panel-title">{PROJECTS[active].title}</h3>
              <p className="um-panel-client">
                {PROJECTS[active].client}
                <span className="um-panel-year">{PROJECTS[active].year}</span>
              </p>
              <p className="um-panel-copy">{PROJECTS[active].copy}</p>
              <ul className="um-panel-results">
                {PROJECTS[active].results.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const cssBase = `
.umbra-root {
  --void: #070709;
  --void-2: #0a0a0e;
  --ink: #111119;
  --pale: #f3f3fa;
  --mute: #9a9ab6;
  --faint: rgba(154, 154, 182, 0.14);
  --line: rgba(154, 154, 182, 0.2);
  --indigo: #6c5cff;
  --indigo-lo: rgba(108, 92, 255, 0.16);
  position: relative;
  background: var(--void);
  color: var(--pale);
  font-family: var(--font-geist), system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
  line-height: 1.6;
  overflow-x: hidden;
}
.umbra-root *,
.umbra-root *::before,
.umbra-root *::after { box-sizing: border-box; }
.umbra-root.has-cursor,
.umbra-root.has-cursor a,
.umbra-root.has-cursor button { cursor: none; }
.umbra-root ::selection { background: var(--indigo); color: #fff; }
.umbra-root a { color: inherit; text-decoration: none; }
.umbra-root :focus-visible {
  outline: 2px solid var(--indigo);
  outline-offset: 3px;
  border-radius: 2px;
}

/* the persistent field */
.um-canvas {
  position: fixed; inset: 0; z-index: 0;
  width: 100%; height: 100%; display: block;
}

/* custom cursor */
.um-cursor {
  position: fixed; top: 0; left: 0; z-index: 9999;
  width: 34px; height: 34px; margin: 0; border-radius: 50%;
  border: 1.5px solid rgba(108, 92, 255, 0.85);
  pointer-events: none; display: none;
  mix-blend-mode: screen;
  transition: width 0.3s, height 0.3s, background 0.3s;
  will-change: transform;
}
.um-cursor::after {
  content: ""; position: absolute; top: 50%; left: 50%;
  width: 4px; height: 4px; border-radius: 50%; background: var(--indigo);
  transform: translate(-50%, -50%);
}
.um-cursor.is-hover { background: rgba(108, 92, 255, 0.12); }
.has-cursor .um-cursor { display: block; }

/* PRELOADER */
.um-pre {
  position: fixed; inset: 0; z-index: 9000;
  background: var(--void);
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 1.4rem;
  transition: transform 0.9s cubic-bezier(0.76, 0, 0.24, 1);
}
.um-pre.is-wipe { transform: translateY(-100%); }
.um-pre-num { display: flex; align-items: baseline; gap: 0.15rem; color: var(--pale); }
.um-pre-count {
  font-family: var(--font-geist-mono), monospace;
  font-size: clamp(3.5rem, 12vw, 7rem); font-weight: 500;
  letter-spacing: -0.03em; font-variant-numeric: tabular-nums; line-height: 1;
}
.um-pre-pct {
  font-family: var(--font-geist-mono), monospace;
  font-size: 1.3rem; color: var(--indigo);
}
.um-pre-bar {
  width: min(340px, 62vw); height: 2px; background: var(--faint); overflow: hidden; border-radius: 2px;
}
.um-pre-bar-fill {
  display: block; height: 100%;
  background: linear-gradient(90deg, var(--indigo), #a99cff);
  box-shadow: 0 0 18px rgba(108, 92, 255, 0.7);
}
.um-pre-label {
  font-family: var(--font-geist-mono), monospace;
  font-size: 0.8rem; color: var(--mute); letter-spacing: 0.01em;
}

/* NAV */
.um-nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 60;
  display: flex; align-items: center; justify-content: space-between;
  gap: 1rem;
  padding: 1.35rem clamp(1.1rem, 4vw, 3rem);
  background: linear-gradient(to bottom, rgba(7, 7, 9, 0.7), transparent);
  opacity: 0; transform: translateY(-10px);
}
.um-nav.um-in { opacity: 1; transform: none; transition: opacity 0.8s ease 0.3s, transform 0.8s ease 0.3s; }
.um-mark {
  font-family: var(--font-geist), system-ui, sans-serif;
  font-weight: 600; font-size: 1.3rem; letter-spacing: -0.02em; color: var(--pale);
}
.um-nav-links { display: flex; align-items: center; gap: clamp(1rem, 2.4vw, 2.1rem); }
.um-nav-a { font-size: 0.95rem; color: var(--mute); transition: color 0.3s; }
.um-nav-a:hover { color: var(--pale); }
.um-nav-cta {
  font-size: 0.9rem; color: var(--pale);
  border: 1px solid var(--line); border-radius: 999px; padding: 0.5rem 1.05rem;
  transition: border-color 0.3s, background 0.3s, color 0.3s;
}
.um-nav-cta:hover { background: var(--indigo); border-color: var(--indigo); color: #fff; }
.um-hud { display: flex; align-items: center; gap: 0.5rem; }
.um-hud-dot {
  width: 7px; height: 7px; border-radius: 50%; background: var(--indigo);
  box-shadow: 0 0 10px var(--indigo); animation: umpulse 2.6s ease-in-out infinite;
}
@keyframes umpulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 1; } }
.um-hud-read {
  font-family: var(--font-geist-mono), monospace;
  font-size: 0.78rem; color: var(--mute); font-variant-numeric: tabular-nums;
  letter-spacing: 0.02em; min-width: 8.5ch;
}

/* HERO */
.um-hero {
  position: relative; z-index: 1;
  min-height: 100svh; display: flex; align-items: center;
  padding: 7rem clamp(1.25rem, 6vw, 6rem) 4rem;
}
.um-hero-inner {
  max-width: 62rem;
  opacity: 0; transform: translateY(24px);
}
.um-hero-inner.um-in { opacity: 1; transform: none; transition: opacity 1s ease 0.55s, transform 1s cubic-bezier(0.16, 1, 0.3, 1) 0.55s; }
.um-kicker {
  color: var(--mute); font-size: clamp(0.95rem, 1.4vw, 1.1rem); margin: 0 0 1.6rem;
}
.um-title {
  margin: 0; font-weight: 620;
  font-size: clamp(3rem, 11.5vw, 9.5rem); line-height: 0.9; letter-spacing: -0.035em;
}
.um-title-line { display: block; }
.um-title-accent {
  color: var(--indigo);
  text-shadow: 0 0 48px rgba(108, 92, 255, 0.55);
}
.um-lede {
  max-width: 40rem; margin: 2rem 0 0; font-family: var(--font-inter), system-ui, sans-serif;
  font-size: clamp(1.05rem, 1.6vw, 1.35rem); color: var(--pale); opacity: 0.9;
  text-shadow: 0 2px 30px rgba(7, 7, 9, 0.8);
}
.um-hero-meta { display: flex; align-items: center; gap: 1.5rem; flex-wrap: wrap; margin-top: 2.4rem; }
.um-hero-cta {
  display: inline-block; background: var(--indigo); color: #fff; font-weight: 550;
  padding: 0.9rem 1.7rem; border-radius: 999px;
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s;
}
.um-hero-cta:hover { transform: translateY(-3px); box-shadow: 0 20px 44px -14px rgba(108, 92, 255, 0.75); }
.um-hero-note {
  font-family: var(--font-geist-mono), monospace; font-size: 0.82rem; color: var(--mute);
}
.um-scrollcue { position: absolute; left: 50%; bottom: 1.8rem; transform: translateX(-50%); }
.um-scrollcue span {
  display: block; width: 1px; height: 44px;
  background: linear-gradient(to bottom, transparent, var(--indigo));
  animation: umcue 2.4s ease-in-out infinite;
}
@keyframes umcue { 0%, 100% { opacity: 0.2; transform: scaleY(0.55); transform-origin: top; } 50% { opacity: 1; transform: scaleY(1); } }
`

const cssMore = `
.um-eyebrow {
  font-family: var(--font-geist-mono), monospace;
  font-size: 0.82rem; color: var(--indigo); margin: 0 0 0.9rem; letter-spacing: 0.02em;
}
.um-h2 {
  margin: 0; font-weight: 600; font-size: clamp(2.1rem, 5.5vw, 4rem);
  line-height: 1.0; letter-spacing: -0.03em;
}

/* CHAPTERS */
.um-chapters {
  position: relative; z-index: 1;
  padding: clamp(6rem, 16vh, 12rem) clamp(1.25rem, 6vw, 6rem);
  display: grid; gap: clamp(3rem, 9vh, 7rem);
  max-width: 60rem; margin: 0 auto;
}
.um-scrub {
  position: absolute; left: clamp(0.6rem, 3vw, 3rem); top: 12%; bottom: 12%; width: 2px;
  background: var(--faint); border-radius: 2px; overflow: hidden;
}
.um-scrub-line {
  position: absolute; inset: 0; transform-origin: top;
  background: linear-gradient(to bottom, var(--indigo), transparent);
  animation: umscrub linear both; animation-timeline: view();
}
@keyframes umscrub { from { transform: scaleY(0); } to { transform: scaleY(1); } }
.um-chapters-head { max-width: 34rem; }
.um-chapters-sub {
  margin: 0; font-family: var(--font-inter), system-ui, sans-serif;
  color: var(--mute); font-size: 1.05rem;
}
.um-chapter {
  position: relative; padding-left: clamp(2.6rem, 6vw, 4.5rem);
  opacity: 0; transform: translateY(30px);
  transition: opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1), transform 0.9s cubic-bezier(0.16, 1, 0.3, 1);
}
.um-chapter.is-shown { opacity: 1; transform: none; }
.um-ch-index {
  font-family: var(--font-geist-mono), monospace;
  font-size: 0.85rem; color: var(--indigo); font-variant-numeric: tabular-nums;
}
.um-ch-title {
  margin: 0.5rem 0 1rem; font-weight: 600;
  font-size: clamp(2rem, 6vw, 4.2rem); letter-spacing: -0.03em; line-height: 0.98;
}
.um-ch-copy {
  margin: 0; max-width: 40rem; font-family: var(--font-inter), system-ui, sans-serif;
  font-size: clamp(1.05rem, 1.7vw, 1.4rem); color: var(--pale); opacity: 0.86;
  text-shadow: 0 2px 26px rgba(7, 7, 9, 0.75);
}

/* OBJECTS GRID */
.um-objects {
  position: relative; z-index: 1;
  padding: clamp(5rem, 12vh, 9rem) clamp(1.25rem, 6vw, 6rem);
  background: linear-gradient(to bottom, transparent, rgba(7, 7, 9, 0.72) 22%, rgba(7, 7, 9, 0.72) 78%, transparent);
}
.um-obj-head {
  max-width: 40rem; margin: 0 auto clamp(2.5rem, 5vw, 4rem); text-align: center;
  opacity: 0; transform: translateY(22px); transition: opacity 0.8s ease, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}
.um-obj-head.is-shown { opacity: 1; transform: none; }
.um-obj-sub { margin: 0.8rem 0 0; color: var(--mute); font-family: var(--font-inter), system-ui, sans-serif; }
.um-grid {
  position: relative; max-width: 68rem; margin: 0 auto;
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem;
}
.um-tile {
  position: relative; aspect-ratio: 4 / 3; border-radius: 14px; overflow: hidden;
  border: 1px solid var(--line);
  transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), filter 0.5s, opacity 0.5s, border-color 0.5s;
}
.um-tile-art { position: absolute; inset: 0; }
.um-tile-name {
  position: absolute; left: 1rem; bottom: 0.85rem; z-index: 2;
  font-weight: 550; font-size: 1.15rem; letter-spacing: -0.01em;
  opacity: 0; transform: translateY(6px); transition: opacity 0.4s, transform 0.4s;
}
.um-grid:hover .um-tile { opacity: 0.4; filter: saturate(0.6); }
.um-tile:hover {
  opacity: 1 !important; filter: none !important;
  transform: scale(1.06) rotate(-0.6deg); border-color: rgba(108, 92, 255, 0.6); z-index: 3;
}
.um-tile:hover .um-tile-name { opacity: 1; transform: none; }
.um-mag {
  position: absolute; top: 0; left: 0; z-index: 5; pointer-events: none;
  display: flex; flex-direction: column; align-items: center; gap: 0.15rem;
  padding: 0.55rem 1rem; border-radius: 999px;
  background: var(--indigo); color: #fff; white-space: nowrap;
  opacity: 0; transition: opacity 0.3s ease;
  will-change: transform;
}
.um-mag.is-on { opacity: 1; }
.um-mag-title { font-weight: 600; font-size: 0.95rem; }
.um-mag-kind { font-family: var(--font-geist-mono), monospace; font-size: 0.7rem; opacity: 0.85; }

/* WORK CARDS */
.um-work {
  position: relative; z-index: 1;
  padding: clamp(5rem, 12vh, 9rem) clamp(1.25rem, 6vw, 6rem);
}
.um-work-head {
  max-width: 40rem; margin-bottom: clamp(2.5rem, 5vw, 4rem);
  opacity: 0; transform: translateY(22px); transition: opacity 0.8s ease, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}
.um-work-head.is-shown { opacity: 1; transform: none; }
.um-work-sub { margin: 0.8rem 0 0; color: var(--mute); font-family: var(--font-inter), system-ui, sans-serif; }
.um-cards {
  max-width: 72rem; margin: 0 auto;
  display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.2rem;
}
.um-card {
  position: relative; text-align: left; overflow: hidden;
  background: var(--void-2); border: 1px solid var(--line); border-radius: 16px;
  padding: 0; color: inherit; font: inherit;
  transition: border-color 0.4s, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}
.um-card:hover { border-color: rgba(108, 92, 255, 0.5); transform: translateY(-5px); }
.um-card-art { height: 190px; }
.um-card-body { padding: 1.4rem 1.5rem 1.6rem; }
.um-card-top { display: flex; align-items: baseline; justify-content: space-between; gap: 1rem; }
.um-card-title { margin: 0; font-weight: 600; font-size: 1.7rem; letter-spacing: -0.02em; }
.um-card-year { font-family: var(--font-geist-mono), monospace; color: var(--mute); font-size: 0.85rem; }
.um-card-client { margin: 0.4rem 0 0.15rem; color: var(--pale); font-size: 1rem; }
.um-card-kind {
  margin: 0; color: var(--mute); font-family: var(--font-inter), system-ui, sans-serif; font-size: 0.9rem;
}
.um-card-open {
  position: absolute; top: 1.2rem; right: 1.3rem;
  font-family: var(--font-geist-mono), monospace; font-size: 0.78rem; color: var(--indigo);
  opacity: 0; transform: translateY(-4px); transition: opacity 0.35s, transform 0.35s;
}
.um-card:hover .um-card-open { opacity: 1; transform: none; }

/* generative art blocks (no imagery) */
.um-tile-art, .um-card-art, .um-panel-art { position: relative; overflow: hidden; }
.umbra-root [data-v="0"] { background:
  radial-gradient(120% 120% at 15% 10%, rgba(108, 92, 255, 0.55), transparent 55%),
  radial-gradient(90% 90% at 85% 90%, rgba(70, 60, 180, 0.5), transparent 60%),
  #0b0b12; }
.umbra-root [data-v="1"] { background:
  conic-gradient(from 210deg at 70% 30%, rgba(108, 92, 255, 0.5), rgba(11, 11, 18, 0) 45%, rgba(140, 120, 255, 0.35) 80%),
  #0a0a10; }
.umbra-root [data-v="2"] { background:
  radial-gradient(70% 140% at 50% 120%, rgba(108, 92, 255, 0.6), transparent 60%),
  linear-gradient(120deg, #0c0c14, #090910),
  #090910; }
.umbra-root [data-v="3"] { background:
  repeating-linear-gradient(115deg, rgba(108, 92, 255, 0.16) 0 2px, transparent 2px 16px),
  radial-gradient(100% 100% at 20% 100%, rgba(108, 92, 255, 0.5), transparent 55%),
  #0a0a11; }
.um-tile-art::after, .um-card-art::after {
  content: ""; position: absolute; inset: 0;
  background: radial-gradient(60% 60% at 50% 40%, transparent, rgba(7, 7, 9, 0.5));
}

/* CAPABILITIES */
.um-caps {
  position: relative; z-index: 1;
  padding: clamp(5rem, 12vh, 9rem) clamp(1.25rem, 6vw, 6rem);
  background: linear-gradient(to bottom, transparent, rgba(7, 7, 9, 0.78) 30%);
}
.um-caps-inner { max-width: 64rem; margin: 0 auto; }
.um-caps-list { list-style: none; margin: 1.4rem 0 0; padding: 0; }
.um-cap {
  position: relative; border-top: 1px solid var(--line); overflow: hidden;
  opacity: 0; transform: translateY(18px);
}
.um-cap:last-child { border-bottom: 1px solid var(--line); }
.um-caps-inner.is-shown .um-cap {
  opacity: 1; transform: none;
  transition: opacity 0.7s ease var(--d), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) var(--d);
}
.um-cap-text {
  display: block; padding: clamp(0.9rem, 2vw, 1.4rem) 0;
  font-weight: 550; font-size: clamp(1.6rem, 4.5vw, 3rem); letter-spacing: -0.025em;
  color: var(--pale); transition: color 0.4s, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), padding-left 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}
.um-cap:hover .um-cap-text { color: var(--indigo); padding-left: 1.4rem; }
.um-cap::before {
  content: ""; position: absolute; left: 0; top: 0; bottom: 0; width: 3px;
  background: var(--indigo); transform: scaleY(0); transform-origin: bottom; transition: transform 0.45s cubic-bezier(0.16, 1, 0.3, 1);
}
.um-cap:hover::before { transform: scaleY(1); transform-origin: top; }

/* CTA */
.um-cta {
  position: relative; z-index: 1;
  min-height: 88vh; display: grid; place-items: center; text-align: center;
  padding: clamp(5rem, 12vh, 9rem) clamp(1.25rem, 6vw, 4rem);
}
.um-cta-inner { max-width: 44rem; }
.um-cta-title {
  margin: 0; font-weight: 620; font-size: clamp(2.3rem, 7vw, 5rem); line-height: 0.98; letter-spacing: -0.035em;
  text-shadow: 0 2px 40px rgba(7, 7, 9, 0.8);
}
.um-cta-lede {
  margin: 1.6rem auto 2.4rem; max-width: 34rem; color: var(--pale); opacity: 0.86;
  font-family: var(--font-inter), system-ui, sans-serif; font-size: 1.1rem;
  text-shadow: 0 2px 30px rgba(7, 7, 9, 0.8);
}
.um-cta-btn {
  display: inline-block; background: var(--indigo); color: #fff; font-weight: 600;
  padding: 1.05rem 2.3rem; border-radius: 999px; font-size: 1.05rem;
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s;
}
.um-cta-btn:hover { transform: translateY(-3px); box-shadow: 0 22px 50px -16px rgba(108, 92, 255, 0.8); }
.um-cta-contact {
  display: flex; gap: 1.6rem; justify-content: center; flex-wrap: wrap; margin-top: 1.8rem;
  font-family: var(--font-geist-mono), monospace; font-size: 0.85rem; color: var(--mute);
}
.um-cta-contact a { color: var(--mute); transition: color 0.3s; }
.um-cta-contact a:hover { color: var(--indigo); }

/* FOOTER */
.um-footer {
  position: relative; z-index: 1; background: var(--void);
  border-top: 1px solid var(--line);
  padding: clamp(3rem, 6vw, 4.5rem) clamp(1.25rem, 6vw, 6rem);
}
.um-footer .um-mark { display: inline-block; margin-bottom: 0.8rem; }
.um-foot-copy { margin: 0 0 1.4rem; color: var(--mute); max-width: 32rem; font-family: var(--font-inter), system-ui, sans-serif; }
.um-foot-links { display: flex; gap: 1.6rem; flex-wrap: wrap; }
.um-foot-links a { color: var(--pale); font-size: 0.95rem; transition: color 0.3s; }
.um-foot-links a:hover { color: var(--indigo); }
.um-foot-fine { margin: 1.4rem 0 0; color: var(--mute); opacity: 0.6; font-size: 0.85rem; }

/* FLOATING CTA */
.um-float {
  position: fixed; z-index: 70; right: clamp(1rem, 4vw, 2.4rem); bottom: clamp(1rem, 4vw, 2.4rem);
  background: var(--indigo); color: #fff; font-weight: 550; font-size: 0.95rem;
  padding: 0.85rem 1.5rem; border-radius: 999px;
  box-shadow: 0 16px 40px -12px rgba(108, 92, 255, 0.75);
  opacity: 0; transform: translateY(20px) scale(0.95); pointer-events: none;
  transition: opacity 0.5s ease, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}
.um-float.is-on { opacity: 1; transform: none; pointer-events: auto; }

/* FLIP PANEL */
.um-overlay { position: fixed; inset: 0; z-index: 8000; }
.um-scrim {
  position: absolute; inset: 0; border: 0; padding: 0;
  background: rgba(5, 5, 8, 0); transition: background 0.5s ease;
}
.um-overlay.is-open .um-scrim { background: rgba(5, 5, 8, 0.82); }
.um-panel {
  position: absolute; top: 50%; left: 50%;
  width: min(760px, 92vw); max-height: 88vh; overflow: auto;
  transform: translate(-50%, -50%); margin: 0;
  background: var(--void-2); border: 1px solid var(--line); border-radius: 18px;
  will-change: transform;
}
.um-panel-art { height: clamp(160px, 30vh, 260px); }
.um-panel-body {
  padding: clamp(1.6rem, 4vw, 2.6rem);
  opacity: 0; transform: translateY(14px); transition: opacity 0.4s ease 0.15s, transform 0.5s ease 0.15s;
}
.um-panel-body.is-in { opacity: 1; transform: none; }
.um-panel-close {
  float: right; background: transparent; border: 1px solid var(--line); color: var(--pale);
  border-radius: 999px; padding: 0.4rem 1rem; font: inherit; font-size: 0.85rem;
  transition: border-color 0.3s, color 0.3s;
}
.um-panel-close:hover { border-color: var(--indigo); color: var(--indigo); }
.um-panel-kind { font-family: var(--font-geist-mono), monospace; font-size: 0.82rem; color: var(--indigo); }
.um-panel-title { margin: 0.5rem 0 0.3rem; font-weight: 620; font-size: clamp(2rem, 5vw, 3.2rem); letter-spacing: -0.03em; }
.um-panel-client { margin: 0 0 1.4rem; color: var(--pale); display: flex; align-items: baseline; gap: 0.8rem; }
.um-panel-year { font-family: var(--font-geist-mono), monospace; color: var(--mute); font-size: 0.85rem; }
.um-panel-copy {
  margin: 0 0 1.6rem; color: var(--pale); opacity: 0.86; font-size: 1.08rem;
  font-family: var(--font-inter), system-ui, sans-serif;
}
.um-panel-results { list-style: none; margin: 0; padding: 0; display: grid; gap: 0.6rem; }
.um-panel-results li {
  padding-left: 1.3rem; position: relative; color: var(--pale); font-size: 0.98rem;
  font-family: var(--font-inter), system-ui, sans-serif;
}
.um-panel-results li::before {
  content: ""; position: absolute; left: 0; top: 0.6em; width: 7px; height: 7px; border-radius: 50%;
  background: var(--indigo); box-shadow: 0 0 8px var(--indigo);
}

/* RESPONSIVE */
@media (max-width: 860px) {
  .um-cards { grid-template-columns: 1fr; }
  .um-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 640px) {
  .um-nav-links { gap: 0.9rem; }
  .um-nav-a { display: none; }
  .um-hud { display: none; }
  .um-grid { grid-template-columns: 1fr; }
}

/* REDUCED MOTION — one calm static field, no preloader, no cursor, no reveal delays */
@media (prefers-reduced-motion: reduce) {
  .umbra-root.has-cursor,
  .umbra-root.has-cursor a,
  .umbra-root.has-cursor button { cursor: auto; }
  .um-cursor { display: none !important; }
  .um-hud-dot { animation: none; }
  .um-scrollcue span { animation: none; opacity: 0.4; }
  .um-scrub-line { animation: none; transform: scaleY(1); }
  .um-hero-inner, .um-nav, .um-chapter, .um-obj-head, .um-work-head, .um-cap { opacity: 1 !important; transform: none !important; transition: none !important; }
  .um-caps-inner.is-shown .um-cap { transition: none; }
}
`

const css = cssBase + cssMore
