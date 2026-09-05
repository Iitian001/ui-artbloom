'use client';

import './lloyd-avatars.css';

import { useEffect, useRef, useState, type KeyboardEvent } from 'react';

import {
  useCanvasScene,
  useReducedMotion,
  type SceneDrawContext,
  type SceneSetupContext,
} from '@/hooks/use-canvas-scene';

/**
 * A reviewer group whose packing is solved rather than authored.
 *
 * Each face is a Voronoi site in the frame, and the tile it owns is the set of points
 * closer to it than to anybody else:
 *
 *     V_i = { p in F : |p − s_i| <= |p − s_j| for all j != i }
 *
 * which is an intersection of half-planes, one per other face, each bounded by the
 * perpendicular bisector of that pair — so a tile is the frame polygon clipped once
 * against every other site. The arrangement then walks downhill on the energy of a
 * centroidal Voronoi tessellation,
 *
 *     E(s) = sum_i integral_{V_i} |p − s_i|^2 dA,     dE/ds_i = 2 * A_i * (s_i − c_i)
 *
 * where A_i is the tile's area and c_i its area centroid, both read straight off the
 * clipped polygon by the shoelace formula. One Lloyd iteration
 *
 *     s_i <- s_i + L * (c_i − s_i)
 *
 * is therefore a gradient step preconditioned by the tile's own mass, −(L/2A_i) dE/ds_i,
 * and its fixed point is the centroidal condition s_i = c_i: every face sitting at the
 * centre of mass of its own territory. Integrated at a fixed 1/120 s step so the same
 * drag settles the same way on a 60 Hz and a 144 Hz screen.
 *
 * This is not a grid under a rounded mask, not an eased keyframe between two authored
 * layouts, and not a force-directed cluster with a collision check. What follows from
 * actually solving it:
 *
 *   - Overlap is impossible rather than prevented. Two tiles are separated by the
 *     bisector of their two faces, so they are disjoint by construction: there is no
 *     collision test to lose, at any head count, mid-drag, at any frame rate.
 *   - Nothing is authored per head count. Seat an eighth face and the neighbours' tiles
 *     each gain one more half-plane; unseat one and the hole closes because the same
 *     twenty lines now solve a seven-site problem.
 *
 * The face a press picks up is the one whose tile the press landed in, because that is
 * what a Voronoi diagram is. It is then pinned to the pointer while the other seven keep
 * descending around it.
 */

/** Seconds per iteration. The descent is first order and stable for any L <= 1, so the
 *  fixed step is here for reproducibility, not for stability. */
const STEP = 1 / 120;
/** Iterations per frame, capped. The 0.05 s delta clamp already bounds a frame to six of
 *  them; twelve is the backstop for a clock that jumped, not a budget. */
const MAX_STEPS = 12;
/** L: the fraction of the way to its centroid a face moves per iteration. Time constant
 *  STEP/L = 0.12 s, which is the lag on the other faces while one is dragged. L = 1 is
 *  plain Lloyd and lands within a frame, too fast to read; 0.02 takes three seconds. */
const RELAX = 0.07;
/** Reduced motion runs that same iteration to its fixed point instead. A twentieth of a
 *  pixel of movement is converged at this size, and the measured worst case — eight faces
 *  from the stacked start — is 54 iterations, so 120 is a ceiling with room over it. */
const SETTLE_TOL = 0.05;
const SETTLE_MAX = 120;
/** Seconds for a newly seated face's art to come up. Only the art fades: the site joins
 *  the tessellation on the frame it is seated, which is the whole point. */
const FADE = 0.22;

/** Frame corner radius in px, and arc samples per corner. Five segments hold the polygon
 *  within CORNER * (1 − cos 9deg) = 0.17px of a true arc, under one device pixel at 2x. */
const CORNER = 14;
const ARC_SEGS = 5;
/** How close to the frame edge a site may be pushed, px. A site on the boundary owns a
 *  wedge with no room for a monogram, and nine is the least a legible disc needs. */
const EDGE_KEEP = 9;
/** Half the seam between two tiles, px. A tile is its cell eroded by this, so the 6px
 *  gutter is geometry that the clipper produced and not a stroke laid over a join. */
const GUTTER = 3;
/** Monogram radius as a fraction of the site's clearance to its own cell edge. Under a
 *  half, so a disc cannot cross a seam whatever shape the cell around it takes. */
