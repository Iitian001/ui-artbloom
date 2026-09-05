'use client';

import './wetting-reveal.css';

import { useCallback, useEffect, useRef, useState } from 'react';

import { useCanvasScene, useReducedMotion, type SceneDrawContext, type SceneSetupContext } from '@/hooks/use-canvas-scene';

/**
 * A gallery card whose picture is uncovered by liquid spreading over the glass.
 *
 * The mask boundary is a closed ring of markers, each moved along its own outward
 * normal by curvature-driven front propagation — the geometric form of the
 * Gibbs-Thomson condition, and the same normal-velocity law a dendrite tip obeys:
 *
 *   v(s) = W(x, y) * V_DRIVE - GAMMA * kappa(s)
 *   kappa(s) = -( P(s - h) - 2 P(s) + P(s + h) ) . n(s) / h^2
 *
 * with n the outward unit normal, h the marker spacing, and W in [0, 1] the local
 * wettability read analytically off the plate — a handful of smooth patches plus a
 * two-wave grain, never a bitmap. The ring is re-parameterised to even arclength every
 * step, so h in that second difference is a real number rather than an average:
 * markers cannot bunch at a finger tip or tear apart in the fjord behind one, which is
 * the failure that kills marker methods on this equation inside a second.
 *
 * This is NOT Washburn imbibition. There is no porous medium here, no
 * L = sqrt(gamma r t / 2 eta), and no t^(1/2) anywhere in the file; Lucas-Washburn
 * describes liquid drawn along a capillary, and a capillary has no free contact line
 * left to curve. It is also none of the three shortcuts this looks like from outside:
 * a clip-path circle() that scales up, an SVG blob with keyframed path morphing, or a
 * radial-gradient mask with an animated stop. All three stay convex and evenly paced
 * for the whole reveal, and convexity is not a taste decision in them — it is the only
 * shape they can express, because none of them carries a curvature term.
 *
 * The one thing to watch under the hand: the wet edge does not stay round. It fingers
 * along the well-wetting saddles of the plate, hangs up on the low-wettability patches
 * until the rest of the front has walked past them, and the dry pockets it leaves shut
 * with a visible snap instead of fading out. That snap is the whole of the -GAMMA *
 * kappa term: a dry pocket is a concave piece of contact line, kappa is negative
 * there, so the pocket's closing speed is the LARGEST on the ring at the moment the
 * pocket is smallest. Every easing curve does the opposite and slows into its finish.
 *
 * Fronts are never merged analytically. Each ring is filled into an accumulating mask
 * bitmap — source-over for the spreading film, destination-out for a dewetting hole —
 * so two overlapping rings union for free and a hole punched through the film
 * subtracts for free. Contour surgery at a topological change is the classic way to
 * get this wrong; compositing is the honest way to never need it. Within a phase the
 * mask only accumulates, and that is contact-angle hysteresis rather than laziness: a
 * line that has passed over a spot leaves it wetted behind itself.
 *
 * Then the film dewets, because a partially wetting film on cold glass is metastable.
 * The same v = drive - GAMMA * kappa runs with the drive reversed and the wettability
 * entering with the opposite sign, so holes nucleate on exactly the patches that
 * pinned the front on the way in and grow once they clear their own critical radius.
 * One equation, two signs, and the card loops with no keyframe in it.
 */

/**
 * Seconds per solver step. The curvature term is a diffusion along the ring, so an
 * explicit step is stable while STEP < h^2 / (2 * GAMMA): 35 ms at the target spacing, but
 * only 6.5 ms once MIN_MARKERS has squeezed h down to 2.2px on a collapsing ring. 1/240 is
 * set by that worst case rather than by the common one.
 */
const STEP = 1 / 240;
/** Substeps one frame may consume. 8 * STEP is 33 ms, so a tab returning from the
 *  background drops its arrears instead of running a minute of solver in one paint. */
const MAX_SUBSTEPS = 8;
/** Seconds of solver run before the first paint, so the plate opens on a blot already
 *  fingering rather than on a bare frost waiting for the first rAF. */
const WARM = 0.4;

/** Wetting drive V, px/s, over glass that wets perfectly. Crosses the plate in about
 *  four seconds on its own; the patches are what stretch the reveal to eight. */
const V_DRIVE = 88;
/** Line tension GAMMA, px^2/s. GAMMA / V_DRIVE is the critical radius, 4.1px here: a
 *  blot smaller than that closes on itself rather than growing, which is the reason
 *  SEED_R below is 16 and not 4. */
const GAMMA = 360;
/** Normal-speed ceiling, px/s, at 4 * V_DRIVE. A pocket about to close has kappa
 *  running away and a true speed to match; this keeps one step under 1.5px, under a
 *  third of the marker spacing, so the ring cannot jump across itself in one move. */
const V_CEIL = 352;
/** Fraction of the local drive a contact line may run backwards at. Hysteresis: the
 *  receding angle is below the advancing one. On a patch the drive is zero, so this
 *  floor is zero too and a pinned line stops dead instead of reversing under curvature,
 *  which is the one thing no real contact line does. */
const RECEDE = 0.7;
/** Dewetting drive, px/s, at a fully unwettable spot — half again V_DRIVE, because a
 *  film retracts faster than it spread. */
const V_DEWET = 132;
/** How much good wetting holds a hole shut: drive = V_DEWET * (1 - DEWET_HOLD * W).
 *  0.6 rather than 1 because a partially wetting film is metastable everywhere, not
 *  only on the patches, so a hole past its critical radius keeps going instead of
 *  healing the moment it reaches clean glass. */
const DEWET_HOLD = 0.6;

/** Target marker spacing h, px. Fine enough that a 40px finger has eight markers across
 *  it, coarse enough that the stability limit stays eight times the step. */
const SPACING = 5;
/** Floor on the marker count, so curvature always has both neighbours to difference. */
const MIN_MARKERS = 12;
/** Cap on the marker count: 1600px of ring, a plate's perimeter plus the fjords the
 *  patches carve into it. Past this, spacing grows and the solver only gets safer. */
const MAX_MARKERS = 320;
/** Perimeter, px, below which a ring is retired: 2 * pi * 4.1, the circumference at the
 *  critical radius. Below it the ring is collapsing and resampling would drive h under
 *  the stability limit on the way down. */
