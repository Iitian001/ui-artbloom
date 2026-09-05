'use client';

import './snap-toggle.css';

import { useCallback, useEffect, useId, useRef, useState } from 'react';

import {
  useCanvasScene,
  useReducedMotion,
  type SceneDrawContext,
  type SceneSetupContext,
} from '@/hooks/use-canvas-scene';

/**
 * A toggle switch whose two states are the two wells of a von Mises truss.
 *
 * Two pin-jointed bars of unstretched length L₀ meet at the knob, and the knob is
 * pinned to a slide running between supports 2b apart. Because L₀ > b the pair can
 * never lie straight — it is held buckled — so the strain energy
 *
 *   U(y) = k·(√(b² + y²) − L₀)²
 *
 * is zero at each of y = ±√(L₀² − b²), where the bars are the length they want to
 * be, and k·(L₀ − b)² in the middle, where both are squeezed. Off and on are those
 * two minima. What runs is m ÿ = −dU/dy − c ẏ + F_finger, semi-implicit Euler at a
 * fixed 1/240 s, and the barrier between the wells is the only reason this control
 * has two states instead of a number between them.
 *
 * It is not an eased transition, and it is not a spring with a stiffness bump. A
 * spring has one equilibrium: let it go anywhere and it returns to the same place.
 * A keyframe has as many equilibria as its state variable has values, and it is
 * that variable — set the instant you let go — which decides where the pixels are
 * heading. Nothing here decides. No line in this file tests which way the knob
 * should go: it goes downhill, and which hill it is on is a matter of a fraction of
 * a pixel either side of the crest.
 *
 * That is watchable, and it is the whole claim. Let the knob go a hair past the
 * crest and it hangs for a third of a second before it moves, because the crest is
 * an equilibrium and the force at an equilibrium is zero; let it go six pixels
 * further along and the same trip takes 130 ms. Both arrive at the far side at
 * 240 px/s, within a percent of each other, because the arrival speed is √(2ΔU/m)
 * — read off the barrier, and not off a duration anybody chose. So the throw is the
 * release rather than a transition: a drag that stops short of the crest is pulled
 * back by the strut instead of animated back, a drag that stops on the crest stays
 * there balanced for as long as you hold it, and a press spends an impulse, so
 * Space has to clear the same barrier your finger does. Nothing eases anywhere.
 */

/** Seconds a sub-step advances. The barrier is stiff: at 1/120 the snap changes shape. */
const STEP = 1 / 240;
/** Half the distance between the two supports, in mechanism units. */
const SPAN = 48;
/** Unstretched bar length. Longer than the half-span is the whole trick: it is why
 *  the pair cannot lie flat, and so why there are two states and not a slider. */
const BAR = 60;
/** The wells, ±√(BAR² − SPAN²). 36-48-60 is a 3-4-5 triangle, so this is exactly 36. */
const WELL = Math.sqrt(BAR * BAR - SPAN * SPAN);
/** The housing wall. A fifth past the well: room for the ring, none for a hurl. */
const LIMIT = 44;
/** Axial stiffness of the pair. Puts the well at 4.7 Hz — slow enough that the
 *  crossing is something you watch rather than something that happened. */
const K = 1200;
/** Viscous damping. ζ = 0.28 at the well, so the knob passes its detent by six units
 *  and is still inside 600 ms; twice this and it crawls off the crest instead of
 *  snapping off it. */
const C = 16.5;
/** Mass at the apex. One, so K and C read per unit mass and the loop below can be
 *  the equation the comment above names, with nothing scaled out of sight. */
const MASS = 1;
/** The impulse a press spends, in units per second. Clearing the barrier from rest
 *  takes 1011, so this is 29% over: enough to beat a ring already heading the other
 *  way, and short of banging the housing. */
const KICK = 1300;
/** Stiffness of the hand's hold on the knob. The strut's peak resistance up the
 *  barrier is 7400, so the knob trails the pointer by 2.5 units on the climb and
 *  catches up on the way down — the load is visible in the lag. */
const GRAB = 3000;
/** Damping in that hold: a fingertip is a pad, not a hook. Without it, taking hold
 *  of a moving knob rings it about the pointer at 8 Hz. */
const GRAB_DAMP = 55;
/** How near the knob a press has to land to take hold of it, in pixels. */
const REACH = 26;
/** Pointer travel that still counts as a press rather than a drag, in pixels. */
const TAP = 5;
/** Units off centre before a crossing is published. Nearer than this the sign of y
 *  is noise, and `aria-checked` would chatter every time the strut sat on the crest. */
const REPORT = 6;
/** Gap between knob and track wall, in pixels. Sets the knob radius and with it how
 *  many pixels one mechanism unit is worth. */
const RAIL = 4;
/** The switch's CSS box, mirrored here only as the first frame's fallback: the real
 *  one is measured as soon as the layout effect has run. */
