'use client';

import './detent-slider.css';

import { useEffect, useRef, useState, type KeyboardEvent } from 'react';

import {
  useCanvasScene,
  useReducedMotion,
  type SceneDrawContext,
  type SceneSetupContext,
} from '@/hooks/use-canvas-scene';

/**
 * A stepped slider whose steps are a mechanism rather than a rounding.
 *
 * The value is carried by a spring-preloaded ball riding a scalloped rail. The rail
 * is y(x) = −A·cos(2πx/p). The ball is pressed into it by a preload N. The only
 * force that moves the carriage along the track is the component of that load along
 * whichever piece of surface the ball happens to be sitting on, which is the slope
 * of the profile there — so the entire mechanism is two lines:
 *
 *     s(x) = dy/dx = A·(2π/p)·sin(2πx/p)
 *     m·ẍ  = F_hand − N·s(x)/√(1 + s²) − c·ẋ
 *
 * integrated at a fixed 1/240 s.
 *
 * This is not a `snapPoints` array with an ease onto the nearest entry, and it is not
 * a spring pulled toward Math.round(value). Both of those are strongest at the
 * boundary between two steps. This one is zero there — sin(π) = 0 — so the crest of a
 * scallop is an equilibrium, an unstable one, and crossing it is an over-centre event
 * rather than a threshold being passed. Three things follow that no array of stops
 * can be made to do:
 *
 *   · Let go just short of a crest and the rail pulls the handle back down into the
 *     notch it came from, ringing at that notch's own frequency, (2π/p)·√(N·A/m).
 *     A rounding has already committed to the far step by then.
 *   · A flick spends ½mv² on crests. Each one costs about 2·N·A — exactly, it is the
 *     tangential force integrated over half a pitch, a shade under 2NA because of the
 *     √(1 + s²) — and the drag takes its share too. So how many steps a flick crosses
 *     is a continuous function of how hard it was flicked, and the same flick always
 *     crosses the same number of them.
 *   · Hold the handle on a crest and it balances there, between two values, with the
 *     readout still on the one it came from because nothing has committed. Let go and
 *     it falls — slowly, then all at once, because a departure from an unstable
 *     equilibrium grows as e^(t/τ) with τ fixed and the head start not.
 *
 * The handle is a real role="slider", and the arrow keys hand the ball an impulse
 * instead of assigning a value, so the keyboard crosses the same crest the pointer
 * does and can be watched doing it.
 */

/** Seconds per solver step. The preload is stiff; at 1/120 a crossing loses a pixel. */
const STEP = 1 / 240;
/** Steps per frame, capped. Twelve is 50ms, the same clamp `elapsed` gets, so a slow
 *  frame is integrated in full rather than quietly losing time. */
const MAX_STEPS = 12;
/** Notches on the rail. Seven leaves room for a flick to cross three and still stop. */
const NOTCHES = 7;
/** The value at each notch. Consecutive, so aria-valuemin/max describe the range. */
const VALUES = [2, 3, 4, 5, 6, 7, 8];
/** The notch it starts in: mid-rail, so both directions are one flick away. */
const START = 3;
/** Scallop amplitude as a fraction of the pitch, so the steepest slope is 2π·0.1 =
 *  0.63 on any card width and the floor-to-crest rise is a fifth of a pitch. */
const SCALLOP = 0.1;
/** Preload on the ball, px/s² at unit mass. Sets the toll per crest (≈2NA) and the notch
 *  frequency with it: (2π/p)·√(N·A/m) is 21.5 rad/s, 3.4 Hz, on the 308px rail this card
 *  gives it — about as slow as a notch can ring before it reads as a bounce. */
const PRELOAD = 6000;
/** The ball's mass. One, so a force is an acceleration and ½mv² is ½v². */
const MASS = 1;
/** Viscous drag. ζ ≈ 0.23 at the notch frequency: heavier and a flick's energy goes
 *  into drag instead of into crests, lighter and the ball rattles for two seconds. */
