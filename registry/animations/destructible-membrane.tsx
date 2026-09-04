'use client';

import './destructible-membrane.css';

import { useEffect, useRef } from 'react';

import {
  useCanvasScene,
  useReducedMotion,
  type SceneSetupContext,
} from '@/hooks/use-canvas-scene';

/**
 * A grain-textured membrane stretched over a pinned spring lattice. Drag it and
 * the links strain, snap and fray; the cells they held tear loose, flap open and
 * expose the message printed underneath.
 *
 * `useCanvasScene` owns the canvas. What is left here is the lattice, the damage
 * model and the tear propagation.
 */

const COLUMNS = 24;
const ROWS = 15;
const PAD_X = 30;
const PAD_Y = 42;
/**
 * The frame a card nails the sheet to. The authored 30/42 spends 84 of a card's 240
 * pixels on bare backing and leaves the membrane 156 of them — a small grey panel
 * inside a wide orange border. 14 hands it 270x212 and keeps a rim of about one cell
 * on every side. The cells come out 11.7 by 15.1 rather than square, which the model
 * does not mind: rest lengths are measured per axis, and the grain is a repeating
 * pattern rather than a stretched bitmap.
 */
const CARD_PAD = 14;
/**
 * Every radius in the damage model is an absolute pixel count, tuned against the stage
 * the item page gives this component: a 24x15 lattice over roughly 880 to 1040 by 360,
 * so a mean pitch near 30px and a 60px brush that reaches two cells. A card's pitch is
 * 13.4, where the same brush reaches five or six in every direction and one drag takes
 * most of the sheet off in a single pass instead of opening a gash. This is that pitch
 * ratio, and it scales every length the damage model measures in. Pointer thresholds
 * are left alone: how far a hand has to pull is a human distance, not a lattice one.
 */
const CARD_REACH = 0.45;
/** Relaxation passes per frame. Three is the least that holds the weave taut. */
const ITERATIONS = 3;
/** How far a tear front runs before it burns out. */
const TEAR_STEPS = 13;

interface MembraneNode {
  x: number;
  y: number;
  /** Rest position. Both the tether target and where the grain is sampled from. */
  readonly ox: number;
  readonly oy: number;
  vx: number;
  vy: number;
  /** Edge nodes are pinned: the sheet is nailed to its frame. */
  readonly pinned: boolean;
}

interface Link {
  readonly a: number;
  readonly b: number;
  readonly rest: number;
  health: number;
  broken: boolean;
  /** Diagonals resist shear; they are weaker and softer than the axis links. */
  readonly diagonal: boolean;
  readonly seed: number;
}

interface Cell {
  /** The four lattice nodes, clockwise from the top-left. */
  readonly ids: readonly [number, number, number, number];
  damage: number;
  torn: boolean;
  /** How far the flap has peeled, in pixels. */
  flap: number;
  flapVelocity: number;
  direction: number;
  readonly seed: number;
  curl: number;
}

/** A tear travelling through the lattice, damaging what it passes. */
interface TearFront {
  readonly x: number;
  readonly y: number;
  readonly dx: number;
  readonly dy: number;
  readonly energy: number;
  step: number;
  life: number;
}

interface MembraneState {
  readonly nodes: MembraneNode[];
  readonly links: Link[];
  readonly cells: Cell[];
  fronts: TearFront[];
  /** The node under the pointer, held out of the physics while dragged. */
  dragging: MembraneNode | null;
  wasDown: boolean;
  /** Where the current drag began — the throw direction is measured from it. */
  pressX: number;
  pressY: number;
  /**
   * Scales the lengths that decide how much of the sheet a tear takes: damage and break
   * radii, how far a tear front steps and sways, how hard it kicks the weave, how far a
   * flap peels. 1 at full size, `CARD_REACH` in a card.
   *
   * Not the marks a tear leaves — the damage inset, the outline jitter, the frayed
   * strands, the pale torn edge. Those are one to three pixels as authored, and through
   * `reach` they would land under a pixel in the frame that needs them most: a card's
   * cell is 12 wide, and the 1.45px the inset reaches by the 0.58 damage a cell tears at
   * is the only cue there is that the weave is going before anything moves.
   */
  readonly reach: number;
  readonly grain: CanvasPattern | null;
}

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));
const random = (min: number, max: number) => min + Math.random() * (max - min);
const nodeId = (x: number, y: number) => y * COLUMNS + x;

