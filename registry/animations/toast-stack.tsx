'use client';

import './toast-stack.css';

import { useCallback, useEffect, useRef, useState } from 'react';

import {
  useCanvasScene,
  useReducedMotion,
  type SceneDrawContext,
  type SceneSetupContext,
} from '@/hooks/use-canvas-scene';

/**
 * A toast stack whose settle is squeeze-film air damping.
 *
 * A card coming down onto the card below it has to get the air out from between the
 * two faces first, and that air has one way out: sideways, through a gap that is
 * closing on it. Reynolds' lubrication equation for that gap — one-dimensional
 * across the card, vented at the two edges you can see — gives a resisting force
 *
 *     F = C·(−ḣ)/h³,     C ≈ μ·L·W³/2
 *
 * and every card here is `m ÿ = −m g + F_below − F_above` with a unilateral contact
 * term underneath it, integrated at a fixed step. There is no stagger, no spring, no
 * cubic-bezier and no per-card delay anywhere in this file; search it.
 *
 * What the equation buys is the one thing an eased entrance cannot fake: the settle
 * is algebraic, not exponential. Once the film is carrying the weight the gap closes
 * at ḣ = −m g h³/C, so the time from h₀ to h₁ is (C/2mg)(1/h₁² − 1/h₀²) and the tail
 * dominates outright. Over the thirty-four pixel drop below, half the settling time
 * is spent inside the last one and a half pixels. A bezier cannot be made to do that
 * at any control points, because its exit velocity is a fixed fraction of its entry
 * velocity whatever distance it covered; ease-out spends its time evenly by
 * construction, and a landing card does not.
 *
 * Two more consequences, both free. The crawl time is set by the gap and not by the
 * drop — the same expression, evaluated from wherever the film takes over — so a card
 * released from twice the height arrives about a seventh later rather than twice as
 * fast, and the stack self-levels. And dismissing one card out of the middle does not
 * animate the others: their films open, the suction of an opening film drags them
 * part of the way down, and each is caught by the film of whatever is now beneath it.
 * The collapse ripples upward with every card's own timing because the films are a
 * chain of couplings, not a list of delays.
 *
 * The cards are real DOM — a title, a line of body, a dismiss button — placed by
 * writing one transform per card from the solved heights, through refs, never through
 * React state.
 */

/** Seconds per step. 1/h³ is stiff, and a coarser step visibly shortens the tail. */
const STEP = 1 / 240;
/** Sweeps of the implicit velocity solve. Eight is where a four-high collapse stops
 *  depending on which end of the stack the sweep started from. */
const SWEEPS = 8;
/** Steps one frame may run, so a tab that was hidden does not integrate a minute. */
const MAX_STEPS = 8;
/** Gravity, px/s². The house value; with the film coefficient it sets the whole fall. */
const G = 1400;
/**
 * The lumped film coefficient, px⁵/s: μ·L·W³/2 and the card's mass rolled into one
 * number, because only the shape of the law is doing work here. Set from the settle it
 * has to produce — (C/2G)(1/4² − 1/16²) ≈ 0.52s of crawl, which is a card landing on a
 * pile rather than a card being placed on one.
 */
const FILM = 24900;
/** Gap the faces bear on, px. Not zero: two cards in a pile stand off on their own edge
 *  bead, 1/h³ has no value there, and this is the visible seam between settled cards. */
const CONTACT = 4;
/** Contact stiffness, px/s² per px of overlap. High enough that the whole four-high
 *  stack compresses about a third of a pixel, low enough that √K·STEP stays well under
 *  two, which is what an explicit spring needs at this step. */
const CONTACT_K = 40000;
/** Smallest gap the 1/h³ term is evaluated at, px. Real surfaces are rough so the film
 *  never sees zero; numerically it is also what keeps the coefficient finite if a resize
 *  ever seats two cards overlapping. */
const H_MIN = 0.9;
/**
 * Ceiling on the film's tensile force, px/s² per unit mass. Squeezing can be as stiff as
 * it likes, but absolute pressure stops at zero, so a vented film can only pull with
 * about one atmosphere over the card's face. Without the ceiling 1/h³ makes a separating
 * pile move as one rigid block — that is stiction, not a toast stack.
 */
