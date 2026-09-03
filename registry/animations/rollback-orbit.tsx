'use client';

import { useState } from 'react';

import './rollback-orbit.css';

export type RollbackOrbitProps = {
  /** Shown under the rail before the roll. */
  label?: string;
  /** Replaces it while the ball is travelling. */
  activeLabel?: string;
};

export function RollbackOrbit({
  label = 'Press to roll',
  activeLabel = 'In motion',
}: RollbackOrbitProps = {}) {
  const [rolling, setRolling] = useState(false);
  const run = () => {
    if (rolling) return;
    setRolling(true);
    window.setTimeout(() => setRolling(false), 2100);
  };
  return (
    <div className="rollback-orbit-stage">
      <button
        type="button"
        className={`rollback-orbit ${rolling ? 'running' : ''}`}
        onClick={run}
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
