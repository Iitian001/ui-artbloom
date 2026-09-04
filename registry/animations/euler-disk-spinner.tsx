'use client';

import './euler-disk-spinner.css';

import { useEffect, useId, useRef } from 'react';

import { useCanvasScene, useReducedMotion, type SceneDrawContext, type SceneSetupContext } from '@/hooks/use-canvas-scene';

/**
 * A determinate loader whose spinner is Euler's disk: a coin rolling on its rim, rattling faster
 * as it dies, then lying flat and dead the moment the job is done.
 *
 * Rolling without slipping locks the precession rate to the inclination, Omega^2 = (4g/3R)/sin a,
 * so Omega DIVERGES like a^-1/2 while the energy E = MgR*sin a drains away. Two sinks drain it:
 * air squeezed out of the closing wedge, P ~ Omega^2/sin a (Moffatt), and rolling friction at the
 * contact, P ~ Omega. Dividing by dE/da = MgR*cos a gives the equation this file integrates,
 *
 *     da/dt = -(C_v * Omega^2 / sin a + C_r * Omega) / cos a,
 *
 * whose viscous term alone makes a^3 fall linearly in time: a reaches zero at a finite instant
 * with the rate still climbing. That is why this beats a rotating arc — the ending is a real
 * singularity, not a fade-out.
 *
 * a and Omega are separate states and Omega is capped at the step limit. Solve Omega from the
 * constraint alone and the last frames turn over more than a lap each: the contact point aliases
 * into a jitter and the coin tears off the plate one frame before it should be flat.
 */

const TAU = Math.PI * 2;
const STEP = 1 / 240;              // the rattle clears 7 Hz before it dies; 120 Hz aliases the tail
const MAX_SUBSTEPS = 8;
const ALPHA_START = 0.6;           // rad of inclination at full energy: 34 degrees, a 2.5 s run
const SIN_START = Math.sin(ALPHA_START);
const ALPHA_FLOOR = 0.0035;        // the drain divides by sin(alpha), so it never sees zero
const ALPHA_STOP = 0.006;          // the singularity has arrived: lie flat and stop dead
const GRAV_COUPLE = 26;            // 4g/3R in stage units: 1.1 Hz at full tilt, 7.3 Hz at the cap
const OMEGA_CAP = 46;              // rad/s, i.e. 0.19 rad per substep — the last frames climb toward this
const VISC_DRAIN = 1.0e-4;         // air in the closing wedge: only wins below 5 degrees, as Moffatt has it
const ROLL_DRAIN = 0.018;          // rolling friction, the sink that carries the first two seconds
const CONSTRAINT_LAG = 120;        // contact friction pulling Omega onto the rolling constraint: 8 ms,
                                   // because the constraint gains 30 rad/s in the run's last 70 ms
const TRAIL_MAX = 40;
const TRAIL_SPACING = 0.09;        // rad of precession per sample, so the tail reads the same at any rate
const WARM_SECONDS = 0.45;         // first painted frame already has tilt, a tail and a percentage
const CAM_FOOT = 0.42;             // sin(camera elevation): how flat the plate reads
const CAM_RISE = 0.906;            // cos(camera elevation): how much height reads
const RIM_SEGMENTS = 44;
const WIDE_PX = 512;
const COIN_EDGE = '#f3c04a';
const COIN_DARK = '#4b3a15';

interface State {
  clock: number;
  carry: number;
  alpha: number;
  omega: number;
  phase: number;
  settled: boolean;
  sinceSample: number;
  /** (phase, alpha) per sample, never pixels — a resize must not invalidate the tail. */
  trail: Float64Array;
  trailHead: number;
  trailCount: number;
  pctShown: number;
  rateShown: number;
  settleShown: boolean;
  kickSeen: number;
  wasDown: boolean;
}

type View = { cx: number; cy: number; r: number };

/** Readouts are written straight to the DOM; the nodes only exist after mount. */
function setText(node: HTMLElement | null, text: string): void {
  if (node) {
    node.textContent = text;
  }
}

/** The rolling constraint. Capped, because sin(alpha)^-1/2 outruns any fixed timestep. */
function constraintOmega(alpha: number): number {
  return Math.min(OMEGA_CAP, Math.sqrt(GRAV_COUPLE / Math.max(Math.sin(alpha), ALPHA_FLOOR)));
}

function pushTrail(state: State): void {
  const i = state.trailHead * 2;
  state.trail[i] = state.phase;
  state.trail[i + 1] = state.alpha;
  state.trailHead = (state.trailHead + 1) % TRAIL_MAX;
  if (state.trailCount < TRAIL_MAX) {
    state.trailCount += 1;
  }
}

