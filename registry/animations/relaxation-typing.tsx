'use client';

import './relaxation-typing.css';

import { useEffect, useRef, useState, type KeyboardEvent } from 'react';

import {
  useCanvasScene,
  useReducedMotion,
  type SceneDrawContext,
  type SceneSetupContext,
} from '@/hooks/use-canvas-scene';

/*
 * THREE COUPLED RELAXATION OSCILLATORS — the neon-lamp kind, one lamp per dot.
 *
 * Each dot is a capacitor charging through the cadence resistor toward the supply:
 *
 *     dV/dt = (VS - V) / (R·C)        →    V(t) = VS - (VS - V0)·exp(-t / R·C)
 *
 * At V_FIRE the lamp breaks down and a much smaller resistance appears across the same
 * capacitor, so the same first-order equation runs again toward a far lower target:
 *
 *     dV/dt = (VS - V)/(R·C) + (V_EXT + u - V)/(R_ON·C)
 *
 * and it keeps conducting until the arc current (V - V_EXT)/R_ON falls below I_MAINT. That
 * is the entire mechanism: one linear equation whose coefficients switch on a threshold,
 * with hysteresis between the strike and the drop-out. Both legs are stepped with the exact
 * solution of dV/dt = (V∞ - V)/τ over a fixed 1/240 s, which is what survives the 25:1
 * stiffness ratio between charging and dumping with no stability guard anywhere.
 *
 * The three are not three copies of one thing. Each lamp's arc current returns through a
 * shared cathode resistor wired into the *next* stage's return, lifting it by u = R_K·I.
 * That lift both pushes the follower's capacitor voltage down and raises the potential it
 * has to climb to, so a conducting stage holds the stage downstream of it off until its own
 * arc drops out. The dots are phase-coupled, not delayed.
 *
 * NOT a sine wave with a phase offset. NOT three eased keyframes on a stagger. NOT a spring
 * pulled toward a rounded target. NOT a gradient sweep. There is no duration in this file.
 *
 * THE CONSEQUENCE YOU ONLY GET BY SOLVING IT: the period is R·C·ln((VS-V_OFF)/(VS-V_FIRE))
 * plus the dump, and the cascade lag is the dump alone, set by R_ON·C — two different
 * products, and the cadence control only touches R. Dragging it stretches the period from
 * 229 ms to 583 ms while the gap from the first dot to the third only drifts 89 ms to 76 ms,
 * so the wave does not merely slow down: the spread sweeps from 39% of a cycle to 13% and the
 * ripple visibly tightens into a near-simultaneous blink. A keyframe stagger is always a
 * fraction of its duration and cannot do that. And every rise is an exponential against a
 * vertical collapse — 4.6:1 asymmetric at the fast end, 17:1 at the slow end — which is not a
 * shape any ease-in-out produces at any control points.
 */

/** Lamps in the chain. Three, because a typing indicator has three dots. */
const STAGES = 3;
/** Supply, volts. 15 V of headroom over the strike keeps the climb steep when it arrives. */
const V_SUPPLY = 105;
/** Breakdown voltage, volts. Nothing conducts below it; this is the upper switch. */
const V_FIRE = 90;
/** Arc voltage the capacitor dumps toward, volts. 28 V under the strike. */
const V_EXT = 62;
/** Conducting resistance, MΩ. 26 kΩ against 220–660 kΩ charging: the 25:1 that makes the
 *  fall look vertical next to the rise while both are the same exponential. */
const R_ON = 0.026;
/** Maintaining current, µA. Below it the arc cannot sustain itself and the lamp opens. */
const I_MAINT = 350;
/** Drop-out voltage: V_EXT + R_ON·I_MAINT = 71.1 V. The floor of every cycle, and with
 *  V_FIRE the 18.9 V swing that one dot's brightness is mapped from. */
