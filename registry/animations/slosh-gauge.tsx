'use client';

import './slosh-gauge.css';

import { useEffect, useState } from 'react';

import {
  useCanvasScene,
  useReducedMotion,
  type SceneDrawContext,
  type SceneSetupContext,
} from '@/hooks/use-canvas-scene';

/**
 * A level gauge whose liquid obeys the shallow-water equations.
 *
 * Depth and along-tank velocity live on a staggered grid — depth at the cell
 * centres, velocity at the faces between them — and are advanced by the pair of
 * conservation laws a tide model uses: mass in equals mass out, and water
 * accelerates down the slope of its own surface. Nothing here is a sine wave with
 * a phase offset. The crest that runs across the tank when the level changes is
 * the gravity wave the pour actually launched, travelling at √(g·h), and it turns
 * around at the far side because the wall is a zero-velocity boundary rather than
 * a place the animation happens to stop.
 *
 * The flux at every face is upwinded and the two end faces are pinned shut, so
 * the sum of the depths only ever changes by what the inlet adds. That is why the
 * gauge comes to rest on the number it was asked for, exactly, with nothing
 * easing it there.
 *
 * Move the pointer across the card to tilt the tank: its offset from the centre
 * becomes the along-bed component of gravity, and the surface takes up the slope
 * that implies.
 */

/** Seconds per step. */
const STEP = 1 / 240;
/**
 * Target cell width in pixels, rather than a fixed cell count. An explicit scheme
 * is stable while a wave crosses less than one cell per step, and the wave speed
 * is √(g·h) — so it is dx that has to hold still as the card resizes. A fixed
 * count would halve dx on a narrow phone and put the solver over the limit.
 */
const CELL = 6;
/** Gravity, px/s². With the depth, this is what sets the wave speed. */
const G = 1400;
/** Bed friction, linearised. The only thing that finally flattens the surface. */
const FRICTION = 2.2;
/** Along-bed gravity at full pointer deflection — a tilt of about fifteen degrees. */
const TILT = 380;
/** How fast the inlet may change the mean depth, in pixels per second. */
const POUR = 300;
/** Depth a cell is never taken below, so a dry cell cannot go negative. */
const FLOOR = 0.75;
/** Fraction of the card the tank fills at 100%. The rest is room for crests. */
const HEAD = 0.8;
/** Cells the inlet spreads over. One cell would be a spike, not a stream. */
const MOUTH = 9;

const LEVELS = [18, 46, 72, 96];

interface SloshState {
  readonly cells: number;
  readonly dx: number;
  /** Depth at the cell centres. The volume of water, in one array. */
  readonly h: Float64Array;
  /** Along-tank velocity at the faces between cells. Both ends stay at zero. */
  readonly u: Float64Array;
  readonly flux: Float64Array;
  /** Inlet weights, one per cell, summing to one so a pour adds exactly its budget. */
  readonly mouth: Float64Array;
  readonly mouthX: number;
  readonly bedY: number;
  readonly maxDepth: number;
  /** Wanted mean depth in pixels, written from the component's value each frame. */
  target: number;
  /** Along-bed gravity from the tilt, px/s². */
  gx: number;
  /** How hard the inlet ran on the last step, −1…1. Only used to draw the stream. */
  pour: number;
  carry: number;
  clock: number;
  /**
   * Put the tank at rest on the target and skip the solver. Set under
   * `prefers-reduced-motion`, where the loop never runs and a gauge that advanced
   * one accumulator's worth per repaint would never arrive.
   */
  snap: boolean;
}

/** The tank flat at the target level, stationary. */
function flatten(state: SloshState) {
  state.h.fill(Math.max(FLOOR, state.target));
  state.u.fill(0);
  state.pour = 0;
}