const DEATH_PERIMETER = 26;
/** How far outside the plate a marker may travel, px. Larger than the biggest critical
 *  radius in the file (6.8px, a hole on clean glass), so a ring parked on this rectangle
 *  rounds its corners outside the visible plate instead of leaving four dry notches. */
const BLEED = 11;

/** Seed radius, px, comfortably over the 4.1px critical radius. */
const SEED_R = 16;
/** Dewetting nucleus radius, px, over the 6.8px critical radius on clean glass. */
const HOLE_R = 11;
/** Live rings allowed at once. Retiring the oldest costs nothing already in the mask —
 *  only that ring's remaining advance — and at seven the plate is nearly wet anyway. */
const MAX_FRONTS = 7;
/** Seconds between drops while the plate is held. */
const HOLD_PERIOD = 0.2;
/** Pointer travel, px, required before a held press lays another drop. Holding still
 *  grows the one drop; dragging lays a chain of them. */
const HOLD_GAP = 15;
/** Area growth, px^2/s, under which a ring counts as doing nothing. A ring parked on the
 *  bleed rectangle still jitters at its corners, so speed is the wrong test and enclosed
 *  area is the right one. */
const AREA_STALL = 14;
/** Consecutive stalled steps before a ring is retired: half a second. */
const STALL_STEPS = 120;
/** Seconds a ring may live regardless. The backstop that guarantees the phase machine
 *  keeps moving, since a ring that never retires would hold the reveal open forever. */
const MAX_AGE = 24;
/** Seconds the wet plate rests before the film starts to dewet. */
const REST_WET = 2.4;
/** Seconds the dry plate rests before the next drop lands. */
const REST_DRY = 0.9;

/** Peak-to-trough swing of W away from the patches. 0.44 gives a not-quite-two-to-one
 *  spread of speeds, which is enough for fingers and short of a front that shreds. */
const GRAIN = 0.44;
/** Grain wave numbers, rad/px. The two wave vectors are 86px and 105px long and
 *  incommensurate, so their product never repeats inside a card and the front has real
 *  saddles to run along instead of a tiling it would trace out twice. */
const GRAIN_A = 0.0631;
const GRAIN_B = 0.0374;
const GRAIN_C = 0.0289;
const GRAIN_D = 0.0523;

/** Downsample factor for the dry plate. An eighth, drawn back up, is a wide box blur for
 *  the price of two blits — and it runs once, in setup, not per frame. */
const FROST_DIV = 8;
/** The meniscus, as stroke widths and alphas, widest first. Three bands rather than one
 *  line because a real contact line is a lens with a soft outer edge, and the widths
 *  halve so the accumulated alpha falls off roughly linearly from the boundary. */
const RIM_BANDS: readonly { readonly width: number; readonly alpha: number }[] = [
  { width: 9, alpha: 0.26 },
  { width: 4.2, alpha: 0.4 },
  { width: 1.6, alpha: 1 },
];
/** The one accent in the file, spent on the contact line and on nothing else. */
const ACCENT = '#78e0cf';

/** A low-wettability patch, in fractions of the plate. Three with an amplitude over 1,
 *  whose cores drive W to exactly zero and pin the front dead; two under 1, which only
 *  slow it, so the plate has both hard stops and slow ground. */
interface Patch {
  readonly u: number;
  readonly v: number;
  readonly ru: number;
  readonly rv: number;
  readonly amp: number;
}

const PATCHES: readonly Patch[] = [
  { u: 0.3, v: 0.3, ru: 0.115, rv: 0.165, amp: 1.3 },
  { u: 0.585, v: 0.545, ru: 0.135, rv: 0.185, amp: 1.2 },
  { u: 0.84, v: 0.26, ru: 0.1, rv: 0.15, amp: 1.1 },
  { u: 0.735, v: 0.855, ru: 0.115, rv: 0.11, amp: 0.92 },
  { u: 0.115, v: 0.6, ru: 0.085, rv: 0.135, amp: 0.85 },
];

/** Where the first drop lands, and where the reset button puts the next one. */
const ORIGIN = { u: 0.2, v: 0.82 };
/** Where the button's drops land, in order. Fixed rather than random, so the card looks
 *  the same on every load and a reviewer can compare two runs. */
const DROPS: readonly { readonly u: number; readonly v: number }[] = [
  { u: 0.78, v: 0.24 },
  { u: 0.5, v: 0.13 },
  { u: 0.88, v: 0.7 },
  { u: 0.13, v: 0.33 },
  { u: 0.46, v: 0.92 },
];

/** The card's own text. A gallery card with no caption is just a picture in a box. */
const ART_TITLE = 'Still Life with Jug and Two Quinces';
const ART_CREDIT = 'Gouache on paper, 1961. Kestner Collection, plate 41.';
/** The live region's opening line, and what each control says once it has acted. The
 *  plate is aria-hidden, so this text is the only account of it a screen reader gets. */
const HINT = 'Press and hold the glass to wet it from where you press.';
const AFTER_DROP =
  'A drop lands. The wet edge fingers where the glass wets well, and hangs up where it does not.';
const AFTER_RESET = 'The glass is dry. One drop, low on the left, spreading again.';
const REDUCED =
  'Reduced motion: the glass is painted at the state the spreading settles on, beads and all.';

/** A patch in plate pixels, with the radii pre-inverted: `wettability` runs once per
 *  marker per step, five spots deep, so the divisions come out of the inner loop. */
interface Spot {
  readonly x: number;
  readonly y: number;
  readonly ix: number;
  readonly iy: number;
  readonly amp: number;
}

/** One closed contact line. `xs`/`ys` are allocated once at MAX_MARKERS and `n` says how
 *  much of them is live, so re-parameterisation changes a count and never allocates. */
interface Front {
  readonly xs: Float64Array;
  readonly ys: Float64Array;
  /** A dewetting hole rather than a spreading blot: same law, drive reversed. */
  readonly dry: boolean;
  n: number;
  area: number;
  still: number;
  age: number;
}

/** The four offscreen plates. `art` is the picture, `frost` the picture behind dry glass,
 *  `mask` the wetted region as it accumulates, and `scratch` is borrowed twice a frame. */
interface Layers {
  readonly art: CanvasRenderingContext2D;
  readonly frost: CanvasRenderingContext2D;
  readonly mask: CanvasRenderingContext2D;
  readonly scratch: CanvasRenderingContext2D;
}