/**
 * A 72px tile of paper grain, repeated as a pattern. One small tile beats a
 * full-stage noise buffer: it is rebuilt per resize but sampled per cell.
 */
function makeGrain(context: CanvasRenderingContext2D): CanvasPattern | null {
  const tile = document.createElement('canvas');
  tile.width = 72;
  tile.height = 72;

  const brush = tile.getContext('2d');
  if (!brush) return null;

  brush.fillStyle = '#242321';
  brush.fillRect(0, 0, 72, 72);
  for (let index = 0; index < 420; index++) {
    brush.fillStyle = Math.random() > 0.5 ? 'rgba(255,255,255,.055)' : 'rgba(0,0,0,.12)';
    brush.fillRect(
      Math.random() * 72,
      Math.random() * 72,
      Math.random() * 1.5 + 0.25,
      Math.random() * 0.7 + 0.18,
    );
  }

  return context.createPattern(tile, 'repeat');
}

function build(
  { context, width, height }: SceneSetupContext,
  compact: boolean,
): MembraneState {
  const padX = compact ? CARD_PAD : PAD_X;
  const padY = compact ? CARD_PAD : PAD_Y;
  const spaceX = (width - padX * 2) / (COLUMNS - 1);
  const spaceY = (height - padY * 2) / (ROWS - 1);

  const nodes: MembraneNode[] = [];
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLUMNS; x++) {
      const px = padX + x * spaceX;
      const py = padY + y * spaceY;
      nodes.push({
        x: px,
        y: py,
        ox: px,
        oy: py,
        vx: 0,
        vy: 0,
        pinned: x === 0 || x === COLUMNS - 1 || y === 0 || y === ROWS - 1,
      });
    }
  }

  const links: Link[] = [];
  const link = (a: number, b: number, rest: number, diagonal = false) =>
    links.push({
      a,
      b,
      rest,
      health: 1,
      broken: false,
      diagonal,
      seed: Math.random() * 100,
    });

  const diagonal = Math.hypot(spaceX, spaceY);
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLUMNS; x++) {
      if (x < COLUMNS - 1) link(nodeId(x, y), nodeId(x + 1, y), spaceX);
      if (y < ROWS - 1) link(nodeId(x, y), nodeId(x, y + 1), spaceY);
      // Both diagonals, so a quad cannot fold flat without breaking something.
      if (x < COLUMNS - 1 && y < ROWS - 1) {
        link(nodeId(x, y), nodeId(x + 1, y + 1), diagonal, true);
      }
      if (x > 0 && y < ROWS - 1) link(nodeId(x, y), nodeId(x - 1, y + 1), diagonal, true);
    }
  }

  const cells: Cell[] = [];
  for (let y = 0; y < ROWS - 1; y++) {
    for (let x = 0; x < COLUMNS - 1; x++) {
      cells.push({
        ids: [nodeId(x, y), nodeId(x + 1, y), nodeId(x + 1, y + 1), nodeId(x, y + 1)],
        damage: 0,
        torn: false,
        flap: 0,
        flapVelocity: 0,
        direction: 0,
        seed: Math.random() * 100,
        curl: random(-1, 1),
      });
    }
  }

  return {
    nodes,
    links,
    cells,
    fronts: [],
    dragging: null,
    wasDown: false,
    pressX: 0,
    pressY: 0,
    reach: compact ? CARD_REACH : 1,
    grain: makeGrain(context),
  };
}

/** Returns a cell's four nodes, or null if the lattice does not contain them. */
function cellNodes(state: MembraneState, cell: Cell): MembraneNode[] | null {
  const result: MembraneNode[] = [];
  for (const id of cell.ids) {
    const node = state.nodes[id];
    if (!node) return null;
    result.push(node);
  }
  return result;
}

/** Mean position of a cell's nodes. */
function centreOf(nodes: readonly MembraneNode[]) {
  let x = 0;
  let y = 0;
  for (const node of nodes) {
    x += node.x;
    y += node.y;
  }
  return { x: x / nodes.length, y: y / nodes.length };
}

