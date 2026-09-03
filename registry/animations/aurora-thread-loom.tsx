'use client';

import type { CSSProperties } from 'react';

import './aurora-thread-loom.css';

/** 48 threads: the stylesheet's wave math is centred on thread 24. */
const THREADS = 48;

export function AuroraThreadLoom() {
  return (
    <div className="aurora-thread-loom-stage">
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
