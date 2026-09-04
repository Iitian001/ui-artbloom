'use client';

import './balance-progress.css';

import { useEffect, useState } from 'react';

import { useCanvasScene, useReducedMotion, type SceneDrawContext, type SceneSetupContext } from '@/hooks/use-canvas-scene';

/**
 * A five-stage release bar whose fill is carried by a cart balancing an inverted pole.
 *
 * The pair integrated here is the exact nonlinear cart-pole, not the small-angle version: the
 * shared 1 / (m_cart + m_pole) term couples the bodies both ways, the pole's angular acceleration
 * is subtracted back out of the cart, and the m_pole cos^2 term sits inside the effective inertia.
 * Linearising is easier and is also false at the angles this reaches — fourteen degrees on a stage
 * change, far more under a drag — where the reaction on the cart is most of what sells the mass.
 *
 * Steering is a cascade: a fast PD loop on pole angle (about 12 rad/s) inside a slow proportional
 * loop on cart position (about 4 rad/s). The outer loop cannot command travel, only lean, so
 * pressing a stage sends the cart the WRONG WAY first to topple the pole toward the target, then
 * chases it. That backwards step is the plant's right-half-plane zero, not a flourish. The clamp is
 * on force, never on angle: clamping the angle deletes the pole's mass and leaves a tween.
 */

const STEP = 1 / 150;
const STAGES = ['Draft', 'Review', 'Build', 'Canary', 'Live'];
const MASS_CART = 1;
const MASS_POLE = 0.14;
const POLE_HALF = 0.3; // half-length of a uniform rod, which is what the 4/3 inertia term assumes
const GRAVITY = 9.81;
const CART_DRAG = 0.6; // viscous, not Coulomb: sign(v) chatters at a fixed step and jams the cart
const POLE_DAMP = 0.006;
const GAIN_ANGLE = 70; // inner PD -> omega_n 11.9 rad/s, zeta 0.8, DC gain 1.19 on the lean ask
const GAIN_RATE = 7.9;
const GAIN_POS = 1.4; // outer P -> omega_n 4 rad/s, three times slower so the cascade holds
const GAIN_VEL = 0.7;
const MAX_TILT = 0.2; // radians of lean the outer loop may ask for
const MAX_FORCE = 24; // newtons at the wheels; the only clamp in the loop
const MAX_SPIN = 6; // a drag can never hand the pole more than this, so recovery always exists
const KICK = 9; // rad/s of tip spin per world unit of pointer travel
const WALL = 1.06;
const TRAIL = 26;
const WARM = 84; // 0.56 s of the real solver before the first paint
const ACCENT = '255, 196, 107';

interface State {
  clock: number;
  carry: number;
  snap: boolean;
  x: number; // cart position, world units; -1 and +1 are the ends of the bar
  xd: number;
  th: number; // pole angle from upright, positive leaning toward +x
  thd: number;
  force: number;
  target: number;
  kick: number; // pointer travel waiting to be handed to the pole as spin
  trail: Float64Array; // tip path in world units: x absolute, y measured down from the pivot line
  head: number;
}

const clamp = (v: number, lo: number, hi: number) => (v < lo ? lo : v > hi ? hi : v);

const worldOf = (stage: number) => -1 + stage * (2 / (STAGES.length - 1));

/**
 * theta'' = (g sin t - cos t * S - d theta') / (l (4/3 - m_p cos^2 t / M))
 *     x'' = S - m_p l theta'' cos t / M,  where S = (F - b x' + m_p l theta'^2 sin t) / M
 *
 * The denominator bottoms out at l (4/3 - m_p / M) = 0.363, so it can never reach zero and no
 * guard is needed there. Semi-implicit order — rate first, then position — because plain Euler
 * pumps energy into the pole at this stiffness and the pole slowly spins itself up.
 */
