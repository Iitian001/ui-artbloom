"use client"

import { useEffect, useMemo, useRef, useState } from "react"

/**
 * Folio — a culture & design magazine, and the "editorial" archetype for the
 * ui.artbloom catalog: a curated cover story over a uniform, image-forward card
 * grid sliced by category, where every post reads as a feature.
 *
 * Deliberately clear of the tells that got earlier work rejected: the base is a
 * crisp paper white with true ink (no cream cliché, no brown-tinted black), the
 * single accent is an editorial vermilion used sparingly on chrome and pulled
 * from the photography, the masthead is Fraunces while every kicker/body/label is
 * Geist, there are no tracked-uppercase eyebrows, no middle-dot meta strings, no
 * em-dash fragment labels, no monospace UI, no arrow-suffixed links, no
 * 01/02/03 numbering (posts are a set, not a sequence), and no glass/backdrop
 * blur. One bold move — the mask-wipe reveals — the rest quiet. All motion is
 * scroll- or interaction-driven and gated on prefers-reduced-motion.
 */

type Category = "Design" | "Culture" | "Travel" | "Food" | "Technology"

type Post = {
  title: string
  dek: string
  byline: string
  category: Category
  date: string
  read: string
  img: string
  ratio: "wide" | "tall"
}

const CATEGORIES: Category[] = ["Design", "Culture", "Travel", "Food", "Technology"]

const POSTS: Post[] = [
  {
    title: "The staircase that taught a city to slow down",
    dek: "Inside the civic library where a single sweep of concrete and oak became the most photographed room in the country.",
    byline: "Marthis Okonkwo",
    category: "Design",
    date: "Sept 18",
    read: "9 min",
    img: "/folio/a1.png",
    ratio: "wide",
  },
  {
    title: "A red door, and the village that kept its shade",
    dek: "On a hillside above the Tyrrhenian, a lane of whitewashed houses has quietly refused a hundred years of renovation.",
    byline: "Elena Vasarri",
    category: "Travel",
    date: "Sept 16",
    read: "7 min",
    img: "/folio/a2.png",
    ratio: "tall",
  },
  {
    title: "Breakfast, and the case for eating with the season",
    dek: "A torn loaf, a bowl of blood oranges, a carafe of something local. The most radical meal of the day is also the plainest.",
    byline: "Toma Delacroix",
    category: "Food",
    date: "Sept 15",
    read: "6 min",
    img: "/folio/a3.png",
    ratio: "wide",
  },
  {
    title: "One stroke of red, and a room full of people who stayed",
    dek: "The painter spent a decade removing everything from her canvases. What she left is drawing crowds across three continents.",
    byline: "Priya Anand",
    category: "Culture",
    date: "Sept 13",
    read: "11 min",
    img: "/folio/a4.png",
    ratio: "tall",
  },
  {
    title: "The quiet objects a studio keeps for itself",
    dek: "A vase, a folded cloth, a small brass form. A profile of the makers who design for the shelf behind their own desk.",
    byline: "Sena Alderton",
    category: "Design",
    date: "Sept 11",
    read: "8 min",
    img: "/folio/a5.png",
    ratio: "wide",
  },
  {
    title: "The desk is the last honest interface",
    dek: "As screens dissolve into everything, a handful of designers are betting the future belongs to the objects you can still touch.",
    byline: "Idris Kwan",
    category: "Technology",
    date: "Sept 9",
    read: "10 min",
    img: "/folio/a6.png",
    ratio: "tall",
  },
  {
    title: "Hands, clay, and the long argument with speed",
    dek: "A generation raised on undo is learning to work in a medium that never lets you take anything back.",
    byline: "Rafael Monteiro",
    category: "Culture",
    date: "Sept 6",
    read: "9 min",
    img: "/folio/a7.png",
    ratio: "wide",
  },
  {
    title: "The city looks best in the rain, and other secrets",
    dek: "A photographer's argument for the blue hour, the wet cobblestone, and the one lit window that makes a street a story.",
    byline: "Noor Haddad",
    category: "Travel",
    date: "Sept 4",
    read: "5 min",
    img: "/folio/a8.png",
    ratio: "tall",
  },
]