type Mode = 'wet' | 'dry';

interface State {
  readonly width: number;
  readonly height: number;
  readonly spots: readonly Spot[];
  readonly fronts: Front[];
  /** Null only if a browser refuses a 2D context for an offscreen plate. */
  readonly layers: Layers | null;
  mode: Mode;
  /** Seconds since the last front retired, which is what times the two rests. */
  idle: number;
  /** Unspent seconds, so the solver runs at STEP and not at the display's refresh rate. */
  carry: number;
  /** `performance.now()` at the last painted frame, in seconds. */
  last: number;
  /** Seconds since the held pointer last laid a drop, and where it laid it. */
  hold: number;
  holdX: number;
  holdY: number;
  /** Whether the pointer was down last frame, so a press lays one drop and not sixty. */
  wasDown: boolean;
  /** Next entry in DROPS the button will reach for. */
  next: number;
  /** Set when a phase restarts; cleared by the frame that empties the mask. */
  wipe: boolean;
}

/** What the buttons ask of the scene. A ref and not state: `draw` is re-created on every
 *  render but the scene keeps the one it was given, so a counter read here is current
 *  while a captured value would be a frame or more stale. */
interface Asks {
  drops: number;
  resets: number;
}

/*
 * Working buffers, at module scope. Rings are stepped and re-parameterised one at a time
 * on one thread, so a single set serves all of them and a solver step allocates nothing.
 */
const bufVel = new Float64Array(MAX_MARKERS);
const bufNx = new Float64Array(MAX_MARKERS);
const bufNy = new Float64Array(MAX_MARKERS);
const bufX = new Float64Array(MAX_MARKERS);
const bufY = new Float64Array(MAX_MARKERS);
/** Cumulative arclength, so it needs the closing length as well: MAX_MARKERS + 1. */
const bufArc = new Float64Array(MAX_MARKERS + 1);

/**
 * Local wettability W in [0, 1]: 1 on clean glass, 0 where the contact line pins dead.
 *
 * Each patch contributes amp * (1 - d^2)^2 inside its own ellipse, which is C1 at the
 * rim — a hard-edged patch would put a step in the drive and the front would corner on
 * it instead of curving around. On top of that a two-cosine grain, whose product gives
 * saddles rather than a grid of bumps, so a finger has somewhere to run.
 */
function wettability(state: State, x: number, y: number): number {
  let block = 0;
  for (const spot of state.spots) {
    const u = (x - spot.x) * spot.ix;
    const v = (y - spot.y) * spot.iy;
    const d2 = u * u + v * v;
    if (d2 >= 1) continue;
    const f = 1 - d2;
    block += spot.amp * f * f;
  }
  const g = Math.cos(x * GRAIN_A + y * GRAIN_B) * Math.cos(x * GRAIN_C - y * GRAIN_D);
  const w = 1 - block - GRAIN * (0.5 - 0.5 * g);
  return w > 0 ? (w < 1 ? w : 1) : 0;
}

/**
 * A closed path through points, each one met by the quadratic between the midpoints on
 * either side of it. Nine profile samples become a curve with no facets, and — this is
 * why the jug is built this way rather than from beziers — a mirrored sample list is
 * symmetric by construction, so the shoulder is one number to tune and not four handles.
 * Wants three points or more, which the one profile in this file has six times over.
 */
function smooth(context: CanvasRenderingContext2D, px: readonly number[], py: readonly number[]) {
  const n = px.length;
  context.beginPath();
  context.moveTo((px[n - 1] + px[0]) / 2, (py[n - 1] + py[0]) / 2);
  for (let i = 0; i < n; i += 1) {
    const j = i + 1 === n ? 0 : i + 1;
    context.quadraticCurveTo(px[i], py[i], (px[i] + px[j]) / 2, (py[i] + py[j]) / 2);
  }
  context.closePath();
}

/**
 * A cast shadow: an ellipse of ground darker than the ground, laid down before the form
 * that casts it so the form's own edge stays clean over the top of it.
 */
function shade(context: CanvasRenderingContext2D, cx: number, cy: number, rx: number, ry: number) {
  context.save();
  context.translate(cx, cy);
  context.scale(1, ry / rx);
  const dark = context.createRadialGradient(0, 0, 0, 0, 0, rx);
  dark.addColorStop(0, 'rgba(4, 7, 9, 0.62)');
  dark.addColorStop(0.55, 'rgba(4, 7, 9, 0.28)');
  dark.addColorStop(1, 'rgba(4, 7, 9, 0)');
  context.beginPath();
  context.arc(0, 0, rx, 0, Math.PI * 2);
  context.fillStyle = dark;
  context.fill();
  context.restore();
}

/** The jug's silhouette: half-width against height, both as fractions of its height, foot
 *  first. Nine samples is the fewest that keeps a foot, a belly, a waist and a lip once
 *  the midpoint smoothing has rounded the corners off them. */
const JUG: readonly { readonly t: number; readonly w: number }[] = [
  { t: 0, w: 0.28 },
  { t: 0.05, w: 0.33 },
  { t: 0.2, w: 0.44 },
  { t: 0.38, w: 0.5 },
  { t: 0.56, w: 0.46 },
  { t: 0.7, w: 0.34 },
  { t: 0.83, w: 0.25 },
  { t: 0.93, w: 0.23 },
  { t: 1, w: 0.27 },
];

/**
 * One quince: a body squashed to 0.88 of its width and lit from the upper left by a
 * radial gradient offset toward the light, plus a stalk. No outline anywhere — the form
 * turns away into the ground, and the gradient's outer stop is that turn.
 */
function fruit(context: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
  context.save();
  context.translate(cx, cy);
  context.scale(1, 0.88);
  const lit = context.createRadialGradient(-r * 0.34, -r * 0.4, r * 0.05, 0, 0, r * 1.15);
  lit.addColorStop(0, 'rgba(231, 237, 239, 0.52)');
  lit.addColorStop(0.42, 'rgba(231, 237, 239, 0.21)');
  lit.addColorStop(1, 'rgba(231, 237, 239, 0.045)');
  context.beginPath();
  context.arc(0, 0, r, 0, Math.PI * 2);
  context.fillStyle = lit;
  context.fill();
  context.restore();
  context.beginPath();
  context.moveTo(cx + r * 0.06, cy - r * 0.78);
  context.quadraticCurveTo(cx + r * 0.24, cy - r * 1, cx + r * 0.19, cy - r * 1.16);
  context.lineWidth = Math.max(1, r * 0.075);
  context.lineCap = 'round';
  context.strokeStyle = 'rgba(231, 237, 239, 0.3)';
  context.stroke();
}

