'use client';

import './liquid-nav.css';

import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react';

import {
  useCanvasScene,
  useReducedMotion,
  type SceneDrawContext,
  type SceneSetupContext,
} from '@/hooks/use-canvas-scene';

/**
 * A tab bar whose indicator is a drop of liquid rather than a rectangle on a
 * transition.
 *
 * The pill is a chain of point masses strung along the bar with stiff springs and
 * damping on the rate of stretch. Every mass is pulled toward its own place in the
 * destination, but not equally: the pull ramps from weak at the trailing end to
 * full at the leading one. That single asymmetry is the whole reason the middle
 * arrives late, the shape leans into the travel, and it overshoots and settles
 * rather than easing.
 *
 * The thinning is not a scale animation. Every element of the chain is treated as
 * incompressible: stretched by λ along the bar it has to give up the same factor
 * across it, so the local half-thickness goes as 1/λ. Pull the ends apart and the
 * neck has nowhere to take the area from but its own width; let them come back
 * together and it has to bulge.
 *
 * The tabs are real buttons in a real tablist, and their boxes are measured from
 * the DOM rather than assumed, so the indicator lands on the actual text whatever
 * the font does to it. The canvas sits behind them and takes no pointer events.
 */

/** Seconds per step. Links this stiff want a short one. */
const STEP = 1 / 480;
/** Masses in the chain. Enough that the neck is several nodes wide. */
const NODES = 15;
/** Link stiffness, per unit mass. */
const LINK_K = 9000;
/**
 * Damping on the rate of stretch of a link, rather than on each node's velocity.
 * This is what makes the chain a medium instead of fifteen separate springs: the
 * pill can still translate freely, but the internal ringing that would otherwise
 * wobble for seconds is gone inside a couple of tenths.
 */
const LINK_DAMP = 62;
/**
 * How hard a node is pulled toward its own place in the destination. Every node is
 * driven, not just the ends: a single driven end has to hand its whole force down
 * the chain, and a spring drive proportional to a two-hundred-pixel error tears
 * the first link open long before the last one has heard about it.
 */
const DRIVE_K = 340;
/**
 * The drive is weakest at the trailing end and full strength at the leading one,
 * and this is the weak end's share. It is the only asymmetry in the file, and it
 * is what makes the pill lean: the front lets go first, the back is still being
 * persuaded, and the difference between the two is carried as tension — which
 * peaks in the middle, which is where the neck appears.
 */
const TAIL_WEIGHT = 0.3;
/** Viscous drag against the bar. The only thing that finally stops the pill. */
const DRAG = 16;
/**
 * Bounds on λ before it sets the thickness. Measured, not guessed: a jump across
 * two tabs takes the middle to λ ≈ 2.1 and the arrival swell to λ ≈ 0.66, so these
 * clip the swell and leave the stretch alone. Uncapped in the other direction the
 * neck closes to nothing and the pill separates — a real thing liquid does, and the
 * wrong thing for a control that has to stay legible as one object.
 */
const MIN_STRETCH = 0.8;
const MAX_STRETCH = 2.4;

const TABS = [
  { label: 'Overview', body: 'Fifteen masses on springs. No keyframes and no easing curve anywhere in the file.' },
  { label: 'Physics', body: 'Damping on the stretch rate rather than on velocity, integrated at 480 Hz under the paint loop.' },
  { label: 'Install', body: 'One component and one hook. The indicator measures your buttons; it does not lay them out.' },
  { label: 'Changelog', body: 'Thickness now falls as 1/λ rather than 1/√λ — the area is conserved in the plane, not in a cylinder.' },
];

type TabBox = { left: number; top: number; width: number; height: number };

