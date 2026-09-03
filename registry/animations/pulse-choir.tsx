'use client';

import type { CSSProperties } from 'react';

import './pulse-choir.css';

/** 32 bars, each with a fixed peak so the field reads as one waveform. */
const BARS = 32;

export function PulseChoir() {
  return (
    <div className="pulse-choir-stage">
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
