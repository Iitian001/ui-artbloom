'use client';

import './photon-thumbnail.css';

import { useEffect, useRef, useState } from 'react';

import { useCanvasScene, useReducedMotion, type SceneDrawContext, type SceneSetupContext } from '@/hooks/use-canvas-scene';

/**
 * A media card whose thumbnail arrives out of the dark as photons land on it.
 *
 * THE LATENT IMAGE. L(x, y) in [0, 1] is built once per size by ray-tracing an analytic scene:
 * a unit sphere resting on a level floor, a Lambert term for the sun, a Blinn highlight, a
 * hemispherical sky ambient, Beer-Lambert haze, and the cos^4 vignette. Nothing is loaded —
 * there is no bitmap, no font and no external asset anywhere in this file. The shadow on the
 * floor is the one the geometry actually implies: from a floor point P, the closest approach of
 * the ray P + s*S to the sphere centre C is
 *
 *   b = (C - P).S,   dperp = sqrt(|C - P|^2 - b^2)
 *   shade = smoothstep(R - a*b, R + a*b, dperp)
 *
 * with a the angular radius of the source, so the penumbra widens with the distance b from the
 * shadow back to the ball that cast it and the contact under the ball stays razor sharp. Sky
 * occlusion is the sphere-to-differential-area form factor F = (R^2 / d^2) * cos(theta), which
 * reaches 1 at the contact point: the pool under the ball goes to black on its own, with
 * nothing painted there.
 *
 * THE EXPOSURE. Photons are counted, not faded in. After a dose the cell (x, y) holds
 *
 *   N(x, y) ~ Poisson(lambda),   lambda = L(x, y) * MU * t
 *
 * and the screen shows the unbiased estimator L_hat = N / (MU * t), whose standard error is
 *
 *   sigma(L_hat) = sqrt(L / (MU * t))
 *
 * so SNR = sqrt(L * MU * t). Signal to noise grows as the square root of the time, and at any
 * one instant it goes as sqrt(L) — the highlight leads the shadow by the square root of their
 * ratio, permanently, and no amount of waiting closes that gap.
 *
 * HOW THE COUNT IS DRAWN. While lambda < 30 it is drawn exactly, by Knuth's product method:
 * multiply uniforms until the product falls under exp(-lambda), which takes lambda + 1 draws.
 * Past 30 that cost is what stalls the frame, so the count becomes
 * round(lambda + sqrt(lambda) * g) with g a unit normal from the polar form of the Box-Muller
 * transform. The Poisson skewness is 1/sqrt(lambda) = 0.18 at the crossover and the two
 * distributions already agree to well under one code value there.
 *
 * The display transfer function matters as much as the sampling, and it is the real sRGB one:
 * code = 1.055 * v^(1/2.4) - 0.055 above the toe. Its slope at v = 0.02 is 4.3 and at v = 0.9
 * is 0.48, so the same photon statistics come out of the encoder with nine times the swing in
 * the shadow. That, and not a painted noise mask, is why the dark half of this picture boils.
 *
 * IT IS NOT a uniform noise overlay whose opacity animates to zero, not a blur that sharpens,
 * and not a progressive-JPEG fake. Uniform noise is wrong in the one way anybody notices: it
 * puts the same grain in the highlight as in the shadow. The physics says the opposite and says
 * it by a factor of sqrt(L_high / L_low), about six between the ball's crown and its contact
 * shadow here.
 *
 * THE ONE VISIBLE CONSEQUENCE is that the picture resolves UNEVENLY, and then slowly. The lit
 * crown of the ball and its specular are clean while the shadow pooled to its right is still
 * boiling, and because sigma falls as 1/sqrt(t) every halving of the grain that is left takes
 * four times as long as the halving before it. The first flood lands in half a second; the last
 * traces in the shadow take the better part of two minutes. Nothing that fades behaves that
 * way, because a fade is linear in t and this is not.
 *
 * WHAT WAS CHANGED FROM THE SPEC, AND WHY. One thing. The shot noise is sampled on luminance,
 * once per cell, and each cell carries three fixed channel multipliers for the sky's tint,
 * weighted by the fraction of that cell's light which came from the sky rather than the sun. A
 * real sensor samples three channels with independent noise; doing that here triples the inner
 * loop to buy chroma grain that is invisible at a two-pixel cell in a near-monochrome scene.
 * The estimator, its variance and the sqrt(t) law are untouched.
 */