const DISC = 0.46;
/** Least clearance, px, at which a tile is worth lettering. The stacked start never gets
 *  tighter than 15px of room, so the monograms are there from the first frame at a third
 *  of their settled size and grow as the tiles open up. */
const MIN_ROOM = 13;
/** Arrow-key step, px. A site's move carries every boundary it shares half as far, so
 *  one press shifts a seam by exactly one gutter — visible, and ten presses cross a tile. */
const NUDGE = 12;
/** Vertex capacity per polygon. The frame is a 24-gon, seven bisector clips can add one
 *  vertex each, and the erosion at most one per edge again: 62 worst case, doubled. */
const VERTS = 128;
/** Two colours and a tint — ink, one accent, and that accent under a tenth of an alpha. */
const INK = '234, 243, 255';
const ACCENT = '134, 224, 203';
const TAU = Math.PI * 2;

/** The roster. Distinct initials A–H, so a monogram is one legible letter at tile size. */
const ROSTER = [
  { first: 'Ana', last: 'Reyes' },
  { first: 'Ben', last: 'Okafor' },
  { first: 'Cleo', last: 'Marsh' },
  { first: 'Devi', last: 'Rao' },
  { first: 'Eli', last: 'Nakamura' },
  { first: 'Farah', last: 'Osman' },
  { first: 'Gil', last: 'Andrade' },
  { first: 'Hana', last: 'Weiss' },
];
/** Seats taken on load: seven in, one open, so the eighth can be seated and watched. */
const SEATED = 7;

/** One face: its site, the cell that site owns, and what the shoelace pass read off it. */
interface Tile {
  readonly member: number;
  x: number;
  y: number;
  /** The cell as a flat x,y loop, rebuilt every iteration. */
  readonly cell: Float64Array;
  cellLen: number;
  area: number;
  cx: number;
  cy: number;
  /** Distance from the site to the nearest edge of its own cell — the room it has. */
  room: number;
  fade: number;
}

interface LloydState {
  /** The frame as a convex polygon. Every cell starts life as a copy of it. */
  readonly frame: Float64Array;
  readonly frameLen: number;
  /** The frame eroded by EDGE_KEEP: the region a site is allowed to stand in. */
  readonly roam: Float64Array;
  readonly roamLen: number;
  /** Ping-pong buffers for the clipper, so a frame of this allocates nothing. */
  readonly bufA: Float64Array;
  readonly bufB: Float64Array;
  readonly midX: number;
  readonly midY: number;
  tiles: Tile[];
  /** Roster index held by the pointer, pinned by the keyboard, and lit by the roster. */
  heldMember: number;
  pinMember: number;
  spot: number;
  /** Site minus pointer at the moment of the grab, so taking hold never jumps a face. */
  grabX: number;
  grabY: number;
  clock: number;
  carry: number;
  /** Solve to the fixed point instead of stepping toward it. Set under reduced motion,
   *  where the loop never runs and one L per repaint would never arrive anywhere. */
  snap: boolean;
}

/**
 * The frame as a convex polygon: a rounded rectangle sampled ARC_SEGS times per corner.
 * Convex is the entire requirement — clipping a convex polygon by a half-plane leaves a
 * convex polygon, which is what keeps every cell a single simple loop with no bookkeeping.
 * Wound so the shoelace area comes out positive (clockwise on screen, y down), and
 * Sutherland-Hodgman preserves winding, so the inward normal of any edge of any cell
 * derived from this is always (−dy, dx).
 */
function framePolygon(width: number, height: number, out: Float64Array): number {
  // Inset by the hairline the frame is stroked with, so the stroke lands inside the
  // canvas instead of losing half its width off the edge.
  const x0 = 1;
  const y0 = 1;
  const x1 = width - 1;
  const y1 = height - 1;
  const r = Math.max(0, Math.min(CORNER, (x1 - x0) / 2, (y1 - y0) / 2));
  let n = 0;
  const arc = (cx: number, cy: number, from: number) => {
    for (let i = 0; i <= ARC_SEGS; i += 1) {
      const a = from + (Math.PI / 2) * (i / ARC_SEGS);
      out[n * 2] = cx + r * Math.cos(a);
      out[n * 2 + 1] = cy + r * Math.sin(a);
      n += 1;
    }
  };
  arc(x1 - r, y0 + r, -Math.PI / 2);
  arc(x1 - r, y1 - r, 0);
  arc(x0 + r, y1 - r, Math.PI / 2);
  arc(x0 + r, y0 + r, Math.PI);
  return n;
}

