'use client';

import './heat-grid.css';

import { useEffect, useRef, useState, type KeyboardEvent } from 'react';

import {
  useCanvasScene,
  useReducedMotion,
  type SceneDrawContext,
  type SceneSetupContext,
} from '@/hooks/use-canvas-scene';

/**
 * A contribution calendar whose cells are a live temperature field.
 *
 * The glow under the cursor is the 2D heat equation dT/dt = alpha * lap(T) - k * T, integrated on the
 * cell lattice by explicit finite difference at a fixed step. Explicit FD is the honest cheap solver
 * for 182 cells, but it is only conditionally stable: with r = alpha * dt / dx^2 the discrete Fourier
 * factor is 1 + r * (2 cos kx + 2 cos ky - 4), which at the checkerboard mode kx = ky = pi is 1 - 8r.
 * The familiar 1D number r = 1/2 makes that -3, so every step multiplies alternating cells by minus
 * three and the grid tears into a flickering chequerboard inside half a second. R below is pinned to
 * 0.2, under the 2D ceiling of 1/4. Tweening each cell's opacity cannot stand in for this: a tween
 * never hands heat to the neighbour, and cell-to-cell transport is the entire picture.
 *
 * Boundaries are insulated (Neumann) by mirroring: the stencil reads a ghost cell equal to the edge
 * cell, so wall flux is exactly zero and interior fluxes cancel in pairs. Heat is conserved apart
 * from the one explicit sink, -k * T, radiating each cell back to its ambient — and ambient is the
 * recorded activity, which is why the grid reads as a plain, usable heatmap when left alone.
 */

const COLS = 26;
const ROWS = 7;
const CELLS = COLS * ROWS;

const STEP = 1 / 120;
const R = 0.2; // alpha * dt / dx^2, dx = 1 cell; 1/4 is the 2D explicit stability ceiling
const COOL = 3.4; // 1/s radiative pull back to ambient: a ~0.3 s decay, so the trail dies fast
const BRUSH = 6.2; // K/s injected under a moving pointer
const HOLD = 2.4; // multiplier while pressed, which is what makes a held source read as held
const SPREAD = 1.9; // squared brush radius, in cells
const KICK = 0.9; // impulse dropped by a keyboard step
const GAIN = 0.8; // temperature to ramp units
const WARM = 26; // setup pulse length in steps: 0.22 s, hot enough to see, short of saturation

const PAD = 18;
const HEAD = 78; // matches .heat-grid-content min-height; the calendar starts under the header
const MONTH_H = 15;
const LEGEND_H = 30;
const FOOT = 26;
const LABEL_W = 28;

// Six stops, flat so the lookup is a typed-array read. Ambient slate, then ember, then filament.
const STOPS = new Float64Array([
  22, 25, 32, 74, 44, 24, 138, 70, 22, 206, 112, 26, 244, 164, 74, 255, 226, 168,
]);
const SEGS = 5;

