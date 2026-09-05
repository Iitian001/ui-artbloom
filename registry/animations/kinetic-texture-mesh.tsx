'use client';

import './kinetic-texture-mesh.css';

import { useRef } from 'react';

import {
  useCanvasScene,
  useReducedMotion,
  type SceneDrawContext,
  type SceneSetupContext,
} from '@/hooks/use-canvas-scene';

/**
 * An image stretched over a spring mesh: drag to pluck it, release to send a
 * kinetic wave through the weave.
 *
 * The canvas preamble — DPR-scaled backing store, resize rebuild, offscreen
 * pause, pointer tracking, clamped delta, teardown — is `useCanvasScene`. What
 * is left here is the mesh and the forces on it.
 */

const SPACING = 24;
const PLUCK_FRAMES = 22;

/**
 * The card autopilot, counted in the scene's own painted frames rather than in
 * milliseconds: it stops when the loop stops off-screen, and it can never run ahead of
 * the mesh it is plucking. The first pluck lands almost at once, so a card is already
 * moving by the time it is looked at, and the period is long enough for the wave to die
 * — `power` decays by 0.955 a frame, so around 85 of them — and the weave to settle.
 */
const IDLE_FIRST = 18;
const IDLE_EVERY = 150;
/** Frames of quiet after a real press before the card starts plucking itself again. */
const IDLE_WAKE = 96;
/**
 * Where an unattended pluck lands, in fractions of the stage: a walk rather than one fixed
 * point, so two consecutive rings are not the same event twice. The amplitudes hold every
 * origin inside the middle 44% of the width and the middle 28% of the height — over the
 * wordmark, where the deformation is legible on a letterform in a way it is not on a
 * gradient, and clear enough of the edges that the ring opens in frame. The 1.3 is what
 * keeps the walk off a fixed ellipse: at the same frequency on both axes every pluck would
 * land somewhere on one closed curve.
 */
function idleSpot(turn: number) {
  return { x: 0.5 + Math.cos(turn) * 0.22, y: 0.52 + Math.sin(turn * 1.3) * 0.14 };
}
/** Golden angle, so the walk keeps finding new ground rather than cycling. */
const IDLE_TURN = 2.39996;

interface MeshNode {
  /** Rest position. The texture is sampled from here, so it never swims. */
  readonly ox: number;
  readonly oy: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
}

interface MeshState {
  /** The image being stretched. Painted once per resize, not per frame. */
  readonly texture: HTMLCanvasElement;
  readonly nodes: MeshNode[];
  readonly columns: number;
  readonly rows: number;
  /**
   * How far a press pulls and how far the released wave runs, as a fraction of the
   * pixels those two were tuned in. 1 everywhere but a card — see `build`.
   */
  readonly reach: number;
  wave: { x: number; y: number; power: number };
  /** Where the mesh was last pressed, so releasing can launch the wave there. */
  press: { x: number; y: number };
  /** Where a pluck with no pointer behind it lands. The middle, until a card moves it. */
  pluckAt: { x: number; y: number };
  /** Frames until the card plucks itself, and how far the walk has turned. */
  idle: number;
  turn: number;
  wasDown: boolean;
}

/** The wordmark's inset in a card, where the 34px the stage uses is a ninth of the frame. */
const CARD_INSET = 14;

/**
 * The size the wordmark has to be set at to fit a card, measured rather than assumed.
 *
 * `width * 0.2` is the rule the full stage was drawn to and it holds while the stage is
 * wide. At 298px it does not: 'THE GRID.' comes out around 301px long from a 34px inset,
 * which is 37px past the right edge — and the mesh loses more of it than that, because
 * `columns` covers a whole SPACING past the canvas, so the texture is displayed magnified
 * by gridWidth / width (1.047 at 298) with its right edge off-frame. Fitting the size to
 * the line's own measured length, in a room divided by that magnification, lands near 51px
 * and ends the long line the same 14px from the right edge that both start from on the
 * left. Measured because the face is whatever the machine resolves `Arial` to, and a
 * substitute with wider caps would put a fixed number back over the edge.
 */
function cardWordmark(paint: CanvasRenderingContext2D, width: number, longest: string) {
  paint.font = '900 100px Arial';
  const magnify = (Math.ceil(width / SPACING) * SPACING) / width;
  const room = (width - CARD_INSET * 2) / magnify;
  return (room / paint.measureText(longest).width) * 100;
}

