# Templates to add

A build list for the catalogue's template half. You build these; this file is the spec.

Written against the bar you set: **fully functional, with real images and assets.** Every
entry below therefore names its asset manifest as a hard requirement, not a nice-to-have. A
template that reaches the end of its build with an empty `assets/` folder has not met the bar
and should not be registered.

## Where the catalogue stands today

Three templates, and the category coverage is lopsided:

| Category    | Templates claiming it | Real asset bytes behind them |
| ----------- | --------------------- | ---------------------------- |
| `landing`   | cinematic-supercar, monolith-launch | 14.6 MB, 0 MB |
| `agency`    | cinematic-supercar, monolith-launch | 14.6 MB, 0 MB |
| `portfolio` | paper-portfolio       | 0.5 MB |
| `personal`  | paper-portfolio       | 0.5 MB |
| `resume`    | paper-portfolio       | 0.5 MB |
| `store`     | — (slug not declared) | — |

Three of the five declared categories rest on a single template. Someone browsing
`/community/templates/s/resume` sees one card. That is the gap this list closes first.

### The honest note on `monolith-launch`

It ships no assets by design — its own description says "no images, no icons, no fonts to
fetch and nothing to license," and its reserve form "admits it has no backend." As one
deliberately typographic entry that is a legitimate genre. As a pattern it is the thing you
objected to. So: keep it, do not build another like it, and treat its form as the reference
for what *not* to do — every form in the list below has a specified submit behaviour.

## Asset licensing — read before sourcing anything

This is the constraint that will hurt most if you get it wrong at scale, because template
assets are **redistributed**. An install streams the real bytes onto a stranger's disk, under
MIT, for them to use commercially. So an asset license has to permit redistribution by third
parties, not just your own use.

**Safe:** your own photography and renders (cleanest — this is what `paper-portfolio` does),
CC0 / public domain, the Unsplash License, the Pexels License, SIL OFL fonts (Google Fonts).

**Not safe, however "free" it looks:** anything worded "free for personal use," Freepik's free
tier (attribution + no-redistribution), most Dribbble/Behance mockup PSDs, Adobe Fonts
(licensed to you, not redistributable), and **third-party company logos** — those are
trademarks, and shipping an "integrations" or "trusted by" strip of real company marks is not
a copyright question you can solve with attribution. Draw neutral marks instead.