const PULL_MAX = 2400;
/** Height a new card is released above whatever is under it, px. Enough that the free
 *  fall and the crawl are both legible; more reads as a card thrown in from off-screen. */
const FALL = 34;
/** Card height, px. Holds a title, a line of body and a dismiss target; the solver needs
 *  it because it is the pitch of the stack. */
const TOAST_H = 58;
/** Underside to underside of two settled cards. */
const PITCH = TOAST_H + CONTACT;
/** Cards kept. Past four a corner stack has stopped being a corner stack. */
const MAX_STACK = 4;
/** Inset from the bottom-right corner of the stage, px. The Add button sits at the same
 *  inset on the left, so the whole stage keeps one frame. */
const MARGIN = 20;
/** Room kept clear to the left of the cards, px, so a narrow stage narrows the toast
 *  instead of parking a card on top of the Add button. */
const CONTROL_ROOM = 118;
/** Widest and narrowest a card may be drawn, px. */
const TOAST_W_MAX = 300;
const TOAST_W_MIN = 168;

/** Six notifications a build tool would actually send, cycled by serial number. */
const MESSAGES: readonly (readonly [string, string])[] = [
  ['Registry synced', '38 items · 2 changed since 14:02'],
  ['Build passed', 'next build in 41s · no warnings'],
  ['Draft saved', 'toast-stack.tsx · a moment ago'],
  ['Export ready', 'court-archive.zip · 1.4 MB'],
  ['Token refreshed', 'Session valid for another 12 hours'],
  ['Three drafts removed', 'Undo stays available for 30 seconds'],
];

interface Toast {
  readonly id: number;
  readonly title: string;
  readonly body: string;
}

/** One card. `id` is what ties it to its DOM node and to React's list. */
interface Card {
  readonly id: number;
  /** Height of this card's underside above the page floor, px. */
  y: number;
  /** dy/dt, px/s. Negative while the card is coming down. */
  v: number;
}

interface Corner {
  clock: number;
  carry: number;
  /** Seat every card at its resting height and stop integrating. Set under
   *  `prefers-reduced-motion`, where the loop never runs and a stack advanced one
   *  accumulator's worth per repaint would never land. */
  snap: boolean;
}

function make(id: number): Toast {
  const [title, body] = MESSAGES[id % MESSAGES.length];
  return { id, title, body };
}

/*
 * Step scratch, allocated once: the gap under each card, its film coefficient, the
 * explicit half of its velocity update, and the velocity being solved for. Sharing these
 * between instances is safe for the same reason chip-pile shares its closest-point pair —
 * a step runs to completion without yielding.
 */
const gap = new Float64Array(MAX_STACK);
const coef = new Float64Array(MAX_STACK);
const rhs = new Float64Array(MAX_STACK);
const vel = new Float64Array(MAX_STACK);

/** Every card on the geometry, stationary. A third of a pixel above where the contact
 *  springs would hold it, which is nothing to look at. */
function seat(cards: readonly Card[]) {
  for (let i = 0; i < cards.length; i++) {
    cards[i].y = CONTACT + i * PITCH;
    cards[i].v = 0;
  }
}

