'use client';

import './pull-cord.css';

import { useEffect, useState } from 'react';

import {
  useCanvasScene,
  useReducedMotion,
  type SceneDrawContext,
  type SceneSetupContext,
} from '@/hooks/use-canvas-scene';

/**
 * A switch you pull, with a cord that is a real rope.
 *
 * The cord is eighteen point masses integrated by Verlet and relaxed against
 * inextensible distance constraints — position-based dynamics, the same method a
 * cloth solver uses. Nothing about the swing is authored: the arc when you drag it
 * sideways is the pendulum the rope is, and the wave that runs down it after the
 * switch trips is the top of the rope having moved while the bottom had not heard
 * yet.
 *
 * The click is a detent, not a timer. A real pull-chain switch does not fire when
 * the chain reaches an angle; it fires when the chain has drawn a plunger a fixed
 * distance out of the mechanism against a spring, and then the plunger snaps home.
 * So the rope here is genuinely inextensible and the travel is paid out by the
 * mount: pull past the point where the rope is taut and the plunger follows your
 * hand, until it reaches the end of its travel and trips. It cannot fire twice
 * without being let up first, because the detent has to re-seat.
 *
 * The rope is the pointer affordance; the switch is a real `role="switch"` button
 * that rides on the knob, so a keyboard reaches it and a screen reader is told
 * what it is and whether it is on.
 */

/** Seconds per step. */
const STEP = 1 / 120;
/** Masses in the cord. */
const NODES = 18;
/** Rest length of one link, in pixels. Eighteen of these is the cord. */
const SEGMENT = 9;
/** Gravity, px/s². */
const G = 2200;
/** Velocity lost per step. Air, and the fibre's own hysteresis. */
const DRAG = 0.008;
/**
 * Relaxation passes over the links per step. Position-based dynamics converges on
 * an inextensible rope in single figures; eight leaves under a pixel of stretch
 * across the whole cord even while the knob is being hauled on.
 */
const RELAX = 8;
/** The knob's inverse mass. Heavier than a link, so the cord whips and it does not. */
const KNOB_INV = 0.25;
/** Stiffness of the hand's hold on the knob, per relaxation pass. */
const GRAB = 0.55;
/** How near the knob a press has to land to take hold of it. */
const REACH = 30;
/** The plunger's travel before the switch trips, in pixels. */
const DETENT = 22;
/** How fast the plunger follows the pull. Stiff: this is steel, not elastic. */
const PLUNGER = 40;
/** The plunger has to come back inside this fraction of its travel to re-arm. */
const RESEAT = 0.4;
/** Where the mount hangs, below the top of the stage. */
const MOUNT_Y = 6;

interface CordState {
  readonly count: number;
  /** Positions, and the positions one step ago. Verlet keeps velocity in the gap. */
  readonly x: Float64Array;
  readonly y: Float64Array;
  readonly px: Float64Array;
  readonly py: Float64Array;
  readonly inv: Float64Array;
  readonly mountX: number;
  /** How far the plunger has been drawn out of the mechanism, 0…DETENT. */
  sag: number;
  /** True while the detent is seated and able to trip. */
  armed: boolean;
  /** True while the hand has hold of the knob. */
  held: boolean;
  /** Set by `advance` when the detent trips; the component reads and clears it. */
  fired: boolean;
  /** Whether the lamp is on, for the knob's own bloom. Written by the component. */
  lit: boolean;
  /** Last cord position published to CSS, so the write is skipped when it has not moved. */
  postedX: number;
  postedY: number;
  carry: number;
  clock: number;
  /** Hang the cord straight and take no drags. Set under `prefers-reduced-motion`. */
  snap: boolean;
}

