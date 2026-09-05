'use client';

import './shutter-compare.css';

import { useEffect, useRef, useState, type KeyboardEvent } from 'react';

import {
  useCanvasScene,
  useReducedMotion,
  type SceneDrawContext,
  type SceneSetupContext,
} from '@/hooks/use-canvas-scene';

/**
 * A before/after comparison slider whose divider is the trailing edge of a
 * focal-plane shutter curtain.
 *
 * Two curtains cross the frame. Each is a mass on a spring released by a latch and
 * integrates m·x'' = −k·(x − x_rest) − b·x' + F_drive, with the mass absorbed into
 * the constants. The two force terms are gated by position, which is the split a
 * mechanical shutter actually has: the mainspring supplies a constant F_drive
 * through free travel and is cut at a buffer an eighth of the frame from the stop,
 * and the return spring −k·(x − x_rest) is engaged only inside that buffer. So the
 * traverse is flat and the arrest is a spring, rather than the quarter-sine one
 * spring pulling from end to end would give.
 *
 * The second curtain is not geometrically pinned to the first. It is latched, and
 * its latch is released one exposure time after the first curtain's, so the slit is
 * whatever gap the two have opened up by then — at full travel, frame · exposure /
 * traverse. That ratio is the whole mechanism. At 1/250 the gap is exactly one
 * frame: the X-sync limit of a mechanical shutter, and the reason a flash cannot be
 * used faster than it. Above it the slit is narrower than the frame, so the reveal
 * is not a divider crossing an already-open gate but a moving band — one edge of
 * the frame is exposed measurably later than the other, which is the honest
 * behaviour of a focal-plane shutter and the reason rolling-shutter distortion
 * exists at all.
 *
 * Dragging sets the slit position directly, so the handle leads and the curtains
 * lag behind it under their springs; letting go leaves the springs to travel to
 * rest. A press far from the divider is a full release: both curtains traverse at
 * mainspring speed, which is the only time the gap reaches its stated width.
 *
 * STEP is 1/120. The springs are not stiff: the return spring is k = 784 s⁻² per
 * unit mass, so ω is 28 rad/s and ω·STEP is 0.23 — an eighth of what semi-implicit
 * Euler carries. 1/240 would buy nothing but heat, because the fast part of the
 * motion is the drive-limited traverse and that is a straight line no step size
 * renders better.
 *
 * What is compared is one drawing under two treatments, both composed here: the
 * same five-room plan as a setting-out wireframe — grid, single-weight outlines,
 * door swings, a dimension chain — on the side the slit has not reached, and as a
 * rendered plan with poché walls, floor tints and filled fittings on the side it
 * has passed.
 *
 * Under prefers-reduced-motion the loop never starts, so `setup` composes the still
 * itself: the curtains parted at the commanded position by the gap the selected
 * exposure implies, wireframe left of the divider, rendered plan right of it, and
 * the lit slit between the two curtain edges at its real width.
 *
 * The one thing here that is a rendering choice rather than the mechanism: the frame
 * keeps what the slit has passed over, the way film does, and dragging back resets
 * it. A shutter cannot un-expose. A comparison slider has to be reversible.
 */

/** Seconds per step. */
const STEP = 1 / 120;
/** 10 steps span 83ms, so a 12fps frame is still integrated in full. */
const MAX_SUBSTEPS = 10;
/** Return-spring rate per unit curtain mass, s⁻². ω = 28 rad/s. */
const K = 784;
/** Damping per unit mass, s⁻¹. ζ = 0.92, which puts the stop at about 0.2s and no ring. */
const B = 51.5;
/**
 * Seconds a curtain takes to cross the whole frame under the mainspring. A real
 * one does it in about 4ms, which is nothing to look at; the ratio exposure /
 * traverse is the only quantity that sets the slit width, and the shutter speeds
 * below are scaled against this so that ratio is preserved exactly.
 */
const TRAVEL = 0.3;
/**
 * Fraction of the frame the return spring owns at the end of the travel. With
 * TRAVEL, this fixes ω: arresting v = frame/TRAVEL inside BUFFER·frame without
 * overshoot needs ω ≈ 1/(TRAVEL·BUFFER) = 28, and the frame width cancels — which
 * is why one ω works at every card size.
 */
const BUFFER = 0.12;
/** The exposure whose slit is exactly one frame wide. A real shutter's X-sync speed. */
const SYNC = 250;
const SPEEDS = [60, 250, 1000, 4000];
const START_SPEED = 250;
const START_VALUE = 45;
const KEY_STEP = 2;
const PAGE_STEP = 10;

const ACCENT = '255, 201, 120';
const INK = '236, 243, 255';

