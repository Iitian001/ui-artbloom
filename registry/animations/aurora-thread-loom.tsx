'use client';

import type { CSSProperties } from 'react';

import './aurora-thread-loom.css';

/** 48 threads: the stylesheet's wave math is centred on thread 24. */
const THREADS = 48;

/**
 * `compact` is the 298x240 catalogue card: the same forty-eight threads on the same
 * keyframe, handed the whole frame, with the spec caption dropped and the wordmark
 * off its hero scale. Presentation only, and all of it in `aurora-thread-loom.css`.
 *
 * Nothing else has to change for a card. The loom runs on its own clock, so the tile
 * is alive on load with no interaction to invite; it takes no pointer input, so it
 * never claims the vertical gesture; and it renders no control, so there is nothing
 * focusable for the card's `aria-hidden` frame to trap.
 */
export type AuroraThreadLoomProps = { compact?: boolean };

export function AuroraThreadLoom({ compact = false }: AuroraThreadLoomProps) {
  return (
    <div
      className="aurora-thread-loom-stage"
      data-compact={compact ? 'true' : undefined}
    >
      <div
        className="aurora-thread-loom"
        role="img"
        aria-label="Luminous threads weaving an aurora textile"
      >
        <div>
          {Array.from({ length: THREADS }, (_, index) => (
            <i style={{ '--i': index } as CSSProperties} key={index} />
          ))}
        </div>
        <b>AURORA</b>
        <span>LIGHT LOOM / 048 THREADS</span>
      </div>
    </div>
  );
}
