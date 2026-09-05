'use client';

import './frost-spoiler.css';

import { useEffect, useId, useRef, useState } from 'react';

import { useCanvasScene, useReducedMotion, type SceneDrawContext, type SceneSetupContext } from '@/hooks/use-canvas-scene';

/**
 * A spoiler panel whose mask is a frost crystal, grown and sublimated on a lattice.
 *
 * GROWTH — diffusion-limited aggregation with a finite sticking probability. A walker is
 * released at a lattice site whose surrounding box is empty and takes an unbiased walk on
 * the four-neighbourhood, P(each of the four) = 1/4. When the site it tries to enter is
 * already ice it does not move; it freezes where it stands with probability P_STICK and
 * otherwise keeps probing:
 *
 *   occ(x) <- 1   on contact, with probability P_STICK
 *
 * That walk is the Green's function of the problem the continuum version states: outside
 * the crystal the vapour concentration obeys grad^2 c = 0 with c = 0 on the ice, and the
 * front advances at v = -D grad c . n. Where a walker arrives is drawn from the harmonic
 * measure of the cluster, which is the whole reason the boundary comes out dendritic — the
 * measure is concentrated on protrusions and nearly zero inside a fjord.
 *
 * SUBLIMATION — the wipe is not a hole punched in the grid. A cell may leave only if it is
 * weakly bonded, and only where the hand is warm:
 *
 *   occ(x) <- 0   if bonds(x) < BOND_LEAVE, with probability SUBLIME * (1 - d^2 / R^2)
 *
 * evaluated against a snapshot and applied in one sweep afterwards, so a generation peels
 * exactly one layer and the result does not depend on scan order. Ice therefore retreats
 * from its own boundary: a branch unzips from its tip back toward the frame, and a flat rim
 * at the frame — five bonds or more, whatever the hand does — never leaves at all.
 *
 * CHANGED FROM THE SPEC, AND WHY. Three things.
 *
 * Walkers are released from the open middle rather than from the frame edges. The frame is
 * where the seed ring is, so a walker born on it is already touching ice and freezes at its
 * release point; that is Eden growth, it thickens the ring in uniform layers, and it has no
 * branches at all. Releasing into the open field is the same equation sampled from the far
 * side, and it is what makes the ring roughen and throw dendrites inward.
 *
 * The ring is not the only seed. Nucleating from the frame alone is correct and it leaves the
 * middle of the pane the thinnest glass on it, because the harmonic measure that decides where
 * a walker lands is concentrated on the branches already reaching in — so a walker headed for
 * the centre is intercepted long before it arrives. On a panel whose whole job is to sit over
 * a price, the thin patch is exactly the wrong place. Glass nucleates on dust as readily as on
 * cold metal, so a fixed scatter of motes is laid across the interior and each one grows its
 * own cluster under the same rule. Nothing about the growth law changes; the boundary condition
 * does, from one connected ring to a ring plus `MOTES` islands that screen each other.
 *
 * The bond threshold is four of the eight neighbours, not two of the four. Two-of-four
 * freezes the panel solid: every cell of a two-cell-wide filament has two axis bonds,
 * including the ones at its end, so with a sticking probability below one — which is asked
 * for, and which fattens the branches — nothing on the glass would be erodible. Four of
 * eight is the lattice form of the same physics the brief is reaching for, Gibbs-Thomson:
 * removal rate rises with the local curvature. It keeps every property that was wanted. A
 * convex tip goes first, a filament unzips end-first, a flat rim is immune, and the cleared
 * patch's edge runs along the branches instead of cutting a circle through them.
 *
 * IT IS NOT a backdrop-filter whose radius animates, not a radial-gradient mask chasing the
 * cursor, and not a noise texture fading its opacity. All three of those draw a circle. The
 * tell is the boundary: this one has branch tips, and the tips are not on a curve.
 *
 * THE VISIBLE CONSEQUENCE is screening. Wipe a patch and watch it come back: the tips at
 * the rim of the cleared lens race inward while the ice a few cells behind them, screened
 * from every walker by those tips, stops growing entirely. The lens closes as a set of
 * fingers, never as a shrinking disc, and the wipe you made has a ragged edge because it
 * followed the branches out.
 */

