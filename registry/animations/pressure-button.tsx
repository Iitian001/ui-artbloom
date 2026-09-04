'use client';

import './pressure-button.css';

import { useEffect, useRef, useState, type KeyboardEvent } from 'react';

import { useCanvasScene, useReducedMotion, type SceneDrawContext, type SceneSetupContext } from '@/hooks/use-canvas-scene';

/**
 * A primary call to action whose body is a pressurised softbody, so the pill resists a press
 * instead of merely animating one.
 *
 * Integrated per node: edge springs around a closed ring, weak anchor springs that remember the
 * pill, and a gas force on every edge — f = (P - P0) * L * n, with P = nRT / A and A the shoelace
 * area of the ring. The gas term is the component. Edge springs conserve perimeter, not area: the
 * folded, zero-area ring costs a loop of springs nothing, so a plate pressing the cap keeps
 * flattening it and the ring stays shut. P = nRT / A diverges as A goes to zero, so the more area
 * a press squeezes out the harder the inside shoves back, and it leaves by the only wall that is
 * free — which is why the waist bulges sideways while the cap is pinned. That bulge is off the
 * axis you pressed, and no easing curve on a scale transform will produce it.
 */

const STEP = 1 / 120;

/* Unit node mass throughout, so every constant here is already an acceleration. */
const NODES = 44;
const EDGE_K = 2600;
const EDGE_DAMP = 26;
/* Shape memory. Springs plus gas alone maximise area for a fixed perimeter, i.e. they round the
   pill into a circle within a second; these hold the stadium and nothing else. */
const ANCHOR_K = 700;
const DRAG = 12;
/* P0 = nRT / A0: the ambient the balloon sits in balance with, so the rest ring is exactly the
   pill and the net force is zero until something moves. Scaled by A0 in setup, which keeps the
   feel identical when the button is measured at a different size. */
const REST_PRESSURE = 1150;
const AREA_FLOOR = 0.22;
const PRESS_DEPTH = 9;
const PLATE_LIFTED = -1e6;
const PLATE_FRICTION = 0.98;
const POKE_RADIUS = 78;
const POKE_FORCE = 2700;
/* 0.2 s held then 0.1 s free, so the first painted frame is already at the top of a rebound. */
const WARM_HELD = 24;
const WARM_FREE = 12;
const RELAX_STEPS = 320;

interface State {
  clock: number;
  carry: number;
  px: Float64Array;
  py: Float64Array;
  vx: Float64Array;
  vy: Float64Array;
  ax: Float64Array;
  ay: Float64Array;
  rx: Float64Array;
  ry: Float64Array;
  len: Float64Array;
  /** nRT, plus the rest area and cap the whole press is measured against. */
  gas: number;
  area0: number;
  cap: number;
  /** Rest centroid and half-extents, so the label transform is exactly identity at rest. */
  cx: number;
  cy: number;
  halfW: number;
  halfH: number;
  over: number;
}

const clamp = (v: number, lo: number, hi: number): number => Math.min(hi, Math.max(lo, v));

/**
 * Evenly spaced by arc length around a stadium, so no edge starts shorter than its neighbours —
 * unequal rest lengths make one side of the ring stiffer and the balloon bulges lopsided.
 */
const ringPoint = (t: number, x: number, y: number, w: number, h: number, r: number, out: Float64Array): void => {
  const flat = Math.max(w - 2 * r, 0);
  const arc = Math.PI * r;
  if (t < flat) {
    out[0] = x + r + t;
    out[1] = y;
  } else if (t < flat + arc) {
    const a = (t - flat) / r - Math.PI / 2;
    out[0] = x + w - r + Math.cos(a) * r;
    out[1] = y + r + Math.sin(a) * r;
  } else if (t < 2 * flat + arc) {
    out[0] = x + w - r - (t - flat - arc);
    out[1] = y + h;
  } else {
    const a = (t - 2 * flat - arc) / r + Math.PI / 2;
    out[0] = x + r + Math.cos(a) * r;
    out[1] = y + r + Math.sin(a) * r;
  }
};

const resetRing = (s: State): void => {
  for (let i = 0; i < s.px.length; i += 1) {
    s.px[i] = s.rx[i];
    s.py[i] = s.ry[i];
    s.vx[i] = 0;
    s.vy[i] = 0;
  }
};