/**
 * The picture under the glass, drawn and not loaded: a wall, a table, a ceramic jug and
 * two quinces, all in the one bone tone at a dozen alphas over a cold ground. The jug is
 * opaque earthenware on purpose — a glass decanter with a level standing in it would read
 * as a gauge of something, and there is nothing in this file for a gauge to report.
 */
function paintArt(context: CanvasRenderingContext2D, width: number, height: number) {
  const wall = context.createLinearGradient(0, 0, 0, height);
  wall.addColorStop(0, '#151c20');
  wall.addColorStop(0.62, '#0e1417');
  wall.addColorStop(1, '#0a0f12');
  context.fillStyle = wall;
  context.fillRect(0, 0, width, height);

  // The light: a pool on the wall, up and to the left. It is the whole reason the round
  // forms below read as lit from a direction rather than as flat discs.
  const lx = width * 0.32;
  const ly = height * 0.15;
  const pool = context.createRadialGradient(lx, ly, 4, lx, ly, height * 1.1);
  pool.addColorStop(0, 'rgba(231, 237, 239, 0.135)');
  pool.addColorStop(0.5, 'rgba(231, 237, 239, 0.04)');
  pool.addColorStop(1, 'rgba(231, 237, 239, 0)');
  context.fillStyle = pool;
  context.fillRect(0, 0, width, height);

  const tableY = height * 0.7;
  const table = context.createLinearGradient(0, tableY, 0, height);
  table.addColorStop(0, 'rgba(231, 237, 239, 0.115)');
  table.addColorStop(0.2, 'rgba(231, 237, 239, 0.05)');
  table.addColorStop(1, 'rgba(231, 237, 239, 0.012)');
  context.fillStyle = table;
  context.fillRect(0, tableY, width, height - tableY);
  // The near edge of the table takes the light along its whole length.
  context.fillStyle = 'rgba(231, 237, 239, 0.16)';
  context.fillRect(0, tableY, width, Math.max(1, height * 0.005));

  const base = tableY + height * 0.1;
  const jh = height * 0.5;
  const jx = width * 0.36;
  shade(context, jx + jh * 0.18, base - height * 0.004, jh * 0.74, jh * 0.13);

  const px: number[] = [];
  const py: number[] = [];
  for (const sample of JUG) {
    px.push(jx + sample.w * jh);
    py.push(base - sample.t * jh);
  }
  for (let i = JUG.length - 1; i >= 0; i -= 1) {
    px.push(jx - JUG[i].w * jh);
    py.push(base - JUG[i].t * jh);
  }
  const cxl = jx - jh * 0.24;
  const cyl = base - jh * 0.62;
  const clay = context.createRadialGradient(cxl, cyl, jh * 0.05, jx, base - jh * 0.45, jh);
  clay.addColorStop(0, 'rgba(231, 237, 239, 0.46)');
  clay.addColorStop(0.4, 'rgba(231, 237, 239, 0.2)');
  clay.addColorStop(0.78, 'rgba(231, 237, 239, 0.075)');
  clay.addColorStop(1, 'rgba(231, 237, 239, 0.03)');
  smooth(context, px, py);
  context.fillStyle = clay;
  context.fill();

  // The handle, hung on the shadow side as one stroked arc from shoulder to belly.
  context.beginPath();
  context.moveTo(jx + jh * 0.24, base - jh * 0.8);
  context.bezierCurveTo(
    jx + jh * 0.62,
    base - jh * 0.82,
    jx + jh * 0.64,
    base - jh * 0.46,
    jx + jh * 0.4,
    base - jh * 0.43,
  );
  context.lineWidth = Math.max(1.5, jh * 0.055);
  context.lineCap = 'round';
  context.strokeStyle = 'rgba(231, 237, 239, 0.19)';
  context.stroke();

  // The lip: a dark ellipse for the opening, then a bright arc across the far side of it,
  // the one place in the picture where the light lands on an edge and not on a surface.
  const lipY = base - jh;
  const lipR = jh * 0.27;
  context.beginPath();
  context.ellipse(jx, lipY, lipR, lipR * 0.3, 0, 0, Math.PI * 2);
  context.fillStyle = 'rgba(10, 14, 17, 0.72)';
  context.fill();
  context.beginPath();
  context.ellipse(jx, lipY, lipR, lipR * 0.3, 0, Math.PI * 1.04, Math.PI * 1.96);
  context.lineWidth = Math.max(1, jh * 0.022);
  context.strokeStyle = 'rgba(231, 237, 239, 0.5)';
  context.stroke();

  // Back quince first, so the front one overlaps it rather than the other way about.
  const qbx = width * 0.775;
  const qby = tableY + height * 0.035;
  const qbr = height * 0.088;
  shade(context, qbx + qbr * 0.34, qby + qbr * 0.78, qbr * 1.5, qbr * 0.34);
  fruit(context, qbx, qby, qbr);

  const qfx = width * 0.625;
  const qfy = tableY + height * 0.08;
  const qfr = height * 0.115;
  shade(context, qfx + qfr * 0.34, qfy + qfr * 0.8, qfr * 1.6, qfr * 0.36);
  fruit(context, qfx, qfy, qfr);

  // A vignette, so the plate has corners to it. Last, over everything.
  const ex = width * 0.5;
  const ey = height * 0.48;
  const edge = context.createRadialGradient(ex, ey, height * 0.3, ex, ey, height * 1.05);
  edge.addColorStop(0, 'rgba(5, 8, 10, 0)');
  edge.addColorStop(1, 'rgba(5, 8, 10, 0.6)');
  context.fillStyle = edge;
  context.fillRect(0, 0, width, height);
}

/** Specks of sandblasting on the dry plate. 140 over a 3:2 card is about one every
 *  560px^2 — enough tooth to read as ground glass, sparse enough not to become a texture
 *  in its own right and compete with the picture. */
const FROST_DOTS = 140;

