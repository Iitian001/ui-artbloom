'use client';

import type { CSSProperties } from 'react';

import './pulse-choir.css';

/** 32 bars, each with a fixed peak so the field reads as one waveform. */
const BARS = 32;

/**
 * `compact` is the 298x240 catalogue card: the same 32 bars on the same loop, handed
 * the whole frame instead of a 500px block in the middle of it. The field runs on its
 * own, so the card is alive on load with nothing to hover; and nothing in here is
 * focusable or takes a pointer event, so there is no tab stop to blank under the
 * frame's `aria-hidden`. Presentation only — see `pulse-choir.css`.
 */
export type PulseChoirProps = { compact?: boolean };

export function PulseChoir({ compact = false }: PulseChoirProps) {
  return (
    <div className="pulse-choir-stage" data-compact={compact ? 'true' : undefined}>
      <div className="pulse-choir" role="img" aria-label="A synchronized field of equalizer bars">
        <div>
          {Array.from({ length: BARS }, (_, index) => (
            <i
              style={
                {
                  '--i': index,
                  '--peak': (0.2 + Math.abs(Math.sin(index * 0.72)) * 0.8).toFixed(2),
                } as CSSProperties
              }
              key={index}
            />
          ))}
        </div>
        <span>
          <b>LIVE</b> / MOTION FREQUENCY
        </span>
      </div>
    </div>
  );
}