function advance(s: State) {
  const lean = clamp(GAIN_POS * (s.target - s.x) - GAIN_VEL * s.xd, -MAX_TILT, MAX_TILT);
  s.force = clamp(GAIN_ANGLE * (s.th - lean) + GAIN_RATE * s.thd, -MAX_FORCE, MAX_FORCE);
  const c = Math.cos(s.th);
  const sn = Math.sin(s.th);
  const total = MASS_CART + MASS_POLE;
  const shared = (s.force - CART_DRAG * s.xd + MASS_POLE * POLE_HALF * s.thd * s.thd * sn) / total;
  const thAcc =
    (GRAVITY * sn - c * shared - POLE_DAMP * s.thd) /
    (POLE_HALF * (4 / 3 - (MASS_POLE * c * c) / total));
  const xAcc = shared - (MASS_POLE * POLE_HALF * thAcc * c) / total;
  s.thd += thAcc * STEP;
  s.th += s.thd * STEP;
  // Wrap into (-pi, pi]. The inner loop reads this angle raw, so an unwrapped one is fatal: once a
  // hard drag carries the pole over the top, the error keeps counting up past 2pi, the force pins
  // at +MAX_FORCE against the wall and the pole windmills for good. sin and cos do not care about
  // the wrap, so nothing drawn changes. One step moves at most MAX_SPIN * STEP = 0.04 rad, so a
  // single correction always lands inside the range.
  if (s.th > Math.PI) {
    s.th -= 2 * Math.PI;
  } else if (s.th < -Math.PI) {
    s.th += 2 * Math.PI;
  }
  s.xd += xAcc * STEP;
  s.x += s.xd * STEP;
  // Hard stops at the bar ends, so an overshoot can never draw the cart off its own track.
  if (s.x > WALL) {
    s.x = WALL;
    s.xd = Math.min(0, s.xd);
  } else if (s.x < -WALL) {
    s.x = -WALL;
    s.xd = Math.max(0, s.xd);
  }
}

function pushTip(s: State) {
  const len = 2 * POLE_HALF;
  s.trail[s.head * 2] = s.x + Math.sin(s.th) * len;
  s.trail[s.head * 2 + 1] = -Math.cos(s.th) * len;
  s.head = (s.head + 1) % TRAIL;
}

function capsule(context: CanvasRenderingContext2D, x0: number, x1: number, y: number, r: number) {
  // Ordered ends, because the force readout is drawn backwards half the time and an unordered
  // pair would collapse the left-pointing case to a dot — the very frames worth seeing.
  const a = Math.min(x0, x1);
  const b = Math.max(x0, x1);
  context.beginPath();
  context.arc(a, y, r, Math.PI / 2, -Math.PI / 2);
  context.arc(b, y, r, -Math.PI / 2, Math.PI / 2);
  context.closePath();
  context.fill();
}

/** `compact` is the 298x240 catalogue-card variant: presentation only, all of it CSS. */
export type BalanceProgressProps = { compact?: boolean };