/**
 * Sutherland-Hodgman against one half-plane, keeping { p : n.p <= c }. Every piece of
 * geometry in this file is this function: a cell is the frame clipped by one of these per
 * other face, and a tile is that cell clipped by one per edge of itself.
 */
function clipHalfPlane(
  src: Float64Array,
  n: number,
  nx: number,
  ny: number,
  c: number,
  out: Float64Array,
): number {
  let m = 0;
  for (let i = 0; i < n; i += 1) {
    const j = (i + 1) % n;
    const ax = src[i * 2];
    const ay = src[i * 2 + 1];
    const bx = src[j * 2];
    const by = src[j * 2 + 1];
    const da = nx * ax + ny * ay - c;
    const db = nx * bx + ny * by - c;
    if (da <= 0) {
      out[m * 2] = ax;
      out[m * 2 + 1] = ay;
      m += 1;
    }
    // Strict signs on both ends: an endpoint exactly on the plane is already kept above,
    // and emitting it twice would leave a zero-length edge in the loop.
    if ((da < 0 && db > 0) || (da > 0 && db < 0)) {
      const t = da / (da - db);
      out[m * 2] = ax + (bx - ax) * t;
      out[m * 2 + 1] = ay + (by - ay) * t;
      m += 1;
    }
  }
  return m;
}

/** Trace a flat polygon as a path. */
function tracePoly(context: CanvasRenderingContext2D, p: Float64Array, n: number): void {
  context.beginPath();
  context.moveTo(p[0], p[1]);
  for (let i = 1; i < n; i += 1) context.lineTo(p[i * 2], p[i * 2 + 1]);
  context.closePath();
}

/**
 * Erode a convex polygon by `gap`: clip it against each of its own edges pushed inward,
 * which for a convex polygon is exactly the inward offset. The planes are read off `src`
 * throughout, since a half-plane intersection does not care what order it is taken in, and
 * the answer is left in `a`. Returns 0 when the gap has eaten the polygon, which is the
 * right answer for a sliver of a cell.
 */
function erodeInto(
  src: Float64Array,
  n: number,
  gap: number,
  a: Float64Array,
  b: Float64Array,
): number {
  let from = a;
  let to = b;
  let m = n;
  for (let i = 0; i < n * 2; i += 1) a[i] = src[i];
  for (let i = 0; i < n; i += 1) {
    const j = (i + 1) % n;
    const ax = src[i * 2];
    const ay = src[i * 2 + 1];
    const dx = src[j * 2] - ax;
    const dy = src[j * 2 + 1] - ay;
    const len = Math.hypot(dx, dy);
    if (len < 1e-6) continue;
    // The outward unit normal: the inward one, (−dy, dx)/len, negated.
    const nx = dy / len;
    const ny = -dx / len;
    m = clipHalfPlane(from, m, nx, ny, nx * ax + ny * ay - gap, to);
    if (m < 3) return 0;
    const swap = from;
    from = to;
    to = swap;
  }
  if (from !== a) for (let i = 0; i < m * 2; i += 1) a[i] = from[i];
  return m;
}

/** Area, area centroid and the site's clearance to its own cell edge, in one pass. */
function measure(tile: Tile): void {
  const p = tile.cell;
  const n = tile.cellLen;
  if (n < 3) {
    tile.area = 0;
    tile.cx = tile.x;
    tile.cy = tile.y;
    tile.room = 0;
    return;
  }
  let twice = 0;
  let cx = 0;
  let cy = 0;
  let room = Number.POSITIVE_INFINITY;
  for (let i = 0; i < n; i += 1) {
    const j = (i + 1) % n;
    const ax = p[i * 2];
    const ay = p[i * 2 + 1];
    const bx = p[j * 2];
    const by = p[j * 2 + 1];
    // Each cross term is twice the signed area of the triangle back to the origin, and the
    // centroid is those crosses weighted by the edge midpoints — the origin cancels out.
    const cross = ax * by - bx * ay;
    twice += cross;
    cx += (ax + bx) * cross;
    cy += (ay + by) * cross;
    const dx = bx - ax;
    const dy = by - ay;
    const len = Math.hypot(dx, dy);
    if (len > 1e-6) {
      const gap = (-dy * (tile.x - ax) + dx * (tile.y - ay)) / len;
      if (gap < room) room = gap;
    }
  }
  tile.area = twice / 2;
  tile.cx = twice === 0 ? tile.x : cx / (3 * twice);
  tile.cy = twice === 0 ? tile.y : cy / (3 * twice);
  tile.room = Number.isFinite(room) ? Math.max(0, room) : 0;
}

