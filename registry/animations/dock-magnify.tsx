'use client';

import './dock-magnify.css';

import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent, MouseEvent, PointerEvent } from 'react';

import {
  useCanvasScene,
  useReducedMotion,
  type SceneDrawContext,
  type SceneSetupContext,
} from '@/hooks/use-canvas-scene';

/*
 * A dock whose shelf is a BEAM ON A WINKLER ELASTIC FOUNDATION. The pointer is a
 * concentrated load P riding along it, and the shelf's shape is the solution of
 *
 *     EI * w'''' + k * w = p(x),        w(0) = w(W) = 0,  w'(0) = w'(W) = 0
 *
 * with the fourth derivative taken by the central five-point stencil
 * (w[i-2] - 4w[i-1] + 6w[i] - 4w[i+1] + w[i+2]) / h^4. That makes a symmetric
 * pentadiagonal positive-definite system in the 119 interior nodes, factorised
 * once per resize by banded Cholesky and back-substituted every frame — one
 * linear solve per painted frame, not a curve evaluated at eight points.
 *
 * It is NOT a Gaussian, NOT a cosine window, and NOT a distance-to-pointer
 * falloff with a radius. Every dock in every library reaches for one of those
 * three, and all three are positive everywhere. The elastic response is not:
 *
 *     w(x) = (P / 2kL) * e^(-|x|/L) * (cos(x/L) + sin(x/L)),   L = (4EI/k)^(1/4)
 *
 * crosses zero at 3*pi/4 * L and troughs at pi * L, where it sits at -e^(-pi),
 * i.e. 4.3% of the peak, BELOW the resting line. So the icon two places out from
 * the pointer does not merely fail to rise — it dips under the dock's rim, and
 * you can watch it pass behind the rim hairline. That undershoot is the whole
 * argument: it is unreachable by any positive kernel, and here it falls out of
 * the solve rather than being drawn in.
 *
 * Two more things come free with the equation and are visible on the shelf. The
 * bump's width is a material property, L, and not a radius: at L = 0.7 of the
 * icon pitch the zero crossing lands at 1.65 pitches and the trough at 2.20, so
 * which neighbour sinks is decided by EI/k. And the boundary is real — both ends
 * are built in, so an end icon lifts about 65% of what a mid-dock icon lifts,
 * the stiffening you feel in a real dock's corners and that no falloff produces.
 */

/** Icons on the dock. Eight, so aiming the middle keeps both undershoot slots on the shelf. */
const SLOTS = 8;
/** Interior nodes plus two ends. 121 puts h at 0.07 of L, where the stencil's error is under 0.1%. */
const NODES = 121;
/** Foundation modulus k. The unit of the whole system: EI and P are expressed in it. */
const BED = 1;
/** L in icon pitches. 0.7 puts the zero crossing at 1.65 pitches, so slot +-2 is the one that sinks. */
const L_CELLS = 0.7;
/** Built-in ends, 0.3 pitch outside the end icons: close enough to stiffen a corner, not to pin it. */
const PAD_CELLS = 0.3;
/** Peak rise at the pointer, in pitches. 1.05 lifts an icon clear of its neighbours' tops. */
const LIFT_CELLS = 1.05;
/** Icon side at rest, in pitches. 0.58 leaves the gap a dock needs to read as separate tiles. */
const TILE_CELLS = 0.58;
/** Scale at full lift. 1.7 is the macOS dock's magnification, and it fits inside a 0.7-pitch bump. */
const MAG = 1.7;
/** Load sign under a press. -0.26 dimples the aimed icon 14px into the shelf and inverts the lobes. */
const PRESS = -0.26;
/** Shelf thickness in px. 18 is deeper than the -2.1px trough, so a sunk icon stays inside the rim. */
const PLATE_H = 18;
/** Shelf inset from the card's edges in px, so the dock reads as a shelf with air at either end. */
const PLATE_INSET = 16;
/** Room below the resting line in px: 18 for the shelf, 16 so a press cannot clip its underside. */
const FOOT = 34;
/** Least room above the resting line in px, so the icons keep their headroom on a short card. */
const HEAD = 66;
/** Grab slack below the shelf in px, so a pointer just under the rim still counts as on the dock. */
const SLACK = 24;
/** Seconds per solver step. The load lag is first order with tau >= 45ms; dt/tau = 0.19 here, stable. */
const STEP = 1 / 120;
/** Steps per frame ceiling. 12 covers a 100ms hitch and refuses to chase a backgrounded tab. */
const MAX_STEPS = 12;
/** Time constant of the load's travel, in seconds. 0.045 trails a fast flick by about 3px. */
const MOVE_TAU = 0.045;
/** Time constant of the load's magnitude. 0.085 is slower than the travel, so the bump grows in place. */
const FADE_TAU = 0.085;
/** Which icon the load starts under. Slot 3 is off centre, so the response is visibly asymmetric. */
const START = 3;
/** Apps open at rest, one bit per slot: Finder, Terminal and Messages. */
const OPEN = 0b01001001;