const BOX = { w: 104, h: 40 };
/** The two rows under the live one. Furniture — the argument is that this is a
 *  settings row and not an exhibit, and one row alone does not make a settings list. */
const ROWS = [
  { id: 'reports', name: 'Crash reports', note: 'Set by your organisation.', on: true },
  { id: 'beta', name: 'Beta channel', note: 'Locked to the stable channel.', on: false },
];
/** 0…1. A tint outside that is a paint bug, not a state. */
const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

/**
 * What React writes and the scene reads. The scene state is built inside the hook,
 * so a click handler has no way to reach it; this ref is the whole channel between
 * the two, and it carries exactly two things.
 */
interface Bridge {
  /** The switch's box, in canvas pixels. Measured, never assumed. */
  track: Box;
  /** An impulse waiting to be spent. Set by a press, cleared by the next frame. */
  press: number;
}

interface TrussState {
  readonly bridge: { readonly current: Bridge };
  /** Apex position along the slide, in mechanism units. With v, the entire state. */
  y: number;
  v: number;
  /** Which well the component has been told about, −1 or 1. */
  side: number;
  /** Set when y crosses the crest. The component reads it and clears it. */
  flipped: boolean;
  held: boolean;
  /** Where the hand is, in mechanism units. Only read while held. */
  hold: number;
  /** Pointer travel since the press, in pixels, so a tap can be told from a drag. */
  travel: number;
  carry: number;
  clock: number;
  /** The switch's React value, for the reduced-motion seat. */
  on: boolean;
  /** Seat the strut in its well and skip the solver. Set under reduced motion, where
   *  the loop never starts and a strut integrating one step per repaint would hang
   *  somewhere between the two states for as long as the page stayed still. */
  snap: boolean;
}

/** −dU/dy: the axial force in the two bars, resolved along the slide. */
function force(y: number) {
  const length = Math.hypot(SPAN, y);
  return (-2 * K * (length - BAR) * y) / length;
}

/** The strut at rest in the well `on` names — the answer, not a step toward it. */
function seat(state: TrussState, on: boolean) {
  state.y = on ? WELL : -WELL;
  state.v = 0;
  state.side = on ? 1 : -1;
  state.held = false;
}

function advance(state: TrussState) {
  let load = force(state.y);
  let damp = C;
  if (state.held) {
    load += GRAB * (state.hold - state.y);
    damp += GRAB_DAMP;
  }
  /*
   * Semi-implicit: the force is read at the old position, but the damping is solved
   * for the new velocity instead of added to it. Explicit damping at GRAB_DAMP needs
   * a step under 2/55 s to stay bounded and buzzes long before that, so this form is
   * what lets the hand hold the knob as hard as it likes.
   */
  state.v = (state.v + (load / MASS) * STEP) / (1 + (damp / MASS) * STEP);
  state.y += state.v * STEP;

  // The pill is moulded plastic: a wall, not a bumper. Only a hurled flick gets
  // here, and what a wall does is stop it.
  if (Math.abs(state.y) > LIMIT) {
    state.y = state.y > 0 ? LIMIT : -LIMIT;
    state.v = 0;
  }

  // The state is read off the sign of y, so a drag, a press and the keyboard all
  // publish through the same line: none of them can set it without moving the strut.
  const side = state.y > 0 ? 1 : -1;
  if (side !== state.side && Math.abs(state.y) > REPORT) {
    state.side = side;
    state.flipped = true;
  }
}

function build(
  { width, height }: SceneSetupContext,
  bridge: { current: Bridge },
  on: boolean,
): TrussState {
  // The first frame is painted before the layout effect has measured anything, so
  // the fallback box lives here: a resize re-runs setup and keeps the real one.
  if (bridge.current.track.w === 0) {
    bridge.current.track = {
      x: (width - BOX.w) / 2,
      y: height * 0.22,
      w: BOX.w,
      h: BOX.h,
    };
  }
  const state: TrussState = {
    bridge,
    y: 0,
    v: 0,
    side: 1,
    flipped: false,
    held: false,
    hold: 0,
    travel: 0,
    carry: 0,
    clock: 0,
    on,
    snap: false,
  };
  // Starting in a well is the honest initial condition: the switch was already in
  // this state before the component mounted, and a strut at rest sits at a minimum.
  seat(state, on);
  return state;
}

interface Frame {
  cx: number;
  cy: number;
  knobR: number;
  /** Pixels per mechanism unit. */
  scale: number;
}

/**
 * The drawing frame, derived from the box the layout gave the switch. The knob has to
 * reach the housing wall exactly at the inside of the pill, so the scale follows the
 * measured box and not the other way round — the mechanism has no opinion about rem.
 */
