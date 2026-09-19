"use client"

import { useEffect, useRef, useState } from "react"

/**
 * Sprig — a conversion storefront for a sparkling adaptogen + prebiotic soda.
 *
 * The archetype is the modular Shopify homepage: rotating promo bar, campaign
 * hero, flavour switcher, collection tiles, bestseller carousel, a slide-in cart
 * with a free-shipping meter, subscribe-and-save, social proof, and capture.
 *
 * Anti-slop notes: the base is a warm off-white with a COOL neutral ink (never a
 * brown-tinted black), and the "one bold move" is colour itself — six candy
 * accents keyed to flavours, with the flavour section recolouring live as you
 * switch tabs. No tracked-caps eyebrows, no middle-dot metas, no em-dash label
 * fragments, no arrow-suffixed links, no glassmorphism. Geist throughout, big and
 * rounded and friendly. Every transition and animation is gated globally on
 * prefers-reduced-motion via the data-reduced attribute on the root.
 */

type Flavor = {
  id: string
  name: string
  taste: string
  benefit: string
  note: string
  img: string
  accent: string
  accentInk: string
  tint: string
}

const FLAVORS: Flavor[] = [
  {
    id: "lemon",
    name: "Lemon Zip",
    taste: "Meyer lemon with a whisper of yuzu.",
    benefit: "Tart, bright, and wide awake.",
    note: "with L-theanine",
    img: "/sprig/can1.png",
    accent: "#F2B705",
    accentInk: "#3a2c00",
    tint: "#FEF6D9",
  },
  {
    id: "raspberry",
    name: "Raspberry Rose",
    taste: "Sun-warm raspberries, a soft floral finish.",
    benefit: "The one people get shy about loving.",
    note: "with ashwagandha",
    img: "/sprig/can2.png",
    accent: "#E5346D",
    accentInk: "#ffffff",
    tint: "#FCE1EC",
  },
  {
    id: "cucumber",
    name: "Cucumber Lime",
    taste: "Cold-pressed cucumber, fresh-squeezed lime.",
    benefit: "Tastes like the last day of a good holiday.",
    note: "with electrolytes",
    img: "/sprig/can3.png",
    accent: "#3DA35D",
    accentInk: "#ffffff",
    tint: "#E4F3E7",
  },
  {
    id: "cola",
    name: "Vintage Cola",
    taste: "The cola you grew up on, quietly reformulated.",
    benefit: "For people who said they'd never switch.",
    note: "with prebiotic fibre",
    img: "/sprig/can4.png",
    accent: "#B5651D",
    accentInk: "#ffffff",
    tint: "#F3E7D6",
  },
  {
    id: "peach",
    name: "Peach Ginger",
    taste: "Orchard peach with a clean ginger kick.",
    benefit: "Warm and cold at the same time, somehow.",
    note: "with fresh ginger",
    img: "/sprig/can5.png",
    accent: "#FF7A4D",
    accentInk: "#3a1600",
    tint: "#FFE7DC",
  },
  {
    id: "grape",
    name: "Concord Grape",
    taste: "Purple grape straight off the vine.",
    benefit: "It tastes, unapologetically, like recess.",
    note: "with magnesium",
    img: "/sprig/can6.png",
    accent: "#8E44AD",
    accentInk: "#ffffff",
    tint: "#F0E3F7",
  },
]

const PROMOS = [
  "Free shipping once you pass $45. You're closer than you think.",
  "New drop: Concord Grape is in the fridge and going fast.",
  "Subscribe and take 20% off every order. Cancel whenever, no hard feelings.",
  "Hate your first sip? We refund it and you keep the cans.",
]

type Product = {
  id: string
  name: string
  taste: string
  price: number
  rating: number
  reviews: number
  img: string
  accent: string
}

const PRODUCTS: Product[] = FLAVORS.map((f, i) => ({
  id: f.id,
  name: `${f.name} 12-pack`,
  taste: f.taste,
  price: [28, 28, 26, 28, 28, 26][i],
  rating: [4.9, 4.8, 4.7, 4.9, 4.8, 5.0][i],
  reviews: [8421, 6690, 4123, 9002, 5510, 2740][i],
  img: f.img,
  accent: f.accent,
}))

const COLLECTIONS = [
  { title: "Best sellers", blurb: "The four cans that keep selling out.", img: "/sprig/can2.png", accent: "#E5346D" },
  { title: "Variety packs", blurb: "Can't choose? Good, don't.", img: "/sprig/hero.png", accent: "#F2B705" },
  { title: "Caffeine-free", blurb: "All the ritual, none of the buzz.", img: "/sprig/can3.png", accent: "#3DA35D" },
  { title: "Subscribe & save", blurb: "20% off, delivered on your schedule.", img: "/sprig/can6.png", accent: "#8E44AD" },
]

const BUNDLES = [
  { size: 8, price: 22, label: "Starter fridge" },
  { size: 16, price: 40, label: "Household favourite" },
  { size: 24, price: 54, label: "Full restock" },
]

const PRESS = ["Bon Appétit", "The Strategist", "Well+Good", "Food & Wine", "Eater", "Cool Hunting"]

const REVIEWS = [
  { name: "Dana R.", flavor: "Peach Ginger", stars: 5, text: "I bought one 12-pack to try it and immediately hid them from my roommates. Three orders deep now." },
  { name: "Marcus T.", flavor: "Vintage Cola", stars: 5, text: "I was the guy who said no soda would ever beat the real thing. I was wrong and I'm at peace with it." },
  { name: "Priya S.", flavor: "Cucumber Lime", stars: 5, text: "My 2pm slump used to run my whole afternoon. This quietly fixed it and I didn't even notice for a week." },
  { name: "Jules K.", flavor: "Raspberry Rose", stars: 4, text: "Genuinely delicious. Docking one star only because I now have a subscription I cannot cancel emotionally." },
]

const FREE_SHIP = 45

const money = (n: number) => `$${n.toFixed(2)}`

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
      { threshold: 0.18 },
    )
    io.observe(node)
    return () => io.disconnect()
  }, [])
  return [ref, shown] as const
}

type CartLine = { id: string; name: string; price: number; qty: number; accent: string }

