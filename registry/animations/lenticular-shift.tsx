'use client';

import type { CSSProperties } from 'react';

import './lenticular-shift.css';

export type LenticularShiftProps = {
  /** The two words the surface alternates between as it turns. */
  faces?: readonly [string, string];
  /** Corner marker. */
  label?: string;
};

/** 18 slats, not a prop: the stylesheet divides the lens width by that count. */
const SLATS = 18;

export function LenticularShift({
  faces = ['LENS', 'SHIFT'],
  label = 'VIEW / SHIFT',
}: LenticularShiftProps = {}) {
  return (
    <div className="lenticular-shift-stage">
      <div
        className="lenticular-shift"
        role="img"
        aria-label={`A lenticular surface alternating between ${faces[0]} and ${faces[1]}`}
      >
        {Array.from({ length: SLATS }, (_, index) => (
          <i style={{ '--i': index } as CSSProperties} key={index}>
            <span>{faces[0]}</span>
            <b>{faces[1]}</b>
          </i>
        ))}
        <em>{label}</em>
      </div>
    </div>
  );
}