export function BalanceProgress({ compact = false }: BalanceProgressProps) {
  const reduced = useReducedMotion();
  const [stage, setStage] = useState(2);

  // Typed without binding the argument: the warm-up is pure physics in world units and needs no
  // geometry, and an unused parameter fails the build.
  const setup: (c: SceneSetupContext) => State = () => {
    const s: State = {
      clock: 0,
      carry: 0,
      snap: reduced,
      x: worldOf(0),
      xd: 0,
      th: 0,
      thd: 0,
      force: 0,
      target: worldOf(stage),
      kick: 0,
      trail: new Float64Array(TRAIL * 2),
      head: 0,
    };
    if (reduced) {
      s.x = s.target;
      return s;
    }
    // Warm the real solver so the first painted frame is already mid-transit and leaning, and seed
    // the tip streak from it — nothing here is a shortcut around the loop, it IS the loop.
    for (let i = 0; i < WARM; i += 1) {
      advance(s);
      if (i % 3 === 0) pushTip(s);
    }
    return s;
  };

  const draw = ({ context, width, height, state, pointer }: SceneDrawContext<State>) => {
    const now = performance.now() / 1000;
    const dt = state.clock === 0 ? 0 : Math.min(0.05, now - state.clock);
    state.clock = now;
    state.target = worldOf(stage);

    const mid = width / 2;
    const trackY = Math.round(Math.min(height - 92, height * 0.7));
    // Width sets the scale and height caps it. The pole is 0.6 world units long, so on a wide,
    // short card an uncapped scale swings the tip out through the top of the stage, where
    // overflow: hidden eats it. The floor keeps the pointer-to-world division finite.
    const scale = Math.max(48, Math.min((width - 92) / 2, (trackY - 46) / (2 * POLE_HALF)));
    const px = (wx: number) => mid + wx * scale;

    if (state.snap) {
      state.x = state.target;
      state.xd = 0;
      state.th = 0;
      state.thd = 0;
      state.force = 0;
    } else {
      if (pointer.down && pointer.inside) {
        state.kick += ((pointer.x - pointer.lastX) / scale) * KICK;
      }
      if (state.kick !== 0) {
        // Spend the whole frame's drag as one impulse on the tip. Capping the resulting spin is
        // what keeps a furious drag inside the envelope the clamped force can still recover from.
        state.thd = clamp(state.thd + clamp(state.kick, -1.6, 1.6), -MAX_SPIN, MAX_SPIN);
        state.kick = 0;
      }
      state.carry += dt;
      let n = 0;
      while (state.carry >= STEP && n < 8) {
        advance(state);
        state.carry -= STEP;
        n += 1;
      }
      if (n === 8) {
        state.carry = 0;
      }
      pushTip(state);
    }

    context.clearRect(0, 0, width, height);
    const cartX = px(state.x);

    context.fillStyle = 'rgba(255, 255, 255, 0.075)';
    capsule(context, px(-1), px(1), trackY, 4.5);
    context.fillStyle = `rgba(${ACCENT}, 0.82)`;
    capsule(context, px(-1), Math.max(px(-1), cartX), trackY, 4.5);

    for (let i = 0; i < STAGES.length; i += 1) {
      const wx = worldOf(i);
      const passed = state.x >= wx - 0.012;
      context.fillStyle = passed ? 'rgba(10, 14, 23, 0.85)' : 'rgba(255, 255, 255, 0.24)';
      context.beginPath();
      context.arc(px(wx), trackY, 2.6, 0, Math.PI * 2);
      context.fill();
    }

    context.strokeStyle = `rgba(${ACCENT}, 0.4)`;
    context.lineWidth = 1;
    context.setLineDash([3, 4]);
    context.beginPath();
    context.moveTo(px(state.target), trackY - 44);
    context.lineTo(px(state.target), trackY + 30);
    context.stroke();
    context.setLineDash([]);

    // The force the inner loop is actually asking for, drawn from the cart it acts on. On a stage
    // change it points away from the dashed target for the first third of a second; that is the
    // whole mechanism, so it is on screen rather than in the console.
    const clipped = Math.abs(state.force) > MAX_FORCE - 0.05;
    context.fillStyle = clipped ? 'rgba(255, 255, 255, 0.6)' : `rgba(${ACCENT}, 0.5)`;
    capsule(context, cartX, cartX + state.force * 1.4, trackY + 20, 1.5);

    const wheelR = 5.5;
    const wheelY = trackY - 10;
    const spin = (state.x * scale) / wheelR; // kinematic: no rolling constraint is solved, it reads
    for (let i = -1; i <= 1; i += 2) {
      const wx = cartX + i * 8;
      context.fillStyle = 'rgba(12, 17, 27, 0.95)';
      context.strokeStyle = 'rgba(255, 255, 255, 0.32)';
      context.lineWidth = 1.4;
      context.beginPath();
      context.arc(wx, wheelY, wheelR, 0, Math.PI * 2);
      context.fill();
      context.stroke();
      context.beginPath();
      context.moveTo(wx - Math.cos(spin) * 3.6, wheelY - Math.sin(spin) * 3.6);
      context.lineTo(wx + Math.cos(spin) * 3.6, wheelY + Math.sin(spin) * 3.6);
      context.stroke();
    }

    context.fillStyle = '#e8edf7';
    capsule(context, cartX - 13, cartX + 13, trackY - 22, 8);

    const pivotY = trackY - 30;
    const poleLen = 2 * POLE_HALF * scale;

    // Tip history is absolute, so the streak is the path the mass took across the bar rather than
    // a decoration stuck to the cart. It is the clearest tell that the lean leads the travel.
    if (!state.snap) {
      context.lineWidth = 1.6;
      for (let i = 1; i < TRAIL; i += 1) {
        const a = (state.head + i) % TRAIL;
        const b = (state.head + i - 1) % TRAIL;
        context.strokeStyle = `rgba(${ACCENT}, ${((i / TRAIL) * 0.34).toFixed(3)})`;
        context.beginPath();
        context.moveTo(px(state.trail[b * 2]), pivotY + state.trail[b * 2 + 1] * scale);
        context.lineTo(px(state.trail[a * 2]), pivotY + state.trail[a * 2 + 1] * scale);
        context.stroke();
      }
    }

    const tipX = cartX + Math.sin(state.th) * poleLen;
    const tipY = pivotY - Math.cos(state.th) * poleLen;
    context.strokeStyle = 'rgba(232, 237, 247, 0.88)';
    context.lineWidth = 3;
    context.lineCap = 'round';
    context.beginPath();
    context.moveTo(cartX, pivotY);
    context.lineTo(tipX, tipY);
    context.stroke();
    context.lineCap = 'butt';

    context.fillStyle = `rgb(${ACCENT})`;
    context.beginPath();
    context.arc(tipX, tipY, 6.5, 0, Math.PI * 2);
    context.fill();

    context.fillStyle = 'rgba(10, 14, 23, 0.9)';
    context.beginPath();
    context.arc(cartX, pivotY, 2.4, 0, Math.PI * 2);
    context.fill();
  };

  const { stageRef, canvasRef, requestRender } = useCanvasScene<State>({ setup, draw });
  useEffect(() => requestRender(), [reduced, stage, requestRender]);

  return (
    <div className="balance-progress-stage" data-compact={compact ? 'true' : undefined}>
      <div ref={stageRef} className="balance-progress-surface">
        <canvas ref={canvasRef} aria-hidden="true" />
      </div>
      <div className="balance-progress-content">
        <div>
          <p className="balance-progress-eyebrow">Release pipeline</p>
          <div className="balance-progress-head">
            <h3 className="balance-progress-title">{STAGES[stage]}</h3>
            <span className="balance-progress-percent">
              {Math.round(stage * (100 / (STAGES.length - 1)))}%
            </span>
          </div>
          <p className="balance-progress-sub">
            The cart carries the fill and balances the pole while it moves. It has to lean toward the
            stage you pick before it can travel there, so the first step is always backwards.
          </p>
        </div>
        <nav className="balance-progress-steps" aria-label="Release stage">
          {STAGES.map((name, i) => (
            /* Still clickable in a card — only the tab order changes, because the card
               frame is aria-hidden and a focusable node under that is a real bug. */
            <button
              key={name}
              type="button"
              className="balance-progress-step"
              aria-current={i === stage ? 'step' : undefined}
              tabIndex={compact ? -1 : undefined}
              onClick={() => setStage(i)}
            >
              {name}
            </button>
          ))}
        </nav>
      </div>
      <p className="balance-progress-hint">drag to disturb</p>
    </div>
  );
}

export default BalanceProgress;