const INK = '234, 243, 255';
const ACCENT = '158, 205, 255';
const TAU = Math.PI * 2;

type AppKind = 'files' | 'mail' | 'calendar' | 'terminal' | 'music' | 'photos' | 'chat' | 'gear';

interface DockApp {
  readonly name: string;
  readonly kind: AppKind;
}

const APPS: readonly DockApp[] = [
  { name: 'Finder', kind: 'files' },
  { name: 'Mail', kind: 'mail' },
  { name: 'Calendar', kind: 'calendar' },
  { name: 'Terminal', kind: 'terminal' },
  { name: 'Music', kind: 'music' },
  { name: 'Photos', kind: 'photos' },
  { name: 'Messages', kind: 'chat' },
  { name: 'Settings', kind: 'gear' },
];

/** The banded Cholesky factor of the stiffness matrix: diagonal plus two sub-diagonals. */
interface Band {
  readonly size: number;
  readonly d: Float64Array;
  readonly l1: Float64Array;
  readonly l2: Float64Array;
}

/** What the DOM shows about the frame the solver just produced. */
interface Readout {
  aim: number;
}

interface DockState {
  /** Geometry, all of it derived from the stage at setup and never mutated after. */
  readonly plateX: number;
  readonly plateW: number;
  readonly restY: number;
  readonly cell: number;
  readonly pad: number;
  readonly tile: number;
  readonly lift: number;
  /** P, scaled so the infinite-beam peak P/(2kL) equals `lift`. */
  readonly load: number;
  readonly h: number;
  /** Vertical reach above the resting line that still counts as being on the dock. */
  readonly band: number;
  readonly centres: Float64Array;
  readonly system: Band;
  readonly rhs: Float64Array;
  readonly inner: Float64Array;
  readonly w: Float64Array;
  readonly wAt: Float64Array;
  readonly tileFill: CanvasGradient;

  /** Load position along the shelf, in px from its left end, and where it is headed. */
  lx: number;
  lxTarget: number;
  /** Load magnitude as a fraction of P, and its target. Negative under a press. */
  p: number;
  pTarget: number;
  clock: number;
  carry: number;
  snap: boolean;
  magnify: boolean;
  /** One bit per slot, set when that app is open. Read from React each frame. */
  running: number;
  /** Slot holding keyboard focus, or -1. The load follows it when nothing is hovering. */
  keyed: number;
  aim: number;
  engaged: boolean;
  /** Last transform written per slot: x, y, scale. NaN until the first placement. */
  posted: Float64Array;
}

/*
 * Banded Cholesky of the clamped stiffness matrix. Row i of the interior system is
 * beta * (w[i-2] - 4w[i-1] + 6w[i] - 4w[i+1] + w[i+2]) + k * w[i], with beta = EI/h^4.
 * The clamp enters as a ghost node, w[-1] = w[1]: reflecting it onto the first and last
 * rows turns their 6*beta into 7*beta, and that single changed entry is the entire
 * difference between a built-in end and a pinned one. Factorising here rather than per
 * frame is what makes a solve-per-frame cheap: 119 unknowns cost about 1.8 microseconds.
 */