function step(state: SloshState) {
  const { cells, dx, h, u, flux, mouth } = state;

  /*
   * The inlet, rate-limited. Depth is added over a cosine bump rather than into
   * one cell: a point source at this rate is a spike a hundred pixels tall that
   * the solver then has to survive, and the wave it launches is nothing like the
   * one a stream of water launches.
   */
  let total = 0;
  for (let i = 0; i < cells; i++) total += h[i];
  const limit = POUR * cells * STEP;
  const move = Math.max(-limit, Math.min(limit, state.target * cells - total));
  state.pour = move / limit;
  if (move !== 0) {
    for (let i = 0; i < cells; i++) h[i] = Math.max(FLOOR, h[i] + move * mouth[i]);
  }
  /*
   * Momentum at the faces: water accelerates down the surface slope, is carried by
   * its own flow, leans with the tilt, and loses speed to the bed. The advection
   * term is upwinded — differencing it centrally is unstable at this Courant
   * number and shows up as a checkerboard along the surface inside a second.
   */
  for (let j = 1; j < cells; j++) {
    const speed = u[j];
    const slope = (h[j] - h[j - 1]) / dx;
    const shear = speed > 0 ? (speed - u[j - 1]) / dx : (u[j + 1] - speed) / dx;
    u[j] = speed + (-G * slope - speed * shear + state.gx - FRICTION * speed) * STEP;
  }

  /*
   * Continuity, in flux form. `flux[0]` and `flux[cells]` are never written, so no
   * water crosses the walls and the total is conserved to the last pixel — which
   * is the whole reason the settled level is the requested one and not near it.
   * The floor below is the one leak, and at these levels it never triggers.
   */
  for (let j = 1; j < cells; j++) flux[j] = u[j] * (u[j] > 0 ? h[j - 1] : h[j]);
  for (let i = 0; i < cells; i++) {
    h[i] = Math.max(FLOOR, h[i] - (flux[i + 1] - flux[i]) * (STEP / dx));
  }
}

function build({ width, height }: SceneSetupContext, value: number): SloshState {
  const cells = Math.max(24, Math.round(width / CELL));
  const dx = width / cells;
  const maxDepth = height * HEAD;

  // A raised-cosine inlet, normalised. Inset from the wall by its own width so the
  // bump is not half-clipped and the pour does not lean on the boundary.
  const mouth = new Float64Array(cells);
  const centre = Math.min(cells - 1, MOUTH);
  let weight = 0;
  for (let i = 0; i < cells; i++) {
    const away = Math.abs(i - centre) / MOUTH;
    if (away >= 1) continue;
    mouth[i] = 0.5 + 0.5 * Math.cos(Math.PI * away);
    weight += mouth[i];
  }
  for (let i = 0; i < cells; i++) mouth[i] /= weight;

  const state: SloshState = {
    cells,
    dx,
    h: new Float64Array(cells),
    u: new Float64Array(cells + 1),
    flux: new Float64Array(cells + 1),
    mouth,
    mouthX: (centre + 0.5) * dx,
    bedY: height,
    maxDepth,
    target: (maxDepth * value) / 100,
    gx: 0,
    pour: 0,
    carry: 0,
    clock: 0,
    snap: false,
  };

  // Starting flat and full is the honest initial condition: the tank was already
  // at this level before the component mounted.
  flatten(state);

  return state;
}
function paint({ context, width, height, state, pointer }: SceneDrawContext<SloshState>) {
  const now = performance.now();
  const elapsed = state.clock ? Math.min(0.05, (now - state.clock) / 1000) : STEP;
  state.clock = now;

  // The pointer's offset from the centre is the tilt. Leaving the card levels the
  // tank rather than freezing it at whatever angle the cursor left on.
  state.gx = pointer.inside ? TILT * ((pointer.x / width) * 2 - 1) : 0;

  state.carry += elapsed;
  let steps = 0;
  while (state.carry >= STEP && steps < 8) {
    step(state);
    state.carry -= STEP;
    steps += 1;
  }
  if (state.carry > STEP * 8) state.carry = 0;
  if (state.snap) flatten(state);

  const { cells, dx, h, bedY, maxDepth } = state;

  context.clearRect(0, 0, width, height);

  // Quarter marks, so the level reads as a measurement and not as decoration.
  context.strokeStyle = 'rgba(226,240,255,0.07)';
  context.lineWidth = 1;
  for (let mark = 1; mark <= 4; mark++) {
    const y = Math.round(bedY - (maxDepth * mark) / 4) + 0.5;
    context.beginPath();
    context.moveTo(0, y);
    context.lineTo(width, y);
    context.stroke();
  }

  // The surface polyline, walked twice: once as the lid of the body and once on its
  // own as the lit edge. Cell centres, with the two half-cells at the walls carried
  // out flat — the wall is where the velocity is zero, not where the depth is.
  const trace = () => {
    context.moveTo(0, bedY - h[0]);
    for (let i = 0; i < cells; i++) context.lineTo((i + 0.5) * dx, bedY - h[i]);
    context.lineTo(width, bedY - h[cells - 1]);
  };

  context.beginPath();
  trace();
  context.lineTo(width, bedY);
  context.lineTo(0, bedY);
  context.closePath();
  const body = context.createLinearGradient(0, bedY - maxDepth, 0, bedY);
  body.addColorStop(0, 'rgba(90,200,218,0.58)');
  body.addColorStop(1, 'rgba(22,84,124,0.9)');
  context.fillStyle = body;
  context.fill();

  context.beginPath();
  trace();
  context.strokeStyle = 'rgba(186,246,255,0.85)';
  context.lineWidth = 1.5;
  context.stroke();

  /*
   * The stream is drawn from the inlet's actual flux, so it appears when the gauge
   * is filling, thickens with the rate, and stops the instant the level is reached.
   * Draining is silent because the outlet is under the water.
   */
  if (state.pour > 0.02) {
    const cell = Math.min(cells - 1, Math.max(0, Math.round(state.mouthX / dx - 0.5)));
    const surface = Math.max(0, bedY - h[cell]);
    const stream = context.createLinearGradient(0, 0, 0, surface);
    stream.addColorStop(0, 'rgba(186,246,255,0.04)');
    stream.addColorStop(1, `rgba(186,246,255,${0.3 * state.pour})`);
    context.fillStyle = stream;
    const half = 1.5 + state.pour * 2.5;
    context.fillRect(state.mouthX - half, 0, half * 2, surface);
  }
}

