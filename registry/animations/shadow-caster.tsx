'use client';

import './shadow-caster.css';

import { useCallback, useEffect, useRef } from 'react';

import {
  useCanvasScene,
  type SceneDrawContext,
  type SceneSetupContext,
} from '@/hooks/use-canvas-scene';

/**
 * Soft shadows cast by the real cards in the real layout, from a light that has a
 * size.
 *
 * A point light gives a hard edge. Every real shadow has a penumbra because the
 * source is an area, and every point in the penumbra can see *part* of that area —
 * so the darkness there is the fraction of the source the occluder hides, and the
 * band widens the further the shadow is thrown. That is the whole effect, and the
 * only way to get it is to have an area to sample. This samples the disc at
 * fourteen points on a Vogel spiral, builds the exact shadow volume of every card
 * from each of them, and accumulates the occluded fraction.
 *
 * The accumulation is additive, in a mask, and then subtracted from the light in one
 * pass. Painting fourteen semi-transparent shadows on top of each other instead
 * would compound as (1 − 1/n)ⁿ, which leaves a third of the light standing in the
 * middle of a full umbra; darkness has to be linear in the occluded fraction, and
 * the only way to get that out of a canvas is to add the occlusion up somewhere
 * else first.
 *
 * The occluders are the cards. Their boxes come from `getBoundingClientRect`, so
 * the shadows follow whatever the grid does at whatever breakpoint, and the copy
 * inside them is ordinary selectable text.
 */

/** Points sampled on the source. Fourteen is where the penumbra stops banding. */
const SAMPLES = 14;
/** Radius of the light, in pixels. This single number is the softness. */
const LIGHT_R = 26;
/** The golden angle. Successive samples land in each other's gaps, at every count. */
const GOLDEN = Math.PI * (3 - Math.sqrt(5));
/**
 * Distance at which the light has fallen to a quarter, from 1/(1 + r/R)². Real
 * inverse-square, softened at the origin so standing on the source is finite.
 */
const REFERENCE = 190;
/** Brightest the floor is allowed to get. Full white would clip the card borders. */
const PEAK = 0.85;
/** Stops used to sample the falloff curve into the gradient. */
const STOPS = 9;
/** How fast the light follows the pointer, per second. */
const LAG = 9;
/** Where the light rests with the pointer away, as a fraction of the height. */
const PARK = 0.13;
/**
 * Shadow volumes are extruded to five diagonals rather than to a guessed edge. The
 * far side of the volume is a chord across the arc it should be, and at five
 * diagonals that chord is outside the stage for anything up to a card subtending
 * 168° — which needs the light inside the card, where there is no shadow to draw.
 */
const REACH = 5;

interface Box {
  readonly left: number;
  readonly top: number;
  readonly width: number;
  readonly height: number;
}

interface ShadowState {
  /** Sample offsets on the source disc, as x, y pairs. Fixed for the lifetime. */
  readonly disc: Float64Array;
  /** The occluders, republished by the measure pass rather than copied into here. */
  readonly boxes: { current: readonly Box[] };
  /**
   * Where the occlusion is added up. A separate surface because canvas has no
   * subtractive blend: the mask is built with additive alpha, then taken out of the
   * light with one `destination-out`, which is a subtraction and is linear.
   */
  readonly mask: HTMLCanvasElement;
  readonly maskContext: CanvasRenderingContext2D;
  lightX: number;
  lightY: number;
  clock: number;
}

/*
 * Corner scratch, at module scope. `volume` runs once per card per sample — fifty-six
 * times a frame at four cards — and allocating a pair of arrays each time would hand
 * the collector a few thousand of them a second for no reason.
 */
const cornerX = new Float64Array(4);
const cornerY = new Float64Array(4);