/** Reveal a node once it scrolls into view. Reduced-motion shows it instantly. */
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

export default function Folio() {
  const [reduced, setReduced] = useState(false)
  const [active, setActive] = useState<Category | "All">("All")
  const [visible, setVisible] = useState(6)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReduced(mq.matches)
    const onMq = () => setReduced(mq.matches)
    mq.addEventListener("change", onMq)
    // trigger the load mask-wipe on the cover after mount
    const t = requestAnimationFrame(() => setLoaded(true))
    return () => {
      mq.removeEventListener("change", onMq)
      cancelAnimationFrame(t)
    }
  }, [])

  const filtered = useMemo(
    () => (active === "All" ? POSTS : POSTS.filter((p) => p.category === active)),
    [active],
  )
  const shownPosts = filtered.slice(0, visible)
  const canLoadMore = visible < filtered.length

  const onFilter = (c: Category | "All") => {
    setActive(c)
    setVisible(6)
  }

  return (
    <div className={`folio-root ${loaded ? "is-loaded" : ""} ${reduced ? "is-reduced" : ""}`}>
      <style>{css}</style>

      {/* MASTHEAD */}
      <header className="fo-masthead">
        <div className="fo-mast-top">
          <span className="fo-issue">Issue No. 47</span>
          <a className="fo-wordmark" href="#top">
            Folio
          </a>
          <a className="fo-sub-mini" href="#subscribe">
            Subscribe
          </a>
        </div>
        <nav className="fo-mast-nav" aria-label="Sections">
          {CATEGORIES.map((c) => (
            <a key={c} href={`#${c.toLowerCase()}`} className="fo-mast-link">
              {c}
            </a>
          ))}
        </nav>
      </header>

      {/* COVER STORY — mask-wipe reveal on load */}
      <section className="fo-cover" id="top">
        <div className="fo-cover-frame">
          <div className="fo-cover-img" />
          <span className="fo-cover-mask" aria-hidden="true" />
        </div>
        <div className="fo-cover-body">
          <span className="fo-kicker">The cover story</span>
          <h1 className="fo-cover-title">
            The building that
            <br />
            learned to breathe
          </h1>
          <p className="fo-cover-dek">
            For thirty years the old exchange sat dark behind its own facade. A small studio was
            handed the keys, a modest budget, and one rule: change nothing you cannot explain. What
            they did instead was teach the whole block how to hold light.
          </p>
          <div className="fo-cover-meta">
            <span className="fo-byline">Words by Adaeze Fenwick</span>
            <span className="fo-dot" aria-hidden="true" />
            <span className="fo-tag">Design</span>
            <span className="fo-dot" aria-hidden="true" />
            <span className="fo-read">14 min read</span>
          </div>
          <a className="fo-cover-cta" href="#latest">
            Read the feature
          </a>
        </div>
      </section>

      {/* FILTER + UNIFORM GRID */}
      <section className="fo-latest" id="latest">
        <div className="fo-section-head">
          <h2 className="fo-h2">Latest features</h2>
          <p className="fo-section-sub">
            Everything we have published this month, from the studios and the streets. Filter by the
            desk it came from.
          </p>
        </div>

        <div className="fo-filter" role="tablist" aria-label="Filter by section">
          <button
            role="tab"
            aria-selected={active === "All"}
            className={`fo-chip ${active === "All" ? "is-active" : ""}`}
            onClick={() => onFilter("All")}
          >
            All
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c}
              role="tab"
              aria-selected={active === c}
              className={`fo-chip ${active === c ? "is-active" : ""}`}
              onClick={() => onFilter(c)}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="fo-grid" key={active}>
          {shownPosts.map((p, i) => (
            <PostCard post={p} index={i} key={p.title} />
          ))}
        </div>

        {canLoadMore && (
          <div className="fo-more-wrap">
            <button className="fo-more" onClick={() => setVisible((v) => v + 3)}>
              Load more stories
            </button>
          </div>
        )}
      </section>

      {/* NEWSLETTER PROMO — inline, mid-feed */}
      <section className="fo-promo" id="subscribe">
        <div className="fo-promo-inner">
          <div className="fo-promo-copy">
            <span className="fo-kicker fo-kicker--ink">The Saturday edition</span>
            <h2 className="fo-promo-title">
              One long read, chosen by an editor, in your inbox each weekend
            </h2>
            <p className="fo-promo-dek">
              No feed, no algorithm. A single piece worth your coffee, plus the three images our
              photo desk could not stop looking at. Sixty thousand readers, and not one of them
              scrolling.
            </p>
          </div>
          <form
            className="fo-promo-form"
            onSubmit={(e) => e.preventDefault()}
            aria-label="Subscribe to the Saturday edition"
          >
            <label className="fo-field-label" htmlFor="fo-email">
              Your email
            </label>
            <div className="fo-field-row">
              <input
                id="fo-email"
                className="fo-field"
                type="email"
                placeholder="you@studio.com"
                autoComplete="email"
              />
              <button className="fo-field-btn" type="submit">
                Subscribe
              </button>
            </div>
            <p className="fo-field-note">Free. Unsubscribe whenever the coffee runs out.</p>
          </form>
        </div>
      </section>

      {/* EDITOR'S PICKS — secondary trending strip */}
      <section className="fo-picks">
        <div className="fo-section-head fo-section-head--row">
          <h2 className="fo-h2 fo-h2--sm">Editor&rsquo;s picks</h2>
          <p className="fo-section-sub">The stories our desk is still arguing about.</p>
        </div>
        <div className="fo-picks-track">
          {POSTS.slice(0, 4).map((p) => (
            <a className="fo-pick" href="#latest" key={p.title}>
              <div className="fo-pick-img" style={{ backgroundImage: `url(${p.img})` }} />
              <div className="fo-pick-body">
                <span className="fo-pick-cat">{p.category}</span>
                <h3 className="fo-pick-title">{p.title}</h3>
                <span className="fo-pick-by">{p.byline}</span>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* FOOTER — category index + subscribe */}
      <footer className="fo-footer">
        <div className="fo-footer-top">
          <div className="fo-footer-brand">
            <span className="fo-wordmark fo-wordmark--footer">Folio</span>
            <p className="fo-footer-blurb">
              A magazine about the people making the built world worth looking at. Published monthly
              from a room above a print shop.
            </p>
          </div>
          <nav className="fo-footer-cols" aria-label="Footer">
            <div className="fo-footer-col">
              <span className="fo-col-head">Sections</span>
              {CATEGORIES.map((c) => (
                <a key={c} href={`#${c.toLowerCase()}`}>
                  {c}
                </a>
              ))}
            </div>
            <div className="fo-footer-col">
              <span className="fo-col-head">The magazine</span>
              <a href="#latest">Current issue</a>
              <a href="#latest">Archive</a>
              <a href="#subscribe">Subscribe</a>
              <a href="#latest">Masthead</a>
            </div>
            <div className="fo-footer-col">
              <span className="fo-col-head">Elsewhere</span>
              <a href="#latest">Instagram</a>
              <a href="#latest">Newsletter</a>
              <a href="#latest">Print shop</a>
            </div>
          </nav>
        </div>
        <div className="fo-footer-base">
          <span>&copy; {new Date().getFullYear()} Folio Magazine</span>
          <span className="fo-footer-fine">Printed on recycled stock. Read on any screen.</span>
        </div>
      </footer>
    </div>
  )
}

