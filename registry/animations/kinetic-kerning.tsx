'use client';

import type { CSSProperties } from 'react';

import './kinetic-kerning.css';

export type KineticKerningProps = {
  /** One letter per glyph slot. */
  word?: string;
  /** The line that settles underneath. */
  caption?: string;
};

export function KineticKerning({
  word = 'KERNING',
  caption = 'SPACING IS MOTION',
}: KineticKerningProps = {}) {
  const letters = [...word];
  return (
    <div className="kinetic-kerning-stage">
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