/** The pose the cord holds with nothing acting on it but gravity: a straight line. */
function hang(state: CordState) {
  for (let i = 0; i < state.count; i++) {
    state.x[i] = state.mountX;
    state.y[i] = MOUNT_Y + i * SEGMENT;
    state.px[i] = state.x[i];
    state.py[i] = state.y[i];
  }
  state.sag = 0;
  state.armed = true;
}
function advance(state: CordState, grabX: number, grabY: number) {
  const { count, x, y, px, py, inv } = state;

  /*
   * The plunger. `sag` is not integrated from a tension estimate — it is read off
   * the geometry, which is exact: the rope cannot stretch, so if the hand is D from
   * the mount and the rope is L long, the mechanism has had to pay out D − L, and
   * never more than its own travel.
   */
  const demand = state.held
    ? Math.hypot(grabX - state.mountX, grabY - MOUNT_Y) - SEGMENT * (count - 1)
    : 0;
  const wanted = Math.max(0, Math.min(DETENT, demand));
  state.sag += (wanted - state.sag) * Math.min(1, STEP * PLUNGER);

  if (state.armed && state.sag >= DETENT - 0.5) {
    // Trip. The plunger snaps home inside one step, which is what puts the wave in
    // the cord: the top has moved twenty-two pixels and the bottom has not heard.
    state.armed = false;
    state.fired = true;
    state.sag = 0;
  } else if (!state.armed && wanted < DETENT * RESEAT) {
    state.armed = true;
  }

  // Verlet, for every node but the first. Node 0 is the plunger's eye: it is
  // placed, and its zero inverse mass keeps the relaxation from moving it.
  for (let i = 1; i < count; i++) {
    const vx = (x[i] - px[i]) * (1 - DRAG);
    const vy = (y[i] - py[i]) * (1 - DRAG);
    px[i] = x[i];
    py[i] = y[i];
    x[i] += vx;
    y[i] += vy + G * STEP * STEP;
  }
  x[0] = state.mountX;
  y[0] = MOUNT_Y + state.sag;

  for (let pass = 0; pass < RELAX; pass++) {
    for (let i = 1; i < count; i++) {
      const dx = x[i] - x[i - 1];
      const dy = y[i] - y[i - 1];
      const distance = Math.hypot(dx, dy) || 1e-6;
      const share = (distance - SEGMENT) / distance / (inv[i - 1] + inv[i]);
      x[i - 1] += dx * share * inv[i - 1];
      y[i - 1] += dy * share * inv[i - 1];
      x[i] -= dx * share * inv[i];
      y[i] -= dy * share * inv[i];
    }

    /*
     * The hand, as one more constraint rather than as an assignment. Setting the
     * knob's position outright would overwrite the Verlet history that *is* its
     * velocity, and letting go mid-swing would drop it dead. As a constraint the
     * motion stays in the positions, so a throw carries.
     */
    if (state.held) {
      x[count - 1] += (grabX - x[count - 1]) * GRAB;
      y[count - 1] += (grabY - y[count - 1]) * GRAB;
    }
  }
}
function build({ width }: SceneSetupContext, lit: boolean): CordState {
  const count = NODES;
  const inv = new Float64Array(count);
  for (let i = 1; i < count; i++) inv[i] = 1;
  // The knob is the heavy end. Weighting the corrections by inverse mass is what
  // makes the cord whip around it instead of the two trading places.
  inv[count - 1] = KNOB_INV;

  const state: CordState = {
    count,
    x: new Float64Array(count),
    y: new Float64Array(count),
    px: new Float64Array(count),
    py: new Float64Array(count),
    inv,
    mountX: width * 0.78,
    sag: 0,
    armed: true,
    held: false,
    fired: false,
    lit,
    postedX: Number.NaN,
    postedY: Number.NaN,
    carry: 0,
    clock: 0,
    snap: false,
  };

  // Hanging straight is the exact rest pose, not an approximation of one: with only
  // gravity acting and every link inextensible, the solution is a vertical line.
  hang(state);

  return state;
}