const V_OFF = V_EXT + R_ON * I_MAINT;
/** Shared cathode resistor, MΩ. 4 kΩ lifts a follower 4.4 V at peak arc current, the least
 *  that gates it completely: at 2 kΩ the gate leaks and the spread collapses to 17%, and at
 *  0 the chain is three unrelated lamps whose dots scatter to 85% of a cycle apart. */
const R_K = 0.004;
/** Capacitances, µF, falling along the chain so every follower is intrinsically the faster
 *  lamp and is always pressing against the gate ahead of it rather than trailing it. */
const CAPS = [1, 0.97, 0.94];
/** Cadence resistance at the slow end of the pot, MΩ, and at the fast end. The 3:1 span is
 *  the whole travel: 583 ms down to 229 ms per cycle. */
const R_SLOW = 0.66;
const R_FAST = 0.22;
/** Keystrokes a minute reported at R_SLOW — 12 wpm, a thumb on a phone. */
const KEYS_SLOW = 60;
/** Pot span. The law is logarithmic, so equal travel is an equal *ratio* of charging
 *  current and the reported cadence stays exactly proportional to VS/R. */
const KEYS_SPAN = R_SLOW / R_FAST;
/** Solver step, seconds: four per display frame, and a sixth of the dump's 24 ms τ. */
const STEP = 1 / 240;
/** Substep ceiling. 12 × STEP is 50 ms, the same window the frame delta is clamped to. */
const MAX_STEPS = 12;
/** Seconds run before the first paint. The chain needs seven of them to converge at the
 *  slowest cadence — only twelve cycles. */
const SETTLE = 8;
/** Runaway bound on settle's stop-on-strike search, in solver steps: comfortably past one
 *  cycle at the slowest cadence, so only the strike itself ever ends that loop. */
const STRIKE_STEPS = 160;
/** Where the pot starts: mid-travel, 105 keys/min, a 23% spread with all three dots
 *  separately legible and the asymmetry already obvious. */
const START = 0.5;
/** One arrow press, as a fraction of travel — 24 notches from end to end. */
const KEY_STEP = 1 / 24;
/** Card side padding in CSS px, matching the face's 1.375rem. */
const INSET = 22;
/** Avatar box, CSS px (1.75rem), and the gap either side of the pill (0.625rem). */
const AVATAR = 28;
const GAP = 10;
/** The typing pill: 60 × 24 px with the three dots on a 16 px pitch about its centre. */
const PILL_W = 60;
const PILL_H = 24;
const DOT_PITCH = 16;
const DOT_R = 3.4;
/** How far a dot rides up between drop-out and strike, CSS px. Small on purpose: the read
 *  is meant to come from the brightness, with the lift only confirming it. */
const LIFT = 5;
/** Cadence track, CSS px up from the bottom of the card. */
const TRACK_Y = 15;
/** Near-white, and the one accent. Everything else is one of these under an alpha. */
const INK = '234, 243, 255';
const ACCENT = '158, 205, 255';
const TAU = Math.PI * 2;

/** Everything the chain owns. Geometry is `readonly` because only `setup` may write it. */
interface RelaxationState {
  /** Centre line of the indicator row, CSS px. */
  readonly rowY: number;
  /** Left edge of the pill, CSS px. */
  readonly pillX: number;
  readonly trackX: number;
  readonly trackW: number;
  readonly trackY: number;
  /** Capacitor-side node voltage of each lamp. */
  readonly node: Float64Array;
  /** Arc current of each lamp from the step just taken, µA. */
  readonly amps: Float64Array;
  /** Cathode lift each lamp is sitting on, volts. */
  readonly lift: Float64Array;
  /** Which lamps are conducting. */
  readonly lit: boolean[];
  /** Simulated time of each lamp's most recent strike, seconds. */
  readonly struck: Float64Array;
  /** Simulated seconds since the scene was built. */
  sim: number;
  /** `performance.now()` at the last paint, and the unspent remainder of the frame delta. */
  clock: number;
  carry: number;
  /** Pot travel, 0 slow to 1 fast. */
  drive: number;
  /** True while a press owns the pot, so a drag survives leaving the card. */
  dragging: boolean;
  /** The travel the frozen picture was solved for. NaN forces a re-solve. */
  frozen: number;
  snap: boolean;
  postedX: number;
  postedY: number;
}

