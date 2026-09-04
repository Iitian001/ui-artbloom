'use client';

import './chip-pile.css';

import { useEffect, useState } from 'react';

import {
  useCanvasScene,
  useReducedMotion,
  type SceneDrawContext,
  type SceneSetupContext,
} from '@/hooks/use-canvas-scene';

/**
 * A tag list that is a pile of things.
 *
 * The chips are rigid bodies — mass, moment of inertia, contacts, friction — solved
 * by sequential impulses, the method a 2D physics engine uses. Nothing is scripted:
 * where a chip ends up is where the stack it landed on happened to be, and a chip
 * lying across two others bridges them because that is what the contact set says.
 *
 * They are capsules rather than boxes, which is the one decision the rest follows
 * from. A rounded rectangle *is* a capsule when its corner radius is half its height,
 * so the collision shape and the drawn shape are the same shape — no skin, no
 * approximation, and the corner a box would catch on does not exist. The cost is that
 * two capsules touch at a single point, and a single point cannot hold a chip level:
 * a stack built on one contact per pair rocks forever, because there is no torque to
 * resist rotation about it. So the near-parallel case is detected and clipped, and
 * emits *two* contacts spanning the overlap — the same reference-face clipping a box
 * solver does, for the same reason.
 *
 * The label widths come from `measureText`, so each chip is exactly as wide as its
 * own word at the reader's font size, and the pile is different at every viewport.
 * The same labels are also a real list, for anything that is not looking at a canvas.
 */

/** Seconds per step. */
const STEP = 1 / 120;
/** Sequential-impulse passes per step. Ten is where a four-high stack stops creeping. */
const ITERATIONS = 10;
/** Gravity, px/s². */
const G = 2000;
/** Restitution. Plastic chips on a desk: almost none. */
const REST = 0.05;
/** Approach speed below which restitution is dropped, so a resting chip cannot buzz. */
const REST_CUT = 70;
/** Coulomb friction. Above about 0.5 a pile holds its own slope instead of spreading. */
const MU = 0.55;
/** Baumgarte factor: the fraction of the remaining overlap pushed out per step. */
const BIAS = 0.2;
/** Overlap left alone, in pixels. Solving to zero is what makes contacts chatter. */
const SLOP = 0.5;
/** Velocity lost per second to the air and to the desk. */
const LINEAR_DAMP = 0.35;
const ANGULAR_DAMP = 0.9;
/** Mass per square pixel. Only ratios matter, but keeping masses near 1 keeps the
 *  impulses in a range where single-precision noise never shows. */
const DENSITY = 0.0012;
/** Half the height of a chip, and therefore the capsule's radius. */
const RADIUS = 13;
/** Space between the end of the word and the end of the chip. */
const PAD = 13;
/** Where the walls and the desk sit, inset from the canvas edges. */
const WALL = 14;
const DESK = 26;
/** |sin θ| below which two capsules are treated as parallel and their contact clipped. */
const PARALLEL = 0.08;
/** How near a chip a press has to land to take hold of it. */
const GRAB_R = 30;
/** Stiffness of the hand, as a velocity gain per second. */
const GRAB_K = 20;
/** Fastest the hand may drag a chip, px/s. A clamp is what keeps it from tunnelling. */
const GRAB_MAX = 2400;
/** Steps run in `setup` when motion is reduced, so the still is a settled pile. */
const WARM = 420;

const LABELS = [
  'TypeScript',
  'React',
  'Postgres',
  'Rust',
  'WebGL',
  'CI/CD',
  'Figma',
  'Redis',
  'Docker',
  'GraphQL',
  'Swift',
  'Terraform',
  'Kafka',
  'Go',
];

const FONT = '500 12.5px ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif';

interface Chip {
  readonly label: string;
  readonly tone: number;
  /** Half the length of the capsule's spine. The word's own width decides it. */
  readonly half: number;
  readonly invMass: number;
  readonly invInertia: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number;
  spin: number;
}

/**
 * One contact. `b` is −1 for the desk and the walls, which are not bodies: an
 * immovable surface is exactly a body with zero inverse mass, so the solver needs no
 * branch for it beyond skipping the half of the application that would move it.
 */