/**
 * Seconds per substep. Nothing here integrates a force, so 1/240 buys no stability; 1/120 is
 * the rate the dose is added at, so the exposure advances at the same speed on a 60 Hz and a
 * 144 Hz display instead of being four fifths of a stop apart between them.
 */
const STEP = 1 / 120;
/**
 * Substeps one frame may consume. Four caps a frame's contribution at a thirtieth of a second
 * of exposure, so a tab left in the background for a minute does not come back with a minute
 * of dose applied in one paint and the picture already finished.
 */
const MAX_SUB = 4;
/** Longest gap the clock will believe, in seconds. Past this the accumulator is reset, not run. */
const MAX_LAG = 0.25;
/**
 * Cell pitch in CSS pixels — the sensor's photosite, and the single number that decides whether
 * this fits in a frame. The whole plate is resampled every frame, and the worst frame is the one
 * where the brightest cells sit at the crossover: cost is then about 30 uniforms per cell. At
 * CELL = 2 a 336x224 card is 168x112 = 18,816 cells and that worst frame is about 0.5M draws,
 * which lands inside the budget at DPR 2 because the buffer is written at cell resolution and
 * scaled up by the compositor rather than being written per device pixel. At CELL = 1 it is
 * four times the cells and four times the draws, and a phone drops frames through the crossover.
 * Above about 3 the grain is coarse enough to staircase the ball's terminator.
 */
const CELL = 2;
/**
 * Photons per cell per second at L = 1: the base rate, the aperture left where it starts. At 210
 * the picture has a legible shape in half a second, clean highlights in about three, and a
 * shadow still visibly boiling a minute later. Ten times this and there is nothing to watch;
 * a tenth and the card is black for the first second.
 */
const MU = 210;
/**
 * Rate multiplier while the plate is held or the aperture button is on. Eight is three stops,
 * which is the difference between a slow lens wide open and the same lens stopped down, and it
 * is enough that a held press visibly outruns the sqrt(t) law rather than nudging it.
 */
const HOLD_GAIN = 8;
/**
 * The dose a restart begins at. Not zero, because N / (MU * t) is 0/0 there. At half a photon
 * the brightest cells occasionally catch one and the estimator reads 1/0.5 = 2, clipped to
 * white: the first frames are sparse single-photon sparks on black, which is what a
 * photon-counting sensor actually shows and not a stylisation of it.
 */
const DOSE_MIN = 0.5;
/**
 * Dose at which sampling stops. At 26,000 the darkest cell's standard error is about one code
 * value at 8 bits and every other cell's is a fraction of one, so a further doubling of the
 * exposure cannot change a pixel of the output and continuing to draw is heat. At the base rate
 * that is a little over two minutes, which is the point — the tail is supposed to be long — and
 * held wide open it is about fifteen seconds.
 */
const SETTLE = 26000;
/**
 * Where the exact draw hands over to the normal approximation. Below 30 the product method costs
 * lambda + 1 uniforms, which is cheap and exactly right; above it the cost is linear in the dose
 * and unbounded, while the skewness 1/sqrt(30) = 0.18 is already small enough that the Gaussian
 * and the Poisson disagree by less than the quantiser.
 */
const EXACT_MAX = 30;
/**
 * Size of the transfer-function table. 12 bits in is sixteen times the output's resolution, so
 * the table is exact at 8 bits out and the only transcendental left in the per-cell path is the
 * one exp the product method needs.
 */
const LUT_SIZE = 4096;
/** xorshift32 seed. Fixed, so the same exposure develops the same way on every load. */
const RNG_SEED = 0x2b7f41;

/** Half-width of the frame at unit depth: a 3:2 plate on about a 35mm lens. */
const TAN_HALF = 0.31;
/**
 * Sensor rise, in the same units. A view camera's front shift rather than a tilt, which is why
 * the verticals stay vertical: it drops the horizon to 42% of the frame and gives the floor and
 * its shadow the bottom half without leaning the ball.
 */