function clamp01(value: number): number {
  return value < 0 ? 0 : value > 1 ? 1 : value;
}

/** The pot's law, and the cadence it is calibrated in. Both geometric in the travel, which
 *  is what keeps the reported keystroke rate proportional to the charging current. */
function ohmsFor(drive: number): number {
  return R_SLOW / KEYS_SPAN ** drive;
}

function keysFor(drive: number): number {
  return KEYS_SLOW * KEYS_SPAN ** drive;
}

/**
 * One fixed step of the whole chain. Arc currents and cathode lifts first, from the voltages
 * as they stand; then every capacitor is moved by the exact solution of its own linear leg;
 * then the two thresholds are tested. Nothing here is scaled by a frame time.
 */
function advance(state: RelaxationState, ohms: number): void {
  const { node, amps, lift, lit, struck } = state;

  for (let i = 0; i < STAGES; i += 1) {
    amps[i] = lit[i] ? Math.max(0, (node[i] - lift[i] - V_EXT) / R_ON) : 0;
  }
  // The cathode resistor stores nothing, so its drop is algebraic rather than integrated:
  // stage i rides on the arc current of stage i-1, and the master rides on nothing.
  lift[0] = 0;
  for (let i = 1; i < STAGES; i += 1) lift[i] = R_K * amps[i - 1];

  for (let i = 0; i < STAGES; i += 1) {
    let rate = 1 / (ohms * CAPS[i]);
    let flow = V_SUPPLY / (ohms * CAPS[i]);
    if (lit[i]) {
      rate += 1 / (R_ON * CAPS[i]);
      flow += (V_EXT + lift[i]) / (R_ON * CAPS[i]);
    }
    // τ = 1/Σ(1/RC) and V∞ = τ·Σ(V/RC): the two legs in parallel, solved over the step
    // instead of differenced across it. A forward difference would need h under 50 µs to
    // stay bounded while a lamp conducts, which is twelve times this step.
    const tau = 1 / rate;
    const rest = flow * tau;
    node[i] = rest + (node[i] - rest) * Math.exp(-STEP / tau);
  }

  for (let i = 0; i < STAGES; i += 1) {
    const across = node[i] - lift[i];
    if (lit[i]) {
      if ((across - V_EXT) / R_ON < I_MAINT) lit[i] = false;
      continue;
    }
    if (across < V_FIRE) continue;
    lit[i] = true;
    struck[i] = state.sim;
  }
  state.sim += STEP;
}

/**
 * Run the chain until it has locked, then on to the master's next strike. Stopping on a
 * strike is what makes the frozen reduced-motion picture the same picture every time instead
 * of whichever phase the clock happened to land on.
 */
function settle(state: RelaxationState, ohms: number): void {
  const steps = Math.round(SETTLE / STEP);
  for (let k = 0; k < steps; k += 1) advance(state, ohms);
  const mark = state.struck[0];
  for (let k = 0; k < STRIKE_STEPS && state.struck[0] === mark; k += 1) advance(state, ohms);
  state.frozen = state.drive;
}

function build(
  { width, height }: SceneSetupContext,
  drive: number,
  snap: boolean,
): RelaxationState {
  const state: RelaxationState = {
    rowY: height - 64,
    pillX: INSET + AVATAR + GAP,
    trackX: INSET,
    trackW: Math.max(40, width - INSET * 2),
    trackY: height - TRACK_Y,
    // Staggered start voltages so the chain has somewhere to lock *from*. Where it ends up is
    // the coupling's business, not this line's: with R_K at 0 and the capacitors detuned the
    // three phases just drift past each other forever, which is how the gate was measured.
    node: Float64Array.from([92, 86, 80]),
    amps: new Float64Array(STAGES),
    lift: new Float64Array(STAGES),
    lit: [false, false, false],
    struck: new Float64Array(STAGES),
    sim: 0,
    clock: 0,
    carry: 0,
    drive,
    dragging: false,
    frozen: Number.NaN,
    snap,
    postedX: Number.NaN,
    postedY: Number.NaN,
  };
  settle(state, ohmsFor(drive));
  return state;
}