/** The setting-out grid the plan is drawn on. Both treatments read from it. */
const GRID_W = 12;
const GRID_H = 8;

/** Rooms, as an exact partition of the grid: [x, y, w, h]. */
const ROOMS = [
  [0, 0, 7, 5],
  [7, 0, 5, 5],
  [0, 5, 4, 3],
  [4, 5, 2, 3],
  [6, 5, 6, 3],
];

/** Fittings. Outlines under the wireframe, filled masses under the render. */
const BLOCKS = [
  [0.6, 3.5, 3.6, 1],
  [4.7, 2.5, 1.7, 1.4],
  [7.4, 0.4, 4.2, 0.8],
  [8.5, 2.3, 2.2, 1],
  [0.4, 5.4, 1.1, 2.2],
  [2.5, 5.4, 1.1, 1.1],
  [7.1, 5.6, 2.4, 1.9],
  [10.4, 5.4, 1.2, 2.2],
];

/** The two fittings the rendered side picks out in the accent. Indices into BLOCKS. */
const LIT = [1, 6];

/** Door swings: [hinge x, hinge y, radius, quarter turn the leaf opens through]. */
const DOORS = [
  [7, 1.75, 0.95, 0],
  [4.9, 5, 0.9, 1],
  [4, 6.3, 0.85, 3],
  [6, 6.3, 0.85, 0],
];

/** The lines the plan is dimensioned from, in grid units. */
const DIM_X = [0, 7, 12];
const DIM_Y = [0, 5, 8];

interface Curtain {
  /** The edge that matters, in px from the left of the frame. */
  x: number;
  v: number;
  /** Where this curtain's return spring wants that edge. */
  rest: number;
}

interface State {
  clock: number;
  carry: number;
  snap: boolean;
  /** Plan geometry. All of it is derived from the frame size, in `setup`. */
  ox: number;
  oy: number;
  scale: number;
  wall: number;
  dim: number;
  /** The first curtain's trailing edge: the divider between the two treatments. */
  first: Curtain;
  /** The second curtain's leading edge: the far side of the slit. */
  second: Curtain;
  /** Seconds of latch left on the second curtain. Above zero it is held shut. */
  hold: number;
  /** Commanded divider position in px, written from the slider value each frame. */
  cmd: number;
  lastCmd: number;
  /** Seconds the second curtain's latch waits — the exposure time, scaled. */
  delay: number;
  /** The gap that delay opens at full travel. Only used to place the still frame. */
  slit: number;
  /** Mainspring force per unit mass, set so a full traverse takes TRAVEL seconds. */
  drive: number;
  /** Where the return spring takes over from the mainspring, in px. */
  buffer: number;
}

const px = (s: State, u: number): number => s.ox + u * s.scale;
const py = (s: State, v: number): number => s.oy + v * s.scale;

/**
 * One fixed step of m·x'' = −k·(x − x_rest) − b·x' + F_drive for one curtain.
 *
 * Both force terms are gated on how far the curtain still has to go. Outside the
 * buffer only the mainspring and the damper act, so the curtain settles onto a
 * terminal velocity of drive/b and holds it — a flat traverse, which is what a
 * curtain crossing a gate does. Inside the buffer the mainspring is cut and the
 * return spring takes the velocity out. Letting the return spring pull across the
 * whole frame instead would make the traverse a quarter-sine: fastest in the middle,
 * asymptotically slow at the end, and the slit would change width as it crossed.
 */
function advance(c: Curtain, drive: number, buffer: number): void {
  const gap = c.rest - c.x;
  const free = Math.abs(gap) > buffer;
  const push = free ? Math.sign(gap) * drive : 0;
  const spring = free ? 0 : K * gap;
  c.v += (spring - B * c.v + push) * STEP;
  c.x += c.v * STEP;
}

/**
 * The latch, then both curtains.
 *
 * A command toward the open side is a release: the first curtain is let go at once
 * and the second is held where it stands for the exposure time, which is what opens
 * the slit. A command the other way is a re-cock, and winding a shutter back pulls
 * both curtains together, so the latch is dropped and no slit opens on the way back.
 */
function step(s: State): void {
  if (s.cmd < s.lastCmd - 0.05) {
    // Only re-armable once the second curtain has caught the first. Mid-exposure
    // the latch is already spent and cannot be spent again.
    if (s.hold <= 0 && s.second.x - s.first.x < s.buffer * 0.5) {
      s.hold = s.delay;
      s.second.rest = s.second.x;
    }
  } else if (s.cmd > s.lastCmd + 0.05) {
    s.hold = 0;
  }
  s.lastCmd = s.cmd;

  s.first.rest = s.cmd;
  if (s.hold > 0) s.hold -= STEP;
  else s.second.rest = s.cmd;

  advance(s.first, s.drive, s.buffer);
  advance(s.second, s.drive, s.buffer);
}

