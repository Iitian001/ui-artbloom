'use client';

import type { CSSProperties } from 'react';

import './bubble-burst.css';

/** Four bubbles, each spraying eight drops on the same clock. */
const BUBBLES = 4;
const DROPS = 8;

export function BubbleBurst() {
  return (
    <div className="bubble-burst-stage">
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