function frameOf(track: Box): Frame {
  const half = track.w / 2;
  const knobR = Math.max(4, track.h / 2 - RAIL);
  return {
    cx: track.x + half,
    cy: track.y + track.h / 2,
    knobR,
    scale: (half - RAIL - knobR) / LIMIT,
  };
}

/** A pill path by hand, because `context.roundRect` moves between DOM library
 *  versions and this file is meant to compile in whichever one the consumer has. */
function pill(context: CanvasRenderingContext2D, box: Box) {
  const r = box.h / 2;
  context.beginPath();
  context.moveTo(box.x + r, box.y);
  context.lineTo(box.x + box.w - r, box.y);
  context.arc(box.x + box.w - r, box.y + r, r, -Math.PI / 2, Math.PI / 2);
  context.lineTo(box.x + r, box.y + box.h);
  context.arc(box.x + r, box.y + r, r, Math.PI / 2, (Math.PI * 3) / 2);
  context.closePath();
}

function drawSwitch(
  context: CanvasRenderingContext2D,
  state: TrussState,
  track: Box,
  geom: Frame,
) {
  const { cx, cy, knobR, scale } = geom;
  const apex = cx + state.y * scale;
  // 0 off, 1 on, continuous — the tint follows the knob's position and nothing else, so
  // the track is half lit when the knob is halfway across, and waits there with it.
  const lit = clamp01(state.y / WELL / 2 + 0.5);

  pill(context, track);
  context.fillStyle = 'rgba(6,10,18,0.72)';
  context.fill();
  context.fillStyle = `rgba(143,198,255,${0.03 + lit * 0.13})`;
  context.fill();
  context.lineWidth = 1;
  context.strokeStyle = 'rgba(233,241,251,0.1)';
  context.stroke();
  context.strokeStyle = `rgba(143,198,255,${lit * 0.4})`;
  context.stroke();

  // The knob, shaded down its own height so it reads as a cap sitting in the track.
  const glass = context.createLinearGradient(0, cy - knobR, 0, cy + knobR);
  glass.addColorStop(0, 'rgba(233,241,251,0.26)');
  glass.addColorStop(1, 'rgba(233,241,251,0.08)');
  context.beginPath();
  context.arc(apex, cy, knobR, 0, Math.PI * 2);
  context.fillStyle = glass;
  context.fill();
  context.lineWidth = 1.6;
  context.strokeStyle = `rgba(233,241,251,${0.46 + lit * 0.24})`;
  context.stroke();
}

function paint({ context, width, height, state, pointer }: SceneDrawContext<TrussState>) {
  const now = performance.now();
  // Clamped at 50 ms: a backgrounded tab comes back owing seconds, and the strut owes
  // nothing at all for the time nobody was watching it.
  const elapsed = state.clock ? Math.min(0.05, (now - state.clock) / 1000) : STEP;
  state.clock = now;

  const bridge = state.bridge.current;
  const geom = frameOf(bridge.track);

  if (state.snap) {
    seat(state, state.on);
  } else {
    /*
     * Take hold on a press that lands on the knob; let go when the press ends. A press
     * that ends without travelling is a tap, and a tap spends an impulse — which is how
     * a click still works on a control whose pointer events belong to the drag.
     */
    if (!pointer.down) {
      if (state.held) {
        state.held = false;
        if (state.travel < TAP) bridge.press = 1;
      }
    } else if (state.held) {
      state.travel +=
        Math.abs(pointer.x - pointer.lastX) + Math.abs(pointer.y - pointer.lastY);
    } else if (
      geom.scale > 0 &&
      pointer.inside &&
      Math.hypot(pointer.x - (geom.cx + state.y * geom.scale), pointer.y - geom.cy) < REACH
    ) {
      state.held = true;
      state.travel = 0;
    }
    if (state.held && geom.scale > 0) state.hold = (pointer.x - geom.cx) / geom.scale;

    if (bridge.press) {
      bridge.press = 0;
      // Away from the well it is in, and that is all a press does. Whether it arrives
      // is a matter between the impulse and the barrier.
      state.v += state.y >= 0 ? -KICK : KICK;
    }

    state.carry += elapsed;
    let steps = 0;
    // 240 Hz is four sub-steps a frame at 60 fps, so the cap has to clear eight or a
    // display running at 30 would integrate the strut at half speed.
    while (state.carry >= STEP && steps < 16) {
      advance(state);
      state.carry -= STEP;
      steps += 1;
    }
    // Hitting the cap means the frame was late. The arrears are dropped rather than
    // paid back, because paying them back is how a stiff solver detonates.
    if (state.carry > STEP * 16) state.carry = 0;
  }

  context.clearRect(0, 0, width, height);
  if (bridge.track.w > 0) drawSwitch(context, state, bridge.track, geom);
}

