#!/usr/bin/env node
/**
 * Scaffold a new animation piece for contributors.
 *
 *   npm run new-piece -- pendulum-progress --handle your-github-handle
 *
 * Writes `registry/animations/<name>.tsx`: a working, physically simulated
 * starter (a damped pendulum, integrated at a fixed step) built on the shared
 * `use-canvas-scene` hook, with a reduced-motion still already wired. Then it
 * prints the two registrations to paste by hand — the manifest entry in
 * `lib/registry/items.ts` and the demo lines in `components/demos.tsx`. Those
 * files are hand-ordered and commented, so the script shows the snippet rather
 * than rewriting them.
 */
import { existsSync, writeFileSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const args = process.argv.slice(2)

const name = args.find((arg) => !arg.startsWith("--"))
const handleIndex = args.indexOf("--handle")
const handle = handleIndex >= 0 ? args[handleIndex + 1] : undefined

function fail(message) {
  console.error(`new-piece: ${message}`)
  process.exit(1)
}

if (!name) fail("give the piece a name, e.g. `npm run new-piece -- pendulum-progress --handle you`")
if (!/^[a-z][a-z0-9]*(-[a-z0-9]+)*$/.test(name)) {
  fail(`"${name}" must be kebab-case: lowercase letters and digits joined by single hyphens`)
}
if (handle !== undefined && !/^[A-Za-z0-9](?:[A-Za-z0-9-]{0,38})$/.test(handle)) {
  fail(`"${handle}" is not a valid GitHub handle`)
}

const file = path.join(root, "registry", "animations", `${name}.tsx`)
if (existsSync(file)) fail(`registry/animations/${name}.tsx already exists — pick another name`)

const pascal = name
  .split("-")
  .map((part) => part[0].toUpperCase() + part.slice(1))
  .join("")
const title = name
  .split("-")
  .map((part) => part[0].toUpperCase() + part.slice(1))
  .join(" ")
const by = handle ? `@${handle}` : "@your-handle"

const source = `"use client"

// ${title} by ${by}, MIT, ui.artbloom

import { useCanvasScene, useReducedMotion } from "../hooks/use-canvas-scene"

/**
 * ${title}.
 *
 * Starter scene: a damped pendulum, integrated with semi-implicit Euler at a
 * fixed step so the motion is the same at any frame rate. Replace the physics
 * with your own — the rules are in CONTRIBUTING.md: a real simulation (mass,
 * springs, contacts, fluid), not an easing curve.
 *
 * Under prefers-reduced-motion the scene paints one settled frame and stops.
 */

export type ${pascal}Props = { compact?: boolean; className?: string }

/** Seconds per physics step. */
const STEP = 1 / 120
/** Gravity over length, 1/s². Sets the period: T ≈ 2π/√(G_OVER_L). */
const G_OVER_L = 18
/** Fraction of angular velocity lost per second. */
const DAMPING = 0.35

type State = {
  angle: number
  spin: number
  carry: number
  /** Timestamp of the last painted frame, ms. 0 before the first. */
  last: number
}

function setup(): State {
  return { angle: 1.1, spin: 0, carry: 0, last: 0 }
}

function advance(state: State, dt: number) {
  state.carry += Math.min(dt, 0.05)
  while (state.carry >= STEP) {
    state.spin += -G_OVER_L * Math.sin(state.angle) * STEP
    state.spin *= 1 - DAMPING * STEP
    state.angle += state.spin * STEP
    state.carry -= STEP
  }
}

function draw(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  state: State,
  reduced: boolean,
) {
  // Reduced motion: show the pendulum at rest instead of mid-swing.
  const angle = reduced ? 0 : state.angle
  const pivotX = width / 2
  const pivotY = height * 0.18
  const length = Math.min(width, height) * 0.55
  const bobX = pivotX + Math.sin(angle) * length
  const bobY = pivotY + Math.cos(angle) * length

  context.clearRect(0, 0, width, height)
  context.strokeStyle = "rgba(148, 163, 184, 0.9)"
  context.lineWidth = 2
  context.beginPath()
  context.moveTo(pivotX, pivotY)
  context.lineTo(bobX, bobY)
  context.stroke()

  context.fillStyle = "rgb(226, 232, 240)"
  context.beginPath()
  context.arc(bobX, bobY, Math.max(8, length * 0.08), 0, Math.PI * 2)
  context.fill()
}

export function ${pascal}({ compact = false, className }: ${pascal}Props) {
  const reduced = useReducedMotion()

  const { stageRef, canvasRef } = useCanvasScene<State>({
    setup,
    draw: ({ context, width, height, state }) => {
      // Real elapsed time, so the swing keeps its period on 30, 60 or 120 Hz screens.
      const now = performance.now()
      if (!reduced && state.last) advance(state, (now - state.last) / 1000)
      state.last = now
      draw(context, width, height, state, reduced)
    },
  })

  return (
    <div
      ref={stageRef}
      className={\`relative block size-full overflow-hidden \${className ?? ""}\`.trim()}
      style={{ touchAction: "pan-y", minHeight: compact ? 160 : 280 }}
      role="img"
      aria-label="${title}: describe what the scene shows for screen readers"
    >
      <canvas ref={canvasRef} className="block size-full" />
    </div>
  )
}
`

writeFileSync(file, source)

const authorKey = handle ? handle.replace(/-/g, "_") : "your_handle"
const today = new Date().toISOString().slice(0, 10)

console.log(`Created registry/animations/${name}.tsx

Next, register it by hand (both files are hand-ordered):

1. lib/registry/items.ts — add yourself to AUTHORS once:

  ${authorKey}: {
    handle: "${handle ?? "your-handle"}",
    name: "Your Name",
    avatar: "https://github.com/${handle ?? "your-handle"}.png",
  },

   then add the item to ITEMS:

  {
    name: "${name}",
    title: "${title}",
    kind: "animations",
    description: "One sentence: what it is and what physics drives it.",
    categories: ["micro"],
    author: AUTHORS.${authorKey},
    files: [
      { source: "animations/${name}.tsx", target: "components/ui/${name}.tsx", type: "registry:ui" },
      { source: "hooks/use-canvas-scene.ts", target: "hooks/use-canvas-scene.ts", type: "registry:hook" },
    ],
    createdAt: "${today}",
    isNew: true,
    previewHeight: 280,
  },

2. components/demos.tsx — import it and add it to both demo maps:

  import { ${pascal} } from "@/registry/animations/${name}"
  "${name}": <${pascal} />,          // full-size map
  "${name}": <${pascal} compact />,  // compact map

3. npm run dev, open /artbloom/animations/${name}, then npm run typecheck && npm run build.
`)
