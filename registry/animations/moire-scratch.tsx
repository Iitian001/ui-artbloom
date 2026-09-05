'use client';

import './moire-scratch.css';

import { type KeyboardEvent, useEffect, useId, useRef, useState } from 'react';

import { useCanvasScene, useReducedMotion, type SceneDrawContext, type SceneSetupContext } from '@/hooks/use-canvas-scene';

/**
 * A promo code behind two real gratings, revealed by the beat between them.
 *
 * THE FILMS. Each is an amplitude grating of pitch p, transmittance
 *
 *   T(u) = (1 + cos(2*pi*u / p)) / 2
 *
 * measured along its own axis. The lower film is fixed, u1 = x. The upper one is
 * rotated by theta about the code and shifted along its own axis by s:
 *
 *   u2 = cx + (x - cx)*cos(theta) + (y - cy)*sin(theta) - s
 *
 * The visible mask is the product T1*T2, which is what light that has crossed both
 * films carries. Expanding the product, with phi = 2*pi*u/p,
 *
 *   T1*T2 = [ 1 + cos(phi1) + cos(phi2) + cos(phi1-phi2)/2 + cos(phi1+phi2)/2 ] / 4
 *
 * and the fourth term is the beat. phi1 - phi2 advances as 2*pi*x*(1/p1 - 1/p2), so its
 * period is
 *
 *   B = p1*p2 / |p1 - p2|
 *
 * about two hundred and forty times either pitch here. That is the bright band, and it
 * is painted nowhere: it is what is left over when two cosines are multiplied.
 *
 * NOT POINT-SAMPLED, AND NOT PIXEL-SAMPLED EITHER. A 1.9 px grating is under two device
 * pixels on a 1x display, past Nyquist, so a point sample of it folds: 0.526 cycles per
 * pixel against a Nyquist of 0.5 comes back as a 19 px ripple that beats with the pixel
 * grid instead of with the other film, drifts the wrong way when the film moves, and lands
 * on a different period on every display. Averaging over one pixel does not fix it. A box
 * is not a brick wall; it only takes the fold down to sinc(1/1.9), which is 0.6 of it.
 *
 * So what is painted is the average of the product over a square aperture of side d, and
 * that has a closed form. The box average of cos(k.r) over the square is the cosine times
 *
 *   sinc(kx*d / (2*pi)) * sinc(ky*d / (2*pi)),      sinc(z) = sin(pi*z) / (pi*z)
 *
 * one factor for each of the four terms above — four scalars per frame, since d and both
 * wavevectors are constant across a frame. This is the average of the product and not the
 * product of the averages: integrating each film alone and then multiplying leaves the beat
 * at sinc(d/p1)*sinc(d/p2) of its strength while inflating the carriers, which is how a
 * correct-looking anti-alias can throw away most of the contrast it was protecting.
 *
 * Taking d = p1 puts sinc's first zero exactly on the fixed film's own bars, so they
 * integrate to nothing; p2 is within half a percent of p1, so its bars go with them, and so
 * does the sum term at 1/p1 + 1/p2. The beat's own factor is sinc(1.9/465), which is one.
 * What is left on the panel is the beat and nothing else — which is what an eye does with
 * two gratings it cannot resolve, and the reason the fringe is identical on a 1x and a 2x
 * display instead of carrying a different false pattern on each.
 *
 * IT IS NOT two overlaid repeating-linear-gradients: the compositor point-samples those,
 * so at this pitch they alias exactly as above and visibly crawl the moment either one
 * moves. It is not a keyframed band sweeping a mask either — there is no band in this
 * file, no gradient stop that travels, and nothing that knows where the code is.
 *
 * THE ONE VISIBLE CONSEQUENCE is the gain. The fringe sits where phi1 - phi2 = 0, which
 * gives dx/ds = B/p2: shift the upper film by one pitch and the band moves a whole beat
 * period. The upper film is the finer of the two, which is what puts the sign there and
 * sends the band the same way as the hand. Geared down to a fifteenth for that hand, one
 * pixel of pointer travel still moves the reveal fifteen pixels, so the code does not fade
 * up — it arrives out of a dark panel, in a movement too small to aim. Drag up or down
 * instead and the beat vector k1 - k2 swings: a quarter of a degree of skew takes the
 * bands past 45 degrees, and four degrees lays them nearly flat — at which point the beat
 * period has shrunk from 465 px to under thirty, the word spans a whole period of it, and
 * no shift can light more than half the code at once.
 *
 * CHANGED FROM THE SPEC, AND WHY. The skew was asked to fan the bands into a rosette,
 * and two straight gratings cannot make one: the product of two plane waves is a single
 * plane wave, so these fringes are straight and parallel at every angle. A rosette needs
 * a third grating or a curved one, and either would cost the closed form above — the
 * beat period would no longer be p1*p2/|p1 - p2|, which is the equation this draft
 * exists to solve. What the same equation gives under rotation is bigger anyway. Because
 * 1/p1 - cos(theta)/p2 stays near zero while sin(theta)/p2 does not, the beat direction
 * atan2(-sin(theta)/p2, 1/p1 - cos(theta)/p2) leaves zero at about the same gain the
 * shift has. The bands swing through a right angle; they do not fan.
 */

