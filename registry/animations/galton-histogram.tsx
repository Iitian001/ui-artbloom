'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { useCanvasScene, useReducedMotion } from '@/hooks/use-canvas-scene';

import './galton-histogram.css';

/**
 * Galton histogram — the ratings breakdown on a product page, where the five bars are the
 * tally of balls that have actually fallen through a four-row Galton board.
 *
 * The solve is the sampling law, not the fall. A ball takes ROWS independent Bernoulli(P)
 * decisions, so the bin it ends in is k ~ Binomial(ROWS, P) with mass C(n,k)·p^k·q^(n−k), and
 * the star is k + 1. Nothing here draws that shape: the bars are counts, incremented one at a
 * time as a ball is absorbed.
 *
 * What it is not: five widths tweened to five target percentages. Two consequences a tween
 * cannot have. The bars wobble, and the wobble shrinks as 1/sqrt(N). And the toggle changes
 * nothing but N: the last WINDOW trials and every trial ever are one process read at two
 * sample sizes, so the short window jitters by sqrt(N/WINDOW) times as much as the long one.
 * A few thousand trials in, that is a factor of four, visible without being told.
 *
 * The board is not drawn. It is still there — the fall is what hands each trial to the tally —
 * but the card shows only the average, the count and the five bars.
 */

const STEP = 1 / 120; // Ballistic, not stiff. Nothing here is stiff.
const MAX_STEPS = 12; // 0.1s of catch-up, which is a fifth of one fall.
const ROWS = 4; // Four decisions is five outcomes is five stars. That is the whole reason.
const BINS = ROWS + 1;
const P = 0.79; // Bernoulli bias. Puts the mean at 4.16 stars, which is what a real page shows.
const WINDOW = 240; // The short reading. Small enough to visibly jitter, big enough to read.
const SPAWN = 0.1; // s between arrivals, so about ten reviews a second at rest.
const RUSH = 8; // Press-and-hold multiplier. Buys a factor of ~3 on the interval in ten seconds.
const MAX_BALLS = 96;
const GRAV = 30; // In row-heights per second squared, so the fall scales with the board.
const PUBLISH = 0.25; // s between handing numbers to React. The bars are written every frame.
const SEED_N = 180; // Trials the scene starts from, so the first frame is not an empty chart.
const CALM = 6000; // Reduced motion: the sample size at which the answer stops moving.

// The mass the tally is an estimate of. Computed, not tabulated, so changing ROWS or P cannot
// leave a hand-written table behind to disagree with the balls.
function pmf(): number[] {
  const out: number[] = [];
  for (let k = 0; k <= ROWS; k += 1) {
    let c = 1;
    for (let i = 0; i < k; i += 1) {
      c = (c * (ROWS - i)) / (i + 1);
    }
    out.push(c * Math.pow(P, k) * Math.pow(1 - P, ROWS - k));
  }
  return out;
}

const PMF = pmf();

// A deterministic tally for the first render. The scene replaces it within a frame with real
// trials, but server and client have to agree on the markup before that, so this cannot be
// sampled — it is the expectation, rounded.
function expect(n: number): number[] {
  return PMF.map((p) => Math.round(p * n));
}

const SEED = expect(SEED_N);

interface Reading {
  readonly counts: readonly number[];
  readonly n: number;
}

const total = (counts: readonly number[]): number => counts.reduce((a, b) => a + b, 0);

const SEED_READING: Reading = { counts: SEED, n: total(SEED) };

// One ball. Between two pegs it is in free flight, so x is uniform in time and y is not.
interface Ball {
  k: number; // decisions taken to the right, which is the column
  row: number; // 0..ROWS; at ROWS it is in a bin, falling onto the pile
  x: number;
  x0: number;
  x1: number;
  y: number;
  vy: number;
  t: number; // s into this hop
  span: number; // s this hop takes, from the fall time for one row height
  goal: number; // y this hop ends at
}

// Where the board is, in card pixels. The floor is not a constant: it is measured off the top
// of the DOM block that holds the numbers, so the stylesheet owns that number and this file
// cannot disagree with it.
interface Board {
  readonly cx: number;
  readonly top: number;
  readonly rowH: number;
  readonly pitch: number; // horizontal spacing between adjacent columns, so a hop is pitch/2
  readonly mouth: number; // y where the last peg row hands the ball to a bin
  readonly floor: number;
  readonly g: number; // px/s², from GRAV row-heights, so the fall time is width-independent
}