/**
 * Accumulates damage on every cell inside `radius`, tearing the ones that pass
 * the threshold. Tearing is one-way: a cell that has come loose stays loose.
 *
 * Callers pass the radius they were tuned with; `state.reach` is what makes the same
 * brush cover the same share of a card's smaller lattice.
 */
function damageAt(
  state: MembraneState,
  x: number,
  y: number,
  amount: number,
  radius = 54,
  direction = 0,
) {
  const span = radius * state.reach;

  for (const cell of state.cells) {
    const nodes = cellNodes(state, cell);
    if (!nodes) continue;

    const centre = centreOf(nodes);
    const distance = Math.hypot(centre.x - x, centre.y - y);
    if (distance >= span) continue;

    cell.damage = clamp(cell.damage + amount * (1 - distance / span), 0, 1);
    if (cell.damage > 0.58 && !cell.torn) {
      cell.torn = true;
      cell.flapVelocity = random(0.35, 0.85) + amount;
      cell.direction = direction + random(-0.38, 0.38);
      cell.curl = random(-1, 1);
    }
  }
}

/**
 * Wears down the links near a point. Links running across the tear direction
 * take the most: a tear travels along the weave rather than through it.
 */
function breakLinks(
  state: MembraneState,
  x: number,
  y: number,
  force: number,
  radius = 60,
  direction = 0,
) {
  const span = radius * state.reach;

  for (const link of state.links) {
    if (link.broken) continue;

    const a = state.nodes[link.a];
    const b = state.nodes[link.b];
    if (!a || !b) continue;

    const mx = (a.x + b.x) / 2;
    const my = (a.y + b.y) / 2;
    const distance = Math.hypot(mx - x, my - y);
    if (distance >= span) continue;

    const angle = Math.atan2(b.y - a.y, b.x - a.x);
    const alignment = 0.42 + Math.abs(Math.sin(angle - direction)) * 0.72;
    link.health -= force * (1 - distance / span) * alignment * (link.diagonal ? 0.76 : 1);

    if (link.health <= 0) {
      link.health = 0;
      link.broken = true;
      // A snapped link damages what it was holding, which is how one break
      // cascades into a tear.
      damageAt(state, mx, my, 0.34, 44, direction);
    }
  }
}

/** Starts a tear at a point, travelling in a direction. */
function rupture(
  state: MembraneState,
  x: number,
  y: number,
  dx: number,
  dy: number,
  energy: number,
) {
  const length = Math.hypot(dx, dy) || 1;
  state.fronts.push({
    x,
    y,
    dx: dx / length,
    dy: dy / length,
    energy,
    step: 0,
    life: 1,
  });

  const direction = Math.atan2(dy, dx);
  damageAt(state, x, y, energy * 0.75, 72, direction);
  breakLinks(state, x, y, energy, 68, direction);
}

/** Advances every live tear one step, damaging and kicking what it passes. */
function advanceFronts(state: MembraneState) {
  // The stride, the wander and the shove a front gives the weave are all lengths, so
  // all three travel with `reach`. A card's front covers 140px in its thirteen steps
  // rather than 312, which is the same share of a sheet a third of the width.
  const stride = 24 * state.reach;
  const wander = 13 * state.reach;
  const kick = 62 * state.reach;

  for (const front of state.fronts) {
    if (front.step > TEAR_STEPS) {
      front.life *= 0.86;
      continue;
    }

    // The sway is what keeps a tear from being a straight line.
    const sway = Math.sin(front.step * 1.77 + front.x * 0.013) * wander;
    const px = front.x + front.dx * front.step * stride - front.dy * sway;
    const py = front.y + front.dy * front.step * stride + front.dx * sway;
    const direction = Math.atan2(front.dy, front.dx);

    damageAt(state, px, py, front.energy * (0.48 - front.step * 0.015), 50, direction);
    breakLinks(state, px, py, front.energy * (0.72 - front.step * 0.026), 58, direction);

    for (const node of state.nodes) {
      if (node.pinned) continue;
      const distance = Math.hypot(node.x - px, node.y - py);
      if (distance >= kick) continue;
      // Kicked sideways, not along the tear: the sheet parts around it.
      const impulse = (1 - distance / kick) * front.energy * state.reach;
      node.vx += (-front.dy + front.dx * 0.35) * impulse * 1.8;
      node.vy += (front.dx + front.dy * 0.35) * impulse * 1.8;
    }

    front.step++;
  }

  if (state.fronts.some(front => front.life <= 0.06)) {
    state.fronts = state.fronts.filter(front => front.life > 0.06);
  }
}