Every template gets an `assets/LICENSES.md` naming each file, its source URL, and its license.
`cinematic-supercar` already does this at two levels (`assets/images/LICENSES.md`,
`assets/audio/LICENSES.md`, plus the model's own `LICENSE.txt`) — copy that shape.

## Weight budget

Asset bytes do not inline into the payload; they stream one file at a time from
`/r/asset/...`, and the CLI verifies each against a promised byte count. `cinematic-supercar`
is 14.6 MB across 14 files, which is about the ceiling before an install feels slow.

- Target **under 8 MB** per template. Treat 15 MB as a hard stop.
- WebP or AVIF for photography, never PNG unless it needs transparency. Longest edge 2000px.
- For gallery-heavy designs ship **10–14 real images** and compose a denser grid by reusing
  them at different crops and sizes. Fourteen good photographs read as a real portfolio;
  sixty mediocre ones read as a stock dump and cost 20 MB.
- Audio and video: one hero file, capped. Prefer a poster image plus a short loop over a reel
  you have to ship in full.

## What a finished template has to land in

Five places, all in the same change. Miss one and the item is either uninstallable or invisible.

1. **`registry/templates/<name>/`** — the canonical source. Pages, components, `data/`, one
   stylesheet named `<name>.css`, and `assets/` with its `LICENSES.md`.
2. **`lib/registry/items.ts`** — the entry. `files[]` for everything inlined as text (each with
   a `source` and the `target` it lands on in the consumer's project), `assets[]` for bytes
   (targets under `public/<name>/`), `categories` from `lib/categories.ts`, `dependencies`
   pinned exactly, `previewHeight`, and a description that is true of the code.
3. **`app/(bare)/<name>/`** — the pages again, so the site previews the real thing rather than
   a screenshot. This is a genuine duplication hazard: the two copies drift. Build the
   registry copy first, then mirror it, and diff the two before you commit.
4. **`app/<name>/[...path]/route.ts`** — four lines wrapping `templatePublicSpace("<name>")`.
   This is what makes `/lens-photo/hero.webp` resolve on the site as well as after an install.
   A template with `assets[]` and no such route previews with every image broken.
5. **`lib/categories.ts`** — only if the template claims a slug that does not exist yet. The
   rule in that file's header is that a category and its first item arrive together.

Then: `npx tsc --noEmit -p tsconfig.json`, `npm run build`, and install it into a scratch app
from the local registry to confirm every file and asset actually lands.

---

# Tier 1 — build these first

Four templates that between them triple the thinnest categories and put real photography in
the catalogue.

## 1. `lens-photo` — Lens

**Categories:** `portfolio`, `personal` · **Weight:** ~6 MB

The photographer's site, and the strongest possible answer to "you don't use images." Its
entire reason to exist is the photographs; there is nowhere for a gradient to hide.

**Pages** — `/` (full-bleed hero, one image, no copy above the fold) · `/series` (index of
bodies of work) · `/series/[slug]` (one series, 8–20 frames, captions) · `/prints` (buyable
sizes with prices) · `/about` (portrait + bio + gear) · `/contact`

**Mechanism** — a real lightbox: click a frame, it expands to viewport-fit, arrow keys and
swipe move through the series, Escape closes, the URL updates so a frame is linkable, focus
returns to the thumbnail you came from. Plus EXIF strip (camera, lens, focal, shutter, ISO)
read from a `data/` file per frame.

**Assets** — 14 photographs minimum, 3 series' worth, WebP, 2000px longest edge, plus one
portrait. Your own shots if you have them; Unsplash otherwise, credited in `LICENSES.md`.

**Must work** — lightbox keyboard nav and deep links; print sizes with a real price table;
contact form that validates and posts to a route handler that returns success.

## 2. `studio-index` — Studio Index

**Categories:** `agency`, `portfolio` · **Weight:** ~5 MB

The design-studio site. `cinematic-supercar` and `monolith-launch` both claim `agency` while
actually being product launches — nothing in the catalogue is the studio itself.

**Pages** — `/` (work index, not a hero) · `/work/[slug]` (case study: problem, process,
outcome, 4–6 images) · `/services` · `/services/[slug]` (one discipline, deliverables, price
band) · `/studio` (team, real headshots) · `/journal` · `/journal/[slug]` · `/contact`

**Mechanism** — the index is the front page: a dense list of every project, and hovering a row
swaps a single large preview image beside it. No carousel, no scroll-jacking. On touch, the row
expands inline instead of hovering.

**Assets** — 12 project images across 4 case studies, 4 team headshots, one studio photograph.

**Must work** — journal posts from MDX or a typed `data/` file with real dates and reading
times; a project brief form with budget-range and timeline fields that validates and posts.

## 3. `single-column-cv` — Single Column

**Categories:** `resume`, `personal` · **Weight:** under 1 MB

The résumé that prints correctly. `paper-portfolio` has a `/resume` page, but a CV that is
genuinely print-exact is its own artefact and this category has exactly one card in it.

**Pages** — `/` (the CV) · `/print` (the same content, paged) · plus an optional
`/cv.pdf` route handler

**Mechanism** — real print CSS. `@page { size: A4; margin: 14mm }`, `break-inside: avoid` on
every entry block, no orphaned section headings, hyperlinks rendered as visible URLs in print,
web-only chrome hidden. It must survive Ctrl-P as a hiring manager will actually do it.

**Assets** — one portrait, one OFL typeface pair. Deliberately light; this is the one template
where a small manifest is correct, because the artefact is the typography.

**Must work** — print output verified against A4 *and* US Letter; a `vCard`/`.ics`-style
download or `mailto:` that is real; skills and history from one `data/cv.ts` so it is
genuinely editable.

## 4. `saas-product` — Saas Product

**Categories:** `landing` · **Weight:** ~4 MB

The marketing site every SaaS needs, and the most-requested template shape anywhere. Neither
existing `landing` entry has a pricing table or a changelog.

**Pages** — `/` · `/pricing` · `/changelog` · `/customers` · `/customers/[slug]` ·
`/docs` (a real two-level sidebar with 3–4 written pages) · `/login` (form only, no auth)

**Mechanism** — a pricing table with a monthly/annual toggle that recomputes every figure and
a per-seat stepper, all client-side and correct; feature comparison rows that collapse to
stacked cards under 768px rather than scrolling sideways.

**Assets** — 6 real product screenshots (build a plausible dashboard, screenshot it — do not
draw a fake browser chrome in CSS), 2 customer photographs. **No third-party company logos.**

**Must work** — pricing maths; changelog entries with real dates and version numbers from a
data file; a waitlist form posting to a route handler with duplicate-email handling.

---

# Tier 2 — depth

Five templates that give each category a second and third distinct shape rather than a
variation on the first.

## 5. `case-study-deep` — Case Study

**Categories:** `portfolio`, `personal`, `resume` · **Weight:** ~5 MB

The product designer's portfolio, built around long-form narrative instead of a grid. Different
archetype from `lens-photo`: reading, not looking.

**Pages** — `/` (three case studies, nothing else) · `/work/[slug]` (2000+ words with inline
figures, before/after, annotated screens) · `/about` · `/resume` · `/contact`

**Mechanism** — a scroll-linked table of contents that tracks the current section, plus
before/after image comparison with a real draggable divider (`touch-action: pan-y`, keyboard
arrows, ARIA slider role).

**Assets** — 10 interface screenshots across 3 studies, 2 whiteboard/process photographs,
one portrait.

**Must work** — the TOC highlighting on scroll; the comparison slider by mouse, touch, and
keyboard; `/resume` printing cleanly.

## 6. `writer-journal` — Journal

**Categories:** `personal`, `portfolio` · **Weight:** ~2 MB

The writing-first personal site. Nothing in the catalogue is a blog, and it is the most common
thing a person actually wants.

**Pages** — `/` (recent essays) · `/essays` (archive by year) · `/essays/[slug]` ·
`/reading` (books with covers and notes) · `/now` · `/about`

**Mechanism** — proper long-form typography: measure capped at ~68 characters, real hanging
punctuation, footnotes that expand inline on click and are still readable when printed, a
reading-progress indicator, and an RSS feed at `/rss.xml` that validates.

**Assets** — 8 book covers, one portrait, 3 essay header images. Light on purpose.

**Must work** — MDX pipeline with syntax-highlighted code blocks; the archive grouped by year
from real front-matter dates; a working RSS route; footnote links round-tripping.

## 7. `event-conference` — Conference

**Categories:** `landing`, `agency` · **Weight:** ~6 MB

The most *functional* template on the list — a schedule is real data with real filtering, which
is what separates a site from a brochure.

**Pages** — `/` · `/schedule` (multi-day, multi-track grid) · `/speakers` ·
`/speakers/[slug]` · `/venue` · `/tickets` · `/sponsors`

**Mechanism** — the schedule: filter by day and track, sessions laid out on a time axis, tracks
as columns on desktop collapsing to a single chronological list on mobile, "add to calendar"
producing a real `.ics` file, and the filter state in the URL so a filtered view is shareable.

**Assets** — 12 speaker headshots, 3 venue photographs, one hero. Headshots are the hard part —
use CC0 portrait sets and credit them.

**Must work** — filtering and its URL state; `.ics` generation; ticket tiers with a real
sold-out state; a registration form with tier selection that validates.

## 8. `motion-reel` — Reel

**Categories:** `portfolio`, `personal` · **Weight:** ~12 MB

Video-first, for filmmakers and motion designers. The only template in the list where the
primary asset is not an image, which is exactly why it belongs here.

**Pages** — `/` (reel, autoplaying muted, poster-first) · `/work` · `/work/[slug]` (one
piece, embedded video, stills, credits block) · `/about` · `/contact`

**Mechanism** — a video player that behaves: poster image until interaction, no layout shift on
load, `preload="none"` below the fold, real custom controls that are keyboard operable, captions
track, and a still-frame fallback when `prefers-reduced-motion` is set.

**Assets** — one 15–25 s reel (H.264 mp4 + WebM, 1080p, capped at ~8 MB), 3 short loops, 8
stills, 4 posters. This is the one template allowed past 8 MB; keep it under 15.

**Must work** — playback and custom controls including keyboard; posters preventing shift;
credits from a data file; reduced-motion path showing stills instead of autoplay.

## 9. `dev-shop` — Dev Shop

**Categories:** `agency`, `landing` · **Weight:** ~4 MB

The engineering consultancy — the counterpart to `studio-index`. Distinguished by having
careers, which no template in the catalogue has.

**Pages** — `/` · `/work/[slug]` (case studies led by metrics) · `/services` ·
`/process` · `/careers` · `/careers/[slug]` (a real job posting) · `/contact`

**Mechanism** — engagement models as an interactive comparison (retainer vs project vs
staff-aug) where picking one reshapes the enquiry form below it; case studies opening on a
measured outcome rather than a logo.

**Assets** — 8 project/architecture images, 5 team headshots, 2 office photographs.

**Must work** — job listings from a data file with department filtering; an application form
with a file input that validates type and size; the engagement picker driving the form.

---

# Tier 3 — breadth

Six templates that widen the catalogue once the core shapes exist. Same bar; lower urgency.

## 10. `restaurant-table` — Table

**Categories:** `landing`, `personal` · **Weight:** ~6 MB

Food photography is the most compelling image-led design brief there is, and this is a genre
almost no free template does well.

**Pages** — `/` · `/menu` (sections, prices, dietary marks) · `/reserve` · `/gallery` ·
`/find-us` (hours, address, static map image)

**Mechanism** — the menu as real data: sections, prices, allergen and dietary flags, a filter
for vegetarian/vegan/gluten-free that dims rather than removes items so the menu keeps its
shape, and a lunch/dinner switch.

**Assets** — 10 food photographs, 2 interior shots, one chef portrait, one static map image
(generate it, do not embed a live map — that needs an API key an installer will not have).

**Must work** — dietary filtering; a reservation form with date, time, party size, and real
validation (no past dates, party size caps, closed-day rejection).

## 11. `mobile-app-launch` — App Launch

**Categories:** `landing` · **Weight:** ~5 MB

**Pages** — `/` · `/features` · `/pricing` · `/support` · `/press` (a real press kit with
downloadable assets)

**Mechanism** — a scroll-driven feature story where the phone frame stays pinned and its screen
content changes as sections pass, implemented with `position: sticky` and no scroll hijacking —
the page must still scroll normally with a keyboard and honour `prefers-reduced-motion` by
falling back to stacked static screens.

**Assets** — 8 app screenshots (build a real screen and capture it), one device frame PNG with
transparency, 3 lifestyle photographs. Draw your own store badges — Apple's and Google's
official badges have trademark usage rules that forbid redistribution in a template.

**Must work** — sticky sequence and its reduced-motion fallback; press-kit downloads returning
real files; support page with searchable FAQ.

## 12. `dev-terminal` — Terminal

**Categories:** `personal`, `portfolio` · **Weight:** ~1 MB

The developer's personal site, navigated by keyboard. Structurally unlike everything else in the
catalogue, which is the argument for it.

**Pages** — `/` · `/projects` · `/projects/[slug]` · `/uses` · `/notes` · `/notes/[slug]`

**Mechanism** — a command palette as primary navigation (`Cmd/Ctrl-K`), fuzzy-matching pages,
projects and notes, fully operable by keyboard with correct focus trapping and restoration, and
a visible affordance so mouse users can find it. Must degrade to ordinary links with JS off.

**Assets** — one portrait, 6 project screenshots, an OFL mono typeface. Light by design.

**Must work** — the palette (open, filter, arrow, enter, escape, focus return); projects from a
data file with tech-stack tags; `/uses` as a real annotated list.

## 13. `grid-index` — Grid

**Categories:** `portfolio`, `agency` · **Weight:** ~5 MB

Swiss editorial. A dense typographic index where the grid itself is the design — the opposite
axis from `lens-photo`'s full-bleed imagery.

**Pages** — `/` (the index) · `/p/[slug]` · `/info` · `/index` (a genuine A–Z of every
project, client, and year, sortable by each)

**Mechanism** — a real baseline grid with everything aligned to it, and an index table sortable
by title, client, year, and discipline with the sort in the URL.

**Assets** — 12 project images, deliberately small and consistently cropped.

**Must work** — sorting and its URL state; a project detail page that keeps baseline alignment
at every breakpoint.

## 14. `course-cohort` — Cohort

**Categories:** `landing` · **Weight:** ~3 MB

**Pages** — `/` · `/curriculum` · `/instructor` · `/faq` · `/enroll`

**Mechanism** — the curriculum as an accordion of weeks with lessons, durations, and a running
total that updates as sections open; a cohort countdown computed from a real date in a data file
with a seats-remaining figure and a sold-out state.

**Assets** — one instructor portrait, 6 lesson/slide screenshots, 3 student photographs.

**Must work** — accordion (keyboard operable, correct ARIA); countdown and sold-out state;
enrolment form with payment-plan selection that validates.

## 15. `hire-me` — Hire Me

**Categories:** `resume`, `personal`, `landing` · **Weight:** ~2 MB

A résumé as a pitch rather than a document — the third distinct shape for `resume`.

**Pages** — `/` (the pitch) · `/experience` · `/proof` (work with measured outcomes) ·
`/availability`

**Mechanism** — an availability block driven by one date in a data file (available now /
from a date / not looking), which changes the CTA everywhere on the site; and a role-fit
selector where picking a target role reorders the experience list by relevance.

**Assets** — one portrait, 4 proof screenshots, 3 logo-free client marks you draw yourself.

**Must work** — the availability state propagating; role reordering; a print path; a real
`mailto:` or route-handler contact.

---

# Store — the two that unlock a category

`lib/categories.ts` has no `store` slug, on purpose: its header rule is that a category and its
first item arrive in the same change, because a declared-but-empty slug pre-renders a "coming
soon" dead end. Whichever of these two lands first also adds
`c("templates", "E-commerce", "store")` to `TEMPLATE_CATEGORIES`, in that same commit.

Commerce is also where "fully functional" needs a stated boundary. No template can ship a
payment processor. The line to hold: **everything up to payment is real** — catalogue, variants,
stock, cart, totals, tax and shipping estimates, all working client-side and surviving a
reload — and checkout is one clearly-labelled stub. `monolith-launch`'s form "admits it has no
backend"; that admission is fine, but it has to come *after* a real cart, not instead of one.

## 16. `tee-store` — Tee Store

**Categories:** `store`, `landing` · **Weight:** ~7 MB

The paused t-shirt store, resumed. Garment photography is unambiguous about whether a template
uses real assets.

**Pages** — `/` · `/shop` (grid with filters) · `/product/[slug]` · `/cart` ·
`/checkout` (stub) · `/size-guide` · `/care`

**Mechanism** — real variant selection: colour swatches that swap the product image, sizes with
per-variant stock so a sold-out size is disabled rather than hidden, quantity, add-to-cart with a
badge count, a cart persisted to `localStorage` that survives reload, and line totals plus a
shipping threshold ("£12 more for free shipping") that recomputes.

**Assets** — 6 garments × 3 colourways as front shots (18 images) is too many; ship **8 product
photographs** covering 3 garments plus 4 flat-lay/detail shots and 2 on-body shots, and let the
colour swap tint via CSS filter on the two colourways you did not photograph. Document that
honestly in `LICENSES.md`.

**Must work** — variants, stock, cart persistence, totals, filters with URL state, size guide as
a real measurement table.

## 17. `single-product` — One Thing

**Categories:** `store`, `landing` · **Weight:** ~6 MB

The DTC single-product page — a long scroll that is one product's whole argument. Different
archetype from `tee-store`: no catalogue, no filters, one decision.

**Pages** — `/` (the long page) · `/cart` · `/checkout` (stub) · `/faq` · `/shipping`

**Mechanism** — a sticky buy bar that appears once the hero passes, an image sequence that
advances with scroll (reduced-motion falls back to a static gallery), a bundle selector
(1/2/3-pack) with per-unit pricing that recomputes savings, and a reviews block with a real
rating distribution bar chart from data.

**Assets** — 10 product photographs including 4 that form a rotation sequence, 2 lifestyle
shots, one packaging shot.

**Must work** — bundle maths; sticky bar behaviour; cart persistence; reviews summarising their
own data rather than a hardcoded average.

---

# Categories this list does not add

Two shapes are worth building eventually but need a new slug, and I would not declare either
until you are actually building it:

- **`docs`** — a documentation template (sidebar, versioning, search, MDX). Genuinely useful, but
  it is a different product from a website template and would sit oddly beside portfolios.
  `saas-product` includes a small `/docs` section, which is probably enough for now.
- **`blog`** — unnecessary. `writer-journal` claims `personal`, which is the honest home for it.

# Suggested build order

`lens-photo` → `single-column-cv` → `studio-index` → `saas-product` → `tee-store`.

That sequence gets a real-photography template into the catalogue first, gives `resume` a second
card for almost no asset cost, then adds the two most-searched shapes, and unlocks `store` fifth.
Everything after that is breadth and can go in any order.

# Per-template done checklist

- [ ] Every page renders at 360px, 768px, and 1440px with no horizontal scroll
- [ ] `assets/LICENSES.md` names every file, its source, and a license that permits redistribution
- [ ] No lorem, no placeholder copy, no dead buttons, no `href="#"`
- [ ] Every form validates and has a real submit path (route handler or `mailto:`), and says
      plainly what it does with the input
- [ ] Every interactive mechanism is keyboard operable, with visible focus
- [ ] `prefers-reduced-motion` honoured wherever anything moves
- [ ] Real `<title>` and description per page; images have meaningful `alt`
- [ ] Content lives in `data/`, so an installer can edit the site without touching JSX
- [ ] `registry/templates/<name>/` and `app/(bare)/<name>/` diffed and in sync
- [ ] `[...path]/route.ts` present if the template ships assets, and every asset URL resolves
- [ ] Installed into a scratch app from the local registry; every file and asset landed
- [ ] `npx tsc --noEmit -p tsconfig.json` and `npm run build` both clean

