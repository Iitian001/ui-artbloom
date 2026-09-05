'use client';

import './kelvin-ramp.css';

import { useEffect, useId, useRef, useState, type KeyboardEvent as ReactKeyboard, type PointerEvent as ReactPointer } from 'react';

import { useCanvasScene, useReducedMotion, type SceneDrawContext, type SceneSetupContext } from '@/hooks/use-canvas-scene';

/**
 * A colour-temperature control for a theme picker, whose ramp is Planck's law integrated
 * through the CIE 1931 observer, one column of the strip at a time.
 *
 * THE SPECTRUM. A blackbody at temperature T radiates, per unit wavelength,
 *
 *   B(lambda, T) = 2*h*c^2 / lambda^5 * 1 / (exp(h*c / (lambda*k*T)) - 1)
 *
 * and the only part of that which survives to the screen is the shape. The leading 2*h*c^2 is
 * a constant factor on every wavelength and the normalisation two paragraphs down divides it
 * straight back out, so the code carries exactly one physical constant: the second radiation
 * constant c2 = h*c/k = 1.4387768775e4 um*K, with lambda in micrometres so lambda^-5 lands
 * near unity in the visible instead of near 1e-14.
 *
 * THE OBSERVER. Colour is that spectrum's projection onto three fixed curves,
 *
 *   X = integral B(lambda,T) * xbar(lambda) dlambda
 *   Y = integral B(lambda,T) * ybar(lambda) dlambda
 *   Z = integral B(lambda,T) * zbar(lambda) dlambda
 *
 * taken over 380..780nm by the trapezium rule on 21 samples 20nm apart: half weight on the two
 * end rows, full weight on the nineteen between them. dlambda is a common factor on all three
 * sums and the Y normalisation removes it, so it never appears in the code.
 *
 * EQUAL LUMINANCE. X and Z are divided by Y and Y is set to 1, so every temperature is
 * compared at the luminance of white. That is what makes this a chromaticity ramp: what
 * changes along the strip is the colour, and 1600K is not dark merely because a candle is dim.
 *
 * TO sRGB. The standard D65 matrix, unrounded:
 *
 *   r =  3.2404542*X - 1.5371385*Y - 0.4985314*Z
 *   g = -0.9692660*X + 1.8760108*Y + 0.0415560*Z
 *   b =  0.0556434*X - 0.2040259*Y + 1.0572252*Z
 *
 * GAMUT. Below about 1900K the locus leaves the sRGB triangle and b comes out negative. The
 * answer is not to clamp that channel: a clamp moves the chromaticity in whatever direction
 * the clamp happens to point, and changes the luminance while it does it. Instead the triple is
 * mixed with the white point, along the line joining them, by exactly the fraction that lifts
 * the low channel to zero. With m = min(r,g,b) < 0 that fraction is
 *
 *   t = -m / (1 - m)      giving   c' = (c - m) / (1 - m)   for each channel
 *
 * and because the white point at Y = 1 is linear (1,1,1) — whose luminance is 1 by construction
 * of the matrix above — while the triple being mixed also has luminance 1, the mix is
 * luminance-preserving for free. The branch is live, not defensive: it fires from 1600K up to
 * about 1900K, t peaks at 0.049, and the Candle preset sits inside that band.
 *
 * EXPOSURE, then the transfer function. A triple at Y = 1 has its largest channel above 1
 * everywhere except at the white point, so the triple is divided by that largest channel — one
 * factor on all three, which cannot move the chromaticity — and then multiplied by EXPOSURE.
 * The encode is the piecewise sRGB curve, 12.92*c below c = 0.0031308 and 1.055*c^(1/2.4) -
 * 0.055 above it, and not a bare 2.2 power: those two disagree by several levels in the
 * shadows, which is exactly where the warm end of this ramp keeps its blue channel.
 *
 * IT IS NOT a CSS linear-gradient between two or three hand-picked stops, and it is not the
 * mired polynomial that every "kelvin to RGB" snippet copies. Both are fitted to the locus
 * rather than derived from it, and both fail the same two ways. They cut the corner between an
 * orange stop and a blue stop straight through the middle of the gradient, which puts a pink or
 * a flat grey where the Planckian locus has neither — no hot body emits a pink, and the locus
 * bends around that region instead of through it. And they are parameterised so that equal
 * steps along the gradient look like equal steps of colour, which the real locus is not.
 *
 * THE ONE VISIBLE CONSEQUENCE, under your hand: the strip is not evenly paced. Drag a thousand
 * kelvin at the bottom and a thousand at the top and the second barely moves. 2000K -> 3000K
 * travels rgb(239,129,20) -> rgb(239,171,101); 6000K -> 7000K travels rgb(239,228,224) ->
 * rgb(229,227,239). Ninety-one levels of RGB against eighteen — five times as far for the same
 * thousand kelvin, because the locus crowds together as T rises, its coordinates converging on
 * a limit point as 1/T goes to zero. So the control is loose down low and stiff up high, and a
 * 100K arrow-key step that is an obvious change at the candle end is invisible at the blue one.
 *
 * THE TABLE. 21 rows at 20nm, not 81 at 5nm, and here the coarse table is not a compromise.
 * Checked against the full 5nm table across 1600..12000K, the 20nm trapezium moves no channel
 * by more than one level in 255 and the chromaticity by at most 0.0008 in xy — under a
 * just-noticeable difference on a swatch. There is nothing a finer table could change about the
 * pacing or the shape of the locus, because those come from Planck's law and not from the
 * quadrature; what it would change is a spiky spectrum, where a fluorescent tube's mercury
 * lines fall between 20nm samples and are simply missed. A blackbody has no lines to miss.
 *
 * WHAT THE FIXED STEP IS FOR. Nothing here integrates a force, and a whole strip is about eight
 * thousand calls to expm1 — a fraction of one frame. The step is not buying stability and it is
 * not spreading a cost: it paces the refinement, so the strip resolves at the same speed on a
 * 60Hz and a 144Hz panel. Columns are solved in stride order, every 16th and then the 8s, 4s,
 * 2s and 1s, so the strip is complete after a sixteenth of the work and visibly sharpens from
 * there, and no column is ever solved twice.
 */

