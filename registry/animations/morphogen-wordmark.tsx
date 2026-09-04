'use client';

import './morphogen-wordmark.css';

import { useEffect, useRef } from 'react';

import { useCanvasScene, useReducedMotion, type SceneDrawContext, type SceneSetupContext } from '@/hooks/use-canvas-scene';

/**
 * A product hero whose ornament is grown, not drawn: the wordmark is nucleated into a
 * Gray-Scott reaction-diffusion field and the pattern spreads out of the letters.
 *
 *   du/dt = Du*lap(u) - u*v^2 + F*(1 - u)
 *   dv/dt = Dv*lap(v) + u*v^2 - (F + k)*v
 *
 * Integrated explicitly on a five-point Laplacian at unit grid spacing, which is stable
 * while TAU*4*DU < 1 - here 0.576, comfortably inside it. The easy version of this
 * picture is a blurred PNG of the letters with an opacity keyframe, and it cannot do the
 * one thing that matters: the front is autocatalytic, so v eats the u it finds outside
 * the glyphs and keeps going, splitting and merging in a way no curve encodes. Delete the
 * solver and the letters stop growing anything.
 *
 * F 0.037 / k 0.060 is the labyrinth window: stripes one wavelength wide that advance
 * into fresh u and braid around each other. Raise k to ~0.065 and the fronts pin into
 * isolated spots that never leave the letters; drop it to ~0.055 and there is no window
 * at all, v floods the whole field and the wordmark dissolves into a flat wash.
 */

const LABEL = 'ARTBLOOM';
const FONT_STACK = 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';
const TRACKING = 0.055;

const STEP = 1 / 60;
const SUBSTEPS = 3;
const TAU = 0.9;
const DU = 0.16;
const DV = 0.08;
const FEED = 0.037;
const KILL = 0.06;

const CELL_MIN = 3;
const GRID_MAX_X = 260;
const GRID_MAX_Y = 168;
const WARM_BUDGET = 1.8e7;
const WARM_MAX = 900;
const RESEED_WARM = 210;

const V_PEAK = 0.32;
const SPILL_DIM = 0.7;
const MARK_FLOOR = 0.05;
const SEED_GAP = 5;

interface State {
  clock: number;
  carry: number;
  snap: boolean;
  gw: number;
  gh: number;
  cell: number;
  u: Float64Array;
  v: Float64Array;
  un: Float64Array;
  vn: Float64Array;
  mask: Uint8Array;
  field: ImageData;
  off: HTMLCanvasElement;
  offContext: CanvasRenderingContext2D;
  markSize: number;
  markX: number;
  markY: number;
  seedX: number;
  seedY: number;
  hasSeed: boolean;
  warm: number;
}

/**
 * Zero-flux walls rather than a wrapping grid: with periodic edges the spill off the top
 * of the wordmark reappears under the copy, which reads as a bug rather than as growth.
 */
const advance = (s: State) => {
  const { u, v, un, vn, gw, gh } = s;
  for (let y = 0; y < gh; y += 1) {
    const row = y * gw;
    const up = (y > 0 ? y - 1 : 0) * gw;
    const down = (y < gh - 1 ? y + 1 : gh - 1) * gw;
    for (let x = 0; x < gw; x += 1) {
      const i = row + x;
      const cu = u[i];
      const cv = v[i];
      const lapU = u[row + (x > 0 ? x - 1 : 0)] + u[row + (x < gw - 1 ? x + 1 : gw - 1)] + u[up + x] + u[down + x] - 4 * cu;
      const lapV = v[row + (x > 0 ? x - 1 : 0)] + v[row + (x < gw - 1 ? x + 1 : gw - 1)] + v[up + x] + v[down + x] - 4 * cv;
      const react = cu * cv * cv;
      const nu = cu + TAU * (DU * lapU - react + FEED * (1 - cu));
      const nv = cv + TAU * (DV * lapV + react - (FEED + KILL) * cv);
      // A seed stamp can leave a cell momentarily outside [0,1]; unclamped, the cubic
      // term there runs away in two or three steps and the NaN never washes out.
      un[i] = nu < 0 ? 0 : nu > 1 ? 1 : nu;
      vn[i] = nv < 0 ? 0 : nv > 1 ? 1 : nv;
    }
  }
  s.u = un;
  s.un = u;
  s.v = vn;
  s.vn = v;
};