/**
 * Add one card's shadow volume, seen from one point, to the current path.
 *
 * The volume is bounded by the two rays that graze the card — its silhouette from
 * that point. A corner is on the silhouette when every other corner lies on one
 * side of the ray to it, which is four cross products, and the two that qualify are
 * the two extremes. Ordering them so that `a` is the one with everything to its
 * left makes every quad wind the same way, which is what lets one path hold all of
 * them: a nonzero fill of same-wound polygons is their union, so two cards' umbras
 * overlapping does not darken twice.
 */
function volume(path: CanvasRenderingContext2D, box: Box, sx: number, sy: number, far: number) {
  const right = box.left + box.width;
  const bottom = box.top + box.height;
  cornerX[0] = box.left;
  cornerY[0] = box.top;
  cornerX[1] = right;
  cornerY[1] = box.top;
  cornerX[2] = right;
  cornerY[2] = bottom;
  cornerX[3] = box.left;
  cornerY[3] = bottom;

  let a = -1;
  let b = -1;
  for (let i = 0; i < 4; i++) {
    const dx = cornerX[i] - sx;
    const dy = cornerY[i] - sy;
    let ccw = false;
    let cw = false;
    for (let j = 0; j < 4; j++) {
      if (j === i) continue;
      const cross = dx * (cornerY[j] - sy) - dy * (cornerX[j] - sx);
      if (cross > 1e-9) cw = true;
      else if (cross < -1e-9) ccw = true;
    }
    if (!ccw) a = i;
    else if (!cw) b = i;
  }

  // No corner qualifies when the point is inside the card. A light inside an
  // occluder casts no shadow anything outside it could be standing in.
  if (a < 0 || b < 0) return;

  const ax = cornerX[a];
  const ay = cornerY[a];
  const bx = cornerX[b];
  const by = cornerY[b];
  const aScale = far / (Math.hypot(ax - sx, ay - sy) || 1e-6);
  const bScale = far / (Math.hypot(bx - sx, by - sy) || 1e-6);

  path.moveTo(ax, ay);
  path.lineTo(bx, by);
  path.lineTo(sx + (bx - sx) * bScale, sy + (by - sy) * bScale);
  path.lineTo(sx + (ax - sx) * aScale, sy + (ay - sy) * aScale);
  path.closePath();
}

function build(
  { width, height, dpr }: SceneSetupContext,
  boxes: { current: readonly Box[] },
): ShadowState {
  /*
   * The Vogel disc: radius as √(i/n) so the samples are spread by equal area rather
   * than equal radius, turned by the golden angle so each one lands in the gap the
   * others left. It is even at every count, which matters because fourteen is chosen
   * by eye and any other number has to look the same.
   */
  const disc = new Float64Array(SAMPLES * 2);
  for (let i = 0; i < SAMPLES; i++) {
    const radius = LIGHT_R * Math.sqrt((i + 0.5) / SAMPLES);
    const angle = i * GOLDEN;
    disc[i * 2] = Math.cos(angle) * radius;
    disc[i * 2 + 1] = Math.sin(angle) * radius;
  }

  const mask = document.createElement('canvas');
  mask.width = Math.max(1, Math.round(width * dpr));
  mask.height = Math.max(1, Math.round(height * dpr));
  const maskContext = mask.getContext('2d')!;
  // Same transform as the stage, so both are drawn in CSS pixels and the mask lines
  // up with the light without a scale factor anywhere in the drawing code.
  maskContext.setTransform(dpr, 0, 0, dpr, 0, 0);

  return {
    disc,
    boxes,
    mask,
    maskContext,
    lightX: width * 0.5,
    lightY: height * PARK,
    clock: 0,
  };
}