/**
 * The CIE 1931 2-degree observer, tabulated at 20nm from 380nm to 780nm: wavelength in
 * nanometres, then xbar, ybar, zbar. Twenty-one rows, the standard values, no interpolation
 * and nothing invented. ybar is the photopic luminosity function, which is why Y is luminance
 * and why dividing by it is what puts two temperatures at the same brightness.
 *
 * Why this is enough is argued above, with the measurement.
 */
const CMF: readonly (readonly [number, number, number, number])[] = [
  [380, 0.001368, 0.000039, 0.006450],
  [400, 0.014310, 0.000396, 0.067850],
  [420, 0.134380, 0.004000, 0.645600],
  [440, 0.348280, 0.023000, 1.747060],
  [460, 0.290800, 0.060000, 1.669200],
  [480, 0.095640, 0.139020, 0.812950],
  [500, 0.004900, 0.323000, 0.272000],
  [520, 0.063270, 0.710000, 0.078250],
  [540, 0.290400, 0.954000, 0.020300],
  [560, 0.594500, 0.995000, 0.003900],
  [580, 0.916300, 0.870000, 0.001650],
  [600, 1.062200, 0.631000, 0.000800],
  [620, 0.854450, 0.381000, 0.000190],
  [640, 0.447900, 0.175000, 0.000020],
  [660, 0.164900, 0.061000, 0.000000],
  [680, 0.046770, 0.017000, 0.000000],
  [700, 0.011359, 0.004102, 0.000000],
  [720, 0.002899, 0.001047, 0.000000],
  [740, 0.000690, 0.000249, 0.000000],
  [760, 0.000166, 0.000060, 0.000000],
  [780, 0.000042, 0.000015, 0.000000],
];