/** `compact` is the 298x240 catalogue card: the same tank, given the whole frame,
 *  with the copy cut to one line along the bottom. Presentation only — the CSS. */
export type SloshGaugeProps = { compact?: boolean };

/**
 * The card is the component; the tank is its background. The canvas layer sits
 * underneath and the readout sits on top with `pointer-events: none`, so a move
 * anywhere over the card tilts the tank while the level keys keep their clicks —
 * the stage takes pointer capture as it tracks, and a real button inside it would
 * have its click swallowed by that capture.
 */
export function SloshGauge({ compact = false }: SloshGaugeProps) {
  const [value, setValue] = useState(46);
  const reduced = useReducedMotion();

  const { stageRef, canvasRef, requestRender } = useCanvasScene<SloshState>({
    setup: (scene) => build(scene, value),
    draw: (scene) => {
      scene.state.target = (scene.state.maxDepth * value) / 100;
      scene.state.snap = reduced;
      paint(scene);
    },
  });

  // The level has to repaint on its own account: with the loop stopped under
  // reduced motion nothing else would, and the water would stay at the old mark.
  useEffect(() => {
    requestRender();
  }, [value, requestRender]);

  return (
    <div className="slosh-gauge-stage" data-compact={compact ? 'true' : undefined}>
      <div className="slosh-gauge-card">
        <div ref={stageRef} className="slosh-gauge-tank" aria-hidden="true">
          <canvas ref={canvasRef} />
        </div>

        <div className="slosh-gauge-face">
          <div>
            <p className="slosh-gauge-label">Object storage</p>
            <p
              className="slosh-gauge-read"
              role="meter"
              aria-label="Object storage used"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={value}
              aria-valuetext={`${value} percent of 2 TB`}
            >
              {value}
              <span className="slosh-gauge-unit">%</span>
            </p>
            <p className="slosh-gauge-sub">of 2 TB provisioned</p>
          </div>

          <div className="slosh-gauge-keys" role="group" aria-label="Set level">
            {LEVELS.map((level) => (
              <button
                key={level}
                type="button"
                className="slosh-gauge-key"
                aria-pressed={level === value}
                // The card frame is aria-hidden, so inside it the keys leave the tab
                // order. They stay clickable — only the keyboard path is withdrawn.
                tabIndex={compact ? -1 : undefined}
                onClick={() => setValue(level)}
              >
                {level}%
              </button>
            ))}
          </div>
        </div>
      </div>

      <p className="slosh-gauge-hint">Move across to tilt</p>
    </div>
  );
}

export default SloshGauge;