/** One face's cell: the frame clipped by the bisector of it and every other face. */
function cellOf(state: LloydState, tile: Tile): void {
  const { frame, frameLen, bufA, bufB } = state;
  let from = bufA;
  let to = bufB;
  let n = frameLen;
  for (let i = 0; i < frameLen * 2; i += 1) bufA[i] = frame[i];
  const own = tile.x * tile.x + tile.y * tile.y;
  for (const other of state.tiles) {
    if (other === tile) continue;
    const dx = other.x - tile.x;
    const dy = other.y - tile.y;
    // Two faces on the same pixel have no bisector between them. That pair simply divides
    // nothing this iteration, and the next one moves them apart.
    if (dx * dx + dy * dy < 1e-9) continue;
    // |p − s|^2 <= |p − o|^2 rearranges to 2(o − s).p <= |o|^2 − |s|^2.
    const c = other.x * other.x + other.y * other.y - own;
    n = clipHalfPlane(from, n, 2 * dx, 2 * dy, c, to);
    if (n < 3) break;
    const swap = from;
    from = to;
    to = swap;
  }
  tile.cellLen = n < 3 ? 0 : n;
  for (let i = 0; i < tile.cellLen * 2; i += 1) tile.cell[i] = from[i];
}

/** Rebuild every cell against the current sites and measure them. No motion. */
function tessellate(state: LloydState): void {
  for (const tile of state.tiles) {
    cellOf(state, tile);
    measure(tile);
  }
}

/** Held by the pointer or pinned by the keyboard: either way the solver leaves it alone. */
function pinned(state: LloydState, tile: Tile): boolean {
  return tile.member === state.heldMember || tile.member === state.pinMember;
}

/**
 * One Lloyd iteration. Every cell is built against the same set of positions and only then
 * is anything moved — a Jacobi sweep rather than Gauss-Seidel, so the arrangement cannot
 * depend on the order the roster happens to be in. Returns the largest step taken, which
 * at L = 1 is the residual and is the convergence test below.
 */
function relax(state: LloydState, lambda: number): number {
  tessellate(state);
  let largest = 0;
  for (const tile of state.tiles) {
    if (pinned(state, tile) || tile.cellLen < 3) continue;
    const dx = lambda * (tile.cx - tile.x);
    const dy = lambda * (tile.cy - tile.y);
    tile.x += dx;
    tile.y += dy;
    const step = Math.hypot(dx, dy);
    if (step > largest) largest = step;
  }
  return largest;
}

/** The answer rather than the route to it: plain Lloyd, L = 1, run to its fixed point. */
function settle(state: LloydState): void {
  for (let i = 0; i < SETTLE_MAX; i += 1) {
    if (relax(state, 1) < SETTLE_TOL) break;
  }
  // Nothing here is on its way anywhere, so nothing may be mid-fade either.
  for (const tile of state.tiles) tile.fade = 1;
}

/** A tile with its own clipping buffer. Allocated when a face is seated, never per frame. */
function makeTile(member: number, x: number, y: number, fade: number): Tile {
  return {
    member,
    x,
    y,
    cell: new Float64Array(VERTS * 2),
    cellLen: 0,
    area: 0,
    cx: x,
    cy: y,
    room: 0,
    fade,
  };
}

/**
 * Put a face at (x, y), or at the nearest point of the region a site is allowed to stand
 * in. The out-of-bounds case is a true projection onto the boundary rather than a clamp
 * per edge: a pointer under capture is regularly a long way outside the frame, and pushing
 * it back along one edge normal at a time accumulates across the twenty-four of them and
 * lands the face somewhere the pointer never was.
 */