/**
 * Seconds per substep. Nothing here integrates a force, so 1/240 buys no stability;
 * 1/120 is the rate the travel to the solved shift advances at, so the button's sweep
 * crosses the panel at the same speed on a 60 Hz and a 144 Hz display.
 */
const STEP = 1 / 120;
/** Substeps a frame may consume. A tab restored after a minute must not replay a minute. */
const MAX_SUB = 6;
/**
 * Lower film pitch, CSS px. Under two on purpose: the bars are then past Nyquist on a 1x
 * display, which is what makes the aperture below load-bearing instead of decoration on a
 * pitch that could have been sampled safely. It also sets the angular gain, B/p, so a pitch
 * this fine is what puts a right angle of band swing inside half a degree of skew.
 */
const PITCH = 1.9;
/**
 * Sampling aperture, in pitches. One, because sinc's first zero is at d = p: an aperture of
 * exactly one pitch annihilates both films' bars and passes the beat at sinc(1.9/465),
 * which is one. Under a pitch and the 19 px fold is still on the panel at 1x; far over one
 * and the aperture starts taking contrast out of the beat itself.
 */
const APERTURE = 1;
/**
 * Beat period as a multiple of the panel width, which is what fixes the upper film's
 * pitch. Above one, so exactly one bright band is over the panel at a time and the code
 * is lit by a band rather than striped by four of them. At two the band never fully
 * leaves and the code is never properly hidden.
 */
const BEAT_SPAN = 1.25;
/**
 * Fraction of the panel width the code is set to. The bright part of a beat is about four
 * tenths of its period, which at BEAT_SPAN 1.25 is half the panel — so at this width the
 * word just fits inside one band, and anything wider could never be lit end to end.
 */
const CODE_FILL = 0.52;
/**
 * Where the code sits, as a fraction of the panel height. Above centre, to leave the
 * strip along the bottom for the selectable chip. It is also the rotation centre, which
 * is why the solved shift comes out the same at every skew.
 */
const CODE_Y = 0.44;
/**
 * Px the bright band travels per px of pointer travel. The raw gain is B/p2, about two
 * hundred and forty, and at two hundred and forty a mouse cannot address the band at all
 * — consecutive samples land in unrelated places. Fifteen keeps the arrival sudden and
 * still leaves a window a hand can hold still inside.
 */
const FRINGE_GAIN = 15;
/**
 * Slider steps in one full sweep of the band. At 120 one arrow key is about four px of
 * band travel, fine enough to walk into the fringe deliberately, and a page key crosses
 * the whole sweep in ten presses.
 */
const NOTCHES = 120;
const PAGE_STEP = 12;
/**
 * Degrees of skew at full vertical deflection. The beat direction is atan(theta*B/p2), so
 * it passes 45 degrees at about a quarter of one degree; four is where the beat period,
 * which falls as B*cos(that direction), has shrunk to the extent of the code measured
 * across the bands — the word then spans a whole period and the reveal is genuinely out of
 * reach. Stopping short of that only looks dramatic: the bands end up lying along the word,
 * so it stays lit however far they have swung.
 */
const SKEW_MAX = 4;
/**
 * Px of vertical drag for full skew. Most of the panel's height, so extinguishing the code
 * takes a deliberate pull; the few px a horizontal sweep wanders tilt the bands visibly and
 * leave the fringe reachable.
 */
const SKEW_TRAVEL = 110;
/**
 * Degrees the skew button latches, for a keyboard with no vertical drag. The word still
 * fits inside one band there, so the toggle shows most of a right angle of swing without
 * putting the code out of reach on the way.
 */
const SKEW_LATCH = 0.3;
/**
 * Full sweeps per second while the button travels to the solved shift. At 0.55 the band
 * crosses the panel in under a second: fast enough to read as an arrival, slow enough
 * that the gain is legible on the way there.
 */
const SLEW = 0.55;
/**
 * Fractions of the reading's calibrated swing at which the code enters and leaves the
 * accessibility tree. Two values and not one, because at this gain the reading crosses any
 * single threshold several times during one slow sweep of the hand, and a live region that
 * announces the same code four times is worse than one that announces it late.
 */
const LIT_HI = 0.52;
const LIT_LO = 0.36;
/**
 * Reading stride in device px. The reading is a weighted mean over some thousands of
 * samples, so every other pixel on each axis is four times cheaper and the same number
 * to three places.
 */
const SENSE_STRIDE = 2;
/** Floor on the calibrated swing, so a panel too small to hold the code cannot divide by nothing. */
const SWING_FLOOR = 0.02;

/**
 * Scale from squared transmittance to film alpha. Squared, because transmittance is not
 * brightness and a print's response to it is not linear — and because squaring turns the
 * beat's 3:1 swing in transmittance into 9:1 in what is painted, which is what makes a band
 * read as a band. Not cubed: at gamma three the bright part of a beat comes out narrower
 * than the code and the word can never be lit end to end. 4.4 puts the brightest band a
 * little over six tenths of the way to the film's white.
 */
