'use client';

import type { CSSProperties } from 'react';

import './lenticular-shift.css';

export type LenticularShiftProps = {
  /** The two words the surface alternates between as it turns. */
  faces?: readonly [string, string];
  /** Corner marker. */
  label?: string;
  /**
   * The 298x240 catalogue card: the same plate and the same keyframes, given the
   * frame's full width and 70% of its height, with the corner marker dropped.
   * Presentation only, and all of it in `lenticular-shift.css`.
   *
   * Nothing in here is focusable in either mode — the plate is one `role="img"`
   * and the surface takes no pointer events — so there is no tab stop to pull out
   * from under the card frame's `aria-hidden`.
   */
  compact?: boolean;
};

/** 18 slats, not a prop: the stylesheet divides the lens width by that count. */
const SLATS = 18;

export function LenticularShift({
  faces = ['LENS', 'SHIFT'],
  label = 'VIEW / SHIFT',
  compact = false,
}: LenticularShiftProps = {}) {
  return (
    <div className="lenticular-shift-stage" data-compact={compact ? 'true' : undefined}>
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