interface Contact {
  a: number;
  b: number;
  nx: number;
  ny: number;
  /** Arms from each centre of mass to the contact point. */
  rax: number;
  ray: number;
  rbx: number;
  rby: number;
  /** Velocity the normal is solved toward: the overlap push plus any bounce. */
  target: number;
  /** Effective mass along the normal and along the tangent, once per step. */
  kn: number;
  kt: number;
  /** Impulse accumulated across the passes. The friction cone is clamped against it. */
  pn: number;
  pt: number;
}

interface PileState {
  readonly chips: Chip[];
  readonly contacts: Contact[];
  used: number;
  left: number;
  right: number;
  floor: number;
  /** Index of the chip in hand, or −1. */
  held: number;
  /** Where on that chip the hand took hold, in the chip's own frame. */
  grabX: number;
  grabY: number;
  /** The toss the pile was last built for. Compared against the component's counter. */
  toss: number;
  carry: number;
  clock: number;
  /** Stop integrating. Set under `prefers-reduced-motion`. */
  snap: boolean;
}

/** Closest points between two segments, as parameters along each. */
const pair = new Float64Array(2);

/**
 * The classic segment-segment routine: minimise the squared distance over the two
 * parameters, clamp, and re-solve the other one against the clamped edge. Exact for
 * every configuration except two parallel segments, where the minimum is a whole
 * interval rather than a point — which is precisely the case handled separately.
 */
function closest(
  px: number,
  py: number,
  dx: number,
  dy: number,
  qx: number,
  qy: number,
  ex: number,
  ey: number,
) {
  const a = dx * dx + dy * dy;
  const e = ex * ex + ey * ey;
  const rx = px - qx;
  const ry = py - qy;
  const f = ex * rx + ey * ry;
  const c = dx * rx + dy * ry;
  const b = dx * ex + dy * ey;
  const denom = a * e - b * b;

  let s = denom > 1e-9 ? Math.max(0, Math.min(1, (b * f - c * e) / denom)) : 0;
  let t = (b * s + f) / e;
  if (t < 0) {
    t = 0;
    s = Math.max(0, Math.min(1, -c / a));
  } else if (t > 1) {
    t = 1;
    s = Math.max(0, Math.min(1, (b - c) / a));
  }
  pair[0] = s;
  pair[1] = t;
}

/**
 * Record one contact and precompute everything the passes will need from it: the
 * arms, the effective mass along the normal and the tangent, and the velocity the
 * normal is to be solved toward. All of it is fixed for the step, so the ten passes
 * that follow are pure arithmetic on the velocities.
 */
function add(
  state: PileState,
  ai: number,
  bi: number,
  cx: number,
  cy: number,
  nx: number,
  ny: number,
  depth: number,
) {
  if (state.used >= state.contacts.length) return;
  const contact = state.contacts[state.used];
  const A = state.chips[ai];
  const B = bi >= 0 ? state.chips[bi] : null;

  const rax = cx - A.x;
  const ray = cy - A.y;
  const rbx = B ? cx - B.x : 0;
  const rby = B ? cy - B.y : 0;

  const invB = B ? B.invMass : 0;
  const invIB = B ? B.invInertia : 0;

  const crossAN = rax * ny - ray * nx;
  const crossBN = rbx * ny - rby * nx;
  const crossAT = rax * nx + ray * ny;
  const crossBT = rbx * nx + rby * ny;

  const vax = A.vx - A.spin * ray;
  const vay = A.vy + A.spin * rax;
  const vbx = B ? B.vx - B.spin * rby : 0;
  const vby = B ? B.vy + B.spin * rbx : 0;
  const approach = (vbx - vax) * nx + (vby - vay) * ny;

  contact.a = ai;
  contact.b = bi;
  contact.nx = nx;
  contact.ny = ny;
  contact.rax = rax;
  contact.ray = ray;
  contact.rbx = rbx;
  contact.rby = rby;
  // The overlap is pushed out over several steps rather than in one, and the last
  // half pixel is left alone — a contact solved to exactly zero re-separates, loses
  // its contact next step, falls back in, and buzzes.
  contact.target =
    (BIAS / STEP) * Math.max(0, depth - SLOP) +
    (approach < -REST_CUT ? -REST * approach : 0);
  contact.kn =
    A.invMass + invB + A.invInertia * crossAN * crossAN + invIB * crossBN * crossBN;
  contact.kt =
    A.invMass + invB + A.invInertia * crossAT * crossAT + invIB * crossBT * crossBT;
  contact.pn = 0;
  contact.pt = 0;
  state.used += 1;
}