const FILM_GAIN = 4.4;
/**
 * The same curve taken twice over for the code, so the letters are amber only inside the
 * core of a band. At a single gamma they keep an eleven percent warm ghost in the dark,
 * which on a card whose whole job is to hide a code until it is earned is a spoiler.
 */
const INK_GAIN = 2.6;
/**
 * How far the film is held back under the letters, so the code reads as ink lying in the
 * band rather than as a brighter patch of the same grey.
 */
const INK_CLEAR = 0.62;
/**
 * The code's own type: weight, tracking as a fraction of the size, and the bounds the
 * fitted size is held between so even a narrow panel gets legible letters.
 */
const CODE_WEIGHT = 600;
const CODE_TRACK = 0.1;
const CODE_MIN = 13;
const CODE_MAX = 34;
const CODE_FONT = 'ui-monospace, "SFMono-Regular", Menlo, monospace';
/** The reward. Invented, and shaped like a real one so the card is not obviously a demo. */
const PROMO = 'FRINGE40-K9Q2';
/**
 * Plate, film and fringe as RGB triples: the paint loop mixes them per pixel, and a
 * colour string is re-parsed on every assignment where three numbers are not.
 */
const PLATE_RGB = [7, 10, 16] as const;
const FILM_RGB = [219, 231, 244] as const;
const ACCENT_RGB = [255, 207, 125] as const;

const DEG = Math.PI / 180;

interface MoireState {
  /** Device-pixel size of the backing store, which is the resolution the mask is built at. */
  readonly dw: number;
  readonly dh: number;
  readonly dpr: number;
  readonly image: ImageData;
  readonly data: Uint8ClampedArray;
  /** Glyph coverage per device pixel, 0..1. The code, and the only weight the reading uses. */
  readonly glyph: Float32Array;
  /** Device-pixel bounds of the inked area, so the reading walks the word and not the panel. */
  readonly inkX0: number;
  readonly inkX1: number;
  readonly inkY0: number;
  readonly inkY1: number;
  /**
   * Per-column phasors, rebuilt each frame: cos and sin of the fixed film's phase, which
   * depends on x alone, and of the moving film's along-x part. With these a row costs two
   * trig calls for its own phase and a pixel costs none at all.
   */
  readonly lowCos: Float64Array;
  readonly lowSin: Float64Array;
  readonly topCos: Float64Array;
  readonly topSin: Float64Array;
  readonly pitchA: number;
  readonly pitchB: number;
  /** Beat period in CSS px, p1*p2/|p1 - p2|. The gain is this over p2. */
  readonly beat: number;
  readonly cx: number;
  readonly cy: number;
  /** The shift, in notches, that puts a fringe maximum on the code. Solved, not searched. */
  readonly solved: number;
  /**
   * Midpoint and half-swing of the reading, taken at the two extremal shifts. Written
   * once, at the end of the rebuild, because the reading they calibrate needs the rest of
   * the state to exist before it can be taken at all.
   */
  centre: number;
  swing: number;
  /** Upper film shift in notches, wrapped into [0, NOTCHES). Written by the hand or the travel. */
  phase: number;
  /** Upper film rotation, radians. */
  skew: number;
  /** Where the travel is headed, in notches, or null when nothing is travelling. */
  target: number | null;
  /**
   * Timestamp of the previous painted frame, and the unspent remainder of it. The hook
   * hands `draw` no elapsed time, so the seconds come from here; zero means no frame has
   * been painted yet and the first one is charged a single step rather than a wild delta.
   */
  clock: number;
  carry: number;
  /** Hold the films at the solved shift and skip the travel. Set under prefers-reduced-motion. */
  snap: boolean;
}

/** sin(pi*z)/(pi*z), the box-average factor. One at z = 0, where the limit is removable. */
function sinc(z: number): number {
  if (z === 0) return 1;
  const a = Math.PI * z;
  return Math.sin(a) / a;
}

/**
 * Box average of cos(k.r) over a square aperture of side d, as a factor on the cosine. A
 * square is separable, so it is one sinc per axis; sinc is even, so the sign of either
 * component makes no difference.
 */
function box(kxd: number, kyd: number): number {
  return sinc(kxd / (2 * Math.PI)) * sinc(kyd / (2 * Math.PI));
}

/**
 * Wrap a shift into one pitch of the moving film. This is not a clamp being dodged: the
 * films are periodic, so a shift of one whole pitch is the identical configuration, and the
 * axis genuinely has no ends.
 */
function wrap(phase: number): number {
  const at = phase % NOTCHES;
  return at < 0 ? at + NOTCHES : at;
}

/**
 * Everything about one frame's pair of films that does not vary across the panel: the two
 * wavevectors, the moving film's phase at the code, and one box factor per term of the
 * product. The factors live here because the aperture and both wavevectors are constant over
 * a frame, so the integral costs four calls rather than four per pixel.
 */