const SHIFT = -0.033;
/** Eye height above the floor, in ball radii. Just above the ball's centre, so it is looked at
 *  rather than looked down on. */
const EYE_H = 1.24;
/** Where the ball stands: left of the axis and far enough down it to leave the shadow room. */
const BALL_X = -0.55;
const BALL_Z = 7.6;
/**
 * The sun, as a direction from a surface toward the light — up, to the left, and beyond the
 * ball, so the shadow is thrown to the right and toward the camera where it can be seen. It is
 * normalised in `build`; these are the raw components.
 */
const SUN_X = -0.58;
const SUN_Y = 0.66;
const SUN_Z = 0.48;
/**
 * Angular radius of the source as a slope: 0.085 is about five degrees, a bright overcast patch
 * rather than a point. It is the only thing setting the penumbra width, and at this value the
 * contact is sharp while the far end of the shadow is a soft edge two ball radii wide.
 */
const SUN_DISC = 0.085;

/** Irradiance from the sun on a surface facing it. Under one on purpose: at 1.1 the ball's whole
 *  lit half clips to white and stops being round. */
const SUN_POWER = 0.98;
/** Irradiance from the whole sky hemisphere. What fills the ball's shaded side and the shadow. */
const SKY_AMB = 0.42;
/** Sky luminance at the top of the frame and at the horizon. The gradient is the mood. */
const SKY_ZENITH = 0.085;
const SKY_HORIZON = 0.52;
/** Steepness of that gradient: 5.8 puts the zenith value exactly at the top edge of this plate. */
const SKY_RISE = 5.8;
/** Diffuse albedos. The ball is plaster, the floor is swept paper — both grey, neither white. */
const BALL_ALBEDO = 0.6;
const FLOOR_ALBEDO = 0.3;
/** The Blinn lobe: a small bright specular that is clean almost at once, which is what gives the
 *  eye something already resolved to compare the boiling shadow against. */
const SPEC = 0.55;
const SHINE = 52;
/** Bounce off the floor onto the ball's underside. Without it the ball's foot is as dark as the
 *  shadow beside it and the two merge into one shape. */
const BOUNCE = 0.14;
/** Beer-Lambert haze depth, in ball radii. At 55 the far floor blends into the horizon so there
 *  is no seam where the plane ends, and the near floor keeps its contrast. */
const HAZE_Z = 55;
/**
 * Floor under L. A cell at exactly zero has no shot noise at all and would arrive perfectly
 * clean, which no camera does; this stands in for flare and the sensor's own dark floor, and it
 * is what keeps the deepest part of the shadow boiling instead of being quietly finished.
 */
const DARK = 0.008;
/** Strength of the sky's tint at full sky share, and the accent's red and green against its
 *  blue. The blue channel is never attenuated, so the tint can only cool a cell, never clip it. */
const TINT_MAX = 0.62;
const ACCENT_R = 0.525;
const ACCENT_G = 0.784;
/** Sky tint weight at the horizon and the extra it gains by the zenith — Rayleigh, roughly: the
 *  cast is strongest overhead where the air path is shortest and the light is bluest. */
const SKY_TINT = 0.45;
const SKY_TINT_RISE = 0.55;

interface PhotonState {
  readonly cols: number;
  readonly rows: number;
  /** The latent image: the scene's luminance per cell, in [DARK, 1]. Built once per size. */
  readonly latent: Float32Array;
  /**
   * Per-cell channel multipliers carrying the sky's tint: fixed chromaticity, sampled intensity.
   * There is no blue array because the accent is normalised so blue is its largest channel, which
   * means the tint can only ever take red and green away and can never push a cell past white.
   */
  readonly tintR: Float32Array;
  readonly tintG: Float32Array;
  /** The sRGB transfer function, tabulated. Indexed by the estimator scaled to LUT_SIZE. */
  readonly code: Uint8Array;
  /** One RGBA pixel per cell. This buffer is the grain, and nothing else in the file is. */
  readonly pixels: ImageData;
  /** The buffer's own canvas, scaled up to the plate once per frame with smoothing off. */
  readonly buffer: HTMLCanvasElement;
  /** Null only if the browser refuses a second 2D context, in which case the frame is skipped. */
  readonly plate: CanvasRenderingContext2D | null;
  /** xorshift32 register. */
  rng: number;
  /** The unused half of the last normal pair. Box-Muller makes two; throwing one away doubles
   *  the cost of every cell past the crossover. */
  spare: number;
  hasSpare: boolean;
  /** MU * t: the dose, in photons a cell at L = 1 has collected. The only clock that matters. */
  dose: number;
  /** Rate multiplier this frame — the aperture, 1 or HOLD_GAIN. */
  gain: number;
  carry: number;
  clock: number;
  /**
   * Put the plate at the settled dose and sample one frame there instead of integrating toward
   * it. Set under `prefers-reduced-motion`, where the loop never runs and a picture that gained
   * one accumulator's worth of dose per repaint would never develop at all.
   */
  snap: boolean;
  /** The estimator is inside a code value everywhere. Resampling stops; the last frame stands. */
  settled: boolean;
}