/** Paints the image the mesh carries. Only depends on stage size and composition. */
function paintTexture(width: number, height: number, compact: boolean): HTMLCanvasElement {
  const texture = document.createElement('canvas');
  texture.width = Math.ceil(width);
  texture.height = Math.ceil(height);

  const paint = texture.getContext('2d');
  if (!paint) return texture;

  const field = paint.createLinearGradient(0, 0, width, height);
  field.addColorStop(0, '#ff5a40');
  field.addColorStop(0.28, '#b13cff');
  field.addColorStop(0.62, '#3155e7');
  field.addColorStop(1, '#d8ff43');
  paint.fillStyle = field;
  paint.fillRect(0, 0, width, height);

  for (let index = 0; index < 24; index++) {
    const x = (index * 83) % width;
    const y = (index * 137) % height;
    const radius = 38 + (index % 6) * 21;
    const glow = paint.createRadialGradient(x, y, 0, x, y, radius);
    glow.addColorStop(0, index % 2 ? 'rgba(255,255,255,.68)' : 'rgba(10,10,10,.48)');
    glow.addColorStop(1, 'rgba(255,255,255,0)');
    paint.fillStyle = glow;
    paint.fillRect(x - radius, y - radius, radius * 2, radius * 2);
  }

  paint.globalCompositeOperation = 'overlay';
  paint.fillStyle = 'rgba(255,255,255,.9)';
  // The two lines are the whole of the copy, and in a card they are the instruction as
  // well — the autopilot shows what a pluck does to the weave, the wordmark says whose
  // gesture it is — so they stay, fitted to the frame rather than cropped to 'THE GRI'.
  const inset = compact ? CARD_INSET : 34;
  const size = compact ? cardWordmark(paint, width, 'THE GRID.') : Math.min(110, width * 0.2);
  paint.font = `900 ${size}px Arial`;
  paint.textBaseline = 'middle';
  paint.fillText('PLUCK', inset, height * 0.43);
  paint.fillText('THE GRID.', inset, height * 0.65);

  return texture;
}

function build({ width, height }: SceneSetupContext, compact: boolean): MeshState {
  const columns = Math.ceil(width / SPACING) + 1;
  const rows = Math.ceil(height / SPACING) + 1;

  return {
    texture: paintTexture(width, height, compact),
    columns,
    rows,
    /*
     * The 150px pull and the 330px wave in `draw` are pixels tuned against this stage at
     * the 360px height it is drawn to, where a press dents a local patch of the weave and
     * the ring crosses the frame over its whole life. A 298x240 card is not that box: the
     * same 150px is half its width and five eighths of its height, so a press hauls the
     * entire mesh into one funnel instead of denting it, and a ring that runs to 330px is
     * past the far corner — 191px from the middle — for the last two fifths of its life.
     * Scaled by the shorter side, so the pluck reads at the same size relative to the box
     * in either: 0.67 in a 240px card, 0.72 in the 260px frame the landing lists use, 1 at
     * the stage the numbers came from, and never more than that. 240 is the floor —
     * `ItemCard` and `ItemGrid` both default to it and every card surface goes through
     * one of them.
     */
    reach: compact ? Math.min(1, Math.min(width, height) / 360) : 1,
    // Flat rather than nested: one bounds check per lookup instead of two, and
    // the row/column arithmetic stays in one place.
    nodes: Array.from({ length: columns * rows }, (_, index) => {
      const x = (index % columns) * SPACING;
      const y = Math.floor(index / columns) * SPACING;
      return { ox: x, oy: y, x, y, vx: 0, vy: 0 };
    }),
    wave: { x: 0, y: 0, power: 0 },
    press: { x: 0, y: 0 },
    pluckAt: { x: width * 0.52, y: height * 0.5 },
    idle: IDLE_FIRST,
    turn: 0,
    wasDown: false,
  };
}

/** Pulls two nodes toward `rest` apart. Equal and opposite, so no net drift. */
function spring(a: MeshNode, b: MeshNode, rest: number, strength: number) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const distance = Math.hypot(dx, dy) || 1;
  const force = ((distance - rest) / distance) * strength;
  a.vx += dx * force;
  a.vy += dy * force;
  b.vx -= dx * force;
  b.vy -= dy * force;
}