/**
 * Seconds per substep. Nothing here integrates a force, so 1/240 buys no stability; 1/120
 * is the rate at which one generation of growth or one generation of sublimation is applied
 * so the front advances at the same speed on a 60 Hz and a 144 Hz display.
 */
const STEP = 1 / 120;
/** Substeps a frame may consume. A tab restored after a minute must not aggregate a minute. */
const MAX_SUB = 4;
/**
 * Lattice pitch in CSS pixels. A walk covers about sqrt(n) cells in n steps, so the cost of
 * crossing a fixed distance goes as CELL^-2 — at 3 px the warm-up misses a frame budget.
 * Above about 6 px a single-cell branch is too coarse to read as a branch.
 */
const CELL = 5;
/**
 * Probability a contact freezes. Below one on purpose: a failed contact keeps the walker
 * probing, so it works its way along and into the fjords and the branches come out thicker
 * than pure DLA, which is what makes the ice opaque enough to hide type. Above about 0.6 the
 * result is indistinguishable from 1.0 and the mask goes wispy.
 */
const P_STICK = 0.34;
/**
 * Chebyshev radius of the empty box a release site needs. At 1 a walker can be born inside a
 * one-cell fjord and fill it, which erases the screening that is the point. At 3 growth
 * halts leaving 24 px channels, wider than the paint can close, and the spoiler leaks.
 */
const CLEAR = 2;
/** Candidate sites tried per walker. Twelve misses in a row is a saturated pane, cheaply. */
const LAUNCH_TRIES = 12;
/**
 * Steps a walker may take before it is abandoned. 640 steps is about 25 cells of diffusive
 * reach, which spans the widest channel a wiped lens leaves; a longer cap only chases the
 * tail of the hitting-time distribution and spends the frame doing it.
 */
const WALK_MAX = 640;
/** Walkers released per substep. Three refreezes a palm-sized patch in about a second. */
const WALKERS = 3;
/** Warm-up walkers, so the first painted frame is already a settled rime and hides the price. */
const WARM_CAP = 14000;
/** Consecutive releases with nowhere to go that mean growth has halted on its own. */
const WARM_STALL = 48;
/** Warm-up step seatbelt, so no pane size can make the rebuild hang. */
const WARM_STEPS = 1400000;
/** Bonds, of eight, at or above which a cell is too well held to sublimate. */
const BOND_LEAVE = 4;
/** Bonds at or below which a cell is a branch tip, and takes the accent. */
const BOND_TIP = 2;
/** Peak removal probability per generation, directly under the hand. */
const SUBLIME = 0.5;
/** Wipe radius in px for a hovering finger, and for a held press — a palm rather than a tip. */
const WIPE_R = 44;
const WIPE_R_HELD = 74;
/** Points sampled along the pointer's travel since the last frame, so a fast sweep has no gaps. */
const WIPE_SAMPLES = 4;
/** Paint footprints, in px added to the pitch: the diffuse halo, the mat, and the crystal. */
const HALO_GROW = 13;
const MAT_GROW = 6;
const BODY_GROW = 1.2;
/** Alphas for the two constant passes. Overlapping neighbours are what build the opacity. */
const HALO_ALPHA = 0.07;
const MAT_ALPHA = 0.12;
/**
 * The crystal pass grades its alpha by bond count, which is what feathers the boundary
 * without a blur: 0.34 for a lone cell at the growth front, 0.90 for one buried in the rime,
 * plus per-cell grain so the field is ice and not a flat sheet of paint.
 *
 * These are set to hide, not to decorate. The aggregation saturates at four fifths of the
 * cells occupied, so an alpha low enough to keep the rime reading as white-on-dark lace is
 * also low enough to leave 21px type legible straight through it — which is a spoiler that
 * spoils nothing. A pane of frosted glass over a dark card is not lace: it is a mid-tone sheet
 * with the branch structure showing as texture inside it and the growth front glinting at the
 * tips. That is what these numbers and `FROST` are for, and it is also what makes the wipe
 * worth doing, because what comes out from under the ice is crisp black-on-nothing type.
 */