/**
 * One relaxation pass: pull the links back to rest, wear out the overstretched
 * ones, then integrate. Run several times per frame — a single pass leaves the
 * lattice rubbery.
 */
function relax(state: MembraneState) {
  for (const link of state.links) {
    if (link.broken) continue;

    const a = state.nodes[link.a];
    const b = state.nodes[link.b];
    if (!a || !b) continue;

    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const distance = Math.hypot(dx, dy) || 1;
    const difference = (distance - link.rest) / distance;
    const strain = Math.abs(distance - link.rest) / link.rest;
    const stiffness = link.diagonal ? 0.034 : 0.062;

    // Fatigue: held past 14% strain a link fails on its own, so a slow pull
    // tears as surely as a fast one.
    if (strain > 0.14) {
      link.health -= Math.pow(strain - 0.12, 1.35) * 0.035;
      if (link.health <= 0) {
        link.health = 0;
        link.broken = true;
        damageAt(state, (a.x + b.x) / 2, (a.y + b.y) / 2, 0.38, 46, Math.atan2(dy, dx));
      }
    }

    if (a !== state.dragging && !a.pinned) {
      a.vx += dx * difference * stiffness;
      a.vy += dy * difference * stiffness;
    }
    if (b !== state.dragging && !b.pinned) {
      b.vx -= dx * difference * stiffness;
      b.vy -= dy * difference * stiffness;
    }
  }

  for (const node of state.nodes) {
    if (node === state.dragging) continue;
    // Pinned nodes are tethered hard to the frame; the rest sag slightly.
    const tether = node.pinned ? 0.14 : 0.006;
    node.vx += (node.ox - node.x) * tether;
    node.vy += (node.oy - node.y) * tether + (node.pinned ? 0 : 0.006);
    node.vx *= 0.91;
    node.vy *= 0.91;
    node.x += node.vx;
    node.y += node.vy;
  }
}

/** The nearest unpinned node within grabbing distance of a point. */
function nearestNode(state: MembraneState, x: number, y: number): MembraneNode | null {
  let best = 42;
  let found: MembraneNode | null = null;

  for (const node of state.nodes) {
    if (node.pinned) continue;
    const distance = Math.hypot(node.x - x, node.y - y);
    if (distance >= best) continue;
    best = distance;
    found = node;
  }

  return found;
}

/**
 * Heals the sheet in place. The lattice geometry is unchanged, so this is a
 * reset rather than a rebuild — but the seeds are re-rolled, so the next tear
 * frays differently.
 */
function resetMembrane(state: MembraneState) {
  for (const node of state.nodes) {
    node.x = node.ox;
    node.y = node.oy;
    node.vx = 0;
    node.vy = 0;
  }
  for (const link of state.links) {
    link.health = 1;
    link.broken = false;
  }
  for (const cell of state.cells) {
    cell.damage = 0;
    cell.torn = false;
    cell.flap = 0;
    cell.flapVelocity = 0;
    cell.direction = 0;
    cell.curl = random(-1, 1);
  }
  state.fronts = [];
  state.dragging = null;
}

/** Traces a closed outline into the current path. */
function tracePath(
  context: CanvasRenderingContext2D,
  points: ReadonlyArray<{ x: number; y: number }>,
) {
  const first = points[0];
  if (!first) return;

  context.beginPath();
  context.moveTo(first.x, first.y);
  for (let index = 1; index < points.length; index++) {
    const point = points[index];
    if (!point) continue;
    context.lineTo(point.x, point.y);
  }
  context.closePath();
}