function advance(state: State): void {
  if (state.settled) {
    return;
  }
  // E = MgR*sin(alpha), so the divisor is dE/dalpha = MgR*cos(alpha), not MgR. The run starts at
  // 34 degrees, where the small-angle shortcut understates the drain by about 20%.
  const lean = Math.max(Math.sin(state.alpha), ALPHA_FLOOR);
  const k = 1 - Math.exp(-STEP * CONSTRAINT_LAG);
  state.omega += (constraintOmega(state.alpha) - state.omega) * k;
  const power = (VISC_DRAIN * state.omega * state.omega) / lean + ROLL_DRAIN * state.omega;
  // Explicit Euler against a rate that diverges: below about 0.03 rad one step already asks for more
  // than the whole remaining tilt, which would leave a negative alpha in state and hand that negative
  // alpha to the trail sample taken further down this same call. Capping the drop at half the tilt
  // keeps the approach one-sided; arrival is still finite because a halving reaches ALPHA_STOP two or
  // three steps later, and the cap only ever engages inside the last few milliseconds.
  const drop = Math.min((power / Math.cos(state.alpha)) * STEP, state.alpha * 0.5);
  state.alpha -= drop;
  state.phase = (state.phase + state.omega * STEP) % TAU;
  state.sinceSample += state.omega * STEP;
  if (state.sinceSample >= TRAIL_SPACING) {
    pushTrail(state);
    state.sinceSample = 0;
  }
  if (state.alpha <= ALPHA_STOP) {
    state.alpha = 0;
    state.omega = 0;
    state.settled = true;
  }
}

function kick(state: State): void {
  state.alpha = ALPHA_START;
  state.omega = constraintOmega(ALPHA_START);
  state.settled = false;
  state.carry = 0;
  state.sinceSample = 0;
  state.trailHead = 0;
  state.trailCount = 0;
}

function warm(state: State, seconds: number): void {
  for (let left = seconds; left > 0; left -= STEP) {
    advance(state);
  }
}

// The coin keeps clear of the card: 1.44r of rim can rise above the centre when the disc leans
// away from the camera, so the radius is bounded by the height as well as the width.
function viewFor(width: number, height: number): View {
  const wide = width >= WIDE_PX;
  const r = wide
    ? Math.min(width * 0.19, height * 0.27, 112)
    : Math.min(width * 0.28, height * 0.19, 96);
  return {
    cx: wide ? width * 0.73 : width * 0.5,
    cy: wide ? height * 0.5 : height * 0.32,
    r: Math.max(34, r),
  };
}

/**
 * The rim of the disc: centre fixed at height R*sin(alpha), contact point riding a circle of
 * radius R*cos(alpha) at azimuth `phase`. `scale` draws a smaller concentric ring in the same
 * plane — the centre height stays R*sin(alpha), so it must not be folded into the radius.
 * `flat` drops the height for the overhead shadow.
 */
function rimPath(
  context: CanvasRenderingContext2D,
  view: View,
  state: State,
  flat: boolean,
  scale: number,
): void {
  const ca = Math.cos(state.alpha);
  const sa = Math.sin(state.alpha);
  const cp = Math.cos(state.phase);
  const sp = Math.sin(state.phase);
  const r = view.r * scale;
  context.beginPath();
  for (let i = 0; i <= RIM_SEGMENTS; i += 1) {
    const psi = (i / RIM_SEGMENTS) * TAU;
    const cw = Math.cos(psi);
    const sw = Math.sin(psi);
    const x = r * (sp * cw + ca * cp * sw);
    const y = r * (ca * sp * sw - cp * cw);
    const z = flat ? 0 : view.r * sa - r * sa * sw;
    const sx = view.cx + x;
    const sy = view.cy - y * CAM_FOOT - z * CAM_RISE;
    if (i === 0) {
      context.moveTo(sx, sy);
    } else {
      context.lineTo(sx, sy);
    }
  }
  context.closePath();
}

function paintPlate(context: CanvasRenderingContext2D, view: View, state: State): void {
  const halo = view.r * 2.6;
  const glow = context.createRadialGradient(view.cx, view.cy, 0, view.cx, view.cy, halo);
  glow.addColorStop(0, 'rgba(243, 192, 74, 0.15)');
  glow.addColorStop(0.5, 'rgba(243, 192, 74, 0.05)');
  glow.addColorStop(1, 'rgba(243, 192, 74, 0)');
  context.fillStyle = glow;
  context.beginPath();
  context.ellipse(view.cx, view.cy, halo, halo * CAM_FOOT + view.r, 0, 0, TAU);
  context.fill();

  const plate = view.r * 1.6;
  context.beginPath();
  context.ellipse(view.cx, view.cy, plate, plate * CAM_FOOT, 0, 0, TAU);
  context.fillStyle = 'rgba(255, 248, 235, 0.045)';
  context.fill();
  context.lineWidth = 1;
  context.strokeStyle = 'rgba(255, 248, 235, 0.13)';
  context.stroke();

  const ring = view.r * Math.cos(state.alpha);
  context.beginPath();
  context.ellipse(view.cx, view.cy, ring, ring * CAM_FOOT, 0, 0, TAU);
  context.strokeStyle = 'rgba(243, 192, 74, 0.16)';
  context.stroke();
}