/** One fixed substep of the ring: springs, gas, the plate contact, then semi-implicit Euler. */
const advance = (s: State, plate: number, poking: boolean, pokeX: number, pokeY: number): void => {
  const { px, py, vx, vy, ax, ay, rx, ry, len } = s;
  const count = px.length;

  let signed = 0;
  for (let i = 0; i < count; i += 1) {
    const j = i + 1 === count ? 0 : i + 1;
    signed += px[i] * py[j] - px[j] * py[i];
  }
  signed *= 0.5;
  /* The area is the one scalar every node reads, so it is guarded before the per-node repair below
     rather than after: a single non-finite coordinate poisons the sum, and `over` is written from it
     and handed to addColorStop as an alpha, which throws on NaN and takes the whole frame with it. */
  if (!Number.isFinite(signed)) {
    signed = s.area0;
  }
  /* Sign of the shoelace sum, not an assumed winding: it is what keeps the normals pointing out
     even if a hard press turns the ring inside out for a frame. */
  const orient = signed >= 0 ? 1 : -1;
  const area = Math.max(Math.abs(signed), s.area0 * AREA_FLOOR);
  const dp = s.gas / area - s.gas / s.area0;
  s.over = (dp * s.area0) / s.gas;

  ax.fill(0);
  ay.fill(0);

  for (let i = 0; i < count; i += 1) {
    const j = i + 1 === count ? 0 : i + 1;
    const dx = px[j] - px[i];
    const dy = py[j] - py[i];
    const d = Math.sqrt(dx * dx + dy * dy) || 1e-6;
    const nx = dx / d;
    const ny = dy / d;
    const along = (vx[j] - vx[i]) * nx + (vy[j] - vy[i]) * ny;
    const f = EDGE_K * (d - len[i]) + EDGE_DAMP * along;
    ax[i] += f * nx;
    ay[i] += f * ny;
    ax[j] -= f * nx;
    ay[j] -= f * ny;
    /* (P - P0) * L * n, split between the two ends. The L cancels the 1/L inside the unit normal,
       so the gas term never divides by an edge length and a collapsed edge cannot produce a NaN. */
    const gx = dp * orient * dy * 0.5;
    const gy = dp * orient * -dx * 0.5;
    ax[i] += gx;
    ay[i] += gy;
    ax[j] += gx;
    ay[j] += gy;
  }

  for (let i = 0; i < count; i += 1) {
    ax[i] += (rx[i] - px[i]) * ANCHOR_K - vx[i] * DRAG;
    ay[i] += (ry[i] - py[i]) * ANCHOR_K - vy[i] * DRAG;
    if (poking) {
      const dx = px[i] - pokeX;
      const dy = py[i] - pokeY;
      const d2 = dx * dx + dy * dy;
      if (d2 < POKE_RADIUS * POKE_RADIUS && d2 > 1e-4) {
        const d = Math.sqrt(d2);
        const push = (POKE_FORCE * (1 - d / POKE_RADIUS)) / d;
        ax[i] += dx * push;
        ay[i] += dy * push;
      }
    }

    vx[i] += ax[i] * STEP;
    vy[i] += ay[i] * STEP;
    px[i] += vx[i] * STEP;
    py[i] += vy[i] * STEP;

    /* The finger is a rigid plate, so contact is a projection: the node stops at the plate and
       loses the velocity it was carrying into it. Nothing is added, so no press can inject energy.
       While lifted the plate sits far above the stage, which is what lets the cap overshoot. */
    if (py[i] < plate) {
      py[i] = plate;
      if (vy[i] < 0) {
        vy[i] = 0;
      }
      vx[i] *= PLATE_FRICTION;
    }

    /* One bad frame — a resize mid-substep, a tab restored after an hour — would otherwise leave a
       NaN in the ring that every later step multiplies forward. Snap that node home instead. */
    if (!Number.isFinite(px[i]) || !Number.isFinite(py[i])) {
      px[i] = rx[i];
      py[i] = ry[i];
      vx[i] = 0;
      vy[i] = 0;
    }
  }
};

/** `compact` is the 298x240 catalogue card: the section copy goes and the pill is
 *  centred as the whole subject. Presentation only — see `pressure-button.css`. */
export type PressureButtonProps = { compact?: boolean };