/**
 * The dry plate: the picture at an eighth scale drawn back up, then a cold film and its
 * specks. Sandblasted glass scatters what is behind it, and wetting the roughness
 * index-matches it so the picture comes into focus — that optical fact is why this reveal
 * reads as liquid instead of as a hole cut in a stencil. Two blits, once, in setup.
 *
 * `scratch` holds the small copy in the meantime. A fifth offscreen plate for a step that
 * happens before the first frame would be a plate idling for the rest of the session.
 */
function paintFrost(layers: Layers, width: number, height: number, dpr: number) {
  const small = layers.scratch;
  const sw = Math.max(1, Math.round(width / FROST_DIV));
  const sh = Math.max(1, Math.round(height / FROST_DIV));
  small.setTransform(dpr, 0, 0, dpr, 0, 0);
  small.globalCompositeOperation = 'source-over';
  small.clearRect(0, 0, width, height);
  small.imageSmoothingQuality = 'high';
  small.drawImage(layers.art.canvas, 0, 0, sw, sh);

  const frost = layers.frost;
  frost.setTransform(dpr, 0, 0, dpr, 0, 0);
  frost.globalCompositeOperation = 'source-over';
  frost.clearRect(0, 0, width, height);
  frost.imageSmoothingQuality = 'high';
  // Source rect in the scratch bitmap's own device pixels; destination in plate pixels.
  frost.drawImage(
    small.canvas,
    0,
    0,
    Math.max(1, Math.round(sw * dpr)),
    Math.max(1, Math.round(sh * dpr)),
    0,
    0,
    width,
    height,
  );

  // The film: the same bone as everything else, a shade heavier down the plate where the
  // dust settles on one. A second hue here would be a third colour in the card for nothing
  // — scattering lifts the blacks, it does not tint them.
  const veil = frost.createLinearGradient(0, 0, 0, height);
  veil.addColorStop(0, 'rgba(231, 237, 239, 0.13)');
  veil.addColorStop(1, 'rgba(231, 237, 239, 0.185)');
  frost.fillStyle = veil;
  frost.fillRect(0, 0, width, height);

  // The specks, on a golden-angle spiral: deterministic, so the plate is the same on
  // every load, and neither a PRNG nor a noise bitmap has to exist to place them.
  const span = Math.hypot(width, height) * 0.5;
  frost.fillStyle = 'rgba(231, 237, 239, 0.05)';
  for (let i = 0; i < FROST_DOTS; i += 1) {
    const a = i * 2.399963;
    const r = Math.sqrt((i + 0.5) / FROST_DOTS) * span;
    const x = width * 0.5 + Math.cos(a) * r;
    const y = height * 0.5 + Math.sin(a) * r;
    frost.beginPath();
    frost.arc(x, y, 2 + (i % 5), 0, Math.PI * 2);
    frost.fill();
  }

  small.clearRect(0, 0, width, height);
}

/**
 * The four offscreen plates, each DPR-scaled so every coordinate above and below is a
 * plate pixel. Returns null rather than throwing if a context is refused — the caller has
 * a real answer for that case, and it is not an exception.
 */
function buildLayers(width: number, height: number, dpr: number): Layers | null {
  const make = (): CanvasRenderingContext2D | null => {
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(width * dpr));
    canvas.height = Math.max(1, Math.round(height * dpr));
    const context = canvas.getContext('2d');
    if (!context) return null;
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    return context;
  };
  const art = make();
  const frost = make();
  const mask = make();
  const scratch = make();
  if (!art || !frost || !mask || !scratch) return null;
  return { art, frost, mask, scratch };
}

/**
 * A fresh contact line: markers on a circle at increasing theta, which is what makes
 * (ty, -tx) the OUTWARD normal for every ring in the file. Get that winding wrong on one
 * ring and it grows inward while its neighbours grow outward.
 */
function ring(x: number, y: number, r: number, dry: boolean): Front {
  let n = Math.round((2 * Math.PI * r) / SPACING);
  if (n < MIN_MARKERS) n = MIN_MARKERS;
  else if (n > MAX_MARKERS) n = MAX_MARKERS;
  const xs = new Float64Array(MAX_MARKERS);
  const ys = new Float64Array(MAX_MARKERS);
  for (let i = 0; i < n; i += 1) {
    const a = (i / n) * Math.PI * 2;
    xs[i] = x + Math.cos(a) * r;
    ys[i] = y + Math.sin(a) * r;
  }
  return { xs, ys, dry, n, area: Math.PI * r * r, still: 0, age: 0 };
}

/** The enclosed area, by the shoelace sum. Signed area would tell winding too, but a
 *  pinched ring is legitimately part negative, so only the magnitude is asked for. */
function ringArea(front: Front): number {
  const { xs, ys, n } = front;
  let sum = 0;
  for (let i = 0; i < n; i += 1) {
    const j = i + 1 === n ? 0 : i + 1;
    sum += xs[i] * ys[j] - xs[j] * ys[i];
  }
  return Math.abs(sum) * 0.5;
}

/** Lay a ring, retiring the oldest if the plate is already crowded. Seeds are clamped
 *  into the plate: a drag under pointer capture reports positions off the glass, and a
 *  drop centred out there would spend its life as an arc in one corner. */
function drop(state: State, x: number, y: number, dry: boolean) {
  if (state.fronts.length >= MAX_FRONTS) state.fronts.shift();
  const cx = x < 0 ? 0 : x > state.width ? state.width : x;
  const cy = y < 0 ? 0 : y > state.height ? state.height : y;
  state.fronts.push(ring(cx, cy, dry ? HOLE_R : SEED_R, dry));
  state.idle = 0;
}

/**
 * One solver step for one ring: v = W * V_DRIVE - GAMMA * kappa, along each marker's own
 * outward normal.
 *
 * The second difference is taken against the normal, which is where the minus sign in
 * front of GAMMA goes. On a circle of radius R with angular spacing d, the difference
 * comes to 2R(cos d - 1) . n ~= -R d^2, and h^2 = R^2 d^2, so bend / h^2 is -1/R = -kappa
 * exactly — hence `drive + curve * bend` below with curve = GAMMA / h^2, and no separate
 * kappa ever computed. Velocities are gathered for the whole ring before any marker
 * moves; interleaving the two would difference this step's neighbour against last step's
 * and quietly halve the curvature.
 */