interface LiquidState {
  readonly count: number;
  /** Node positions along the bar, and their velocities. The whole simulation. */
  readonly sx: Float64Array;
  readonly vx: Float64Array;
  readonly force: Float64Array;
  /** Half-thickness per node, from the local stretch. */
  readonly radius: Float64Array;
  /** Live tab geometry, shared with the component and re-measured on resize. */
  readonly boxes: { current: TabBox[] };
  /** Half-thickness at rest and the bar's centre line, both taken from the DOM. */
  base: number;
  cy: number;
  /** Rest spacing between nodes. Follows the aim tab's width, with a lag. */
  rest: number;
  carry: number;
  clock: number;
  /** Index of the tab the chain is being pulled toward. Set by the component. */
  aim: number;
  /**
   * The aim the ramp was last built for, and which way it points. Latched on the
   * change of aim rather than recomputed per step: deciding the direction from the
   * live centre would flip the ramp the instant the pill crossed its target, which
   * is a discontinuity in the middle of the travel and looks like a stumble.
   */
  held: number;
  lead: number;
  /**
   * Skip the solver and place the chain at rest on the aim. Set under
   * `prefers-reduced-motion`, where there is no loop to integrate the travel and a
   * pill that crept a twelfth of the way per repaint would be worse than none.
   */
  snap: boolean;
}

/**
 * The span the chain is heading for. The aim tab's box inset by the end radius,
 * because the end nodes carry a disc that reaches `base` past them — inset by
 * exactly that and the settled pill covers the tab instead of overhanging it.
 */
function span(state: LiquidState) {
  const boxes = state.boxes.current;
  const box = boxes[state.aim] ?? boxes[0];
  if (!box) return null;

  state.base = Math.max(6, box.height * 0.5);
  state.cy = box.top + box.height * 0.5;
  const inset = Math.min(state.base, box.width * 0.32);

  return { left: box.left + inset, right: box.left + box.width - inset };
}

/** Place the chain at rest across the aim tab, evenly spaced and stationary. */
function settle(state: LiquidState) {
  const aim = span(state);
  const left = aim ? aim.left : 0;
  const right = aim ? aim.right : state.base * 2;

  state.rest = Math.max(0.5, (right - left) / (state.count - 1));
  for (let i = 0; i < state.count; i++) {
    state.sx[i] = left + state.rest * i;
    state.vx[i] = 0;
  }
  // Already there, so there is no travel for the ramp to describe.
  state.held = state.aim;
}

/**
 * One step: link forces, the distributed drive, then a semi-implicit Euler update.
 */
function advance(state: LiquidState) {
  const { count, sx, vx, force } = state;
  const aim = span(state);
  if (!aim) return;

  /*
   * Rest spacing follows the destination rather than snapping to it. Tabs are
   * different widths, and jumping the rest length in one step would restate the
   * stretch of every link at once — a flinch the springs then have to absorb.
   */
  const spacing = (aim.right - aim.left) / (count - 1);
  state.rest += (spacing - state.rest) * Math.min(1, STEP * 14);

  // Which end leads, decided once per aim. See `held` on the state.
  if (state.aim !== state.held) {
    state.lead = (aim.left + aim.right) * 0.5 >= (sx[0] + sx[count - 1]) * 0.5 ? 1 : -1;
    state.held = state.aim;
  }

  force.fill(0);
  for (let i = 1; i < count; i++) {
    const stretch = sx[i] - sx[i - 1] - state.rest;
    const rate = vx[i] - vx[i - 1];
    const pull = LINK_K * stretch + LINK_DAMP * rate;
    force[i] -= pull;
    force[i - 1] += pull;
  }

  /*
   * Every node toward its own place in the destination, weighted along the chain.
   * Tension is the running sum of the drive imbalance, so it vanishes at both free
   * ends and peaks somewhere in the middle — which is the neck, arrived at rather
   * than drawn. Driving only the leading end instead would put a force of
   * DRIVE_K × 200px into one node, and the links can only answer that by opening
   * some thirty pixels: the chain tears and its nodes cross over.
   */
  for (let i = 0; i < count; i++) {
    const along = i / (count - 1);
    const weight = TAIL_WEIGHT + (1 - TAIL_WEIGHT) * (state.lead > 0 ? along : 1 - along);
    force[i] += DRIVE_K * weight * (aim.left + spacing * i - sx[i]);
  }

  for (let i = 0; i < count; i++) {
    vx[i] += (force[i] - DRAG * vx[i]) * STEP;
    sx[i] += vx[i] * STEP;
  }
}