const DRAG = 10;
/** Hand spring, px/s² per px of lead. Soft enough that a crest visibly holds the
 *  handle three pixels behind a steady drag, stiff enough to beat the crest's own
 *  negative stiffness (N·A·(2π/p)² ≈ 460) so the handle can be balanced up there. */
const HAND = 1000;
/** Damping on the hand's speed relative to the ball's rather than on the ball's own,
 *  so the grip settles a grab without bleeding a fast drag — a flick still lets go at
 *  the speed the pointer had. */
const GRIP = 40;
/** How near the handle in x a press has to land to take hold of it, px. */
const REACH = 30;
/** Arrow-key impulse, as a multiple of √(2·barrier/m) — the speed that just clears one
 *  crest with no drag at all. 1.9 clears exactly one at every track length this card
 *  can have; 1.6 fails to cross on a wide one, 2.4 crosses two on a narrow one. */
const KICK = 1.9;
/** Home and End, as a multiple of the same escape speed. What bounds this is not the
 *  crests — six of them take under 5% of the energy — it is the drag: a shove of v₀ glides
 *  v₀/c before it dies, and 6·1.9·√(2B)/DRAG is 400px on the 308px rail this card can have
 *  at its widest. The end stop is inelastic, so the surplus is absorbed rather than
 *  bounced back over the last crest, which is why the ends need no special case. */
const SWEEP = KICK * 6;
/** Pitches past a crest before the readout commits to the next notch. Without it a
 *  handle balanced on a crest rewrites aria-valuenow every frame. */
const SEAT_HYST = 0.04;
/** Room under the track for the tick marks and their labels, px. */
const SKIRT = 40;
/** Two colours. The tint is the accent under a tenth of an alpha. */
const INK = '234, 243, 255';
const ACCENT = '158, 205, 255';
const TAU = Math.PI * 2;

interface DetentState {
  /** Track geometry. Rebuilt on resize, never mutated after. */
  readonly x0: number;
  readonly railY: number;
  readonly pitch: number;
  readonly amp: number;
  readonly span: number;
  /** What one crest costs: the tangential force integrated over half a pitch. */
  readonly barrier: number;
  /** The ball along the rail, 0 at the first notch. This is where the value lives. */
  x: number;
  v: number;
  /** The hand at the last integrated step, so the next frame can walk it forward. */
  hand: number;
  /** Ball minus pointer at the moment of the grab, so taking hold does not jump it. */
  grab: number;
  held: boolean;
  /** The notch the readout has committed to. The only thing published to React. */
  seat: number;
  carry: number;
  clock: number;
  /** Seat the ball and skip the solver. Set under `prefers-reduced-motion`, where the
   *  loop never runs and a ball advancing one accumulator per repaint never arrives. */
  snap: boolean;
  /** Last handle position written to the DOM, so an unmoved frame writes nothing. */
  postedX: number;
  postedY: number;
}

/** The slope of that rail, and the only thing that moves the carriage. */
function slopeAt(x: number, amp: number, pitch: number): number {
  return ((TAU * amp) / pitch) * Math.sin((TAU * x) / pitch);
}

/** The preload resolved along the surface: N·s/√(1 + s²), signed back toward a floor. */
function tangential(x: number, amp: number, pitch: number): number {
  const s = slopeAt(x, amp, pitch);
  return (-PRELOAD * s) / Math.sqrt(1 + s * s);
}

/**
 * The energy toll of one crest, by Simpson over half a pitch. Twenty-four panels on
 * half a cosine is exact to a part in a billion, and it is computed rather than
 * assumed because the arrow keys have to buy a crossing with it.
 */
function barrierOf(amp: number, pitch: number): number {
  const panels = 24;
  const h = pitch / 2 / panels;
  let sum = 0;
  for (let i = 0; i <= panels; i += 1) {
    const weight = i === 0 || i === panels ? 1 : i % 2 === 1 ? 4 : 2;
    sum += weight * Math.abs(tangential(i * h, amp, pitch));
  }
  return (sum * h) / 3;
}

const clampSeat = (notch: number): number => Math.max(0, Math.min(NOTCHES - 1, notch));