/**
 * The pill, the three dots, and the pot's rail. Every dot's brightness, radius and lift come
 * off the same capacitor voltage — there is no second animation of the dots anywhere.
 */
function paint({ context, width, height, state }: SceneDrawContext<RelaxationState>): void {
  context.clearRect(0, 0, width, height);

  // The pill the dots sit in. The tint, and nothing else, carries the accent here.
  const pillY = state.rowY - PILL_H / 2;
  const radius = PILL_H / 2;
  context.beginPath();
  context.moveTo(state.pillX + radius, pillY);
  context.arcTo(state.pillX + PILL_W, pillY, state.pillX + PILL_W, pillY + PILL_H, radius);
  context.arcTo(state.pillX + PILL_W, pillY + PILL_H, state.pillX, pillY + PILL_H, radius);
  context.arcTo(state.pillX, pillY + PILL_H, state.pillX, pillY, radius);
  context.arcTo(state.pillX, pillY, state.pillX + PILL_W, pillY, radius);
  context.closePath();
  context.fillStyle = `rgba(${ACCENT}, 0.07)`;
  context.fill();
  context.strokeStyle = `rgba(${INK}, 0.1)`;
  context.lineWidth = 1;
  context.stroke();

  for (let i = 0; i < STAGES; i += 1) {
    const across = state.node[i] - state.lift[i];
    const charge = clamp01((across - V_OFF) / (V_FIRE - V_OFF));
    const x = state.pillX + PILL_W / 2 + (i - 1) * DOT_PITCH;
    // Half the lift each way, so the swing is centred in the pill rather than hanging off
    // the top of it — a discharged dot sits low, a charged one sits high, neither is off axis.
    const y = state.rowY + LIFT / 2 - charge * LIFT;
    if (state.lit[i]) {
      // The strike itself: a bloom that exists only while the arc is drawing current.
      context.beginPath();
      context.arc(x, y, DOT_R * 2.7, 0, TAU);
      context.fillStyle = `rgba(${ACCENT}, 0.1)`;
      context.fill();
    }
    context.beginPath();
    context.arc(x, y, DOT_R * (0.8 + 0.28 * charge), 0, TAU);
    context.fillStyle = `rgba(${ACCENT}, ${0.3 + 0.62 * charge})`;
    context.fill();
  }

  // The pot. Six ticks, then the rail, then the travelled part in the accent so the knob
  // the DOM places on top reads as a level rather than a loose plate.
  context.strokeStyle = `rgba(${INK}, 0.12)`;
  context.lineWidth = 1;
  for (let k = 0; k <= 6; k += 1) {
    const x = Math.round(state.trackX + (k / 6) * state.trackW) + 0.5;
    context.beginPath();
    context.moveTo(x, state.trackY - 4);
    context.lineTo(x, state.trackY - 8);
    context.stroke();
  }
  context.beginPath();
  context.moveTo(state.trackX, state.trackY);
  context.lineTo(state.trackX + state.trackW, state.trackY);
  context.strokeStyle = `rgba(${INK}, 0.14)`;
  context.stroke();
  context.beginPath();
  context.moveTo(state.trackX, state.trackY);
  context.lineTo(state.trackX + state.drive * state.trackW, state.trackY);
  context.strokeStyle = `rgba(${ACCENT}, 0.5)`;
  context.lineWidth = 2;
  context.stroke();
}

/**
 * The knob is a real DOM `role="slider"`, so it has to be moved to the pixel the canvas drew
 * the rail's travel to. Writing it from the solver's own geometry is what keeps the two from
 * drifting; nothing in the stylesheet knows where the track is.
 */