/** `compact` is the 298x240 catalogue card: the same weave and the same springs, handed the
 *  whole frame — the wordmark fitted to it, the pluck reach scaled to it, and the mesh
 *  plucking itself so the card is moving before it is touched. */
export type KineticTextureMeshProps = { compact?: boolean };

export function KineticTextureMesh({ compact = false }: KineticTextureMeshProps) {
  /*
   * A keyboard pluck is a countdown rather than a `setTimeout`, so it lives on
   * the same clock as the mesh: pausing the scene pauses the pluck, and nothing
   * fires after unmount.
   */
  const pluckRef = useRef(0);
  const reduced = useReducedMotion();

  const { stageRef, canvasRef } = useCanvasScene<MeshState>({
    setup: scene => build(scene, compact),
    draw: ({
      context,
      width,
      height,
      dpr,
      state,
      pointer,
    }: SceneDrawContext<MeshState>) => {
      const { nodes, columns, rows, texture } = state;

      /*
       * A card has to be alive before anyone touches it. A mesh at rest paints an
       * identical frame for ever, so in the catalogue this would read as a gradient with a
       * wordmark on it — a still, indistinguishable from a screenshot, which is the
       * presentation that was rejected. So when compact and unpressed the scene plucks
       * itself on a period, through the same countdown the keyboard path uses and at a
       * point that moves each time. A real press takes it straight back: the countdown
       * restarts, and a pluck already under way is dropped rather than fighting the drag
       * for its remaining frames — `down` stays true across the handover, so no wave is
       * launched until the visitor's own release.
       *
       * Gated on `reduced` too, and not only because a card should hold still there: with
       * the loop stopped the only frames are the ones a pointer asks for, so counting
       * those down would turn a hover into a pluck arriving one frame per mouse move.
       */
      if (compact && !reduced) {
        if (pointer.down) {
          state.idle = IDLE_WAKE;
          pluckRef.current = 0;
        } else if (--state.idle <= 0) {
          state.idle = IDLE_EVERY;
          state.turn += IDLE_TURN;
          const spot = idleSpot(state.turn);
          state.pluckAt = { x: width * spot.x, y: height * spot.y };
          pluckRef.current = PLUCK_FRAMES;
        }
      }

      // The keyboard path presses the middle of the mesh and then releases it,
      // reusing the drag code below rather than duplicating the force maths.
      const plucking = pluckRef.current > 0;
      if (plucking) pluckRef.current -= 1;
      const down = plucking || pointer.down;
      const press = plucking
        ? { ...state.pluckAt, dx: 0, dy: 0 }
        : {
            x: pointer.x,
            y: pointer.y,
            dx: pointer.x - pointer.lastX,
            dy: pointer.y - pointer.lastY,
          };

      if (down) state.press = { x: press.x, y: press.y };
      // Releasing is what launches the wave — detected as a transition so the
      // pointer leaving the stage cannot swallow it.
      if (state.wasDown && !down) state.wave = { ...state.press, power: 1 };
      state.wasDown = down;

      // How far the press pulls, how far the wave runs and how thick its ring is. The
      // pixels are the stage's; `reach` is 1 there and scales all three to a card.
      const pullRadius = 150 * state.reach;
      const waveRun = 330 * state.reach;
      const waveBand = 55 * state.reach;

      context.fillStyle = '#0d0d0d';
      context.fillRect(0, 0, width, height);

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < columns; x++) {
          const node = nodes[y * columns + x];
          if (!node) continue;

          node.vx += (node.ox - node.x) * 0.038;
          node.vy += (node.oy - node.y) * 0.038;

          const right = x < columns - 1 ? nodes[y * columns + x + 1] : undefined;
          const below = y < rows - 1 ? nodes[(y + 1) * columns + x] : undefined;
          const belowRight =
            x < columns - 1 && y < rows - 1 ? nodes[(y + 1) * columns + x + 1] : undefined;
          const belowLeft =
            x > 0 && y < rows - 1 ? nodes[(y + 1) * columns + x - 1] : undefined;

          if (right) spring(node, right, SPACING, 0.055);
          if (below) spring(node, below, SPACING, 0.055);
          if (belowRight) spring(node, belowRight, SPACING * Math.SQRT2, 0.026);
          if (belowLeft) spring(node, belowLeft, SPACING * Math.SQRT2, 0.026);

          if (down) {
            const dx = press.x - node.x;
            const dy = press.y - node.y;
            const distance = Math.hypot(dx, dy);
            if (distance < pullRadius) {
              const force = Math.pow(1 - distance / pullRadius, 1.5);
              node.vx += dx * force * 0.07 + press.dx * force * 0.035;
              node.vy += dy * force * 0.07 + press.dy * force * 0.035;
            }
          }

          if (state.wave.power > 0.02) {
            const dx = node.x - state.wave.x;
            const dy = node.y - state.wave.y;
            const distance = Math.hypot(dx, dy) || 1;
            const ring = (1 - state.wave.power) * waveRun;
            const band = Math.abs(distance - ring);
            if (band < waveBand) {
              const force = (1 - band / waveBand) * state.wave.power * 0.75;
              node.vx += (dx / distance) * force;
              node.vy += (dy / distance) * force;
            }
          }
        }
      }

      for (const node of nodes) {
        node.vx *= 0.82;
        node.vy *= 0.82;
        node.x += node.vx;
        node.y += node.vy;
      }
      state.wave.power *= 0.955;

      const gridWidth = Math.max(1, (columns - 1) * SPACING);
      const gridHeight = Math.max(1, (rows - 1) * SPACING);
      const scaleX = texture.width / gridWidth;
      const scaleY = texture.height / gridHeight;

      // Each cell is drawn under the affine transform that maps its rest square
      // onto its deformed one, which is what makes the image stretch with the
      // weave instead of sliding across it.
      for (let y = 0; y < rows - 1; y++) {
        for (let x = 0; x < columns - 1; x++) {
          const a = nodes[y * columns + x];
          const b = nodes[y * columns + x + 1];
          const c = nodes[(y + 1) * columns + x];
          if (!a || !b || !c) continue;

          context.save();
          context.setTransform(
            ((b.x - a.x) / SPACING) * dpr,
            ((b.y - a.y) / SPACING) * dpr,
            ((c.x - a.x) / SPACING) * dpr,
            ((c.y - a.y) / SPACING) * dpr,
            a.x * dpr,
            a.y * dpr,
          );
          context.drawImage(
            texture,
            a.ox * scaleX,
            a.oy * scaleY,
            SPACING * scaleX,
            SPACING * scaleY,
            // Slight overdraw: adjacent cells would otherwise show seams.
            -0.7,
            -0.7,
            SPACING + 1.4,
            SPACING + 1.4,
          );
          context.restore();
        }
      }

      // Strain lines, sampled every other node so the overlay stays sparse.
      context.globalCompositeOperation = 'screen';
      for (let y = 0; y < rows; y += 2) {
        for (let x = 0; x < columns - 1; x += 2) {
          const a = nodes[y * columns + x];
          const b = nodes[y * columns + x + 1];
          if (!a || !b) continue;

          const strain = Math.abs(Math.hypot(b.x - a.x, b.y - a.y) - SPACING) / SPACING;
          if (strain <= 0.035) continue;

          context.strokeStyle = `rgba(216,255,67,${Math.min(0.28, strain * 0.9)})`;
          context.lineWidth = 0.45;
          context.beginPath();
          context.moveTo(a.x, a.y);
          context.lineTo(b.x, b.y);
          context.stroke();
        }
      }

      context.globalCompositeOperation = 'source-over';
      context.fillStyle = 'rgba(8,8,8,.16)';
      context.fillRect(0, 0, width, height);
    },
  });

  return (
    <div className="kinetic-texture-mesh-stage" data-compact={compact ? 'true' : undefined}>
      {/* The surface takes a tab stop and a keyboard pluck everywhere but a card, where
          the frame around it is `aria-hidden` and a focusable node inside one is a trap
          with no name. It stays draggable in both — only the tab order changes. */}
      <div
        ref={stageRef}
        className="kinetic-texture-mesh"
        role="button"
        tabIndex={compact ? -1 : 0}
        aria-label="Elastic texture mesh. Drag to pluck the image and release a kinetic wave."
        onKeyDown={event => {
          if (event.key !== 'Enter' && event.key !== ' ') return;
          event.preventDefault();
          pluckRef.current = PLUCK_FRAMES;
        }}
      >
        <canvas ref={canvasRef} aria-hidden="true" />
      </div>
    </div>
  );
}