/** `compact` is the 298x240 catalogue card: the same truss and the same live row, with
 *  the eyebrow, the two locked rows and the hint dropped. Presentation only — the
 *  geometry is measured off the switch's own box either way, so the mechanism is
 *  unchanged. See `snap-toggle.css`. */
export type SnapToggleProps = { compact?: boolean };

export function SnapToggle({ compact = false }: SnapToggleProps) {
  const [on, setOn] = useState(false);
  const reduced = useReducedMotion();
  // Scoped ids, so two of these on one page do not both claim the same label.
  const uid = useId();
  const card = useRef<HTMLDivElement | null>(null);
  const knob = useRef<HTMLButtonElement | null>(null);
  const bridge = useRef<Bridge>({
    track: { x: 0, y: 0, w: 0, h: 0 },
    press: 0,
  });

  const { stageRef, canvasRef, requestRender } = useCanvasScene<TrussState>({
    setup: (scene) => build(scene, bridge, on),
    draw: (scene) => {
      scene.state.on = on;
      scene.state.snap = reduced;
      paint(scene);
      // The crossing is published by the solver, so `aria-checked` follows the strut
      // and never leads it. Nothing else in this component writes the value.
      if (scene.state.flipped) {
        scene.state.flipped = false;
        setOn(scene.state.side > 0);
      }
    },
  });

  // Under reduced motion the loop never starts, so without this the knob would still
  // be sitting in the well it was told to leave.
  useEffect(() => {
    requestRender();
  }, [on, requestRender]);

  /*
   * The canvas draws inside the box the layout hands it, so the pill lands under its
   * own focus ring at any font size or zoom. Measured against the card because the
   * canvas is `inset: 0` inside it, and the card carries no border for the same reason.
   */
  const measure = useCallback(() => {
    const host = card.current;
    const box = knob.current;
    if (!host || !box) return;
    const origin = host.getBoundingClientRect();
    const rect = box.getBoundingClientRect();
    bridge.current.track = {
      x: rect.left - origin.left,
      y: rect.top - origin.top,
      w: rect.width,
      h: rect.height,
    };
    requestRender();
  }, [requestRender]);

  useEffect(() => {
    const host = card.current;
    const box = knob.current;
    if (!host || !box) return;
    measure();
    // The rows reflow before the card does at a narrow width, so the switch is watched
    // as well: its box is the one the mechanism is scaled from.
    const sizes = new ResizeObserver(measure);
    sizes.observe(host);
    sizes.observe(box);
    return () => sizes.disconnect();
  }, [measure]);

  /*
   * A press is an impulse, not an assignment. It goes into the bridge and the solver
   * spends it against the same barrier a finger has to climb, so Space cannot put the
   * switch anywhere the strut has not been. Under reduced motion there is no solver
   * running to spend it, so the value moves and the strut is re-seated on the answer.
   */
  const press = useCallback(() => {
    if (reduced) {
      setOn((was) => !was);
      return;
    }
    bridge.current.press = 1;
  }, [reduced]);

  return (
    <div className="snap-toggle-stage" data-compact={compact ? 'true' : undefined}>
      <div className="snap-toggle-card" ref={card}>
        <div className="snap-toggle-mech" ref={stageRef} aria-hidden="true">
          <canvas ref={canvasRef} />
        </div>
        <div className="snap-toggle-face">
          <p className="snap-toggle-eyebrow">Editor preferences</p>
          <div className="snap-toggle-row snap-toggle-live">
            <span className="snap-toggle-text">
              <span className="snap-toggle-name" id={`${uid}-autosave`}>
                Autosave
              </span>
              <span className="snap-toggle-note">
                {on ? 'Written to disk as you type.' : 'Changes stay in memory.'}
              </span>
            </span>
            <button
              type="button"
              role="switch"
              className="snap-toggle-switch"
              ref={knob}
              aria-checked={on}
              aria-labelledby={`${uid}-autosave`}
              /* Still pressable in a card, but out of the tab order: the card frame is
                 aria-hidden, and a focusable node inside one is a trap with no label. */
              tabIndex={compact ? -1 : undefined}
              onClick={press}
            />
          </div>
          {ROWS.map((row) => (
            <div className="snap-toggle-row" key={row.id}>
              <span className="snap-toggle-text">
                <span className="snap-toggle-name" id={`${uid}-${row.id}`}>
                  {row.name}
                </span>
                <span className="snap-toggle-note">{row.note}</span>
              </span>
              <button
                type="button"
                role="switch"
                className="snap-toggle-pill"
                aria-checked={row.on}
                aria-labelledby={`${uid}-${row.id}`}
                data-on={row.on}
                disabled
              />
            </div>
          ))}
        </div>
      </div>
      <p className="snap-toggle-hint">Drag the knob, or press it</p>
    </div>
  );
}

export default SnapToggle;