/** The message the membrane is hiding, plus the hazard stripes behind it. */
function paintBacking(context: CanvasRenderingContext2D, width: number, height: number) {
  context.clearRect(0, 0, width, height);
  context.fillStyle = '#ff5a40';
  context.fillRect(0, 0, width, height);

  context.fillStyle = 'rgba(10,10,10,.13)';
  for (let x = -height; x < width + height; x += 30) {
    context.save();
    context.translate(x, 0);
    context.rotate(-0.18);
    context.fillRect(0, -60, 9, height + 120);
    context.restore();
  }

  const size = Math.min(72, width * 0.13);
  context.fillStyle = '#0c0c0c';
  context.font = `900 ${size}px Arial`;
  context.textBaseline = 'top';
  context.fillText('YOU', 42, height * 0.28);
  context.fillText('BROKE', 42, height * 0.28 + size * 0.88);
  context.fillText('THE UI.', 42, height * 0.28 + size * 1.76);
}

/**
 * Draws one cell of the sheet. Intact cells shrink slightly as they take damage
 * — the gaps between them are the tear becoming visible before anything moves.
 */
function drawCell(
  context: CanvasRenderingContext2D,
  state: MembraneState,
  cell: Cell,
  animate: boolean,
) {
  const nodes = cellNodes(state, cell);
  if (!nodes) return;

  const centre = centreOf(nodes);
  const pull = cell.damage * 2.5;
  const outline = nodes.map((node, index) => {
    const dx = node.x - centre.x;
    const dy = node.y - centre.y;
    const distance = Math.hypot(dx, dy) || 1;
    const jitter = Math.sin(cell.seed + index * 5.3) * cell.damage * 2.2;
    return {
      x: node.x - (dx / distance) * pull + (dy / distance) * jitter,
      y: node.y - (dy / distance) * pull - (dx / distance) * jitter,
    };
  });

  const fill = state.grain ?? '#242321';

  if (!cell.torn) {
    context.fillStyle = fill;
    tracePath(context, outline);
    context.fill();
    // A hairline appears well before the cell lets go: the surface shows fatigue.
    if (cell.damage > 0.12) {
      context.strokeStyle = `rgba(245,238,222,${clamp((cell.damage - 0.12) * 0.5, 0, 0.36)})`;
      context.lineWidth = 0.7;
      context.stroke();
    }
    return;
  }

  if (animate) {
    cell.flapVelocity += 0.007;
    cell.flapVelocity *= 0.982;
    // A flap is a length too: 60px of peel is a cell and a half at full size and four
    // cells in a card, which reads as confetti rather than a sheet coming apart.
    const ceiling = (18 + cell.damage * 42) * state.reach;
    cell.flap = clamp(cell.flap + cell.flapVelocity, 0, ceiling);
  }

  const lift = Math.sin(Math.min(Math.PI * 0.78, cell.flap * 0.035)) * 16 * state.reach;
  const flapX = Math.cos(cell.direction) * cell.flap;
  const flapY = Math.sin(cell.direction) * cell.flap + cell.flap * 0.16;

  context.save();
  context.translate(centre.x, centre.y);
  context.rotate(cell.curl * Math.min(0.22, cell.flap * 0.004));
  context.translate(-centre.x, -centre.y);

  // Only the far edge lifts, so the flap hinges instead of sliding.
  const peeled = outline.map((point, index) => ({
    x: point.x + flapX + (index > 1 ? cell.curl * lift : 0),
    y: point.y + flapY - (index === 1 || index === 2 ? lift : 0),
  }));

  // The fixed part of the drop shadow travels with `reach`; the part the flap drives
  // already has. A 12px blur on a 12x15 flake would be wider than the flake.
  context.shadowColor = 'rgba(0,0,0,.58)';
  context.shadowBlur = 12 * state.reach + lift * 0.55;
  context.shadowOffsetX = 6 * state.reach + flapX * 0.08;
  context.shadowOffsetY = 8 * state.reach + flapY * 0.08;
  context.fillStyle = 'rgba(0,0,0,.34)';
  tracePath(context, peeled);
  context.fill();

  context.shadowColor = 'transparent';
  context.shadowOffsetX = 0;
  context.shadowOffsetY = 0;
  context.fillStyle = fill;
  tracePath(context, peeled);
  context.fill();

  // The pale torn edge, drawn along the two highest points of the flap.
  const edge = [...peeled].sort((a, b) => a.y - b.y);
  const start = edge[0];
  const end = edge[1];
  if (start && end) {
    context.strokeStyle = 'rgba(247,239,219,.88)';
    context.lineWidth = 1.25;
    context.beginPath();
    context.moveTo(start.x, start.y);
    context.lineTo((start.x + end.x) / 2 + cell.curl * 3, (start.y + end.y) / 2 + 2);
    context.lineTo(end.x, end.y);
    context.stroke();
  }

  context.restore();
}