function advance(state: State, front: Front, dt: number): boolean {
  const { xs, ys, n } = front;
  let perim = 0;
  for (let i = 0; i < n; i += 1) {
    const j = i + 1 === n ? 0 : i + 1;
    const dx = xs[j] - xs[i];
    const dy = ys[j] - ys[i];
    perim += Math.sqrt(dx * dx + dy * dy);
  }
  if (perim < DEATH_PERIMETER) return false;
  // The spacing the last re-parameterisation left, so this is a measured h and not a
  // nominal one — SPACING is the target, this is what the ring actually has.
  const h = perim / n;
  const curve = GAMMA / (h * h);
  for (let i = 0; i < n; i += 1) {
    const p = i === 0 ? n - 1 : i - 1;
    const q = i + 1 === n ? 0 : i + 1;
    const tx = xs[q] - xs[p];
    const ty = ys[q] - ys[p];
    const len = Math.sqrt(tx * tx + ty * ty) || 1;
    const nx = ty / len;
    const ny = -tx / len;
    const bend = (xs[p] - 2 * xs[i] + xs[q]) * nx + (ys[p] - 2 * ys[i] + ys[q]) * ny;
    const wet = wettability(state, xs[i], ys[i]);
    // One law, two signs. Spreading is driven by wettability; retraction is driven by the
    // want of it, so the patches that pinned the front are where the film tears first.
    const drive = front.dry ? V_DEWET * (1 - DEWET_HOLD * wet) : V_DRIVE * wet;
    let v = drive + curve * bend;
    if (v > V_CEIL) v = V_CEIL;
    // Hysteresis, and the one place this stops being a pure geometric flow: a line may
    // recede at a fraction of its own drive, so where the drive is zero it stops dead
    // rather than being pulled backwards by its neighbours' curvature.
    const back = -RECEDE * drive;
    if (v < back) v = back;
    bufVel[i] = v;
    bufNx[i] = nx;
    bufNy[i] = ny;
  }
  const minX = -BLEED;
  const minY = -BLEED;
  const maxX = state.width + BLEED;
  const maxY = state.height + BLEED;
  for (let i = 0; i < n; i += 1) {
    const move = bufVel[i] * dt;
    const x = xs[i] + bufNx[i] * move;
    const y = ys[i] + bufNy[i] * move;
    xs[i] = x < minX ? minX : x > maxX ? maxX : x;
    ys[i] = y < minY ? minY : y > maxY ? maxY : y;
  }
  return true;
}

/**
 * Re-parameterise the ring to even arclength. This is not tidying: h in the curvature
 * term is the marker spacing, and without this step the spacing at a fast finger tip runs
 * away from the spacing in the slow fjord behind it, so the same second difference means
 * two different curvatures on one ring. That is what kills a marker method on this
 * equation inside a second, and it shows up as a front that tears rather than fingers.
 */
function resample(front: Front): boolean {
  const { xs, ys, n } = front;
  bufArc[0] = 0;
  for (let i = 0; i < n; i += 1) {
    const j = i + 1 === n ? 0 : i + 1;
    const dx = xs[j] - xs[i];
    const dy = ys[j] - ys[i];
    bufArc[i + 1] = bufArc[i] + Math.sqrt(dx * dx + dy * dy);
  }
  const perim = bufArc[n];
  if (perim < DEATH_PERIMETER) return false;
  let m = Math.round(perim / SPACING);
  if (m < MIN_MARKERS) m = MIN_MARKERS;
  else if (m > MAX_MARKERS) m = MAX_MARKERS;
  const gap = perim / m;
  let seg = 0;
  for (let i = 0; i < m; i += 1) {
    const want = i * gap;
    while (seg < n - 1 && bufArc[seg + 1] < want) seg += 1;
    const span = bufArc[seg + 1] - bufArc[seg];
    const f = span > 1e-9 ? (want - bufArc[seg]) / span : 0;
    const j = seg + 1 === n ? 0 : seg + 1;
    bufX[i] = xs[seg] + (xs[j] - xs[seg]) * f;
    bufY[i] = ys[seg] + (ys[j] - ys[seg]) * f;
  }
  for (let i = 0; i < m; i += 1) {
    xs[i] = bufX[i];
    ys[i] = bufY[i];
  }
  front.n = m;
  return true;
}

/** Back to a dry plate with one drop on it: what the reset control does, and what the dry
 *  phase does of its own accord once its rest is up. */
function restart(state: State) {
  state.fronts.length = 0;
  state.mode = 'wet';
  state.wipe = true;
  // `drop` zeroes the rest timer, which is the thing that starts the reveal moving.
  drop(state, state.width * ORIGIN.u, state.height * ORIGIN.v, false);
}

/** One step of the whole plate: every ring advanced and re-parameterised, the retired
 *  ones dropped, and the phase machine turned over once the plate has gone quiet. */
function step(state: State, dt: number) {
  const fronts = state.fronts;
  for (let i = fronts.length - 1; i >= 0; i -= 1) {
    const front = fronts[i];
    front.age += dt;
    let alive = advance(state, front, dt) && resample(front);
    if (alive) {
      const area = ringArea(front);
      // Growth, not speed: a ring parked on the bleed rectangle still jitters at its
      // corners, so a speed test never fires and the phase machine would never move on.
      front.still = area - front.area < AREA_STALL * dt ? front.still + 1 : 0;
      front.area = area;
      if (front.still > STALL_STEPS || front.age > MAX_AGE) alive = false;
    }
    if (!alive) fronts.splice(i, 1);
  }
  if (fronts.length > 0) {
    state.idle = 0;
    return;
  }
  state.idle += dt;
  if (state.mode === 'wet') {
    if (state.idle < REST_WET) return;
    // A partially wetting film on cold glass is metastable, so it tears — and it tears
    // first on exactly the patches that pinned the front on the way in.
    for (const spot of state.spots) drop(state, spot.x, spot.y, true);
    state.mode = 'dry';
    state.idle = 0;
    return;
  }
  if (state.idle < REST_DRY) return;
  restart(state);
}

/**
 * Build the plate's state for one size. `setup` runs again on every resize, so nothing
 * here is resized in place: the offscreen plates are rebuilt, the patches are re-projected
 * into pixels, and the reveal starts over rather than being stretched sideways.
 */