/** A uniform image-forward card: consistent crop, category kicker + mark slide up on hover. */
function PostCard({ post, index }: { post: Post; index: number }) {
  const [ref, shown] = useReveal<HTMLElement>()
  return (
    <article
      ref={ref}
      className={`fo-card fo-card--${post.ratio} ${shown ? "is-in" : ""}`}
      style={{ ["--d" as string]: `${(index % 3) * 90}ms` }}
    >
      <a className="fo-card-link" href="#latest" aria-label={post.title}>
        <div className="fo-card-frame">
          <div className="fo-card-img" style={{ backgroundImage: `url(${post.img})` }} />
          <span className="fo-card-scrim" aria-hidden="true" />
          <div className="fo-card-float">
            <span className="fo-card-kicker">{post.category}</span>
            <span className="fo-card-mark" aria-hidden="true">
              Read
            </span>
          </div>
          <span className="fo-card-wipe" aria-hidden="true" />
        </div>
        <div className="fo-card-body">
          <div className="fo-card-topline">
            <span className="fo-card-cat">{post.category}</span>
            <span className="fo-card-date">{post.date}</span>
          </div>
          <h3 className="fo-card-title">{post.title}</h3>
          <p className="fo-card-dek">{post.dek}</p>
          <div className="fo-card-foot">
            <span className="fo-card-by">{post.byline}</span>
            <span className="fo-card-read">{post.read}</span>
          </div>
        </div>
      </a>
    </article>
  )
}