function factorise(size: number, beta: number): Band {
  const d = new Float64Array(size);
  const l1 = new Float64Array(size);
  const l2 = new Float64Array(size);
  const at = (row: number, column: number): number => {
    const gap = Math.abs(row - column);
    if (gap === 2) return beta;
    if (gap === 1) return -4 * beta;
    if (gap > 2) return 0;
    const edge = row === 0 || row === size - 1;
    return (edge ? 7 : 6) * beta + BED;
  };

  for (let i = 0; i < size; i += 1) {
    d[i] = Math.sqrt(at(i, i) - l1[i] * l1[i] - l2[i] * l2[i]);
    if (i + 1 < size) l1[i + 1] = (at(i + 1, i) - l2[i + 1] * l1[i]) / d[i];
    if (i + 2 < size) l2[i + 2] = at(i + 2, i) / d[i];
  }

  return { size, d, l1, l2 };
}

/** Forward then back substitution through the factor. O(n), and the whole per-frame cost. */
function bandSolve(band: Band, rhs: Float64Array, out: Float64Array): void {
  const { size, d, l1, l2 } = band;
  for (let i = 0; i < size; i += 1) {
    const b1 = i >= 1 ? l1[i] * out[i - 1] : 0;
    const b2 = i >= 2 ? l2[i] * out[i - 2] : 0;
    out[i] = (rhs[i] - b1 - b2) / d[i];
  }
  for (let i = size - 1; i >= 0; i -= 1) {
    const u1 = i + 1 < size ? l1[i + 1] * out[i + 1] : 0;
    const u2 = i + 2 < size ? l2[i + 2] * out[i + 2] : 0;
    out[i] = (out[i] - u1 - u2) / d[i];
  }
}

/**
 * Build the right-hand side for the load where it currently is, solve, and read the shelf
 * height at each icon. The load lands between two nodes and is split between them by
 * distance — consistent lumping. Rounding it to the nearest node instead would make the
 * bump jump the 3.7px node spacing, which is plainly visible on a slow drag.
 */
function deflect(state: DockState): void {
  const { rhs, inner, w, h, system } = state;
  rhs.fill(0);
  const g = Math.max(0, Math.min(state.plateW, state.lx)) / h;
  const node = Math.floor(g);
  const frac = g - node;
  const scale = (state.p * state.load) / h;
  for (let k = 0; k < 2; k += 1) {
    const i = node + k - 1;
    if (i >= 0 && i < rhs.length) rhs[i] += scale * (k === 0 ? 1 - frac : frac);
  }
  bandSolve(system, rhs, inner);
  for (let i = 0; i < inner.length; i += 1) w[i + 1] = inner[i];
  for (let i = 0; i < SLOTS; i += 1) state.wAt[i] = sampleW(state, state.centres[i]);
}

/** Shelf height between nodes, linearly. The stencil's own error is larger than this one's. */
function sampleW(state: DockState, x: number): number {
  const g = Math.max(0, Math.min(state.plateW, x)) / state.h;
  const i = Math.min(NODES - 2, Math.floor(g));
  return state.w[i] + (state.w[i + 1] - state.w[i]) * (g - i);
}

const slotAt = (state: DockState, x: number): number =>
  Math.max(0, Math.min(SLOTS - 1, Math.round((x - state.pad) / state.cell - 0.5)));

/** Icon side at a given shelf height. Linear in w, so the scale is the solve, not a curve of its own. */
const sizeOf = (state: DockState, w: number): number => state.tile * (1 + (MAG - 1) * (w / state.lift));

