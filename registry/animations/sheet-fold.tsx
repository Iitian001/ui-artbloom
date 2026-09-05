'use client';

import './sheet-fold.css';

import { useEffect, useId, useRef, useState } from 'react';

import {
  useCanvasScene,
  useReducedMotion,
  type SceneDrawContext,
} from '@/hooks/use-canvas-scene';

/**
 * A settings accordion whose panels are hinged plates falling into a tapered orifice
 * damper — a soft-close hinge, solved.
 *
 * This is not a height transition and there is no eased max-height anywhere in the file.
 * Each row owns one angle and that angle is integrated:
 *
 *   I θ̈ = m g L_c cos θ − sign(θ̇) · C(θ) · θ̇²
 *   C(θ) = DAMPER · r_d³ · cos³θ / A(θ)²
 *
 * The panel's height is L·sin θ, so what a reader sees is the projection of a plate that
 * is genuinely falling. The damping is quadratic because turbulent flow through an
 * orifice obeys Q = C_d·A·√(2Δp/ρ), so Δp goes as Q²; Q here is the piston's displacement
 * rate, which is proportional to θ̇, and that leaves a resisting torque in θ̇² rather than
 * in θ̇.
 *
 * That exponent is the whole point, because a quadratic damper has a terminal velocity:
 * ω_term = √(m g L_c cos θ / C). So the leaf does not ease. It accelerates for the first
 * fifth of the stroke, then holds a rate — within three percent of 3.4 rad/s while the
 * four-line panel travels from 31 px to 77 px of its 99, half its height at one speed —
 * and then the bore's clearance runs out and it chokes to a crawl: the last pixel and a
 * half takes 0.20 s, 29% of the whole stroke. No cubic-bezier traces that, and not for
 * want of control points. A bezier has no plateau, and none is flat in the middle, flat
 * again at the end, and a cliff in between.
 *
 * Two consequences of having solved it rather than tweened it, both checkable.
 *
 * Double SHEET — every leaf twice as heavy, damper untouched — and the stroke shortens by
 * 30%, not by half, because terminal velocity goes as the *square root* of the driving
 * torque. Swap the θ̇² for a θ̇ with the same reference terminal velocity and the same
 * experiment takes 54% off. This is why a real soft-close hinge is sold against a door
 * weight *range* instead of a door weight.
 *
 * And the four rows move at four different rates with nothing configured. Each leaf is as
 * long as its own content measures, and the hinge is bought for its leaf, so the yoke
 * radius goes with it: C carries r_d³ where the driving torque only carries L², so the
 * plateau rate falls as 1/√L. The row with four variables in it sweeps at 3.1 rad/s and
 * takes 0.75 s; the two-line row sweeps at 4.4 rad/s and takes 0.52 s. Open one while
 * another is closing and both are in the air at once, visibly out of step.
 */

/** Seconds per step. A θ̇² term against a closing orifice is stiff at the seat, where C
 *  has climbed three orders; 120 Hz overshoots the stop there, 240 Hz does not. */
const STEP = 1 / 240;

/** Gravity, px/s². Not 9.81 scaled to anything — it is the number that lands a panel of
 *  this size in about half a second, and it also sets how long the leaf spends getting up
 *  to rate (2·L·ω_term / 3G, around 60 ms) rather than travelling at it. */
const G = 3600;

/** The hinge's open stop, radians below horizontal. Not π/2: at dead bottom cos θ is zero,
 *  the gravity torque with it, and the leaf would asymptote toward the stop forever. */
const THETA_OPEN = 1.3;
const SIN_OPEN = Math.sin(THETA_OPEN);

/** The leaf the damper was sized against, px, and the mass of one px of leaf. The sheet is
 *  uniform, so LEAF_REF weighs exactly 1 and is the unit of mass in this file. */
const LEAF_REF = 96;
const SHEET = 1 / LEAF_REF;

/** Yoke radius ÷ leaf length. The pin on the leaf rides a slot in the piston rod, so the
 *  piston sits at depth r_d·sin θ — exactly the panel's height, to scale. Nine percent
 *  because the hinge is bought for its leaf: a longer flap gets a longer crank, a longer
 *  bore and a heavier damper, which is what makes the rows disagree about speed. */
const PINION = 0.09;

/** ρ·A_p³ / (2·C_d²·A_mouth²) with every fixed piston dimension folded in. Quoted rather
 *  than derived from SHEET, deliberately, so that doubling SHEET doubles the leaf without
 *  also doubling its damper. It is m·G·L_c / (ω²·r_d³) at θ = 0 for LEAF_REF at 3.5 rad/s,
 *  which is the rate that leaf holds through its plateau. */
