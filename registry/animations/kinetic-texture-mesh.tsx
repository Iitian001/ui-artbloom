'use client';

import './kinetic-texture-mesh.css';

import { useRef } from 'react';

import {
  useCanvasScene,
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
  wave: { x: number; y: number; power: number };
  /** Where the mesh was last pressed, so releasing can launch the wave there. */
  press: { x: number; y: number };
  wasDown: boolean;
}

/** Paints the image the mesh carries. Only depends on stage size. */
function paintTexture(width: number, height: number): HTMLCanvasElement {
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
  paint.font = `900 ${Math.min(110, width * 0.2)}px Arial`;
  paint.textBaseline = 'middle';
  paint.fillText('PLUCK', 34, height * 0.43);
  paint.fillText('THE GRID.', 34, height * 0.65);

  return texture;
}

function setup({ width, height }: SceneSetupContext): MeshState {
  const columns = Math.ceil(width / SPACING) + 1;
  const rows = Math.ceil(height / SPACING) + 1;

  return {
    texture: paintTexture(width, height),
    columns,
    rows,
    // Flat rather than nested: one bounds check per lookup instead of two, and
    // the row/column arithmetic stays in one place.
    nodes: Array.from({ length: columns * rows }, (_, index) => {
      const x = (index % columns) * SPACING;
      const y = Math.floor(index / columns) * SPACING;
      return { ox: x, oy: y, x, y, vx: 0, vy: 0 };
    }),
    wave: { x: 0, y: 0, power: 0 },
    press: { x: 0, y: 0 },
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

export function KineticTextureMesh() {
  /*
   * A keyboard pluck is a countdown rather than a `setTimeout`, so it lives on
   * the same clock as the mesh: pausing the scene pauses the pluck, and nothing
   * fires after unmount.
   */
  const pluckRef = useRef(0);

  const { stageRef, canvasRef } = useCanvasScene<MeshState>({
    setup,
    draw: ({
      context,
      width,
      height,
      dpr,
      state,
      pointer,
    }: SceneDrawContext<MeshState>) => {
      const { nodes, columns, rows, texture } = state;

      // The keyboard path presses the middle of the mesh and then releases it,
      // reusing the drag code below rather than duplicating the force maths.
      const plucking = pluckRef.current > 0;
      if (plucking) pluckRef.current -= 1;
      const down = plucking || pointer.down;
      const press = plucking
        ? { x: width * 0.52, y: height * 0.5, dx: 0, dy: 0 }
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
            if (distance < 150) {
              const force = Math.pow(1 - distance / 150, 1.5);
              node.vx += dx * force * 0.07 + press.dx * force * 0.035;
              node.vy += dy * force * 0.07 + press.dy * force * 0.035;
            }
          }

          if (state.wave.power > 0.02) {
            const dx = node.x - state.wave.x;
            const dy = node.y - state.wave.y;
            const distance = Math.hypot(dx, dy) || 1;
            const ring = (1 - state.wave.power) * 330;
            const band = Math.abs(distance - ring);
            if (band < 55) {
              const force = (1 - band / 55) * state.wave.power * 0.75;
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
    <div className="kinetic-texture-mesh-stage">
      <div
        ref={stageRef}
        className="kinetic-texture-mesh"
        role="button"
        tabIndex={0}
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