/**
 * The contact point's own track, sampled per 0.09 rad of precession rather than per frame so the
 * tail is the same length at 1 Hz and at 7 Hz. Drawn in two passes: the disc's footprint all but
 * covers the track, so one pass either buries the near half under the coin or floats the far half
 * over it. Nearer means lower on screen, which is sin(azimuth) < 0.
 */
function paintTrail(context: CanvasRenderingContext2D, view: View, state: State, near: boolean): void {
  const start = (state.trailHead - state.trailCount + TRAIL_MAX) % TRAIL_MAX;
  for (let i = 0; i < state.trailCount; i += 1) {
    const j = ((start + i) % TRAIL_MAX) * 2;
    const swing = Math.sin(state.trail[j]);
    if ((swing < 0) !== near) {
      continue;
    }
    const age = (i + 1) / state.trailCount;
    const reach = view.r * Math.cos(state.trail[j + 1]);
    const sx = view.cx + reach * Math.cos(state.trail[j]);
    const sy = view.cy - reach * swing * CAM_FOOT;
    context.beginPath();
    context.arc(sx, sy, 0.6 + age * 2.2, 0, TAU);
    context.fillStyle = `rgba(243, 192, 74, ${age * age * 0.5})`;
    context.fill();
  }
}

function paintCoin(context: CanvasRenderingContext2D, view: View, state: State): void {
  const ca = Math.cos(state.alpha);
  const sa = Math.sin(state.alpha);
  const cp = Math.cos(state.phase);
  const sp = Math.sin(state.phase);
  const r = view.r;

  rimPath(context, view, state, true, 1);
  context.fillStyle = 'rgba(3, 4, 7, 0.55)';
  context.fill();

  const lowX = view.cx + r * ca * cp;
  const lowY = view.cy - r * ca * sp * CAM_FOOT;
  const highX = view.cx - r * ca * cp;
  const highY = view.cy + r * ca * sp * CAM_FOOT - 2 * r * sa * CAM_RISE;
  const face = context.createLinearGradient(highX, highY, lowX, lowY);
  face.addColorStop(0, '#fce6ab');
  face.addColorStop(0.5, COIN_EDGE);
  face.addColorStop(1, COIN_DARK);

  context.lineJoin = 'round';
  rimPath(context, view, state, false, 1);
  context.fillStyle = face;
  context.fill();
  context.lineWidth = 2;
  context.strokeStyle = 'rgba(255, 245, 222, 0.5)';
  context.stroke();

  rimPath(context, view, state, false, 0.62);
  context.lineWidth = 1;
  context.strokeStyle = 'rgba(74, 55, 18, 0.5)';
  context.stroke();

  if (!state.settled) {
    context.beginPath();
    context.arc(lowX, lowY, 3, 0, TAU);
    context.fillStyle = '#fff6de';
    context.fill();
  }
}

/** `compact` is the 298x240 catalogue card: the same coin and the same solver, with the
 *  copy cut to one line along the bottom edge and the plate given the middle of the box.
 *  Presentation only — see `euler-disk-spinner.css`. */
export type EulerDiskSpinnerProps = { compact?: boolean };