const ramp = (t: number): string => {
  const x = t > 0 ? (t < 1 ? t : 1) : 0; // the ternary order also turns a stray NaN into 0
  const f = x * SEGS;
  const s = Math.min(SEGS - 1, Math.floor(f));
  const k = f - s;
  const a = s * 3;
  const b = a + 3;
  const r = Math.round(STOPS[a] + (STOPS[b] - STOPS[a]) * k);
  const g = Math.round(STOPS[a + 1] + (STOPS[b + 1] - STOPS[a + 1]) * k);
  const l = Math.round(STOPS[a + 2] + (STOPS[b + 2] - STOPS[a + 2]) * k);
  return `rgb(${r}, ${g}, ${l})`;
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const DAY_MS = 86400000;
const START = Date.UTC(2026, 2, 9); // a Monday, so row 0 is Monday for all 26 columns

// Sim index is row-major (r * COLS + c); the date runs down each week column, so day = c * 7 + r.
const dateOf = (i: number): Date =>
  new Date(START + ((i % COLS) * 7 + Math.floor(i / COLS)) * DAY_MS);

const mix = (n: number): number => {
  let x = Math.imul(n ^ 0x9e3779b9, 0x85ebca6b);
  x = Math.imul(x ^ (x >>> 13), 0xc2b2ae35);
  return ((x ^ (x >>> 16)) >>> 0) / 4294967296;
};

const COUNTS = new Int16Array(CELLS);
const AMBIENT = new Float64Array(CELLS);
let total = 0;
for (let i = 0; i < CELLS; i += 1) {
  const row = Math.floor(i / COLS);
  const q = mix((i % COLS) * 7 + row);
  const n = Math.floor(q * q * (row > 4 ? 6 : 19)) + (q > 0.87 ? 11 : 0);
  COUNTS[i] = n;
  AMBIENT[i] = Math.min(1, n / 14) * 0.62; // the data owns the lower ramp; heat owns the top
  total += n;
}
const TOTAL = total.toLocaleString('en-US');
const TODAY = 4 * COLS + (COLS - 1); // Friday of the newest week

interface State {
  clock: number;
  carry: number;
  u: Float64Array; // excess temperature over ambient, in ramp units
  next: Float64Array;
  src: Float64Array; // injection rate per cell, rebuilt every frame
  x0: number;
  y0: number;
  pitch: number;
  size: number;
  wasDown: boolean;
  snap: boolean;
}

const advance = (s: State): void => {
  const u = s.u;
  const n = s.next;
  for (let r = 0; r < ROWS; r += 1) {
    // The mirrored ghost cell: at a wall the offset collapses to 0, so the stencil reads this cell
    // in place of the missing neighbour and the wall flux is identically zero. Without the mirror the
    // four edges leak into nothing and the top row would read colder than the middle for no reason.
    const up = r > 0 ? -COLS : 0;
    const dn = r < ROWS - 1 ? COLS : 0;
    for (let c = 0; c < COLS; c += 1) {
      const i = r * COLS + c;
      const lf = c > 0 ? -1 : 0;
      const rt = c < COLS - 1 ? 1 : 0;
      const lap = u[i + lf] + u[i + rt] + u[i + up] + u[i + dn] - 4 * u[i];
      const v = u[i] + R * lap - STEP * COOL * u[i] + STEP * s.src[i];
      // Every source is positive, so u >= 0 holds analytically; the clamp is only here so a single
      // bad float can never take up permanent residence in the field.
      n[i] = v > 0 ? Math.min(v, 4) : 0;
    }
  }
  s.u = n;
  s.next = u;
};

const paint = (s: State, cx: number, cy: number, rate: number): void => {
  const c1 = Math.max(0, Math.ceil(cx - 2));
  const c2 = Math.min(COLS - 1, Math.floor(cx + 2));
  const r1 = Math.max(0, Math.ceil(cy - 2));
  const r2 = Math.min(ROWS - 1, Math.floor(cy + 2));
  for (let r = r1; r <= r2; r += 1) {
    const dy = r - cy;
    for (let c = c1; c <= c2; c += 1) {
      const dx = c - cx;
      s.src[r * COLS + c] += rate * Math.exp(-(dx * dx + dy * dy) / SPREAD);
    }
  }
};

/** A held source at one cell for `steps` steps, then released. Shared by setup and reduced motion. */
const pulse = (s: State, i: number, steps: number): void => {
  paint(s, i % COLS, Math.floor(i / COLS), BRUSH * HOLD);
  for (let k = 0; k < steps; k += 1) {
    advance(s);
  }
  s.src.fill(0);
};

const MONO = 'ui-monospace, SFMono-Regular, Menlo, monospace';
const MUTED = '#6d7382';

const render = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  s: State,
  sel: number,
): void => {
  ctx.fillStyle = '#0b0d12';
  ctx.fillRect(0, 0, width, height);

  const { x0, y0, pitch, size } = s;

  // Squares, never ctx.roundRect: its typing moves between DOM library versions.
  for (let i = 0; i < CELLS; i += 1) {
    ctx.fillStyle = ramp(AMBIENT[i] + s.u[i] * GAIN);
    ctx.fillRect(x0 + (i % COLS) * pitch, y0 + Math.floor(i / COLS) * pitch, size, size);
  }

  ctx.lineWidth = 1.5;
  ctx.strokeStyle = 'rgba(236, 238, 243, 0.86)';
  const sx = x0 + (sel % COLS) * pitch;
  const sy = y0 + Math.floor(sel / COLS) * pitch;
  ctx.strokeRect(sx - 1.5, sy - 1.5, size + 3, size + 3);

  ctx.font = `500 10px ${MONO}`;
  ctx.fillStyle = MUTED;
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'right';
  for (let r = 0; r < ROWS; r += 2) {
    ctx.fillText(WEEKDAYS[r], x0 - 8, y0 + r * pitch + size / 2);
  }

  ctx.textAlign = 'left';
  let seen = dateOf(0).getUTCMonth();
  let mark = -9;
  for (let c = 1; c < COLS; c += 1) {
    const m = dateOf(c).getUTCMonth();
    if (m !== seen) {
      seen = m;
      if (c - mark >= 3) {
        ctx.fillText(MONTHS[m], x0 + c * pitch, y0 - MONTH_H / 2);
        mark = c;
      }
    }
  }

  // The legend is the cells' own ramp function sampled across its whole range, so a hot cell can be
  // read off it instead of being an unexplained bright square.
  const ly = y0 + ROWS * pitch + LEGEND_H / 2;
  const sw = Math.max(7, Math.min(12, size * 0.55));
  ctx.font = `500 9px ${MONO}`;
  ctx.fillText('AMBIENT', x0, ly);
  let lx = x0 + ctx.measureText('AMBIENT').width + 9;
  for (let k = 0; k < 6; k += 1) {
    ctx.fillStyle = ramp(k / SEGS);
    ctx.fillRect(lx, ly - sw / 2, sw, sw);
    lx += sw + 3;
  }
  ctx.fillStyle = MUTED;
  ctx.fillText('HOT', lx + 5, ly);
};