/**
 * The mid-exposure still: the first curtain on the commanded divider, the second
 * parted from it by the gap this exposure implies at full travel, both stationary.
 * This is what `prefers-reduced-motion` gets, and it is also the first painted frame
 * when the loop is running — a shutter caught open reads as a mechanism, where a
 * closed one reads as a line down a picture.
 */
function part(s: State, width: number): void {
  s.first.x = s.cmd;
  s.first.v = 0;
  s.first.rest = s.cmd;
  s.second.x = Math.min(width, s.cmd + s.slit);
  s.second.v = 0;
  s.second.rest = s.second.x;
  s.hold = 0;
  s.lastCmd = s.cmd;
}

/** The side the slit has not reached: the plan as it is set out, not as it is built. */
function latent(ctx: CanvasRenderingContext2D, s: State): void {
  ctx.lineJoin = 'miter';
  ctx.lineWidth = 1;

  ctx.strokeStyle = `rgba(${INK}, 0.07)`;
  ctx.beginPath();
  for (let u = 0; u <= GRID_W; u += 1) {
    ctx.moveTo(px(s, u), py(s, 0));
    ctx.lineTo(px(s, u), py(s, GRID_H));
  }
  for (let v = 0; v <= GRID_H; v += 1) {
    ctx.moveTo(px(s, 0), py(s, v));
    ctx.lineTo(px(s, GRID_W), py(s, v));
  }
  ctx.stroke();

  ctx.strokeStyle = `rgba(${INK}, 0.44)`;
  ctx.beginPath();
  for (const r of ROOMS) {
    ctx.rect(px(s, r[0]), py(s, r[1]), r[2] * s.scale, r[3] * s.scale);
  }
  ctx.stroke();

  ctx.strokeStyle = `rgba(${INK}, 0.24)`;
  ctx.beginPath();
  for (const b of BLOCKS) {
    ctx.rect(px(s, b[0]), py(s, b[1]), b[2] * s.scale, b[3] * s.scale);
  }
  ctx.stroke();

  // Door leaf and swing, one path each: a shared path would join the end of one arc
  // to the start of the next with a line across the plan.
  ctx.strokeStyle = `rgba(${INK}, 0.3)`;
  for (const d of DOORS) {
    const from = (d[3] * Math.PI) / 2;
    const r = d[2] * s.scale;
    ctx.beginPath();
    ctx.moveTo(px(s, d[0]), py(s, d[1]));
    ctx.lineTo(px(s, d[0]) + Math.cos(from) * r, py(s, d[1]) + Math.sin(from) * r);
    ctx.arc(px(s, d[0]), py(s, d[1]), r, from, from + Math.PI / 2);
    ctx.stroke();
  }

  // The dimension chain, in the margin `setup` reserved for it.
  const chainY = s.oy - s.dim + 4;
  const chainX = s.ox - s.dim + 4;
  ctx.strokeStyle = `rgba(${INK}, 0.1)`;
  ctx.beginPath();
  for (const u of DIM_X) {
    ctx.moveTo(px(s, u), chainY + 3);
    ctx.lineTo(px(s, u), py(s, 0));
  }
  for (const v of DIM_Y) {
    ctx.moveTo(chainX + 3, py(s, v));
    ctx.lineTo(px(s, 0), py(s, v));
  }
  ctx.stroke();

  ctx.strokeStyle = `rgba(${INK}, 0.26)`;
  ctx.beginPath();
  ctx.moveTo(px(s, 0), chainY);
  ctx.lineTo(px(s, GRID_W), chainY);
  ctx.moveTo(chainX, py(s, 0));
  ctx.lineTo(chainX, py(s, GRID_H));
  for (const u of DIM_X) {
    ctx.moveTo(px(s, u), chainY - 4);
    ctx.lineTo(px(s, u), chainY + 4);
  }
  for (const v of DIM_Y) {
    ctx.moveTo(chainX - 4, py(s, v));
    ctx.lineTo(chainX + 4, py(s, v));
  }
  ctx.stroke();
}