/** Two spine points that are near enough to touch, as a contact. */
function emit(
  state: PileState,
  ai: number,
  bi: number,
  ax: number,
  ay: number,
  bx: number,
  by: number,
) {
  let nx = bx - ax;
  let ny = by - ay;
  let distance = Math.hypot(nx, ny);
  if (distance >= RADIUS * 2) return;
  if (distance > 1e-6) {
    nx /= distance;
    ny /= distance;
  } else {
    // Spines exactly coincident. Any normal will separate them; down is as good as
    // any, and the next step will have a real one.
    nx = 0;
    ny = 1;
    distance = 0;
  }
  // Midway between the two spines is midway between the two surfaces, because both
  // capsules have the same radius.
  add(
    state,
    ai,
    bi,
    ax + nx * distance * 0.5,
    ay + ny * distance * 0.5,
    nx,
    ny,
    RADIUS * 2 - distance,
  );
}

/**
 * Contacts between two chips.
 *
 * The parallel branch is the whole reason a stack here is stable. Two capsules lying
 * across each other meet at one point, and one point exerts no torque about itself —
 * so a chip resting on another would be free to rotate about the touch and would rock
 * until damping killed it, which reads as a pile of wobbling jelly. When the spines
 * are within about five degrees of parallel their overlap is an interval rather than a
 * point, so it is clipped to that interval and a contact is emitted at each end.
 * Between them they *do* resist rotation, and the chip lies still.
 */
function collide(state: PileState, ai: number, bi: number) {
  const A = state.chips[ai];
  const B = state.chips[bi];

  const reach = A.half + B.half + RADIUS * 2;
  const gapX = B.x - A.x;
  const gapY = B.y - A.y;
  if (gapX * gapX + gapY * gapY > reach * reach) return;

  const ca = Math.cos(A.angle);
  const sa = Math.sin(A.angle);
  const cb = Math.cos(B.angle);
  const sb = Math.sin(B.angle);
  const px = A.x - ca * A.half;
  const py = A.y - sa * A.half;
  const dx = ca * A.half * 2;
  const dy = sa * A.half * 2;
  const qx = B.x - cb * B.half;
  const qy = B.y - sb * B.half;
  const ex = cb * B.half * 2;
  const ey = sb * B.half * 2;

  const lenA = A.half * 2;
  const lenB = B.half * 2;
  if (Math.abs(dx * ey - dy * ex) < PARALLEL * lenA * lenB) {
    const along = lenA * lenA;
    let from = ((qx - px) * dx + (qy - py) * dy) / along;
    let to = ((qx + ex - px) * dx + (qy + ey - py) * dy) / along;
    if (from > to) {
      const swap = from;
      from = to;
      to = swap;
    }
    const lo = Math.max(0, from);
    const hi = Math.min(1, to);
    // Only worth two contacts if the shared length is more than a chip is thick.
    if ((hi - lo) * lenA > RADIUS) {
      span(state, ai, bi, px, py, dx, dy, qx, qy, ex, ey, lo);
      span(state, ai, bi, px, py, dx, dy, qx, qy, ex, ey, hi);
      return;
    }
  }

  closest(px, py, dx, dy, qx, qy, ex, ey);
  emit(
    state,
    ai,
    bi,
    px + dx * pair[0],
    py + dy * pair[0],
    qx + ex * pair[1],
    qy + ey * pair[1],
  );
}