/** Broken links, drawn as three frayed strands parted at the middle. */
function drawFrays(context: CanvasRenderingContext2D, state: MembraneState) {
  for (const link of state.links) {
    if (!link.broken) continue;

    const a = state.nodes[link.a];
    const b = state.nodes[link.b];
    if (!a || !b) continue;

    const mx = (a.x + b.x) / 2;
    const my = (a.y + b.y) / 2;
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const distance = Math.hypot(dx, dy) || 1;
    const nx = -dy / distance;
    const ny = dx / distance;

    for (let strand = -1; strand <= 1; strand++) {
      const offset = strand * 1.1;
      const fray = Math.sin(link.seed + strand * 2.2) * 4;
      context.strokeStyle = `rgba(244,235,214,${0.5 - Math.abs(strand) * 0.08})`;
      context.lineWidth = 0.34;
      context.beginPath();
      context.moveTo(a.x + nx * offset, a.y + ny * offset);
      context.quadraticCurveTo(
        mx + nx * (fray + offset),
        my + ny * (fray + offset),
        mx - (dx / distance) * 3 + nx * offset,
        my - (dy / distance) * 3 + ny * offset,
      );
      context.moveTo(
        mx + (dx / distance) * 3 + nx * offset,
        my + (dy / distance) * 3 + ny * offset,
      );
      context.quadraticCurveTo(
        mx - nx * (fray - offset),
        my - ny * (fray - offset),
        b.x + nx * offset,
        b.y + ny * offset,
      );
      context.stroke();
    }
  }
}

/**
 * The drag forces were tuned against pointer events, of which there are a
 * handful per frame; applied once per frame instead, they need making up.
 */
const PER_FRAME_GAIN = 2;

/** `compact` is the 298x240 catalogue card: the same sheet, the same damage model and
 *  the same lattice, given the whole frame instead of a 30/42 border of backing, with
 *  every length inside it scaled to the smaller pitch and one rupture spent on arrival
 *  so the card shows what the component does. See `destructible-membrane.css`. */
export type DestructibleMembraneProps = { compact?: boolean };

