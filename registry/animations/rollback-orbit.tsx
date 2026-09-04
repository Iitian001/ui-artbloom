'use client';

import { useState } from 'react';

import './rollback-orbit.css';

export type RollbackOrbitProps = {
  /** Shown under the rail before the roll. */
  label?: string;
  /** Replaces it while the ball is travelling. */
  activeLabel?: string;
  /**
   * The 298x240 catalogue card. The same rail, ball and keyframes at exactly their
   * authored size — a 298px frame is wide enough for a 280px rail, so nothing is
   * scaled — with the corner wordmark dropped and the label moved onto the bottom
   * edge, where a 240px box can actually show it. Presentation only, and all of it
   * in `rollback-orbit.css`.
   */
  compact?: boolean;
};

export function RollbackOrbit({
  label = 'Press to roll',
  activeLabel = 'In motion',
  compact = false,
}: RollbackOrbitProps = {}) {
  const [rolling, setRolling] = useState(false);
  const run = () => {
    if (rolling) return;
    setRolling(true);
    window.setTimeout(() => setRolling(false), 2100);
  };
  return (
    <div className="rollback-orbit-stage" data-compact={compact ? 'true' : undefined}>
      {/* In a card the frame is aria-hidden, and a focusable node inside one is a trap
          with no name — the card's own title link is the way to the item. The press
          still works in both: only the tab stop goes. */}
      <button
        type="button"
        className={`rollback-orbit ${rolling ? 'running' : ''}`}
        onClick={run}
        tabIndex={compact ? -1 : undefined}
        aria-label="Roll the ball to its target and back"
      >
        <span className="roll-rail">
          <i className="roll-ball">
            <b />
          </i>
          <i className="roll-target" />
        </span>
        <em>{rolling ? activeLabel : label}</em>
      </button>
    </div>
  );
}