/** One end of a clipped parallel overlap: a point on A, and the nearest point on B. */
function span(
  state: PileState,
  ai: number,
  bi: number,
  px: number,
  py: number,
  dx: number,
  dy: number,
  qx: number,
  qy: number,
  ex: number,
  ey: number,
  at: number,
) {
  const ax = px + dx * at;
  const ay = py + dy * at;
  const along = ex * ex + ey * ey;
  const t = Math.max(0, Math.min(1, ((ax - qx) * ex + (ay - qy) * ey) / along));
  emit(state, ai, bi, ax, ay, qx + ex * t, qy + ey * t);
}

/**
 * Contacts against the desk and the two walls. Both ends of the spine are tested and
 * both are allowed to report, which is what stops a chip lying flat on the desk from
 * pivoting about its middle — the same two-contact requirement as the parallel case,
 * arrived at from the same direction.
 */
function surfaces(state: PileState, index: number) {
  const chip = state.chips[index];
  const cos = Math.cos(chip.angle) * chip.half;
  const sin = Math.sin(chip.angle) * chip.half;

  for (let end = -1; end <= 1; end += 2) {
    const x = chip.x + cos * end;
    const y = chip.y + sin * end;

    const under = RADIUS - (state.floor - y);
    if (under > 0) add(state, index, -1, x, state.floor, 0, 1, under);

    const past = RADIUS - (x - state.left);
    if (past > 0) add(state, index, -1, state.left, y, -1, 0, past);

    const over = RADIUS - (state.right - x);
    if (over > 0) add(state, index, -1, state.right, y, 1, 0, over);
  }
}

/** An impulse at an arm, as the linear and angular change it is. */
function push(chip: Chip, rx: number, ry: number, ix: number, iy: number, sign: number) {
  chip.vx += ix * chip.invMass * sign;
  chip.vy += iy * chip.invMass * sign;
  chip.spin += (rx * iy - ry * ix) * chip.invInertia * sign;
}

/**
 * One pass over one contact: the normal, then friction inside the cone the normal has
 * earned. The accumulated impulse is what is clamped, not the increment — a contact
 * that has already been pushed hard is allowed to pull back this pass, which is how
 * ten cheap passes converge on the answer a matrix solve would give.
 */
function resolve(state: PileState, contact: Contact) {
  const A = state.chips[contact.a];
  const B = contact.b >= 0 ? state.chips[contact.b] : null;
  const { nx, ny, rax, ray, rbx, rby } = contact;

  if (contact.kn > 1e-12) {
    const vax = A.vx - A.spin * ray;
    const vay = A.vy + A.spin * rax;
    const vbx = B ? B.vx - B.spin * rby : 0;
    const vby = B ? B.vy + B.spin * rbx : 0;
    const vn = (vbx - vax) * nx + (vby - vay) * ny;

    const want = Math.max(0, contact.pn + (contact.target - vn) / contact.kn);
    const change = want - contact.pn;
    contact.pn = want;
    push(A, rax, ray, nx * change, ny * change, -1);
    if (B) push(B, rbx, rby, nx * change, ny * change, 1);
  }

  if (contact.kt > 1e-12) {
    const tx = -ny;
    const ty = nx;
    const vax = A.vx - A.spin * ray;
    const vay = A.vy + A.spin * rax;
    const vbx = B ? B.vx - B.spin * rby : 0;
    const vby = B ? B.vy + B.spin * rbx : 0;
    const vt = (vbx - vax) * tx + (vby - vay) * ty;

    // Coulomb, against the live normal impulse. A chip on a slope holds until the
    // tangential demand exceeds μ times what is holding it up, and then slides —
    // which is one rule producing both behaviours instead of a rule for each.
    const cone = MU * contact.pn;
    const want = Math.max(-cone, Math.min(cone, contact.pt - vt / contact.kt));
    const change = want - contact.pt;
    contact.pt = want;
    push(A, rax, ray, tx * change, ty * change, -1);
    if (B) push(B, rbx, rby, tx * change, ty * change, 1);
  }
}