/** One fixed step of m·ẍ = F_hand + F_tan − c·ẋ, semi-implicit Euler. */
function advance(state: DetentState, hand: number, handVel: number): void {
  let force = tangential(state.x, state.amp, state.pitch) - DRAG * state.v;
  if (state.held) force += HAND * (hand - state.x) + GRIP * (handVel - state.v);
  state.v += (force / MASS) * STEP;
  state.x += state.v * STEP;

  /*
   * Both end stops land on a notch floor, and they are inelastic. A carriage that has
   * hit its stop does not come back off it, and a bounce here could re-cross the last
   * crest and settle one short of the end the flick plainly asked for.
   */
  if (state.x <= 0) {
    state.x = 0;
    if (state.v < 0) state.v = 0;
  } else if (state.x >= state.span) {
    state.x = state.span;
    if (state.v > 0) state.v = 0;
  }
}

/**
 * Which notch the readout is in. The hysteresis is in the label only — the solver has
 * never heard of it — and it is what keeps a handle balanced on a crest from flipping
 * between two values at frame rate while it makes its mind up.
 */
function reseat(state: DetentState): void {
  const pitches = state.x / state.pitch;
  if (Math.abs(pitches - state.seat) > 0.5 + SEAT_HYST) {
    state.seat = clampSeat(Math.round(pitches));
  }
}

function build({ width, height }: SceneSetupContext, seat: number, snap: boolean): DetentState {
  // The inset has to clear the handle's own half-width and the two end tick labels.
  const inset = Math.min(30, width * 0.14);
  const span = Math.max(NOTCHES - 1, width - inset * 2);
  const pitch = span / (NOTCHES - 1);
  const amp = SCALLOP * pitch;

  return {
    x0: inset,
    // Half the handle plus its focus ring is all the clearance the track needs above it.
    railY: Math.max(16, height - SKIRT),
    pitch,
    amp,
    span,
    barrier: barrierOf(amp, pitch),
    // Setup re-runs on resize and the pitch changes with it, so the ball is placed by
    // the notch it was in rather than by the pixel it was at.
    x: seat * pitch,
    v: 0,
    hand: seat * pitch,
    grab: 0,
    held: false,
    seat,
    carry: 0,
    clock: 0,
    snap,
    postedX: Number.NaN,
    postedY: Number.NaN,
  };
}