function build(scene: SceneSetupContext, snap: boolean): State {
  const { width, height, dpr } = scene;
  const spots: Spot[] = PATCHES.map((patch) => ({
    x: patch.u * width,
    y: patch.v * height,
    ix: 1 / Math.max(1, patch.ru * width),
    iy: 1 / Math.max(1, patch.rv * height),
    amp: patch.amp,
  }));
  const layers = buildLayers(width, height, dpr);
  const state: State = {
    width,
    height,
    spots,
    fronts: [],
    layers,
    mode: 'wet',
    idle: 0,
    carry: 0,
    last: performance.now() / 1000,
    hold: HOLD_PERIOD,
    holdX: 0,
    holdY: 0,
    wasDown: false,
    next: 0,
    wipe: false,
  };
  if (layers) {
    paintArt(layers.art, width, height);
    paintFrost(layers, width, height, dpr);
  }
  if (snap) {
    // Reduced motion: the answer painted rather than approached. The mask is filled
    // outright and the ring list left empty, so the picture is clear, every bead the
    // solver would have trapped is already shut, and there is no contact line to draw.
    if (layers) {
      layers.mask.globalCompositeOperation = 'source-over';
      layers.mask.fillStyle = '#000000';
      layers.mask.fillRect(0, 0, width, height);
    }
    return state;
  }
  drop(state, width * ORIGIN.u, height * ORIGIN.v, false);
  // Warm the solver, so the card opens on a blot already fingering rather than on bare
  // frost waiting for its first frame.
  for (let t = 0; t < WARM; t += STEP) step(state, STEP);
  return state;
}

/** The ring as a closed path. Straight segments between markers: they are five pixels
 *  apart, so a curve through them would move the boundary by less than the antialiasing
 *  of the fill that follows. */
function trace(context: CanvasRenderingContext2D, front: Front) {
  const { xs, ys, n } = front;
  context.beginPath();
  context.moveTo(xs[0], ys[0]);
  for (let i = 1; i < n; i += 1) context.lineTo(xs[i], ys[i]);
  context.closePath();
}

/**
 * Fill every live ring into the accumulating mask: source-over for a spreading film,
 * destination-out for a hole opening in one. This is the entire topology handling. Two
 * overlapping rings union because their fills union; a hole subtracts because its fill
 * subtracts; nothing is ever cut and stitched.
 *
 * The bead falls out of the fill rule rather than out of a special case. When a fjord
 * pinches off, the loop that separates encircles the trapped dry spot with the opposite
 * winding to the main loop, so under nonzero fill the two cancel and the bead stays dry.
 * It then shuts at GAMMA / r, which runs away as r goes to zero — that is the snap. And
 * nothing has to be cut when the loop finally turns itself inside out, because a loop
 * under the critical radius is driven back to nothing by the same v: it cannot reopen as
 * a hole, and re-parameterisation hands it fewer markers every step until it is gone.
 *
 * The mask is not cleared between frames, and that is hysteresis rather than laziness: a
 * contact line that has passed over a spot leaves it wetted behind itself.
 */
function stamp(state: State, layers: Layers) {
  const mask = layers.mask;
  mask.fillStyle = '#000000';
  for (const front of state.fronts) {
    mask.globalCompositeOperation = front.dry ? 'destination-out' : 'source-over';
    trace(mask, front);
    mask.fill('nonzero');
  }
  mask.globalCompositeOperation = 'source-over';
}

/**
 * Paint the plate: the picture behind dry glass, the picture behind wet glass wherever the
 * mask says so, a sheen over both, and the contact line last and in the accent.
 */
function compose(scene: SceneDrawContext<State>, layers: Layers) {
  const { context, width, height, dpr, state } = scene;
  context.drawImage(layers.frost.canvas, 0, 0, width, height);

  // The wet region: the sharp picture, cut to the mask on the scratch plate, so the main
  // canvas never has to carry a clip path with a fjord-edged blot in it.
  const scratch = layers.scratch;
  scratch.setTransform(dpr, 0, 0, dpr, 0, 0);
  scratch.globalCompositeOperation = 'source-over';
  scratch.clearRect(0, 0, width, height);
  scratch.drawImage(layers.art.canvas, 0, 0, width, height);
  scratch.globalCompositeOperation = 'destination-in';
  scratch.drawImage(layers.mask.canvas, 0, 0, width, height);
  context.drawImage(scratch.canvas, 0, 0, width, height);

  // Glass, in front of both: one raking band, at the alpha a window has rather than the
  // alpha a highlight in a mockup has.
  const sheen = context.createLinearGradient(0, 0, width * 0.72, height);
  sheen.addColorStop(0, 'rgba(231, 237, 239, 0.055)');
  sheen.addColorStop(0.35, 'rgba(231, 237, 239, 0.012)');
  sheen.addColorStop(1, 'rgba(231, 237, 239, 0)');
  context.fillStyle = sheen;
  context.fillRect(0, 0, width, height);

  if (state.fronts.length === 0) return;

  /*
   * The meniscus, as the union of the rings' boundaries. Stroke every ring into scratch,
   * then delete the interior of every ring from it: what survives is the outer contour of
   * the union, so the seams where one ring crosses another are gone without anyone having
   * computed an intersection. Strokes go down in white and are tinted at the end, because
   * three overlapping bands of a translucent accent would each darken the last.
   */
  scratch.globalCompositeOperation = 'source-over';
  scratch.clearRect(0, 0, width, height);
  scratch.strokeStyle = '#ffffff';
  scratch.lineJoin = 'round';
  for (const band of RIM_BANDS) {
    scratch.lineWidth = band.width;
    scratch.globalAlpha = band.alpha;
    for (const front of state.fronts) {
      trace(scratch, front);
      scratch.stroke();
    }
  }
  scratch.globalAlpha = 1;
  scratch.globalCompositeOperation = 'destination-out';
  scratch.fillStyle = '#000000';
  for (const front of state.fronts) {
    trace(scratch, front);
    scratch.fill();
  }
  scratch.globalCompositeOperation = 'source-in';
  scratch.fillStyle = ACCENT;
  scratch.fillRect(0, 0, width, height);
  scratch.globalCompositeOperation = 'source-over';
  context.drawImage(scratch.canvas, 0, 0, width, height);
}