const DAMPER = 21.9;

/** How late the bore chokes, as an exponent on piston depth. A tenth power leaves the
 *  clearance within a percent of its full value for the first half of the stroke and takes
 *  it out inside the last tenth — the latch, which is the part a soft-close is bought for.
 *  Square it and the whole stroke is a slow crawl with no plateau to speak of. */
const CHOKE = 10;

/** Floor on the clearance, as a fraction of its value at the mouth: a machining clearance,
 *  since the skirt never actually touches the wall. Without it C is unbounded at the seat,
 *  ω_term goes to zero and the leaf never arrives. With it the last pixel takes 0.2 s and
 *  then the panel is down. */
const SKIRT = 0.015;

/** Return-spring preload ÷ the leaf's own static torque. The spring is engaged only on the
 *  way up — a soft-close hinge with a spring strong enough to hold the door open is a door
 *  that will not open. 1.9 beats m·G·L_c at every angle with enough left to bring a panel
 *  home in 0.37 to 0.53 s through the same orifice, so closing is quicker than opening but
 *  not by much: the damper, not the drive, is what sets both. */
const LIFT = 1.9;

interface Row {
  name: string;
  value: string;
  body: string;
  vars?: { key: string; note: string }[];
}

const ROWS: Row[] = [
  {
    name: 'Build command',
    value: 'Node 22',
    body: 'next build in a Node 22 image on four vCPU, killed at twelve minutes. Only .next and public are uploaded; the rest of the tree stays on the builder.',
  },
  {
    name: 'Environment variables',
    value: '4 set',
    body: 'Injected at build and again at run. Four are set on this project:',
    vars: [
      { key: 'DATABASE_URL', note: 'encrypted · build + run' },
      { key: 'STRIPE_SECRET', note: 'encrypted · run only' },
      { key: 'NEXT_PUBLIC_CDN', note: 'plain · build + run' },
      { key: 'LOG_LEVEL', note: 'plain · run only' },
    ],
  },
  {
    name: 'Deploy hooks',
    value: '1 active',
    body: 'A POST to the hook URL queues a build on main and the body is ignored. The URL is the whole credential, so rotating it takes effect on the very next request and anything still holding the old one gets a 404 rather than a queued build.',
  },
  {
    name: 'Log retention',
    value: '90 / 14 d',
    body: 'Build logs are kept ninety days and runtime logs fourteen, after which they are dropped rather than archived. A drain forwards every line to your own sink as it is written; if that sink is failing the drain buffers for an hour and then starts discarding, and it never holds up a deploy. None of this is billed by volume.',
  },
];

/** Fallback leaf content height, px, for the frame before the observer has measured. Close
 *  to the two-line row, so a first paint that lands early is wrong by a few px, not by a
 *  factor. */
const CONTENT_FALLBACK = 60;

interface State {
  /** performance.now in seconds at the last paint, and the leftover of a frame that did not
   *  divide evenly into STEP. The hook hands out no time value, so the scene keeps both. */
  clock: number;
  carry: number;
  theta: Float64Array;
  omega: Float64Array;
  /** Panel height last written to the DOM. A settled row must stop reflowing, so a write
   *  only happens once the solved height has moved by a visible amount. */
  written: Float64Array;
}

/**
 * Flow area past the piston skirt, ÷ its area at the bore mouth. Two factors, and neither
 * is decoration.
 *
 * The cos θ is machined into the bore and it is there to be cancelled. The yoke gives the
 * piston a mechanical advantage of r_d·cos θ, which arrives in C as cos³θ, so a clearance
 * that falls with cos θ divides two of them back out and leaves
 *
 *   ω_term = (1 − u^CHOKE) · √(m G L_c / DAMPER r_d³)
 *
 * with no θ in it at all. That is what a profiled bore is *for*; a door closer sells the
 * same trick as a separate sweep speed and latch speed.
 *
 * The (1 − u^CHOKE) is the latch. u is piston depth, sin θ / sin THETA_OPEN, which is also
 * the panel's height as a fraction of its open height — the same number the CSS gets.
 */
function clearance(cos: number, u: number): number {
  return Math.max(SKIRT, cos * (1 - u ** CHOKE));
}

/**
 * One fixed step of one leaf. `falling` is the row's target, not a guess from the sign of
 * anything: gravity alone on the way down, gravity minus the return spring on the way up.
 */