function advance(cards: readonly Card[]) {
  const n = cards.length;

  for (let i = 0; i < n; i++) {
    const card = cards[i];
    // The page floor is card −1. An immovable surface is a body of infinite mass, so it
    // needs no branch beyond never being pushed back.
    const under = i > 0 ? cards[i - 1].y + TOAST_H : 0;
    const underV = i > 0 ? cards[i - 1].v : 0;
    const h = card.y - under;
    const closing = card.v - underV;

    const clamped = Math.max(H_MIN, h);
    let c = FILM / (clamped * clamped * clamped);
    // Limited in tension only, and limited by scaling the coefficient rather than the
    // force: that caps the pull at PULL_MAX while leaving the term linear in ḣ, which is
    // what the implicit solve below needs it to be.
    if (closing > 0) c = Math.min(c, PULL_MAX / closing);

    gap[i] = h;
    coef[i] = c;
    // Gravity and the bearing under it. The reaction of that bearing on the card below
    // is added in the second pass, once every gap is known.
    rhs[i] = card.v - STEP * G;
    if (h < CONTACT) rhs[i] += STEP * CONTACT_K * (CONTACT - h);
  }
  for (let i = 1; i < n; i++) {
    if (gap[i] < CONTACT) rhs[i - 1] -= STEP * CONTACT_K * (CONTACT - gap[i]);
  }
  for (let i = 0; i < n; i++) vel[i] = rhs[i];

  /*
   * The velocity update, taken implicitly in the film terms. C/h³ passes thirty thousand
   * per second near contact and an explicit damper needs c·dt < 1, so explicit
   * integration would want a step forty times smaller than this one. Backward Euler needs
   * none of that, and because each film couples a card only to its neighbour the system
   * is tridiagonal — swept alternately up and down the stack, which is Gauss–Seidel on
   * exactly that matrix. It converges because the diagonal carries the identity too.
   *
   * The fixed point of this update for a single card is v = −g·h³/C exactly, so the crawl
   * runs at the analytic terminal velocity at any step size. That is the reason the tail
   * can be trusted: it is not a property of the integrator.
   */
  for (let pass = 0; pass < SWEEPS; pass++) {
    const up = pass % 2 === 0;
    for (let k = 0; k < n; k++) {
      const i = up ? k : n - 1 - k;
      const cAbove = i < n - 1 ? coef[i + 1] : 0;
      const vBelow = i > 0 ? vel[i - 1] : 0;
      const vAbove = i < n - 1 ? vel[i + 1] : 0;
      vel[i] =
        (rhs[i] + STEP * (coef[i] * vBelow + cAbove * vAbove)) /
        (1 + STEP * (coef[i] + cAbove));
    }
  }

  for (let i = 0; i < n; i++) {
    cards[i].v = vel[i];
    cards[i].y += vel[i] * STEP;
  }
}

function run(state: Corner, cards: readonly Card[]) {
  const now = performance.now();
  // The hook hands the scene no time at all, so the clock is the scene's own. Capped,
  // because a frame that took a second must not become a second of stiff integration.
  const elapsed = state.clock ? Math.min(0.05, (now - state.clock) / 1000) : STEP;
  state.clock = now;

  if (state.snap) {
    seat(cards);
    return;
  }

  state.carry += elapsed;
  let steps = 0;
  while (state.carry >= STEP && steps < MAX_STEPS) {
    advance(cards);
    state.carry -= STEP;
    steps += 1;
  }
  if (state.carry > STEP * MAX_STEPS) state.carry = 0;
}

/**
 * The card list, rebuilt against the toasts React is rendering. A card still on screen
 * keeps the y and the v it had, so a dismissal restarts nothing; a new one is released
 * FALL above whatever is under it *now* rather than above the slot it will end up in,
 * which is why adding onto a stack that has not finished settling starts from the real
 * gap. `rest` is the first pass only: the two toasts the component mounts with were
 * already there before it mounted.
 */
function reconcile(held: readonly Card[], list: readonly Toast[], rest: boolean): Card[] {
  const next: Card[] = [];
  for (let i = 0; i < list.length; i++) {
    const kept = held.find((card) => card.id === list[i].id);
    if (kept) {
      next.push(kept);
      continue;
    }
    const under = i > 0 ? next[i - 1].y + TOAST_H : 0;
    next.push({
      id: list[i].id,
      y: rest ? CONTACT + i * PITCH : under + CONTACT + FALL,
      v: 0,
    });
  }
  return next;
}

/** The solved heights, written straight to the nodes. The transform carries the corner
 *  inset as well, so no number in the stylesheet has to agree with a number in here. */
function place(cards: readonly Card[], nodes: Map<number, HTMLElement>) {
  for (const card of cards) {
    const node = nodes.get(card.id);
    if (!node) continue;
    node.style.transform = `translate3d(${-MARGIN}px, ${(-(MARGIN + card.y)).toFixed(2)}px, 0)`;
  }
}

function build({ width }: SceneSetupContext, layer: HTMLElement | null): Corner {
  const boxW = Math.max(
    TOAST_W_MIN,
    Math.min(TOAST_W_MAX, width - MARGIN * 2 - CONTROL_ROOM),
  );
  // The card box is stage geometry, so it is published from the one place that decides
  // stage geometry instead of being guessed at a second time in CSS.
  if (layer) {
    layer.style.setProperty('--toast-stack-w', `${boxW}px`);
    layer.style.setProperty('--toast-stack-h', `${TOAST_H}px`);
  }
  return {
    clock: 0,
    carry: 0,
    snap: false,
  };
}