/** Half-thickness per node from the local stretch, area preserved in the plane. */
function thicken(state: LiquidState) {
  const { count, sx, radius, rest, base } = state;

  for (let i = 0; i < count; i++) {
    const before = i > 0 ? sx[i] - sx[i - 1] : sx[1] - sx[0];
    const after = i < count - 1 ? sx[i + 1] - sx[i] : sx[count - 1] - sx[count - 2];
    // Centred, so a node's thickness answers to the links on both sides of it
    // rather than stepping between them.
    const stretch = Math.min(MAX_STRETCH, Math.max(MIN_STRETCH, (before + after) * 0.5 / rest));
    radius[i] = base / stretch;
  }
}

function build(
  { height }: SceneSetupContext,
  boxes: { current: TabBox[] },
  aim: number,
): LiquidState {
  const count = NODES;
  const state: LiquidState = {
    count,
    sx: new Float64Array(count),
    vx: new Float64Array(count),
    force: new Float64Array(count),
    radius: new Float64Array(count),
    boxes,
    // Fallbacks for the frame before the tabs have been measured. `span` replaces
    // both the moment there is a real box to read.
    base: Math.max(6, height * 0.32),
    cy: height * 0.5,
    rest: 1,
    carry: 0,
    clock: 0,
    aim,
    held: aim,
    lead: 1,
    snap: false,
  };

  // Start settled on the active tab. A pill that flies in from the origin on
  // every resize is a component announcing its own implementation.
  settle(state);
  thicken(state);

  return state;
}

function paint({ context, width, height, state }: SceneDrawContext<LiquidState>) {
  const now = performance.now();
  const elapsed = state.clock ? Math.min(0.05, (now - state.clock) / 1000) : STEP;
  state.clock = now;

  state.carry += elapsed;
  let steps = 0;
  // 480 Hz is eight sub-steps per frame at 60 fps, so the cap has to clear sixteen
  // or a display running at 30 would silently integrate the pill at half speed.
  while (state.carry >= STEP && steps < 16) {
    advance(state);
    state.carry -= STEP;
    steps += 1;
  }
  if (state.carry > STEP * 16) state.carry = 0;
  if (state.snap) settle(state);
  thicken(state);

  context.clearRect(0, 0, width, height);
  if (!state.boxes.current.length) return;

  const { count, sx, radius, cy } = state;

  /*
   * The pill is the union of the chain's discs: one path of fifteen circles and
   * one fill. Overlaps in a single colour are invisible, so the union needs no
   * isosurface pass, and with the nodes spaced well inside their own width the
   * scallop left on the silhouette is a fraction of a pixel.
   */
  const trace = (shrink: number) => {
    context.beginPath();
    for (let i = 0; i < count; i++) {
      const r = Math.max(0.5, radius[i] - shrink);
      // Enter each circle at its own start angle, or `arc` draws a chord in from
      // wherever the last one finished and the union fills solid.
      context.moveTo(sx[i] + r, cy);
      context.arc(sx[i], cy, r, 0, Math.PI * 2);
    }
  };

  // The rim, with its bloom, then the body laid back over it. Two fills of the
  // same union a pixel and a half apart is the entire lit edge.
  context.shadowColor = 'rgba(126,186,255,0.42)';
  context.shadowBlur = 22;
  trace(0);
  context.fillStyle = 'rgba(152,205,255,0.7)';
  context.fill();

  context.shadowBlur = 0;
  trace(1.5);
  const body = context.createLinearGradient(0, cy - state.base, 0, cy + state.base);
  body.addColorStop(0, 'rgba(33,56,92,0.96)');
  body.addColorStop(1, 'rgba(13,22,40,0.96)');
  context.fillStyle = body;
  context.fill();
}