/**
 * Ends of the range. 1600K is about as low as this is worth going: below it the locus is far
 * enough outside sRGB that the mix toward white eats the last of the hue and the swatches stop
 * separating. 12000K is where the far end has flattened out — another thousand kelvin past it
 * moves a channel by one level, which is the limit point the locus is converging on.
 */
const MIN_K = 1600;
const MAX_K = 12000;
/**
 * Where the control starts: a warm studio white. Off-neutral on purpose, so the first painted
 * frame shows a ramp with a colour in it rather than a grey strip with a white chip on it.
 */
const DEFAULT_K = 3200;
/**
 * Kelvin the value is quantised to. 50K is under two pixels of a 370px strip, so a drag stays
 * continuous to the eye, and both key steps below are multiples of it, so the keyboard and the
 * pointer land on the same set of values instead of two interleaved ones.
 */
const GRID = 50;
/** Arrow and page steps: 100K crosses the range in 104 presses, 1000K in ten. */
const KEY_FINE = 100;
const KEY_PAGE = 1000;

/** Second radiation constant h*c/k in um*K, so lambda can be micrometres. */
const C2 = 1.4387768775e4;
/**
 * One multiplier on all three linear channels after the gamut fit, which is why it cannot move
 * a hue. The fitted triple has its brightest channel at exactly 1, so without this the neutral
 * end of the ramp is paper white. 0.86 is the largest value that still reads as a surface
 * rather than as the page, and it leaves the darkest swatch in the range — 1600K, at a
 * luminance near 0.29 — bright enough for near-black ink on the preview to clear 4.5:1, so the
 * ink never has to flip sides part-way through a drag.
 */
const EXPOSURE = 0.86;

/**
 * Seconds per substep. Nothing here integrates a force, so 1/240 buys no stability; 1/120 is
 * the rate at which a fixed budget of columns is solved, so the strip sharpens at the same
 * speed whatever the display refresh is.
 */
const STEP = 1 / 120;
/** Substeps one frame may consume, so a tab restored after a minute cannot aggregate a minute. */
const MAX_SUB = 4;
/**
 * Columns solved per substep: 720 a second. The coarse pass of a 370px strip is on screen
 * inside two frames at 60Hz, so the ramp is never blank under the handle, and the last
 * refinement lands about half a second later — long enough to read as the strip resolving,
 * short enough that a reader who drags immediately is never fighting it.
 */
const COLS_PER_STEP = 6;
/**
 * Stride of the first pass. 16 puts the whole strip on screen for a sixteenth of the work; 32
 * would be faster to first paint but the blocks are then wide enough to read as banding, which
 * is the one thing this ramp must not look like.
 */
const COARSE_STRIDE = 16;
/** 16, 8, 4, 2, 1. Derived rather than written out, so the two cannot drift apart. */
const PASS_COUNT = Math.log2(COARSE_STRIDE) + 1;

/**
 * Handle width in CSS pixels, and the width of the gap the strip is cut with. Both live here
 * because the canvas cuts the socket and the component sizes the chip: 18 against 14 leaves two
 * pixels of dark either side, which is what makes the handle read as lifted out of the strip
 * rather than laid on top of it.
 */
const THUMB = 14;
const THUMB_HALF = THUMB / 2;
const NOTCH_HALF = 9;

/** What the light at this temperature is, in words. Upper bound of each band, in kelvin. */
const BANDS: readonly (readonly [number, string])[] = [
  [2100, 'Candle flame'],
  [2900, 'Tungsten lamp'],
  [3700, 'Halogen studio'],
  [4600, 'Cool fluorescent'],
  [5600, 'Direct sunlight'],
  [6800, 'Noon daylight'],
  [8200, 'Overcast sky'],
];
/** Above the last band. */
const BAND_TOP = 'Open shade';

/** Presets, as real buttons. Candle sits at 1800K, inside the out-of-gamut band, on purpose. */
const PRESETS: readonly (readonly [string, number])[] = [
  ['Candle', 1800],
  ['Tungsten', 2800],
  ['Daylight', 5600],
  ['Shade', 9000],
];

