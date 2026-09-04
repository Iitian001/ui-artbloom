'use client';

import './flock-search.css';

import { useEffect, useRef } from 'react';

import {
  useCanvasScene,
  useReducedMotion,
  type SceneDrawContext,
  type SceneSetupContext,
} from '@/hooks/use-canvas-scene';

/**
 * A search empty state whose backdrop is a real flock: four hundred Reynolds boids.
 *
 * Every bird integrates a_i = Ws·Σ r̂/|r| + Wa·(v̄ − v_i) + Wc·(x̄ − x_i), each term first turned
 * into a steering force — desired velocity at MAX_SPEED along the rule's direction, minus the
 * current velocity, clipped to MAX_FORCE — then semi-implicit Euler at a fixed 1/90 s with |v|
 * held inside a band. The three radii differ, which is the whole behaviour: separation is short
 * and stiff, alignment medium, cohesion long, so birds crowd, agree, and pull back in at
 * different distances. Collapse them to one radius and you get a blob.
 *
 * Neighbours come from a uniform spatial hash rebuilt every step, cell size equal to the largest
 * radius so a 3x3 block covers it. The obvious version — every bird against every other — is
 * 160 000 distance tests per step, roughly two million per second, and it drops frames on a
 * gallery page with other canvases running. The hash makes it about twenty candidates per bird.
 *
 * Fear is a fourth accumulator, weighted far above cohesion, so inside the pointer radius flight
 * beats company: the flock tears open instead of orbiting. Cohesion is what closes it again once
 * the cursor has passed, and that split-and-rejoin is the only proof the three rules are real.
 */

const STEP = 1 / 90;
const COUNT = 400;

const SEP_R = 13;
const ALI_R = 34;
const COH_R = 54;
const SEP_W = 2.05;
const ALI_W = 1.05;
const COH_W = 0.9;

const FEAR_R = 104;
const FEAR_R_HELD = 152;
const FEAR_W = 5.4;

const MAX_SPEED = 196;
const MIN_SPEED = 96;
const MAX_FORCE = 460;

const EDGE_MARGIN = 64;
const EDGE_ACCEL = 1150;

const KICK_ACCEL = 640;
const KICK_DECAY = 3.4;

const WARM_STEPS = 176;
const BIRD_LEN = 7.4;
const BIRD_HALF = 2.9;

interface State {
  clock: number;
  carry: number;
  snap: boolean;
  kick: number;
  width: number;
  height: number;
  cols: number;
  rows: number;
  px: Float64Array;
  py: Float64Array;
  vx: Float64Array;
  vy: Float64Array;
  cellOf: Int32Array;
  cellStart: Int32Array;
  cursor: Int32Array;
  order: Int32Array;
}

const STEER = new Float64Array(2);

/**
 * The clip is load-bearing, not tidiness. Separation divides by |r|, so two birds that land on
 * top of each other ask for an unbounded acceleration and one of them leaves the frame forever.
 */
function steer(dx: number, dy: number, vx: number, vy: number): void {
  const len = Math.hypot(dx, dy);
  if (len < 1e-6) {
    STEER[0] = 0;
    STEER[1] = 0;
    return;
  }
  let sx = (dx / len) * MAX_SPEED - vx;
  let sy = (dy / len) * MAX_SPEED - vy;
  const mag = Math.hypot(sx, sy);
  if (mag > MAX_FORCE) {
    const scale = MAX_FORCE / mag;
    sx *= scale;
    sy *= scale;
  }
  STEER[0] = sx;
  STEER[1] = sy;
}

