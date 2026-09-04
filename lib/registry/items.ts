import type { Author, RegistryItem } from "./schema"

export const AUTHORS: Record<string, Author> = {
  artbloom: {
    handle: "artbloom",
    name: "artbloom",
    org: true,
    bio: "The house library. Everything here is MIT and maintained.",
  },
}

/**
 * The seed catalog.
 *
 * `source` is a real path under `registry/` — the site reads it for both the
 * code panel and the JSON the CLI installs, so what a user sees is byte-for-byte
 * what they get. Adding an item means: drop the file in `registry/`, add an
 * entry here, add a demo in `components/demos.tsx`.
 */
export const ITEMS: RegistryItem[] = [
  // ── Animations ───────────────────────────────────────────────────────────
  {
    name: "text-shimmer",
    title: "Text Shimmer",
    kind: "animations",
    description:
      "A light band that sweeps across text, clipped to the glyphs themselves so it inherits weight and tracking.",
    categories: ["text"],
    author: AUTHORS.artbloom,
    files: [
      { source: "animations/text-shimmer.tsx", target: "components/ui/text-shimmer.tsx", type: "registry:ui" },
      { source: "lib/utils.ts", target: "lib/utils.ts", type: "registry:lib" },
    ],
    dependencies: ["clsx@2.1.1", "motion@13.2.0", "tailwind-merge@3.6.0"],
    createdAt: "2026-07-14",
    installs: 0,
    bookmarks: 0,
    featured: true,
    previewHeight: 180,
  },
  {
    name: "number-ticker",
    title: "Number Ticker",
    kind: "animations",
    description:
      "Counts to a target when it scrolls into view. The spring writes straight to textContent, so React never re-renders mid-count.",
    categories: ["numbers", "text"],
    author: AUTHORS.artbloom,
    files: [
      { source: "animations/number-ticker.tsx", target: "components/ui/number-ticker.tsx", type: "registry:ui" },
      { source: "lib/utils.ts", target: "lib/utils.ts", type: "registry:lib" },
    ],
    dependencies: ["clsx@2.1.1", "motion@13.2.0", "tailwind-merge@3.6.0"],
    createdAt: "2026-07-16",
    installs: 0,
    bookmarks: 0,
    featured: true,
    previewHeight: 180,
  },
  {
    name: "marquee",
    title: "Marquee",
    kind: "animations",
    description:
      "Seamless infinite scroller, horizontal or vertical, with edge fades and pause-on-hover.",
    categories: ["marquees", "infinite"],
    author: AUTHORS.artbloom,
    files: [
      { source: "animations/marquee.tsx", target: "components/ui/marquee.tsx", type: "registry:ui" },
      { source: "lib/utils.ts", target: "lib/utils.ts", type: "registry:lib" },
    ],
    dependencies: ["clsx@2.1.1", "tailwind-merge@3.6.0"],
    css: "@keyframes marquee-x{from{transform:translateX(0)}to{transform:translateX(calc(-100% - var(--marquee-gap,3rem)))}}@keyframes marquee-y{from{transform:translateY(0)}to{transform:translateY(calc(-100% - var(--marquee-gap,3rem)))}}",
    createdAt: "2026-07-25",
    installs: 0,
    bookmarks: 0,
    featured: true,
    previewHeight: 160,
  },
  {
    name: "chip-pile",
    title: "Chip Pile",
    kind: "animations",
    description:
      "A tag list where every chip is a rigid body as wide as its own label, solved by sequential impulses with real friction. Drag one out and the pile answers.",
    categories: ["draggable", "particles", "micro"],
    author: AUTHORS.artbloom,
    files: [
      { source: "animations/chip-pile.tsx", target: "components/ui/chip-pile.tsx", type: "registry:ui" },
      { source: "animations/chip-pile.css", target: "components/ui/chip-pile.css", type: "registry:file" },
      { source: "hooks/use-canvas-scene.ts", target: "hooks/use-canvas-scene.ts", type: "registry:hook" },
    ],
    createdAt: "2026-09-04",
    installs: 0,
    bookmarks: 0,
    featured: true,
    isNew: true,
    previewDark: true,
    // Matches `min-height: 27rem` in chip-pile.css. This number is not decorative:
    // card previews scale the demo down from it, so understating it crops the pile.
    previewHeight: 432,
  },
  {
    name: "liquid-nav",
    title: "Liquid Nav",
    kind: "animations",
    description:
      "A tab indicator that is fifteen masses on a spring chain, so it necks and catches up instead of easing. Drop-in for a real nav.",
    categories: ["micro", "springs", "morph"],
    author: AUTHORS.artbloom,
    files: [
      { source: "animations/liquid-nav.tsx", target: "components/ui/liquid-nav.tsx", type: "registry:ui" },
      { source: "animations/liquid-nav.css", target: "components/ui/liquid-nav.css", type: "registry:file" },
      { source: "hooks/use-canvas-scene.ts", target: "hooks/use-canvas-scene.ts", type: "registry:hook" },
    ],
    createdAt: "2026-09-04",
    installs: 0,
    bookmarks: 0,
    featured: true,
    isNew: true,
    previewDark: true,
    previewHeight: 320,
  },
  {
    name: "pull-cord",
    title: "Pull Cord",
    kind: "animations",
    description:
      "A switch you pull. Eighteen masses on inextensible links, and the click fires when the plunger runs out of travel — not when the angle looks right.",
    categories: ["micro", "draggable", "springs"],
    author: AUTHORS.artbloom,
    files: [
      { source: "animations/pull-cord.tsx", target: "components/ui/pull-cord.tsx", type: "registry:ui" },
      { source: "animations/pull-cord.css", target: "components/ui/pull-cord.css", type: "registry:file" },
      { source: "hooks/use-canvas-scene.ts", target: "hooks/use-canvas-scene.ts", type: "registry:hook" },
    ],
    createdAt: "2026-09-04",
    installs: 0,
    bookmarks: 0,
    isNew: true,
    previewDark: true,
    previewHeight: 360,
  },
  {
    name: "shadow-caster",
    title: "Shadow Caster",
    kind: "animations",
    description:
      "A feature grid lit by a source with real area, so every shadow has a penumbra that widens as it lengthens. The occluders are the live card rects.",
    categories: ["backgrounds", "three-d", "masks"],
    author: AUTHORS.artbloom,
    files: [
      { source: "animations/shadow-caster.tsx", target: "components/ui/shadow-caster.tsx", type: "registry:ui" },
      { source: "animations/shadow-caster.css", target: "components/ui/shadow-caster.css", type: "registry:file" },
      { source: "hooks/use-canvas-scene.ts", target: "hooks/use-canvas-scene.ts", type: "registry:hook" },
    ],
    createdAt: "2026-09-04",
    installs: 0,
    bookmarks: 0,
    featured: true,
    isNew: true,
    previewDark: true,
    // Matches `min-height: 30rem` in shadow-caster.css — the penumbra needs the
    // whole floor to fall across, and a shorter frame cut it off.
    previewHeight: 480,
  },
  {
    name: "slosh-gauge",
    title: "Slosh Gauge",
    kind: "animations",
    description:
      "A stat card whose liquid obeys the shallow-water equations, so it lands on the exact number with no easing and the wave crosses the tank at its own speed.",
    categories: ["numbers", "micro", "loaders"],
    author: AUTHORS.artbloom,
    files: [
      { source: "animations/slosh-gauge.tsx", target: "components/ui/slosh-gauge.tsx", type: "registry:ui" },
      { source: "animations/slosh-gauge.css", target: "components/ui/slosh-gauge.css", type: "registry:file" },
      { source: "hooks/use-canvas-scene.ts", target: "hooks/use-canvas-scene.ts", type: "registry:hook" },
    ],
    createdAt: "2026-09-04",
    installs: 0,
    bookmarks: 0,
    isNew: true,
    previewDark: true,
    previewHeight: 360,
  },
  {
    name: "pressure-button",
    title: "Pressure Button",
    kind: "animations",
    description:
      "A button whose face is a pressure vessel. Holding it compresses the gas inside, the shell deforms under the real load, and letting go vents it — so the press has weight instead of a scale transform.",
    categories: ["micro", "springs"],
    author: AUTHORS.artbloom,
    files: [
      { source: "animations/pressure-button.tsx", target: "components/ui/pressure-button.tsx", type: "registry:ui" },
      { source: "animations/pressure-button.css", target: "components/ui/pressure-button.css", type: "registry:file" },
      { source: "hooks/use-canvas-scene.ts", target: "hooks/use-canvas-scene.ts", type: "registry:hook" },
    ],
    createdAt: "2026-09-04",
    installs: 0,
    bookmarks: 0,
    isNew: true,
    previewDark: true,
    previewHeight: 320,
  },
  {
    name: "balance-progress",
    title: "Cart-Pole Progress",
    kind: "animations",
    description:
      "A progress bar with an inverted pendulum riding it. The controller drives away from the fall before it drives toward the target, so the bar leans into its own travel and settles with no easing curve.",
    categories: ["loaders", "micro"],
    author: AUTHORS.artbloom,
    files: [
      { source: "animations/balance-progress.tsx", target: "components/ui/balance-progress.tsx", type: "registry:ui" },
      { source: "animations/balance-progress.css", target: "components/ui/balance-progress.css", type: "registry:file" },
      { source: "hooks/use-canvas-scene.ts", target: "hooks/use-canvas-scene.ts", type: "registry:hook" },
    ],
    createdAt: "2026-09-04",
    installs: 0,
    bookmarks: 0,
    isNew: true,
    previewDark: true,
    previewHeight: 320,
  },
  {
    name: "heat-grid",
    title: "Heat Grid",
    kind: "animations",
    description:
      "A contribution calendar where activity is heat and the heat obeys the diffusion equation, so a busy week bleeds into the days beside it and cools back to ambient on its own.",
    categories: ["stagger", "micro"],
    author: AUTHORS.artbloom,
    files: [
      { source: "animations/heat-grid.tsx", target: "components/ui/heat-grid.tsx", type: "registry:ui" },
      { source: "animations/heat-grid.css", target: "components/ui/heat-grid.css", type: "registry:file" },
      { source: "hooks/use-canvas-scene.ts", target: "hooks/use-canvas-scene.ts", type: "registry:hook" },
    ],
    createdAt: "2026-09-04",
    installs: 0,
    bookmarks: 0,
    isNew: true,
    previewDark: true,
    previewHeight: 320,
  },
  {
    name: "flock-search",
    title: "Flock Search",
    kind: "animations",
    description:
      "An empty state that is not empty. Reynolds boids fill the space behind the message, split around the pointer as it passes and close back up behind it — separation, alignment and cohesion, no path to follow.",
    categories: ["particles", "backgrounds"],
    author: AUTHORS.artbloom,
    files: [
      { source: "animations/flock-search.tsx", target: "components/ui/flock-search.tsx", type: "registry:ui" },
      { source: "animations/flock-search.css", target: "components/ui/flock-search.css", type: "registry:file" },
      { source: "hooks/use-canvas-scene.ts", target: "hooks/use-canvas-scene.ts", type: "registry:hook" },
    ],
    createdAt: "2026-09-04",
    installs: 0,
    bookmarks: 0,
    isNew: true,
    previewDark: true,
    previewHeight: 384,
  },
  {
    name: "morphogen-wordmark",
    title: "Morphogen Wordmark",
    kind: "animations",
    description:
      "A hero background grown out of the wordmark itself. Two reagents react and diffuse from the glyphs as the seed, and the front feeds outward into stripes — every load braids differently because nothing is keyframed.",
    categories: ["backgrounds", "morph", "noise"],
    author: AUTHORS.artbloom,
    files: [
      { source: "animations/morphogen-wordmark.tsx", target: "components/ui/morphogen-wordmark.tsx", type: "registry:ui" },
      { source: "animations/morphogen-wordmark.css", target: "components/ui/morphogen-wordmark.css", type: "registry:file" },
      { source: "hooks/use-canvas-scene.ts", target: "hooks/use-canvas-scene.ts", type: "registry:hook" },
    ],
    createdAt: "2026-09-04",
    installs: 0,
    bookmarks: 0,
    isNew: true,
    previewDark: true,
    previewHeight: 448,
  },
  {
    name: "euler-disk-spinner",
    title: "Euler Disk Spinner",
    kind: "animations",
    description:
      "A loading state that spends energy instead of looping. The coin's tilt carries the remaining work and its rattle rises as the disk lies down, the way a real Euler disk finishes — audibly close before it stops.",
    categories: ["loaders", "three-d"],
    author: AUTHORS.artbloom,
    files: [
      { source: "animations/euler-disk-spinner.tsx", target: "components/ui/euler-disk-spinner.tsx", type: "registry:ui" },
      { source: "animations/euler-disk-spinner.css", target: "components/ui/euler-disk-spinner.css", type: "registry:file" },
      { source: "hooks/use-canvas-scene.ts", target: "hooks/use-canvas-scene.ts", type: "registry:hook" },
    ],
    createdAt: "2026-09-04",
    installs: 0,
    bookmarks: 0,
    isNew: true,
    previewDark: true,
    previewHeight: 320,
  },

  // ── Templates ────────────────────────────────────────────────────────────
  {
    name: "cinematic-supercar",
    title: "Cinematic Supercar",
    kind: "templates",
    description:
      "A scroll-driven WebGL product story — assembly, ignition, road, braking, showroom — with a real 12MB car model, V12 audio, and film grain. Ships every byte it needs.",
    categories: ["landing", "agency"],
    author: AUTHORS.artbloom,
    files: [
      {
        source: "templates/cinematic-supercar/page.tsx",
        target: "app/cinematic-supercar/page.tsx",
        type: "registry:page",
      },
      {
        source: "templates/cinematic-supercar/cinematic-supercar.css",
        target: "app/cinematic-supercar/cinematic-supercar.css",
        type: "registry:style",
      },
      {
        // 2961 lines: the whole experience, styles and scene code included. It is a
        // document rather than a component on purpose — see the note in page.tsx.
        source: "templates/cinematic-supercar/experience.html",
        target: "public/cinematic-supercar/experience.html",
        type: "registry:file",
      },
      // The model, the photograph and the engine recordings are third-party work
      // under licences that require attribution to travel with them, so these are
      // files rather than a line in a README: an install cannot leave them behind.
      {
        source: "templates/cinematic-supercar/assets/models/aventador/LICENSE.txt",
        target: "public/cinematic-supercar/models/aventador/LICENSE.txt",
        type: "registry:file",
      },
      {
        source: "templates/cinematic-supercar/assets/images/LICENSES.md",
        target: "public/cinematic-supercar/images/LICENSES.md",
        type: "registry:file",
      },
      {
        source: "templates/cinematic-supercar/assets/audio/LICENSES.md",
        target: "public/cinematic-supercar/audio/LICENSES.md",
        type: "registry:file",
      },
    ],
    // 15MB of bytes that cannot be inlined as text. `aventador.bin` alone is 11.8MB.
    // The .gltf names its buffer and its six textures by bare filename, so they have
    // to land in the same directory it does.
    assets: [
      { source: "templates/cinematic-supercar/assets/models/aventador/aventador.gltf", target: "public/cinematic-supercar/models/aventador/aventador.gltf" },
      { source: "templates/cinematic-supercar/assets/models/aventador/aventador.bin", target: "public/cinematic-supercar/models/aventador/aventador.bin" },
      { source: "templates/cinematic-supercar/assets/models/aventador/AventadorAtlas_Albedo.png", target: "public/cinematic-supercar/models/aventador/AventadorAtlas_Albedo.png" },
      { source: "templates/cinematic-supercar/assets/models/aventador/AventadorAtlas_Normal.png", target: "public/cinematic-supercar/models/aventador/AventadorAtlas_Normal.png" },
      { source: "templates/cinematic-supercar/assets/models/aventador/LR_Brake_Albedo.png", target: "public/cinematic-supercar/models/aventador/LR_Brake_Albedo.png" },
      { source: "templates/cinematic-supercar/assets/models/aventador/LR_Generic_Normal.png", target: "public/cinematic-supercar/models/aventador/LR_Generic_Normal.png" },
      { source: "templates/cinematic-supercar/assets/models/aventador/LR_Reverse_Albedo.png", target: "public/cinematic-supercar/models/aventador/LR_Reverse_Albedo.png" },
      { source: "templates/cinematic-supercar/assets/models/aventador/LR_Turn_Albedo.png", target: "public/cinematic-supercar/models/aventador/LR_Turn_Albedo.png" },
      { source: "templates/cinematic-supercar/assets/audio/lamborghini-v12-engine.mp3", target: "public/cinematic-supercar/audio/lamborghini-v12-engine.mp3" },
      { source: "templates/cinematic-supercar/assets/audio/aventador-svj-ignition-exhaust.mp3", target: "public/cinematic-supercar/audio/aventador-svj-ignition-exhaust.mp3" },
      { source: "templates/cinematic-supercar/assets/images/aventador-svj.webp", target: "public/cinematic-supercar/images/aventador-svj.webp" },
    ],
    createdAt: "2026-09-03",
    installs: 0,
    bookmarks: 0,
    featured: true,
    isNew: true,
    previewDark: true,
    previewHeight: 420,
  },
  {
    name: "paper-portfolio",
    title: "Paper Portfolio",
    kind: "templates",
    description:
      "A seven-page torn-paper portfolio: hero collage, case studies, a printable capabilities page and a draggable sketchbook. Ships the six original PNGs — the hero collage and five logo marks — with the rest of the artwork drawn in SVG.",
    categories: ["portfolio", "personal", "resume"],
    author: AUTHORS.artbloom,
    // A whole site, not a page. Everything lands under one folder so it cannot
    // collide with the consumer's own routes; `BASE` in data/projects.ts is the
    // single string to change if they want it somewhere else.
    files: [
      {
        source: "templates/paper-portfolio/layout.tsx",
        target: "app/paper-portfolio/layout.tsx",
        type: "registry:page",
      },
      {
        source: "templates/paper-portfolio/paper-portfolio.css",
        target: "app/paper-portfolio/paper-portfolio.css",
        type: "registry:style",
      },
      {
        source: "templates/paper-portfolio/page.tsx",
        target: "app/paper-portfolio/page.tsx",
        type: "registry:page",
      },
      {
        source: "templates/paper-portfolio/work/page.tsx",
        target: "app/paper-portfolio/work/page.tsx",
        type: "registry:page",
      },
      {
        source: "templates/paper-portfolio/about/page.tsx",
        target: "app/paper-portfolio/about/page.tsx",
        type: "registry:page",
      },
      {
        source: "templates/paper-portfolio/projects/page.tsx",
        target: "app/paper-portfolio/projects/page.tsx",
        type: "registry:page",
      },
      {
        source: "templates/paper-portfolio/projects/[slug]/page.tsx",
        target: "app/paper-portfolio/projects/[slug]/page.tsx",
        type: "registry:page",
      },
      {
        source: "templates/paper-portfolio/contact/page.tsx",
        target: "app/paper-portfolio/contact/page.tsx",
        type: "registry:page",
      },
      {
        source: "templates/paper-portfolio/resume/page.tsx",
        target: "app/paper-portfolio/resume/page.tsx",
        type: "registry:page",
      },
      {
        source: "templates/paper-portfolio/sketchbook/page.tsx",
        target: "app/paper-portfolio/sketchbook/page.tsx",
        type: "registry:page",
      },
      {
        source: "templates/paper-portfolio/data/projects.ts",
        target: "app/paper-portfolio/data/projects.ts",
        type: "registry:lib",
      },
      {
        source: "templates/paper-portfolio/components/site-header.tsx",
        target: "app/paper-portfolio/components/site-header.tsx",
        type: "registry:component",
      },
      {
        source: "templates/paper-portfolio/components/site-footer.tsx",
        target: "app/paper-portfolio/components/site-footer.tsx",
        type: "registry:component",
      },
      {
        source: "templates/paper-portfolio/components/page-intro.tsx",
        target: "app/paper-portfolio/components/page-intro.tsx",
        type: "registry:component",
      },
      {
        source: "templates/paper-portfolio/components/project-card.tsx",
        target: "app/paper-portfolio/components/project-card.tsx",
        type: "registry:component",
      },
      {
        source: "templates/paper-portfolio/components/hero-motion.tsx",
        target: "app/paper-portfolio/components/hero-motion.tsx",
        type: "registry:component",
      },
      {
        source: "templates/paper-portfolio/components/sketch-board.tsx",
        target: "app/paper-portfolio/components/sketch-board.tsx",
        type: "registry:component",
      },
      {
        source: "templates/paper-portfolio/components/contact-form.tsx",
        target: "app/paper-portfolio/components/contact-form.tsx",
        type: "registry:component",
      },
      {
        source: "templates/paper-portfolio/components/print-button.tsx",
        target: "app/paper-portfolio/components/print-button.tsx",
        type: "registry:component",
      },
      {
        // The SVG marks that are still drawn in code. The six bitmaps this design
        // ships are real files again — they travel in `assets` below.
        source: "templates/paper-portfolio/components/doodles.tsx",
        target: "app/paper-portfolio/components/doodles.tsx",
        type: "registry:component",
      },
    ],
    // The hero collage and five logo marks. A PNG cannot be inlined as text in the
    // payload, so these are streamed as bytes into `public/`, which is what makes
    // the `/paper-portfolio/<file>` URLs in the pages resolve.
    assets: [
      { source: "templates/paper-portfolio/assets/hero-collage.png", target: "public/paper-portfolio/hero-collage.png" },
      { source: "templates/paper-portfolio/assets/artbloom.png", target: "public/paper-portfolio/artbloom.png" },
      { source: "templates/paper-portfolio/assets/bloom-chat.png", target: "public/paper-portfolio/bloom-chat.png" },
      { source: "templates/paper-portfolio/assets/browser.png", target: "public/paper-portfolio/browser.png" },
      { source: "templates/paper-portfolio/assets/pandu.png", target: "public/paper-portfolio/pandu.png" },
      { source: "templates/paper-portfolio/assets/star.png", target: "public/paper-portfolio/star.png" },
    ],
    createdAt: "2026-09-03",
    installs: 0,
    bookmarks: 0,
    featured: true,
    isNew: true,
    previewHeight: 420,
  },
  {
    name: "monolith-launch",
    title: "Monolith Launch",
    kind: "templates",
    description:
      "A four-page product launch site built entirely from type — no images, no icons, no fonts to fetch and nothing to license. Display headline, a looping spec strip, four claims each backed by a number, the full specification table and a reservation form that admits it has no backend.",
    categories: ["landing", "agency"],
    author: AUTHORS.artbloom,
    // A whole site, not a page. Everything lands under one folder so it cannot
    // collide with the consumer's own routes; `BASE` in data/product.ts is the
    // single string to change if they want it somewhere else.
    files: [
      {
        source: "templates/monolith-launch/layout.tsx",
        target: "app/monolith-launch/layout.tsx",
        type: "registry:page",
      },
      {
        source: "templates/monolith-launch/monolith-launch.css",
        target: "app/monolith-launch/monolith-launch.css",
        type: "registry:style",
      },
      {
        source: "templates/monolith-launch/page.tsx",
        target: "app/monolith-launch/page.tsx",
        type: "registry:page",
      },
      {
        source: "templates/monolith-launch/story/page.tsx",
        target: "app/monolith-launch/story/page.tsx",
        type: "registry:page",
      },
      {
        source: "templates/monolith-launch/specs/page.tsx",
        target: "app/monolith-launch/specs/page.tsx",
        type: "registry:page",
      },
      {
        source: "templates/monolith-launch/reserve/page.tsx",
        target: "app/monolith-launch/reserve/page.tsx",
        type: "registry:page",
      },
      {
        // Every string on the site. Re-voicing it for another product is this
        // file and the palette at the top of the stylesheet, nothing else.
        source: "templates/monolith-launch/data/product.ts",
        target: "app/monolith-launch/data/product.ts",
        type: "registry:lib",
      },
      {
        source: "templates/monolith-launch/components/site-header.tsx",
        target: "app/monolith-launch/components/site-header.tsx",
        type: "registry:component",
      },
      {
        source: "templates/monolith-launch/components/site-footer.tsx",
        target: "app/monolith-launch/components/site-footer.tsx",
        type: "registry:component",
      },
      {
        source: "templates/monolith-launch/components/reveal.tsx",
        target: "app/monolith-launch/components/reveal.tsx",
        type: "registry:component",
      },
      {
        source: "templates/monolith-launch/components/ticker.tsx",
        target: "app/monolith-launch/components/ticker.tsx",
        type: "registry:component",
      },
      {
        source: "templates/monolith-launch/components/spec-table.tsx",
        target: "app/monolith-launch/components/spec-table.tsx",
        type: "registry:component",
      },
      {
        source: "templates/monolith-launch/components/reserve-form.tsx",
        target: "app/monolith-launch/components/reserve-form.tsx",
        type: "registry:component",
      },
    ],
    createdAt: "2026-09-04",
    installs: 0,
    bookmarks: 0,
    featured: true,
    isNew: true,
    previewDark: true,
    previewHeight: 420,
  },
]

