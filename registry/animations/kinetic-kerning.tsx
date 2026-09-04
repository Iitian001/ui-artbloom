'use client';

import type { CSSProperties } from 'react';

import './kinetic-kerning.css';

export type KineticKerningProps = {
  /** One letter per glyph slot. */
  word?: string;
  /** The line that settles underneath. */
  caption?: string;
  /**
   * The 298x240 catalogue card: the same word on the same keyframe, sized to the
   * card rather than to a marketing section, with the tagline dropped.
   * Presentation only — see `kinetic-kerning.css`. Nothing in here is focusable in
   * either mode, since the word is a `role="img"` and not a control, so the card's
   * tab order needs no help from this component.
   */
  compact?: boolean;
};

export function KineticKerning({
  word = 'KERNING',
  caption = 'SPACING IS MOTION',
  compact = false,
}: KineticKerningProps = {}) {
  const letters = [...word];
  return (
    <div className="kinetic-kerning-stage" data-compact={compact ? 'true' : undefined}>
      <div
        className="kinetic-kerning"
        role="img"
        aria-label={`${word} letters shifting into precise spacing`}
        style={
          {
            // The stylesheet divides the stage width by `--n` to pick a size, and
            // scatters each letter away from `--mid`, so any word stays centred.
            '--n': letters.length,
            '--mid': (letters.length - 1) / 2,
          } as CSSProperties
        }
      >
        {letters.map((letter, index) => (
          <i style={{ '--i': index } as CSSProperties} key={`${letter}-${index}`}>
            {letter}
          </i>
        ))}
        <span>{caption}</span>
      </div>
    </div>
  );
}