const BODY_BASE = 0.34;
const BODY_BOND = 0.07;
const BODY_GRAIN = 0.12;
/** The tip treatment: a cool halo two px wider than the pitch, and a bright core inside it. */
const TIP_GROW = 2;
const TIP_ALPHA = 0.14;
const TIP_GRAIN = 0.16;
const TIP_CORE = 0.6;
const CORE_ALPHA = 0.44;
const CORE_GRAIN = 0.3;
/**
 * Fractions of the settled rime still standing over the copy at which the text leaves and
 * re-enters the accessibility tree. Two values, not one, because a single threshold flaps
 * while a walker lands and sublimates on the same cell.
 */
const OPEN_LO = 0.3;
const OPEN_HI = 0.62;
/** Insets of the copy box as fractions of the pane, which is the area the coverage is read over. */
const COPY_INSET_X = 0.08;
const COPY_INSET_Y = 0.15;
/** xorshift32 seed. Fixed, so the frost on this panel is the same frost on every load. */
const RNG_SEED = 0x1f35d7;
/**
 * Interior nucleation sites, and the seed they are drawn from.
 *
 * The ring alone is not enough, and the reason is the harmonic measure it grows under: a
 * walker released at random has to get past the branches already reaching in from the frame
 * before it can reach the middle, so the centre of the pane stays the thinnest part of the
 * glass however long it runs — which on this panel is exactly where the price is. Real frost
 * does not have that problem, because glass nucleates on dust and scratches as well as on the
 * cold edge. So does this one: a fixed scatter of motes across the interior, each the start of
 * its own cluster, growing under the same rule and screening each other the same way. Drawn
 * from their own register rather than `state.rng` so that a reset lays them back down in the
 * same places instead of re-frosting a different pane.
 *
 * The count is small on purpose and more is not better. A walker is only released where its
 * surrounding box is clear, so every extra cluster removes release sites, the aggregation
 * stalls sooner, and the pane ends up with *less* ice on it than a smaller scatter gives —
 * measured, two dozen settles thicker than four dozen. Two dozen is the top of that curve.
 */
const MOTES = 24;
const MOTE_SEED = 0x6b2af9;
/**
 * Share of the motes laid inside the copy box rather than over the interior at large.
 *
 * The pane has a job, and the job is the copy box. Scattering uniformly leaves the box as
 * thick as everywhere else, which is an improvement on leaving it the thinnest part and still
 * not enough — the figure is set in the accent, so it is the highest-contrast thing under the
 * ice and the first thing to read through a thin patch. Weighting the dust toward the box
 * makes the glass thickest exactly where something is written, which is the one place a
 * spoiler is allowed to care about.
 */
const MOTE_COPY_SHARE = 0.55;
/** Coverage floor for the ratio, so a pane too small to grow on cannot divide by nothing. */
const SETTLED_FLOOR = 0.02;

/*
 * Two colours and a tint. `FROST` is the sheet — a mid-tone blue-grey rather than white,
 * because at the opacity needed to actually hide the price a white sheet is a lamp in the
 * middle of a dark card, and frosted glass over something dark is not white anyway. `RIME` is
 * the glint on the tip cores and the only near-white on the pane, so the eye is drawn to the
 * growth front. `ACCENT` is the tint, and it appears on the weakly bonded cells and nowhere
 * else.
 */
const FROST = '#9db4cb';
const RIME = '#eef6ff';
const ACCENT = '#8fd0ff';

interface FrostState {
  readonly cols: number;
  readonly rows: number;
  /** One byte per lattice site: 1 is ice. This array is the mask, and nothing else is. */
  readonly occ: Uint8Array;
  /** Cells condemned by the current generation, cleared in one sweep so the update is synchronous. */
  readonly mark: Uint8Array;
  /** Occupied neighbours of eight, rebuilt once a frame and read by all three paint passes. */
  readonly bond: Uint8Array;
  /** Per-cell noise, drawn once, so the rime has grain that does not crawl between frames. */
  readonly grain: Float32Array;
  /** The copy box, in cells. Coverage is read here and nowhere else. */
  readonly copyX0: number;
  readonly copyX1: number;
  readonly copyY0: number;
  readonly copyY1: number;
  readonly copyArea: number;
  /** Bounding box of the condemned cells, so the sweep touches only what the hand reached. */
  markX0: number;
  markX1: number;
  markY0: number;
  markY1: number;
  /** xorshift32 register. */
  rng: number;
  /** Coverage the pane settles at once growth halts, measured at the end of the warm-up. */
  settled: number;
  /** Walk steps spent, watched only by the warm-up. */
  steps: number;
  clock: number;
  carry: number;
  /** The button has cleared the glass: no walker is released until it frosts it over again. */
  held: boolean;
}