interface GaltonState {
  readonly board: Board;
  readonly balls: Ball[];
  readonly all: number[]; // every trial since setup
  readonly win: number[]; // the last WINDOW of them
  readonly ring: Int8Array;
  allN: number;
  ringAt: number;
  ringN: number;
  since: number; // s of arrival budget not yet spent
  rush: number;
  carry: number;
  clock: number;
  pub: number;
  short: boolean;
  snap: boolean;
  postedN: number;
}

// One trial is ROWS coin flips, which is the definition and not a shortcut: the ball that
// falls takes the same ROWS decisions, one per peg row.
function trial(): number {
  let k = 0;
  for (let i = 0; i < ROWS; i += 1) {
    if (Math.random() < P) {
      k += 1;
    }
  }
  return k;
}

// The column a ball occupies. At row r there are r + 1 of them, half a pitch apart from the
// row above, which is why one decision moves the ball pitch/2 and not pitch.
const columnX = (board: Board, k: number, row: number): number =>
  board.cx + (k - row / 2) * board.pitch;

const reading = (state: GaltonState): number[] => (state.short ? state.win : state.all);

// Where a ball comes to rest in a bin: the more trials that bin already holds, the shallower
// its last drop. Same counts as the bar in the row, scaled to the largest bin — one tally.
function pileTop(state: GaltonState, k: number): number {
  const counts = reading(state);
  let max = 1;
  for (let i = 0; i < BINS; i += 1) {
    if (counts[i] > max) {
      max = counts[i];
    }
  }
  const depth = state.board.floor - state.board.mouth - 3;
  return state.board.floor - (counts[k] / max) * depth;
}

function record(state: GaltonState, k: number): void {
  state.all[k] += 1;
  state.allN += 1;
  const at = state.ringAt;
  if (state.ringN === WINDOW) {
    state.win[state.ring[at]] -= 1; // the trial leaving the window, not a decay factor
  } else {
    state.ringN += 1;
  }
  state.ring[at] = k;
  state.win[k] += 1;
  state.ringAt = (at + 1) % WINDOW;
}

function build(width: number, height: number, bodyTop: number, short: boolean, snap: boolean): GaltonState {
  const top = 14;
  const floor = Math.max(top + 92, (bodyTop > 0 ? bodyTop : height * 0.42) - 12);
  const room = floor - top;
  const binDepth = Math.min(34, Math.max(20, room * 0.24));
  const rowH = (room - binDepth) / ROWS;
  const pitch = Math.min(38, Math.max(16, (width - 34) / BINS));
  const board: Board = {
    cx: width / 2,
    top,
    rowH,
    pitch,
    mouth: top + ROWS * rowH,
    floor,
    g: GRAV * rowH,
  };
  const state: GaltonState = {
    board,
    balls: [],
    all: snap ? expect(CALM) : [0, 0, 0, 0, 0],
    win: snap ? expect(WINDOW) : [0, 0, 0, 0, 0],
    ring: new Int8Array(WINDOW),
    allN: 0,
    ringAt: 0,
    ringN: snap ? WINDOW : 0,
    since: 0,
    rush: 1,
    carry: 0,
    clock: 0,
    pub: PUBLISH, // publish on the first frame, whatever the seed turned out to be
    short,
    snap,
    postedN: -1,
  };
  if (snap) {
    state.allN = total(state.all);
    return state;
  }
  for (let i = 0; i < SEED_N; i += 1) {
    record(state, trial());
  }
  return state;
}

// Start the next leg from wherever the ball has just arrived. The decision is taken here, once
// per peg row, and it is the only random number in the fall: the arc itself is not sampled.
function hop(state: GaltonState, ball: Ball): void {
  const b = state.board;
  ball.x0 = ball.x;
  ball.y = ball.goal; // snap to the row, so four hops cannot accumulate integration error
  ball.t = 0;
  if (ball.row < ROWS) {
    if (Math.random() < P) {
      ball.k += 1;
    }
    ball.row += 1;
    ball.x1 = columnX(b, ball.k, ball.row);
    ball.goal = b.top + ball.row * b.rowH;
  } else {
    ball.row = BINS; // past the last peg row: straight down onto the pile it will join
    ball.x1 = columnX(b, ball.k, ROWS);
    ball.goal = pileTop(state, ball.k);
  }
  // Time to fall the gap from the speed it already has. This is what makes the lower rows
  // quick: vy is carried across pegs, never reset.
  ball.span = (Math.sqrt(ball.vy * ball.vy + 2 * b.g * (ball.goal - ball.y)) - ball.vy) / b.g;
}