function pinTo(state: LloydState, tile: Tile, x: number, y: number): void {
  const p = state.roam;
  const n = state.roamLen;
  if (n < 3) {
    // A frame too small to hold a face clear of its own edge. The middle is the only
    // defensible answer, and it keeps the cell non-empty.
    tile.x = state.midX;
    tile.y = state.midY;
    return;
  }
  let inside = true;
  for (let i = 0; i < n && inside; i += 1) {
    const j = (i + 1) % n;
    const ax = p[i * 2];
    const ay = p[i * 2 + 1];
    const dx = p[j * 2] - ax;
    const dy = p[j * 2 + 1] - ay;
    if (-dy * (x - ax) + dx * (y - ay) < 0) inside = false;
  }
  if (inside) {
    tile.x = x;
    tile.y = y;
    return;
  }
  let best = Number.POSITIVE_INFINITY;
  for (let i = 0; i < n; i += 1) {
    const j = (i + 1) % n;
    const ax = p[i * 2];
    const ay = p[i * 2 + 1];
    const dx = p[j * 2] - ax;
    const dy = p[j * 2 + 1] - ay;
    const span = dx * dx + dy * dy;
    const t = span < 1e-9 ? 0 : Math.max(0, Math.min(1, ((x - ax) * dx + (y - ay) * dy) / span));
    const px = ax + dx * t;
    const py = ay + dy * t;
    const d = (x - px) * (x - px) + (y - py) * (y - py);
    if (d < best) {
      best = d;
      tile.x = px;
      tile.y = py;
    }
  }
}

/** The face nearest a point, which is the face whose tile the point is in. */
function tileAt(state: LloydState, x: number, y: number): Tile | null {
  let best: Tile | null = null;
  let near = Number.POSITIVE_INFINITY;
  for (const tile of state.tiles) {
    const d = (tile.x - x) * (tile.x - x) + (tile.y - y) * (tile.y - y);
    if (d < near) {
      near = d;
      best = tile;
    }
  }
  return best;
}

function tileOf(state: LloydState, member: number): Tile | null {
  for (const tile of state.tiles) if (tile.member === member) return tile;
  return null;
}

/**
 * Seat a face. The newcomer is dropped half way out toward the far corner of whichever
 * tile is largest, so the split it forces begins where there is most room to give — and
 * it is never coincident with the site already there, which a bisector needs.
 */
function seat(state: LloydState, member: number): void {
  let host: Tile | null = null;
  for (const tile of state.tiles) if (!host || tile.area > host.area) host = tile;
  let x = state.midX;
  let y = state.midY;
  if (host && host.cellLen >= 3) {
    let far = 0;
    for (let i = 0; i < host.cellLen; i += 1) {
      const vx = host.cell[i * 2] - host.cx;
      const vy = host.cell[i * 2 + 1] - host.cy;
      const d = vx * vx + vy * vy;
      if (d > far) {
        far = d;
        x = host.cx + vx * 0.5;
        y = host.cy + vy * 0.5;
      }
    }
  }
  const tile = makeTile(member, x, y, 0);
  pinTo(state, tile, x, y);
  state.tiles.push(tile);
}

/** Bring the tessellation in line with the roster: take the leavers out, seat the joiners. */
function reconcile(state: LloydState, seated: readonly boolean[]): void {
  for (let i = state.tiles.length - 1; i >= 0; i -= 1) {
    const tile = state.tiles[i];
    if (seated[tile.member]) continue;
    if (state.heldMember === tile.member) state.heldMember = -1;
    state.tiles.splice(i, 1);
  }
  for (let member = 0; member < ROSTER.length; member += 1) {
    if (seated[member] && !tileOf(state, member)) seat(state, member);
  }
}

/** Everything the scene owns, sized to this frame. Re-run on every resize. */
function build(
  { width, height }: SceneSetupContext,
  seated: readonly boolean[],
  places: number[],
  snap: boolean,
): LloydState {
  const frame = new Float64Array(VERTS * 2);
  const frameLen = framePolygon(width, height, frame);
  const bufA = new Float64Array(VERTS * 2);
  const bufB = new Float64Array(VERTS * 2);
  const roam = new Float64Array(VERTS * 2);
  const roamLen = erodeInto(frame, frameLen, EDGE_KEEP, bufA, bufB);
  for (let i = 0; i < roamLen * 2; i += 1) roam[i] = bufA[i];

  const state: LloydState = {
    frame,
    frameLen,
    roam,
    roamLen,
    bufA,
    bufB,
    midX: width / 2,
    midY: height / 2,
    tiles: [],
    heldMember: -1,
    pinMember: -1,
    spot: -1,
    grabX: 0,
    grabY: 0,
    clock: 0,
    carry: 0,
    snap,
  };
  // Sites come from the fractions of the frame they were last at, not from pixels of the
  // old one, so a resize re-seats each face where it already was instead of restarting the
  // descent. On the first build those fractions are the overlapped avatar row.
  for (let member = 0; member < ROSTER.length; member += 1) {
    if (!seated[member]) continue;
    const tile = makeTile(member, state.midX, state.midY, 1);
    pinTo(state, tile, places[member * 2] * width, places[member * 2 + 1] * height);
    state.tiles.push(tile);
  }
  if (snap) settle(state);
  else tessellate(state);
  return state;
}