interface FilmPass {
  /** Fixed film's phase gradient, radians per CSS px along x. */
  readonly kLow: number;
  /** Moving film's phase gradients along x and y, and its phase at the code's centre. */
  readonly kTopX: number;
  readonly kTopY: number;
  readonly baseTop: number;
  /** Box factors on the four terms: each film's own bars, the beat, and the sum. */
  readonly aLow: number;
  readonly aTop: number;
  readonly aBeat: number;
  readonly aSum: number;
}

function pass(state: MoireState, phase: number, skew: number): FilmPass {
  const { pitchA, pitchB, cx } = state;
  const kLow = (2 * Math.PI) / pitchA;
  const kTop = (2 * Math.PI) / pitchB;
  const kTopX = kTop * Math.cos(skew);
  const kTopY = kTop * Math.sin(skew);
  // Side of the aperture, in CSS px. A multiple of the pitch and not of the pixel, which is
  // the one deliberate departure from integrating over the pixel itself: see APERTURE.
  const d = APERTURE * pitchA;
  const shift = (phase / NOTCHES) * pitchB;
  return {
    kLow,
    kTopX,
    kTopY,
    baseTop: kTop * (cx - shift),
    aLow: box(kLow * d, 0),
    aTop: box(kTopX * d, kTopY * d),
    aBeat: box((kLow - kTopX) * d, -kTopY * d),
    aSum: box((kLow + kTopX) * d, kTopY * d),
  };
}

/**
 * The mask at one pixel: the box-averaged product, from the two films' phasors there.
 *
 *   4*T1*T2 = 1 + cos(phi1) + cos(phi2) + [cos(phi1-phi2) + cos(phi1+phi2)] / 2
 *
 * with every term carrying its own factor. The difference and sum cosines come out of the
 * phasors by the angle-addition rule, so nothing in here calls a trig function — and nothing
 * in here knows which term is going to survive the aperture, which is why changing the pitch
 * or the aperture changes what the panel shows instead of breaking the derivation.
 */
function maskOf(film: FilmPass, cLow: number, sLow: number, cTop: number, sTop: number): number {
  const beat = cLow * cTop + sLow * sTop;
  const sum = cLow * cTop - sLow * sTop;
  return (
    0.25 *
    (1 + film.aLow * cLow + film.aTop * cTop + 0.5 * (film.aBeat * beat + film.aSum * sum))
  );
}

/**
 * The reading: mean transmittance where the letters are, weighted by their own coverage.
 * This is the only thing that decides whether the code is legible, and it is a measurement
 * of the same mask that gets painted rather than a comparison against a remembered shift —
 * so it falls correctly when a skew shrinks the beat period below the extent of the word,
 * without anything having to know that it should.
 *
 * Sampled every other device pixel on each axis. It is a mean over several thousand samples,
 * so the stride is four times cheaper and the same number to three places.
 */
function sense(state: MoireState, film: FilmPass): number {
  const { glyph, dw, dpr, cx, cy } = state;
  let sum = 0;
  let weight = 0;
  for (let py = state.inkY0; py <= state.inkY1; py += SENSE_STRIDE) {
    const rowPhase = film.baseTop + film.kTopY * ((py + 0.5) / dpr - cy);
    const row = py * dw;
    for (let px = state.inkX0; px <= state.inkX1; px += SENSE_STRIDE) {
      const ink = glyph[row + px];
      if (ink <= 0) continue;
      const x = (px + 0.5) / dpr;
      const low = film.kLow * x;
      const top = rowPhase + film.kTopX * (x - cx);
      sum += ink * maskOf(film, Math.cos(low), Math.sin(low), Math.cos(top), Math.sin(top));
      weight += ink;
    }
  }
  return weight > 0 ? sum / weight : 0;
}

/** Coverage field for the code, plus the device-pixel box the ink actually occupies. */
interface Ink {
  readonly glyph: Float32Array;
  readonly x0: number;
  readonly x1: number;
  readonly y0: number;
  readonly y1: number;
}

/** Width of the code at a given size, including the tracking between its characters. */
function trackedWidth(paper: CanvasRenderingContext2D, size: number): number {
  let total = 0;
  for (let i = 0; i < PROMO.length; i += 1) {
    total += paper.measureText(PROMO.charAt(i)).width + size * CODE_TRACK;
  }
  return total - size * CODE_TRACK;
}

/**
 * The code, rasterised once into a coverage field. Real text in the platform's own
 * monospace face, so no font file ships with this; drawn one character at a time so it
 * can carry the tracking a printed code has; and fitted by measuring the string rather
 * than by a size that happens to look right at one panel width.
 */
