'use client';

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react';

/**
 * A sliding-pill segmented control — the iOS pattern, built with one accent.
 *
 * There is a single indicator, not one box per state: a pill that lives behind the
 * active segment and glides to the next on a CSS transform. The geometry is pure
 * arithmetic rather than measurement, because the segments are equal width — the pill
 * is one nth of the track wide and travels exactly one segment per index, so a
 * `translateX(value * 100%)` puts it under segment `value` at any track size or zoom.
 *
 * FULL mode is a live radiogroup: arrow keys move the selection, tabindex roves so the
 * group is one tab stop, and a slow auto-cycle glides the pill on its own until a
 * pointer or focus arrives. COMPACT mode is the catalogue card — the same look frozen
 * on one selection, out of the tab order, with no timer running.
 */

/** prefers-reduced-motion, read in JS so the auto-cycle can be skipped outright. The
 *  CSS transition is disabled separately by Tailwind's `motion-reduce:` variant, so
 *  the pill never eases even before this hook has hydrated. */
function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  return reduced;
}

type Variant = 'neutral' | 'accent';

interface Segment {
  value: string;
  label: string;
  icon?: ReactNode;
}

interface SegmentsProps {
  options: Segment[];
  /** Index of the active segment. */
  value: number;
  onChange: (index: number) => void;
  /** Visible caption, also the radiogroup's accessible name. */
  label: string;
  variant?: Variant;
  /** FULL sets true; COMPACT sets false to drop the tab stop and key handling. */
  interactive?: boolean;
  compact?: boolean;
}

const ICON = 'h-4 w-4 shrink-0';

function OverviewIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={ICON} aria-hidden="true">
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}

function ActivityIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={ICON} aria-hidden="true">
      <path d="M3 12h4l3 8 4-16 3 8h4" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={ICON} aria-hidden="true">
      <circle cx="8" cy="6" r="2" />
      <line x1="10" y1="6" x2="20" y2="6" />
      <line x1="4" y1="6" x2="6" y2="6" />
      <circle cx="16" cy="12" r="2" />
      <line x1="4" y1="12" x2="14" y2="12" />
      <line x1="18" y1="12" x2="20" y2="12" />
      <circle cx="10" cy="18" r="2" />
      <line x1="4" y1="18" x2="8" y2="18" />
      <line x1="12" y1="18" x2="20" y2="18" />
    </svg>
  );
}

function Segments({
  options,
  value,
  onChange,
  label,
  variant = 'neutral',
  interactive = true,
  compact = false,
}: SegmentsProps) {
  const uid = useId();
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const count = options.length;

  // Arrow keys walk the group and carry focus with the selection; roving tabindex
  // keeps the whole control a single tab stop. Home/End jump to the ends.
  const onKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (!interactive) return;
      let next = value;
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (value + 1) % count;
      else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (value - 1 + count) % count;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = count - 1;
      else return;
      event.preventDefault();
      onChange(next);
      buttons.current[next]?.focus();
    },
    [count, interactive, onChange, value],
  );

  return (
    <div className="flex flex-col items-center gap-2">
      <span id={`${uid}-label`} className="text-[0.7rem] font-medium uppercase tracking-[0.12em] text-muted-foreground">
        {label}
      </span>
      <div
        role="radiogroup"
        aria-labelledby={`${uid}-label`}
        aria-orientation="horizontal"
        onKeyDown={onKeyDown}
        style={{
          gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))`,
          touchAction: compact ? 'pan-y' : undefined,
        }}
        className={[
          'relative isolate grid w-full max-w-[22rem] select-none rounded-full border border-border/60 bg-muted p-1',
          compact ? 'h-9' : 'h-11',
        ].join(' ')}
      >
        {/* The one moving part: a pill one segment wide, slid to the active index. */}
        <div
          aria-hidden="true"
          className={[
            'pointer-events-none absolute inset-y-1 left-1 rounded-full',
            'transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] motion-reduce:transition-none',
            variant === 'accent'
              ? 'bg-indigo-500 shadow-[0_1px_10px_-1px_rgb(99_102_241_/_0.6)]'
              : 'bg-card shadow-[0_1px_3px_rgb(0_0_0_/_0.16)] ring-1 ring-black/[0.04] dark:ring-white/[0.06]',
          ].join(' ')}
          style={{
            width: `calc((100% - 0.5rem) / ${count})`,
            transform: `translateX(${value * 100}%)`,
          }}
        />
        {options.map((option, index) => {
          const active = index === value;
          const activeText = variant === 'accent' ? 'text-white' : 'text-foreground';
          return (
            <button
              key={option.value}
              ref={(node) => {
                buttons.current[index] = node;
              }}
              type="button"
              role="radio"
              aria-checked={active}
              tabIndex={!interactive ? -1 : active ? 0 : -1}
              onClick={interactive ? () => onChange(index) : undefined}
              className={[
                'relative z-10 flex items-center justify-center gap-1.5 rounded-full font-medium transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                compact ? 'text-xs' : 'text-sm',
                interactive ? 'cursor-pointer' : 'cursor-default',
                active ? activeText : 'text-muted-foreground',
                interactive && !active ? 'hover:text-foreground' : '',
              ].join(' ')}
              style={{ gridColumn: index + 1 }}
            >
              {option.icon}
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

const RANGES: Segment[] = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
];

const SECTIONS: Segment[] = [
  { value: 'overview', label: 'Overview', icon: <OverviewIcon /> },
  { value: 'activity', label: 'Activity', icon: <ActivityIcon /> },
  { value: 'settings', label: 'Settings', icon: <SettingsIcon /> },
];

export function SegmentedControl({
  compact = false,
  className,
}: {
  compact?: boolean;
  className?: string;
}) {
  const reduced = usePrefersReducedMotion();
  const [range, setRange] = useState(1);
  const [section, setSection] = useState(0);
  // Two reasons to pause the auto-cycle, tracked apart: a pointer that leaves while
  // focus stays inside must not restart the timer, and vice versa.
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const engaged = hovered || focused;

  // The pill glides on its own until someone arrives, so the static card looks alive.
  // Skipped in compact (a frozen card), under reduced motion, and while engaged.
  useEffect(() => {
    if (compact || reduced || engaged) return;
    const id = window.setInterval(() => {
      setRange((value) => (value + 1) % RANGES.length);
      setSection((value) => (value + 1) % SECTIONS.length);
    }, 2200);
    return () => window.clearInterval(id);
  }, [compact, reduced, engaged]);

  const wrap = ['flex w-full items-center justify-center', className].filter(Boolean).join(' ');

  if (compact) {
    // The catalogue card: both controls, one selection each, nothing tabbable, and
    // centred on `h-full` so the pair fills the frame instead of pinning to the top
    // over a slab of empty space.
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="flex w-full max-w-[20rem] flex-col items-center gap-7 px-4">
          <Segments
            options={RANGES}
            value={0}
            onChange={() => {}}
            label="Range"
            variant="neutral"
            interactive={false}
            compact
          />
          <Segments
            options={SECTIONS}
            value={1}
            onChange={() => {}}
            label="Section"
            variant="accent"
            interactive={false}
            compact
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className={wrap}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false);
      }}
    >
      <div className="flex w-full max-w-[24rem] flex-col items-center gap-7 px-4 py-2">
        <Segments options={RANGES} value={range} onChange={setRange} label="Range" variant="neutral" />
        <Segments options={SECTIONS} value={section} onChange={setSection} label="Section" variant="accent" />
      </div>
    </div>
  );
}

export default SegmentedControl;