/**
 * Size the shelf to the stage and factorise its stiffness matrix. Everything geometric is
 * derived from one number, the icon pitch, so a 390px card and a 1340px one are the same
 * dock at two scales; and EI is not a free parameter — the characteristic length is chosen
 * in pitches and EI = k * L^4 / 4 follows, which is why the bump keeps its shape.
 */
function build({ context, width, height }: SceneSetupContext, snap: boolean, magnify: boolean): DockState {
  const plateX = PLATE_INSET;
  const plateW = Math.max(SLOTS * 12, width - PLATE_INSET * 2);
  const restY = Math.max(HEAD, height - FOOT);
  const cell = plateW / (SLOTS + 2 * PAD_CELLS);
  const pad = PAD_CELLS * cell;
  const charLen = L_CELLS * cell;
  const lift = LIFT_CELLS * cell;
  const tile = TILE_CELLS * cell;
  const h = plateW / (NODES - 1);
  const size = NODES - 2;

  const centres = new Float64Array(SLOTS);
  for (let i = 0; i < SLOTS; i += 1) centres[i] = pad + (i + 0.5) * cell;

  // Made once and drawn under a unit-space transform, so one gradient serves eight icons
  // at eight different scales.
  const tileFill = context.createLinearGradient(0, -0.5, 0, 0.5);
  tileFill.addColorStop(0, `rgba(${ACCENT}, 0.22)`);
  tileFill.addColorStop(1, 'rgba(8, 14, 23, 0.92)');

  const start = pad + (START + 0.5) * cell;

  return {
    plateX,
    plateW,
    restY,
    cell,
    pad,
    tile,
    lift,
    load: 2 * BED * charLen * lift,
    h,
    band: lift + tile * MAG,
    centres,
    system: factorise(size, (BED * charLen ** 4) / 4 / h ** 4),
    rhs: new Float64Array(size),
    inner: new Float64Array(size),
    w: new Float64Array(NODES),
    wAt: new Float64Array(SLOTS),
    tileFill,
    lx: start,
    lxTarget: start,
    p: 0,
    pTarget: 0,
    clock: 0,
    carry: 0,
    snap,
    magnify,
    running: OPEN,
    keyed: -1,
    aim: START,
    engaged: false,
    posted: new Float64Array(SLOTS * 3).fill(Number.NaN),
  };
}

/** The deflected surface, node by node. `lineTo` opens the subpath, so no separate `moveTo`. */
function surfacePath(context: CanvasRenderingContext2D, state: DockState): void {
  context.beginPath();
  for (let i = 0; i < NODES; i += 1) {
    context.lineTo(state.plateX + i * state.h, state.restY - state.w[i]);
  }
}

/** The shelf as a solid of constant thickness: the surface out, the underside back. */
function ribbonPath(context: CanvasRenderingContext2D, state: DockState): void {
  context.beginPath();
  for (let i = 0; i < NODES; i += 1) {
    context.lineTo(state.plateX + i * state.h, state.restY - state.w[i]);
  }
  for (let i = NODES - 1; i >= 0; i -= 1) {
    context.lineTo(state.plateX + i * state.h, state.restY - state.w[i] + PLATE_H);
  }
  context.closePath();
}

/** A rounded square on the unit box, so one path serves every icon at every scale. */
function roundedUnit(context: CanvasRenderingContext2D, radius: number): void {
  context.beginPath();
  context.moveTo(-0.5 + radius, -0.5);
  context.arcTo(0.5, -0.5, 0.5, 0.5, radius);
  context.arcTo(0.5, 0.5, -0.5, 0.5, radius);
  context.arcTo(-0.5, 0.5, -0.5, -0.5, radius);
  context.arcTo(-0.5, -0.5, 0.5, -0.5, radius);
  context.closePath();
}

/**
 * The mark on an icon, in unit space, stroked at whatever width the caller set. Painted on
 * the canvas rather than left to the DOM because it rides a surface the DOM cannot bend;
 * the button over it carries the name, so nothing here is load-bearing for a screen reader.
 */