/**
 * Planck's law, up to the constant factor the Y normalisation removes. `expm1` is exp(x) - 1
 * without the cancellation; inside this range x never drops below 1.5, where the two forms agree
 * to the last bit, but this one stays right if the range is ever widened.
 */
function planck(nm: number, kelvin: number): number {
  const um = nm / 1000;
  return 1 / (um ** 5 * Math.expm1(C2 / (um * kelvin)));
}

/**
 * The sRGB transfer function, to a level in 0..255. The clamp is not decoration: the mix toward
 * white lands the low channel on zero, and in floating point that arrives as a value a hair
 * either side of it.
 */
function encode(linear: number): number {
  const c = Math.min(1, Math.max(0, linear));
  const signal = c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055;
  return Math.round(255 * signal);
}

/**
 * One temperature, all the way to a colour the DOM and the canvas can both take. This is the
 * whole solver, and its domain is MIN_K..MAX_K.
 */
function solveColour(kelvin: number): string {
  let sumX = 0;
  let sumY = 0;
  let sumZ = 0;
  for (let i = 0; i < CMF.length; i += 1) {
    const [nm, xbar, ybar, zbar] = CMF[i];
    // Trapezium rule: the two end rows count half, the nineteen between them count once.
    const weight = i === 0 || i === CMF.length - 1 ? 0.5 : 1;
    const power = planck(nm, kelvin) * weight;
    sumX += power * xbar;
    sumY += power * ybar;
    sumZ += power * zbar;
  }

  // Equal luminance. Y becomes exactly 1, which is why the middle column of the matrix below is
  // a bare constant rather than a product, and why dlambda never had to be carried: it is a
  // common factor on all three sums and it divides out here.
  const x = sumX / sumY;
  const z = sumZ / sumY;
  let r = 3.2404542 * x - 1.5371385 - 0.4985314 * z;
  let g = -0.969266 * x + 1.8760108 + 0.041556 * z;
  let b = 0.0556434 * x - 0.2040259 + 1.0572252 * z;

  // Out of gamut: mix with the white point by the fraction that lifts the low channel to zero.
  // Linear (1,1,1) has luminance 1 and so does this triple, so the mix costs no luminance.
  const low = Math.min(r, g, b);
  if (low < 0) {
    const span = 1 - low;
    r = (r - low) / span;
    g = (g - low) / span;
    b = (b - low) / span;
  }

  // The luminance weights sum to 1, so a triple at Y = 1 has its largest channel at 1 or above
  // and this divisor is never small: no guard is needed, and none is a lie.
  const gain = EXPOSURE / Math.max(r, g, b);
  return `rgb(${encode(r * gain)}, ${encode(g * gain)}, ${encode(b * gain)})`;
}

/** The value, on the grid and inside the ends. Every path that sets it goes through here. */
function clampKelvin(kelvin: number): number {
  return Math.min(MAX_K, Math.max(MIN_K, Math.round(kelvin / GRID) * GRID));
}

/** What the light at this temperature is called. The caption under the value, in words. */
function describe(kelvin: number): string {
  for (const [upper, name] of BANDS) {
    if (kelvin < upper) return name;
  }
  return BAND_TOP;
}

interface RampState {
  /** Columns of strip, one per CSS pixel of width. */
  readonly cols: number;
  /** Pixels the value maps across: the width less the handle, so both ends line up. */
  readonly travel: number;
  /** The solved colour of every column. This array is the ramp, and nothing else is. */
  readonly colour: string[];
  /** Refinement pass in flight. At PASS_COUNT every column has been solved exactly once. */
  pass: number;
  /** Next column of the current pass. */
  cursor: number;
  /** Centre of the gap the handle sits in, in CSS pixels, written from the value each frame. */
  notch: number;
  /** Nothing is repainted unless a column landed or the gap moved. */
  dirty: boolean;
  carry: number;
  clock: number;
}

/**
 * The three numbers that define a pass. Pass 0 solves every 16th column and paints 16 wide;
 * pass 1 solves the 8s that fell between them and paints 8 wide; then the 4s, the 2s and the
 * odd columns. Every index in the strip belongs to exactly one pass, so the total work is the
 * column count and not a multiple of it.
 */
