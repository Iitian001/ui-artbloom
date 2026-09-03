'use client';

import { useState } from 'react';
import type { CSSProperties } from 'react';

import './curtain-sequence.css';

export type CurtainSequenceProps = {
  /** Shown on the plate before the run. */
  label?: string;
  /** Replaces it while the panels are travelling. */
  activeLabel?: string;
};

/** Six panels, not a prop: the stylesheet times each one by `nth-child`. */
const PANELS = 6;

export function CurtainSequence({
  label = 'CURTAIN',
  activeLabel = 'SEQUENCE',
}: CurtainSequenceProps = {}) {
  const [running, setRunning] = useState(false);
  const run = () => {
    if (running) return;
    setRunning(true);
    window.setTimeout(() => setRunning(false), 2850);
  };
  return (
    <div className="curtain-sequence-stage">
      <button
        type="button"
        className={`curtain-sequence ${running ? 'running' : ''}`}
        onClick={run}
        aria-label="Run the curtain transition"
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