/**
 * The hand, as a velocity constraint on the point that was grabbed.
 *
 * A position assignment would drag a chip straight through the desk and through its
 * neighbours, because nothing downstream can argue with a position. A velocity target
 * is answered by the contact solver on the same pass, so the desk still wins and the
 * pile still resists — the chip has to be dug out.
 */
function hand(state: PileState, handX: number, handY: number) {
  const chip = state.chips[state.held];
  const cos = Math.cos(chip.angle);
  const sin = Math.sin(chip.angle);
  const rx = cos * state.grabX - sin * state.grabY;
  const ry = sin * state.grabX + cos * state.grabY;

  const wantX = Math.max(-GRAB_MAX, Math.min(GRAB_MAX, (handX - (chip.x + rx)) * GRAB_K));
  const wantY = Math.max(-GRAB_MAX, Math.min(GRAB_MAX, (handY - (chip.y + ry)) * GRAB_K));

  const vx = chip.vx - chip.spin * ry;
  const vy = chip.vy + chip.spin * rx;

  // Effective mass of the grabbed point along each axis, which is what turns the
  // velocity error into an impulse: a chip held by its end swings, one held at its
  // centre does not.
  const kx = chip.invMass + chip.invInertia * ry * ry;
  const ky = chip.invMass + chip.invInertia * rx * rx;
  push(chip, rx, ry, (wantX - vx) / kx, (wantY - vy) / ky, 1);
}

function advance(state: PileState, handX: number, handY: number) {
  const chips = state.chips;

  for (const chip of chips) {
    chip.vy += G * STEP;
    chip.vx -= chip.vx * LINEAR_DAMP * STEP;
    chip.vy -= chip.vy * LINEAR_DAMP * STEP;
    chip.spin -= chip.spin * ANGULAR_DAMP * STEP;
  }

  state.used = 0;
  for (let i = 0; i < chips.length; i++) {
    surfaces(state, i);
    for (let j = i + 1; j < chips.length; j++) collide(state, i, j);
  }

  for (let pass = 0; pass < ITERATIONS; pass++) {
    if (state.held >= 0) hand(state, handX, handY);
    for (let c = 0; c < state.used; c++) resolve(state, state.contacts[c]);
  }

  for (const chip of chips) {
    chip.x += chip.vx * STEP;
    chip.y += chip.vy * STEP;
    chip.angle += chip.spin * STEP;
  }
}

/** Chips lifted above the stage and dropped, from a seed. */
function scatter(state: PileState, seed: number) {
  let bits = seed >>> 0;
  const random = () => {
    bits = (bits * 1664525 + 1013904223) >>> 0;
    return bits / 4294967296;
  };

  state.chips.forEach((chip, i) => {
    const margin = chip.half + RADIUS + 2;
    const room = Math.max(1, state.right - state.left - margin * 2);
    chip.x = state.left + margin + random() * room;
    // Stacked up out of sight and released together. They arrive in order, so the
    // pile is built one chip at a time rather than resolved out of one heap.
    chip.y = -RADIUS - i * 44 - random() * 26;
    chip.vx = (random() - 0.5) * 120;
    chip.vy = 60 + random() * 90;
    chip.angle = (random() - 0.5) * 1.4;
    chip.spin = (random() - 0.5) * 5;
  });

  state.held = -1;
}

const FILL = [
  'rgba(234,239,247,0.95)',
  'rgba(122,206,215,0.93)',
  'rgba(255,196,124,0.93)',
  'rgba(166,155,242,0.92)',
];
const EDGE = [
  'rgba(255,255,255,0.55)',
  'rgba(198,247,252,0.5)',
  'rgba(255,231,190,0.5)',
  'rgba(214,208,255,0.5)',
];
const INK = ['#13161d', '#04222a', '#2b1a05', '#130f38'];