function glyph(context: CanvasRenderingContext2D, kind: AppKind): void {
  context.beginPath();
  switch (kind) {
    case 'files':
      context.moveTo(-0.19, -0.06);
      context.lineTo(-0.19, -0.14);
      context.lineTo(-0.02, -0.14);
      context.lineTo(0.03, -0.06);
      context.lineTo(0.19, -0.06);
      context.lineTo(0.19, 0.15);
      context.lineTo(-0.19, 0.15);
      context.closePath();
      break;
    case 'mail':
      context.rect(-0.2, -0.13, 0.4, 0.26);
      context.moveTo(-0.2, -0.13);
      context.lineTo(0, 0.02);
      context.lineTo(0.2, -0.13);
      break;
    case 'calendar':
      context.rect(-0.19, -0.12, 0.38, 0.27);
      context.moveTo(-0.19, -0.03);
      context.lineTo(0.19, -0.03);
      context.moveTo(-0.09, -0.19);
      context.lineTo(-0.09, -0.07);
      context.moveTo(0.09, -0.19);
      context.lineTo(0.09, -0.07);
      break;
    case 'terminal':
      context.moveTo(-0.16, -0.09);
      context.lineTo(-0.05, 0.01);
      context.lineTo(-0.16, 0.11);
      context.moveTo(0.01, 0.13);
      context.lineTo(0.17, 0.13);
      break;
    case 'music':
      context.moveTo(0.035, 0.09);
      context.arc(-0.04, 0.09, 0.075, 0, TAU);
      context.moveTo(0.035, 0.09);
      context.lineTo(0.035, -0.15);
      context.lineTo(0.15, -0.09);
      break;
    case 'photos':
      context.rect(-0.2, -0.13, 0.4, 0.26);
      context.moveTo(-0.035, -0.045);
      context.arc(-0.08, -0.045, 0.045, 0, TAU);
      context.moveTo(-0.2, 0.13);
      context.lineTo(-0.02, 0);
      context.lineTo(0.07, 0.07);
      context.lineTo(0.13, 0.02);
      context.lineTo(0.2, 0.13);
      break;
    case 'chat':
      context.rect(-0.19, -0.14, 0.38, 0.23);
      context.moveTo(-0.12, 0.09);
      context.lineTo(-0.12, 0.19);
      context.lineTo(-0.02, 0.09);
      break;
    case 'gear':
      context.moveTo(0.085, 0);
      context.arc(0, 0, 0.085, 0, TAU);
      for (let i = 0; i < 8; i += 1) {
        const angle = (i / 8) * TAU;
        context.moveTo(Math.cos(angle) * 0.125, Math.sin(angle) * 0.125);
        context.lineTo(Math.cos(angle) * 0.195, Math.sin(angle) * 0.195);
      }
      break;
  }
  context.stroke();
}

/*
 * One frame: aim the load, walk the lag to it at a fixed step, solve the beam, draw.
 *
 * The beam itself is solved statically — for a shelf this stiff the elastic transient is
 * over inside a frame, so pretending otherwise would be fiction. What has a time constant
 * is the load: a hand does not teleport, and neither does the pressure it puts on the
 * shelf. Those two lags are integrated at a fixed 1/120s because they are explicit and
 * first order: at a 60ms frame, dt/tau would be 1.33 and the bump would ring on arrival.
 */