function advance(state: State, i: number, leaf: number, falling: boolean): void {
  const theta = state.theta[i];
  const cos = Math.cos(theta);
  const u = Math.sin(theta) / SIN_OPEN;

  // A hinged uniform plate: mass with length, centre of mass at half of it, I = mL²/3 about
  // the hinged edge — not mL²/12, which is about the centre and would be the wrong body.
  const mass = SHEET * leaf;
  const arm = leaf / 2;
  const inertia = (mass * leaf * leaf) / 3;
  const yoke = PINION * leaf;

  const area = clearance(cos, u);
  const c = (DAMPER * yoke ** 3 * cos ** 3) / (area * area);
  const torque = mass * G * arm * (falling ? cos : cos - LIFT);

  /*
   * Drive explicit, damping semi-implicit: ω ← (ω + τ/I·h) / (1 + C|ω|/I·h). Written as an
   * explicit −C·ω²·h the damping can subtract more than the whole velocity once C has grown
   * by three orders near the seat, and hand back a velocity pointing the other way — a
   * dissipative term inventing motion, which then chokes even harder and diverges. In this
   * form the denominator is a divisor greater than one, so it can only ever shrink |ω|,
   * whatever C does. Same equation, same fixed point, and it cannot blow up.
   */
  const was = state.omega[i];
  let omega = (was + (torque / inertia) * STEP) / (1 + (c * Math.abs(was) * STEP) / inertia);
  let next = theta + omega * STEP;

  // Both ends of the travel are seats, and a soft-close bounces off neither — not bouncing
  // is the entire product. The stop takes the momentum and returns none of it.
  if (next <= 0) {
    next = 0;
    omega = 0;
  } else if (next >= THETA_OPEN) {
    next = THETA_OPEN;
    omega = 0;
  }

  state.theta[i] = next;
  state.omega[i] = omega;
}

/** `compact` is the 298x240 catalogue card: the same four hinges, with the heading, the
 *  variable tables and the hint dropped so four rows and one open panel fit the frame. The
 *  panel height is measured off its own content either way — see `sheet-fold.css`. */
export type SheetFoldProps = { compact?: boolean };