const warmUp = (s: State, steps: number) => {
  for (let n = 0; n < steps; n += 1) {
    advance(s);
  }
};

/** A disc of v with u locally spent, which is what a nucleation event physically is. */
const stampSeed = (s: State, gx: number, gy: number, radius: number) => {
  const { u, v, gw, gh } = s;
  const r2 = radius * radius;
  const x0 = Math.max(0, Math.floor(gx - radius));
  const x1 = Math.min(gw - 1, Math.ceil(gx + radius));
  const y0 = Math.max(0, Math.floor(gy - radius));
  const y1 = Math.min(gh - 1, Math.ceil(gy + radius));
  for (let y = y0; y <= y1; y += 1) {
    const dy = y - gy;
    for (let x = x0; x <= x1; x += 1) {
      const dx = x - gx;
      const d2 = dx * dx + dy * dy;
      if (d2 > r2) {
        continue;
      }
      const fall = 1 - d2 / r2;
      const i = y * gw + x;
      const load = 0.55 * fall;
      if (v[i] < load) {
        v[i] = load;
      }
      u[i] -= 0.5 * fall * u[i];
    }
  }
};

const seedFromMask = (s: State) => {
  const { u, v, mask } = s;
  u.fill(1);
  v.fill(0);
  let count = 0;
  for (let i = 0; i < mask.length; i += 1) {
    if (mask[i] === 0) {
      continue;
    }
    // Deliberately unequal nuclei. A perfectly uniform seed region breaks symmetry only
    // on floating-point dust, and then every mount braids the same way.
    v[i] = 0.16 + 0.24 * Math.random();
    u[i] = 0.42;
    count += 1;
  }
  if (count === 0) {
    stampSeed(s, s.gw / 2, s.gh / 2, Math.max(4, s.gw * 0.05));
  }
  s.hasSeed = false;
};

/* Tracked by hand, one glyph at a time: ctx.letterSpacing is not in every lib.dom we
   compile against, and a wordmark set solid looks like body copy. */
const markWidth = (ctx: CanvasRenderingContext2D, size: number) => {
  ctx.font = `800 ${size}px ${FONT_STACK}`;
  let total = 0;
  for (let i = 0; i < LABEL.length; i += 1) {
    total += ctx.measureText(LABEL.charAt(i)).width;
  }
  return total + size * TRACKING * (LABEL.length - 1);
};

const paintMark = (ctx: CanvasRenderingContext2D, size: number, x: number, y: number, stroke: boolean) => {
  ctx.font = `800 ${size}px ${FONT_STACK}`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  let cursor = x;
  for (let i = 0; i < LABEL.length; i += 1) {
    const glyph = LABEL.charAt(i);
    if (stroke) {
      ctx.strokeText(glyph, cursor, y);
    } else {
      ctx.fillText(glyph, cursor, y);
    }
    cursor += ctx.measureText(glyph).width + size * TRACKING;
  }
};

/** The mask is cut at grid resolution, not canvas resolution: one wavelength of the
    pattern is several cells wide, so a crisper mask would buy nothing and cost a
    full-size getImageData on every resize. */
const buildMask = (s: State) => {
  const sheet = document.createElement('canvas');
  sheet.width = s.gw;
  sheet.height = s.gh;
  const ctx = sheet.getContext('2d');
  if (!ctx) {
    return;
  }
  ctx.fillStyle = '#ffffff';
  paintMark(ctx, s.markSize / s.cell, s.markX / s.cell, s.markY / s.cell, false);
  const px = ctx.getImageData(0, 0, s.gw, s.gh).data;
  for (let i = 0; i < s.mask.length; i += 1) {
    s.mask[i] = px[i * 4 + 3] > 96 ? 1 : 0;
  }
};