/** xorshift32, in [0, 1). Seeded, so pressing restart develops the same exposure again. */
function nextFloat(state: PhotonState): number {
  let x = state.rng;
  x ^= x << 13;
  x >>>= 0;
  x ^= x >>> 17;
  x ^= x << 5;
  x >>>= 0;
  state.rng = x;
  return x / 4294967296;
}

/**
 * A unit normal by the polar form of Box-Muller: reject until the pair lands inside the unit
 * disc, then scale both components by sqrt(-2 * ln(s) / s). The polar form is used rather than
 * the trigonometric one because it needs one log and no sin or cos, and the second value is kept
 * rather than dropped — past the crossover every cell wants one, so discarding half the output
 * would double the transcendental count for the whole plate.
 */
function nextNormal(state: PhotonState): number {
  if (state.hasSpare) {
    state.hasSpare = false;
    return state.spare;
  }
  let u = 0;
  let v = 0;
  let s = 0;
  do {
    u = nextFloat(state) * 2 - 1;
    v = nextFloat(state) * 2 - 1;
    s = u * u + v * v;
  } while (s === 0 || s >= 1);
  const scale = Math.sqrt((-2 * Math.log(s)) / s);
  state.spare = v * scale;
  state.hasSpare = true;
  return u * scale;
}

/**
 * Knuth's product method: multiply uniforms until the product drops below exp(-lambda), and the
 * number of factors it took, less one, is an exact Poisson draw. The expected cost is lambda + 1
 * uniforms, which is why it stops being used past EXACT_MAX. The exp is the only transcendental
 * on this path and it cannot be hoisted, because lambda is the cell's own latent times the dose.
 */
function poissonExact(state: PhotonState, lambda: number): number {
  const limit = Math.exp(-lambda);
  let product = 1;
  let count = 0;
  do {
    count += 1;
    product *= nextFloat(state);
  } while (product > limit);
  return count - 1;
}

/**
 * The normal approximation, with the Poisson's mean and variance both lambda. Clamped at zero
 * because the Gaussian has a left tail the Poisson has not; at the crossover that clamp is six
 * sigma away and fires on roughly one cell in a billion, but a negative count would come back
 * through the estimator as a negative luminance.
 */
function poissonNormal(state: PhotonState, lambda: number): number {
  const draw = Math.round(lambda + Math.sqrt(lambda) * nextNormal(state));
  return draw > 0 ? draw : 0;
}

/** Hermite smoothstep. One use: the penumbra across the shadow's edge. */
function smoothstep(edge0: number, edge1: number, x: number): number {
  if (edge1 <= edge0) return x < edge0 ? 0 : 1;
  const t = (x - edge0) / (edge1 - edge0);
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  return t * t * (3 - 2 * t);
}

/**
 * The sRGB opto-electronic transfer function, tabulated to 8-bit output: the real one, linear
 * toe and all, not a bare 2.2 gamma. The toe is why the very deepest cells do not explode into
 * salt — below v = 0.0031308 the encoder is linear and passes the shot noise through at unit
 * gain instead of at the slope of a power law going vertical.
 */
function buildCode(): Uint8Array {
  const table = new Uint8Array(LUT_SIZE);
  for (let i = 0; i < LUT_SIZE; i += 1) {
    const v = i / (LUT_SIZE - 1);
    const encoded = v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(v, 1 / 2.4) - 0.055;
    table[i] = Math.round(encoded * 255);
  }
  return table;
}