function passStride(pass: number): number {
  return pass === 0 ? COARSE_STRIDE : COARSE_STRIDE >> pass;
}

function passStart(pass: number): number {
  return pass === 0 ? 0 : COARSE_STRIDE >> pass;
}

/**
 * The temperature one column of the strip shows. Offset and clamped by half the handle at each
 * end, so the colour under the chip is the colour the chip is at every position — including the
 * two ends, where the outermost seven pixels all hold the end temperature rather than running
 * past it. Linear in kelvin, which is the whole point: the ramp is allowed to be unevenly paced
 * because the locus is, and re-spacing the axis to even it out would be the lie.
 */
function temperatureAt(state: RampState, column: number): number {
  const along = state.travel > 0 ? (column + 0.5 - THUMB_HALF) / state.travel : 0;
  return MIN_K + (MAX_K - MIN_K) * Math.min(1, Math.max(0, along));
}

/**
 * Solve at most `budget` columns, in stride order, picking up wherever the last call stopped.
 * A pass boundary costs no budget, so a call that lands on one still does its work.
 */
function resolve(state: RampState, budget: number): void {
  let solved = 0;
  while (solved < budget && state.pass < PASS_COUNT) {
    if (state.cursor >= state.cols) {
      state.pass += 1;
      state.cursor = state.pass < PASS_COUNT ? passStart(state.pass) : 0;
      continue;
    }
    const stride = passStride(state.pass);
    const css = solveColour(temperatureAt(state, state.cursor));
    // The block this column stands for until a finer pass overwrites its interior.
    const end = Math.min(state.cols, state.cursor + stride);
    for (let i = state.cursor; i < end; i += 1) state.colour[i] = css;
    state.cursor += state.pass === 0 ? stride : stride * 2;
    state.dirty = true;
    solved += 1;
  }
}

/** Where the gap goes, from the value. The arithmetic the handle's own `left` repeats in CSS. */
function notchAt(state: RampState, kelvin: number): number {
  return THUMB_HALF + ((kelvin - MIN_K) / (MAX_K - MIN_K)) * state.travel;
}

/**
 * A strip sized to the box, with nothing solved yet. `offsetWidth` is an integer, so one column
 * per CSS pixel is exact and the handle's percentage travel and the gap's pixel travel are the
 * same distance. The floor on `travel` is for the one-pixel box a stage can be measured at
 * mid-layout, where the division would otherwise be by zero.
 */
function build({ width }: SceneSetupContext, kelvin: number): RampState {
  const cols = Math.max(1, Math.round(width));
  const state: RampState = {
    cols,
    travel: Math.max(1, cols - THUMB),
    colour: new Array<string>(cols).fill(''),
    pass: 0,
    cursor: 0,
    notch: 0,
    dirty: true,
    carry: 0,
    clock: 0,
  };
  state.notch = notchAt(state, kelvin);
  return state;
}

/**
 * The strip, straight off the solved array: one filled column per CSS pixel, and a gap where the
 * handle sits. Columns not yet solved are left empty and the layer's own dark background stands
 * in for them, which is what the coarse first pass fills in.
 *
 * The early return is the steady state, not an optimisation for a rare case. Once every column
 * is solved and the value is still, this scene draws nothing at all — a ramp is not an animation
 * and the loop should not be paying for one.
 */
function paint({ context, width, height, dpr, state }: SceneDrawContext<RampState>): void {
  if (!state.dirty) return;
  state.dirty = false;
  context.clearRect(0, 0, width, height);

  for (let x = 0; x < state.cols; x += 1) {
    const css = state.colour[x];
    if (!css) continue;
    if (Math.abs(x + 0.5 - state.notch) < NOTCH_HALF) continue;
    // Snapped to whole device pixels. At a fractional device ratio a one-pixel column starts on
    // a half pixel, and the antialiasing that follows reads as dark seams ruled down the ramp.
    const left = Math.round(x * dpr) / dpr;
    const right = Math.round((x + 1) * dpr) / dpr;
    context.fillStyle = css;
    context.fillRect(left, 0, right - left, height);
  }
}