function inkCode(box: {
  width: number;
  dw: number;
  dh: number;
  dpr: number;
  cx: number;
  cy: number;
}): Ink {
  const { width, dw, dh, dpr, cx, cy } = box;
  const glyph = new Float32Array(dw * dh);
  const sheet = document.createElement('canvas');
  sheet.width = dw;
  sheet.height = dh;
  const paper = sheet.getContext('2d');
  if (!paper) return { glyph, x0: 0, x1: 0, y0: 0, y1: 0 };

  paper.setTransform(dpr, 0, 0, dpr, 0, 0);
  paper.textBaseline = 'middle';
  paper.fillStyle = '#ffffff';

  const trial = 40;
  paper.font = `${CODE_WEIGHT} ${trial}px ${CODE_FONT}`;
  const measured = trackedWidth(paper, trial);
  const size = Math.max(
    CODE_MIN,
    Math.min(CODE_MAX, (trial * width * CODE_FILL) / Math.max(1, measured)),
  );
  paper.font = `${CODE_WEIGHT} ${size}px ${CODE_FONT}`;

  let pen = cx - trackedWidth(paper, size) / 2;
  for (let i = 0; i < PROMO.length; i += 1) {
    const ch = PROMO.charAt(i);
    paper.fillText(ch, pen, cy);
    pen += paper.measureText(ch).width + size * CODE_TRACK;
  }

  const bytes = paper.getImageData(0, 0, dw, dh).data;
  let x0 = dw;
  let x1 = -1;
  let y0 = dh;
  let y1 = -1;
  for (let py = 0; py < dh; py += 1) {
    const row = py * dw;
    for (let px = 0; px < dw; px += 1) {
      const alpha = bytes[(row + px) * 4 + 3];
      if (alpha === 0) continue;
      glyph[row + px] = alpha / 255;
      if (px < x0) x0 = px;
      if (px > x1) x1 = px;
      if (py < y0) y0 = py;
      if (py > y1) y1 = py;
    }
  }
  // A panel too small for even CODE_MIN leaves nothing inked; the reading then has an
  // empty box to walk and returns zero, which reads as "not legible" and is correct.
  if (x1 < x0 || y1 < y0) return { glyph, x0: 0, x1: 0, y0: 0, y1: 0 };
  return { glyph, x0, x1, y0, y1 };
}

/** The reading as a fraction of its swing: 1 at a fringe maximum on the code, -1 at a minimum. */
function reading(state: MoireState, film: FilmPass): number {
  return (sense(state, film) - state.centre) / state.swing;
}

/**
 * Derive the pair of films for this panel, then calibrate the reading.
 *
 * The upper pitch is not a second arbitrary number. The beat period B is chosen as a
 * multiple of the panel width, and p2 = p1*B / (B + p1) is the pitch that produces it —
 * the inverse of B = p1*p2/(p1 - p2). So the composition holds at every width: a phone
 * gets a band the same fraction of its panel as a desktop does, and the code stays the
 * same fraction of a band. It comes out just under p1, and that ordering is deliberate:
 * with the finer film on top the band travels the same way as the film, so a rightward
 * drag sends the fringe right. The other ordering is equally real moire and sends it the
 * other way, which reads as a bug rather than as physics.
 *
 * The solved shift is algebra, not a search. At the code's centre the rotation drops out
 * of u2, so the beat phase there is 2*pi*(cx/p1 - (cx - s)/p2) = 2*pi*(s/p2 - cx/B), and
 * the code sits in a fringe maximum whenever s/p2 - cx/B is a whole number. In notches,
 * where s = phase*p2/NOTCHES, that is phase = NOTCHES*cx/B, modulo NOTCHES — and being
 * independent of theta is why the button lands the band whatever the skew is doing.
 */
function build({ context, width, height, dpr }: SceneSetupContext, snap: boolean): MoireState {
  const dw = Math.max(1, Math.round(width * dpr));
  const dh = Math.max(1, Math.round(height * dpr));
  const cx = width / 2;
  const cy = height * CODE_Y;

  const pitchA = PITCH;
  const beat = Math.max(width * BEAT_SPAN, pitchA * 4);
  const pitchB = (pitchA * beat) / (beat + pitchA);

  const image = context.createImageData(dw, dh);
  const data = image.data;
  // Opaque once, so the paint loop writes three bytes per pixel rather than four.
  for (let i = 3; i < data.length; i += 4) data[i] = 255;

  const ink = inkCode({ width, dw, dh, dpr, cx, cy });

  const state: MoireState = {
    dw,
    dh,
    dpr,
    image,
    data,
    glyph: ink.glyph,
    inkX0: ink.x0,
    inkX1: ink.x1,
    inkY0: ink.y0,
    inkY1: ink.y1,
    lowCos: new Float64Array(dw),
    lowSin: new Float64Array(dw),
    topCos: new Float64Array(dw),
    topSin: new Float64Array(dw),
    pitchA,
    pitchB,
    beat,
    cx,
    cy,
    solved: wrap((NOTCHES * cx) / beat),
    centre: 0.25,
    swing: SWING_FLOOR,
    phase: 0,
    skew: 0,
    target: null,
    clock: 0,
    carry: 0,
    snap,
  };

  /*
   * Calibrate the reading against itself. Its swing is not a number anyone can write down in
   * advance: it is the beat's box factor times the mean of cos(phi1 - phi2) over whatever
   * shape the fitted letters came out at whatever width this panel is, plus whatever the
   * aperture left of the carriers. So take it by measurement — read at the solved shift and
   * at half a sweep from it, which are the two extremes, and keep the midpoint as zero and
   * the half-difference as the full swing. Every later reading is a fraction of that, which
   * is what lets one pair of thresholds mean the same thing on a phone and on a desktop.
   */
  const bright = sense(state, pass(state, state.solved, 0));
  const dark = sense(state, pass(state, state.solved + NOTCHES / 2, 0));
  state.centre = (bright + dark) / 2;
  state.swing = Math.max(SWING_FLOOR, (bright - dark) / 2);

  /*
   * The code starts in the darkest fringe there is: hidden, and exactly half a sweep from
   * the answer. Under reduced motion it starts at the answer instead — the loop never runs
   * there, and a reader who asked for no movement should not have to win a game of aim to
   * get a discount code.
   */
  state.phase = snap ? state.solved : wrap(state.solved + NOTCHES / 2);

  return state;
}