/**
 * Ray-trace the scene into the latent image. Once per size, never per frame: this is the picture
 * the exposure is an estimate of, and the estimator converges on it rather than being blended
 * toward it. The camera sits at the origin with unit focal length looking down +z, the floor is
 * the plane y = 0, and the ball has radius 1 with its centre one radius above the floor — so
 * "resting on the floor" is a statement about the geometry and not about where a shadow was drawn.
 */
function shade(state: PhotonState): void {
  const { cols, rows, latent, tintR, tintG } = state;

  // The sun, normalised here rather than at the constants, so the three components can be read
  // and edited as a direction instead of as a unit vector somebody has to keep unit.
  const sunLength = Math.sqrt(SUN_X * SUN_X + SUN_Y * SUN_Y + SUN_Z * SUN_Z);
  const lx = SUN_X / sunLength;
  const ly = SUN_Y / sunLength;
  const lz = SUN_Z / sunLength;

  const tanY = (TAN_HALF * rows) / cols;
  // Camera minus ball centre, and the constant term of the ray-sphere quadratic.
  const ocx = -BALL_X;
  const ocy = EYE_H - 1;
  const ocz = -BALL_Z;
  const ocSquared = ocx * ocx + ocy * ocy + ocz * ocz - 1;
  // The floor's normal is (0, 1, 0) at every point, so its Lambert term and the sun's irradiance
  // on it are the same everywhere and only the shadow and the sky occlusion vary across it.
  const floorDirect = FLOOR_ALBEDO * SUN_POWER * Math.max(0, ly);

  for (let y = 0; y < rows; y += 1) {
    const sy = (0.5 - (y + 0.5) / rows) * 2 * tanY + SHIFT;
    for (let x = 0; x < cols; x += 1) {
      const sx = ((x + 0.5) / cols - 0.5) * 2 * TAN_HALF;
      const norm = Math.sqrt(sx * sx + sy * sy + 1);
      const dx = sx / norm;
      const dy = sy / norm;
      const dz = 1 / norm;
      // Natural vignetting, written exactly: cos(theta) for this ray is 1 / norm, and the cos^4
      // law is that to the fourth. It needs no constant, and it is what deepens the corners —
      // and a deeper corner is a corner whose grain outlasts the middle of the frame.
      const vignette = 1 / (norm * norm * norm * norm);

      let lum = 0;
      let share = 0;

      const half = ocx * dx + ocy * dy + ocz * dz;
      const disc = half * half - ocSquared;
      const hit = disc >= 0 ? -half - Math.sqrt(disc) : -1;

      if (hit > 0) {
        // The ball. The hit point less the centre is already a unit normal, radius being 1.
        const nx = hit * dx - BALL_X;
        const ny = EYE_H + hit * dy - 1;
        const nz = hit * dz - BALL_Z;
        const lambert = nx * lx + ny * ly + nz * lz;
        const direct = lambert > 0 ? lambert : 0;
        // Hemispherical sky visibility for a surface tilted by ny, and the sunlit floor bouncing
        // back up into the ball's underside. The bounce counts as the sun's light, not the sky's,
        // because that is where it came from before the floor sent it back.
        const skyLight = BALL_ALBEDO * SKY_AMB * (0.5 + 0.5 * ny);
        const bounce = ny < 0 ? -ny * BOUNCE : 0;
        let sunLight = BALL_ALBEDO * (SUN_POWER * direct + bounce);
        if (direct > 0) {
          // Blinn's half vector between the light and the eye. The view direction is -d.
          let hx = lx - dx;
          let hy = ly - dy;
          let hz = lz - dz;
          const hl = Math.sqrt(hx * hx + hy * hy + hz * hz);
          hx /= hl;
          hy /= hl;
          hz /= hl;
          const ndh = nx * hx + ny * hy + nz * hz;
          if (ndh > 0) sunLight += SPEC * Math.pow(ndh, SHINE);
        }
        lum = sunLight + skyLight;
        share = lum > 0 ? skyLight / lum : 0;
      } else if (dy < 0) {
        // The floor. One division puts the ray on the plane, then the ball's shadow and the ball's
        // occlusion of the sky are both read off the same vector back to its centre.
        const travel = -EYE_H / dy;
        const fx = travel * dx;
        const fz = travel * dz;
        // C - P. Its y component is 1 at every floor point, the ball's centre being one radius up.
        const wx = BALL_X - fx;
        const wz = BALL_Z - fz;
        const w2 = wx * wx + 1 + wz * wz;
        const toward = wx * lx + ly + wz * lz;
        let shadow = 1;
        if (toward > 0) {
          const perpSquared = w2 - toward * toward;
          const perp = perpSquared > 0 ? Math.sqrt(perpSquared) : 0;
          // The penumbra's half-width grows with the distance back to the ball that cast it, which
          // is the whole soft shadow: sharp at the contact, two radii of gradient at the far end.
          const soft = SUN_DISC * toward;
          shadow = smoothstep(1 - soft, 1 + soft, perp);
        }
        // Sky occlusion, as the sphere-to-differential-area form factor (R^2 / d^2) * cos(theta).
        // It is exactly 1 where the ball meets the floor, so the pool under it reaches black on
        // its own — and that pool is the region this whole animation is an argument about.
        const distance = Math.sqrt(w2);
        const form = 1 / (w2 * distance);
        const skyLight = FLOOR_ALBEDO * SKY_AMB * (form < 1 ? 1 - form : 0);
        lum = floorDirect * shadow + skyLight;
        share = lum > 0 ? skyLight / lum : 0;
        // Haze, Beer-Lambert in depth: the floor recedes into the sky's own horizon value, so the
        // plane has no seam where it runs out and the near floor keeps all of its contrast.
        const fog = 1 - Math.exp(-fz / HAZE_Z);
        lum += (SKY_HORIZON - lum) * fog;
        share += (SKY_TINT - share) * fog;
      } else {
        // The sky. Luminance falls from the horizon toward the top of the frame on a quadratic
        // ease, which is the shape a real sky has: most of the change is in the first few degrees.
        const rise = dy * SKY_RISE;
        const lift = rise >= 1 ? 1 : rise * (2 - rise);
        lum = SKY_HORIZON + (SKY_ZENITH - SKY_HORIZON) * lift;
        // All of this cell's light is sky, and the cast deepens overhead where the air path is
        // shortest and the light that gets through is bluest. It is the only colour in the card.
        share = SKY_TINT + SKY_TINT_RISE * lift;
      }

      const index = y * cols + x;
      const value = lum * vignette;
      latent[index] = value < DARK ? DARK : value > 1 ? 1 : value;
      const weight = TINT_MAX * (share < 0 ? 0 : share > 1 ? 1 : share);
      tintR[index] = 1 - weight * (1 - ACCENT_R);
      tintG[index] = 1 - weight * (1 - ACCENT_G);
    }
  }
}