/** xorshift32, in [0, 1). Seeded, so the crystal is reproducible frame for frame and load for load. */
function nextFloat(state: FrostState): number {
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
 * The seed: the four frame edges, and a fixed scatter of dust across the glass between them.
 * Frost on a window nucleates on the cold metal, so the cluster starts as the ring; it also
 * nucleates on whatever is on the glass, which is what `MOTES` is and why the middle of the
 * pane frosts at all rather than staying the thin patch the ring's own harmonic measure leaves.
 */
function seedRing(state: FrostState): void {
  const { cols, rows, occ } = state;
  const last = (rows - 1) * cols;
  for (let x = 0; x < cols; x += 1) {
    occ[x] = 1;
    occ[last + x] = 1;
  }
  for (let y = 0; y < rows; y += 1) {
    occ[y * cols] = 1;
    occ[y * cols + cols - 1] = 1;
  }

  // Two cells clear of the ring, so a mote is a cluster of its own rather than a bump on it.
  let r = MOTE_SEED;
  const step = () => {
    r ^= r << 13;
    r >>>= 0;
    r ^= r >>> 17;
    r ^= r << 5;
    r >>>= 0;
    return r;
  };
  const wideX0 = 3;
  const wideY0 = 3;
  const wideW = Math.max(1, cols - 6);
  const wideH = Math.max(1, rows - 6);
  const boxX0 = state.copyX0;
  const boxY0 = state.copyY0;
  const boxW = Math.max(1, state.copyX1 - state.copyX0 + 1);
  const boxH = Math.max(1, state.copyY1 - state.copyY0 + 1);
  const inBox = Math.round(MOTES * MOTE_COPY_SHARE);
  for (let i = 0; i < MOTES; i += 1) {
    const box = i < inBox;
    const x = (box ? boxX0 : wideX0) + (step() % (box ? boxW : wideW));
    const y = (box ? boxY0 : wideY0) + (step() % (box ? boxH : wideH));
    if (x > 0 && y > 0 && x < cols - 1 && y < rows - 1) occ[y * cols + x] = 1;
  }
}

/**
 * Occupied neighbours of the eight, counting off-grid as ice. Off-grid is only ever read
 * from a ring cell, and counting it as ice is what makes the ring immune to the wipe under
 * the same rule as everything else rather than by a special case.
 */
function bonds(state: FrostState, x: number, y: number): number {
  const { cols, rows, occ } = state;
  let count = 0;
  for (let dy = -1; dy <= 1; dy += 1) {
    const ny = y + dy;
    for (let dx = -1; dx <= 1; dx += 1) {
      if (dx === 0 && dy === 0) continue;
      const nx = x + dx;
      if (nx < 0 || ny < 0 || nx >= cols || ny >= rows) count += 1;
      else if (occ[ny * cols + nx]) count += 1;
    }
  }
  return count;
}

/** Is the (2·CLEAR+1) box around this site empty? A site inside the margin never is. */
function isClear(state: FrostState, px: number, py: number): boolean {
  const { cols, rows, occ } = state;
  if (px < CLEAR || py < CLEAR || px >= cols - CLEAR || py >= rows - CLEAR) return false;
  for (let y = py - CLEAR; y <= py + CLEAR; y += 1) {
    const row = y * cols;
    for (let x = px - CLEAR; x <= px + CLEAR; x += 1) {
      if (occ[row + x]) return false;
    }
  }
  return true;
}

/**
 * One walker, start to finish. Returns 1 if it froze, -1 if it ran out of steps, and 0 if
 * the pane had nowhere to release it — which is how growth halts on its own once every open
 * pocket is within CLEAR of the ice, with no supersaturation flag to keep in step.
 *
 * There is no bounds check inside the walk and none is reachable: the release site is inside
 * the ring, the ring is ice, and a walker never enters an occupied cell. The ring is the wall.
 */
function walk(state: FrostState): number {
  const { cols, occ } = state;
  let cx = -1;
  let cy = -1;
  for (let attempt = 0; attempt < LAUNCH_TRIES; attempt += 1) {
    const px = 1 + Math.floor(nextFloat(state) * (cols - 2));
    const py = 1 + Math.floor(nextFloat(state) * (state.rows - 2));
    if (isClear(state, px, py)) {
      cx = px;
      cy = py;
      break;
    }
  }
  if (cx < 0) return 0;

  for (let step = 0; step < WALK_MAX; step += 1) {
    state.steps += 1;
    const dir = Math.floor(nextFloat(state) * 4);
    const nx = cx + (dir === 0 ? 1 : dir === 1 ? -1 : 0);
    const ny = cy + (dir === 2 ? 1 : dir === 3 ? -1 : 0);
    if (occ[ny * cols + nx]) {
      if (nextFloat(state) < P_STICK) {
        occ[cy * cols + cx] = 1;
        return 1;
      }
      continue;
    }
    cx = nx;
    cy = ny;
  }
  return -1;
}

/** A substep of growth. */
function grow(state: FrostState): void {
  for (let i = 0; i < WALKERS; i += 1) walk(state);
}

/**
 * Run the aggregation until it stops itself. This is the settled state of the panel, and it
 * is what the first painted frame shows — a spoiler that has to grow its cover after mount
 * is a spoiler that was readable for a second.
 */
function warm(state: FrostState): void {
  state.steps = 0;
  let dry = 0;
  for (let i = 0; i < WARM_CAP; i += 1) {
    if (walk(state) === 0) {
      dry += 1;
      if (dry >= WARM_STALL) break;
    } else {
      dry = 0;
    }
    if (state.steps > WARM_STEPS) break;
  }
}

/** Fraction of the copy box under ice. The one number the accessibility state is read from. */
function coverage(state: FrostState): number {
  const { cols, occ } = state;
  let filled = 0;
  for (let y = state.copyY0; y <= state.copyY1; y += 1) {
    const row = y * cols;
    for (let x = state.copyX0; x <= state.copyX1; x += 1) {
      if (occ[row + x]) filled += 1;
    }
  }
  return filled / state.copyArea;
}

/**
 * Condemn the weakly bonded ice inside one disc. Marks only — nothing is removed here, so
 * every bond count in the generation is read from the same snapshot and the erosion cannot
 * cascade down the scan direction and shave the patch lopsided.
 *
 * The row and column ranges stop one cell short of the frame, so the ring is never even a
 * candidate: the frost keeps its grip on the frame however hard the glass is rubbed.
 */
function condemn(state: FrostState, sx: number, sy: number, radius: number): void {
  const { cols, occ, mark } = state;
  const r2 = radius * radius;
  const c0 = Math.max(1, Math.floor((sx - radius) / CELL));
  const c1 = Math.min(cols - 2, Math.floor((sx + radius) / CELL));
  const r0 = Math.max(1, Math.floor((sy - radius) / CELL));
  const r1 = Math.min(state.rows - 2, Math.floor((sy + radius) / CELL));
  for (let y = r0; y <= r1; y += 1) {
    const dy = (y + 0.5) * CELL - sy;
    const row = y * cols;
    for (let x = c0; x <= c1; x += 1) {
      const index = row + x;
      if (!occ[index] || mark[index]) continue;
      const dx = (x + 0.5) * CELL - sx;
      const d2 = dx * dx + dy * dy;
      if (d2 > r2) continue;
      if (bonds(state, x, y) >= BOND_LEAVE) continue;
      if (nextFloat(state) >= SUBLIME * (1 - d2 / r2)) continue;
      mark[index] = 1;
      if (x < state.markX0) state.markX0 = x;
      if (x > state.markX1) state.markX1 = x;
      if (y < state.markY0) state.markY0 = y;
      if (y > state.markY1) state.markY1 = y;
    }
  }
}

/** Apply the generation and reset the marks, over the box the marking actually touched. */
function sweep(state: FrostState): void {
  if (state.markX1 < state.markX0) return;
  const { cols, occ, mark } = state;
  for (let y = state.markY0; y <= state.markY1; y += 1) {
    const row = y * cols;
    for (let x = state.markX0; x <= state.markX1; x += 1) {
      const index = row + x;
      if (!mark[index]) continue;
      mark[index] = 0;
      occ[index] = 0;
    }
  }
  state.markX0 = cols;
  state.markX1 = -1;
  state.markY0 = state.rows;
  state.markY1 = -1;
}

/**
 * One sublimation generation along the pointer's travel since the last painted frame. The
 * hand moves further in a frame than its own radius on a fast sweep, so the disc is stamped
 * at several points down the segment; one disc at the current position leaves skipped ice in
 * a stripe pattern that gives the frame rate away.
 */
function wipe(state: FrostState, x0: number, y0: number, x1: number, y1: number, radius: number): void {
  for (let i = 0; i < WIPE_SAMPLES; i += 1) {
    const t = i / (WIPE_SAMPLES - 1);
    condemn(state, x0 + (x1 - x0) * t, y0 + (y1 - y0) * t, radius);
  }
  sweep(state);
}

function build({ width, height }: SceneSetupContext): FrostState {
  const cols = Math.max(11, Math.ceil(width / CELL));
  const rows = Math.max(11, Math.ceil(height / CELL));
  const cells = cols * rows;

  const copyX0 = Math.max(1, Math.floor(cols * COPY_INSET_X));
  const copyY0 = Math.max(1, Math.floor(rows * COPY_INSET_Y));
  const copyX1 = Math.max(copyX0, Math.min(cols - 2, cols - 1 - copyX0));
  const copyY1 = Math.max(copyY0, Math.min(rows - 2, rows - 1 - copyY0));

  const state: FrostState = {
    cols,
    rows,
    occ: new Uint8Array(cells),
    mark: new Uint8Array(cells),
    bond: new Uint8Array(cells),
    grain: new Float32Array(cells),
    copyX0,
    copyX1,
    copyY0,
    copyY1,
    copyArea: (copyX1 - copyX0 + 1) * (copyY1 - copyY0 + 1),
    markX0: cols,
    markX1: -1,
    markY0: rows,
    markY1: -1,
    rng: RNG_SEED,
    settled: SETTLED_FLOOR,
    steps: 0,
    clock: 0,
    carry: 0,
    held: false,
  };

  for (let i = 0; i < cells; i += 1) state.grain[i] = nextFloat(state);

  seedRing(state);
  warm(state);
  state.settled = Math.max(SETTLED_FLOOR, coverage(state));

  return state;
}

/**
 * The mask, painted straight off the occupancy array. Three white footprints per cell — a
 * diffuse halo, a mat, and the crystal itself — so a lattice of five-pixel squares reads as
 * ice with a soft outer edge and no gradient anywhere. The halo is also what closes the last
 * channels the aggregation left open, which is why a spoiler grown on a 5 px lattice does
 * not leak a legible slit of type.
 */
function render({ context, width, height, state }: SceneDrawContext<FrostState>): void {
  const { cols, rows, occ, bond, grain } = state;
  context.clearRect(0, 0, width, height);

  for (let y = 0; y < rows; y += 1) {
    const row = y * cols;
    for (let x = 0; x < cols; x += 1) {
      const index = row + x;
      bond[index] = occ[index] ? bonds(state, x, y) : 0;
    }
  }

  /*
   * All three footprints are the same white, and source-over compositing of one colour gives
   * the same result in any order, so they are interleaved per cell instead of taking three
   * walks of the grid. `globalAlpha` is written per cell rather than `fillStyle`, because a
   * colour string is re-parsed on every assignment and an alpha is not.
   */
  const halo = CELL + HALO_GROW;
  const haloOff = HALO_GROW / 2;
  const mat = CELL + MAT_GROW;
  const matOff = MAT_GROW / 2;
  const body = CELL + BODY_GROW;
  const bodyOff = BODY_GROW / 2;
  context.fillStyle = FROST;
  for (let y = 0; y < rows; y += 1) {
    const row = y * cols;
    const py = y * CELL;
    for (let x = 0; x < cols; x += 1) {
      const index = row + x;
      if (!occ[index]) continue;
      const px = x * CELL;
      context.globalAlpha = HALO_ALPHA;
      context.fillRect(px - haloOff, py - haloOff, halo, halo);
      context.globalAlpha = MAT_ALPHA;
      context.fillRect(px - matOff, py - matOff, mat, mat);
      context.globalAlpha = BODY_BASE + bond[index] * BODY_BOND + grain[index] * BODY_GRAIN;
      context.fillRect(px - bodyOff, py - bodyOff, body, body);
    }
  }

  /*
   * The accent, and the only place it appears on the glass: the weakly bonded cells, which
   * are the branch tips and nothing else. So the cool light in the rime is not decoration
   * sprinkled over the mask — it is the growth front, and after a wipe it is the set of
   * fingers reaching back into the cleared patch.
   */
  const tip = CELL + TIP_GROW;
  const tipOff = TIP_GROW / 2;
  context.fillStyle = ACCENT;
  for (let y = 0; y < rows; y += 1) {
    const row = y * cols;
    const py = y * CELL;
    for (let x = 0; x < cols; x += 1) {
      const index = row + x;
      if (!occ[index] || bond[index] > BOND_TIP) continue;
      context.globalAlpha = TIP_ALPHA + grain[index] * TIP_GRAIN;
      context.fillRect(x * CELL - tipOff, py - tipOff, tip, tip);
    }
  }

  const core = CELL * TIP_CORE;
  const coreOff = (CELL - core) / 2;
  context.fillStyle = RIME;
  for (let y = 0; y < rows; y += 1) {
    const row = y * cols;
    const py = y * CELL + coreOff;
    for (let x = 0; x < cols; x += 1) {
      const index = row + x;
      if (!occ[index] || bond[index] > BOND_TIP) continue;
      context.globalAlpha = CORE_ALPHA + grain[index] * CORE_GRAIN;
      context.fillRect(x * CELL + coreOff, py, core, core);
    }
  }

  context.globalAlpha = 1;
}

/**
 * The panel. The glass layer takes the pointer capture and holds nothing but the canvas, so
 * the reveal button sits in the foot below it, outside that element, where its own click can
 * still land. Whether the price is in the accessibility tree is read off the grid rather than
 * from a flag: the coverage over the copy box, against the coverage the pane settled at, with
 * a wide hysteresis band so a single walker landing cannot flip it.
 */
export type FrostSpoilerProps = { compact?: boolean };

/**
 * `compact` is the 298x240 catalogue card: the prose around the panel is dropped and the pane keeps
 * the box, so what is left is a headline worth hiding and the rime hiding it. The cluster is grown
 * for the card's own pane rather than scaled down from the stage's. The reveal button stays
 * pointer-live but leaves the tab order — the card frame is `aria-hidden`, and its title link is
 * the accessible path to the item.
 */
export function FrostSpoiler({ compact = false }: FrostSpoilerProps) {
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(false);
  const uid = useId();
  const secretId = `${uid}-secret`;

  // Mirrors, because the scene runs inside a loop React does not drive. `open` is written by
  // the scene, so its ref is the value the scene compares against; `held` and `reset` are
  // written by the button and consumed on the next painted frame.
  const openRef = useRef(false);
  const heldRef = useRef(false);
  const resetRef = useRef(false);
  const snapRef = useRef(reduced);
  snapRef.current = reduced;

  const setup = (scene: SceneSetupContext): FrostState => {
    const state = build(scene);
    /*
     * A resize rebuilds the scene, and a panel the reader has already opened must not frost
     * itself over again behind their back. The warm-up still runs first, because the coverage
     * it settles at is the yardstick every later reading is taken against.
     */
    if (heldRef.current) {
      state.occ.fill(0);
      state.held = true;
    }
    return state;
  };

  const draw = (scene: SceneDrawContext<FrostState>) => {
    const { state, pointer } = scene;

    if (resetRef.current) {
      resetRef.current = false;
      state.occ.fill(0);
      state.held = heldRef.current;
      if (!state.held) {
        // Frosting over runs the aggregation to its settled state in one frame rather than
        // growing it live. A spoiler that takes a second to cover itself is a spoiler that
        // was readable for a second.
        seedRing(state);
        warm(state);
      }
    }

    const now = performance.now() / 1000;
    const elapsed = state.clock === 0 ? 0 : Math.min(0.25, now - state.clock);
    state.clock = now;
    // A press is a palm rather than a fingertip, so the patch it takes off is wider.
    const radius = pointer.down ? WIPE_R_HELD : WIPE_R;

    if (snapRef.current) {
      // Reduced motion: the loop never runs, but the hook repaints once per pointer move, so
      // one generation per repaint keeps the wipe answering the hand while nothing creeps of
      // its own accord and nothing refreezes behind it.
      if (pointer.inside) wipe(state, pointer.lastX, pointer.lastY, pointer.x, pointer.y, radius);
    } else {
      state.carry += elapsed;
      let taken = 0;
      while (state.carry >= STEP && taken < MAX_SUB) {
        // The hand holds the glass under it above the frost point, so the aggregation stops
        // while the pointer is on the pane and resumes the moment it leaves.
        if (pointer.inside) wipe(state, pointer.lastX, pointer.lastY, pointer.x, pointer.y, radius);
        else if (!state.held) grow(state);
        state.carry -= STEP;
        taken += 1;
      }
      if (taken === MAX_SUB) state.carry = 0;
    }

    render(scene);

    const ratio = coverage(state) / state.settled;
    const shown = openRef.current;
    const next = shown ? ratio < OPEN_HI : ratio <= OPEN_LO;
    if (next !== shown) {
      openRef.current = next;
      setOpen(next);
    }
  };

  const { stageRef, canvasRef, requestRender } = useCanvasScene<FrostState>({ setup, draw });

  // With the loop stopped under reduced motion nothing else would repaint, and the glass would
  // keep showing the state the last press left.
  useEffect(() => requestRender(), [open, reduced, requestRender]);

  const onReveal = () => {
    // Read off `open`, not off the ref, so the button always does what its label says even
    // when the reader has already wiped most of the ice away by hand.
    heldRef.current = !open;
    resetRef.current = true;
    requestRender();
  };

  return (
    <div className="frost-spoiler-stage" data-compact={compact ? 'true' : undefined}>
      <div className="frost-spoiler-card">
        <p className="frost-spoiler-kicker">Launch pricing</p>
        <p className="frost-spoiler-lead">
          The rate below is still under embargo. Sweep the glass to melt a patch of the rime, or
          clear the panel outright with the button.
        </p>

        <div className="frost-spoiler-pane">
          <div
            id={secretId}
            className="frost-spoiler-secret"
            data-veiled={open ? undefined : 'true'}
            aria-hidden={open ? undefined : true}
          >
            <h3 className="frost-spoiler-headline">
              Studio seats open at <span className="frost-spoiler-figure">$19</span> a month
            </h3>
            <p className="frost-spoiler-body">
              Billed yearly it is $190, so two months come back. Two private workspaces, the shared
              render queue at full width, and a year of version history on every board. Any account
              opened before general availability holds this rate for its first twelve months.
            </p>
          </div>

          {open ? null : (
            <p className="frost-spoiler-note">
              The launch price is frosted over and cannot be read. Use the reveal button below the
              panel to clear the glass and put the price back.
            </p>
          )}

          <div ref={stageRef} className="frost-spoiler-glass" aria-hidden="true">
            <canvas ref={canvasRef} />
          </div>
        </div>

        <div className="frost-spoiler-foot">
          <p className="frost-spoiler-embargo">Embargo lifts 14 October</p>
          <button
            type="button"
            className="frost-spoiler-reveal"
            aria-expanded={open}
            aria-controls={secretId}
            tabIndex={compact ? -1 : undefined}
            onClick={onReveal}
          >
            {open ? 'Frost it over' : 'Reveal the price'}
          </button>
        </div>
      </div>

      <p className="frost-spoiler-hint">sweep the glass</p>
    </div>
  );
}

export default FrostSpoiler;