/** The side the slit has passed: the same plan built. */
function exposed(ctx: CanvasRenderingContext2D, s: State): void {
  ctx.lineJoin = 'miter';

  ROOMS.forEach((r, i) => {
    ctx.fillStyle = `rgba(${INK}, ${i % 2 ? 0.055 : 0.095})`;
    ctx.fillRect(px(s, r[0]), py(s, r[1]), r[2] * s.scale, r[3] * s.scale);
  });

  // Poché: the room outlines stroked at wall thickness, so every shared edge gets
  // one wall of the right weight and the perimeter gets half of one.
  ctx.strokeStyle = `rgba(${INK}, 0.62)`;
  ctx.lineWidth = s.wall;
  ctx.beginPath();
  for (const r of ROOMS) {
    ctx.rect(px(s, r[0]), py(s, r[1]), r[2] * s.scale, r[3] * s.scale);
  }
  ctx.stroke();

  BLOCKS.forEach((b, i) => {
    ctx.fillStyle = LIT.includes(i) ? `rgba(${ACCENT}, 0.72)` : `rgba(${INK}, 0.28)`;
    ctx.fillRect(px(s, b[0]), py(s, b[1]), b[2] * s.scale, b[3] * s.scale);
  });
}

/**
 * The divider the two treatments meet on, with its shading falling across the side
 * the reveal has not reached yet.
 */
function divider(ctx: CanvasRenderingContext2D, height: number, x: number): void {
  const fade = ctx.createLinearGradient(x, 0, x - 30, 0);
  fade.addColorStop(0, 'rgba(5, 8, 14, 0.6)');
  fade.addColorStop(1, 'rgba(5, 8, 14, 0)');
  ctx.fillStyle = fade;
  ctx.fillRect(x - 30, 0, 30, height);

  ctx.strokeStyle = `rgba(${ACCENT}, 0.9)`;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(x, 0);
  ctx.lineTo(x, height);
  ctx.stroke();
}

function paint(ctx: CanvasRenderingContext2D, width: number, height: number, s: State): void {
  const a = Math.max(0, Math.min(width, s.first.x));
  const b = Math.max(a, Math.min(width, s.second.x));

  ctx.clearRect(0, 0, width, height);

  if (a > 0.5) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, a, height);
    ctx.clip();
    latent(ctx, s);
    ctx.restore();
  }

  if (width - a > 0.5) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(a, 0, width - a, height);
    ctx.clip();
    // A faint lift on the exposed field, so the two sides read apart in the margins
    // where the drawing itself has nothing to show.
    ctx.fillStyle = 'rgba(255, 248, 234, 0.035)';
    ctx.fillRect(a, 0, width - a, height);
    exposed(ctx, s);
    ctx.restore();
  }

  // The slit: the band that is open right now, brightest at the edge that opened it.
  if (b - a > 0.75) {
    const lit = ctx.createLinearGradient(a, 0, b, 0);
    lit.addColorStop(0, `rgba(${ACCENT}, 0.2)`);
    lit.addColorStop(1, `rgba(${ACCENT}, 0.04)`);
    ctx.fillStyle = lit;
    ctx.fillRect(a, 0, b - a, height);
  }

  divider(ctx, height, a);
}

/** `compact` is the 298x240 catalogue card: the same two curtains and the same speed
 *  buttons, with the tags and the hint dropped. The frame is measured off the canvas box,
 *  so the traverse and the slit are the same solve — see `shutter-compare.css`. */
export type ShutterCompareProps = { compact?: boolean };