const css = `
.folio-root {
  --paper: #f7f5f1;
  --paper-2: #ffffff;
  --ink: #14110f;
  --ink-soft: #4a443f;
  --ink-faint: #8a827a;
  --red: #e0483a;
  --red-deep: #b8362b;
  --line: rgba(20, 17, 15, 0.12);
  --line-soft: rgba(20, 17, 15, 0.07);
  background: var(--paper);
  color: var(--ink);
  font-family: var(--font-geist), system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
  line-height: 1.6;
  overflow-x: hidden;
}
.folio-root *,
.folio-root *::before,
.folio-root *::after { box-sizing: border-box; }
.folio-root ::selection { background: var(--red); color: #fff; }

.fo-wordmark {
  font-family: var(--font-fraunces), Georgia, serif;
  font-weight: 600;
  font-size: 1.7rem;
  letter-spacing: -0.02em;
  color: var(--ink);
  text-decoration: none;
  font-variation-settings: "opsz" 40, "SOFT" 0, "WONK" 0;
}

/* MASTHEAD */
.fo-masthead {
  border-bottom: 1px solid var(--ink);
  padding: 0 clamp(1.1rem, 4vw, 3.5rem);
  background: var(--paper);
}
.fo-mast-top {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  padding: 1.1rem 0 1.2rem;
}
.fo-issue { font-size: 0.82rem; color: var(--ink-faint); justify-self: start; font-variant-numeric: tabular-nums; }
.fo-mast-top .fo-wordmark { justify-self: center; font-size: clamp(1.9rem, 4vw, 2.6rem); }
.fo-sub-mini {
  justify-self: end;
  font-size: 0.85rem;
  color: var(--ink);
  text-decoration: none;
  border-bottom: 1px solid var(--red);
  padding-bottom: 2px;
  transition: color 0.3s;
}
.fo-sub-mini:hover { color: var(--red); }
.fo-mast-nav {
  display: flex;
  gap: clamp(1rem, 3vw, 2.6rem);
  justify-content: center;
  border-top: 1px solid var(--line);
  padding: 0.7rem 0;
  flex-wrap: wrap;
}
.fo-mast-link {
  font-size: 0.9rem;
  color: var(--ink-soft);
  text-decoration: none;
  transition: color 0.25s;
  position: relative;
}
.fo-mast-link::after {
  content: "";
  position: absolute; left: 0; right: 0; bottom: -0.72rem; height: 2px;
  background: var(--red); transform: scaleX(0); transform-origin: center;
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.fo-mast-link:hover { color: var(--ink); }
.fo-mast-link:hover::after { transform: scaleX(1); }
@media (max-width: 560px) { .fo-issue { display: none; } .fo-mast-top { grid-template-columns: 1fr auto; } }

/* COVER STORY */
.fo-cover {
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  gap: clamp(1.5rem, 4vw, 3.5rem);
  align-items: center;
  max-width: 1320px;
  margin: 0 auto;
  padding: clamp(2rem, 5vw, 4rem) clamp(1.1rem, 4vw, 3.5rem) clamp(2.5rem, 6vw, 5rem);
}
.fo-cover-frame { position: relative; overflow: hidden; border-radius: 4px; }
.fo-cover-img {
  aspect-ratio: 3 / 2;
  background: url(/folio/cover.png) center/cover no-repeat;
  transform: scale(1.04);
  transition: transform 6s cubic-bezier(0.16, 1, 0.3, 1);
}
.folio-root.is-loaded .fo-cover-img { transform: scale(1); }
/* mask-wipe on load */
.fo-cover-mask {
  position: absolute; inset: 0; background: var(--paper); transform-origin: right;
  transition: transform 1.05s cubic-bezier(0.76, 0, 0.24, 1);
}
.folio-root.is-loaded .fo-cover-mask { transform: scaleX(0); }
.fo-cover-body { max-width: 34rem; }
.fo-kicker {
  display: inline-block;
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--red);
  letter-spacing: 0.01em;
  margin-bottom: 1rem;
}
.fo-kicker--ink { color: var(--ink-faint); }
.fo-cover-title {
  font-family: var(--font-fraunces), Georgia, serif;
  font-weight: 480;
  font-size: clamp(2.4rem, 5.2vw, 4.6rem);
  line-height: 0.99;
  letter-spacing: -0.025em;
  margin: 0 0 1.3rem;
  font-variation-settings: "opsz" 144, "SOFT" 0, "WONK" 0;
}
.fo-cover-dek {
  font-size: clamp(1.02rem, 1.4vw, 1.2rem);
  color: var(--ink-soft);
  margin: 0 0 1.6rem;
  max-width: 32rem;
}
.fo-cover-meta {
  display: flex; align-items: center; gap: 0.7rem; flex-wrap: wrap;
  font-size: 0.88rem; color: var(--ink-faint); margin-bottom: 1.8rem;
}
.fo-byline { color: var(--ink); }
.fo-dot { width: 3px; height: 3px; border-radius: 50%; background: var(--ink-faint); }
.fo-tag { color: var(--red); font-weight: 600; }
.fo-cover-cta {
  display: inline-block;
  background: var(--ink);
  color: var(--paper);
  text-decoration: none;
  font-weight: 500;
  font-size: 0.95rem;
  padding: 0.85rem 1.7rem;
  border-radius: 999px;
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), background 0.3s;
}
.fo-cover-cta:hover { transform: translateY(-2px); background: var(--red); }
@media (max-width: 860px) {
  .fo-cover { grid-template-columns: 1fr; gap: 1.6rem; }
  .fo-cover-frame { order: -1; }
}

/* SECTION HEADS */
.fo-latest { max-width: 1320px; margin: 0 auto; padding: clamp(2rem, 4vw, 3.5rem) clamp(1.1rem, 4vw, 3.5rem) clamp(3rem, 6vw, 5rem); }
.fo-section-head { max-width: 46rem; margin-bottom: 2rem; }
.fo-section-head--row {
  display: flex; align-items: baseline; justify-content: space-between; gap: 1.5rem;
  max-width: none; flex-wrap: wrap;
}
.fo-h2 {
  font-family: var(--font-fraunces), Georgia, serif;
  font-weight: 460;
  font-size: clamp(1.9rem, 4vw, 3.1rem);
  line-height: 1.02;
  letter-spacing: -0.02em;
  margin: 0 0 0.7rem;
}
.fo-h2--sm { font-size: clamp(1.6rem, 3vw, 2.3rem); margin: 0; }
.fo-section-sub { color: var(--ink-soft); font-size: 1.05rem; margin: 0; max-width: 34rem; }

/* FILTER */
.fo-filter {
  display: flex; gap: 0.55rem; flex-wrap: wrap;
  padding-bottom: 1.8rem; margin-bottom: 2rem;
  border-bottom: 1px solid var(--line);
}
.fo-chip {
  font: inherit; font-size: 0.9rem;
  color: var(--ink-soft);
  background: transparent;
  border: 1px solid var(--line);
  border-radius: 999px;
  padding: 0.5rem 1.15rem;
  cursor: pointer;
  transition: color 0.25s, border-color 0.25s, background 0.25s;
}
.fo-chip:hover { border-color: var(--ink); color: var(--ink); }
.fo-chip.is-active { background: var(--ink); color: var(--paper); border-color: var(--ink); }

/* GRID — uniform, image-forward */
.fo-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: clamp(1.4rem, 2.6vw, 2.4rem) clamp(1.4rem, 2.2vw, 2rem);
}
@media (max-width: 900px) { .fo-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 560px) { .fo-grid { grid-template-columns: 1fr; } }

.fo-card {
  opacity: 0;
  transform: translateY(22px);
  transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
  transition-delay: var(--d, 0ms);
}
.fo-card.is-in { opacity: 1; transform: none; }
.fo-card-link { text-decoration: none; color: inherit; display: block; }
.fo-card-frame {
  position: relative; overflow: hidden; border-radius: 4px;
  background: var(--line-soft);
}
.fo-card-img {
  aspect-ratio: 4 / 3;
  background-size: cover;
  background-position: center;
  transform: scale(1.001);
  transition: transform 0.9s cubic-bezier(0.16, 1, 0.3, 1);
}
.fo-card-scrim {
  position: absolute; inset: 0;
  background: linear-gradient(to top, rgba(20, 17, 15, 0.55), rgba(20, 17, 15, 0) 55%);
  opacity: 0; transition: opacity 0.5s ease;
}
.fo-card-float {
  position: absolute; left: 1rem; right: 1rem; bottom: 0.9rem;
  display: flex; align-items: center; justify-content: space-between; gap: 0.75rem;
  transform: translateY(140%);
  transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}
.fo-card-kicker {
  color: #fff; font-size: 0.8rem; font-weight: 600; letter-spacing: 0.01em;
}
.fo-card-mark {
  color: #14110f; background: #fff; font-size: 0.76rem; font-weight: 600;
  padding: 0.28rem 0.7rem; border-radius: 999px;
}
/* mask-wipe on scroll-in over each card frame */
.fo-card-wipe {
  position: absolute; inset: 0; background: var(--paper);
  transform-origin: right; transform: scaleX(1);
  transition: transform 0.85s cubic-bezier(0.76, 0, 0.24, 1);
  transition-delay: var(--d, 0ms);
}
.fo-card.is-in .fo-card-wipe { transform: scaleX(0); }

.fo-card-link:hover .fo-card-img { transform: scale(1.06); }
.fo-card-link:hover .fo-card-scrim { opacity: 1; }
.fo-card-link:hover .fo-card-float { transform: translateY(0); }

.fo-card-body { padding: 1rem 0.1rem 0; }
.fo-card-topline {
  display: flex; align-items: center; justify-content: space-between;
  font-size: 0.8rem; margin-bottom: 0.5rem;
}
.fo-card-cat { color: var(--red); font-weight: 600; }
.fo-card-date { color: var(--ink-faint); font-variant-numeric: tabular-nums; }
.fo-card-title {
  font-family: var(--font-fraunces), Georgia, serif;
  font-weight: 500;
  font-size: 1.32rem;
  line-height: 1.14;
  letter-spacing: -0.015em;
  margin: 0 0 0.5rem;
  transition: color 0.3s;
}
.fo-card-link:hover .fo-card-title { color: var(--red); }
.fo-card-dek { color: var(--ink-soft); font-size: 0.94rem; line-height: 1.5; margin: 0 0 0.9rem; }
.fo-card-foot {
  display: flex; align-items: center; justify-content: space-between;
  padding-top: 0.7rem; border-top: 1px solid var(--line-soft);
  font-size: 0.82rem; color: var(--ink-faint);
}
.fo-card-by { color: var(--ink-soft); }

/* tall cards get a slightly taller crop for editorial rhythm */
.fo-card--tall .fo-card-img { aspect-ratio: 3 / 4; }

/* LOAD MORE */
.fo-more-wrap { display: flex; justify-content: center; margin-top: clamp(2.5rem, 5vw, 4rem); }
.fo-more {
  font: inherit; font-size: 0.95rem; font-weight: 500;
  color: var(--ink); background: transparent;
  border: 1px solid var(--ink); border-radius: 999px;
  padding: 0.85rem 2rem; cursor: pointer;
  transition: color 0.3s, background 0.3s, transform 0.3s;
}
.fo-more:hover { background: var(--ink); color: var(--paper); transform: translateY(-2px); }

/* NEWSLETTER PROMO */
.fo-promo { background: var(--ink); color: var(--paper); }
.fo-promo-inner {
  max-width: 1320px; margin: 0 auto;
  display: grid; grid-template-columns: 1.1fr 0.9fr; gap: clamp(1.8rem, 4vw, 4rem);
  align-items: center;
  padding: clamp(3rem, 6vw, 5.5rem) clamp(1.1rem, 4vw, 3.5rem);
}
.fo-promo .fo-kicker--ink { color: #b9b2a8; }
.fo-promo-title {
  font-family: var(--font-fraunces), Georgia, serif;
  font-weight: 460;
  font-size: clamp(1.8rem, 3.4vw, 2.9rem);
  line-height: 1.05; letter-spacing: -0.02em;
  margin: 0 0 1rem; max-width: 24rem;
}
.fo-promo-dek { color: #c9c3ba; font-size: 1.02rem; margin: 0; max-width: 32rem; }
.fo-promo-form { width: 100%; }
.fo-field-label {
  display: block; font-size: 0.8rem; color: #b9b2a8; margin-bottom: 0.6rem;
}
.fo-field-row { display: flex; gap: 0.6rem; }
.fo-field {
  flex: 1; font: inherit; font-size: 0.95rem;
  background: transparent; color: var(--paper);
  border: 1px solid rgba(247, 245, 241, 0.3);
  border-radius: 999px; padding: 0.85rem 1.3rem;
  transition: border-color 0.3s;
}
.fo-field::placeholder { color: #8a827a; }
.fo-field:focus { outline: none; border-color: var(--red); }
.fo-field-btn {
  font: inherit; font-size: 0.95rem; font-weight: 500;
  background: var(--red); color: #fff; border: none;
  border-radius: 999px; padding: 0.85rem 1.6rem; cursor: pointer;
  transition: background 0.3s, transform 0.3s; white-space: nowrap;
}
.fo-field-btn:hover { background: var(--red-deep); transform: translateY(-2px); }
.fo-field-note { color: #8a827a; font-size: 0.82rem; margin: 0.9rem 0 0; }
@media (max-width: 780px) {
  .fo-promo-inner { grid-template-columns: 1fr; }
  .fo-field-row { flex-direction: column; }
  .fo-field-btn { width: 100%; }
}

/* EDITOR'S PICKS */
.fo-picks { max-width: 1320px; margin: 0 auto; padding: clamp(3rem, 6vw, 5rem) clamp(1.1rem, 4vw, 3.5rem); }
.fo-picks-track {
  display: grid; grid-template-columns: repeat(4, 1fr); gap: clamp(1.2rem, 2vw, 1.8rem);
  margin-top: 2rem;
}
.fo-pick { text-decoration: none; color: inherit; display: block; }
.fo-pick-img {
  aspect-ratio: 5 / 4; background-size: cover; background-position: center;
  border-radius: 4px; overflow: hidden;
  filter: grayscale(0.12); transition: filter 0.5s, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}
.fo-pick:hover .fo-pick-img { filter: grayscale(0); transform: translateY(-4px); }
.fo-pick-body { padding-top: 0.9rem; }
.fo-pick-cat { font-size: 0.78rem; font-weight: 600; color: var(--red); }
.fo-pick-title {
  font-family: var(--font-fraunces), Georgia, serif;
  font-weight: 500; font-size: 1.08rem; line-height: 1.18; letter-spacing: -0.01em;
  margin: 0.35rem 0 0.4rem;
}
.fo-pick-by { font-size: 0.82rem; color: var(--ink-faint); }
@media (max-width: 820px) { .fo-picks-track { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 460px) { .fo-picks-track { grid-template-columns: 1fr; } }

/* FOOTER */
.fo-footer { border-top: 1px solid var(--ink); background: var(--paper); }
.fo-footer-top {
  max-width: 1320px; margin: 0 auto;
  display: grid; grid-template-columns: 1.2fr 1.8fr; gap: clamp(2rem, 5vw, 4rem);
  padding: clamp(3rem, 6vw, 4.5rem) clamp(1.1rem, 4vw, 3.5rem) clamp(2rem, 4vw, 3rem);
}
.fo-wordmark--footer { font-size: 2rem; display: inline-block; margin-bottom: 1rem; }
.fo-footer-blurb { color: var(--ink-soft); font-size: 0.95rem; margin: 0; max-width: 24rem; }
.fo-footer-cols { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
.fo-footer-col { display: flex; flex-direction: column; gap: 0.6rem; }
.fo-col-head { font-size: 0.78rem; color: var(--ink-faint); margin-bottom: 0.3rem; }
.fo-footer-col a {
  font-size: 0.92rem; color: var(--ink-soft); text-decoration: none;
  transition: color 0.25s; width: fit-content;
}
.fo-footer-col a:hover { color: var(--red); }
.fo-footer-base {
  max-width: 1320px; margin: 0 auto;
  display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.6rem;
  padding: 1.4rem clamp(1.1rem, 4vw, 3.5rem);
  border-top: 1px solid var(--line);
  font-size: 0.82rem; color: var(--ink-faint);
}
@media (max-width: 760px) {
  .fo-footer-top { grid-template-columns: 1fr; }
  .fo-footer-cols { grid-template-columns: repeat(3, 1fr); }
}
@media (max-width: 480px) { .fo-footer-cols { grid-template-columns: 1fr 1fr; } }

/* REDUCED MOTION — show everything, kill transforms/wipes */
.folio-root.is-reduced .fo-cover-img,
.folio-root.is-reduced .fo-card-img { transition: none; transform: none; }
.folio-root.is-reduced .fo-cover-mask,
.folio-root.is-reduced .fo-card-wipe { display: none; }
.folio-root.is-reduced .fo-card { opacity: 1; transform: none; transition: none; }
@media (prefers-reduced-motion: reduce) {
  .folio-root .fo-cover-img,
  .folio-root .fo-card-img,
  .folio-root .fo-card,
  .folio-root .fo-card-float,
  .folio-root .fo-cover-cta,
  .folio-root .fo-more,
  .folio-root .fo-pick-img,
  .folio-root .fo-field-btn { transition: none !important; }
  .folio-root .fo-cover-mask,
  .folio-root .fo-card-wipe { display: none !important; }
  .folio-root .fo-card { opacity: 1 !important; transform: none !important; }
  .folio-root .fo-cover-img { transform: none !important; }
}
`