function paint({ context, width, height, state, pointer }: SceneDrawContext<CordState>) {
  const now = performance.now();
  const elapsed = state.clock ? Math.min(0.05, (now - state.clock) / 1000) : STEP;
  state.clock = now;

  const knob = state.count - 1;

  if (state.snap) {
    state.held = false;
    hang(state);
  } else {
    // Take hold on a press that lands near the knob, and let go when it ends. The
    // grab is not re-tested while held, so dragging outside the stage keeps it.
    if (!pointer.down) state.held = false;
    else if (
      !state.held &&
      pointer.inside &&
      Math.hypot(pointer.x - state.x[knob], pointer.y - state.y[knob]) < REACH
    ) {
      state.held = true;
    }

    state.carry += elapsed;
    let steps = 0;
    while (state.carry >= STEP && steps < 6) {
      advance(state, pointer.x, pointer.y);
      state.carry -= STEP;
      steps += 1;
    }
    if (state.carry > STEP * 6) state.carry = 0;
  }

  context.clearRect(0, 0, width, height);
  // The mount, and the plunger at its real extension. The travel is drawn because
  // the travel is the mechanism: what you see move is what decides when it clicks.
  context.fillStyle = 'rgba(228,214,190,0.14)';
  context.fillRect(state.mountX - 17, 0, 34, MOUNT_Y);
  context.fillStyle = 'rgba(238,222,196,0.46)';
  context.fillRect(state.mountX - 1.5, MOUNT_Y, 3, Math.max(0, state.sag));

  /*
   * The cord through the midpoints of its links rather than through the nodes: a
   * quadratic to each midpoint with the node as the control point is C¹ across the
   * whole rope, so at nine pixels a link there is no facet to see. Drawing node to
   * node is a polygon, and it reads as one the moment the cord swings.
   */
  const { count, x, y } = state;
  context.strokeStyle = 'rgba(230,209,173,0.7)';
  context.lineWidth = 2.2;
  context.lineJoin = 'round';
  context.lineCap = 'round';
  context.beginPath();
  context.moveTo(x[0], y[0]);
  for (let i = 1; i < count - 1; i++) {
    context.quadraticCurveTo(x[i], y[i], (x[i] + x[i + 1]) * 0.5, (y[i] + y[i + 1]) * 0.5);
  }
  context.lineTo(x[knob], y[knob]);
  context.stroke();

  const kx = x[knob];
  const ky = y[knob];
  if (state.lit) {
    context.shadowColor = 'rgba(255,203,132,0.6)';
    context.shadowBlur = 26;
  }
  const bead = context.createRadialGradient(kx - 3, ky - 4, 1, kx, ky, 12);
  bead.addColorStop(0, state.lit ? '#fff4d8' : '#e6dac2');
  bead.addColorStop(1, state.lit ? '#b8863f' : '#877553');
  context.fillStyle = bead;
  context.beginPath();
  context.arc(kx, ky, 10, 0, Math.PI * 2);
  context.fill();
  context.shadowBlur = 0;

  /*
   * The knob's position, published to CSS so the switch button rides on it and the
   * focus ring lands where the control actually is. Written only when it has moved
   * a visible amount: a custom property on the stage invalidates style for its
   * subtree, and there is no reason to pay that on a frame where nothing moved.
   */
  if (Math.abs(kx - state.postedX) > 0.5 || Math.abs(ky - state.postedY) > 0.5) {
    state.postedX = kx;
    state.postedY = ky;
    const host = context.canvas.parentElement;
    if (host) {
      host.style.setProperty('--cord-x', `${kx.toFixed(1)}px`);
      host.style.setProperty('--cord-y', `${ky.toFixed(1)}px`);
    }
  }
}

export type PullCordProps = {
  /** Card variant: one line of type along the bottom, the cord given the whole box. */
  compact?: boolean;
};

/**
 * The cord layer is the stage and takes every pointer event; the copy sits on it
 * with `pointer-events: none`. The switch is a real button, focusable and labelled,
 * but `pointer-events: none` as well — so a mouse press on the knob is the drag the
 * cord expects, while Tab and Space reach the same control and toggle it outright.
 */
export function PullCord({ compact = false }: PullCordProps) {
  const [on, setOn] = useState(false);
  const reduced = useReducedMotion();

  const { stageRef, canvasRef, requestRender } = useCanvasScene<CordState>({
    setup: (scene) => build(scene, on),
    draw: (scene) => {
      scene.state.lit = on;
      scene.state.snap = reduced;
      paint(scene);
      // The detent trips inside the solver, so the React state follows the physics
      // rather than the other way round.
      if (scene.state.fired) {
        scene.state.fired = false;
        setOn((was) => !was);
      }
    },
  });

  // With the loop stopped under reduced motion, the toggle still has to repaint or
  // the knob would keep the colour of the state it just left.
  useEffect(() => {
    requestRender();
  }, [on, requestRender]);

  return (
    <div
      className="pull-cord-stage"
      data-on={on ? 'true' : 'false'}
      data-compact={compact ? 'true' : undefined}
    >
      <div ref={stageRef} className="pull-cord-line">
        <canvas ref={canvasRef} aria-hidden="true" />
        <button
          type="button"
          role="switch"
          className="pull-cord-switch"
          aria-checked={on}
          aria-label="Reading light"
          // The card frame is aria-hidden, so inside it the switch leaves the tab
          // order. It stays clickable — only the keyboard path is withdrawn.
          tabIndex={compact ? -1 : undefined}
          onClick={() => setOn((was) => !was)}
        />
      </div>

      <div className="pull-cord-face">
        <p className="pull-cord-eyebrow">Detent</p>
        <h2>{on ? 'The light is on.' : 'The light is off.'}</h2>
        <p className="pull-cord-copy">
          Eighteen masses, inextensible links, and a plunger with twenty-two pixels of
          travel. It clicks when the mechanism reaches the end of that travel, and it
          will not click again until the cord has been let up.
        </p>
      </div>

      <p className="pull-cord-hint">Pull the cord</p>
    </div>
  );
}

export default PullCord;