function spawn(state: GaltonState): void {
  const b = state.board;
  const y = b.top - b.rowH;
  state.balls.push({
    k: 0,
    row: 0,
    x: b.cx,
    x0: b.cx,
    x1: b.cx,
    y,
    vy: 0,
    t: 0,
    span: Math.sqrt((2 * b.rowH) / b.g),
    goal: b.top,
  });
}

// Returns true when the ball has been absorbed, which is the moment the tally changes.
function advance(state: GaltonState, ball: Ball, dt: number): boolean {
  const b = state.board;
  ball.t += dt;
  ball.vy += b.g * dt;
  ball.y += ball.vy * dt;
  const f = ball.span > 0 ? Math.min(1, ball.t / ball.span) : 1;
  ball.x = ball.x0 + (ball.x1 - ball.x0) * f; // uniform in time: free flight has no ax
  if (ball.y < ball.goal) {
    return false;
  }
  if (ball.row === BINS) {
    record(state, ball.k);
    return true;
  }
  hop(state, ball);
  return false;
}

function step(state: GaltonState, dt: number): void {
  if (state.snap) {
    return;
  }
  state.since += dt * state.rush;
  while (state.since >= SPAWN && state.balls.length < MAX_BALLS) {
    state.since -= SPAWN;
    spawn(state);
  }
  if (state.since > SPAWN) {
    state.since = SPAWN; // held at the cap: drop the backlog rather than firing it later
  }
  for (let i = state.balls.length - 1; i >= 0; i -= 1) {
    if (advance(state, state.balls[i], dt)) {
      state.balls.splice(i, 1);
    }
  }
}

const mean = (counts: readonly number[], n: number): number => {
  if (n <= 0) {
    return 0;
  }
  let sum = 0;
  for (let k = 0; k < BINS; k += 1) {
    sum += k * counts[k];
  }
  return sum / n;
};

// Rows read downward from five stars; bins count upward from k = 0. Row i is bin ROWS − i, and
// the refs stay indexed by bin so the writer below never has to think about it.
const ROW_BINS = [4, 3, 2, 1, 0];

// Per-frame, and the only per-frame write into the DOM. A scaleX on a positioned child does
// not lay the row out again, and the threshold keeps a settled bar from being touched at all.
function writeBars(nodes: Array<HTMLDivElement | null>, painted: number[], counts: readonly number[]): void {
  let max = 1;
  for (let i = 0; i < BINS; i += 1) {
    if (counts[i] > max) {
      max = counts[i];
    }
  }
  for (let i = 0; i < BINS; i += 1) {
    const v = counts[i] / max;
    if (Math.abs(v - painted[i]) < 0.002) {
      continue;
    }
    painted[i] = v;
    const node = nodes[i];
    if (node) {
      node.style.transform = 'scaleX(' + v.toFixed(4) + ')';
    }
  }
}

// Grouped by hand rather than by toLocaleString, which can disagree between the server render
// and the browser and take the whole tree down with a hydration mismatch.
const group = (n: number): string => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

/** `compact` is the 298x240 catalogue card: the same board, the same five rows and the same
 *  press-and-hold, with the hint dropped and the numbers tightened. The board's geometry is
 *  measured off the first line of copy and clamped to a fixed 92px of fall, so it is the same
 *  board at either size — see `galton-histogram.css`. */
export type GaltonHistogramProps = { compact?: boolean };