/** Advance the mechanism to now, then paint it. */
function paint({ context, width, height, state, pointer }: SceneDrawContext<DetentState>) {
  const now = performance.now();
  const elapsed = state.clock ? Math.min(0.05, (now - state.clock) / 1000) : STEP;
  state.clock = now;

  /*
   * Take hold on a press that lands in the handle's column, and keep it until the
   * press ends. The grab is not re-tested while held, so a drag that runs off the card
   * — which is where a hard flick naturally ends up — keeps the handle.
   */
  if (!pointer.down) state.held = false;
  else if (!state.held && pointer.inside && Math.abs(pointer.x - (state.x0 + state.x)) < REACH) {
    state.held = true;
    state.hand = state.x;
    state.grab = state.x - (pointer.x - state.x0);
  }

  const demand = Math.max(0, Math.min(state.span, pointer.x - state.x0 + state.grab));

  if (state.snap) {
    // The answer instead of the route to it: the ball is placed in a notch and the
    // rail is never integrated, because with the loop stopped it would never arrive.
    if (state.held) state.seat = clampSeat(Math.round(demand / state.pitch));
    state.x = state.seat * state.pitch;
    state.v = 0;
    state.hand = state.x;
    state.carry = 0;
  } else {
    state.carry += elapsed;
    const count = Math.min(MAX_STEPS, Math.floor(state.carry / STEP));
    /*
     * The hand is walked across the substeps rather than teleported to this frame's
     * pointer, and the velocity handed to the grip damper is the one that walk
     * actually has. That is the number a flick leaves in the ball, so it has to be the
     * pointer's real speed and not a per-frame difference divided by a nominal step.
     */
    const from = state.hand;
    const handVel = count > 0 ? (demand - from) / (count * STEP) : 0;
    for (let i = 1; i <= count; i += 1) {
      advance(state, from + ((demand - from) * i) / count, handVel);
    }
    if (count > 0) {
      state.hand = demand;
      state.carry -= count * STEP;
    }
    if (state.carry > STEP * MAX_STEPS) state.carry = 0;
    reseat(state);
  }

  context.clearRect(0, 0, width, height);
  context.lineCap = 'round';
  context.lineJoin = 'round';

  // The track, from the first notch to the last: the whole travel and nothing past it.
  context.lineWidth = 4;
  context.strokeStyle = `rgba(${INK}, 0.12)`;
  context.beginPath();
  context.moveTo(state.x0, state.railY);
  context.lineTo(state.x0 + state.span, state.railY);
  context.stroke();

  // The travelled part of it, filled to wherever the value has got to.
  context.strokeStyle = `rgba(${ACCENT}, 0.82)`;
  context.shadowColor = `rgba(${ACCENT}, 0.32)`;
  context.shadowBlur = 14;
  context.beginPath();
  context.moveTo(state.x0, state.railY);
  context.lineTo(state.x0 + state.x, state.railY);
  context.stroke();
  context.shadowBlur = 0;

  /*
   * Ticks and their values, placed at the solver's own notch positions rather than at
   * even fractions of the width — the two agree here, and they have to be drawn from the
   * same number or a resize would put the labels somewhere the handle cannot stop.
   */
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.font = '500 11px ui-monospace, "SFMono-Regular", Menlo, monospace';
  for (let i = 0; i < NOTCHES; i += 1) {
    const tx = state.x0 + i * state.pitch;
    const seated = i === state.seat;
    context.fillStyle = seated ? `rgba(${ACCENT}, 0.85)` : `rgba(${INK}, 0.26)`;
    context.fillRect(tx - 0.5, state.railY + 19, 1, seated ? 7 : 4);
    context.fillStyle = seated ? `rgba(${ACCENT}, 0.95)` : `rgba(${INK}, 0.32)`;
    context.fillText(String(VALUES[i]), tx, state.railY + 33);
  }
}

/**
 * Put the DOM handle where the solver says the value is. The transform is written from the
 * same `x0 + x` the canvas fills the track to, so the two cannot drift; a CSS `left`
 * matched by hand to a canvas constant drifts the moment either changes. Skipped under
 * half a pixel of movement, because writing a transform costs a layer update whether or
 * not the value differs.
 */
