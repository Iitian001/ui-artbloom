"use client"

import { useCanvasScene, useReducedMotion } from "../hooks/use-canvas-scene"

/**
 * Ripple tank — two-source wave interference.
 *
 * A scalar height field is summed over two point sources at a fixed timestep:
 *
 *     h(p, t) = Σ_s  A/√(r_s + r0) · sin(k·r_s − ω·t)     k = 2π/λ, ω = 2π·f
 *
 * The per-cell distances r_s are fixed, so `setup` precomputes each source's
 * spatial phase (k·r_s) and amplitude envelope once; every frame then costs one
 * sin per source per cell. Time advances by a constant dt (no keyframes, no
 * easing) — the motion is the equation, integrated.
 *
 * The field is evaluated on a coarse buffer and bilinearly upscaled to the
 * stage, so a 60fps paint stays cheap regardless of canvas size. Under
 * prefers-reduced-motion a single frame is drawn: the analytic superposition
 * amplitude |A₁e^{ikr₁} + A₂e^{ikr₂}|, i.e. the standing hyperbolic fringes.
 */

export type RippleTankProps = { compact?: boolean; className?: string }

type Field = {
  cols: number
  rows: number
  buffer: HTMLCanvasElement
  bctx: CanvasRenderingContext2D
  image: ImageData
  /** k·r_s per cell, one array per source. */
  phase: Float32Array[]
  /** A/√(r_s + r0) per cell, one array per source. */
  amp: Float32Array[]
  /** Soft additive source glow per cell (summed over sources). */
  glow: Float32Array
  /** Static superposition amplitude per cell — the reduced-motion frame. */
  still: Float32Array
  /** ω·dt: the fixed phase advance per frame. */
  step: number
  /** 1 / peak instantaneous |h|, for the animated frame. */
  invNorm: number
  /** 1 / peak superposition amplitude, for the still frame. */
  invStill: number
}

/**
 * Precompute everything that does not move: the source geometry, and for every
 * cell of the coarse buffer the spatial phase k·r and amplitude A/√(r+r0) of
 * each source, plus the analytic standing-wave amplitude used for the reduced
 * frame. Re-run by the hook on every resize, so the grid is always sized to the
 * stage and never resized in place.
 */
function buildField(width: number, height: number, compact: boolean): Field {
  // Coarse cells: a wave is ~44px across, so ~6px cells resolve every crest
  // with margin while keeping the buffer small enough to sum at 60fps. Cap the
  // total cell count so a large stage scales the cell up instead of the cost.
  const target = compact ? 7 : 6
  const maxCells = compact ? 9000 : 22000
  let cell = target
  let cols = Math.max(2, Math.ceil(width / cell))
  let rows = Math.max(2, Math.ceil(height / cell))
  while (cols * rows > maxCells) {
    cell += 1
    cols = Math.max(2, Math.ceil(width / cell))
    rows = Math.max(2, Math.ceil(height / cell))
  }

  // Physical constants, in CSS pixels. λ sets fringe spacing; the source
  // separation is a few wavelengths so several hyperbolic nodes are in frame.
  const minSide = Math.min(width, height)
  const wavelength = Math.max(26, Math.min(52, minSide * 0.11))
  const k = (2 * Math.PI) / wavelength
  const r0 = wavelength * 0.5 // softening: caps amplitude at the singularity
  const envelope = Math.max(width, height) * 0.62 // gentle radial fade

  const sep = Math.min(width * 0.42, wavelength * 3.6)
  const cx = width / 2
  const cy = height / 2
  const sources = [
    { x: cx - sep / 2, y: cy },
    { x: cx + sep / 2, y: cy },
  ]
  const A = compact ? 0.86 : 1

  const count = cols * rows
  const phase = sources.map(() => new Float32Array(count))
  const amp = sources.map(() => new Float32Array(count))
  const glow = new Float32Array(count)
  const still = new Float32Array(count)

  let peakAmp = 0 // Σ|amp| — the largest instantaneous |h| any cell can reach
  let peakStill = 0

  for (let gy = 0; gy < rows; gy++) {
    // Sample at cell centres, mapped back into stage pixels.
    const py = ((gy + 0.5) / rows) * height
    for (let gx = 0; gx < cols; gx++) {
      const px = ((gx + 0.5) / cols) * width
      const i = gy * cols + gx

      let ampSum = 0
      let reCos = 0
      let reSin = 0
      let glowSum = 0
      for (let s = 0; s < sources.length; s++) {
        const dx = px - sources[s].x
        const dy = py - sources[s].y
        const r = Math.sqrt(dx * dx + dy * dy)
        const a = (A / Math.sqrt(r + r0)) * Math.exp(-r / envelope)
        const ph = k * r
        phase[s][i] = ph
        amp[s][i] = a
        ampSum += a
        // Phasor sum → standing amplitude |Σ a·e^{ikr}| for the still frame.
        reCos += a * Math.cos(ph)
        reSin += a * Math.sin(ph)
        glowSum += Math.exp(-r / (wavelength * 1.5))
      }
      glow[i] = glowSum
      const st = Math.sqrt(reCos * reCos + reSin * reSin)
      still[i] = st
      if (ampSum > peakAmp) peakAmp = ampSum
      if (st > peakStill) peakStill = st
    }
  }

  const buffer = document.createElement("canvas")
  buffer.width = cols
  buffer.height = rows
  const bctx = buffer.getContext("2d")
  if (!bctx) throw new Error("ripple-tank: 2D context unavailable")
  const image = bctx.createImageData(cols, rows)

  // ω·dt as one number. A period of ~52 frames reads as calm, deliberate water.
  const step = (2 * Math.PI) / 52

  return {
    cols,
    rows,
    buffer,
    bctx,
    image,
    phase,
    amp,
    glow,
    still,
    step,
    invNorm: peakAmp > 0 ? 1 / peakAmp : 1,
    invStill: peakStill > 0 ? 1 / peakStill : 1,
  }
}