/** One face: the territory it owns, and the monogram sitting in the middle of it. */
function drawTile(context: CanvasRenderingContext2D, state: LloydState, tile: Tile): void {
  const n = erodeInto(tile.cell, tile.cellLen, GUTTER, state.bufA, state.bufB);
  if (n < 3) return;
  const lit = pinned(state, tile) || tile.member === state.spot;
  const fade = tile.fade;
  const r = DISC * tile.room;

  context.save();
  tracePoly(context, state.bufA, n);
  // A vignette per panel, centred on the face rather than on the panel, so neighbours read
  // apart even where their shared seam crosses empty frame. The base alpha climbs with the
  // roster index, which is what keeps eight identical panels from reading as one surface.
  const wash = context.createRadialGradient(tile.x, tile.y, 0, tile.x, tile.y, Math.max(8, tile.room * 2.4));
  const base = 0.028 + 0.006 * tile.member;
  wash.addColorStop(0, lit ? `rgba(${ACCENT}, ${0.095 * fade})` : `rgba(${INK}, ${(base + 0.045) * fade})`);
  wash.addColorStop(1, lit ? `rgba(${ACCENT}, ${0.038 * fade})` : `rgba(${INK}, ${base * fade})`);
  context.fillStyle = wash;
  context.fill();
  context.lineWidth = 1;
  context.strokeStyle = lit ? `rgba(${ACCENT}, ${0.45 * fade})` : `rgba(${INK}, ${0.11 * fade})`;
  context.stroke();

  // Everything inside is clipped to the panel, so a monogram is cropped by its own
  // territory exactly the way a photograph in a mosaic would be.
  context.clip();
  if (r >= 4) {
    context.beginPath();
    context.arc(tile.x, tile.y, r, 0, TAU);
    context.fillStyle = lit ? `rgba(${ACCENT}, ${0.16 * fade})` : `rgba(${INK}, ${0.075 * fade})`;
    context.fill();
    context.strokeStyle = lit ? `rgba(${ACCENT}, ${0.62 * fade})` : `rgba(${INK}, ${0.24 * fade})`;
    context.stroke();
  }
  if (tile.room >= MIN_ROOM) {
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.font = `500 ${(r * 1.05).toFixed(1)}px ui-monospace, "SFMono-Regular", Menlo, monospace`;
    context.fillStyle = lit ? `rgba(255, 255, 255, ${0.92 * fade})` : `rgba(${INK}, ${0.78 * fade})`;
    context.fillText(ROSTER[tile.member].first.charAt(0), tile.x, tile.y);
  }
  context.restore();
}

function paint(
  context: CanvasRenderingContext2D,
  state: LloydState,
  width: number,
  height: number,
): void {
  context.clearRect(0, 0, width, height);
  context.lineJoin = 'round';
  context.lineCap = 'round';

  // The frame's own ground, from the very polygon the cells are cut out of.
  tracePoly(context, state.frame, state.frameLen);
  context.fillStyle = `rgba(${INK}, 0.022)`;
  context.fill();

  for (const tile of state.tiles) drawTile(context, state, tile);

  tracePoly(context, state.frame, state.frameLen);
  context.lineWidth = 1;
  context.strokeStyle = `rgba(${INK}, 0.16)`;
  context.stroke();
}

/** The line an avatar group carries. Real grammar at every count this one can reach. */
function summarise(names: readonly string[]): string {
  if (names.length <= 2) return names.join(' and ');
  if (names.length === 3) return `${names[0]}, ${names[1]} and ${names[2]}`;
  const rest = names.length - 3;
  return `${names[0]}, ${names[1]}, ${names[2]} and ${rest} ${rest === 1 ? 'other' : 'others'}`;
}

/**
 * A reviewer group. The seat gauge, the frame, the names line and the roster are one
 * control over one tessellation: the chips seat and unseat, a press drags whichever face
 * it landed on, and the arrow keys pin a face and walk it.
 */