/**
 * One full resample of the plate at the current dose. Every cell is drawn independently, which is
 * why the grain boils instead of crawling: consecutive frames are independent estimates of the
 * same latent image, not one noise field being moved about. The estimator is clipped into [0, 1]
 * on the way to the encoder — it is unbiased, the display is not, and a cell that caught more than
 * its mean share of an early dose genuinely does read as blown on a real sensor.
 */
function sample(state: PhotonState): void {
  const { cols, rows, latent, tintR, tintG, code, dose } = state;
  const data = state.pixels.data;
  // count / dose, straight into table units, so the estimator and the encoder cost one multiply.
  const scale = (LUT_SIZE - 1) / dose;
  const cells = cols * rows;
  for (let i = 0; i < cells; i += 1) {
    const lambda = latent[i] * dose;
    const count = lambda < EXACT_MAX ? poissonExact(state, lambda) : poissonNormal(state, lambda);
    const slot = count * scale;
    const grey = code[slot > LUT_SIZE - 1 ? LUT_SIZE - 1 : slot | 0];
    const p = i * 4;
    data[p] = grey * tintR[i];
    data[p + 1] = grey * tintG[i];
    data[p + 2] = grey;
  }
}

/**
 * The buffer onto the plate. The grid is written at cell resolution and scaled up by the
 * compositor with smoothing off, so a cell is exactly CELL * dpr device pixels and its edges land
 * on integer pixels at both DPR 1 and DPR 2 — no shimmer, and no per-device-pixel write. Nothing
 * is cleared first: the buffer covers the plate at full alpha, by construction.
 */