export function DestructibleMembrane({ compact = false }: DestructibleMembraneProps) {
  const reduced = useReducedMotion();
  /**
   * A rupture or a reset asked for between frames. Applied inside `draw`, where
   * the lattice is in hand — a resize replaces it, so an event handler has no
   * business holding a reference to it.
   */
  const commandRef = useRef<'rupture' | 'reset' | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const { stageRef, canvasRef, requestRender } = useCanvasScene<MembraneState>({
    setup: (scene) => build(scene, compact),
    draw: ({ context, width, height, state, pointer, frame }) => {
      const asked = commandRef.current;
      commandRef.current = null;
      /*
       * A card tears itself once, on the first painted frame of the scene. An intact
       * membrane is a still image — it only moves when something pulls on it — and a
       * catalogue card showing a blank grey panel says nothing about what this is. The
       * seed lands on the mount paint, and the front then advances only in painted
       * frames, so a card that mounts below the fold opens its gash as it scrolls into
       * view rather than while nobody is looking. `frame` returns to 0 on the rebuild a
       * resize forces, which is what re-arms it.
       */
      const command = asked ?? (compact && frame === 0 ? 'rupture' : null);
      if (command === 'reset') resetMembrane(state);
      // Thrown left in a card: the message underneath is set from the left margin, and
      // the same tear sent right opens onto the blank half of the sheet.
      if (command === 'rupture') {
        rupture(state, width * 0.48, height * 0.48, compact ? -1 : 1, 0.22, 0.82);
      }

      if (pointer.down && !state.wasDown) {
        state.pressX = pointer.x;
        state.pressY = pointer.y;
        state.dragging = nearestNode(state, pointer.x, pointer.y);
      } else if (!pointer.down && state.wasDown) {
        const held = state.dragging;
        if (held) {
          // Measured from the node, not the pointer: a release followed by the
          // pointer leaving would otherwise throw it at the reset sentinel.
          const dx = held.x - state.pressX;
          const dy = held.y - state.pressY;
          const stretch = Math.hypot(held.x - held.ox, held.y - held.oy);
          held.vx = dx * 0.055;
          held.vy = dy * 0.055;
          if (stretch > 36) {
            rupture(state, held.x, held.y, dx, dy, clamp(stretch / 150, 0.35, 0.96));
          }
        }
        state.dragging = null;
      }
      state.wasDown = pointer.down;

      const held = state.dragging;
      if (held && pointer.inside) {
        const stretch = Math.hypot(pointer.x - held.ox, pointer.y - held.oy);
        const speed = Math.hypot(pointer.x - pointer.lastX, pointer.y - pointer.lastY);
        const angle = Math.atan2(pointer.y - state.pressY, pointer.x - state.pressX);

        // The held node follows the pointer exactly; the physics leaves it alone.
        held.x = pointer.x;
        held.y = pointer.y;
        held.vx = 0;
        held.vy = 0;

        if (stretch > 22) {
          const force = clamp((stretch - 22) / 82, 0, 0.19) * PER_FRAME_GAIN;
          damageAt(state, pointer.x, pointer.y, force * 0.32, 60, angle);
          breakLinks(state, pointer.x, pointer.y, force, 64, angle);
        }
        // A fast swipe cuts even when the sheet is barely stretched.
        if (speed > 8) {
          const force = clamp(speed / 130, 0, 0.13) * PER_FRAME_GAIN;
          breakLinks(state, pointer.x, pointer.y, force, 48, angle);
        }
      }

      if (reduced) {
        if (command === 'rupture') {
          // No frames to propagate across, so the tear is run to its end and the
          // lattice settled in one pass.
          for (let step = 0; step <= TEAR_STEPS; step++) advanceFronts(state);
          state.fronts = [];
          for (let pass = 0; pass < 24; pass++) relax(state);
          for (const cell of state.cells) {
            if (cell.torn) cell.flap = (18 + cell.damage * 42) * state.reach;
          }
        }
      } else {
        // Tears advance on alternate frames: a front that moved 24px every frame
        // outruns the lattice it is tearing.
        if (frame % 2 === 0) advanceFronts(state);
        for (let pass = 0; pass < ITERATIONS; pass++) relax(state);
      }

      paintBacking(context, width, height);
      for (const cell of state.cells) drawCell(context, state, cell, !reduced);
      drawFrays(context, state);
    },
  });

  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    /*
     * React dispatches from the root container, so a synthetic
     * `stopPropagation` would run only after the stage's own native listener
     * had already started a drag — and taken pointer capture with it. Stopping
     * the native event is what keeps the reset button from grabbing the sheet.
     */
    const stop = (event: PointerEvent) => event.stopPropagation();
    button.addEventListener('pointerdown', stop);
    return () => button.removeEventListener('pointerdown', stop);
  }, []);

  return (
    <div className="destructible-membrane-stage" data-compact={compact ? 'true' : undefined}>
      {/* The sheet is a control at full size: Enter and Space rupture it. In a card it
          keeps the pointer and loses the tab stop — the frame around it is aria-hidden,
          and a focusable node inside one is a trap with no name. */}
      <div
        ref={stageRef}
        className="destructible-membrane"
        role="button"
        tabIndex={compact ? -1 : 0}
        aria-label="Breakable membrane. Drag the surface to tear it and expose the message below."
        onKeyDown={event => {
          if (event.key !== 'Enter' && event.key !== ' ') return;
          event.preventDefault();
          commandRef.current = 'rupture';
          requestRender();
        }}
      >
        <canvas ref={canvasRef} aria-hidden="true" />
        {/* Still clickable in a card, and it is the only way back to an intact sheet
            once the card has torn itself, but out of the tab order for the same
            reason. */}
        <button
          ref={buttonRef}
          className="membrane-control"
          type="button"
          aria-label="Rebuild membrane"
          tabIndex={compact ? -1 : undefined}
          onClick={() => {
            commandRef.current = 'reset';
            requestRender();
          }}
        >
          <i />
          <i />
        </button>
      </div>

      {/* Rendered only in a card, where the sheet is the whole frame and nothing else
          says the surface can be pulled. The full stage is untouched. */}
      {compact && <p className="destructible-membrane-hint">Drag to tear</p>}
    </div>
  );
}