function paint(scene: SceneDrawContext<DockState>): void {
  const { context, width, height, state, pointer } = scene;
  const now = performance.now();
  const elapsed = state.clock ? Math.min(0.05, (now - state.clock) / 1000) : STEP;
  state.clock = now;

  // On the dock means anywhere the dock reaches: a magnified icon stands a full pitch
  // above the shelf, so the band has to include the space it occupies or the bump would
  // collapse the moment the pointer followed the icon it just raised.
  const localX = pointer.x - state.plateX;
  const onDock =
    pointer.inside &&
    pointer.y > state.restY - state.band &&
    pointer.y < state.restY + PLATE_H + SLACK &&
    localX > -state.cell &&
    localX < state.plateW + state.cell;

  if (onDock) {
    state.lxTarget = Math.max(0, Math.min(state.plateW, localX));
    state.pTarget = state.magnify ? (pointer.down ? PRESS : 1) : 0;
  } else if (state.keyed >= 0) {
    // Nothing is hovering but a dock button holds focus, so the arrows drive the same
    // load the pointer does and the bump travels to whatever Tab reached.
    state.lxTarget = state.centres[state.keyed];
    state.pTarget = state.magnify ? 1 : 0;
  } else {
    state.pTarget = 0;
  }
  state.engaged = onDock;

  if (state.snap) {
    // With the loop stopped nothing can be walked anywhere, so the load is placed at its
    // target and the beam is solved there in one step. The whole response is on screen,
    // undershoot and end stiffening included; what is gone is the travel to it.
    state.lx = state.lxTarget;
    state.p = state.pTarget;
    state.carry = 0;
  } else {
    state.carry += elapsed;
    const steps = Math.min(MAX_STEPS, Math.floor(state.carry / STEP));
    for (let i = 0; i < steps; i += 1) {
      state.lx += (state.lxTarget - state.lx) * (STEP / MOVE_TAU);
      state.p += (state.pTarget - state.p) * (STEP / FADE_TAU);
    }
    state.carry -= steps * STEP;
    // A tab that was backgrounded owes nothing on return.
    if (state.carry > STEP * MAX_STEPS) state.carry = 0;
  }

  state.aim = slotAt(state, state.lx);
  deflect(state);

  const { plateX, plateW, restY } = state;
  context.clearRect(0, 0, width, height);
  context.lineJoin = 'round';
  context.lineCap = 'round';

  ribbonPath(context, state);
  context.fillStyle = `rgba(${INK}, 0.055)`;
  context.fill();
  context.lineWidth = 1;
  context.strokeStyle = `rgba(${INK}, 0.13)`;
  context.stroke();

  for (let i = 0; i < SLOTS; i += 1) {
    const w = state.wAt[i];
    const size = sizeOf(state, w);
    const cx = plateX + state.centres[i];
    const lit = Math.max(0, Math.min(1, w / state.lift));
    context.save();
    // Icons ride the surface: the foot of the tile is the shelf's height at its own x, so
    // the lift and the magnification are two readings of one solve.
    context.translate(cx, restY - w - size / 2);
    context.scale(size, size);
    roundedUnit(context, 0.22);
    context.fillStyle = state.tileFill;
    context.fill();
    context.lineWidth = 1.1 / size;
    context.strokeStyle = `rgba(${ACCENT}, ${(0.18 + 0.5 * lit).toFixed(3)})`;
    context.stroke();
    context.lineWidth = 1.6 / size;
    context.strokeStyle = `rgba(${INK}, ${(0.42 + 0.42 * lit).toFixed(3)})`;
    glyph(context, APPS[i].kind);
    context.restore();

    if ((state.running & (1 << i)) !== 0) {
      context.beginPath();
      context.arc(cx, restY - w + 7, 1.6, 0, TAU);
      context.fillStyle = `rgba(${ACCENT}, 0.8)`;
      context.fill();
    }
  }

  surfacePath(context, state);
  context.lineWidth = 1.4;
  context.strokeStyle = `rgba(${ACCENT}, 0.55)`;
  context.stroke();

  // The rim, at the undeflected line, drawn in front of the icons so a sunk one visibly
  // passes behind it. This is the reference the eye compares against.
  context.fillStyle = `rgba(${INK}, 0.26)`;
  context.fillRect(plateX, restY - 0.5, plateW, 1);
}

/*
 * Move the real buttons onto the tiles the solver just drew, so the focus ring rides the
 * bump instead of sitting where the icon used to be. The transform is written from the same
 * two numbers the canvas used; CSS owns only the centring translate, never a hand-matched
 * `left`. Writes are skipped when nothing moved, which is most frames once the load settles.
 */