/** `compact` is the 298x240 catalogue card: the same field, solved by the same explicit
 *  step, with the header cut to one line along the bottom so the calendar is the whole
 *  subject. Presentation only — see `heat-grid.css`. */
export type HeatGridProps = { compact?: boolean };

export function HeatGrid({ compact = false }: HeatGridProps) {
  const reduced = useReducedMotion();
  const [sel, setSel] = useState(TODAY);
  const kick = useRef<number | null>(null);

  const setup = ({ width, height }: SceneSetupContext): State => {
    const gw = Math.max(1, width - PAD * 2 - LABEL_W);
    const gh = Math.max(1, height - HEAD - MONTH_H - LEGEND_H - FOOT);
    const pitch = Math.max(4, Math.min(gw / COLS, gh / ROWS)); // square cells, never a zero divisor
    const s: State = {
      clock: 0,
      carry: 0,
      u: new Float64Array(CELLS),
      next: new Float64Array(CELLS),
      src: new Float64Array(CELLS),
      x0: PAD + LABEL_W + Math.max(0, (gw - pitch * COLS) / 2),
      y0: HEAD + MONTH_H + Math.max(0, (gh - pitch * ROWS) / 2),
      pitch,
      size: pitch - Math.max(1, Math.min(4, pitch * 0.17)),
      wasDown: false,
      snap: reduced,
    };
    // Warm the real solver before the first paint. A reader scrolling a gallery gets a pulse already
    // spreading and dying on the newest week, rather than a still grid waiting to be touched.
    pulse(s, sel, WARM);
    return s;
  };

  const draw = ({ context, width, height, state, pointer }: SceneDrawContext<State>) => {
    // Refreshed every frame, not just in setup: the preference can flip without a resize.
    state.snap = reduced;
    const now = performance.now() / 1000;
    const dt = state.clock === 0 ? 0 : Math.min(0.05, now - state.clock);
    state.clock = now;

    const cx = (pointer.x - state.x0 - state.size / 2) / state.pitch;
    const cy = (pointer.y - state.y0 - state.size / 2) / state.pitch;
    const over = pointer.inside && cx > -1.5 && cx < COLS + 0.5 && cy > -1.5 && cy < ROWS + 0.5;
    const hit = kick.current;
    kick.current = null;

    if (state.snap) {
      // No loop to spread anything over time, so a keyboard step resolves at once: clear the field
      // and run the same held source for the same number of steps setup used.
      if (hit !== null) {
        state.u.fill(0);
        pulse(state, hit, WARM);
      }
    } else {
      state.src.fill(0);
      if (over) {
        paint(state, cx, cy, pointer.down ? BRUSH * HOLD : BRUSH);
      }
      if (hit !== null) {
        state.u[hit] += KICK; // a keypress is a discrete impulse, not a rate held over a frame
      }
      state.carry += dt;
      let n = 0;
      while (state.carry >= STEP && n < 8) {
        advance(state);
        state.carry -= STEP;
        n += 1;
      }
      if (n === 8) {
        state.carry = 0; // a backgrounded tab must not come back owing 400 steps
      }
    }

    if (pointer.down && !state.wasDown && over) {
      const c = Math.min(COLS - 1, Math.max(0, Math.round(cx)));
      const r = Math.min(ROWS - 1, Math.max(0, Math.round(cy)));
      if (r * COLS + c !== sel) {
        setSel(r * COLS + c);
      }
    }
    state.wasDown = pointer.down;

    render(context, width, height, state, sel);
  };

  const { stageRef, canvasRef, requestRender } = useCanvasScene<State>({ setup, draw });
  useEffect(() => requestRender(), [reduced, requestRender]);

  const step = (dc: number, dr: number): void => {
    const c = Math.min(COLS - 1, Math.max(0, (sel % COLS) + dc));
    const r = Math.min(ROWS - 1, Math.max(0, Math.floor(sel / COLS) + dr));
    kick.current = r * COLS + c;
    setSel(r * COLS + c);
    requestRender();
  };

  const onKey = (event: KeyboardEvent<HTMLButtonElement>): void => {
    const dc = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
    const dr = event.key === 'ArrowDown' ? 1 : event.key === 'ArrowUp' ? -1 : 0;
    if (dc === 0 && dr === 0) {
      return;
    }
    event.preventDefault();
    step(dc, dr);
  };

  const day = dateOf(sel);
  const count = COUNTS[sel];
  const stamp = `${WEEKDAYS[Math.floor(sel / COLS)]} ${day.getUTCDate()} ${MONTHS[day.getUTCMonth()]}`;

  return (
    <div className="heat-grid-stage" data-compact={compact ? 'true' : undefined}>
      <div ref={stageRef} className="heat-grid-surface">
        <canvas ref={canvasRef} aria-hidden="true" />
      </div>
      <div className="heat-grid-content">
        <div className="heat-grid-titles">
          <h3 className="heat-grid-title">Deploy activity</h3>
          <p className="heat-grid-meta">{TOTAL} deploys in 26 weeks, diffusing at 24 cells²/s</p>
        </div>
        {/* Still clickable in a card, and clicking it still drops heat on the probed
            day, but out of the tab order: the card frame is aria-hidden, and a focusable
            node inside one is a trap with no label. */}
        <button
          type="button"
          className="heat-grid-probe"
          tabIndex={compact ? -1 : undefined}
          aria-keyshortcuts="ArrowUp ArrowDown ArrowLeft ArrowRight"
          aria-label={`Heat ${stamp}, ${count} deploys. Arrow keys move the probe.`}
          onClick={() => step(0, 0)}
          onKeyDown={onKey}
        >
          <span className="heat-grid-probe-day">{stamp}</span>
          <span className="heat-grid-probe-count">
            {count} {count === 1 ? 'deploy' : 'deploys'}
          </span>
        </button>
      </div>
      <p className="heat-grid-hint">drag to warm, hold to pin</p>
    </div>
  );
}

export default HeatGrid;