export function EulerDiskSpinner({ compact = false }: EulerDiskSpinnerProps) {
  const reduced = useReducedMotion();
  const uid = useId();
  const statusId = `${uid}-status`;
  const sim = useRef<State | null>(null);
  const kicks = useRef(0);
  const statusRef = useRef<HTMLParagraphElement | null>(null);
  const meterRef = useRef<HTMLDivElement | null>(null);
  const fillRef = useRef<HTMLSpanElement | null>(null);
  const pctRef = useRef<HTMLSpanElement | null>(null);
  const rateRef = useRef<HTMLSpanElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  // The run outlives setup deliberately. setup re-runs on every resize, and building the state
  // there would restart the job under the reader each time the pane changes width.
  const setup: (c: SceneSetupContext) => State = () => {
    const existing = sim.current;
    if (existing) {
      return existing;
    }
    const state: State = {
      clock: 0, carry: 0, alpha: ALPHA_START, omega: constraintOmega(ALPHA_START), phase: 0,
      settled: false, sinceSample: 0, trail: new Float64Array(TRAIL_MAX * 2), trailHead: 0,
      trailCount: 0, pctShown: -1, rateShown: -1, settleShown: false, kickSeen: kicks.current,
      wasDown: false,
    };
    if (reduced) {
      state.alpha = 0;
      state.omega = 0;
      state.settled = true;
    } else {
      warm(state, WARM_SECONDS);
    }
    state.settleShown = !state.settled;
    sim.current = state;
    return state;
  };

  // Percentage is the energy already gone, 1 - sin(alpha)/sin(alpha_0), so the readout accelerates
  // because the dissipation does. Written straight to the DOM: setState per frame would re-run setup.
  const syncReadouts = (state: State) => {
    const pct = state.settled
      ? 100
      : Math.max(0, Math.min(99, Math.round((1 - Math.sin(state.alpha) / SIN_START) * 100)));
    if (pct !== state.pctShown) {
      state.pctShown = pct;
      setText(pctRef.current, `${pct}%`);
      if (fillRef.current) {
        fillRef.current.style.width = `${pct}%`;
      }
      meterRef.current?.setAttribute('aria-valuenow', String(pct));
    }
    if (state.settleShown !== state.settled) {
      state.settleShown = state.settled;
      state.rateShown = -1;
      setText(statusRef.current, state.settled ? 'Bundle ready' : 'Compiling template bundle');
      setText(buttonRef.current, state.settled ? 'Spin it up again' : 'Add energy');
    }
    const hz = state.omega / TAU;
    if (Math.abs(hz - state.rateShown) >= 0.05 && rateRef.current) {
      state.rateShown = hz;
      setText(rateRef.current, state.settled ? 'at rest' : `${hz.toFixed(1)} Hz rattle`);
    }
  };

  const draw = ({ context, width, height, state, pointer }: SceneDrawContext<State>) => {
    if (!context) {
      return;
    }
    const now = performance.now() / 1000;
    const dt = state.clock === 0 ? 0 : Math.min(0.05, now - state.clock);
    state.clock = now;

    if (reduced) {
      state.alpha = 0;
      state.omega = 0;
      state.settled = true;
      state.trailCount = 0;
    } else {
      const press = pointer.down && pointer.inside;
      if ((press && !state.wasDown) || kicks.current !== state.kickSeen) {
        kick(state);
      }
      state.wasDown = press;
      state.kickSeen = kicks.current;
      state.carry += dt;
      let n = 0;
      while (state.carry >= STEP && n < MAX_SUBSTEPS) {
        advance(state);
        state.carry -= STEP;
        n += 1;
      }
      if (n === MAX_SUBSTEPS) {
        state.carry = 0;
      }
    }

    const view = viewFor(width, height);
    context.clearRect(0, 0, width, height);
    paintPlate(context, view, state);
    paintTrail(context, view, state, false);
    paintCoin(context, view, state);
    paintTrail(context, view, state, true);
    syncReadouts(state);
  };

  const { stageRef, canvasRef, requestRender } = useCanvasScene<State>({ setup, draw });
  useEffect(() => requestRender(), [reduced, requestRender]);

  // Keyboard and pointer arrive here by the same route: the button's click. A press on the plate
  // itself is picked up from the pointer edge inside draw.
  const spin = () => {
    kicks.current += 1;
    requestRender();
  };

  return (
    <div className="euler-disk-spinner-stage" data-compact={compact ? 'true' : undefined}>
      <div ref={stageRef} className="euler-disk-spinner-surface">
        <canvas ref={canvasRef} aria-hidden="true" />
      </div>
      <div className="euler-disk-spinner-content">
        <div className="euler-disk-spinner-card">
          <p ref={statusRef} id={statusId} className="euler-disk-spinner-status" role="status">
            {reduced ? 'Bundle ready' : 'Compiling template bundle'}
          </p>
          <p className="euler-disk-spinner-detail">
            24 registry items, one lockfile, no network. The coin holds the work that is left.
          </p>
          <div
            ref={meterRef}
            className="euler-disk-spinner-meter"
            role="progressbar"
            aria-labelledby={statusId}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={reduced ? 100 : 0}
          >
            <span ref={fillRef} className="euler-disk-spinner-fill" />
          </div>
          <div className="euler-disk-spinner-row">
            <span ref={pctRef} className="euler-disk-spinner-pct">
              {reduced ? '100%' : '0%'}
            </span>
            <span ref={rateRef} className="euler-disk-spinner-rate" aria-hidden="true">
              {reduced ? 'at rest' : '1.1 Hz rattle'}
            </span>
          </div>
          <button
            ref={buttonRef}
            type="button"
            className="euler-disk-spinner-button"
            disabled={reduced}
            // The card frame is aria-hidden, so inside it the button leaves the tab order.
            // It stays clickable — only the keyboard path is withdrawn.
            tabIndex={compact ? -1 : undefined}
            onClick={spin}
          >
            {reduced ? 'Spin it up again' : 'Add energy'}
          </button>
        </div>
      </div>
      <p className="euler-disk-spinner-hint">press to spin it up</p>
    </div>
  );
}

export default EulerDiskSpinner;
