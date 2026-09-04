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
  /**
   * The 298x240 catalogue card: the same nine slats on the same loop, handed the
   * whole frame at that real size and never scaled. Presentation only — the word,
   * the slats and their timing are untouched. See `split-shutter.css`.
   */
  compact?: boolean;
};

/** Nine slats, not a prop: the stylesheet times them by `nth-child`. */
const SLATS = 9;

export function SplitShutter({
  word = 'OPEN',
  slats = ['SHUTTER', 'MOTION'],
  label = 'APERTURE / 09',
  compact = false,
}: SplitShutterProps = {}) {
  return (
    <div className="split-shutter-stage" data-compact={compact ? 'true' : undefined}>
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