export default function Sprig() {
  const [reduced, setReduced] = useState(false)
  const [promo, setPromo] = useState(0)
  const [active, setActive] = useState(0)
  const [cart, setCart] = useState<CartLine[]>([])
  const [cartOpen, setCartOpen] = useState(false)
  const [pulse, setPulse] = useState<string | null>(null)
  const [scrollY, setScrollY] = useState(0)
  const [bundle, setBundle] = useState(1)
  const [weekly, setWeekly] = useState(false)
  const [videoReady, setVideoReady] = useState(false)
  const [bump, setBump] = useState(false)
  const cartBtnRef = useRef<HTMLButtonElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Reduced-motion + hero parallax scroll tracking.
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

  // Rotate the promo bar — never auto-advances under reduced motion.
  useEffect(() => {
    if (reduced) return
    const t = setInterval(() => setPromo((p) => (p + 1) % PROMOS.length), 4200)
    return () => clearInterval(t)
  }, [reduced])

  // The hero video often loads before React attaches onCanPlay (cache/fast
  // net), so the event is missed and the layer stays at opacity 0. Check
  // readyState on mount, and kick off muted playback imperatively — muted
  // play() is always allowed by autoplay policy, so this covers browsers that
  // don't honour the autoplay attribute here.
  useEffect(() => {
    const v = videoRef.current
    if (!v || reduced) return
    if (v.readyState >= 3) setVideoReady(true)
    const p = v.play()
    if (p && typeof p.catch === "function") p.catch(() => {})
  }, [reduced])

  const flavor = FLAVORS[active]
  const count = cart.reduce((n, l) => n + l.qty, 0)
  const total = cart.reduce((s, l) => s + l.price * l.qty, 0)
  const remaining = Math.max(0, FREE_SHIP - total)
  const shipPct = Math.min(100, (total / FREE_SHIP) * 100)

  // Imperative fly-to-cart: a coloured disc arcs from the click point to the
  // cart button, then the button bumps. WAAPI so it survives re-renders; the
  // disc lives on document.body (outside the reduced-motion root) so we gate it
  // here by hand rather than relying on the CSS kill-switch.
  const flyToCart = (origin: { x: number; y: number }, accent: string) => {
    const btn = cartBtnRef.current
    if (!btn || typeof document === "undefined") return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const target = btn.getBoundingClientRect()
    const tx = target.left + target.width / 2
    const ty = target.top + target.height / 2
    const disc = document.createElement("span")
    disc.className = "sp-fly"
    disc.style.left = `${origin.x}px`
    disc.style.top = `${origin.y}px`
    disc.style.background = accent
    document.body.appendChild(disc)
    const dx = tx - origin.x
    const dy = ty - origin.y
    const anim = disc.animate(
      [
        { transform: "translate(-50%, -50%) scale(1)", opacity: 1, offset: 0 },
        { transform: `translate(calc(-50% + ${dx * 0.5}px), calc(-50% + ${dy * 0.5 - 90}px)) scale(0.9)`, opacity: 1, offset: 0.55 },
        { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(0.28)`, opacity: 0.7, offset: 1 },
      ],
      { duration: 720, easing: "cubic-bezier(0.5, 0, 0.5, 1)", fill: "forwards" },
    )
    anim.onfinish = () => {
      disc.remove()
      setBump(true)
      window.setTimeout(() => setBump(false), 420)
    }
  }

  const addToCart = (
    p: { id: string; name: string; price: number; accent: string },
    e?: { clientX: number; clientY: number },
    open = false,
  ) => {
    setCart((prev) => {
      const found = prev.find((l) => l.id === p.id)
      if (found) return prev.map((l) => (l.id === p.id ? { ...l, qty: l.qty + 1 } : l))
      return [...prev, { id: p.id, name: p.name, price: p.price, qty: 1, accent: p.accent }]
    })
    setPulse(p.id)
    window.setTimeout(() => setPulse((cur) => (cur === p.id ? null : cur)), 900)
    if (e) flyToCart({ x: e.clientX, y: e.clientY }, p.accent)
    if (open) setCartOpen(true)
  }

  const setQty = (id: string, delta: number) =>
    setCart((prev) =>
      prev
        .map((l) => (l.id === id ? { ...l, qty: l.qty + delta } : l))
        .filter((l) => l.qty > 0),
    )

  const par = (rate: number) => (reduced ? 0 : scrollY * rate)

  const [flavorRef, flavorShown] = useReveal<HTMLDivElement>()
  const [storyRef, storyShown] = useReveal<HTMLDivElement>()
  const [reviewsRef, reviewsShown] = useReveal<HTMLDivElement>()

  return (
    <div className="sprig-root" data-reduced={reduced}>
      <style>{css}</style>

      {/* PROMO BAR — rotating announcements */}
      <div className="sp-promo" role="region" aria-label="Announcements">
        <button
          className="sp-promo-arrow"
          aria-label="Previous announcement"
          onClick={() => setPromo((p) => (p - 1 + PROMOS.length) % PROMOS.length)}
        >
          ‹
        </button>
        <div className="sp-promo-viewport">
          {PROMOS.map((m, i) => (
            <p key={i} className={`sp-promo-msg ${i === promo ? "is-on" : ""}`} aria-hidden={i !== promo}>
              {m}
            </p>
          ))}
        </div>
        <button
          className="sp-promo-arrow"
          aria-label="Next announcement"
          onClick={() => setPromo((p) => (p + 1) % PROMOS.length)}
        >
          ›
        </button>
      </div>

      {/* NAV */}
      <header className="sp-nav">
        <a className="sp-logo" href="#top" aria-label="Sprig home">
          <span className="sp-logo-dot" aria-hidden="true" />
          Sprig
        </a>
        <nav className="sp-nav-links">
          <a href="#flavors">Flavours</a>
          <a href="#shop">Shop</a>
          <a href="#subscribe">Subscribe</a>
          <a href="#story">Our story</a>
        </nav>
        <button
          ref={cartBtnRef}
          className={`sp-cart-btn ${bump ? "is-bump" : ""}`}
          onClick={() => setCartOpen(true)}
          aria-label={`Open cart, ${count} items`}
        >
          Cart
          <span className={`sp-cart-count ${count ? "is-on" : ""}`}>{count}</span>
        </button>
      </header>

      {/* HERO */}
      <section className="sp-hero" id="top">
        <div className="sp-hero-img" style={{ transform: `translate3d(0, ${par(0.06)}px, 0)` }} />
        {!reduced && (
          <video
            ref={videoRef}
            className={`sp-hero-video ${videoReady ? "is-ready" : ""}`}
            src="/sprig/hero.mp4"
            poster="/sprig/hero.png"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            onCanPlay={() => setVideoReady(true)}
            onError={() => setVideoReady(false)}
          />
        )}
        <div className="sp-hero-veil" />
        <div className="sp-hero-inner">
          <p className="sp-hero-kicker">Sparkling adaptogen soda</p>
          <h1 className="sp-hero-title">
            Soda that
            <br />
            likes you back.
          </h1>
          <p className="sp-hero-lede">
            Prebiotics, adaptogens, real pressed fruit, and three grams of sugar. All the fizz you
            grew up on, without the 2pm crash you also grew up on.
          </p>
          <div className="sp-hero-cta">
            <a className="sp-btn sp-btn-lg" href="#shop">
              Shop the fridge
            </a>
            <a className="sp-btn sp-btn-ghost sp-btn-lg" href="#subscribe">
              Build a variety pack
            </a>
          </div>
          <div className="sp-hero-proof">
            <span className="sp-stars" aria-hidden="true">
              {"★★★★★"}
            </span>
            <span>
              <strong>50,000+</strong> five-star reviews and a 4.8 average
            </span>
          </div>
        </div>
      </section>

      {/* FLAVOUR TABS — switching recolours the section + crossfades the can */}
      <section
        className={`sp-flavors ${flavorShown ? "is-shown" : ""}`}
        id="flavors"
        ref={flavorRef}
        style={
          {
            "--flavor": flavor.accent,
            "--flavor-ink": flavor.accentInk,
            "--flavor-tint": flavor.tint,
          } as React.CSSProperties
        }
      >
        <div className="sp-flavors-head">
          <h2 className="sp-h2">Pick your fizz</h2>
          <p className="sp-sub">Six flavours, one very short attention span. Tap to meet each one.</p>
        </div>

        <div className="sp-tabs" role="tablist" aria-label="Flavours">
          {FLAVORS.map((f, i) => (
            <button
              key={f.id}
              role="tab"
              aria-selected={i === active}
              className={`sp-tab ${i === active ? "is-active" : ""}`}
              style={{ "--tab": f.accent } as React.CSSProperties}
              onClick={() => setActive(i)}
            >
              {f.name}
            </button>
          ))}
        </div>

        <div className="sp-flavor-stage">
          <div className="sp-flavor-cans">
            {FLAVORS.map((f, i) => (
              <div
                key={f.id}
                className={`sp-flavor-can ${i === active ? "is-on" : ""}`}
                style={{ backgroundImage: `url(${f.img})` }}
                aria-hidden={i !== active}
              />
            ))}
            <div className="sp-flavor-halo" aria-hidden="true" />
          </div>

          <div className="sp-flavor-detail">
            <span className="sp-flavor-note">{flavor.note}</span>
            <h3 className="sp-flavor-name">{flavor.name}</h3>
            <p className="sp-flavor-taste">{flavor.taste}</p>
            <p className="sp-flavor-benefit">{flavor.benefit}</p>
            <div className="sp-flavor-buy">
              <button
                className={`sp-flavor-add ${pulse === flavor.id ? "is-pulse" : ""}`}
                onClick={(e) => addToCart({ id: flavor.id, name: `${flavor.name} 12-pack`, price: 28, accent: flavor.accent }, e)}
              >
                <span className="sp-flavor-add-label">Add a 12-pack</span>
                <span className="sp-flavor-add-done" aria-hidden="true">Added</span>
              </button>
              <span className="sp-flavor-price">{money(28)}</span>
            </div>
          </div>
        </div>
      </section>

      {/* COLLECTION TILES */}
      <section className="sp-tiles">
        <div className="sp-tiles-head">
          <h2 className="sp-h2">Find your shelf</h2>
          <p className="sp-sub">However you shop, there's a door in for you.</p>
        </div>
        <div className="sp-tiles-grid">
          {COLLECTIONS.map((c) => (
            <a key={c.title} className="sp-tile" href="#shop" style={{ "--tile": c.accent } as React.CSSProperties}>
              <div className="sp-tile-img" style={{ backgroundImage: `url(${c.img})` }} />
              <div className="sp-tile-body">
                <h3 className="sp-tile-title">{c.title}</h3>
                <p className="sp-tile-blurb">{c.blurb}</p>
                <span className="sp-tile-link">Shop now</span>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* BESTSELLERS CAROUSEL */}
      <section className="sp-shop" id="shop">
        <div className="sp-shop-head">
          <div>
            <h2 className="sp-h2">The fridge favourites</h2>
            <p className="sp-sub">Rated by the people who reorder without thinking about it.</p>
          </div>
          <span className="sp-shop-hint" aria-hidden="true">Scroll for more</span>
        </div>
        <div className="sp-carousel">
          {PRODUCTS.map((p) => (
            <article className="sp-card" key={p.id} style={{ "--card": p.accent } as React.CSSProperties}>
              <div className="sp-card-media">
                <div className="sp-card-img" style={{ backgroundImage: `url(${p.img})` }} />
                <div className="sp-card-swatches" aria-hidden="true">
                  {FLAVORS.slice(0, 4).map((f) => (
                    <span key={f.id} style={{ background: f.accent }} />
                  ))}
                </div>
              </div>
              <div className="sp-card-body">
                <div className="sp-card-rating">
                  <span className="sp-stars" aria-hidden="true">{"★★★★★"}</span>
                  <span className="sp-card-rating-num">
                    {p.rating.toFixed(1)} <span>({p.reviews.toLocaleString()})</span>
                  </span>
                </div>
                <h3 className="sp-card-name">{p.name}</h3>
                <p className="sp-card-taste">{p.taste}</p>
                <div className="sp-card-buy">
                  <span className="sp-card-price">{money(p.price)}</span>
                  <button
                    className={`sp-quick ${pulse === p.id ? "is-pulse" : ""}`}
                    onClick={(e) => addToCart(p, e)}
                    aria-label={`Quick add ${p.name}`}
                  >
                    <span className="sp-quick-plus" aria-hidden="true">+</span>
                    <span className="sp-quick-check" aria-hidden="true">✓</span>
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* SUBSCRIBE & SAVE / BUILD YOUR BUNDLE */}
      <section className="sp-sub-block" id="subscribe">
        <div className="sp-sub-grid">
          <div className="sp-sub-copy">
            <h2 className="sp-h2">Build a bundle, save 20%</h2>
            <p className="sp-sub">
              Mix any flavours you like, pick how often, and let it show up on its own. Skip, swap,
              or cancel any time — the whole thing lives in one tap.
            </p>
            <ul className="sp-sub-perks">
              <li>20% off every single order, for as long as you stay</li>
              <li>Free shipping on subscriptions, no minimum</li>
              <li>First dibs on new flavours before they hit the shop</li>
            </ul>
          </div>

          <div className="sp-builder">
            <p className="sp-builder-step">How many cans?</p>
            <div className="sp-builder-sizes">
              {BUNDLES.map((b, i) => (
                <button
                  key={b.size}
                  className={`sp-size ${i === bundle ? "is-active" : ""}`}
                  onClick={() => setBundle(i)}
                >
                  <span className="sp-size-n">{b.size}</span>
                  <span className="sp-size-label">{b.label}</span>
                </button>
              ))}
            </div>

            <p className="sp-builder-step">How often?</p>
            <div className="sp-freq">
              <button className={`sp-freq-opt ${!weekly ? "is-active" : ""}`} onClick={() => setWeekly(false)}>
                Every month
              </button>
              <button className={`sp-freq-opt ${weekly ? "is-active" : ""}`} onClick={() => setWeekly(true)}>
                Every 2 weeks
              </button>
            </div>

            {(() => {
              const b = BUNDLES[bundle]
              const sub = b.price * 0.8
              return (
                <div className="sp-builder-total">
                  <div>
                    <span className="sp-builder-was">{money(b.price)}</span>
                    <span className="sp-builder-now">{money(sub)}</span>
                    <span className="sp-builder-cadence">{weekly ? "every 2 weeks" : "per month"}</span>
                  </div>
                  <button
                    className="sp-btn sp-btn-lg"
                    onClick={(e) =>
                      addToCart(
                        { id: `sub-${b.size}`, name: `${b.size}-can subscription`, price: Math.round(sub * 100) / 100, accent: "#3DA35D" },
                        e,
                        true,
                      )
                    }
                  >
                    Start subscription
                  </button>
                </div>
              )
            })()}
          </div>
        </div>
      </section>

      {/* FOUNDER STORY + PRESS */}
      <section className="sp-story" id="story" ref={storyRef}>
        <div className={`sp-story-grid ${storyShown ? "is-shown" : ""}`}>
          <div className="sp-story-media">
            <div className="sp-story-img" style={{ backgroundImage: `url(/sprig/can5.png)` }} />
          </div>
          <div className="sp-story-copy">
            <h2 className="sp-h2">We just wanted a soda that wasn't a compromise</h2>
            <p>
              Sprig started in a rented kitchen in 2021, after our founder quit a nine-can-a-day
              habit and hated every "healthy" replacement she tried. They all tasted like an
              apology.
            </p>
            <p>
              So we spent two years getting the fizz, the sugar, and the fruit exactly right, then
              added prebiotics and adaptogens because a drink you have every day may as well do
              something. No apology. Just a really good soda.
            </p>
            <a className="sp-btn sp-btn-ghost" href="#top">Read the whole story</a>
          </div>
        </div>
        <div className="sp-press">
          <span className="sp-press-label">As seen in</span>
          <div className="sp-press-marquee">
            <div className="sp-press-row">
              {[...PRESS, ...PRESS].map((p, i) => (
                <span key={i} className="sp-press-name">{p}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* REVIEWS + UGC */}
      <section className="sp-reviews" ref={reviewsRef}>
        <div className="sp-reviews-head">
          <h2 className="sp-h2">50,000+ people, one very full fridge</h2>
          <p className="sp-sub">A 4.8 average across every flavour. Here's a few, unedited.</p>
        </div>
        <div className={`sp-reviews-grid ${reviewsShown ? "is-shown" : ""}`}>
          {REVIEWS.map((r, i) => (
            <figure className="sp-review" key={r.name} style={{ transitionDelay: `${i * 90}ms` }}>
              <span className="sp-stars" aria-hidden="true">{"★★★★★".slice(0, r.stars) + "☆☆☆☆☆".slice(0, 5 - r.stars)}</span>
              <blockquote>{r.text}</blockquote>
              <figcaption>
                <strong>{r.name}</strong>
                <span>on {r.flavor}</span>
              </figcaption>
            </figure>
          ))}
        </div>
        <div className="sp-ugc">
          {["/sprig/can1.png", "/sprig/hero.png", "/sprig/can3.png", "/sprig/can6.png", "/sprig/can2.png"].map((src, i) => (
            <div key={i} className="sp-ugc-tile" style={{ backgroundImage: `url(${src})` }} />
          ))}
        </div>
      </section>

      {/* NEWSLETTER CAPTURE */}
      <section className="sp-capture">
        <div className="sp-capture-inner">
          <h2 className="sp-capture-title">Take 20% off your first order</h2>
          <p className="sp-capture-sub">
            Drop your email and we'll send a code, plus a heads-up whenever a new flavour lands.
          </p>
          <form className="sp-capture-form" onSubmit={(e) => e.preventDefault()}>
            <input
              className="sp-capture-input"
              type="email"
              required
              placeholder="you@email.com"
              aria-label="Email address"
            />
            <button className="sp-btn sp-btn-lg" type="submit">Send my code</button>
          </form>
          <p className="sp-capture-fine">No spam, no more than one email a week. Unsubscribe in a tap.</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="sp-footer">
        <div className="sp-footer-grid">
          <div className="sp-footer-brand">
            <a className="sp-logo" href="#top">
              <span className="sp-logo-dot" aria-hidden="true" />
              Sprig
            </a>
            <p>Sparkling adaptogen soda, brewed in small batches and shipped cold to your door.</p>
          </div>
          <div className="sp-footer-col">
            <h3>Shop</h3>
            <a href="#shop">All flavours</a>
            <a href="#subscribe">Variety packs</a>
            <a href="#subscribe">Subscribe & save</a>
            <a href="#shop">Gift cards</a>
          </div>
          <div className="sp-footer-col">
            <h3>Company</h3>
            <a href="#story">Our story</a>
            <a href="#story">Ingredients</a>
            <a href="#top">Careers</a>
            <a href="#top">Wholesale</a>
          </div>
          <div className="sp-footer-col">
            <h3>Help</h3>
            <a href="#top">Track an order</a>
            <a href="#subscribe">Manage subscription</a>
            <a href="#top">Returns</a>
            <a href="#top">Contact us</a>
          </div>
        </div>
        <div className="sp-footer-base">
          <span>© 2026 Sprig Beverages</span>
          <div className="sp-footer-legal">
            <a href="#top">Privacy</a>
            <a href="#top">Terms</a>
            <a href="#top">Accessibility</a>
          </div>
        </div>
      </footer>

      {/* SECTIONS-END */}

      {/* CART DRAWER */}
      <div className={`sp-cart-scrim ${cartOpen ? "is-open" : ""}`} onClick={() => setCartOpen(false)} aria-hidden={!cartOpen} />
      <aside className={`sp-drawer ${cartOpen ? "is-open" : ""}`} aria-label="Your cart" aria-hidden={!cartOpen}>
        <div className="sp-drawer-top">
          <h2 className="sp-drawer-title">Your cart{count ? ` (${count})` : ""}</h2>
          <button className="sp-drawer-close" onClick={() => setCartOpen(false)} aria-label="Close cart">×</button>
        </div>

        <div className="sp-ship">
          <p className="sp-ship-msg">
            {remaining > 0 ? (
              <>You're <strong>{money(remaining)}</strong> away from free shipping.</>
            ) : (
              <>Nice — you've unlocked <strong>free shipping</strong>.</>
            )}
          </p>
          <div className="sp-ship-track">
            <div className={`sp-ship-fill ${remaining === 0 ? "is-full" : ""}`} style={{ width: `${shipPct}%` }} />
          </div>
        </div>

        <div className="sp-drawer-lines">
          {cart.length === 0 ? (
            <div className="sp-cart-empty">
              <p>Your cart's feeling a little flat.</p>
              <button className="sp-btn" onClick={() => setCartOpen(false)}>Start shopping</button>
            </div>
          ) : (
            cart.map((l) => (
              <div className="sp-line" key={l.id}>
                <span className="sp-line-swatch" style={{ background: l.accent }} aria-hidden="true" />
                <div className="sp-line-info">
                  <p className="sp-line-name">{l.name}</p>
                  <p className="sp-line-price">{money(l.price)}</p>
                </div>
                <div className="sp-stepper">
                  <button onClick={() => setQty(l.id, -1)} aria-label={`Decrease ${l.name}`}>−</button>
                  <span>{l.qty}</span>
                  <button onClick={() => setQty(l.id, 1)} aria-label={`Increase ${l.name}`}>+</button>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="sp-drawer-foot">
            <div className="sp-drawer-subtotal">
              <span>Subtotal</span>
              <strong>{money(total)}</strong>
            </div>
            <button className="sp-btn sp-btn-lg sp-drawer-checkout">Checkout</button>
            <p className="sp-drawer-fine">Taxes calculated at checkout. 30-day taste guarantee.</p>
          </div>
        )}
      </aside>
    </div>
  )
}

const css = `
.sprig-root {
  --cream: #fffdf6;
  --paper: #ffffff;
  --ink: #191a1f;
  --ink-soft: #5a5c66;
  --line: rgba(20, 20, 30, 0.10);
  --line-2: rgba(20, 20, 30, 0.16);
  --brand: #E5346D;
  --shadow: 0 24px 60px -30px rgba(20, 18, 30, 0.4);
  background: var(--cream);
  color: var(--ink);
  font-family: var(--font-geist), system-ui, -apple-system, sans-serif;
  -webkit-font-smoothing: antialiased;
  line-height: 1.55;
  overflow-x: hidden;
}
.sprig-root *,
.sprig-root *::before,
.sprig-root *::after { box-sizing: border-box; }

/* Global reduced-motion gate: kill every transition + animation. */
.sprig-root[data-reduced="true"] * {
  transition: none !important;
  animation: none !important;
  scroll-behavior: auto !important;
}

.sprig-root a { color: inherit; }

/* Shared button */
.sp-btn {
  display: inline-flex; align-items: center; justify-content: center;
  font-family: inherit; font-weight: 650; font-size: 1rem;
  text-decoration: none; cursor: pointer; border: none;
  background: var(--ink); color: var(--cream);
  padding: 0.8rem 1.5rem; border-radius: 999px;
  transition: transform 0.35s cubic-bezier(0.16,1,0.3,1), box-shadow 0.35s, background 0.3s, color 0.3s;
}
.sp-btn:hover { transform: translateY(-2px); box-shadow: 0 16px 30px -14px rgba(20,18,30,0.5); }
.sp-btn-lg { padding: 1rem 1.9rem; font-size: 1.06rem; }
.sp-btn-ghost { background: transparent; color: var(--ink); box-shadow: inset 0 0 0 1.5px var(--line-2); }
.sp-btn-ghost:hover { box-shadow: inset 0 0 0 1.5px var(--ink); }

/* PROMO BAR */
.sp-promo {
  position: relative; z-index: 60;
  display: flex; align-items: center; gap: 0.5rem;
  background: var(--ink); color: var(--cream);
  padding: 0.55rem clamp(0.75rem, 3vw, 1.5rem);
  min-height: 2.6rem;
}
.sp-promo-viewport { position: relative; flex: 1; height: 1.5rem; overflow: hidden; }
.sp-promo-msg {
  position: absolute; inset: 0; margin: 0; text-align: center;
  font-size: 0.9rem; font-weight: 500; letter-spacing: -0.005em;
  opacity: 0; transform: translateY(60%);
  transition: opacity 0.5s ease, transform 0.5s cubic-bezier(0.16,1,0.3,1);
  white-space: nowrap; text-overflow: ellipsis; overflow: hidden;
}
.sp-promo-msg.is-on { opacity: 1; transform: translateY(0); }
.sp-promo-arrow {
  flex: none; width: 1.7rem; height: 1.7rem; border-radius: 999px;
  border: none; background: rgba(255,255,255,0.1); color: var(--cream);
  font-size: 1.15rem; line-height: 1; cursor: pointer; transition: background 0.25s;
}
.sp-promo-arrow:hover { background: rgba(255,255,255,0.22); }

/* NAV */
.sp-nav {
  position: sticky; top: 0; z-index: 55;
  display: flex; align-items: center; justify-content: space-between;
  gap: 1rem; padding: 0.9rem clamp(1rem, 4vw, 2.75rem);
  background: rgba(255,253,246,0.92);
  border-bottom: 1px solid var(--line);
}
.sp-logo {
  display: inline-flex; align-items: center; gap: 0.5rem;
  font-size: 1.45rem; font-weight: 750; letter-spacing: -0.03em;
  text-decoration: none; color: var(--ink);
}
.sp-logo-dot {
  width: 0.85rem; height: 0.85rem; border-radius: 999px;
  background: var(--brand);
  box-shadow: 0 0 0 4px rgba(229,52,109,0.16);
}
.sp-nav-links { display: flex; align-items: center; gap: clamp(1rem, 2.4vw, 2rem); }
.sp-nav-links a { text-decoration: none; font-weight: 550; font-size: 0.98rem; color: var(--ink-soft); transition: color 0.25s; }
.sp-nav-links a:hover { color: var(--ink); }
.sp-cart-btn {
  display: inline-flex; align-items: center; gap: 0.5rem;
  font-family: inherit; font-weight: 650; font-size: 0.98rem; cursor: pointer;
  background: var(--ink); color: var(--cream);
  border: none; border-radius: 999px; padding: 0.6rem 1.15rem;
  transition: transform 0.3s cubic-bezier(0.16,1,0.3,1);
}
.sp-cart-btn:hover { transform: translateY(-2px); }
.sp-cart-count {
  min-width: 1.4rem; height: 1.4rem; padding: 0 0.35rem; border-radius: 999px;
  display: inline-grid; place-items: center; font-size: 0.8rem; font-weight: 700;
  background: var(--brand); color: #fff;
  transform: scale(0); transition: transform 0.35s cubic-bezier(0.34,1.56,0.64,1);
}
.sp-cart-count.is-on { transform: scale(1); }
@media (max-width: 720px) { .sp-nav-links { display: none; } }

/* HERO */
.sp-hero {
  position: relative; min-height: min(88svh, 760px);
  display: grid; align-items: center; overflow: hidden;
  padding: clamp(2.5rem, 7vw, 6rem) clamp(1.25rem, 6vw, 5rem);
}
.sp-hero-img {
  position: absolute; inset: -8% 0;
  background: url(/sprig/hero.png) center/cover no-repeat;
  will-change: transform;
}
.sp-hero-veil {
  position: absolute; inset: 0;
  background: linear-gradient(100deg, rgba(255,253,246,0.94) 0%, rgba(255,253,246,0.78) 38%, rgba(255,253,246,0.12) 72%, rgba(255,253,246,0) 100%);
}
@media (max-width: 720px) {
  .sp-hero-veil { background: linear-gradient(180deg, rgba(255,253,246,0.7) 0%, rgba(255,253,246,0.88) 55%, var(--cream) 100%); }
}
.sp-hero-inner { position: relative; max-width: 38rem; }
.sp-hero-kicker {
  display: inline-block; margin: 0 0 1.1rem;
  font-size: 0.95rem; font-weight: 650; color: var(--brand);
  background: rgba(229,52,109,0.1); padding: 0.35rem 0.85rem; border-radius: 999px;
}
.sp-hero-title {
  margin: 0; font-weight: 780; letter-spacing: -0.04em; line-height: 0.98;
  font-size: clamp(2.9rem, 8.5vw, 6rem);
}
.sp-hero-lede {
  margin: 1.4rem 0 2rem; max-width: 32rem;
  font-size: clamp(1.05rem, 1.7vw, 1.3rem); color: var(--ink-soft);
}
.sp-hero-cta { display: flex; flex-wrap: wrap; gap: 0.8rem; }
.sp-hero-proof {
  display: flex; align-items: center; gap: 0.6rem; margin-top: 1.8rem;
  font-size: 0.98rem; color: var(--ink-soft);
}
.sp-hero-proof strong { color: var(--ink); }
.sp-stars { color: #F2B705; letter-spacing: 0.06em; font-size: 1.05rem; }

/* Shared section furniture */
.sp-h2 {
  margin: 0; font-weight: 760; letter-spacing: -0.035em; line-height: 1.02;
  font-size: clamp(2rem, 5vw, 3.4rem);
}
.sp-sub { margin: 0.7rem 0 0; color: var(--ink-soft); font-size: clamp(1rem, 1.5vw, 1.2rem); max-width: 34rem; }

/* FLAVOUR TABS */
.sp-flavors {
  padding: clamp(3.5rem, 8vw, 7rem) clamp(1.25rem, 6vw, 5rem);
  background:
    radial-gradient(120% 90% at 82% 8%, var(--flavor-tint) 0%, transparent 60%),
    var(--cream);
  transition: background 0.7s ease;
}
.sp-flavors-head { max-width: 40rem; margin-bottom: clamp(2rem, 4vw, 3rem); }
.sp-tabs { display: flex; flex-wrap: wrap; gap: 0.55rem; margin-bottom: clamp(2rem, 4vw, 3rem); }
.sp-tab {
  font-family: inherit; font-weight: 600; font-size: 0.98rem; cursor: pointer;
  padding: 0.6rem 1.15rem; border-radius: 999px;
  background: var(--paper); color: var(--ink-soft);
  border: 1.5px solid var(--line);
  transition: color 0.3s, border-color 0.3s, background 0.3s, transform 0.3s cubic-bezier(0.16,1,0.3,1);
}
.sp-tab:hover { transform: translateY(-2px); color: var(--ink); }
.sp-tab.is-active {
  color: #fff; background: var(--tab); border-color: var(--tab);
  box-shadow: 0 12px 26px -14px var(--tab);
}
.sp-flavor-stage {
  display: grid; grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.05fr);
  align-items: center; gap: clamp(1.5rem, 5vw, 4.5rem);
}
.sp-flavor-cans {
  position: relative; aspect-ratio: 1 / 1; border-radius: 28px; overflow: hidden;
  background: var(--flavor-tint); transition: background 0.7s ease;
  box-shadow: var(--shadow);
}
.sp-flavor-halo {
  position: absolute; inset: 0; pointer-events: none;
  background: radial-gradient(60% 60% at 50% 42%, color-mix(in srgb, var(--flavor) 24%, transparent), transparent 70%);
  transition: background 0.7s ease;
}
.sp-flavor-can {
  position: absolute; inset: 0;
  background-size: cover; background-position: center;
  opacity: 0; transform: scale(1.06);
  transition: opacity 0.7s ease, transform 0.9s cubic-bezier(0.16,1,0.3,1);
}
.sp-flavor-can.is-on { opacity: 1; transform: scale(1); }
.sp-flavor-detail { min-width: 0; }
.sp-flavor-note {
  display: inline-block; margin-bottom: 1rem;
  font-size: 0.9rem; font-weight: 650;
  color: var(--flavor-ink); background: var(--flavor);
  padding: 0.35rem 0.9rem; border-radius: 999px;
  transition: background 0.6s ease, color 0.6s ease;
}
.sp-flavor-name {
  margin: 0; font-weight: 760; letter-spacing: -0.035em; line-height: 1;
  font-size: clamp(2.4rem, 6vw, 4rem);
}
.sp-flavor-taste { margin: 1rem 0 0.4rem; font-size: clamp(1.1rem, 2vw, 1.45rem); font-weight: 550; }
.sp-flavor-benefit { margin: 0 0 2rem; color: var(--ink-soft); font-size: 1.05rem; max-width: 26rem; }
.sp-flavor-buy { display: flex; align-items: center; gap: 1.1rem; }
.sp-flavor-add {
  position: relative; overflow: hidden;
  font-family: inherit; font-weight: 680; font-size: 1.02rem; cursor: pointer;
  color: var(--flavor-ink); background: var(--flavor); border: none;
  padding: 0.9rem 1.7rem; border-radius: 999px;
  transition: transform 0.35s cubic-bezier(0.16,1,0.3,1), background 0.6s ease, color 0.6s ease, box-shadow 0.35s;
}
.sp-flavor-add:hover { transform: translateY(-2px); box-shadow: 0 16px 30px -14px var(--flavor); }
.sp-flavor-add-label, .sp-flavor-add-done {
  display: block; transition: transform 0.4s cubic-bezier(0.16,1,0.3,1), opacity 0.4s;
}
.sp-flavor-add-done {
  position: absolute; inset: 0; display: grid; place-items: center;
  opacity: 0; transform: translateY(100%);
}
.sp-flavor-add.is-pulse .sp-flavor-add-label { opacity: 0; transform: translateY(-100%); }
.sp-flavor-add.is-pulse .sp-flavor-add-done { opacity: 1; transform: translateY(0); }
.sp-flavor-price { font-size: 1.2rem; font-weight: 700; font-variant-numeric: tabular-nums; }
@media (max-width: 800px) {
  .sp-flavor-stage { grid-template-columns: 1fr; }
  .sp-flavor-cans { max-width: 24rem; margin: 0 auto; width: 100%; }
}

/* COLLECTION TILES */
.sp-tiles { padding: clamp(3rem, 7vw, 6rem) clamp(1.25rem, 6vw, 5rem); }
.sp-tiles-head { max-width: 40rem; margin-bottom: clamp(1.8rem, 3.5vw, 2.6rem); }
.sp-tiles-grid {
  display: grid; gap: 1.1rem;
  grid-template-columns: repeat(4, 1fr);
}
.sp-tile {
  position: relative; overflow: hidden; border-radius: 22px;
  min-height: 20rem; display: flex; align-items: flex-end;
  text-decoration: none; color: #fff;
  border: 1px solid var(--line);
  transition: transform 0.4s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s;
}
.sp-tile:hover { transform: translateY(-6px); box-shadow: var(--shadow); }
.sp-tile-img {
  position: absolute; inset: 0; background-size: cover; background-position: center;
  transition: transform 0.6s cubic-bezier(0.16,1,0.3,1);
}
.sp-tile:hover .sp-tile-img { transform: scale(1.06); }
.sp-tile::after {
  content: ""; position: absolute; inset: 0;
  background: linear-gradient(to top, color-mix(in srgb, var(--tile) 92%, black) 0%, color-mix(in srgb, var(--tile) 30%, transparent) 45%, transparent 78%);
}
.sp-tile-body { position: relative; padding: 1.4rem; }
.sp-tile-title { margin: 0 0 0.3rem; font-size: 1.4rem; font-weight: 720; letter-spacing: -0.02em; }
.sp-tile-blurb { margin: 0 0 0.7rem; font-size: 0.95rem; opacity: 0.92; }
.sp-tile-link { font-weight: 650; font-size: 0.95rem; border-bottom: 2px solid rgba(255,255,255,0.6); padding-bottom: 1px; }
@media (max-width: 900px) { .sp-tiles-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 480px) { .sp-tiles-grid { grid-template-columns: 1fr; } }

/* BESTSELLERS CAROUSEL */
.sp-shop { padding: clamp(3rem, 7vw, 6rem) 0; background: var(--paper); border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); }
.sp-shop-head {
  display: flex; align-items: flex-end; justify-content: space-between; gap: 1.5rem;
  padding: 0 clamp(1.25rem, 6vw, 5rem); margin-bottom: clamp(1.6rem, 3vw, 2.4rem);
}
.sp-shop-hint { color: var(--ink-soft); font-size: 0.9rem; font-weight: 550; white-space: nowrap; }
.sp-carousel {
  display: flex; gap: 1.1rem; overflow-x: auto; scroll-snap-type: x mandatory;
  padding: 0.4rem clamp(1.25rem, 6vw, 5rem) 1.4rem;
  scrollbar-width: thin; scrollbar-color: var(--line-2) transparent;
}
.sp-carousel::-webkit-scrollbar { height: 7px; }
.sp-carousel::-webkit-scrollbar-thumb { background: var(--line-2); border-radius: 999px; }
.sp-card {
  scroll-snap-align: start; flex: 0 0 clamp(15rem, 30vw, 18.5rem);
  background: var(--cream); border: 1px solid var(--line); border-radius: 20px; overflow: hidden;
  transition: border-color 0.35s, transform 0.4s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s;
}
.sp-card:hover { transform: translateY(-6px); border-color: var(--card); box-shadow: var(--shadow); }
.sp-card-media { position: relative; }
.sp-card-img { aspect-ratio: 1 / 1; background-size: cover; background-position: center; }
.sp-card-swatches { position: absolute; left: 0.9rem; bottom: 0.9rem; display: flex; gap: 0.35rem; }
.sp-card-swatches span { width: 0.85rem; height: 0.85rem; border-radius: 999px; box-shadow: 0 0 0 2px rgba(255,255,255,0.85); }
.sp-card-body { padding: 1.15rem 1.25rem 1.4rem; }
.sp-card-rating { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.55rem; }
.sp-card-rating-num { font-size: 0.86rem; font-weight: 600; color: var(--ink); }
.sp-card-rating-num span { color: var(--ink-soft); font-weight: 500; }
.sp-card-name { margin: 0 0 0.25rem; font-size: 1.15rem; font-weight: 700; letter-spacing: -0.02em; }
.sp-card-taste { margin: 0 0 1.1rem; font-size: 0.92rem; color: var(--ink-soft); min-height: 2.6em; }
.sp-card-buy { display: flex; align-items: center; justify-content: space-between; }
.sp-card-price { font-size: 1.2rem; font-weight: 700; font-variant-numeric: tabular-nums; }
.sp-quick {
  position: relative; width: 2.7rem; height: 2.7rem; border-radius: 999px; cursor: pointer;
  border: none; background: var(--ink); color: var(--cream);
  transition: transform 0.35s cubic-bezier(0.34,1.56,0.64,1), background 0.3s;
}
.sp-quick:hover { transform: scale(1.08); background: var(--card); }
.sp-quick-plus, .sp-quick-check {
  position: absolute; inset: 0; display: grid; place-items: center;
  font-size: 1.4rem; line-height: 1; transition: opacity 0.3s, transform 0.4s cubic-bezier(0.16,1,0.3,1);
}
.sp-quick-check { opacity: 0; transform: scale(0.4); font-size: 1.15rem; }
.sp-quick.is-pulse { background: var(--card); }
.sp-quick.is-pulse .sp-quick-plus { opacity: 0; transform: scale(0.4); }
.sp-quick.is-pulse .sp-quick-check { opacity: 1; transform: scale(1); }

/* CART DRAWER */
.sp-cart-scrim {
  position: fixed; inset: 0; z-index: 90;
  background: rgba(20, 18, 30, 0.4);
  opacity: 0; visibility: hidden; transition: opacity 0.4s ease, visibility 0.4s;
}
.sp-cart-scrim.is-open { opacity: 1; visibility: visible; }
.sp-drawer {
  position: fixed; top: 0; right: 0; bottom: 0; z-index: 95;
  width: min(29rem, 100vw); display: flex; flex-direction: column;
  background: var(--cream); box-shadow: -30px 0 60px -30px rgba(20,18,30,0.45);
  transform: translateX(100%); transition: transform 0.5s cubic-bezier(0.16,1,0.3,1);
}
.sp-drawer.is-open { transform: translateX(0); }
.sp-drawer-top {
  display: flex; align-items: center; justify-content: space-between;
  padding: 1.4rem 1.5rem 1.1rem; border-bottom: 1px solid var(--line);
}
.sp-drawer-title { margin: 0; font-size: 1.3rem; font-weight: 720; letter-spacing: -0.02em; }
.sp-drawer-close {
  width: 2.2rem; height: 2.2rem; border-radius: 999px; cursor: pointer;
  border: none; background: transparent; font-size: 1.6rem; line-height: 1; color: var(--ink-soft);
  transition: background 0.25s, color 0.25s;
}
.sp-drawer-close:hover { background: rgba(20,18,30,0.06); color: var(--ink); }

.sp-ship { padding: 1.1rem 1.5rem; background: var(--paper); border-bottom: 1px solid var(--line); }
.sp-ship-msg { margin: 0 0 0.7rem; font-size: 0.95rem; color: var(--ink-soft); }
.sp-ship-msg strong { color: var(--ink); }
.sp-ship-track { height: 0.6rem; border-radius: 999px; background: rgba(20,18,30,0.08); overflow: hidden; }
.sp-ship-fill {
  height: 100%; border-radius: 999px; background: var(--brand);
  transition: width 0.7s cubic-bezier(0.16,1,0.3,1), background 0.4s;
}
.sp-ship-fill.is-full { background: #3DA35D; }

.sp-drawer-lines { flex: 1; overflow-y: auto; padding: 0.6rem 1.5rem; }
.sp-cart-empty { display: grid; gap: 1rem; place-items: center; text-align: center; padding: 3.5rem 1rem; color: var(--ink-soft); }
.sp-line { display: flex; align-items: center; gap: 0.9rem; padding: 1rem 0; border-bottom: 1px solid var(--line); }
.sp-line-swatch { flex: none; width: 2.6rem; height: 2.6rem; border-radius: 12px; box-shadow: inset 0 0 0 1px rgba(0,0,0,0.08); }
.sp-line-info { flex: 1; min-width: 0; }
.sp-line-name { margin: 0; font-weight: 620; font-size: 0.98rem; }
.sp-line-price { margin: 0.1rem 0 0; color: var(--ink-soft); font-size: 0.9rem; font-variant-numeric: tabular-nums; }
.sp-stepper { display: flex; align-items: center; gap: 0.15rem; border: 1px solid var(--line-2); border-radius: 999px; padding: 0.15rem; }
.sp-stepper button {
  width: 1.7rem; height: 1.7rem; border-radius: 999px; cursor: pointer; border: none; background: transparent;
  font-size: 1.05rem; line-height: 1; color: var(--ink); transition: background 0.2s;
}
.sp-stepper button:hover { background: rgba(20,18,30,0.08); }
.sp-stepper span { min-width: 1.4rem; text-align: center; font-weight: 650; font-size: 0.95rem; font-variant-numeric: tabular-nums; }

.sp-drawer-foot { padding: 1.2rem 1.5rem 1.5rem; border-top: 1px solid var(--line); background: var(--paper); }
.sp-drawer-subtotal { display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 1rem; }
.sp-drawer-subtotal span { color: var(--ink-soft); font-size: 0.98rem; }
.sp-drawer-subtotal strong { font-size: 1.5rem; font-weight: 750; font-variant-numeric: tabular-nums; letter-spacing: -0.02em; }
.sp-drawer-checkout { width: 100%; }
.sp-drawer-fine { margin: 0.8rem 0 0; text-align: center; font-size: 0.82rem; color: var(--ink-soft); }

/* SUBSCRIBE & SAVE */
.sp-sub-block { padding: clamp(3.5rem, 8vw, 7rem) clamp(1.25rem, 6vw, 5rem); }
.sp-sub-grid {
  display: grid; grid-template-columns: 1fr 1fr; gap: clamp(1.75rem, 5vw, 4rem); align-items: center;
  background: linear-gradient(135deg, #171820 0%, #24202e 100%); color: var(--cream);
  border-radius: 30px; padding: clamp(2rem, 5vw, 4rem);
}
.sp-sub-copy .sp-h2 { color: var(--cream); }
.sp-sub-copy .sp-sub { color: rgba(255,253,246,0.72); }
.sp-sub-perks { margin: 1.6rem 0 0; padding: 0; list-style: none; display: grid; gap: 0.7rem; }
.sp-sub-perks li { position: relative; padding-left: 1.7rem; font-size: 0.98rem; color: rgba(255,253,246,0.9); }
.sp-sub-perks li::before {
  content: "✓"; position: absolute; left: 0; top: 0;
  width: 1.2rem; height: 1.2rem; border-radius: 999px; display: grid; place-items: center;
  background: #3DA35D; color: #fff; font-size: 0.75rem; font-weight: 700;
}
.sp-builder { background: var(--cream); color: var(--ink); border-radius: 22px; padding: clamp(1.5rem, 3vw, 2rem); }
.sp-builder-step { margin: 0 0 0.7rem; font-weight: 650; font-size: 0.95rem; }
.sp-builder-step:not(:first-child) { margin-top: 1.4rem; }
.sp-builder-sizes { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.6rem; }
.sp-size {
  display: grid; gap: 0.2rem; text-align: left; cursor: pointer;
  padding: 0.9rem 0.9rem; border-radius: 14px; background: var(--paper);
  border: 1.5px solid var(--line); font-family: inherit;
  transition: border-color 0.3s, transform 0.3s cubic-bezier(0.16,1,0.3,1), background 0.3s;
}
.sp-size:hover { transform: translateY(-2px); }
.sp-size.is-active { border-color: var(--ink); background: #fff; box-shadow: var(--shadow); }
.sp-size-n { font-size: 1.5rem; font-weight: 760; letter-spacing: -0.03em; }
.sp-size-label { font-size: 0.8rem; color: var(--ink-soft); }
.sp-freq { display: flex; gap: 0.5rem; }
.sp-freq-opt {
  flex: 1; cursor: pointer; font-family: inherit; font-weight: 600; font-size: 0.95rem;
  padding: 0.75rem; border-radius: 999px; background: var(--paper);
  border: 1.5px solid var(--line); color: var(--ink-soft);
  transition: color 0.3s, border-color 0.3s, background 0.3s;
}
.sp-freq-opt.is-active { color: var(--ink); border-color: var(--ink); background: #fff; }
.sp-builder-total { display: flex; align-items: center; justify-content: space-between; gap: 1rem; margin-top: 1.6rem; flex-wrap: wrap; }
.sp-builder-was { text-decoration: line-through; color: var(--ink-soft); font-size: 1rem; margin-right: 0.5rem; font-variant-numeric: tabular-nums; }
.sp-builder-now { font-size: 1.9rem; font-weight: 760; letter-spacing: -0.03em; font-variant-numeric: tabular-nums; }
.sp-builder-cadence { display: block; font-size: 0.85rem; color: var(--ink-soft); margin-top: 0.15rem; }
@media (max-width: 820px) { .sp-sub-grid { grid-template-columns: 1fr; } }

/* HERO VIDEO — fades in over the poster still once it can play */
.sp-hero-video {
  position: absolute; inset: -8% 0; width: 100%; height: 116%;
  object-fit: cover; opacity: 0; z-index: 1;
  transition: opacity 1.1s ease;
}
.sp-hero-video.is-ready { opacity: 1; }
.sp-hero-veil { z-index: 2; }
.sp-hero-inner { z-index: 3; }

/* FLY-TO-CART DISC (appended to body, so styled globally not under root) */
.sp-fly {
  position: fixed; z-index: 200; width: 1.5rem; height: 1.5rem;
  border-radius: 999px; pointer-events: none;
  box-shadow: 0 6px 16px -4px rgba(20,18,30,0.5), inset 0 0 0 2px rgba(255,255,255,0.7);
}
.sp-cart-btn.is-bump { animation: sp-bump 0.42s cubic-bezier(0.34,1.56,0.64,1); }
@keyframes sp-bump {
  0% { transform: scale(1); }
  40% { transform: scale(1.16); }
  100% { transform: scale(1); }
}

/* FOUNDER STORY + PRESS */
.sp-story { padding: clamp(3.5rem, 8vw, 7rem) clamp(1.25rem, 6vw, 5rem) clamp(2.5rem, 5vw, 4rem); }
.sp-story-grid {
  display: grid; grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
  align-items: center; gap: clamp(1.75rem, 5vw, 4.5rem);
}
.sp-story-media {
  opacity: 0; transform: translateX(-24px);
  transition: opacity 0.8s ease, transform 0.9s cubic-bezier(0.16,1,0.3,1);
}
.sp-story-copy {
  opacity: 0; transform: translateY(24px);
  transition: opacity 0.8s ease 0.1s, transform 0.9s cubic-bezier(0.16,1,0.3,1) 0.1s;
}
.sp-story-grid.is-shown .sp-story-media,
.sp-story-grid.is-shown .sp-story-copy { opacity: 1; transform: none; }
.sp-story-img {
  aspect-ratio: 4 / 5; border-radius: 26px; overflow: hidden;
  background: var(--flavor-tint, #FFE7DC) center/cover no-repeat;
  box-shadow: var(--shadow);
}
.sp-story-copy .sp-h2 { max-width: 20ch; }
.sp-story-copy p { margin: 1.2rem 0 0; color: var(--ink-soft); font-size: 1.06rem; max-width: 46ch; }
.sp-story-copy .sp-btn { margin-top: 1.8rem; }
@media (max-width: 820px) {
  .sp-story-grid { grid-template-columns: 1fr; }
  .sp-story-img { max-width: 26rem; }
}

.sp-press { margin-top: clamp(3rem, 6vw, 5rem); padding-top: clamp(2rem, 4vw, 3rem); border-top: 1px solid var(--line); }
.sp-press-label { display: block; text-align: center; margin-bottom: 1.4rem; font-size: 0.9rem; font-weight: 600; color: var(--ink-soft); }
.sp-press-marquee { position: relative; overflow: hidden; mask-image: linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent); }
.sp-press-row { display: flex; gap: clamp(2rem, 5vw, 4rem); width: max-content; animation: sp-marquee 26s linear infinite; }
.sp-press-name { font-size: clamp(1.15rem, 2.4vw, 1.7rem); font-weight: 620; letter-spacing: -0.02em; color: var(--ink); opacity: 0.55; white-space: nowrap; }
@keyframes sp-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }

/* REVIEWS + UGC */
.sp-reviews { padding: clamp(3.5rem, 8vw, 7rem) clamp(1.25rem, 6vw, 5rem); background: var(--paper); border-top: 1px solid var(--line); }
.sp-reviews-head { max-width: 42rem; margin-bottom: clamp(2rem, 4vw, 3rem); }
.sp-reviews-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.1rem; }
.sp-review {
  margin: 0; padding: 1.5rem; border-radius: 20px;
  background: var(--cream); border: 1px solid var(--line);
  opacity: 0; transform: translateY(26px);
  transition: opacity 0.7s ease, transform 0.8s cubic-bezier(0.16,1,0.3,1);
}
.sp-reviews-grid.is-shown .sp-review { opacity: 1; transform: none; }
.sp-review .sp-stars { display: block; margin-bottom: 0.9rem; }
.sp-review blockquote { margin: 0 0 1.2rem; font-size: 1rem; line-height: 1.55; letter-spacing: -0.01em; }
.sp-review figcaption { display: flex; flex-direction: column; gap: 0.1rem; }
.sp-review figcaption strong { font-weight: 680; font-size: 0.95rem; }
.sp-review figcaption span { font-size: 0.85rem; color: var(--ink-soft); }
@media (max-width: 980px) { .sp-reviews-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 520px) { .sp-reviews-grid { grid-template-columns: 1fr; } }

.sp-ugc { display: grid; grid-template-columns: repeat(5, 1fr); gap: 0.8rem; margin-top: clamp(2rem, 4vw, 3rem); }
.sp-ugc-tile {
  aspect-ratio: 1 / 1; border-radius: 16px; overflow: hidden;
  background: var(--flavor-tint, #FCE1EC) center/cover no-repeat;
  transition: transform 0.5s cubic-bezier(0.16,1,0.3,1);
}
.sp-ugc-tile:hover { transform: scale(1.04); }
@media (max-width: 720px) { .sp-ugc { grid-template-columns: repeat(3, 1fr); } .sp-ugc-tile:nth-child(n+4) { display: none; } }

/* NEWSLETTER CAPTURE */
.sp-capture {
  padding: clamp(3.5rem, 8vw, 7rem) clamp(1.25rem, 6vw, 5rem);
  background:
    radial-gradient(120% 120% at 18% 0%, rgba(229,52,109,0.14) 0%, transparent 55%),
    radial-gradient(120% 120% at 90% 100%, rgba(242,183,5,0.16) 0%, transparent 55%),
    var(--cream);
}
.sp-capture-inner { max-width: 40rem; margin: 0 auto; text-align: center; }
.sp-capture-title { margin: 0; font-size: clamp(2.1rem, 5.5vw, 3.6rem); font-weight: 770; letter-spacing: -0.035em; line-height: 1.02; }
.sp-capture-sub { margin: 1rem auto 2rem; max-width: 34rem; color: var(--ink-soft); font-size: clamp(1rem, 1.6vw, 1.2rem); }
.sp-capture-form { display: flex; gap: 0.7rem; max-width: 30rem; margin: 0 auto; flex-wrap: wrap; }
.sp-capture-input {
  flex: 1; min-width: 12rem; font-family: inherit; font-size: 1rem;
  padding: 1rem 1.3rem; border-radius: 999px; color: var(--ink);
  background: var(--paper); border: 1.5px solid var(--line-2);
  transition: border-color 0.3s, box-shadow 0.3s;
}
.sp-capture-input:focus { outline: none; border-color: var(--brand); box-shadow: 0 0 0 4px rgba(229,52,109,0.14); }
.sp-capture-fine { margin: 1.2rem 0 0; font-size: 0.85rem; color: var(--ink-soft); }

/* FOOTER */
.sp-footer { background: var(--ink); color: rgba(255,253,246,0.8); padding: clamp(3rem, 6vw, 5rem) clamp(1.25rem, 6vw, 5rem) 2rem; }
.sp-footer-grid {
  display: grid; grid-template-columns: 1.6fr 1fr 1fr 1fr; gap: clamp(1.5rem, 4vw, 3rem);
  padding-bottom: clamp(2rem, 4vw, 3rem); border-bottom: 1px solid rgba(255,253,246,0.12);
}
.sp-footer-brand .sp-logo { color: var(--cream); margin-bottom: 1rem; }
.sp-footer-brand p { margin: 0; max-width: 30ch; font-size: 0.95rem; line-height: 1.55; }
.sp-footer-col h3 { margin: 0 0 1rem; font-size: 0.8rem; font-weight: 700; letter-spacing: 0.02em; color: var(--cream); }
.sp-footer-col a { display: block; margin-bottom: 0.6rem; text-decoration: none; font-size: 0.95rem; color: rgba(255,253,246,0.7); transition: color 0.25s; }
.sp-footer-col a:hover { color: var(--cream); }
.sp-footer-base {
  display: flex; align-items: center; justify-content: space-between; gap: 1rem; flex-wrap: wrap;
  padding-top: 1.6rem; font-size: 0.88rem; color: rgba(255,253,246,0.6);
}
.sp-footer-legal { display: flex; gap: 1.4rem; }
.sp-footer-legal a { text-decoration: none; color: rgba(255,253,246,0.6); transition: color 0.25s; }
.sp-footer-legal a:hover { color: var(--cream); }
@media (max-width: 820px) { .sp-footer-grid { grid-template-columns: 1fr 1fr; } }
@media (max-width: 480px) { .sp-footer-grid { grid-template-columns: 1fr; } }

/* CSS-END */
`