function place(node: HTMLElement | null, state: RelaxationState): void {
  if (!node) return;
  const x = state.trackX + state.drive * state.trackW;
  const y = state.trackY;
  if (Math.abs(x - state.postedX) < 0.4 && Math.abs(y - state.postedY) < 0.4) return;
  // The knob has no position until the solver has been asked for one, so it starts
  // transparent rather than in the corner. Opacity and not `visibility`, which would take
  // the slider out of the accessibility tree for as long as it took to place it.
  if (Number.isNaN(state.postedX)) node.style.opacity = '1';
  state.postedX = x;
  state.postedY = y;
  node.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) translate(-50%, -50%)`;
}

/**
 * A support thread whose typing indicator is the oscillator chain.
 *
 * The canvas layer takes every pointer event, so the messages, the indicator row and the
 * knob all sit over it in sibling layers that are transparent to the pointer. The knob is
 * still the real slider: a press anywhere on the card hands it focus, so the keyboard reaches
 * the same cadence control the mouse is dragging.
 */
/** `compact` is the 298x240 catalogue card: the same chain, the same three lamps and the same
 *  cadence pot, with the hint below the card dropped and the transcript tightened. Not one of
 *  the numbers the canvas and the stylesheet share is touched — the indicator row's 2.75rem
 *  offset and 2.5rem height are what put its centre on `height − 64`, and the 1.375rem side
 *  inset is `INSET`. See `relaxation-typing.css`. */
export type RelaxationTypingProps = { compact?: boolean };

export function RelaxationTyping({ compact = false }: RelaxationTypingProps) {
  const reduced = useReducedMotion();
  const [readout, setReadout] = useState(() => ({
    keys: Math.round(keysFor(START) / 5) * 5,
  }));
  /** What the labels are showing, so `draw` only touches React when a number changes. */
  const shownRef = useRef(readout);
  /** The pot position the solver is holding, read by `setup` and by the key handler. */
  const driveRef = useRef(START);
  const knobRef = useRef<HTMLDivElement>(null);
  /**
   * A keypress leaves the travel it wants here for the next frame to take, rather than
   * reaching into the solver from an event handler: the pot has to move between substeps or
   * the chain integrates half a step against the old resistance.
   */
  const pendingRef = useRef<number | null>(null);

  const draw = (scene: SceneDrawContext<RelaxationState>) => {
    const { state, pointer } = scene;
    state.snap = reduced;

    // The latch is what keeps a drag alive once the pointer has been thrown past the edge of
    // the card: the hook holds the capture, but `inside` goes false at the boundary.
    if (!pointer.down) state.dragging = false;
    else if (pointer.inside) state.dragging = true;
    if (state.dragging) state.drive = clamp01((pointer.x - state.trackX) / state.trackW);

    const pending = pendingRef.current;
    if (pending !== null) {
      pendingRef.current = null;
      state.drive = clamp01(pending);
    }

    const ohms = ohmsFor(state.drive);
    if (state.snap) {
      // The loop is stopped, so an accumulator advanced once per repaint would never arrive.
      // Re-solve to the locked answer for the pot's new position instead — the same chain,
      // run until it settles, which is the only honest still frame of an oscillator. Drag and
      // the arrow keys both still change the value and both still redraw.
      if (state.frozen !== state.drive) settle(state, ohms);
      state.clock = 0;
      state.carry = 0;
    } else {
      const now = performance.now();
      const elapsed = state.clock ? Math.min(0.05, (now - state.clock) / 1000) : STEP;
      state.clock = now;
      state.carry += elapsed;
      const count = Math.min(MAX_STEPS, Math.floor(state.carry / STEP));
      for (let k = 0; k < count; k += 1) advance(state, ohms);
      if (count > 0) state.carry -= count * STEP;
      // A tab left in the background for a minute comes back owing far more than the ceiling
      // can pay; dropping the debt is better than a burst of stale steps.
      if (state.carry > STEP * MAX_STEPS) state.carry = 0;
      state.frozen = Number.NaN;
    }

    paint(scene);
    place(knobRef.current, state);
    driveRef.current = state.drive;

    const next = { keys: Math.round(keysFor(state.drive) / 5) * 5 };
    if (next.keys !== shownRef.current.keys) {
      shownRef.current = next;
      setReadout(next);
    }
  };

  const { stageRef, canvasRef, requestRender } = useCanvasScene<RelaxationState>({
    setup: (scene) => build(scene, driveRef.current, reduced),
    draw,
  });

  // The labels are React and the lamps are not, so a change of reading — or of the motion
  // preference, which stops the loop outright — has to ask for the one repaint that keeps the
  // canvas showing the same cadence the text does.
  useEffect(() => {
    requestRender();
  }, [readout, reduced, requestRender]);

  /** Arrows step the pot by a notch, Home and End take it to the ends of its travel. */
  const handleKey = (event: KeyboardEvent<HTMLDivElement>) => {
    const drive = driveRef.current;
    if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
      pendingRef.current = drive + KEY_STEP;
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
      pendingRef.current = drive - KEY_STEP;
    } else if (event.key === 'End') {
      pendingRef.current = 1;
    } else if (event.key === 'Home') {
      pendingRef.current = 0;
    } else {
      return;
    }
    event.preventDefault();
    requestRender();
  };

  return (
    <div
      className="relaxation-typing-stage"
      data-compact={compact ? 'true' : undefined}
      /* The knob is transparent to the pointer so the canvas keeps the press and the capture
         with it; without this the pot could only ever be reached by Tab. In a card there is
         nothing to hand focus to — the whole frame is aria-hidden — so the press is left to
         the canvas alone. */
      onPointerDown={
        compact ? undefined : () => knobRef.current?.focus({ preventScroll: true })
      }
    >
      <div
        className="relaxation-typing-card"
        role="group"
        aria-label="Support thread with Priya Raman"
      >
        <div ref={stageRef} className="relaxation-typing-well" aria-hidden="true">
          <canvas ref={canvasRef} />
        </div>

        <div className="relaxation-typing-face">
          <div className="relaxation-typing-head">
            <span className="relaxation-typing-label">Thread 4821</span>
            <span className="relaxation-typing-label">{readout.keys} keys/min</span>
          </div>

          <ol className="relaxation-typing-log">
            <li className="relaxation-typing-note">
              <span className="relaxation-typing-who">Priya</span>
              <p className="relaxation-typing-said">
                The invoice still shows last month&rsquo;s plan.
              </p>
            </li>
            <li className="relaxation-typing-note relaxation-typing-note-mine">
              <span className="relaxation-typing-who">You</span>
              <p className="relaxation-typing-said">
                Checking now — your card was charged on the 3rd.
              </p>
            </li>
          </ol>
        </div>

        {/* Absolutely placed, because the canvas paints the three dots into the gap this row
            reserves and both have to agree on one number: the row's centre line. */}
        <p className="relaxation-typing-live">
          <span className="relaxation-typing-avatar" aria-hidden="true">
            PR
          </span>
          <span className="relaxation-typing-dots" aria-hidden="true" />
          Priya is typing
        </p>

        <div
          ref={knobRef}
          className="relaxation-typing-knob"
          role="slider"
          tabIndex={compact ? -1 : 0}
          aria-label="Incoming keystroke cadence"
          aria-valuemin={KEYS_SLOW}
          aria-valuemax={Math.round(KEYS_SLOW * KEYS_SPAN)}
          aria-valuenow={readout.keys}
          aria-valuetext={`${readout.keys} keystrokes a minute`}
          onKeyDown={handleKey}
        />
      </div>

      <p className="relaxation-typing-hint">
        <span>Drag for a faster typist</span>
      </p>
    </div>
  );
}

export default RelaxationTyping;
