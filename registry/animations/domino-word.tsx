'use client';

import type { CSSProperties } from 'react';

import './domino-word.css';

export type DominoWordProps = {
  /** Each letter becomes a tile, so short words read best. */
  word?: string;
};

export function DominoWord({ word = 'DOMINO' }: DominoWordProps = {}) {
  const letters = [...word];
  return (
    <div className="domino-word-stage">
      <div
        className="domino-word"
        role="img"
        aria-label={`${word} letter tiles falling like dominoes`}
        // The stylesheet sizes a tile from the stage width divided by the letter
        // count, so a long word narrows the rack instead of overflowing it.
        style={{ '--n': letters.length } as CSSProperties}
      >
        {letters.map((letter, index) => (
          <span style={{ '--i': index } as CSSProperties} key={`${letter}-${index}`}>
            <b>{letter}</b>
            <i />
          </span>
        ))}
      </div>
    </div>
  );
}