export function SheetFold({ compact = false }: SheetFoldProps) {
  const reduced = useReducedMotion();
  const uid = useId();
  const [open, setOpen] = useState(0);
  // The solver reads the open row every step and React state is a frame behind a click, so
  // the ref is the authority and the state exists only to re-render aria-expanded.
  const openRef = useRef(0);
  const panels = useRef<Array<HTMLDivElement | null>>(ROWS.map(() => null));
  const content = useRef<Float64Array>(new Float64Array(ROWS.length).fill(CONTENT_FALLBACK));
  // Angle and rate are the only things a resize must not reset. Rebuild them in setup and
  // every reflow would slam the open panel shut and drop it again.
  const hinge = useRef<{ theta: Float64Array; omega: Float64Array } | null>(null);

  const setup = (): State => {
    const held =
      hinge.current ?? { theta: new Float64Array(ROWS.length), omega: new Float64Array(ROWS.length) };
    hinge.current = held;

    const state: State = {
      clock: 0,
      carry: 0,
      theta: held.theta,
      omega: held.omega,
      // −1, so the first frame writes every panel whatever the solver says, including the
      // zeroes; a 0 here would leave the closed panels' inline height unset.
      written: new Float64Array(ROWS.length).fill(-1),
    };

    if (reduced) {
      for (let i = 0; i < ROWS.length; i += 1) {
        state.theta[i] = openRef.current === i ? THETA_OPEN : 0;
        state.omega[i] = 0;
      }
    }
    return state;
  };

  const draw = ({ state }: SceneDrawContext<State>) => {
    const now = performance.now() / 1000;
    const dt = state.clock === 0 ? 0 : Math.min(0.05, now - state.clock);
    state.clock = now;

    // The leaf is as long as its content is tall: height = L·sin θ has to hit the measured
    // height exactly at the stop, so L is the content divided by sin THETA_OPEN. Read live
    // from the observer's ref, never captured, or a re-wrap leaves stale hardware behind.
    const leaves = content.current;

    /*
     * Read `reduced` live rather than off a flag frozen in setup: useReducedMotion is false
     * through SSR and the first paint, so a setup-time copy would still say "animate" on the
     * one frame that machine ever gets, and every panel would be left mid-fall.
     */
    if (reduced) {
      for (let i = 0; i < ROWS.length; i += 1) {
        state.theta[i] = openRef.current === i ? THETA_OPEN : 0;
        state.omega[i] = 0;
      }
    } else {
      state.carry += dt;
      let n = 0;
      // Twelve steps is the 0.05 s the dt clamp allows. Past that the tab was away, and
      // catching up in real time would run the whole stroke inside one frame.
      while (state.carry >= STEP && n < 12) {
        for (let i = 0; i < ROWS.length; i += 1) {
          advance(state, i, leaves[i] / SIN_OPEN, openRef.current === i);
        }
        state.carry -= STEP;
        n += 1;
      }
      if (n === 12) state.carry = 0;
    }

    // The panel height IS L·sin θ, written as a custom property on the panel through a ref.
    // Never React state: this changes every frame and a setState per frame per row would put
    // four renders of the whole subtree between the solver and the pixels.
    for (let i = 0; i < ROWS.length; i += 1) {
      const lift = (leaves[i] / SIN_OPEN) * Math.sin(state.theta[i]);
      const panel = panels.current[i];
      if (panel && Math.abs(lift - state.written[i]) > 0.25) {
        panel.style.setProperty('--sheet-fold-h', `${lift.toFixed(1)}px`);
        // visibility, not aria-hidden: it takes the collapsed copy out of the accessibility
        // tree without hanging an ARIA attribute on a subtree its own button announces.
        panel.style.visibility = lift < 0.6 ? 'hidden' : 'visible';
        state.written[i] = lift;
      }
    }
  };

  const { stageRef, canvasRef, requestRender } = useCanvasScene<State>({ setup, draw });

  /*
   * Measure the copy, do not guess it. Each panel's inner box keeps its natural height inside
   * a zero-height overflow-hidden parent, so offsetHeight is the open height even while the
   * row is shut — and it is re-read on every wrap, because a narrower stage turns three lines
   * into four and that is a different leaf with a different plateau.
   */
  useEffect(() => {
    const inners = panels.current.map((panel) => panel?.firstElementChild ?? null);
    const read = () => {
      let moved = false;
      inners.forEach((node, i) => {
        if (!(node instanceof HTMLElement)) return;
        const next = node.offsetHeight || CONTENT_FALLBACK;
        if (Math.abs(next - content.current[i]) > 0.5) {
          content.current[i] = next;
          moved = true;
        }
      });
      if (moved) requestRender();
    };
    read();
    const observer = new ResizeObserver(read);
    inners.forEach((node) => {
      if (node instanceof HTMLElement) observer.observe(node);
    });
    return () => observer.disconnect();
  }, [requestRender]);

  // Braced on purpose: an expression body would hand requestRender's return value back to
  // React as the effect's cleanup. With the loop stopped this repaint is the only thing that
  // moves a panel at all, so losing it would freeze the accordion shut.
  useEffect(() => {
    requestRender();
  }, [open, reduced, requestRender]);

  // One open at a time, and the row that closes is not snapped shut — it gets the same solver
  // with its own leaf, so a swap has two plates in the air at once at two different rates.
  const toggle = (i: number) => {
    const next = openRef.current === i ? -1 : i;
    openRef.current = next;
    setOpen(next);
    requestRender();
  };

  return (
    <div className="sheet-fold-stage" data-compact={compact ? 'true' : undefined}>
      <div ref={stageRef} className="sheet-fold-section" aria-hidden="true">
        <canvas ref={canvasRef} />
      </div>
      <div className="sheet-fold-face">
        <div className="sheet-fold-col">
          <p className="sheet-fold-eyebrow">Project</p>
          <h2 className="sheet-fold-title">Build and runtime</h2>
          <ul className="sheet-fold-list">
            {ROWS.map((row, i) => (
              <li key={row.name} className="sheet-fold-row">
                <button
                  type="button"
                  id={`${uid}-head-${i}`}
                  className="sheet-fold-head"
                  aria-expanded={open === i}
                  aria-controls={`${uid}-panel-${i}`}
                  /* Still pressable in a card, but out of the tab order: the card frame
                     is aria-hidden, and a focusable node inside one is a trap with no
                     label. */
                  tabIndex={compact ? -1 : undefined}
                  onClick={() => toggle(i)}
                >
                  <span className="sheet-fold-name">{row.name}</span>
                  <span className="sheet-fold-value">{row.value}</span>
                </button>
                <div
                  id={`${uid}-panel-${i}`}
                  ref={(el) => {
                    panels.current[i] = el;
                  }}
                  className="sheet-fold-panel"
                  role="region"
                  aria-labelledby={`${uid}-head-${i}`}
                >
                  <div className="sheet-fold-inner">
                    <p className="sheet-fold-copy">{row.body}</p>
                    {row.vars ? (
                      <dl className="sheet-fold-vars">
                        {row.vars.map((entry) => (
                          <div key={entry.key} className="sheet-fold-var">
                            <dt>{entry.key}</dt>
                            <dd>{entry.note}</dd>
                          </div>
                        ))}
                      </dl>
                    ) : null}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p className="sheet-fold-hint">Open a row, then another</p>
    </div>
  );
}

export default SheetFold;