function blit({ context, state }: SceneDrawContext<PhotonState>): void {
  const plate = state.plate;
  if (!plate) return;
  const { cols, rows } = state;
  plate.putImageData(state.pixels, 0, 0);
  context.imageSmoothingEnabled = false;
  context.drawImage(state.buffer, 0, 0, cols, rows, 0, 0, cols * CELL, rows * CELL);
}

/**
 * Advance the dose, then resample. The accumulator is what keeps the exposure rate independent of
 * the display's refresh, and the resample sits after the substeps rather than inside them because
 * N depends on the total dose alone — sampling four times in a frame would only throw three
 * frames away.
 *
 * The dose advances on painted frames only, so the exposure is measured in the time the card was
 * on screen. The hook stops the loop when the stage scrolls out of view, and a photon that lands
 * while nobody is looking is not one this card is claiming to have counted.
 */
function expose(scene: SceneDrawContext<PhotonState>): void {
  const { state } = scene;

  if (state.snap) {
    // Reduced motion. One sample at the settled dose, and no integration at all: the first painted
    // frame is the developed photograph, which is a real state of the solver at a real exposure.
    if (state.settled) return;
    state.dose = SETTLE;
    sample(state);
    blit(scene);
    state.settled = true;
    return;
  }

  const now = performance.now() / 1000;
  const elapsed = state.clock === 0 ? STEP : Math.min(MAX_LAG, now - state.clock);
  state.clock = now;
  // Past the settled dose the sample cannot change a pixel, so the last frame is left standing.
  if (state.settled) return;

  state.carry += elapsed;
  let taken = 0;
  while (state.carry >= STEP && taken < MAX_SUB) {
    state.dose += MU * state.gain * STEP;
    state.carry -= STEP;
    taken += 1;
  }
  if (taken === MAX_SUB) state.carry = 0;

  sample(state);
  blit(scene);
  if (state.dose >= SETTLE) state.settled = true;
}

/**
 * The sensor, sized to the plate. `dose` comes in from the component rather than starting at zero,
 * so re-measuring the card does not put the reader back at black: a resize builds a new latent
 * image at the new cell count and carries on counting from the exposure already given.
 */
function build({ width, height }: SceneSetupContext, dose: number): PhotonState {
  const cols = Math.max(8, Math.ceil(width / CELL));
  const rows = Math.max(8, Math.ceil(height / CELL));
  const cells = cols * rows;

  const buffer = document.createElement('canvas');
  buffer.width = cols;
  buffer.height = rows;
  const state: PhotonState = {
    cols,
    rows,
    latent: new Float32Array(cells),
    tintR: new Float32Array(cells),
    tintG: new Float32Array(cells),
    code: buildCode(),
    pixels: new ImageData(cols, rows),
    buffer,
    // A page that got a 2D context for the visible canvas will get one here too; the null branch
    // exists so a browser that refuses simply shows a black plate instead of throwing on mount.
    plate: buffer.getContext('2d'),
    rng: RNG_SEED,
    spare: 0,
    hasSpare: false,
    dose,
    gain: 1,
    carry: 0,
    clock: 0,
    snap: false,
    settled: false,
  };

  // Alpha once, here, rather than a fourth write per cell per frame for a byte that never changes.
  const data = state.pixels.data;
  for (let i = 3; i < data.length; i += 4) data[i] = 255;

  shade(state);

  return state;
}

/**
 * The card is the component and the thumbnail is a real picture arriving in it. The plate takes the
 * pointer capture and holds nothing but the canvas, so both buttons sit under the picture where
 * their own clicks can land — and the aperture is reachable twice over, by a press and hold
 * anywhere on the picture or by the button, which is the same gesture for a reader with no press to
 * give and the only one of the two a keyboard can reach.
 */
export type PhotonThumbnailProps = { compact?: boolean };