function place(node: HTMLElement | null, state: DetentState): void {
  if (!node) return;
  const x = state.x0 + state.x;
  const y = state.railY;
  if (Math.abs(x - state.postedX) < 0.4 && Math.abs(y - state.postedY) < 0.4) return;
  // The handle has no position until the solver has been asked for one, so it starts
  // transparent rather than in the corner. Opacity and not `visibility`, which would take
  // the slider out of the accessibility tree for as long as it took to place it.
  if (Number.isNaN(state.postedX)) node.style.opacity = '1';
  state.postedX = x;
  state.postedY = y;
  node.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) translate(-50%, -50%)`;
}

/**
 * A settings card whose one control is the mechanism above.
 *
 * The canvas layer takes every pointer event, so the readout and the handle sit over it in
 * a sibling layer that is transparent to the pointer. The handle is still the real
 * `role="slider"`: a press anywhere on the card hands it focus, so the keyboard reaches
 * the same control the mouse is dragging.
 */
/** `compact` is the 298x240 catalogue card: the same rail and the same reading, with the
 *  explanatory paragraph and the hint dropped. The rail is laid out from the measured
 *  canvas box, so the detent solve is unchanged — see `detent-slider.css`. */
export type DetentSliderProps = { compact?: boolean };

export function DetentSlider({ compact = false }: DetentSliderProps) {
  const reduced = useReducedMotion();
  const [value, setValue] = useState(VALUES[START]);
  /** The notch the solver last settled on, so `draw` only touches React when it changes. */
  const seatRef = useRef(START);
  const handleRef = useRef<HTMLDivElement>(null);
  /**
   * A keypress leaves its request here for the next step to take, rather than reaching
   * into the solver from an event handler: the impulse has to be applied inside the fixed
   * step or it is an impulse of some unknown fraction of one.
   */
  const pendingRef = useRef<{ kick: number; seat: number } | null>(null);

  const draw = (scene: SceneDrawContext<DetentState>) => {
    const { state } = scene;
    state.snap = reduced;

    const pending = pendingRef.current;
    if (pending) {
      pendingRef.current = null;
      // With the loop stopped an impulse would never be integrated, so under reduced
      // motion the key moves the notch instead. Everywhere else it is a shove on the ball
      // and the rail decides where that lands — which is why a key can be watched
      // crossing a crest, and can fail to.
      if (reduced) state.seat = clampSeat(pending.seat);
      else state.v += pending.kick * Math.sqrt((2 * state.barrier) / MASS);
    }

    paint(scene);
    place(handleRef.current, state);

    if (state.seat !== seatRef.current) {
      seatRef.current = state.seat;
      setValue(VALUES[state.seat]);
    }
  };

  const { stageRef, canvasRef, requestRender } = useCanvasScene<DetentState>({
    setup: (scene) => build(scene, seatRef.current, reduced),
    draw,
  });

  // The readout is React and the ball is not, so a change of value — or of the motion
  // preference, which stops the loop outright — has to ask for the one repaint that keeps
  // the canvas showing the same notch the label does.
  useEffect(() => {
    requestRender();
  }, [value, reduced, requestRender]);

  /**
   * Arrow keys hand the ball an impulse; Home and End hand it a bigger one. Nothing here
   * assigns a value, so a key can be watched crossing a crest — and the readout changes
   * when the ball has actually arrived, not when the key was pressed.
   */
  const handleKey = (event: KeyboardEvent<HTMLDivElement>) => {
    const seat = seatRef.current;
    if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
      pendingRef.current = { kick: KICK, seat: seat + 1 };
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
      pendingRef.current = { kick: -KICK, seat: seat - 1 };
    } else if (event.key === 'End') {
      pendingRef.current = { kick: SWEEP, seat: NOTCHES - 1 };
    } else if (event.key === 'Home') {
      pendingRef.current = { kick: -SWEEP, seat: 0 };
    } else {
      return;
    }
    event.preventDefault();
    requestRender();
  };

  return (
    // The handle is transparent to the pointer so the canvas keeps the press and the
    // capture with it; without this the control could only ever be reached by Tab. In a
    // card there is nothing to hand focus to — the whole frame is aria-hidden — so the
    // press is left to the canvas alone.
    <div
      className="detent-slider-stage"
      data-compact={compact ? 'true' : undefined}
      onPointerDown={
        compact ? undefined : () => handleRef.current?.focus({ preventScroll: true })
      }
    >
      <div className="detent-slider-card">
        <div ref={stageRef} className="detent-slider-well" aria-hidden="true">
          <canvas ref={canvasRef} />
        </div>

        <div className="detent-slider-face">
          <p className="detent-slider-label">Grid columns</p>
          <p className="detent-slider-read">
            {value}
            <span className="detent-slider-unit">columns</span>
          </p>
          <p className="detent-slider-copy">
            Sets how many columns the grid lays out. Cards resize to fill the row, so fewer
            columns means larger cards.
          </p>
        </div>

        <div
          ref={handleRef}
          className="detent-slider-handle"
          role="slider"
          tabIndex={compact ? -1 : 0}
          aria-label="Grid columns"
          aria-valuemin={VALUES[0]}
          aria-valuemax={VALUES[NOTCHES - 1]}
          aria-valuenow={value}
          aria-valuetext={`${value} columns`}
          onKeyDown={handleKey}
        />
      </div>

      <p className="detent-slider-hint">Drag the handle, or flick it</p>
    </div>
  );
}

export default DetentSlider;
