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
 * entry here, add a demo in `components/demos/`.
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
    name: "aurora-thread-loom",
    title: "Aurora Thread Loom",
    kind: "animations",
    description:
      "Forty-eight gradient threads waving out of phase and hue-rotating as they cross. One keyframe, indexed per thread by a custom property.",
    categories: ["gradients", "backgrounds", "infinite"],
    author: AUTHORS.artbloom,
    files: [
      { source: "animations/aurora-thread-loom.tsx", target: "components/ui/aurora-thread-loom.tsx", type: "registry:ui" },
      { source: "animations/aurora-thread-loom.css", target: "components/ui/aurora-thread-loom.css", type: "registry:file" },
    ],
    createdAt: "2026-09-03",
    installs: 0,
    bookmarks: 0,
    featured: true,
    isNew: true,
    previewDark: true,
    previewHeight: 320,
  },
  {
    name: "bubble-burst",
    title: "Bubble Burst",
    kind: "animations",
    description:
      "Four bubbles rise, pop, and spray eight drops each on a shared clock. A liquid loader with no JS timer.",
    categories: ["loaders", "infinite", "backgrounds"],
    author: AUTHORS.artbloom,
    files: [
      { source: "animations/bubble-burst.tsx", target: "components/ui/bubble-burst.tsx", type: "registry:ui" },
      { source: "animations/bubble-burst.css", target: "components/ui/bubble-burst.css", type: "registry:file" },
    ],
    createdAt: "2026-09-03",
    installs: 0,
    bookmarks: 0,
    isNew: true,
    previewDark: true,
    previewHeight: 320,
  },
  {
    name: "curtain-sequence",
    title: "Curtain Sequence",
    kind: "animations",
    description:
      "Six coloured panels sweep in, hinge from the far edge, and leave — the title resolves mid-pass. Press to run.",
    categories: ["transitions", "three-d", "micro"],
    author: AUTHORS.artbloom,
    files: [
      { source: "animations/curtain-sequence.tsx", target: "components/ui/curtain-sequence.tsx", type: "registry:ui" },
      { source: "animations/curtain-sequence.css", target: "components/ui/curtain-sequence.css", type: "registry:file" },
    ],
    createdAt: "2026-09-03",
    installs: 0,
    bookmarks: 0,
    featured: true,
    isNew: true,
    previewDark: true,
    previewHeight: 320,
  },
  {
    name: "destructible-membrane",
    title: "Destructible Membrane",
    kind: "animations",
    description:
      "A canvas sheet you tear with the pointer. Springs hold the cloth, the rupture propagates to neighbouring cells, and the noise buffer is rebuilt on resize.",
    categories: ["draggable", "particles", "noise"],
    author: AUTHORS.artbloom,
    files: [
      { source: "animations/destructible-membrane.tsx", target: "components/ui/destructible-membrane.tsx", type: "registry:ui" },
      { source: "animations/destructible-membrane.css", target: "components/ui/destructible-membrane.css", type: "registry:file" },
      { source: "hooks/use-canvas-scene.ts", target: "hooks/use-canvas-scene.ts", type: "registry:hook" },
    ],
    createdAt: "2026-09-03",
    installs: 0,
    bookmarks: 0,
    featured: true,
    isNew: true,
    previewDark: true,
    previewHeight: 360,
  },
  {
    name: "domino-word",
    title: "Domino Word",
    kind: "animations",
    description:
      "Letter tiles fall into each other in sequence, each with a cast side and a real ground shadow. Any word, one tile per letter.",
    categories: ["text", "three-d", "stagger"],
    author: AUTHORS.artbloom,
    files: [
      { source: "animations/domino-word.tsx", target: "components/ui/domino-word.tsx", type: "registry:ui" },
      { source: "animations/domino-word.css", target: "components/ui/domino-word.css", type: "registry:file" },
    ],
    createdAt: "2026-09-03",
    installs: 0,
    bookmarks: 0,
    isNew: true,
    previewHeight: 320,
  },
  {
    name: "kinetic-kerning",
    title: "Kinetic Kerning",
    kind: "animations",
    description:
      "Letters slide out of true and settle back into precise spacing, one after another, with the caption arriving last.",
    categories: ["text", "stagger", "springs"],
    author: AUTHORS.artbloom,
    files: [
      { source: "animations/kinetic-kerning.tsx", target: "components/ui/kinetic-kerning.tsx", type: "registry:ui" },
      { source: "animations/kinetic-kerning.css", target: "components/ui/kinetic-kerning.css", type: "registry:file" },
    ],
    createdAt: "2026-09-03",
    installs: 0,
    bookmarks: 0,
    isNew: true,
    previewDark: true,
    previewHeight: 320,
  },
  {
    name: "kinetic-texture-mesh",
    title: "Kinetic Texture Mesh",
    kind: "animations",
    description:
      "Drag to pluck a grid of textured cells and release a wave through the mesh. Canvas, pointer capture, one animation frame loop.",
    categories: ["draggable", "three-d", "particles"],
    author: AUTHORS.artbloom,
    files: [
      { source: "animations/kinetic-texture-mesh.tsx", target: "components/ui/kinetic-texture-mesh.tsx", type: "registry:ui" },
      { source: "animations/kinetic-texture-mesh.css", target: "components/ui/kinetic-texture-mesh.css", type: "registry:file" },
      { source: "hooks/use-canvas-scene.ts", target: "hooks/use-canvas-scene.ts", type: "registry:hook" },
    ],
    createdAt: "2026-09-03",
    installs: 0,
    bookmarks: 0,
    featured: true,
    isNew: true,
    previewDark: true,
    previewHeight: 360,
  },
  {
    name: "lenticular-shift",
    title: "Lenticular Shift",
    kind: "animations",
    description:
      "Eighteen slats turn in place so two words trade positions, the way a lenticular print changes with the angle you hold it at.",
    categories: ["three-d", "text", "transitions"],
    author: AUTHORS.artbloom,
    files: [
      { source: "animations/lenticular-shift.tsx", target: "components/ui/lenticular-shift.tsx", type: "registry:ui" },
      { source: "animations/lenticular-shift.css", target: "components/ui/lenticular-shift.css", type: "registry:file" },
    ],
    createdAt: "2026-09-03",
    installs: 0,
    bookmarks: 0,
    isNew: true,
    previewHeight: 320,
  },
  {
    name: "mercury-droplet-choir",
    title: "Mercury Droplet Choir",
    kind: "animations",
    description:
      "Twenty-five chrome droplets breathe in and out of formation, deforming as they travel. Offsets are computed per cell from the centre of the grid.",
    categories: ["morph", "loaders", "infinite"],
    author: AUTHORS.artbloom,
    files: [
      { source: "animations/mercury-droplet-choir.tsx", target: "components/ui/mercury-droplet-choir.tsx", type: "registry:ui" },
      { source: "animations/mercury-droplet-choir.css", target: "components/ui/mercury-droplet-choir.css", type: "registry:file" },
    ],
    createdAt: "2026-09-03",
    installs: 0,
    bookmarks: 0,
    featured: true,
    isNew: true,
    previewDark: true,
    previewHeight: 320,
  },
  {
    name: "pulse-choir",
    title: "Pulse Choir",
    kind: "animations",
    description:
      "Thirty-two bars on one clock, each with a fixed peak, so the field reads as a single waveform rather than thirty-two loaders.",
    categories: ["loaders", "infinite", "stagger"],
    author: AUTHORS.artbloom,
    files: [
      { source: "animations/pulse-choir.tsx", target: "components/ui/pulse-choir.tsx", type: "registry:ui" },
      { source: "animations/pulse-choir.css", target: "components/ui/pulse-choir.css", type: "registry:file" },
    ],
    createdAt: "2026-09-03",
    installs: 0,
    bookmarks: 0,
    isNew: true,
    previewDark: true,
    previewHeight: 320,
  },
  {
    name: "rollback-orbit",
    title: "Rollback Orbit",
    kind: "animations",
    description:
      "A weighted ball rolls to its target and back, rocking the rail it runs on and settling the shadow underneath. Press to roll.",
    categories: ["micro", "springs", "loaders"],
    author: AUTHORS.artbloom,
    files: [
      { source: "animations/rollback-orbit.tsx", target: "components/ui/rollback-orbit.tsx", type: "registry:ui" },
      { source: "animations/rollback-orbit.css", target: "components/ui/rollback-orbit.css", type: "registry:file" },
    ],
    createdAt: "2026-09-03",
    installs: 0,
    bookmarks: 0,
    isNew: true,
    previewHeight: 320,
  },
  {
    name: "split-shutter",
    title: "Split Shutter",
    kind: "animations",
    description:
      "Nine shutters part to reveal a word, each slat carrying its own printed label so the mechanism stays visible.",
    categories: ["masks", "text", "transitions"],
    author: AUTHORS.artbloom,
    files: [
      { source: "animations/split-shutter.tsx", target: "components/ui/split-shutter.tsx", type: "registry:ui" },
      { source: "animations/split-shutter.css", target: "components/ui/split-shutter.css", type: "registry:file" },
    ],
    createdAt: "2026-09-03",
    installs: 0,
    bookmarks: 0,
    isNew: true,
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
]