/**
 * One fixed step of the travel to the solved shift, taken only when the reveal button has
 * asked for one. Constant speed rather than an ease: the shift is a position on a periodic
 * axis with nothing to give it momentum, so a rate is the honest way to move it, and an
 * ease-out here would be a second animation sitting on top of the solver. The direction is
 * the shorter way round the sweep, because a wrapped axis offers two.
 */
function step(state: MoireState): void {
  const target = state.target;
  if (target === null) return;
  const rate = SLEW * NOTCHES * STEP;
  let gap = wrap(target - state.phase);
  if (gap > NOTCHES / 2) gap -= NOTCHES;
  if (Math.abs(gap) <= rate) {
    state.phase = target;
    state.target = null;
    return;
  }
  state.phase = wrap(state.phase + Math.sign(gap) * rate);
}

/** The accumulator. Real seconds in, whole steps out, and never more than MAX_SUB of them. */
function advance(state: MoireState, seconds: number): void {
  state.carry = Math.min(state.carry + seconds, STEP * MAX_SUB);
  while (state.carry >= STEP) {
    state.carry -= STEP;
    step(state);
  }
}

/**
 * The mask: the product of the two films, averaged over the aperture, painted.
 *
 * There is no trigonometry in the inner loop. Each film's phase is linear in x and y, so a
 * column can carry the phasor of its x part and a row costs two trig calls for its own y
 * phase — the phasor at a pixel is then the column's rotated by the row's, four multiplies
 * and two adds. That is what makes a full-resolution product affordable at 2x on a phone.
 */
function render({ context, state }: SceneDrawContext<MoireState>): void {
  const { dw, dh, dpr, data, glyph, lowCos, lowSin, topCos, topSin, cx, cy } = state;
  const film = pass(state, state.phase, state.skew);

  for (let px = 0; px < dw; px += 1) {
    const x = (px + 0.5) / dpr;
    const low = film.kLow * x;
    lowCos[px] = Math.cos(low);
    lowSin[px] = Math.sin(low);
    const along = film.kTopX * (x - cx);
    topCos[px] = Math.cos(along);
    topSin[px] = Math.sin(along);
  }

  const plateR = PLATE_RGB[0];
  const plateG = PLATE_RGB[1];
  const plateB = PLATE_RGB[2];
  const filmR = FILM_RGB[0];
  const filmG = FILM_RGB[1];
  const filmB = FILM_RGB[2];

  let at = 0;
  for (let py = 0; py < dh; py += 1) {
    const rowPhase = film.baseTop + film.kTopY * ((py + 0.5) / dpr - cy);
    const rowCos = Math.cos(rowPhase);
    const rowSin = Math.sin(rowPhase);
    const row = py * dw;
    for (let px = 0; px < dw; px += 1) {
      const cTop = topCos[px] * rowCos - topSin[px] * rowSin;
      const sTop = topSin[px] * rowCos + topCos[px] * rowSin;
      const mask = maskOf(film, lowCos[px], lowSin[px], cTop, sTop);
      // Squared and scaled: what a print does with transmittance, and what turns the beat's
      // three-to-one swing into the nine-to-one a band needs to read as a band.
      const shade = Math.min(1, mask * mask * FILM_GAIN);
      // The letters are holes in the film rather than paint on top of it: where there is ink
      // the film gives back less of its own grey, so the code lies in the band instead of
      // over it — and stays darker than the film everywhere the band is not.
      const cover = glyph[row + px];
      const veil = shade * (1 - cover * INK_CLEAR);
      let r = plateR + (filmR - plateR) * veil;
      let g = plateG + (filmG - plateG) * veil;
      let b = plateB + (filmB - plateB) * veil;
      if (cover > 0) {
        // The one accent, and it exists only where ink and the core of a bright fringe
        // coincide. In a dark band there is nothing here for it to multiply.
        const glow = cover * Math.min(1, shade * shade * INK_GAIN);
        r += (ACCENT_RGB[0] - r) * glow;
        g += (ACCENT_RGB[1] - g) * glow;
        b += (ACCENT_RGB[2] - b) * glow;
      }
      data[at] = r;
      data[at + 1] = g;
      data[at + 2] = b;
      at += 4;
    }
  }

  /*
   * putImageData ignores the transform the hook installs, which is what is wanted here: it
   * writes the backing store one device pixel at a time, at the resolution the mask was
   * evaluated at. Paint the same field through a scaled path instead and the browser would
   * resample it on the way to the screen — a second sampling, uncontrolled, of exactly the
   * kind the aperture above exists to get right.
   */
  context.putImageData(state.image, 0, 0);
}

