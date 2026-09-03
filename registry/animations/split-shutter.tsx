'use client';

import type { CSSProperties } from 'react';

import './split-shutter.css';

export type SplitShutterProps = {
  /** The word the shutters part to reveal. */
  word?: string;
  /** Alternating text printed on the slats. */
  slats?: readonly [string, string];
  /** Corner marker. */
  label?: string;
};

/** Nine slats, not a prop: the stylesheet times them by `nth-child`. */
const SLATS = 9;

export function SplitShutter({
  word = 'OPEN',
  slats = ['SHUTTER', 'MOTION'],
  label = 'APERTURE / 09',
}: SplitShutterProps = {}) {
  return (
    <div className="split-shutter-stage">
      <div
        className="split-shutter"
        role="img"
        aria-label={`Shutters revealing the word ${word}`}
        // The stylesheet divides the stage width by `--n` to size the word.
        style={{ '--n': word.length } as CSSProperties}
      >
        <b>{word}</b>
        <div>
          {Array.from({ length: SLATS }, (_, index) => (
            <i style={{ '--i': index } as CSSProperties} key={index}>
              <span>{slats[index % 2]}</span>
            </i>
          ))}
        </div>
        <em>{label}</em>
      </div>
    </div>
  );
}