export function PressureButton({ compact = false }: PressureButtonProps) {
  const reduced = useReducedMotion();
  const [held, setHeld] = useState(false);
  const [queued, setQueued] = useState(false);
  const ctaRef = useRef<HTMLButtonElement | null>(null);
  const labelRef = useRef<HTMLSpanElement | null>(null);

  const setup = (c: SceneSetupContext): State => {
    /* Measured every time, never cached: setup re-runs on resize, and the whole point is that the
       ring wraps the real button box wherever the hero copy above it happens to push it. The stage
       carries no border, so its client rect and the canvas origin are the same point. */
    const el = ctaRef.current;
    const host = el ? el.closest('.pressure-button-stage') : null;
    let bw = Math.max(96, Math.min(216, c.width - 56));
    let bh = 52;
    let bx = (c.width - bw) / 2;
    let by = c.height * 0.6;
    if (el && host) {
      const box = el.getBoundingClientRect();
      const frame = host.getBoundingClientRect();
      if (box.width > 8 && box.height > 8) {
        bw = box.width;
        bh = box.height;
        bx = box.left - frame.left;
        by = box.top - frame.top;
      }
    }

    const r = Math.max(1, Math.min(bw, bh) / 2);
    const per = 2 * Math.max(bw - 2 * r, 0) + 2 * Math.PI * r;
    const px = new Float64Array(NODES);
    const py = new Float64Array(NODES);
    const vx = new Float64Array(NODES);
    const vy = new Float64Array(NODES);
    const ax = new Float64Array(NODES);
    const ay = new Float64Array(NODES);
    const rx = new Float64Array(NODES);
    const ry = new Float64Array(NODES);
    const len = new Float64Array(NODES);
    const out = new Float64Array(2);
    for (let i = 0; i < NODES; i += 1) {
      ringPoint((per * i) / NODES, bx, by, bw, bh, r, out);
      rx[i] = out[0];
      ry[i] = out[1];
      px[i] = out[0];
      py[i] = out[1];
    }

    /* A0 comes from the sampled polygon, not from the ideal stadium: the solver only ever sees the
       shoelace area of these 44 points, and a mismatch of even a percent would leave the ring
       breathing outward on the first frame with nothing touching it. */
    let signed = 0;
    let cx = 0;
    let cy = 0;
    for (let i = 0; i < NODES; i += 1) {
      const j = i + 1 === NODES ? 0 : i + 1;
      signed += rx[i] * ry[j] - rx[j] * ry[i];
      len[i] = Math.hypot(rx[j] - rx[i], ry[j] - ry[i]);
      cx += rx[i];
      cy += ry[i];
    }
    const area0 = Math.max(Math.abs(signed * 0.5), 1);

    const state: State = {
      clock: 0,
      carry: 0,
      px, py, vx, vy, ax, ay, rx, ry, len,
      gas: REST_PRESSURE * area0,
      area0,
      cap: by,
      cx: cx / NODES,
      cy: cy / NODES,
      halfW: Math.max(bw, 1) / 2,
      halfH: Math.max(bh, 1) / 2,
      over: 0,
    };

    for (let i = 0; i < WARM_HELD; i += 1) {
      advance(state, by + PRESS_DEPTH, false, 0, 0);
    }
    for (let i = 0; i < WARM_FREE; i += 1) {
      advance(state, PLATE_LIFTED, false, 0, 0);
    }
    return state;
  };

  const draw = ({ context, width, height, state, pointer }: SceneDrawContext<State>) => {
    if (!context) {
      return;
    }
    const now = performance.now() / 1000;
    const dt = state.clock === 0 ? 0 : Math.min(0.05, now - state.clock);
    state.clock = now;
    const plate = held ? state.cap + PRESS_DEPTH : PLATE_LIFTED;

    if (reduced) {
      /* No loop runs, so this frame has to be the whole truth: relax the real ring from rest until
         the gas and the springs stop arguing, and paint that equilibrium. */
      resetRing(state);
      for (let i = 0; i < RELAX_STEPS; i += 1) {
        advance(state, plate, false, 0, 0);
      }
    } else {
      state.carry += dt;
      let n = 0;
      while (state.carry >= STEP && n < 8) {
        advance(state, plate, pointer.down && pointer.inside, pointer.x, pointer.y);
        state.carry -= STEP;
        n += 1;
      }
      if (n === 8) {
        state.carry = 0;
      }
    }

    const { px, py } = state;
    let cx = 0;
    let cy = 0;
    let minX = px[0];
    let maxX = px[0];
    let minY = py[0];
    let maxY = py[0];
    for (let i = 0; i < NODES; i += 1) {
      cx += px[i];
      cy += py[i];
      minX = Math.min(minX, px[i]);
      maxX = Math.max(maxX, px[i]);
      minY = Math.min(minY, py[i]);
      maxY = Math.max(maxY, py[i]);
    }
    cx /= NODES;
    cy /= NODES;
    /* A0 / A - 1, straight off the solver: the only thing driving the colour is the compression. */
    const glow = clamp(state.over * 2.6, 0, 1);
    const span = Math.max(maxY - minY, 1);

    context.clearRect(0, 0, width, height);

    /* Contact shadow. It tightens as the ring compresses because the cap is closer to the page —
       same number driving it as the fill, so the two can never disagree. */
    const shadowY = maxY + 9;
    const shadowR = Math.max((maxX - minX) * 0.56, 1);
    const shade = context.createRadialGradient(cx, shadowY, 0, cx, shadowY, shadowR);
    shade.addColorStop(0, `rgba(1, 9, 7, ${0.5 + glow * 0.22})`);
    shade.addColorStop(1, 'rgba(1, 9, 7, 0)');
    context.save();
    context.translate(cx, shadowY);
    context.scale(1, Math.max(0.14, 0.3 - glow * 0.12));
    context.translate(-cx, -shadowY);
    context.beginPath();
    context.arc(cx, shadowY, shadowR, 0, Math.PI * 2);
    context.fillStyle = shade;
    context.fill();
    context.restore();

    /* Quadratics through the edge midpoints: 44 nodes drawn as straight chords read as a faceted
       gem when the waist bulges, and the facets flicker as nodes cross. */
    context.beginPath();
    context.moveTo((px[NODES - 1] + px[0]) * 0.5, (py[NODES - 1] + py[0]) * 0.5);
    for (let i = 0; i < NODES; i += 1) {
      const j = i + 1 === NODES ? 0 : i + 1;
      context.quadraticCurveTo(px[i], py[i], (px[i] + px[j]) * 0.5, (py[i] + py[j]) * 0.5);
    }
    context.closePath();

    const body = context.createLinearGradient(0, minY, 0, minY + span);
    body.addColorStop(0, `rgba(172, 255, 228, ${0.3 + glow * 0.34})`);
    body.addColorStop(1, `rgba(88, 220, 186, ${0.12 + glow * 0.26})`);
    context.fillStyle = body;
    context.fill();
    context.lineWidth = 1.4;
    context.strokeStyle = `rgba(198, 255, 236, ${0.5 + glow * 0.42})`;
    context.stroke();

    context.save();
    context.clip();
    const sheen = context.createLinearGradient(0, minY, 0, minY + span * 0.62);
    sheen.addColorStop(0, 'rgba(255, 255, 255, 0.2)');
    sheen.addColorStop(1, 'rgba(255, 255, 255, 0)');
    context.fillStyle = sheen;
    context.fillRect(minX - 2, minY - 2, maxX - minX + 4, span + 4);
    context.restore();

    /* The label rides the shape rather than the state: it takes the ring's own centroid and its own
       extents, so it sinks and squashes with the cap and springs back on the overshoot. */
    const label = labelRef.current;
    if (label) {
      const sx = clamp((maxX - minX) / (state.halfW * 2), 0.72, 1.24);
      const sy = clamp(span / (state.halfH * 2), 0.72, 1.24);
      const dx = (cx - state.cx).toFixed(2);
      const dy = (cy - state.cy).toFixed(2);
      label.style.transform = `translate(${dx}px, ${dy}px) scale(${sx.toFixed(3)}, ${sy.toFixed(3)})`;
    }
  };

  const { stageRef, canvasRef, requestRender } = useCanvasScene<State>({ setup, draw });
  useEffect(() => requestRender(), [held, reduced, requestRender]);

  const release = () => setHeld(false);
  /* Space and Enter are the press, not just the activation: a native button fires click for both,
     but neither gives you a held state, and without one a keyboard user sees no squash at all. */
  const press = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === ' ' || event.key === 'Enter') {
      setHeld(true);
    }
  };

  return (
    <div className="pressure-button-stage" data-compact={compact ? 'true' : undefined}>
      <div ref={stageRef} className="pressure-button-surface">
        <canvas ref={canvasRef} aria-hidden="true" />
      </div>
      <div className="pressure-button-content">
        <p className="pressure-button-eyebrow">Release 4.2</p>
        <h3 className="pressure-button-title">Push the build to the edge.</h3>
        <p className="pressure-button-copy">
          Three regions, one press. Hold it and the gas inside the button pushes back — the cap
          flattens, the waist bulges out, and the label goes down with it.
        </p>
        <button
          ref={ctaRef}
          type="button"
          className="pressure-button-cta"
          // The only focusable node in here, and in a card it leaves the tab order:
          // the frame is aria-hidden, and a focusable node inside one is a trap with
          // no name. Press, hold, drag and click all still land — only Tab is gone.
          tabIndex={compact ? -1 : undefined}
          onPointerDown={() => setHeld(true)}
          onPointerUp={release}
          onPointerLeave={release}
          onPointerCancel={release}
          onKeyDown={press}
          onKeyUp={release}
          onBlur={release}
          onClick={() => setQueued((on) => !on)}
        >
          <span ref={labelRef} className="pressure-button-label">
            {queued ? 'Cancel deploy' : 'Deploy to edge'}
          </span>
        </button>
        <p className="pressure-button-note" role="status" data-queued={queued ? 'true' : 'false'}>
          {queued ? 'Queued · 3 regions · 12s' : 'No deploy queued.'}
        </p>
      </div>
      <p className="pressure-button-hint">press and hold · drag to dent</p>
    </div>
  );
}

export default PressureButton;