function place(state: DockState, buttons: (HTMLButtonElement | null)[], tip: HTMLElement | null): void {
  for (let i = 0; i < SLOTS; i += 1) {
    const node = buttons[i];
    if (!node) continue;
    const w = state.wAt[i];
    const size = sizeOf(state, w);
    const x = state.plateX + state.centres[i];
    const y = state.restY - w - size / 2;
    const scale = size / state.tile;
    const slot = i * 3;
    const first = Number.isNaN(state.posted[slot]);
    if (
      !first &&
      Math.abs(state.posted[slot + 1] - y) < 0.3 &&
      Math.abs(state.posted[slot + 2] - scale) < 0.004
    ) {
      continue;
    }
    if (first) {
      // The rest size is set once per rebuild; every frame after that is a scale, which is
      // one composited property rather than a relayout eight times a frame.
      node.style.width = `${state.tile.toFixed(1)}px`;
      node.style.height = `${state.tile.toFixed(1)}px`;
      node.style.opacity = '1';
    }
    state.posted[slot] = x;
    state.posted[slot + 1] = y;
    state.posted[slot + 2] = scale;
    node.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) translate(-50%, -50%) scale(${scale.toFixed(3)})`;
  }

  if (!tip) return;
  const w = state.wAt[state.aim];
  const x = state.plateX + state.centres[state.aim];
  const y = state.restY - w - sizeOf(state, w) - 10;
  // The label is faded by the load itself, so it arrives with the bump rather than on a
  // timer of its own, and it leaves when the hand does.
  tip.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) translate(-50%, -100%)`;
  tip.style.opacity = Math.max(0, Math.min(1, Math.abs(state.p) / 0.5)).toFixed(2);
}

/** `compact` is the 298x240 catalogue card: the same shelf, the same eight icons and the
 *  same solve, with the hint below the card dropped and the head tightened. The shelf is
 *  sized from the canvas box — `restY` is `height − FOOT` under a clamp and every other
 *  length is in icon pitches — so a shorter card is the same dock at a smaller scale. See
 *  `dock-magnify.css`. */
export type DockMagnifyProps = { compact?: boolean };