/**
 * Drain what the controls asked for, read the pointer, and advance the solver by the wall
 * clock in fixed steps. A scene is handed no elapsed time, so the clock is read here and
 * the accumulator belongs to the state.
 */
function run(scene: SceneDrawContext<State>, asks: Asks) {
  const { state, pointer } = scene;
  const now = performance.now() / 1000;
  let dt = now - state.last;
  state.last = now;
  if (dt < 0) dt = 0;
  const budget = MAX_SUBSTEPS * STEP;
  // A tab back from the background owes a minute of solver. It does not get to pay that in
  // one paint: the arrears are dropped and the plate carries on from where it stopped.
  if (dt > budget) dt = budget;

  if (asks.resets > 0) {
    asks.resets = 0;
    asks.drops = 0;
    restart(state);
  }
  for (let i = 0; i < asks.drops; i += 1) {
    const place = DROPS[state.next % DROPS.length];
    state.next += 1;
    drop(state, place.u * state.width, place.v * state.height, state.mode === 'dry');
  }
  asks.drops = 0;

  /*
   * Press and hold. The press lays one drop at once; holding still grows that drop, and
   * dragging lays a chain of them, which is why travel and not only time is the test.
   * On a plate that is already wet a press punches a hole instead — the glass cannot be
   * wetted twice, and a control that quietly did nothing would be worse than one that
   * does the opposite thing honestly.
   */
  if (pointer.down && pointer.inside) {
    state.hold += dt;
    const moved = Math.hypot(pointer.x - state.holdX, pointer.y - state.holdY);
    if (!state.wasDown || (state.hold >= HOLD_PERIOD && moved >= HOLD_GAP)) {
      drop(state, pointer.x, pointer.y, state.mode === 'dry');
      state.hold = 0;
      state.holdX = pointer.x;
      state.holdY = pointer.y;
    }
    state.wasDown = true;
  } else {
    state.wasDown = false;
  }

  // The clamp above is what bounds this loop: carry can never exceed the budget, so the
  // most it can spend is MAX_SUBSTEPS steps and no guard counter is needed to say so.
  state.carry += dt;
  if (state.carry > budget) state.carry = budget;
  while (state.carry >= STEP) {
    step(state, STEP);
    state.carry -= STEP;
  }
}

export type WettingRevealProps = { compact?: boolean };

/**
 * `compact` is the 298x240 catalogue card: the plate and its title, with the credit, both buttons
 * and the status line dropped. Nothing interactive is lost — the plate itself is the control, since
 * a press places a drop and a hold keeps feeding it — and the mask is solved on the card's own grid
 * rather than sampled from a larger one. The buttons leave the tab order too: the card frame is
 * `aria-hidden` and pointer-live, and its title link is the accessible path to the item.
 */
export function WettingReveal({ compact = false }: WettingRevealProps) {
  const reduced = useReducedMotion();
  const [status, setStatus] = useState(HINT);
  /** Bumped by both controls, so the effect below has something to depend on. */
  const [nudge, setNudge] = useState(0);
  /** The controls' side of the channel into the scene. */
  const asksRef = useRef<Asks>({ drops: 0, resets: 0 });

  const setup = (scene: SceneSetupContext) => build(scene, reduced);

  const draw = (scene: SceneDrawContext<State>) => {
    const { context, width, height, state } = scene;
    const asks = asksRef.current;
    /*
     * `reduced` is read live here rather than latched into the state, because the hook
     * replaces this closure on every render and rebuilds the scene when the preference
     * flips — so this is always the current answer, and a copy would only be able to go
     * stale. With it set, the mask is already full and the asks are drained and dropped:
     * there is no reveal left for a drop to change, and the status line says exactly that
     * rather than pretending a press did something.
     */
    if (reduced) {
      asks.drops = 0;
      asks.resets = 0;
    } else {
      run(scene, asks);
    }

    context.clearRect(0, 0, width, height);
    const layers = state.layers;
    if (!layers) {
      // No offscreen context to be had. The picture, straight onto the plate, at the state
      // the reveal settles on — the same answer reduced motion is given, which is why this
      // branch is a real fallback and not a stub.
      paintArt(context, width, height);
      return;
    }
    if (state.wipe) {
      state.wipe = false;
      layers.mask.globalCompositeOperation = 'source-over';
      layers.mask.clearRect(0, 0, width, height);
    }
    stamp(state, layers);
    compose(scene, layers);
  };

  const { stageRef, canvasRef, requestRender } = useCanvasScene<State>({ setup, draw });

  // The controls write to a ref, which is what the scene reads. This asks for the frame
  // that drains it, so a press lands even with the loop paused or stopped outright.
  useEffect(() => {
    requestRender();
  }, [nudge, requestRender]);

  const addDrop = useCallback(() => {
    asksRef.current.drops += 1;
    setNudge((count) => count + 1);
    setStatus(AFTER_DROP);
  }, []);

  const resetGlass = useCallback(() => {
    asksRef.current.resets += 1;
    setNudge((count) => count + 1);
    setStatus(AFTER_RESET);
  }, []);

  return (
    <div className="wetting-reveal-stage" data-compact={compact ? 'true' : undefined}>
      <figure className="wetting-reveal-card">
        {/* The plate holds the canvas and nothing else: it takes pointer capture on a
            press, so a control placed inside it would lose the click that started there. */}
        <div ref={stageRef} className="wetting-reveal-glass" aria-hidden="true">
          <canvas ref={canvasRef} />
        </div>
        <figcaption className="wetting-reveal-caption">
          <div className="wetting-reveal-lines">
            <h3 className="wetting-reveal-title">{ART_TITLE}</h3>
            <p className="wetting-reveal-credit">{ART_CREDIT}</p>
          </div>
          <div className="wetting-reveal-controls" role="group" aria-label="Wet or dry the glass">
            <button
              type="button"
              className="wetting-reveal-key"
              tabIndex={compact ? -1 : undefined}
              onClick={addDrop}
            >
              Add a drop
            </button>
            <button
              type="button"
              className="wetting-reveal-key"
              tabIndex={compact ? -1 : undefined}
              onClick={resetGlass}
            >
              Reset the glass
            </button>
          </div>
        </figcaption>
      </figure>
      <p className="wetting-reveal-status" role="status">
        {reduced ? REDUCED : status}
      </p>
    </div>
  );
}

export default WettingReveal;