/* The grid is blitted up with smoothing on, so the coarse field arrives as soft tissue
   instead of pixels, and the letters get a hairline on top to stay legible after the
   pattern has spilled over them. */
const renderField = (s: State, context: CanvasRenderingContext2D) => {
  const { v, mask, field } = s;
  const px = field.data;
  for (let i = 0; i < mask.length; i += 1) {
    const t = v[i] > V_PEAK ? 1 : v[i] / V_PEAK;
    const inside = mask[i] === 1;
    const lit = t * t * (3 - 2 * t) * (inside ? 1 : SPILL_DIM) + (inside ? MARK_FLOOR : 0);
    // The mark floor pushes a saturated cell past 1, and the quartic on the red channel
    // then lands over 255. Clamped here rather than left to Uint8Clamped, which would
    // flatten the brightest ridges to a single value and lose the crest.
    const g = lit > 1 ? 1 : lit;
    const g2 = g * g;
    const g3 = g2 * g;
    const o = i * 4;
    px[o] = 8 + 236 * g3 * g;
    px[o + 1] = 11 + 218 * (0.42 * g + 0.58 * g2);
    px[o + 2] = 15 + 176 * (0.55 * g2 + 0.45 * g3);
    px[o + 3] = 255;
  }
  s.offContext.putImageData(field, 0, 0);
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = 'high';
  // Exactly `cell` CSS pixels per cell, so grid space and canvas space are the same map
  // the mask was cut in. The last row and column hang off the edge and are clipped.
  context.drawImage(s.off, 0, 0, s.gw * s.cell, s.gh * s.cell);
  context.lineWidth = Math.max(1, s.markSize * 0.014);
  context.strokeStyle = 'rgba(158, 246, 218, 0.34)';
  paintMark(context, s.markSize, s.markX, s.markY, true);
};

/** `compact` is the 298x240 catalogue-card variant: presentation only, all of it CSS. */
export type MorphogenWordmarkProps = { compact?: boolean };