/** `compact` is the 298x240 catalogue card: the same eight faces, the same tessellation and
 *  the same drag, with the sentence naming the reviewers and the hint dropped. Every seat is
 *  stored as a fraction of the frame and the frame polygon is measured from the canvas box, so
 *  the packing is scale-free and a shorter frame is the same solve. See `lloyd-avatars.css`. */
export type LloydAvatarsProps = { compact?: boolean };

export function LloydAvatars({ compact = false }: LloydAvatarsProps) {
  const reduced = useReducedMotion();
  const [seated, setSeated] = useState<readonly boolean[]>(() =>
    ROSTER.map((_, index) => index < SEATED),
  );
  /**
   * Where each face is, as a fraction of the frame. Starts as the overlapped avatar row
   * every one of these components is handed — that row is the unsolved state, and the first
   * second of the loop is it being solved.
   */
  const placesRef = useRef<number[]>(
    ROSTER.flatMap((_, index) => [
      0.3 + (0.4 * index) / (ROSTER.length - 1),
      // Alternated either side of the mid-line. A perfectly collinear start is a symmetric
      // configuration and Lloyd preserves symmetry exactly: the row would descend into
      // vertical bands, which is a critical point of the energy and not the answer.
      index % 2 === 0 ? 0.445 : 0.555,
    ]),
  );
  /** Roster index the pointer or focus is over, and the one the keyboard is holding. Refs,
   *  not state: the canvas is their only reader, so a hover need not re-render the chips. */
  const spotRef = useRef(-1);
  const pinRef = useRef(-1);
  const nudgeRef = useRef<{ member: number; dx: number; dy: number } | null>(null);

  const draw = (scene: SceneDrawContext<LloydState>) => {
    const { context, width, height, state, pointer } = scene;
    state.snap = reduced;
    state.spot = spotRef.current;
    reconcile(state, seated);

    const nudge = nudgeRef.current;
    if (nudge) {
      nudgeRef.current = null;
      const tile = tileOf(state, nudge.member);
      // A nudge on its own would be undone by the next iteration, because the centroid is
      // an attractor. Pinning is what makes the keyboard the same gesture as the drag.
      if (tile) {
        pinRef.current = nudge.member;
        pinTo(state, tile, tile.x + nudge.dx, tile.y + nudge.dy);
      }
    }
    state.pinMember = pinRef.current;

    if (!pointer.down) state.heldMember = -1;
    else if (state.heldMember < 0 && pointer.inside) {
      const tile = tileAt(state, pointer.x, pointer.y);
      if (tile) {
        state.heldMember = tile.member;
        state.grabX = tile.x - pointer.x;
        state.grabY = tile.y - pointer.y;
        // One face at a time: taking hold of one lets go of whatever the keys were holding.
        pinRef.current = -1;
        state.pinMember = -1;
      }
    }
    const held = state.heldMember < 0 ? null : tileOf(state, state.heldMember);
    if (held) pinTo(state, held, pointer.x + state.grabX, pointer.y + state.grabY);

    const now = performance.now();
    const elapsed = state.clock ? Math.min(0.05, (now - state.clock) / 1000) : STEP;
    state.clock = now;

    if (state.snap) {
      settle(state);
      state.carry = 0;
    } else {
      state.carry += elapsed;
      const steps = Math.min(MAX_STEPS, Math.floor(state.carry / STEP));
      for (let i = 0; i < steps; i += 1) relax(state, RELAX);
      state.carry -= steps * STEP;
      // A tab left in the background banks minutes of arrears. Drop them rather than
      // paying them off at twelve iterations a frame for the next quarter of a second.
      if (state.carry > STEP * MAX_STEPS) state.carry = 0;
      for (const tile of state.tiles) {
        if (tile.fade < 1) tile.fade = Math.min(1, tile.fade + (steps * STEP) / FADE);
      }
    }

    // The last thing either branch did was move the sites, which leaves every cell one
    // step behind the face inside it. Rebuilding here is what guarantees that the tile
    // drawn around a face really is the set of points nearest that face.
    tessellate(state);
    paint(context, state, width, height);

    for (const tile of state.tiles) {
      placesRef.current[tile.member * 2] = tile.x / width;
      placesRef.current[tile.member * 2 + 1] = tile.y / height;
    }
  };

  const { stageRef, canvasRef, requestRender } = useCanvasScene<LloydState>({
    setup: (scene) => build(scene, seated, placesRef.current, reduced),
    draw,
  });

  // The roster is React state and the tessellation is not, so seating somebody — or the
  // motion preference changing, which stops the loop outright — has to ask for the repaint
  // that keeps the frame showing the same roster the chips do.
  useEffect(() => {
    requestRender();
  }, [seated, reduced, requestRender]);

  const toggle = (member: number) => {
    setSeated((prev) => prev.map((on, index) => (index === member ? !on : on)));
  };

  const light = (member: number) => {
    spotRef.current = member;
    requestRender();
  };

  const dim = () => {
    spotRef.current = -1;
    requestRender();
  };

  /** Focus leaving a chip lets its face go, so one is never left held by a control nobody
   *  is on. A pointer merely leaving does not: the keys, not the mouse, took hold of it. */
  const letGo = () => {
    spotRef.current = -1;
    pinRef.current = -1;
    requestRender();
  };

  /**
   * The arrows walk the face this chip belongs to and hold it there while they do: one
   * press carries every boundary it shares half as far, which is one gutter. Escape hands
   * it back to the solver, which pulls it home to its own centroid.
   */
  const onChipKey = (event: KeyboardEvent<HTMLButtonElement>, member: number) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      pinRef.current = -1;
      requestRender();
      return;
    }
    if (!seated[member]) return;
    let dx = 0;
    let dy = 0;
    if (event.key === 'ArrowLeft') dx = -NUDGE;
    else if (event.key === 'ArrowRight') dx = NUDGE;
    else if (event.key === 'ArrowUp') dy = -NUDGE;
    else if (event.key === 'ArrowDown') dy = NUDGE;
    else return;
    event.preventDefault();
    nudgeRef.current = { member, dx, dy };
    requestRender();
  };

  const names = ROSTER.filter((_, index) => seated[index]).map((member) => member.first);

  return (
    <div className="lloyd-avatars-stage" data-compact={compact ? 'true' : undefined}>
      <div className="lloyd-avatars-card">
        <div className="lloyd-avatars-head">
          <p className="lloyd-avatars-label">Reviewers</p>
          <div
            className="lloyd-avatars-seats"
            role="meter"
            aria-label="Review seats filled"
            aria-valuemin={0}
            aria-valuemax={ROSTER.length}
            aria-valuenow={names.length}
            aria-valuetext={`${names.length} of ${ROSTER.length} seats filled`}
          >
            <span className="lloyd-avatars-pips" aria-hidden="true">
              {ROSTER.map((member, index) => (
                <span
                  key={member.first}
                  className={
                    seated[index] ? 'lloyd-avatars-pip lloyd-avatars-pip-on' : 'lloyd-avatars-pip'
                  }
                />
              ))}
            </span>
            <span className="lloyd-avatars-tally">
              {names.length}/{ROSTER.length}
            </span>
          </div>
        </div>

        <div ref={stageRef} className="lloyd-avatars-frame" aria-hidden="true">
          <canvas ref={canvasRef} />
        </div>

        {names.length === 0 ? (
          <p className="lloyd-avatars-names">No reviewers yet — add somebody below.</p>
        ) : (
          <p className="lloyd-avatars-names">
            <strong>{names.length === 1 ? '1 person' : `${names.length} people`}</strong>
            {` · ${summarise(names)}`}
          </p>
        )}

        {/* A sibling of the tracked element, never a child: the canvas host takes pointer
            capture on press and would swallow these clicks and their keys. */}
        <div className="lloyd-avatars-roster" role="group" aria-label="People on this review">
          {ROSTER.map((member, index) => (
            <button
              key={member.first}
              type="button"
              className="lloyd-avatars-chip"
              aria-pressed={seated[index]}
              aria-label={`${member.first} ${member.last}`}
              /* Still pressable in a card, but out of the tab order: the card frame is
                 aria-hidden, and a focusable node inside one is a trap with no label. */
              tabIndex={compact ? -1 : undefined}
              onClick={() => toggle(index)}
              onKeyDown={(event) => onChipKey(event, index)}
              onPointerEnter={() => light(index)}
              onPointerLeave={dim}
              onFocus={() => light(index)}
              onBlur={letGo}
            >
              {member.first}
            </button>
          ))}
        </div>
      </div>

      <p className="lloyd-avatars-hint">Drag a face · arrows nudge · esc lets go</p>
    </div>
  );
}

export default LloydAvatars;