function build({ context, width, height }: SceneSetupContext, reduced: boolean): PileState {
  // The chip is as wide as its word. Measured here rather than guessed at, so the
  // pile is right at whatever size the reader's font resolves to.
  context.font = FONT;
  const chips: Chip[] = LABELS.map((label, i) => {
    const half = context.measureText(label).width / 2 + PAD;
    const mass = (half * 2 * RADIUS * 2 + Math.PI * RADIUS * RADIUS) * DENSITY;
    const length = half * 2;
    // A capsule's moment about its centre: the rod, plus the two caps, which together
    // are a disc of the same radius.
    const inertia = mass * ((length * length) / 12 + (RADIUS * RADIUS) / 2);
    return {
      label,
      tone: i % FILL.length,
      half,
      invMass: 1 / mass,
      invInertia: 1 / inertia,
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      angle: 0,
      spin: 0,
    };
  });

  /*
   * The contact pool, allocated once. Fourteen chips can report six surface contacts
   * each and two per pair, so the ceiling is a shade over two hundred and sixty; the
   * point of the pool is that a physics step never allocates, because a collection
   * pause inside a solver is a visible stutter.
   */
  const contacts: Contact[] = [];
  for (let i = 0; i < 384; i++) {
    contacts.push({
      a: 0,
      b: -1,
      nx: 0,
      ny: 0,
      rax: 0,
      ray: 0,
      rbx: 0,
      rby: 0,
      target: 0,
      kn: 0,
      kt: 0,
      pn: 0,
      pt: 0,
    });
  }

  const state: PileState = {
    chips,
    contacts,
    used: 0,
    left: WALL,
    right: width - WALL,
    floor: height - DESK,
    held: -1,
    grabX: 0,
    grabY: 0,
    toss: 0,
    carry: 0,
    clock: 0,
    snap: reduced,
  };

  scatter(state, 20260904);

  // With motion reduced the loop never runs, so the pile is settled here instead: the
  // still is the real solution three and a half seconds in, not a hand-placed guess.
  if (reduced) for (let i = 0; i < WARM; i++) advance(state, 0, 0);

  return state;
}

function paint({ context, width, height, state, pointer }: SceneDrawContext<PileState>) {
  const now = performance.now();
  const elapsed = state.clock ? Math.min(0.05, (now - state.clock) / 1000) : STEP;
  state.clock = now;

  // The box, from the live size, so a resize moves the walls instead of leaving the
  // pile standing on a desk that is no longer there.
  state.left = WALL;
  state.right = width - WALL;
  state.floor = height - DESK;

  if (!pointer.down) state.held = -1;
  else if (state.held < 0 && pointer.inside) {
    /*
     * Take hold of the nearest chip, by distance to its spine rather than to its
     * centre — a long chip has to be grabbable by its end, and where along it you
     * grabbed is what decides whether it comes up flat or swinging.
     */
    let best = -1;
    let nearest = GRAB_R;
    state.chips.forEach((chip, i) => {
      const cos = Math.cos(chip.angle);
      const sin = Math.sin(chip.angle);
      const along = Math.max(
        -chip.half,
        Math.min(chip.half, (pointer.x - chip.x) * cos + (pointer.y - chip.y) * sin),
      );
      const gap =
        Math.hypot(pointer.x - (chip.x + cos * along), pointer.y - (chip.y + sin * along)) -
        RADIUS;
      if (gap < nearest) {
        nearest = gap;
        best = i;
      }
    });

    if (best >= 0) {
      const chip = state.chips[best];
      const cos = Math.cos(chip.angle);
      const sin = Math.sin(chip.angle);
      const dx = pointer.x - chip.x;
      const dy = pointer.y - chip.y;
      state.held = best;
      state.grabX = dx * cos + dy * sin;
      state.grabY = -dx * sin + dy * cos;
    }
  }

  if (!state.snap) {
    state.carry += elapsed;
    let steps = 0;
    while (state.carry >= STEP && steps < 8) {
      advance(state, pointer.x, pointer.y);
      state.carry -= STEP;
      steps += 1;
    }
    if (state.carry > STEP * 8) state.carry = 0;
  }

  context.clearRect(0, 0, width, height);

  // The desk, as the line the contacts are actually against.
  const shade = context.createLinearGradient(0, state.floor - 22, 0, state.floor);
  shade.addColorStop(0, 'rgba(148,176,214,0)');
  shade.addColorStop(1, 'rgba(148,176,214,0.09)');
  context.fillStyle = shade;
  context.fillRect(0, state.floor - 22, width, 22);
  context.strokeStyle = 'rgba(196,214,238,0.16)';
  context.lineWidth = 1;
  context.beginPath();
  context.moveTo(0, Math.round(state.floor) + 0.5);
  context.lineTo(width, Math.round(state.floor) + 0.5);
  context.stroke();

  context.font = FONT;
  context.textAlign = 'center';
  context.textBaseline = 'middle';

  for (const chip of state.chips) {
    context.save();
    context.translate(chip.x, chip.y);
    context.rotate(chip.angle);

    /*
     * The capsule, drawn as the capsule the solver collides: two caps and two edges.
     * A rounded rectangle whose radius is half its height is the same shape, so there
     * is no gap anywhere between what is seen and what is simulated.
     */
    context.beginPath();
    context.arc(-chip.half, 0, RADIUS, Math.PI * 0.5, Math.PI * 1.5);
    context.lineTo(chip.half, -RADIUS);
    context.arc(chip.half, 0, RADIUS, Math.PI * -0.5, Math.PI * 0.5);
    context.closePath();
    context.fillStyle = FILL[chip.tone];
    context.fill();
    context.strokeStyle = EDGE[chip.tone];
    context.lineWidth = 1;
    context.stroke();

    // Turned with the chip, but never upside down: past a quarter turn the label reads
    // the other way up, which is what a printed word on a physical chip does.
    if (Math.cos(chip.angle) < 0) context.rotate(Math.PI);
    context.fillStyle = INK[chip.tone];
    context.fillText(chip.label, 0, 0);
    context.restore();
  }
}