export function MorphogenWordmark({ compact = false }: MorphogenWordmarkProps) {
  const reduced = useReducedMotion();
  const reseed = useRef(false);

  const setup = ({ context, width, height }: SceneSetupContext): State => {
    const cell = Math.max(CELL_MIN, Math.ceil(Math.max(width / GRID_MAX_X, height / GRID_MAX_Y)));
    // Ceil, not floor: the grid must cover at least the canvas so the blit can go up by
    // exactly `cell` and overhang. Flooring left gw*cell short of width, the blit stretched
    // to close the gap, and the grown letters slid out from under their own hairline by a
    // few pixels at the right edge - the mask, the pointer and the paint disagreed.
    const gw = Math.max(8, Math.ceil(width / cell));
    const gh = Math.max(8, Math.ceil(height / cell));
    const cells = gw * gh;

    const off = document.createElement('canvas');
    off.width = gw;
    off.height = gh;
    // A detached 2D context only fails when the tab is out of memory. Falling back to the
    // scene's own context keeps the type honest and degrades to the hairline wordmark.
    const grid = off.getContext('2d') ?? context;

    const base = markWidth(context, 100);
    const pad = Math.max(20, Math.min(48, width * 0.05));
    const room = Math.min(width - pad * 2, 620);
    const unit = base > 0 ? base / 100 : 6;
    const markSize = Math.max(26, Math.min(room / unit, height * 0.2, 108));

    const state: State = {
      clock: 0,
      carry: 0,
      snap: reduced,
      gw,
      gh,
      cell,
      u: new Float64Array(cells).fill(1),
      v: new Float64Array(cells),
      un: new Float64Array(cells),
      vn: new Float64Array(cells),
      mask: new Uint8Array(cells),
      field: grid.createImageData(gw, gh),
      off,
      offContext: grid,
      markSize,
      markX: pad,
      markY: Math.round(height * 0.36),
      seedX: 0,
      seedY: 0,
      hasSeed: false,
      warm: 120,
    };

    // Fixed work rather than a fixed step count: a wide hero has four times the cells of a
    // narrow one, and mount latency is what a reader actually notices.
    state.warm = Math.max(120, Math.min(WARM_MAX, Math.round(WARM_BUDGET / cells)));
    buildMask(state);
    seedFromMask(state);
    warmUp(state, reduced ? Math.round(state.warm * 1.4) : state.warm);
    return state;
  };

  const draw = ({ context, state, pointer }: SceneDrawContext<State>) => {
    // Read fresh every frame: a copy taken at setup goes stale the moment the OS setting
    // flips, because setup only re-runs on resize.
    state.snap = reduced;

    if (reseed.current) {
      reseed.current = false;
      seedFromMask(state);
      warmUp(state, state.snap ? state.warm : RESEED_WARM);
    }

    const now = performance.now() / 1000;
    const dt = state.clock === 0 ? 0 : Math.min(0.05, now - state.clock);
    state.clock = now;

    if (pointer.inside) {
      const gx = pointer.x / state.cell;
      const gy = pointer.y / state.cell;
      if (!state.hasSeed) {
        state.seedX = gx;
        state.seedY = gy;
        state.hasSeed = true;
      }
      const dx = gx - state.seedX;
      const dy = gy - state.seedY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      // Stamped by distance travelled, not per frame, and interpolated along the segment
      // so a fast sweep leaves a continuous front instead of beads.
      if (dist >= SEED_GAP) {
        const stamps = Math.min(6, Math.floor(dist / SEED_GAP));
        for (let n = 1; n <= stamps; n += 1) {
          const f = n / stamps;
          const radius = (pointer.down ? 3.4 : 2.1) + Math.random() * 1.6;
          stampSeed(state, state.seedX + dx * f, state.seedY + dy * f, radius);
        }
        state.seedX = gx;
        state.seedY = gy;
      }
    } else {
      state.hasSeed = false;
    }

    if (!state.snap) {
      state.carry += dt;
      let n = 0;
      while (state.carry >= STEP && n < 8) {
        for (let k = 0; k < SUBSTEPS; k += 1) {
          advance(state);
        }
        state.carry -= STEP;
        n += 1;
      }
      if (n === 8) {
        state.carry = 0;
      }
    }

    renderField(state, context);
  };

  const { stageRef, canvasRef, requestRender } = useCanvasScene<State>({ setup, draw });

  // Block body on purpose: `() => requestRender()` hands the effect whatever that call
  // returns, and React reads a returned value as a cleanup function.
  useEffect(() => {
    requestRender();
  }, [reduced, requestRender]);

  const growAgain = () => {
    reseed.current = true;
    requestRender();
  };

  return (
    <div className="morphogen-wordmark-stage" data-compact={compact ? 'true' : undefined}>
      <div ref={stageRef} className="morphogen-wordmark-surface">
        <canvas ref={canvasRef} aria-hidden="true" />
      </div>
      <div className="morphogen-wordmark-content">
        <h1 className="morphogen-wordmark-mark">Artbloom</h1>
        <p className="morphogen-wordmark-eyebrow">Gray-Scott morphogenesis</p>
        <h2 className="morphogen-wordmark-headline">The mark grows the rest of the page.</h2>
        <p className="morphogen-wordmark-body">
          Two reagents and no keyframes. The wordmark is nucleated into the field, then the
          front feeds outward until the stripes have taken the space around it. Every load
          braids differently, and so does every pass of your pointer.
        </p>
        <div className="morphogen-wordmark-actions">
          {/* Still clickable in a card — only the tab order changes, because the card
              frame is aria-hidden and a focusable node under that is a real bug. */}
          <button
            type="button"
            className="morphogen-wordmark-cta"
            tabIndex={compact ? -1 : undefined}
            onClick={growAgain}
          >
            Grow it again
          </button>
          <span className="morphogen-wordmark-meta">F 0.037 / k 0.060 / Du 0.16</span>
        </div>
      </div>
      <p className="morphogen-wordmark-hint">move to seed growth</p>
    </div>
  );
}

export default MorphogenWordmark;