/**
 * The canvas has nothing of its own to show. It stays because `draw` is where the stack is
 * advanced and the cards are placed, and `setup` is the only thing that publishes the card
 * box to CSS; clearing is all the painting left.
 */
function paint({ context, width, height }: SceneDrawContext<Corner>) {
  context.clearRect(0, 0, width, height);
}

/**
 * The tracked element holds nothing but the canvas; every readable thing is a later
 * sibling stacked over it. That layer is transparent to the pointer as a whole and the
 * cards take their clicks back, because the stage takes pointer capture as it tracks and
 * a dismiss button inside it would have its click swallowed by that capture.
 */
/** `compact` is the 298x240 catalogue card: the same stack in the same corner, with the
 *  hint dropped and the control strip shrunk. The toast width is measured off the live
 *  layer, so the lubrication solve is the same one either way — see `toast-stack.css`. */
export type ToastStackProps = { compact?: boolean };

export function ToastStack({ compact = false }: ToastStackProps) {
  const reduced = useReducedMotion();
  const [toasts, setToasts] = useState<Toast[]>(() => [make(0), make(1)]);

  const cards = useRef<Card[]>([]);
  const nodes = useRef(new Map<number, HTMLElement>());
  const layer = useRef<HTMLDivElement | null>(null);
  const serial = useRef(2);
  const seeded = useRef(false);

  const add = useCallback(() => {
    setToasts((list) => {
      const grown = [...list, make(serial.current)];
      serial.current += 1;
      /*
       * The cap dropping the oldest is the best thing in here. The new card is still on
       * its way down onto the top of the stack while every card below it falls a whole
       * pitch into the slot the dropped one left — two different fall heights inside one
       * event, arriving at times a stagger would have had to be told in advance.
       */
      return grown.length > MAX_STACK ? grown.slice(grown.length - MAX_STACK) : grown;
    });
  }, []);

  const dismiss = useCallback((id: number) => {
    setToasts((list) => list.filter((toast) => toast.id !== id));
  }, []);

  const { stageRef, canvasRef, requestRender } = useCanvasScene<Corner>({
    setup: (scene) => build(scene, layer.current),
    draw: (scene) => {
      const held = cards.current;
      const stale =
        held.length !== toasts.length ||
        toasts.some((toast, i) => held[i].id !== toast.id);
      if (stale) cards.current = reconcile(held, toasts, !seeded.current);
      seeded.current = true;

      scene.state.snap = reduced;
      run(scene.state, cards.current);
      place(cards.current, nodes.current);
      paint(scene);
    },
  });

  // The list is a React value the scene reads. With the loop stopped under reduced motion
  // nothing else would run a frame, and a card that had just been added would never be
  // given a position at all.
  useEffect(() => {
    requestRender();
  }, [toasts, reduced, requestRender]);

  return (
    <div className="toast-stack-stage" data-compact={compact ? 'true' : undefined}>
      <div ref={stageRef} className="toast-stack-surface" aria-hidden="true">
        <canvas ref={canvasRef} />
      </div>

      <div ref={layer} className="toast-stack-layer">
        <div className="toast-stack-controls">
          {/* Still pressable in a card, but out of the tab order: the card frame is
              aria-hidden, and a focusable node inside one is a trap with no label. */}
          <button
            type="button"
            className="toast-stack-add"
            tabIndex={compact ? -1 : undefined}
            onClick={add}
          >
            Add toast
          </button>
          <p className="toast-stack-hint">Add a toast, then dismiss one</p>
        </div>

        <div
          className="toast-stack-corner"
          role="status"
          aria-live="polite"
          aria-label="Notifications"
        >
          {toasts.map((toast) => (
            <div
              key={toast.id}
              ref={(node) => {
                if (node) nodes.current.set(toast.id, node);
                else nodes.current.delete(toast.id);
              }}
              className="toast-stack-toast"
            >
              <p className="toast-stack-title">{toast.title}</p>
              <p className="toast-stack-body">{toast.body}</p>
              <button
                type="button"
                className="toast-stack-dismiss"
                tabIndex={compact ? -1 : undefined}
                onClick={() => dismiss(toast.id)}
                aria-label={`Dismiss ${toast.title}`}
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ToastStack;
