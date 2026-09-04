'use client';

import type { CSSProperties } from 'react';

import './domino-word.css';

export type DominoWordProps = {
  /** Each letter becomes a tile, so short words read best. */
  word?: string;
  /**
   * The 298x240 catalogue card: the same rack and the same fall, handed the whole
   * frame. Presentation only — see `domino-word.css`. There is no tab order to
   * withdraw under the card's `aria-hidden`, because the rack is a `role="img"`
   * div of spans and nothing in it was ever focusable or pointer-driven.
   */
  compact?: boolean;
};

export function DominoWord({ word = 'DOMINO', compact = false }: DominoWordProps = {}) {
  const letters = [...word];
  return (
    <div className="domino-word-stage" data-compact={compact ? 'true' : undefined}>
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