export function GaltonHistogram({ compact = false }: GaltonHistogramProps) {
  const reduced = useReducedMotion();
  const [short, setShort] = useState(false);
  const [shown, setShown] = useState<Reading>(SEED_READING);
  const headRef = useRef<HTMLParagraphElement | null>(null);
  const fillRefs = useRef<Array<HTMLDivElement | null>>([]);
  const paintedRef = useRef<number[]>([0, 0, 0, 0, 0]);
  const shortRef = useRef(false);

  const { stageRef, canvasRef, requestRender } = useCanvasScene<GaltonState>({
    // The geometry comes off the first line of copy, not off the block that holds it: the block
    // starts at the top of the card, so the stylesheet and not this file decides where it ends.
    setup: ({ width, height }) =>
      build(width, height, headRef.current ? headRef.current.offsetTop : 0, shortRef.current, reduced),
    draw: ({ context, width, height, state, pointer }) => {
      if (state.short !== shortRef.current) {
        state.short = shortRef.current;
        state.postedN = -1; // the reading changed without a trial arriving, so force one publish
      }
      state.rush = pointer.down ? RUSH : 1;
      if (!state.snap) {
        const now = performance.now();
        const dt = state.clock ? Math.min(0.05, (now - state.clock) / 1000) : STEP;
        state.clock = now;
        state.carry += dt;
        let taken = 0;
        while (state.carry >= STEP && taken < MAX_STEPS) {
          step(state, STEP);
          state.carry -= STEP;
          taken += 1;
        }
        if (state.carry > STEP * MAX_STEPS) {
          state.carry = 0; // back from a background tab: do not pour the missing minute in
        }
        state.pub += dt;
      }
      const counts = reading(state);
      writeBars(fillRefs.current, paintedRef.current, counts);
      if (state.pub >= PUBLISH && state.allN !== state.postedN) {
        // Four times a second, not sixty. The bars are the fast channel; the numbers beside
        // them only have to be readable, and a re-render per trial would be neither.
        state.pub = 0;
        state.postedN = state.allN;
        setShown({ counts: counts.slice(), n: state.short ? state.ringN : state.allN });
      }
      // Nothing is drawn: the fall runs so the tally is real, and the rows are the only output.
      context.clearRect(0, 0, width, height);
    },
  });

  const pick = useCallback((next: boolean) => {
    setShort(next);
  }, []);

  // The loop reads the window through a ref, so the press has to poke the renderer too — under
  // reduced motion there is no loop running to notice the change.
  useEffect(() => {
    shortRef.current = short;
    requestRender();
  }, [short, reduced, requestRender]);

  const avg = mean(shown.counts, shown.n) + 1;

  return (
    <div className="galton-histogram-stage" data-compact={compact ? 'true' : undefined}>
      <div className="galton-histogram-card">
        <div className="galton-histogram-well" ref={stageRef} aria-hidden="true">
          <canvas ref={canvasRef} />
        </div>
        <div className="galton-histogram-body">
          <p className="galton-histogram-label" ref={headRef}>
            Customer ratings
          </p>
          <div className="galton-histogram-headline">
            <span className="galton-histogram-mean">{avg.toFixed(2)}</span>
            <span className="galton-histogram-outof">out of 5</span>
            <span className="galton-histogram-total">{group(shown.n)} ratings</span>
          </div>
          <ul className="galton-histogram-rows">
            {ROW_BINS.map((bin) => {
              const share = shown.n > 0 ? shown.counts[bin] / shown.n : 0;
              return (
                <li className="galton-histogram-row" key={bin}>
                  <span className="galton-histogram-star">{bin + 1}★</span>
                  <div className="galton-histogram-track" aria-hidden="true">
                    <div
                      className="galton-histogram-fill"
                      ref={(el) => {
                        fillRefs.current[bin] = el;
                      }}
                    />
                  </div>
                  <span className="galton-histogram-share">{(share * 100).toFixed(1)}%</span>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="galton-histogram-foot">
          <button
            type="button"
            className="galton-histogram-button"
            aria-pressed={!short}
            /* Still pressable in a card, but out of the tab order: the card frame is
               aria-hidden, and a focusable node inside one is a trap with no label. */
            tabIndex={compact ? -1 : undefined}
            onClick={() => pick(false)}
          >
            All time
          </button>
          <button
            type="button"
            className="galton-histogram-button"
            aria-pressed={short}
            tabIndex={compact ? -1 : undefined}
            onClick={() => pick(true)}
          >
            Recent
          </button>
        </div>
        <p className="galton-histogram-hint">Hold to load more</p>
      </div>
    </div>
  );
}

export default GaltonHistogram;
