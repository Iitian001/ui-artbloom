'use client';

import type { CSSProperties } from 'react';

import './mercury-droplet-choir.css';

/** A 5x5 grid: the stylesheet's per-droplet offsets are measured from the centre. */
const COLUMNS = 5;
const DROPLETS = COLUMNS * COLUMNS;

export function MercuryDropletChoir() {
  return (
    <div className="mercury-droplet-choir-stage">
      <div
        className="mercury-droplet-choir"
        role="img"
        aria-label="Reflective mercury droplets moving as a synchronized choir"
      >
        <div>
          {Array.from({ length: DROPLETS }, (_, index) => {
            const x = index % COLUMNS;
            const y = Math.floor(index / COLUMNS);
            const centre = (COLUMNS - 1) / 2;
            return (
              <i
                style={
                  {
                    '--i': index,
                    '--in-x': `${(centre - x) * 18}px`,
                    '--in-y': `${(centre - y) * 18}px`,
                    '--out-x': `${(x - centre) * 7}px`,
                    '--out-y': `${(y - centre) * -11}px`,
                    '--wave-y': `${(centre - x) * 10}px`,
                  } as CSSProperties
                }
                key={index}
              />
            );
          })}
        </div>
        <b>CHOIR</b>
        <span>COLLECTIVE MASS / 025</span>
      </div>
    </div>
  );
}
