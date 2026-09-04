'use client';

import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';

import './curtain-sequence.css';

export type CurtainSequenceProps = {
  /** Shown on the plate before the run. */
  label?: string;
  /** Replaces it while the panels are travelling. */
  activeLabel?: string;
  /**
   * The 298x240 catalogue card: the editorial caption and the 28px viewfinder margin
   * go, and the plate presses itself. The composition is all in `curtain-sequence.css`;
   * the self-running part is the effect below.
   */
  compact?: boolean;
};

/** Six panels, not a prop: the stylesheet times each one by `nth-child`. */
const PANELS = 6;

/** One run, end to end: 2.45s of travel plus the last panel's 375ms of stagger. */
const RUN_MS = 2850;

/**
 * The still frame a card holds between runs. Long enough for the title to land and be
 * read once the panels have left, short enough that the wipe — the reason the card is
 * worth looking at — is running about three quarters of the time.
 */
const CARD_REST_MS = 1000;

export function CurtainSequence({
  label = 'CURTAIN',
  activeLabel = 'SEQUENCE',
  compact = false,
}: CurtainSequenceProps = {}) {
  const [running, setRunning] = useState(false);
  const run = () => {
    if (running) return;
    setRunning(true);
    window.setTimeout(() => setRunning(false), RUN_MS);
  };

  /*
   * In a card the plate presses itself. There is no solver here to be alive on its own:
   * the six panels sit turned away from the viewer — `rotateY(-92deg)`, two degrees past
   * the point `backface-visibility: hidden` stops drawing them — until something sets
   * `running`, so a card of this stage is a still, which is the presentation the card
   * variants exist to replace. Flipping the same state a click flips keeps the label swap,
   * the z-index lift and the authored 2.85s exactly as they are. A press during the rest
   * beat leaves its own timer alongside this one: both write `false` at the same point of
   * the same run, so the overlap is a duplicate write rather than a second run.
   *
   * Left alone under `prefers-reduced-motion`: a full-bleed wipe restarting every four
   * seconds, unasked, in a grid of these is what that setting is for. The still frame is
   * what remains there, and pressing it still runs it. Read per cycle rather than latched
   * into state, so switching the setting on stops the card at the next flip and there is
   * no listener to add for it.
   */
  useEffect(() => {
    if (!compact) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = window.setTimeout(
      () => setRunning(!running),
      running ? RUN_MS : CARD_REST_MS,
    );
    return () => window.clearTimeout(timer);
  }, [compact, running]);

  return (
    <div className="curtain-sequence-stage" data-compact={compact ? 'true' : undefined}>
      <button
        type="button"
        className={`curtain-sequence ${running ? 'running' : ''}`}
        onClick={run}
        aria-label="Run the curtain transition"
        // The card frame is aria-hidden and the card's own title link is the way in, so
        // the plate leaves the tab order there rather than sitting as a focusable node
        // inside a hidden box. It stays clickable in both.
        tabIndex={compact ? -1 : undefined}
        // The stylesheet divides the stage width by `--n` to size the plate. Both
        // labels swap into the same slot, so the longer one sets the size.
        style={
          { '--n': Math.max(label.length, activeLabel.length) } as CSSProperties
        }
      >
        <span>{running ? 'Sequence running' : 'Press to run the sequence'}</span>
        <div aria-hidden="true">
          {Array.from({ length: PANELS }, (_, index) => (
            <i style={{ '--panel': index } as CSSProperties} key={index}>
              <small>{String(index + 1).padStart(2, '0')}</small>
            </i>
          ))}
        </div>
        <b>
          <em>{running ? activeLabel : label}</em>
          <small>{running ? 'FRAME LOCKED' : 'EDITORIAL TRANSITION'}</small>
        </b>
      </button>
    </div>
  );
}