export function DockMagnify({ compact = false }: DockMagnifyProps) {
  const reduced = useReducedMotion();
  const [magnify, setMagnify] = useState(true);
  const [running, setRunning] = useState(OPEN);
  const [roving, setRoving] = useState(START);
  const [readout, setReadout] = useState<Readout>({ aim: START });

  const buttonsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const tipRef = useRef<HTMLParagraphElement>(null);
  /** Which slot holds focus, or -1. Kept out of state: the solver reads it every frame. */
  const keyedRef = useRef(-1);
  /** Written by the solver so a press on the shelf knows which icon it landed under. */
  const hitRef = useRef({ slot: START, engaged: false });
  /** Last published readout, so an unchanged frame does not re-render the DOM. */
  const postedRef = useRef<Readout>({ aim: START });

  const { stageRef, canvasRef, requestRender } = useCanvasScene<DockState>({
    setup: (scene: SceneSetupContext) => build(scene, reduced, magnify),
    draw: (scene: SceneDrawContext<DockState>) => {
      const { state } = scene;
      state.snap = reduced;
      state.magnify = magnify;
      state.running = running;
      state.keyed = keyedRef.current;

      paint(scene);
      place(state, buttonsRef.current, tipRef.current);
      hitRef.current.slot = state.aim;
      hitRef.current.engaged = state.engaged;

      const posted = postedRef.current;
      if (posted.aim !== state.aim) {
        postedRef.current = { aim: state.aim };
        setReadout(postedRef.current);
      }
    },
  });

  // Every React value the scene reads needs one of these, or a stopped loop keeps showing
  // the old frame: under reduced motion nothing repaints unless something asks it to. The
  // readout is deliberately absent — it is published *by* the scene, and feeding it back
  // would schedule a second paint for every frame of a drag.
  useEffect(() => {
    requestRender();
  }, [magnify, running, reduced, requestRender]);

  const toggleApp = (index: number) => {
    setRunning((mask) => mask ^ (1 << index));
  };

  const onSlotFocus = (index: number) => {
    keyedRef.current = index;
    setRoving(index);
    requestRender();
  };

  const onSlotBlur = () => {
    keyedRef.current = -1;
    requestRender();
  };

  const onSlotKey = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next = index;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = index + 1;
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = index - 1;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = SLOTS - 1;
    else return;
    event.preventDefault();
    buttonsRef.current[Math.max(0, Math.min(SLOTS - 1, next))]?.focus({ preventScroll: true });
  };

  /*
   * The shelf owns the pointer capture, which is why the eight icon buttons are laid over it
   * with `pointer-events: none` and their clicks are routed from here instead. Edge-detecting
   * `pointer.down` inside the solver would have done it too, but it drops a click that opens
   * and closes between two frames; the DOM's own click never misses one.
   */
  const onStagePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (!hitRef.current.engaged) return;
    if ((event.target as HTMLElement).closest('button')) return;
    // In a card there is nothing to hand focus to — the frame is aria-hidden and its buttons
    // are out of the tab order — so the press is left to the shelf, and the click below still
    // opens the app under it.
    if (compact) return;
    buttonsRef.current[hitRef.current.slot]?.focus({ preventScroll: true });
    // The focus came from the pointer, so the pointer keeps the load: clicking an icon must
    // not leave the dock magnified after the hand has gone.
    keyedRef.current = -1;
  };

  const onStageClick = (event: MouseEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).closest('button')) return;
    if (hitRef.current.engaged) toggleApp(hitRef.current.slot);
  };

  const app = APPS[readout.aim];
  const open = (running & (1 << readout.aim)) !== 0;

  return (
    <div
      className="dock-magnify-stage"
      data-compact={compact ? 'true' : undefined}
      onPointerDown={onStagePointerDown}
      onClick={onStageClick}
    >
      <div className="dock-magnify-card">
        <div ref={stageRef} className="dock-magnify-well" aria-hidden="true">
          <canvas ref={canvasRef} />
        </div>

        <div className="dock-magnify-head">
          <p className="dock-magnify-label">Dock</p>
          <p className="dock-magnify-read">
            {app.name}
            <span className="dock-magnify-unit">{open ? 'open' : 'not running'}</span>
          </p>
        </div>

        <button
          type="button"
          className="dock-magnify-toggle"
          aria-pressed={magnify}
          /* Still pressable in a card, but out of the tab order: the card frame is
             aria-hidden, and a focusable node inside one is a trap with no label. */
          tabIndex={compact ? -1 : undefined}
          onClick={() => setMagnify((on) => !on)}
        >
          Magnification
        </button>

        <div className="dock-magnify-apps" role="toolbar" aria-label="Dock" aria-orientation="horizontal">
          {APPS.map((each, index) => (
            <button
              key={each.name}
              ref={(node) => {
                buttonsRef.current[index] = node;
              }}
              type="button"
              className="dock-magnify-app"
              aria-pressed={(running & (1 << index)) !== 0}
              /* The roving index is the toolbar's whole keyboard contract, so it stays —
                 except in a card, where the entire frame is out of the tab order. */
              tabIndex={compact ? -1 : index === roving ? 0 : -1}
              onFocus={() => onSlotFocus(index)}
              onBlur={onSlotBlur}
              onKeyDown={(event) => onSlotKey(event, index)}
              onClick={() => toggleApp(index)}
            >
              <span className="dock-magnify-app-name">{each.name}</span>
            </button>
          ))}
        </div>

        <p ref={tipRef} className="dock-magnify-tip" aria-hidden="true">
          {app.name}
        </p>
      </div>

      <p className="dock-magnify-hint">Hover the dock, or Tab into it</p>
    </div>
  );
}

export default DockMagnify;