// Seeded so the warmed first frame is the same formation on every mount and every resize.
function noise(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Counting sort of the birds into grid cells: one O(n) pass, no per-cell arrays to allocate. */
function rehash(s: State): void {
  const cells = s.cols * s.rows;
  const start = s.cellStart;
  start.fill(0);
  for (let i = 0; i < COUNT; i += 1) {
    const cx = Math.min(s.cols - 1, Math.max(0, Math.floor(s.px[i] / COH_R)));
    const cy = Math.min(s.rows - 1, Math.max(0, Math.floor(s.py[i] / COH_R)));
    const c = cy * s.cols + cx;
    s.cellOf[i] = c;
    start[c + 1] += 1;
  }
  for (let c = 0; c < cells; c += 1) {
    start[c + 1] += start[c];
  }
  s.cursor.set(start);
  for (let i = 0; i < COUNT; i += 1) {
    const c = s.cellOf[i];
    s.order[s.cursor[c]] = i;
    s.cursor[c] += 1;
  }
}

/** One fixed step. `fr` is the fear radius in pixels; zero means the pointer is off the stage. */
function advance(s: State, fx: number, fy: number, fr: number): void {
  rehash(s);
  const { px, py, vx, vy, cols, rows, cellStart, order } = s;
  let cenX = 0;
  let cenY = 0;
  if (s.kick > 0.002) {
    for (let i = 0; i < COUNT; i += 1) {
      cenX += px[i];
      cenY += py[i];
    }
    cenX /= COUNT;
    cenY /= COUNT;
  }
  for (let i = 0; i < COUNT; i += 1) {
    const x = px[i];
    const y = py[i];
    const ivx = vx[i];
    const ivy = vy[i];
    let sepX = 0;
    let sepY = 0;
    let aliX = 0;
    let aliY = 0;
    let cohX = 0;
    let cohY = 0;
    let aliN = 0;
    let cohN = 0;
    const gx = Math.min(cols - 1, Math.max(0, Math.floor(x / COH_R)));
    const gy = Math.min(rows - 1, Math.max(0, Math.floor(y / COH_R)));
    const x1 = Math.min(cols - 1, gx + 1);
    const y1 = Math.min(rows - 1, gy + 1);
    for (let cy = Math.max(0, gy - 1); cy <= y1; cy += 1) {
      for (let cx = Math.max(0, gx - 1); cx <= x1; cx += 1) {
        const c = cy * cols + cx;
        const end = cellStart[c + 1];
        for (let k = cellStart[c]; k < end; k += 1) {
          const j = order[k];
          if (j === i) {
            continue;
          }
          const dx = px[j] - x;
          const dy = py[j] - y;
          const d2 = dx * dx + dy * dy;
          if (d2 > COH_R * COH_R) {
            continue;
          }
          const d = Math.sqrt(d2);
          if (d < SEP_R) {
            // r̂/|r|, as the header says, not r̂. The accumulated direction has to be dominated by
            // the bird about to be hit; plain unit vectors let a neighbour at SEP_R outvote one at
            // two pixels and the pair never resolves. d² is floored so the divide cannot blow up.
            const crowd = 1 / Math.max(d2, 0.25);
            sepX -= dx * crowd;
            sepY -= dy * crowd;
          }
          if (d < ALI_R) {
            aliX += vx[j];
            aliY += vy[j];
            aliN += 1;
          }
          cohX += px[j];
          cohY += py[j];
          cohN += 1;
        }
      }
    }
    let ax = 0;
    let ay = 0;
    if (sepX !== 0 || sepY !== 0) {
      steer(sepX, sepY, ivx, ivy);
      ax += STEER[0] * SEP_W;
      ay += STEER[1] * SEP_W;
    }
    if (aliN > 0) {
      steer(aliX / aliN, aliY / aliN, ivx, ivy);
      ax += STEER[0] * ALI_W;
      ay += STEER[1] * ALI_W;
    }
    if (cohN > 0) {
      steer(cohX / cohN - x, cohY / cohN - y, ivx, ivy);
      ax += STEER[0] * COH_W;
      ay += STEER[1] * COH_W;
    }
    if (fr > 0) {
      const dx = x - fx;
      const dy = y - fy;
      const d = Math.hypot(dx, dy);
      // Linear falloff: a hard cutoff at the radius makes a visible circular wall of birds.
      if (d < fr) {
        steer(dx, dy, ivx, ivy);
        const w = FEAR_W * (1 - d / fr);
        ax += STEER[0] * w;
        ay += STEER[1] * w;
      }
    }
    if (s.kick > 0.002) {
      const dx = x - cenX;
      const dy = y - cenY;
      const d = Math.hypot(dx, dy);
      if (d > 1e-6) {
        const w = (KICK_ACCEL * s.kick) / d;
        ax += dx * w;
        ay += dy * w;
      }
    }
    // A linear spring in the last EDGE_MARGIN pixels. Wrapping would be cheaper but the hash has
    // no seam, so cohesion would tear the flock in half every time it crossed one.
    if (x < EDGE_MARGIN) {
      ax += EDGE_ACCEL * (1 - x / EDGE_MARGIN);
    } else if (x > s.width - EDGE_MARGIN) {
      ax -= EDGE_ACCEL * (1 - (s.width - x) / EDGE_MARGIN);
    }
    if (y < EDGE_MARGIN) {
      ay += EDGE_ACCEL * (1 - y / EDGE_MARGIN);
    } else if (y > s.height - EDGE_MARGIN) {
      ay -= EDGE_ACCEL * (1 - (s.height - y) / EDGE_MARGIN);
    }
    let nvx = ivx + ax * STEP;
    let nvy = ivy + ay * STEP;
    const sp = Math.hypot(nvx, nvy);
    if (sp > MAX_SPEED) {
      nvx *= MAX_SPEED / sp;
      nvy *= MAX_SPEED / sp;
    } else if (sp < 1e-6) {
      nvx = MIN_SPEED;
      nvy = 0;
    } else if (sp < MIN_SPEED) {
      // A stalled boid stops being one: its neighbours read a dead heading as a vote to stop too.
      nvx *= MIN_SPEED / sp;
      nvy *= MIN_SPEED / sp;
    }
    vx[i] = nvx;
    vy[i] = nvy;
    px[i] = x + nvx * STEP;
    py[i] = y + nvy * STEP;
  }
  s.kick *= Math.exp(-STEP * KICK_DECAY);
}

/** `compact` is the 298x240 catalogue-card variant: presentation only, no physics change. */
export type FlockSearchProps = { compact?: boolean };

export function FlockSearch({ compact = false }: FlockSearchProps) {
  const reduced = useReducedMotion();
  const kickRef = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const setup = ({ width, height }: SceneSetupContext): State => {
    const cols = Math.max(1, Math.ceil(width / COH_R));
    const rows = Math.max(1, Math.ceil(height / COH_R));
    const cells = cols * rows;
    const state: State = {
      clock: 0,
      carry: 0,
      snap: false,
      kick: 0,
      width,
      height,
      cols,
      rows,
      px: new Float64Array(COUNT),
      py: new Float64Array(COUNT),
      vx: new Float64Array(COUNT),
      vy: new Float64Array(COUNT),
      cellOf: new Int32Array(COUNT),
      cellStart: new Int32Array(cells + 1),
      cursor: new Int32Array(cells + 1),
      order: new Int32Array(COUNT),
    };
    // Three loose squadrons, not a uniform sprinkle: cohesion has something to find in the first
    // few steps, so the warm-up ends in lanes rather than in a cloud still deciding what it is.
    const rand = noise(0x5eed17);
    for (let i = 0; i < COUNT; i += 1) {
      const g = i % 3;
      const heading = g * 2.1 + (rand() - 0.5) * 0.7;
      const sx = width * (0.26 + 0.24 * g) + (rand() - 0.5) * width * 0.26;
      const sy = height * (0.3 + 0.2 * (g % 2)) + (rand() - 0.5) * height * 0.36;
      state.px[i] = Math.min(width - 4, Math.max(4, sx));
      state.py[i] = Math.min(height - 4, Math.max(4, sy));
      const speed = MIN_SPEED + rand() * (MAX_SPEED - MIN_SPEED);
      state.vx[i] = Math.cos(heading) * speed;
      state.vy[i] = Math.sin(heading) * speed;
    }
    // A gallery gives a scroller about a second, and boids need longer than that to organise, so
    // WARM_STEPS of the real solver runs here. Frame one is already a flock. This is also the
    // reduced-motion frame: there is no closed-form rest state to draw instead.
    for (let n = 0; n < WARM_STEPS; n += 1) {
      advance(state, 0, 0, 0);
    }
    return state;
  };

  const draw = ({ context, width, height, state, pointer }: SceneDrawContext<State>) => {
    state.snap = reduced;
    const now = performance.now() / 1000;
    const dt = state.clock === 0 ? 0 : Math.min(0.05, now - state.clock);
    state.clock = now;
    if (kickRef.current > 0) {
      kickRef.current = 0;
      // Latched only if something will integrate it away. Under reduced motion `advance` never
      // runs, so a stored 1 would sit on state and fire as a stale burst if the loop ever resumed.
      if (!state.snap) {
        state.kick = 1;
      }
    }
    const fear = pointer.inside ? (pointer.down ? FEAR_R_HELD : FEAR_R) : 0;
    if (!state.snap) {
      state.carry += dt;
      let n = 0;
      while (state.carry >= STEP && n < 8) {
        advance(state, pointer.x, pointer.y, fear);
        state.carry -= STEP;
        n += 1;
      }
      if (n === 8) {
        state.carry = 0;
      }
    }

    context.clearRect(0, 0, width, height);
    if (fear > 0) {
      context.strokeStyle = 'rgba(255, 201, 120, 0.14)';
      context.lineWidth = 1;
      context.beginPath();
      context.arc(pointer.x, pointer.y, fear, 0, Math.PI * 2);
      context.stroke();
    }

    // Two paths, two fills: the birds inside the fear radius are the ones worth colouring, and
    // batching them beats 400 separate fill calls by more than the extra pass costs.
    const calm = new Path2D();
    const spooked = new Path2D();
    for (let i = 0; i < COUNT; i += 1) {
      const x = state.px[i];
      const y = state.py[i];
      const speed = Math.hypot(state.vx[i], state.vy[i]);
      const hx = speed > 1e-6 ? state.vx[i] / speed : 1;
      const hy = speed > 1e-6 ? state.vy[i] / speed : 0;
      const hot = fear > 0 && Math.hypot(x - pointer.x, y - pointer.y) < fear;
      const path = hot ? spooked : calm;
      const bx = x - hx * BIRD_LEN * 0.38;
      const by = y - hy * BIRD_LEN * 0.38;
      path.moveTo(x + hx * BIRD_LEN * 0.62, y + hy * BIRD_LEN * 0.62);
      path.lineTo(bx - hy * BIRD_HALF, by + hx * BIRD_HALF);
      path.lineTo(bx + hy * BIRD_HALF, by - hx * BIRD_HALF);
      path.closePath();
    }
    context.fillStyle = 'rgba(196, 214, 240, 0.82)';
    context.fill(calm);
    context.fillStyle = 'rgba(255, 201, 120, 0.96)';
    context.fill(spooked);

    // Over the birds, not under them: 400 moving triangles behind a 1.5rem heading is the busiest
    // thing on the card, and a text-shadow alone loses at the centre.
    const veil = context.createRadialGradient(
      width / 2,
      height / 2,
      0,
      width / 2,
      height / 2,
      Math.max(120, Math.min(width, height * 1.6) * 0.56),
    );
    veil.addColorStop(0, 'rgba(6, 9, 16, 0.82)');
    veil.addColorStop(0.6, 'rgba(6, 9, 16, 0.36)');
    veil.addColorStop(1, 'rgba(6, 9, 16, 0)');
    context.fillStyle = veil;
    context.fillRect(0, 0, width, height);
  };

  const { stageRef, canvasRef, requestRender } = useCanvasScene<State>({ setup, draw });
  useEffect(() => requestRender(), [reduced, requestRender]);

  // The keyboard path into the physics: no pointer coordinates to borrow, so the impulse is radial
  // from the flock's own centroid and decays as exp(-t/KICK_DECAY). The flock scatters and re-forms.
  const scatter = () => {
    kickRef.current = 1;
    requestRender();
  };

  const applyTerm = (term: string) => {
    const input = inputRef.current;
    if (input) {
      input.value = term;
      input.focus();
    }
    scatter();
  };

  return (
    <div className="flock-search-stage" data-compact={compact ? 'true' : undefined}>
      <div ref={stageRef} className="flock-search-surface">
        <canvas ref={canvasRef} aria-hidden="true" />
      </div>
      <div className="flock-search-content">
        <p className="flock-search-eyebrow">No results</p>
        <h2 className="flock-search-title">Nothing matched that search</h2>
        <p className="flock-search-help">
          Try a shorter term, or search by tag. Every component is indexed by name, category and the
          equation it integrates.
        </p>
        <form
          className="flock-search-field"
          role="search"
          onSubmit={(event) => {
            event.preventDefault();
            scatter();
          }}
        >
          <input
            ref={inputRef}
            className="flock-search-input"
            type="search"
            name="q"
            aria-label="Search the catalogue"
            placeholder="Search 214 components"
            defaultValue="verlet nav"
            tabIndex={compact ? -1 : undefined}
          />
          <button className="flock-search-go" type="submit" tabIndex={compact ? -1 : undefined}>
            Search
          </button>
        </form>
        <ul className="flock-search-tries" aria-label="Suggested searches">
          {['spatial hash', 'stick-slip', 'verlet cloth'].map((term) => (
            <li key={term}>
              <button
                className="flock-search-try"
                type="button"
                tabIndex={compact ? -1 : undefined}
                onClick={() => applyTerm(term)}
              >
                {term}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <p className="flock-search-hint">move through the flock</p>
    </div>
  );
}

export default FlockSearch;