/**
 * `compact` is the 298x240 catalogue card: the caption block is dropped and the picture takes the
 * frame, which is the composition this scene wants anyway — the image arriving *is* the content,
 * and the plate already carries press-and-hold for the aperture. Both buttons leave the tab order
 * under `compact` as well as the layout, so the invariant does not depend on the stylesheet: the
 * card frame is `aria-hidden` and pointer-live, and its title link is the path to the item.
 */
export function PhotonThumbnail({ compact = false }: PhotonThumbnailProps) {
  const reduced = useReducedMotion();
  const [wide, setWide] = useState(false);
  const [developed, setDeveloped] = useState(false);

  /*
   * Mirrors, because the scene runs inside a loop React does not drive. `dose` lives out here so it
   * survives the rebuild a resize forces; `wide` and the restart flag are written by the buttons and
   * consumed on the next painted frame; `developed` is written by the scene, so its ref is the value
   * the scene compares against before paying for a re-render.
   */
  const doseRef = useRef(DOSE_MIN);
  const wideRef = useRef(false);
  const restartRef = useRef(false);
  const developedRef = useRef(false);
  const snapRef = useRef(reduced);
  wideRef.current = wide;
  snapRef.current = reduced;

  const setup = (scene: SceneSetupContext): PhotonState => build(scene, doseRef.current);

  const draw = (scene: SceneDrawContext<PhotonState>) => {
    const { state, pointer } = scene;

    if (restartRef.current) {
      restartRef.current = false;
      state.dose = DOSE_MIN;
      state.carry = 0;
      state.clock = 0;
      state.settled = false;
    }

    // The aperture. A held press and the button are the same three stops, and releasing the press
    // does not close the shutter — the exposure carries on at the base rate, as it should.
    state.gain = pointer.down || wideRef.current ? HOLD_GAIN : 1;
    state.snap = snapRef.current;

    expose(scene);

    doseRef.current = state.dose;

    if (state.settled !== developedRef.current) {
      developedRef.current = state.settled;
      setDeveloped(state.settled);
    }
  };

  const { stageRef, canvasRef, requestRender } = useCanvasScene<PhotonState>({ setup, draw });

  // The scene reads the aperture off a ref, so a press reaches the plate on the next painted frame
  // — and with the loop stopped, because the card is off screen or the reader asked for no motion,
  // there may not be one. This asks for it; a settled exposure is free to decline.
  useEffect(() => requestRender(), [wide, reduced, requestRender]);

  const onRestart = () => {
    restartRef.current = true;
    requestRender();
  };

  return (
    <div className="photon-thumbnail-stage" data-compact={compact ? 'true' : undefined}>
      <div className="photon-thumbnail-card">
        <div className="photon-thumbnail-frame">
          <div ref={stageRef} className="photon-thumbnail-plate" aria-hidden="true">
            <canvas ref={canvasRef} />
          </div>

          <p className="photon-thumbnail-alt">
            A pale plaster sphere resting on a swept paper floor, lit from high on the left under an
            open sky, with a soft shadow pooling to its right and the floor fading into haze at the
            horizon.
          </p>

          <p className="photon-thumbnail-state" role="status">
            {developed ? 'Developed' : 'Developing'}
          </p>
        </div>

        <div className="photon-thumbnail-meta">
          <p className="photon-thumbnail-kicker">Field archive &middot; Plate 14</p>
          <h3 className="photon-thumbnail-title">Sphere on a swept floor</h3>
          <p className="photon-thumbnail-caption">
            One window to the left of camera, nothing bounced back in, and the shutter held open
            until the shadow stopped moving. Press and hold the picture to open the aperture up.
          </p>

          <div className="photon-thumbnail-foot">
            <p className="photon-thumbnail-credit">Wren Ashcombe</p>

            <div className="photon-thumbnail-controls">
              <button
                type="button"
                className="photon-thumbnail-button"
                aria-pressed={wide}
                tabIndex={compact ? -1 : undefined}
                onClick={() => setWide(!wide)}
              >
                Open the aperture
              </button>
              <button
                type="button"
                className="photon-thumbnail-button"
                tabIndex={compact ? -1 : undefined}
                onClick={onRestart}
              >
                Expose again
              </button>
            </div>
          </div>
        </div>
      </div>

      <p className="photon-thumbnail-hint">press and hold to open up</p>
    </div>
  );
}

export default PhotonThumbnail;