/** `compact` is the 298x240 catalogue card: the same bar and the same solver, handed
 *  the whole box, with the panel copy dropped. Presentation only — see `liquid-nav.css`. */
export type LiquidNavProps = { compact?: boolean };

export function LiquidNav({ compact = false }: LiquidNavProps) {
  const [active, setActive] = useState(1);
  /** The tab being pointed at, so the pill can lean at it before the click. */
  const [hover, setHover] = useState(-1);
  const list = useRef<HTMLDivElement | null>(null);
  const boxes = useRef<TabBox[]>([]);
  const reduced = useReducedMotion();

  const { stageRef, canvasRef, requestRender } = useCanvasScene<LiquidState>({
    setup: (scene) => build(scene, boxes, active),
    draw: (scene) => {
      scene.state.aim = hover >= 0 ? hover : active;
      scene.state.snap = reduced;
      paint(scene);
    },
  });

  // Selection has to repaint on its own account: with the loop stopped under
  // reduced motion nothing else would, and the indicator would stay behind.
  useEffect(() => {
    requestRender();
  }, [active, hover, requestRender]);

  /*
   * The indicator is told where the tabs are; it does not decide. Measuring the
   * real boxes is what lets this sit under any label set, font and padding — and
   * it is why the observer watches the buttons and not just the bar, since a font
   * swap resizes them without moving the bar at all.
   */
  const measure = useCallback(() => {
    const node = list.current;
    if (!node) return;
    const frame = node.getBoundingClientRect();
    boxes.current = Array.from(node.children, (child) => {
      const box = child.getBoundingClientRect();
      return {
        left: box.left - frame.left,
        top: box.top - frame.top,
        width: box.width,
        height: box.height,
      };
    });
    requestRender();
  }, [requestRender]);

  useEffect(() => {
    const node = list.current;
    if (!node) return;
    measure();
    const sizes = new ResizeObserver(measure);
    sizes.observe(node);
    for (const child of Array.from(node.children)) sizes.observe(child);
    return () => sizes.disconnect();
  }, [measure]);

  // A tablist takes one tab stop and the arrows move within it, which is the part
  // of a tab control that hand-rolled ones usually skip.
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const move = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
    if (!move) return;
    event.preventDefault();
    const next = (active + move + TABS.length) % TABS.length;
    setActive(next);
    (list.current?.children[next] as HTMLElement | undefined)?.focus();
  };

  return (
    <div className="liquid-nav-stage" data-compact={compact ? 'true' : undefined}>
      <div className="liquid-nav-bar">
        <div ref={stageRef} className="liquid-nav-field" aria-hidden="true">
          <canvas ref={canvasRef} />
        </div>

        <div
          ref={list}
          className="liquid-nav-tabs"
          role="tablist"
          aria-label="Sections"
          onKeyDown={onKeyDown}
          onPointerLeave={() => setHover(-1)}
        >
          {/* The roving tab stop, except in a card: the frame there is aria-hidden,
              and a focusable node inside one is a trap with no name. The buttons stay
              clickable in both — only the tab order changes. */}
          {TABS.map((tab, index) => (
            <button
              key={tab.label}
              type="button"
              role="tab"
              id={`liquid-nav-tab-${index}`}
              className="liquid-nav-tab"
              aria-selected={index === active}
              aria-controls="liquid-nav-panel"
              tabIndex={compact ? -1 : index === active ? 0 : -1}
              onClick={() => setActive(index)}
              onPointerEnter={() => setHover(index)}
              onFocus={() => setHover(index)}
              onBlur={() => setHover(-1)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <p
        className="liquid-nav-panel"
        id="liquid-nav-panel"
        role="tabpanel"
        aria-labelledby={`liquid-nav-tab-${active}`}
      >
        {TABS[active].body}
      </p>

      <p className="liquid-nav-hint">Hover to lean, click to travel</p>
    </div>
  );
}

export default LiquidNav;