/** `compact` is the 298x240 catalogue card: the same pile, with the copy layer cut to
 *  one line along the desk margin. Presentation only — see `chip-pile.css`. */
export type ChipPileProps = { compact?: boolean };

/**
 * The desk is the stage and takes every pointer event; the copy is a later sibling
 * that paints over it with `pointer-events: none`, and only the toss button takes its
 * clicks back. The same fourteen labels are also a plain list, visually hidden, so the
 * content of this section does not depend on being able to see a canvas.
 */
export function ChipPile({ compact = false }: ChipPileProps) {
  const reduced = useReducedMotion();
  const [toss, setToss] = useState(0);

  const { stageRef, canvasRef, requestRender } = useCanvasScene<PileState>({
    setup: (scene) => build(scene, reduced),
    draw: (scene) => {
      scene.state.snap = reduced;
      if (scene.state.toss !== toss) {
        scene.state.toss = toss;
        scatter(scene.state, 20260904 + toss * 7919);
        // Nothing will integrate this pile if the loop is stopped, so it is settled
        // here and the button still does something under reduced motion.
        if (reduced) for (let i = 0; i < WARM; i++) advance(scene.state, 0, 0);
      }
      paint(scene);
    },
  });

  useEffect(() => {
    requestRender();
  }, [toss, requestRender]);

  return (
    <div className="chip-pile-stage" data-compact={compact ? 'true' : undefined}>
      <div ref={stageRef} className="chip-pile-desk" aria-hidden="true">
        <canvas ref={canvasRef} />
      </div>

      <div className="chip-pile-face">
        <p className="chip-pile-eyebrow">Stack</p>
        <h2>Fourteen rigid bodies, and the words are the widths.</h2>
        <p className="chip-pile-copy">
          Every chip is as wide as its own label measured in your font, and as heavy as
          it is wide. Pick one up and the rest of the pile answers for it.
        </p>

        {/* Still clickable in a card, but out of the tab order: the card frame is
            aria-hidden, and a focusable node inside one is a trap with no label. */}
        <button
          type="button"
          className="chip-pile-toss"
          tabIndex={compact ? -1 : undefined}
          onClick={() => setToss((n) => n + 1)}
        >
          Toss again
        </button>

        <ul className="chip-pile-list">
          {LABELS.map((label) => (
            <li key={label}>{label}</li>
          ))}
        </ul>
      </div>

      <p className="chip-pile-hint">Drag a chip</p>
    </div>
  );
}

export default ChipPile;