function paint({ context, width, height, dpr, state, pointer }: SceneDrawContext<ShadowState>) {
  const now = performance.now();
  const elapsed = state.clock ? Math.min(0.05, (now - state.clock) / 1000) : 1 / 60;
  state.clock = now;

  /*
   * Everything geometric is derived from the live size rather than kept on the state,
   * so a resize needs nothing kept in step: the extrusion length and the falloff
   * range are recomputed per frame, which is two square roots.
   */
  const span = Math.hypot(width, height);
  const far = span * REACH;

  /*
   * The light follows the pointer through a first-order lag, and returns to its park
   * when the pointer leaves rather than staying where the cursor last was. The
   * coefficient is 1 − e^(−k·dt) rather than k·dt, so the approach is identical at
   * any frame rate instead of merely close at sixty.
   */
  const wantX = pointer.inside ? pointer.x : width * 0.5;
  const wantY = pointer.inside ? pointer.y : height * PARK;
  const follow = 1 - Math.exp(-elapsed * LAG);
  state.lightX += (wantX - state.lightX) * follow;
  state.lightY += (wantY - state.lightY) * follow;

  const lx = state.lightX;
  const ly = state.lightY;
  const boxes = state.boxes.current;

  context.clearRect(0, 0, width, height);

  /*
   * The light on the floor, at full strength. One gradient for the whole frame: the
   * samples all sit inside a twenty-six pixel disc, so they share their distance to
   * any point on the stage to well under a percent and only their *geometry*
   * differs. The penumbra is the exact thing being computed here; the 1/r² weight is
   * the thing being shared.
   */
  const glow = context.createRadialGradient(lx, ly, 0, lx, ly, span);
  for (let s = 0; s <= STOPS; s++) {
    const at = s / STOPS;
    const fall = 1 + (at * span) / REFERENCE;
    glow.addColorStop(at, `rgba(255,246,232,${(PEAK / (fall * fall)).toFixed(4)})`);
  }
  context.fillStyle = glow;
  context.fillRect(0, 0, width, height);

  if (boxes.length) {
    const mask = state.maskContext;
    // Setting either dimension resets the transform, so the scale goes back on.
    const wide = Math.max(1, Math.round(width * dpr));
    const tall = Math.max(1, Math.round(height * dpr));
    if (state.mask.width !== wide || state.mask.height !== tall) {
      state.mask.width = wide;
      state.mask.height = tall;
      mask.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    /*
     * The occluded fraction, added up. `lighter` adds alpha, so fourteen fills at
     * 1/14 reach exactly 1 where all fourteen samples are hidden and exactly k/14
     * where k are — which is the definition of the penumbra, not an approximation of
     * one. Each sample is a single path holding every card's volume, filled once, so
     * the nonzero winding unions them and no card's umbra is counted twice.
     */
    mask.globalCompositeOperation = 'source-over';
    mask.clearRect(0, 0, width, height);
    mask.globalCompositeOperation = 'lighter';
    mask.fillStyle = `rgba(0,0,0,${(1 / SAMPLES).toFixed(5)})`;
    for (let i = 0; i < SAMPLES; i++) {
      const sx = lx + state.disc[i * 2];
      const sy = ly + state.disc[i * 2 + 1];
      mask.beginPath();
      for (const box of boxes) volume(mask, box, sx, sy, far);
      mask.fill();
    }

    // Subtract it. `destination-out` scales the light by 1 − occluded, and the dark
    // page behind the canvas is what shows through: the ambient term, unlit.
    context.globalCompositeOperation = 'destination-out';
    context.drawImage(state.mask, 0, 0, width, height);
    context.globalCompositeOperation = 'source-over';
  }

  // The source itself, which nothing occludes. Drawn after the subtraction so the
  // lamp is not standing in its own shadow when it passes behind a card.
  context.globalCompositeOperation = 'lighter';
  const size = LIGHT_R * 2.8;
  const core = context.createRadialGradient(lx, ly, 0, lx, ly, size);
  core.addColorStop(0, 'rgba(255,248,235,0.85)');
  core.addColorStop(0.3, 'rgba(255,232,192,0.22)');
  core.addColorStop(1, 'rgba(255,232,192,0)');
  context.fillStyle = core;
  context.fillRect(lx - size, ly - size, size * 2, size * 2);
  context.globalCompositeOperation = 'source-over';
}

const FEATURES = [
  {
    title: 'Edge functions',
    body: 'Deployed to thirty-one regions. Cold start under a millisecond, because there is no cold.',
  },
  {
    title: 'Instant rollback',
    body: 'Every deploy keeps its own immutable URL. Reverting is choosing an older one.',
  },
  {
    title: 'Typed queries',
    body: 'The schema generates the client. A column you renamed fails at compile time, not at 3am.',
  },
  {
    title: 'Usage that adds up',
    body: 'Metered per request and per gigabyte, invoiced to the cent, with the maths shown.',
  },
];

export type ShadowCasterProps = {
  /**
   * The 298x240 catalogue-card variant: the copy dropped, the row of occluders and the
   * light given the whole box. Presentation only, and all of it CSS. Nothing this
   * component renders is focusable — the stage is a canvas and four articles of copy —
   * so there is no control in here that needs `tabIndex={-1}` under the card's
   * `aria-hidden`.
   */
  compact?: boolean;
};

/**
 * The canvas is the floor and the cards stand on it.
 *
 * The stage is first in the DOM and absolutely filled, so it takes every pointer
 * event; the grid is a later sibling and paints over it. The cards are
 * `pointer-events: none` — they are copy, not controls — which is what lets the
 * light keep following the pointer while it is over one of them.
 */
export function ShadowCaster({ compact = false }: ShadowCasterProps) {
  const frame = useRef<HTMLDivElement | null>(null);
  const grid = useRef<HTMLDivElement | null>(null);
  /*
   * The occluders live in a ref the scene holds rather than in scene state, because
   * the measure pass and the draw loop have different lifetimes: re-measuring must
   * not mean rebuilding the light.
   */
  const boxes = useRef<readonly Box[]>([]);

  const { stageRef, canvasRef, requestRender } = useCanvasScene<ShadowState>({
    setup: (scene) => build(scene, boxes),
    draw: paint,
  });

  /*
   * The cards' own boxes, relative to the stage. Read from the DOM rather than
   * computed from the grid definition, so the shadows are correct at any breakpoint,
   * at any font size, and after any reflow — including the one where the copy wraps
   * to a third line and the card grows. The stage carries no border, so its bounding
   * rect and the canvas's own origin are the same point.
   */
  const measure = useCallback(() => {
    const host = frame.current;
    const list = grid.current;
    if (!host || !list) return;
    const origin = host.getBoundingClientRect();
    boxes.current = Array.from(list.children).map((child) => {
      const rect = child.getBoundingClientRect();
      return {
        left: rect.left - origin.left,
        top: rect.top - origin.top,
        width: rect.width,
        height: rect.height,
      };
    });
    requestRender();
  }, [requestRender]);

  useEffect(() => {
    measure();

    // Watching each card as well as the stage: a card can change height on its own
    // when its text rewraps, at a stage width that never changed.
    const observer = new ResizeObserver(measure);
    if (frame.current) observer.observe(frame.current);
    if (grid.current) {
      for (const child of Array.from(grid.current.children)) observer.observe(child);
    }
    return () => observer.disconnect();
  }, [measure]);

  return (
    <div
      ref={frame}
      className="shadow-caster-stage"
      data-compact={compact ? 'true' : undefined}
    >
      <div ref={stageRef} className="shadow-caster-floor" aria-hidden="true">
        <canvas ref={canvasRef} />
      </div>

      <div className="shadow-caster-face">
        <p className="shadow-caster-eyebrow">Penumbra</p>
        <h2>Everything the platform does, and nothing it does not.</h2>

        <div ref={grid} className="shadow-caster-grid">
          {FEATURES.map((feature) => (
            <article key={feature.title} className="shadow-caster-card">
              <h3>{feature.title}</h3>
              <p>{feature.body}</p>
            </article>
          ))}
        </div>
      </div>

      <p className="shadow-caster-hint">Move the light</p>
    </div>
  );
}

export default ShadowCaster;
