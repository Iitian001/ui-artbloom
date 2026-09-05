'use client';

import './scanline-marquee.css';

import { useEffect, useId, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';

import {
  useCanvasScene,
  useReducedMotion,
  type SceneDrawContext,
  type SceneSetupContext,
} from '@/hooks/use-canvas-scene';

/**
 * A trusted-by belt that is not drawn all at once. It is READ OUT, one scanline band at a
 * time, the way a CMOS sensor with a rolling shutter reads a subject that keeps moving while
 * the rows are still being clocked off it.
 *
 * Two equations, in this order.
 *
 * The belt's own speed is a first-order drag law, integrated in closed form rather than eased:
 *
 *   dv/dt = (v_target - v) / TAU
 *   v(t + h) = v_target + (v(t) - v_target) * exp(-h / TAU)
 *   x(t + h) = x(t) + v_target * h + (v(t) - v_target) * TAU * (1 - exp(-h / TAU))
 *
 * so the fixed step is not a stability limit here - that step is exact for any h. A finger on
 * the strip overrides v with its own measured velocity, and letting go hands that measured
 * velocity straight back to the law as the initial condition v(t), so a flick decays from the
 * speed the hand actually had rather than from a number chosen to look right.
 *
 * The readout is the part that matters. The sensor does not sample the belt once per frame.
 * It exposes row y at
 *
 *   t(y) = t_frame + y * (T_READ / H)
 *
 * where H is the readout window, row y = 0 is the BOTTOM scanline, and t_frame is the instant
 * this frame's readout began - so in screen space the top band carries the newest sample of x
 * and the bottom band the oldest. Every position the belt has held is therefore needed, not
 * just the one it holds now: x is pushed into a ring buffer once per fixed STEP, and each band
 * interpolates x out of that history at its own t(y). The rail the belt runs in is not moving,
 * so the readout leaves it perfectly straight and bends only the subject, which is exactly the
 * asymmetry a real sensor has.
 *
 * IT IS NOT transform: skewX(), and it is not a per-row offset computed from the current
 * velocity. Those two are the same thing - the linear approximation to this - and they lean the
 * whole strip by v * T_READ, which is right only while v is constant. They cannot show the
 * interesting half, because they snap every row to the new lean on the frame the speed changes,
 * and they unwind all at once.
 *
 * THE ONE THING TO WATCH: while the belt is changing speed the lean CHANGES DOWN THE STRIP. The
 * top rows already carry the new speed while the bottom rows still carry the old one, so the
 * wordmarks bend instead of shearing - and after a flick the bend unwinds from the top downward
 * over exactly T_READ, with the belt itself already still. Drag hard, then hold your finger
 * where it is: nothing is moving and the strip is still straightening out.
 */

/** Seconds per solver step. The drag law is integrated exactly, so this is not a stability
 *  limit: it is the interval the position history is sampled at. 1/120 puts about 34 samples
 *  inside T_READ, a little over one per readout band at dpr 2, so no band has to interpolate
 *  across more than a single step of belt travel. */
const STEP = 1 / 120;
/** Steps per frame, capped. The 0.05 s clamp on the frame delta already holds a returning tab
 *  to six of these, so twelve is the second bound rather than the first: it survives a looser
 *  clamp, and dropping the rest is honest here because anything older than T_READ is discarded
 *  by the readout anyway. */
const MAX_STEPS = 12;
/** Readout time for the whole window, seconds. The tuned number of this file. A real sensor is
 *  nearer 1/30 s, where the lean at cruise is under two pixels and the effect is invisible; at
 *  1 s the strip never resolves and the recovery outlasts anyone watching. 0.28 s is about
 *  seventeen frames: the unwind reads as one event and the cruise lean is a gentle italic. */
const T_READ = 0.28;
/** History length. T_READ of samples plus four, so the oldest band still interpolates between
 *  two written entries instead of off the end of the buffer. */
const RING = Math.ceil(T_READ / STEP) + 4;
/** Belt time constant, seconds. Deliberately shorter than T_READ: a change of target is then
 *  close enough to a step that the readout boundary sweeps the strip as a boundary rather than
 *  as an indistinct curve. 3*TAU = 0.54 s, so a release still settles within a beat. */
const TAU = 0.18;
/** The exact velocity decay over one step, and the exact distance covered during it,
 *  precomputed so no transcendental runs inside the loop. */
const DECAY = Math.exp(-STEP / TAU);
const RAMP = TAU * (1 - DECAY);
/** The steepest lean the wordmarks stay readable at, as a tangent. Top speed follows from it -
 *  v_max = LEAN_TAN * bandH / T_READ - so the belt's speed tracks the type size instead of
 *  fighting it, and the lean angle is the same on a phone as on a desktop. */
const LEAN_TAN = 0.84;
/** Drag ceiling, as a multiple of top speed. 3.2x leans the strip by about three cap heights:
 *  the wordmarks visibly tear and still reassemble inside T_READ. Higher and there is nothing
 *  left on the strip to read at all. */
const DRAG_LIMIT = 3.2;
/** Low-pass on the measured pointer velocity, seconds. One pointermove is a noisy estimate of
 *  speed; 50 ms is about three frames, enough to denoise a flick without lagging the finger. */
const DRAG_TAU = 0.05;
/** Device rows per readout band. Two is one CSS pixel of vertical quantisation at dpr 2, under
 *  the size where a shear boundary looks stepped, and it halves the number of blits. */
const ROW_STRIDE = 2;
/** Slider stops, in percent. Five gives twenty-one of them, so one arrow key is a lean the eye
 *  can see, and Home and End are still one press each. */
const SPEED_GRAIN = 5;
/** Where the slider starts: just over half, a 25-degree cruise lean with room both ways. */
const SPEED_START = 55;
/** End fade, px, capped below to a fifth of the card so a phone still shows whole wordmarks. */
const FADE = 44;

/** Type size, in px, taken from the card's width: width/15 lands 34 on a wide card and 26 on a
 *  390px phone, and both fit two marks and a divider on screen at once. */
const FONT_MIN = 22;
const FONT_MAX = 34;
const FONT_PER_PX = 15;
const FONT_STACK = 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';
/** Optical tracking, as a fraction of the size. Wordmarks are set open, and 0.075em is the
 *  usual amount for uppercase at this weight. */
const TRACK_RATIO = 0.075;
/** Gap between marks, as a multiple of the size. 1.4 leaves the divider air on both sides. */
const GAP_RATIO = 1.4;
/** Slack above and below the caps inside the readout window, px. Three keeps the ink at four
 *  fifths of the window, so the bend happens across the letters and not in empty space. */
const BAND_PAD = 3;
/** Cap height as a fraction of the size. Used only if the engine reports no ascent metric. */
const CAP_FALLBACK = 0.71;
/** The visible rail, as a multiple of the readout window. Just under twice: the belt has room
 *  to lean without ever reaching the hairlines. */
const RAIL_RATIO = 1.9;
/** The divider between marks: 2px wide and 0.62 of the window tall, tall enough that the shear
 *  turns it into a legible diagonal hairline. */
const BAR_W = 2;
const BAR_RATIO = 0.62;
/** Phase at mount, as a fraction of the card: the accent mark a third of the way in, rather
 *  than wherever a position of zero happens to leave it. */
const START_AT = 0.34;

/** Eight invented companies. Real words, and the order the hidden list reads them in. */
const WORDMARKS = [
  'LAMPBLACK',
  'SALTGRASS',
  'COLDHARBOUR',
  'MILLRACE',
  'BRIGHTWATER',
  'STONEFERRY',
  'HARROWGATE',
  'FERNWORKS',
];
/** MILLRACE, fourth of eight: the accent is on screen shortly after mount and once a lap. */
const ACCENT_AT = 3;
const ACCENT = '#9ecdff';
const INK = 'rgba(233, 239, 247, 0.82)';
const BAR_INK = 'rgba(233, 239, 247, 0.16)';
const HAIR = 'rgba(233, 239, 247, 0.1)';
const CLEAR = 'rgba(233, 239, 247, 0)';

/** Everything the strip's one-off render needs. None of it changes between frames. */
interface StripPlan {
  readonly face: string;
  readonly track: number;
  readonly gap: number;
  readonly baseline: number;
  readonly bandH: number;
  readonly slots: Float64Array;
  readonly widths: Float64Array;
}

interface BeltState {
  /** performance.now()/1000 at the last painted frame. Zero until the first one. */
  clock: number;
  carry: number;
  /** Belt velocity, px/s. Positive carries the wordmarks to the left. */
  vel: number;
  /** Belt travel, px. This is the quantity the ring buffer remembers. */
  pos: number;
  /** Travel sampled once per STEP, newest at `head`, oldest one index behind it. */
  readonly ring: Float64Array;
  head: number;
  /** Low-passed pointer velocity, px/s, in belt travel rather than screen direction. */
  hand: number;
  /** Whether the pointer was down at the previous frame, so a fresh press can reset `hand`. */
  wasDown: boolean;
  /** The belt, rendered once at device resolution. Every band is a slice of this. */
  readonly strip: HTMLCanvasElement;
  /** Strip width in device px, and the same width in CSS px. Their ratio is exactly dpr, so
   *  copies of the strip tile without a seam once each blit is rounded to a device pixel. */
  readonly stripW: number;
  readonly period: number;
  /** The readout window: height in CSS px, and the device rows the bands are cut from. */
  readonly bandH: number;
  readonly rows: number;
  readonly railH: number;
  /** Belt speed at 100 percent, px/s. Derived from the window height, not typed in. */
  readonly vmax: number;
  /** Wanted velocity, written from the component's controls each frame. */
  target: number;
  /** Hold the settled lean and stop stepping. Set under prefers-reduced-motion. */
  snap: boolean;
}

/*
 * Uppercase wordmarks want optical tracking, and the 2D context's own `letterSpacing` is not
 * in every engine this ships to, so the glyphs are placed one at a time. Measuring and drawing
 * walk the same loop, which is why the strip's period and its ink can never disagree.
 */
function trackedWidth(c: CanvasRenderingContext2D, text: string, track: number): number {
  let run = 0;
  for (let i = 0; i < text.length; i += 1) run += c.measureText(text[i]).width + track;
  return Math.max(0, run - track);
}

function drawTracked(
  c: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  track: number,
): void {
  let cx = x;
  for (let i = 0; i < text.length; i += 1) {
    c.fillText(text[i], cx, y);
    cx += c.measureText(text[i]).width + track;
  }
}

/** The belt, painted once. The sensor reads this image; it never re-renders per frame. */
function paintStrip(c: CanvasRenderingContext2D, plan: StripPlan, dpr: number): void {
  c.setTransform(dpr, 0, 0, dpr, 0, 0);
  c.font = plan.face;
  c.textAlign = 'left';
  c.textBaseline = 'alphabetic';
  const barH = Math.round(plan.bandH * BAR_RATIO);
  const barY = Math.round((plan.bandH - barH) / 2);
  for (let i = 0; i < WORDMARKS.length; i += 1) {
    c.fillStyle = i === ACCENT_AT ? ACCENT : INK;
    drawTracked(c, WORDMARKS[i], plan.slots[i], plan.baseline, plan.track);
    /*
     * The divider rides in the middle of the gap that FOLLOWS its mark, never the one before
     * it: the gap after the last mark is the same gap the first mark meets on the wrap, so
     * placing it forward is what keeps the tile seamless.
     */
    c.fillStyle = BAR_INK;
    c.fillRect(plan.slots[i] + plan.widths[i] + plan.gap / 2 - BAR_W / 2, barY, BAR_W, barH);
  }
}

function push(s: BeltState): void {
  s.head = (s.head + 1) % RING;
  s.ring[s.head] = s.pos;
}

/**
 * Travel as it was `age` seconds ago, linearly interpolated between the two samples either
 * side. This is the whole readout: a band asks for the belt at its own exposure time and gets
 * the position the belt genuinely held then.
 */
function sampleAt(s: BeltState, age: number): number {
  const k = Math.max(0, Math.min(RING - 1, age / STEP));
  const i0 = Math.floor(k);
  const i1 = Math.min(RING - 1, i0 + 1);
  const a = s.ring[(s.head - i0 + RING) % RING];
  const b = s.ring[(s.head - i1 + RING) % RING];
  return a + (b - a) * (k - i0);
}

/** Fill the whole history from one constant velocity: the belt as if it had been running at
 *  exactly this speed forever, which is a straight lean and no bend at all. Used for the first
 *  painted frame and for the reduced-motion hold. */
function settle(s: BeltState, vel: number): void {
  s.vel = vel;
  for (let k = 0; k < RING; k += 1) s.ring[RING - 1 - k] = s.pos - vel * k * STEP;
  s.head = RING - 1;
}

function advance(s: BeltState, held: boolean): void {
  if (held) {
    // The hand owns the velocity outright while it is down. The drag law is suspended rather
    // than fought, which is why letting go needs no impulse: v is already the hand's.
    s.pos += s.vel * STEP;
  } else {
    const v0 = s.vel;
    s.vel = s.target + (v0 - s.target) * DECAY;
    s.pos += s.target * STEP + (v0 - s.target) * RAMP;
  }
  push(s);
}

function build(
  { context, width, height, dpr }: SceneSetupContext,
  speed: number,
  paused: boolean,
): BeltState {
  const fontPx = Math.max(FONT_MIN, Math.min(FONT_MAX, Math.round(width / FONT_PER_PX)));
  const face = `700 ${fontPx}px ${FONT_STACK}`;
  const track = fontPx * TRACK_RATIO;
  const gap = Math.round(fontPx * GAP_RATIO);

  context.font = face;
  const ascent = context.measureText('MH').actualBoundingBoxAscent;
  const cap = ascent > 0 ? ascent : fontPx * CAP_FALLBACK;
  const bandH = Math.round(cap) + BAND_PAD * 2;

  const widths = new Float64Array(WORDMARKS.length);
  const slots = new Float64Array(WORDMARKS.length);
  let run = 0;
  for (let i = 0; i < WORDMARKS.length; i += 1) {
    widths[i] = trackedWidth(context, WORDMARKS[i], track);
    slots[i] = run;
    run += widths[i] + gap;
  }

  const stripW = Math.max(1, Math.round(run * dpr));
  const rows = Math.max(ROW_STRIDE, Math.round(bandH * dpr));
  const plan: StripPlan = {
    face,
    track,
    gap,
    // Centred on the measured ascent, and clamped to the window, so a face with taller
    // capitals than expected still lands entirely inside the strip.
    baseline: (bandH + Math.min(cap, bandH - 2)) / 2,
    bandH,
    slots,
    widths,
  };

  const strip = document.createElement('canvas');
  strip.width = stripW;
  strip.height = rows;
  const stripContext = strip.getContext('2d');
  // A second 2D context is only ever refused when the browser cannot allocate one at all. The
  // strip then stays blank, rather than the state going nullable for a case that never runs.
  if (stripContext) paintStrip(stripContext, plan, dpr);

  const vmax = (LEAN_TAN * bandH) / T_READ;
  const state: BeltState = {
    clock: 0,
    carry: 0,
    vel: 0,
    pos: slots[ACCENT_AT] - width * START_AT,
    ring: new Float64Array(RING),
    head: 0,
    hand: 0,
    wasDown: false,
    strip,
    stripW,
    period: stripW / dpr,
    bandH,
    rows,
    // Clamped to the canvas, so on a short card the rail closes up instead of being drawn off
    // the top and bottom edges.
    railH: Math.max(bandH + 4, Math.min(Math.round(bandH * RAIL_RATIO), height - 8)),
    vmax,
    target: paused ? 0 : (vmax * speed) / 100,
    snap: false,
  };

  // The honest initial condition: the belt was already running at this speed before the
  // component mounted, so the first painted frame carries the steady lean and no bend.
  settle(state, state.target);

  return state;
}

function paint({ context, width, height, dpr, state, pointer }: SceneDrawContext<BeltState>): void {
  const now = performance.now() / 1000;
  const dt = state.clock === 0 ? 0 : Math.min(0.05, now - state.clock);
  state.clock = now;

  /*
   * The measured hand velocity. Screen x runs the opposite way to belt travel - the wordmarks
   * move left as travel grows - so the sign flip here is the whole mapping. A fresh press
   * clears the estimate first, or a second drag would open with the first one's flick still
   * in it.
   */
  const down = pointer.down;
  if (down && !state.wasDown) state.hand = 0;
  if (down && dt > 0) {
    const raw = -(pointer.x - pointer.lastX) / dt;
    state.hand += (raw - state.hand) * (1 - Math.exp(-dt / DRAG_TAU));
  }
  state.wasDown = down;
  if (down) {
    const limit = state.vmax * DRAG_LIMIT;
    state.vel = Math.max(-limit, Math.min(limit, state.hand));
  }

  if (state.snap && !down) {
    // Nothing to integrate: hold the lean this speed settles at. A drag is still honoured
    // above, because that motion is the reader's own rather than the page's.
    settle(state, state.target);
    state.carry = 0;
  } else {
    state.carry += dt;
    let n = 0;
    while (state.carry >= STEP && n < MAX_STEPS) {
      advance(state, down);
      state.carry -= STEP;
      n += 1;
    }
    if (n === MAX_STEPS) state.carry = 0;
  }

  const { strip, stripW, period, bandH, rows, railH } = state;
  context.clearRect(0, 0, width, height);

  const cy = Math.round(height / 2);
  const top = Math.round((cy - bandH / 2) * dpr);
  const reps = Math.ceil(width / period) + 1;

  /*
   * The readout. One blit per band, and every band asks the history for the belt as it stood
   * at its own exposure time - the middle of the rows it covers, taken from the bottom of the
   * window up. Source rows are device rows of the strip landing on the same rows at 1:1, so
   * the type is never resampled vertically, and each destination x is rounded to a whole
   * device pixel; the period is itself a whole number of device pixels, so the wrap is exact
   * and the belt has no seam.
   */
  for (let row = 0; row < rows; row += ROW_STRIDE) {
    const span = Math.min(ROW_STRIDE, rows - row);
    const age = ((row + span / 2) / rows) * T_READ;
    const travel = sampleAt(state, age);
    const shift = ((travel % period) + period) % period;
    const dy = (top + row) / dpr;
    for (let r = 0; r < reps; r += 1) {
      const x = r * period - shift;
      if (x >= width || x + period <= 0) continue;
      const dx = Math.round(x * dpr) / dpr;
      context.drawImage(strip, 0, row, stripW, span, dx, dy, period, span / dpr);
    }
  }

  // Erased rather than covered: the card behind the canvas is a gradient, so a flat colour
  // laid over the ends would show as two rectangles. Only the readout window is touched.
  const fade = Math.min(FADE, width / 5);
  context.globalCompositeOperation = 'destination-out';
  const near = context.createLinearGradient(0, 0, fade, 0);
  near.addColorStop(0, 'rgba(0, 0, 0, 1)');
  near.addColorStop(1, 'rgba(0, 0, 0, 0)');
  context.fillStyle = near;
  context.fillRect(0, top / dpr, fade, rows / dpr);
  const far = context.createLinearGradient(width - fade, 0, width, 0);
  far.addColorStop(0, 'rgba(0, 0, 0, 0)');
  far.addColorStop(1, 'rgba(0, 0, 0, 1)');
  context.fillStyle = far;
  context.fillRect(width - fade, top / dpr, fade, rows / dpr);
  context.globalCompositeOperation = 'source-over';

  /*
   * The rail the belt runs in. It does not travel, so the readout leaves it dead straight -
   * that is the asymmetry a real sensor has, and it is what makes the belt's lean legible as
   * a lean rather than as the whole picture being crooked. Drawn after the fade so the lines
   * reach the ends the wordmarks cannot.
   */
  const rail = context.createLinearGradient(0, 0, width, 0);
  rail.addColorStop(0, CLEAR);
  rail.addColorStop(0.07, HAIR);
  rail.addColorStop(0.93, HAIR);
  rail.addColorStop(1, CLEAR);
  context.fillStyle = rail;
  const half = Math.round(railH / 2);
  context.fillRect(0, cy - half, width, 1);
  context.fillRect(0, cy + half - 1, width, 1);
}

/**
 * `compact` is the 298x240 catalogue card: the same belt and the same readout window, sized for
 * that frame rather than shrunk into it. The headline, the paragraph and the speed slider are
 * dropped; the hold button stays, because the lean the strip keeps after the travel stops is the
 * whole point and a still card needs a way to show it. Both controls stay pointer-live and leave
 * the tab order, since the card's own title link is the accessible path to the item.
 */
export type ScanlineMarqueeProps = { compact?: boolean };

export function ScanlineMarquee({ compact = false }: ScanlineMarqueeProps) {
  const reduced = useReducedMotion();
  const [speed, setSpeed] = useState(SPEED_START);
  const [held, setHeld] = useState(false);
  const labelId = useId();
  const track = useRef<HTMLDivElement | null>(null);

  const { stageRef, canvasRef, requestRender } = useCanvasScene<BeltState>({
    setup: (scene: SceneSetupContext) => build(scene, speed, held),
    draw: (scene: SceneDrawContext<BeltState>) => {
      const { state } = scene;
      // Read straight off this render's closure: the hook keeps the newest `setup` and `draw`,
      // so neither of these needs a ref to see the current control values.
      state.target = held ? 0 : (state.vmax * speed) / 100;
      state.snap = reduced;
      paint(scene);
    },
  });

  // Every React value the scene reads needs one of these, or with the loop stopped the canvas
  // keeps showing the old lean. One frame is all it takes: the lean a speed settles at is a
  // closed form rather than something the solver has to converge on.
  useEffect(() => {
    requestRender();
  }, [speed, held, reduced, requestRender]);

  const clamp = (next: number) => Math.max(0, Math.min(100, next));

  const onKey = (event: KeyboardEvent<HTMLDivElement>) => {
    const jump = SPEED_GRAIN * 4;
    let next = speed;
    if (event.key === 'ArrowRight' || event.key === 'ArrowUp') next = speed + SPEED_GRAIN;
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') next = speed - SPEED_GRAIN;
    else if (event.key === 'PageUp') next = speed + jump;
    else if (event.key === 'PageDown') next = speed - jump;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = 100;
    else return;
    // Only for the keys actually handled, so Tab and the page's own shortcuts still work.
    event.preventDefault();
    setSpeed(clamp(next));
  };

  /* The pointer maps over the track's own box, and lands on the same grain the arrow keys use
   * so a drag and a keypress can never leave the readout on two different scales. */
  const fromPointer = (clientX: number) => {
    const node = track.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const frac = rect.width > 0 ? (clientX - rect.left) / rect.width : 0;
    setSpeed(clamp(Math.round((frac * 100) / SPEED_GRAIN) * SPEED_GRAIN));
  };

  const onTrackDown = (event: PointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    event.currentTarget.focus();
    fromPointer(event.clientX);
  };

  const onTrackMove = (event: PointerEvent<HTMLDivElement>) => {
    // A hover is not a drag, and capture keeps sending moves after the button is up.
    if (event.buttons === 0) return;
    fromPointer(event.clientX);
  };

  return (
    <div className="scanline-marquee-stage" data-compact={compact ? 'true' : undefined}>
      <div className="scanline-marquee-content">
        <div className="scanline-marquee-head">
          <p className="scanline-marquee-eyebrow">Trusted by</p>
          <h3 className="scanline-marquee-title">Eight studios ship on it every week</h3>
        </div>

        <div className="scanline-marquee-belt" ref={stageRef} aria-hidden="true">
          <canvas ref={canvasRef} />
        </div>

        <ul className="scanline-marquee-roll" aria-label="Companies on the belt">
          {WORDMARKS.map((name) => (
            <li key={name}>{name}</li>
          ))}
        </ul>

        <div className="scanline-marquee-foot">
          <p className="scanline-marquee-note">
            Three to forty people each, on work that goes to print and to air. Four of them moved
            off a pipeline they had written themselves; the other four have never run anything
            else. Every one of them is on the current release.
          </p>

          <div className="scanline-marquee-controls">
            <div className="scanline-marquee-speed">
              <span className="scanline-marquee-speed-label" id={labelId}>
                Belt
              </span>
              <div
                ref={track}
                className="scanline-marquee-track"
                role="slider"
                tabIndex={compact ? -1 : 0}
                aria-labelledby={labelId}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={speed}
                aria-valuetext={`${speed} percent`}
                onKeyDown={onKey}
                onPointerDown={onTrackDown}
                onPointerMove={onTrackMove}
              >
                <span className="scanline-marquee-fill" style={{ width: `${speed}%` }} />
                <span className="scanline-marquee-knob" style={{ left: `${speed}%` }} />
              </div>
              <span className="scanline-marquee-value">{speed}%</span>
            </div>

            <button
              type="button"
              className="scanline-marquee-hold"
              aria-pressed={held}
              tabIndex={compact ? -1 : undefined}
              onClick={() => setHeld((on) => !on)}
            >
              {held ? 'Let it run' : 'Hold the strip'}
            </button>
          </div>
        </div>
      </div>

      <p className="scanline-marquee-hint">Drag the strip</p>
    </div>
  );
}

export default ScanlineMarquee;