export function RippleTank({ compact = false, className }: RippleTankProps) {
  const reduced = useReducedMotion()

  const { stageRef, canvasRef } = useCanvasScene<Field>({
    setup: ({ width, height }) => buildField(width, height, compact),
    draw: ({ context, width, height, state, frame }) =>
      drawField(context, width, height, state, frame, reduced, compact),
  })

  return (
    <div
      ref={stageRef}
      className={`relative block size-full overflow-hidden ${className ?? ""}`.trim()}
      style={{ touchAction: "pan-y", background: "rgb(8, 11, 28)" }}
      role="img"
      aria-label="Two-source wave interference on a ripple tank, cyan crests fanning into hyperbolic fringes"
    >
      <canvas ref={canvasRef} className="block size-full" />
    </div>
  )
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)))
  return t * t * (3 - 2 * t)
}

/**
 * Paint one frame. `frame·step` is the integrated time t; the field is the sum
 * of each source's precomputed envelope times sin(phase − t). The value is
 * mapped through a deep-indigo → cyan → white ramp, written to the coarse
 * buffer, then upscaled with bilinear smoothing to fill the stage.
 */
function drawField(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  field: Field,
  frame: number,
  reduced: boolean,
  compact: boolean,
) {
  const { cols, rows, phase, amp, glow, still, image, step, invNorm, invStill } = field
  const data = image.data
  const t = frame * step

  // Rest indigo, and the deltas a crest/trough push it by. Kept subtle so the
  // tank reads as lit water rather than neon.
  const baseR = 11
  const baseG = 17
  const baseB = 40
  const crestR = 122
  const crestG = 226
  const crestB = 255
  const contrast = compact ? 1.08 : 1.22
  const glowGain = compact ? 0.5 : 0.85

  const src0Phase = phase[0]
  const src1Phase = phase[1]
  const src0Amp = amp[0]
  const src1Amp = amp[1]

  for (let i = 0; i < cols * rows; i++) {
    let up: number
    let down: number

    if (reduced) {
      // Standing superposition amplitude: the time-invariant fringe pattern.
      up = Math.min(1, still[i] * invStill * contrast)
      down = 0
    } else {
      const h =
        (src0Amp[i] * Math.sin(src0Phase[i] - t) + src1Amp[i] * Math.sin(src1Phase[i] - t)) *
        invNorm *
        contrast
      up = h > 0 ? Math.min(1, h) : 0
      down = h < 0 ? Math.min(1, -h) : 0
    }

    // Crest side: lerp indigo → cyan, then lift the peaks toward white.
    const c = Math.pow(up, 0.82)
    let r = baseR + c * (crestR - baseR)
    let g = baseG + c * (crestG - baseG)
    let b = baseB + c * (crestB - baseB)
    const hl = smoothstep(0.62, 1, c)
    r += hl * (255 - r) * 0.85
    g += hl * (255 - g) * 0.8
    b += hl * (255 - b) * 0.6

    // Trough side: sink toward near-black indigo.
    r -= down * 7
    g -= down * 12
    b -= down * 26

    // Faint cyan bloom radiating from each source.
    const bloom = glow[i] * glowGain
    r += bloom * 10
    g += bloom * 30
    b += bloom * 44

    const o = i * 4
    data[o] = r // Uint8ClampedArray clamps out-of-range for us
    data[o + 1] = g
    data[o + 2] = b
    data[o + 3] = 255
  }

  field.bctx.putImageData(image, 0, 0)
  context.imageSmoothingEnabled = true
  context.imageSmoothingQuality = "high"
  context.clearRect(0, 0, width, height)
  context.drawImage(field.buffer, 0, 0, cols, rows, 0, 0, width, height)
}
