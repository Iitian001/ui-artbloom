'use client';

import type { CSSProperties } from 'react';

import './bubble-burst.css';

/** Four bubbles, each spraying eight drops on the same clock. */
const BUBBLES = 4;
const DROPS = 8;

/**
 * `compact` is the 298x240 catalogue card: the same four bubbles on the same clock,
 * handed the whole frame at the size they were drawn at instead of the 0.75 miniature
 * of the 320px stage the card fell back to before. Nothing is dropped — this stage
 * carries no copy — and nothing in it is focusable in either mode, so the card frame's
 * `aria-hidden` sits over no tab stop. Presentation only: see `bubble-burst.css`.
 */
export type BubbleBurstProps = { compact?: boolean };

export function BubbleBurst({ compact = false }: BubbleBurstProps) {
  return (
    <div className="bubble-burst-stage" data-compact={compact ? 'true' : undefined}>
      <div className="bubble-burst" role="img" aria-label="Bubbles rising and bursting into drops">
        {Array.from({ length: BUBBLES }, (_, bubble) => (
          <span className="bubble" style={{ '--b': bubble } as CSSProperties} key={bubble}>
            {Array.from({ length: DROPS }, (_, drop) => (
              <i
                className="bubble-drop"
                style={{ '--d': drop } as CSSProperties}
                key={drop}
              />
            ))}
          </span>
        ))}
      </div>
    </div>
  );
}