/**
 * The card. The film layer takes the pointer capture and holds nothing but the canvas, so
 * every real control is a sibling below the panel, where its own click and its own focus
 * ring still land. Whether the code exists in the accessibility tree is read off the mask
 * rather than off a flag: the calibrated reading over the letters, with a wide hysteresis
 * band so a bar crossing the stems cannot make it flap.
 */
export type MoireScratchProps = { compact?: boolean };

/**
 * `compact` is the 298x240 catalogue card: the copy, the rail and the skew button are dropped and
 * the panel keeps the box. No constant changes for it — `BEAT_SPAN` fixes the beat period as a
 * multiple of the panel width, so a card pane is given its own pitch pair and shows the same
 * fraction of a period the stage does. `Reveal the code` stays, since one press is enough to slew
 * the band onto the word; both buttons keep their pointer and leave the tab order, the card frame
 * being `aria-hidden` with its own title link to the item.
 */
export function MoireScratch({ compact = false }: MoireScratchProps) {
  const reduced = useReducedMotion();
  const uid = useId();
  const railId = `${uid}-rail`;

  const [notch, setNotch] = useState(0);
  const [skewed, setSkewed] = useState(false);
  const [lit, setLit] = useState(false);
  /** Bumped by every control, so one effect can ask a frozen loop for its frame. */
  const [nudges, setNudges] = useState(0);

  /*
   * The scene runs in a loop React does not drive, so it owns the shift and the skew and
   * these refs are the channel both ways. A control leaves a request here; the next painted
   * frame takes it, applies it to the solver, and writes back what the DOM has to show.
   * Nothing inside `draw` reads React state directly.
   */
  const wantPhase = useRef<number | null>(null);
  const wantSkew = useRef<number | null>(null);
  const wantSolved = useRef(false);
  const notchRef = useRef(0);
  const litRef = useRef(false);
  const snapRef = useRef(reduced);
  snapRef.current = reduced;
  /** Shift as an offset from the solved one, plus the skew, carried across a resize rebuild. */
  const heldRef = useRef<{ offset: number; skew: number } | null>(null);

  const { stageRef, canvasRef, requestRender } = useCanvasScene<MoireState>({
    setup: (context) => {
      const state = build(context, snapRef.current);
      // A resize rebuilds both films at the new width, so the shift is restored relative to
      // the solved one rather than absolutely: the band stays where the hand left it
      // instead of jumping because the beat period changed under it.
      const held = heldRef.current;
      if (held) {
        state.phase = wrap(state.solved + held.offset);
        state.skew = held.skew;
      }
      return state;
    },
    draw: (frame) => {
      const { state, pointer } = frame;
      state.snap = snapRef.current;

      const asked = wantPhase.current;
      if (asked !== null) {
        wantPhase.current = null;
        state.phase = wrap(asked);
        state.target = null;
      }
      const tilt = wantSkew.current;
      if (tilt !== null) {
        wantSkew.current = null;
        state.skew = tilt;
      }
      if (wantSolved.current) {
        wantSolved.current = false;
        state.skew = 0;
        if (state.snap) state.phase = state.solved;
        else state.target = state.solved;
      }

      /*
       * The hand, read as travel since the last painted frame rather than as a position in
       * the panel: a press must not throw the films to wherever the pointer landed, and a
       * sweep that leaves the panel and comes back must not be charged for the gap.
       */
      if (pointer.down) {
        const dx = pointer.x - pointer.lastX;
        const dy = pointer.y - pointer.lastY;
        if (dx !== 0) {
          state.phase = wrap(state.phase + (dx * FRINGE_GAIN * NOTCHES) / state.beat);
          state.target = null;
        }
        if (dy !== 0) {
          const span = SKEW_MAX * DEG;
          const next = state.skew + (dy * span) / SKEW_TRAVEL;
          state.skew = Math.max(-span, Math.min(span, next));
        }
      }

      // Real seconds, from the previous frame's timestamp. Capped, because a tab that was
      // backgrounded hands back a delta of minutes and the accumulator would spend the
      // whole travel in one frame.
      const now = performance.now();
      const seconds = state.clock > 0 ? Math.min(0.25, (now - state.clock) / 1000) : STEP;
      state.clock = now;
      if (!state.snap) advance(state, seconds);

      render(frame);

      heldRef.current = { offset: wrap(state.phase - state.solved), skew: state.skew };

      const shown = Math.round(state.phase) % NOTCHES;
      if (shown !== notchRef.current) {
        notchRef.current = shown;
        setNotch(shown);
      }

      // The same measurement the calibration was taken with, against the same swing.
      const level = reading(state, pass(state, state.phase, state.skew));
      const legible = litRef.current ? level > LIT_LO : level > LIT_HI;
      if (legible !== litRef.current) {
        litRef.current = legible;
        setLit(legible);
      }
    },
  });

  /** Point the films at a shift a control chose. Absolute, wrapped, and it cancels a travel. */
  const aim = (to: number) => {
    const at = wrap(to);
    wantPhase.current = at;
    const shown = Math.round(at) % NOTCHES;
    if (shown !== notchRef.current) {
      notchRef.current = shown;
      setNotch(shown);
    }
    setNudges((count) => count + 1);
  };

  /** Where along the rail a press landed, in notches. */
  const railAt = (rail: HTMLElement, clientX: number) => {
    const rect = rail.getBoundingClientRect();
    if (rect.width <= 0) return;
    aim(Math.round(((clientX - rect.left) / rect.width) * NOTCHES));
  };

  const onRailKey = (event: KeyboardEvent<HTMLDivElement>) => {
    const key = event.key;
    let to: number | null = null;
    if (key === 'ArrowRight' || key === 'ArrowUp') to = notchRef.current + 1;
    else if (key === 'ArrowLeft' || key === 'ArrowDown') to = notchRef.current - 1;
    else if (key === 'PageUp') to = notchRef.current + PAGE_STEP;
    else if (key === 'PageDown') to = notchRef.current - PAGE_STEP;
    else if (key === 'Home') to = 0;
    else if (key === 'End') to = NOTCHES - 1;
    if (to === null) return;
    // Arrows scroll the page and Home jumps it; here the rail is the thing being addressed.
    event.preventDefault();
    aim(to);
  };

  const onReveal = () => {
    wantSolved.current = true;
    setSkewed(false);
    setNudges((count) => count + 1);
  };

  const onSkew = () => {
    const next = !skewed;
    setSkewed(next);
    wantSkew.current = next ? SKEW_LATCH * DEG : 0;
    setNudges((count) => count + 1);
  };

  /*
   * The one path from React back into the scene. Under reduced motion there is no loop to
   * pick a request up, so a control's frame is asked for here rather than from inside the
   * handler that made the request — and `reduced` is in the list because the hook tears the
   * scene down and rebuilds it when that flips.
   */
  useEffect(() => {
    requestRender();
  }, [nudges, reduced, requestRender]);

  return (
    <div className="moire-scratch-stage" data-compact={compact ? 'true' : undefined}>
      <div className="moire-scratch-card">
        <p className="moire-scratch-kicker">Autumn drop</p>
        <h3 className="moire-scratch-title">Your code is under the film</h3>
        <p className="moire-scratch-lead">
          One code per customer, good on everything in the drop until the thirtieth. Slide the
          film across the panel until the code catches the light.
        </p>

        <div className="moire-scratch-pane">
          <div className="moire-scratch-film" ref={stageRef} aria-hidden="true">
            <canvas ref={canvasRef} />
          </div>
          <div className="moire-scratch-veil">
            {lit ? <code className="moire-scratch-code">{PROMO}</code> : null}
          </div>
        </div>

        <p className="moire-scratch-status" role="status">
          {lit
            ? `Promo code in the fringe: ${PROMO}`
            : 'The code is still dark. Slide the film across, or reveal it outright.'}
        </p>

        <div className="moire-scratch-rail">
          <span className="moire-scratch-rail-label" id={railId}>
            Film position
          </span>
          <div
            className="moire-scratch-slider"
            role="slider"
            tabIndex={compact ? -1 : 0}
            aria-labelledby={railId}
            aria-valuemin={0}
            aria-valuemax={NOTCHES - 1}
            aria-valuenow={notch}
            aria-valuetext={`Notch ${notch} of ${NOTCHES}`}
            onKeyDown={onRailKey}
            onPointerDown={(event) => {
              event.currentTarget.setPointerCapture(event.pointerId);
              railAt(event.currentTarget, event.clientX);
            }}
            onPointerMove={(event) => {
              if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
              railAt(event.currentTarget, event.clientX);
            }}
          >
            <span className="moire-scratch-track" />
            <span
              className="moire-scratch-thumb"
              style={{ left: `${(notch / NOTCHES) * 100}%` }}
            />
          </div>
        </div>

        <div className="moire-scratch-foot">
          <button
            type="button"
            className="moire-scratch-button"
            tabIndex={compact ? -1 : undefined}
            onClick={onReveal}
          >
            Reveal the code
          </button>
          <button
            type="button"
            className="moire-scratch-button moire-scratch-skew"
            aria-pressed={skewed}
            tabIndex={compact ? -1 : undefined}
            onClick={onSkew}
          >
            Skew the top film
          </button>
        </div>
      </div>

      <p className="moire-scratch-hint">Drag across &middot; up or down to skew</p>
    </div>
  );
}

export default MoireScratch;