export function ShutterCompare({ compact = false }: ShutterCompareProps) {
  const reduced = useReducedMotion();
  // The pointer, the keys and the solver all read the divider, so the ref is the
  // single source of truth and the React state is only the copy the label and the
  // grip's position render from.
  const valueRef = useRef(START_VALUE);
  const [value, setValue] = useState(START_VALUE);
  const [speed, setSpeed] = useState(START_SPEED);
  const handleRef = useRef<HTMLDivElement>(null);

  const commit = (next: number) => {
    const clamped = Math.round(Math.min(100, Math.max(0, next)));
    if (clamped === valueRef.current) return;
    valueRef.current = clamped;
    setValue(clamped);
  };

  const setup = ({ width, height }: SceneSetupContext): State => {
    // Every number below is read here and only here: `setup` re-runs on resize and
    // on a DPR change, so nothing downstream can hold geometry from the old size.
    const padX = Math.max(16, Math.min(30, width * 0.055));
    const top = Math.min(80, Math.max(44, height * 0.2));
    const bottom = Math.min(92, Math.max(52, height * 0.24));
    const dim = 15;
    const boxW = Math.max(40, width - padX * 2 - dim);
    const boxH = Math.max(40, height - top - bottom - dim);
    const scale = Math.min(boxW / GRID_W, boxH / GRID_H);

    const state: State = {
      clock: 0,
      carry: 0,
      snap: reduced,
      ox: padX + dim + (boxW - GRID_W * scale) / 2,
      oy: top + dim + (boxH - GRID_H * scale) / 2,
      scale,
      wall: Math.max(2.5, scale * 0.17),
      dim,
      first: { x: 0, v: 0, rest: 0 },
      second: { x: 0, v: 0, rest: 0 },
      hold: 0,
      cmd: (valueRef.current / 100) * width,
      lastCmd: 0,
      delay: TRAVEL * (SYNC / speed),
      slit: Math.min(width, (width * SYNC) / speed),
      drive: B * (width / TRAVEL),
      buffer: Math.max(24, width * BUFFER),
    };

    part(state, width);
    return state;
  };

  const draw = ({ context, width, height, state, pointer }: SceneDrawContext<State>) => {
    const now = performance.now() / 1000;
    const dt = state.clock === 0 ? 0 : Math.min(0.05, now - state.clock);
    state.clock = now;
    state.snap = reduced;
    // The two numbers the speed buttons own. Written every frame rather than read
    // through a closure, so a press changes the mechanism and not the drawing.
    state.delay = TRAVEL * (SYNC / speed);
    state.slit = Math.min(width, (width * SYNC) / speed);

    if (pointer.down && pointer.inside) {
      commit((pointer.x / Math.max(1, width)) * 100);
    }
    state.cmd = (valueRef.current / 100) * width;

    if (state.snap) {
      part(state, width);
    } else {
      state.carry += dt;
      let n = 0;
      while (state.carry >= STEP && n < MAX_SUBSTEPS) {
        step(state);
        state.carry -= STEP;
        n += 1;
      }
      if (n === MAX_SUBSTEPS) state.carry = 0;
    }

    paint(context, width, height, state);
  };

  const { stageRef, canvasRef, requestRender } = useCanvasScene<State>({ setup, draw });

  // With the loop stopped, nothing else would repaint: the still would keep the old
  // divider and the old slit width however many keys were pressed.
  useEffect(() => requestRender(), [value, speed, reduced, requestRender]);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const at = valueRef.current;
    let next = at;
    if (event.key === 'ArrowRight' || event.key === 'ArrowUp') next = at + KEY_STEP;
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') next = at - KEY_STEP;
    else if (event.key === 'PageUp') next = at + PAGE_STEP;
    else if (event.key === 'PageDown') next = at - PAGE_STEP;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = 100;
    else return;
    event.preventDefault();
    commit(next);
    requestRender();
  };

  return (
    // A press hands focus to the divider, since the control is transparent to the
    // pointer and would otherwise only ever be reachable by Tab. In a card there is
    // nothing to hand focus to — the whole frame is aria-hidden — so the press is left
    // to the canvas alone.
    <div
      className="shutter-compare-stage"
      data-compact={compact ? 'true' : undefined}
      onPointerDown={compact ? undefined : () => handleRef.current?.focus()}
    >
      <div ref={stageRef} className="shutter-compare-frame" aria-hidden="true">
        <canvas ref={canvasRef} />
      </div>

      <div className="shutter-compare-ui">
        <div>
          <p className="shutter-compare-label">Unit 4b · plan</p>
          <p className="shutter-compare-read">
            {value}
            <span className="shutter-compare-unit">% built</span>
          </p>
        </div>

        <div className="shutter-compare-base">
          <div className="shutter-compare-foot">
            <p className="shutter-compare-tag">
              <b>setting out</b>
            </p>
            <p className="shutter-compare-tag shutter-compare-tag-end">
              <b>built</b>
            </p>
          </div>

          <div className="shutter-compare-speeds" role="group" aria-label="Shutter speed">
            {SPEEDS.map((each) => (
              <button
                key={each}
                type="button"
                className="shutter-compare-speed"
                aria-pressed={each === speed}
                /* Still pressable in a card, but out of the tab order: the card frame is
                   aria-hidden, and a focusable node inside one is a trap with no label. */
                tabIndex={compact ? -1 : undefined}
                onClick={() => setSpeed(each)}
              >
                1/{each}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* A sibling of the tracked element, never a child of it: the canvas host
          takes pointer capture on pointerdown and would swallow this one's focus
          and its keys. */}
      <div
        ref={handleRef}
        className="shutter-compare-handle"
        style={{ left: `${value}%` }}
        role="slider"
        tabIndex={compact ? -1 : 0}
        aria-label="Reveal divider"
        aria-orientation="horizontal"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={value}
        aria-valuetext={`${value} percent built, at 1/${speed} second`}
        onKeyDown={onKeyDown}
      />

      <p className="shutter-compare-hint">drag · arrows · home/end</p>
    </div>
  );
}

export default ShutterCompare;