/**
 * The control. The strip's canvas sits in a layer that holds nothing else, and the slider is a
 * sibling above it — a real focusable element with a real role, so the value is announced as a
 * slider and reachable from the keyboard, and its own pointer events are not swallowed by the
 * capture the canvas layer takes. One function solves the colour in both places: once per column
 * inside the scene, and once per render for the handle and the preview, so the chip can never be
 * a different colour from the strip it is sitting in.
 *
 * `compact` is the 298x240 catalogue card: the same strip, re-solved at that width, with the prose
 * dropped and the slider left pointer-live but out of the tab order — the card's own title link is
 * the accessible path to the item, so a control inside the frame must not be a second stop.
 */
export type KelvinRampProps = { compact?: boolean };

export function KelvinRamp({ compact = false }: KelvinRampProps) {
  const reduced = useReducedMotion();
  const [kelvin, setKelvin] = useState(DEFAULT_K);
  const uid = useId();
  const helpId = `${uid}-keys`;

  // Mirrors, because the scene runs inside a loop React does not drive.
  const kelvinRef = useRef(kelvin);
  kelvinRef.current = kelvin;
  const snapRef = useRef(reduced);
  snapRef.current = reduced;
  const dragRef = useRef(false);

  // Twenty-one rows of expm1 per render. That is cheaper than the bookkeeping a memo of it would
  // need, and it is the same call the canvas makes for each of its own columns.
  const surface = solveColour(kelvin);
  const fraction = (kelvin - MIN_K) / (MAX_K - MIN_K);

  const draw = (scene: SceneDrawContext<RampState>) => {
    const { state } = scene;
    const notch = notchAt(state, kelvinRef.current);
    if (notch !== state.notch) {
      state.notch = notch;
      state.dirty = true;
    }

    if (snapRef.current) {
      // The settled strip, in the single frame a stopped loop gives us. The refinement takes
      // exactly `cols` solves in total, so this budget cannot fall short of finishing it.
      resolve(state, state.cols);
    } else {
      const now = performance.now() / 1000;
      const elapsed = state.clock === 0 ? 0 : Math.min(0.25, now - state.clock);
      state.clock = now;
      state.carry += elapsed;
      let taken = 0;
      while (state.carry >= STEP && taken < MAX_SUB) {
        resolve(state, COLS_PER_STEP);
        state.carry -= STEP;
        taken += 1;
      }
      if (taken === MAX_SUB) state.carry = 0;
    }

    paint(scene);
  };

  const { stageRef, canvasRef, requestRender } = useCanvasScene<RampState>({
    setup: (scene) => build(scene, kelvinRef.current),
    draw,
  });

  // The gap has to repaint on the value's account: with the loop stopped under reduced motion
  // nothing else would, and the strip would keep its gap where the last value left it.
  useEffect(() => requestRender(), [kelvin, reduced, requestRender]);

  /**
   * A pointer position, straight to a temperature. The travel is inset by half the handle at
   * each end so grabbing the chip does not jump it, and so the ends of the strip are reachable
   * without dragging past the box.
   */
  const setFromClientX = (element: HTMLDivElement, clientX: number) => {
    const rect = element.getBoundingClientRect();
    const travel = rect.width - THUMB;
    const along = travel > 0 ? (clientX - rect.left - THUMB_HALF) / travel : 0;
    setKelvin(clampKelvin(MIN_K + (MAX_K - MIN_K) * Math.min(1, Math.max(0, along))));
  };

  // Capture on the slider itself, so a drag that leaves the 44px strip keeps setting the value
  // instead of stopping the moment the hand strays vertically.
  const onPointerDown = (event: ReactPointer<HTMLDivElement>) => {
    dragRef.current = true;
    event.currentTarget.focus();
    event.currentTarget.setPointerCapture(event.pointerId);
    setFromClientX(event.currentTarget, event.clientX);
  };

  const onPointerMove = (event: ReactPointer<HTMLDivElement>) => {
    if (dragRef.current) setFromClientX(event.currentTarget, event.clientX);
  };

  const onPointerUp = (event: ReactPointer<HTMLDivElement>) => {
    dragRef.current = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const onKeyDown = (event: ReactKeyboard<HTMLDivElement>) => {
    let next = kelvin;
    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        next += KEY_FINE;
        break;
      case 'ArrowLeft':
      case 'ArrowDown':
        next -= KEY_FINE;
        break;
      case 'PageUp':
        next += KEY_PAGE;
        break;
      case 'PageDown':
        next -= KEY_PAGE;
        break;
      case 'Home':
        next = MIN_K;
        break;
      case 'End':
        next = MAX_K;
        break;
      default:
        return;
    }
    // Only for the keys handled above, so nothing else a reader presses is swallowed here — and
    // the page cannot scroll out from under a Page key that has just moved the value.
    event.preventDefault();
    setKelvin(clampKelvin(next));
  };

  return (
    <div className="kelvin-ramp-stage" data-compact={compact ? 'true' : undefined}>
      <div className="kelvin-ramp-card">
        <p className="kelvin-ramp-kicker">Appearance</p>
        <h3 className="kelvin-ramp-title">Display warmth</h3>
        <p className="kelvin-ramp-lead">
          Every panel, border and hover state in the theme is mixed from one colour temperature.
          Drag the strip to choose it, and the card above takes the result.
        </p>

        <div className="kelvin-ramp-preview" style={{ backgroundColor: surface }}>
          <p className="kelvin-ramp-preview-kicker">Panel surface</p>
          <p className="kelvin-ramp-preview-title">Draft saved at 14:06</p>
          <p className="kelvin-ramp-preview-body">
            Sidebars, cards and hover states all take this temperature. Type stays near-black at
            every setting, so no screen has to be checked for contrast twice.
          </p>
        </div>

        <div className="kelvin-ramp-ramp">
          <div ref={stageRef} className="kelvin-ramp-band" aria-hidden="true">
            <canvas ref={canvasRef} />
          </div>

          <div
            className="kelvin-ramp-control"
            role="slider"
            tabIndex={compact ? -1 : 0}
            aria-label="Colour temperature"
            aria-valuemin={MIN_K}
            aria-valuemax={MAX_K}
            aria-valuenow={kelvin}
            aria-valuetext={`${kelvin} K`}
            aria-describedby={helpId}
            onKeyDown={onKeyDown}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
          >
            {/* Width and travel inline: the canvas cuts the gap this chip sits in from the same
                two numbers, and a second copy of them in the stylesheet is how they drift. */}
            <div
              className="kelvin-ramp-thumb"
              style={{
                width: `${THUMB}px`,
                left: `calc(${fraction.toFixed(5)} * (100% - ${THUMB}px) + ${THUMB_HALF}px)`,
                backgroundColor: surface,
              }}
            />
          </div>
        </div>

        <div className="kelvin-ramp-row">
          <p className="kelvin-ramp-value">
            {kelvin}
            <span className="kelvin-ramp-unit">K</span>
          </p>
          <p className="kelvin-ramp-name">{describe(kelvin)}</p>
        </div>

        <div className="kelvin-ramp-presets" role="group" aria-label="Preset temperatures">
          {PRESETS.map(([name, preset]) => (
            <button
              key={preset}
              type="button"
              className="kelvin-ramp-preset"
              aria-pressed={preset === kelvin}
              onClick={() => setKelvin(clampKelvin(preset))}
            >
              <span className="kelvin-ramp-preset-name">{name}</span>
              <span className="kelvin-ramp-preset-k">{preset} K</span>
            </button>
          ))}
        </div>

        <p className="kelvin-ramp-help" id={helpId}>
          Arrow keys move 100 K, Page Up and Page Down move 1000 K, Home and End take the ends.
        </p>
      </div>

      <p className="kelvin-ramp-hint">drag the strip</p>
    </div>
  );
}

export default KelvinRamp;
