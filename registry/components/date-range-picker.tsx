"use client";

import { useCallback, useMemo, useState } from "react";

import { cn } from "@/lib/utils";

/**
 * A calendar range picker.
 *
 * The whole component runs off a fixed reference "today" rather than `Date.now()`:
 * the catalogue renders this card on every build and in every screenshot, and a grid
 * whose highlighted month drifts with the wall clock would never look the same twice.
 * So the displayed month, the sample range and the today-ring are all pinned to one
 * constant here, and nothing in the render path reads the real clock.
 *
 * Selection is two clicks. The first opens a range; the second closes it, swapping the
 * two if they arrive out of order, so a range is always drawn low-to-high. Between the
 * two clicks a hover previews the range that a second click would commit — the band you
 * see under the pointer is the band you would get. A day is stored as a local-midnight
 * `Date`, and everything downstream compares `.getTime()`, so "in range" is an integer
 * comparison and never a string or a timezone.
 */

/** The pinned clock. March 2026 opens on a Sunday, so the grid has no leading blank and
 *  reads cleanly; April (the second panel) starts on a Wednesday, so the pair shows both
 *  a flush month and an offset one. Month is 0-indexed, DOM-style. */
const REF_YEAR = 2026;
const REF_MONTH = 2; // March
const REF_DAY = 15;

/** The range the card wears at rest. Mar 3 – Mar 12 sits inside the first two rows, so
 *  the endpoints, the band and its rounded caps are all on screen the instant it mounts. */
const SAMPLE_START = new Date(REF_YEAR, REF_MONTH, 3);
const SAMPLE_END = new Date(REF_YEAR, REF_MONTH, 12);

const TODAY_MS = new Date(REF_YEAR, REF_MONTH, REF_DAY).getTime();

/** Sunday-first, to match `Date.getDay()` returning 0 for Sunday. Single glyphs keep the
 *  grid a grid; the full name rides along as an `aria-label` for the column. */
const WEEKDAYS = [
  { short: "S", long: "Sunday" },
  { short: "M", long: "Monday" },
  { short: "T", long: "Tuesday" },
  { short: "W", long: "Wednesday" },
  { short: "T", long: "Thursday" },
  { short: "F", long: "Friday" },
  { short: "S", long: "Saturday" },
] as const;

/** All 'en-US', not the runtime locale: the label a screenshot shows must not depend on
 *  the machine that took it. */
const shortFmt = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" });
const fullFmt = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
});
const titleFmt = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" });

function daysInMonth(year: number, month: number) {
  // Day 0 of the next month is the last day of this one.
  return new Date(year, month + 1, 0).getDate();
}

/** Which weekday the 1st lands on, 0 = Sunday — i.e. how many leading blanks the grid
 *  needs before the first number. */
function firstWeekday(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

function addMonths(year: number, month: number, delta: number) {
  // Feeding an out-of-range month to the Date constructor is the documented way to roll
  // the year over, in either direction.
  const rolled = new Date(year, month + delta, 1);
  return { year: rolled.getFullYear(), month: rolled.getMonth() };
}

/** The band's tint. One violet, two opacities: the grid is darker so it never washes out
 *  against the lighter card. Filled endpoints are a solid violet-600 on top of this. */
const BAND = "bg-violet-500/10 dark:bg-violet-500/15";

interface MonthGridProps {
  year: number;
  month: number;
  /** Effective range endpoints in ms (low ≤ high), or null for no range. When the two are
   *  equal the range is a single day: an endpoint with no band. */
  lo: number | null;
  hi: number | null;
  /** Live picking, so days can be `<button>`s; false in the card, where nothing is
   *  focusable and the days are plain `<span>`s. */
  interactive: boolean;
  onPick?: (date: Date) => void;
  onHover?: (date: Date) => void;
  onPrev?: () => void;
  onNext?: () => void;
  /** Lets the parent hide a nav control responsively without unmounting it. */
  prevClassName?: string;
  nextClassName?: string;
  /** Card-sized cells. The live picker leaves this off and keeps `size-9`; the
   *  compact catalogue still turns it on so a whole month clears the 240px frame. */
  dense?: boolean;
  className?: string;
}

/**
 * One month. It owns its own weekday header, its own title bar and — when the parent hands
 * it `onPrev`/`onNext` — its own nav arrows, positioned absolutely so the title stays
 * centred whether or not an arrow is showing. The grid is built once per (year, month).
 */
function MonthGrid({
  year,
  month,
  lo,
  hi,
  interactive,
  onPick,
  onHover,
  onPrev,
  onNext,
  prevClassName,
  nextClassName,
  dense = false,
  className,
}: MonthGridProps) {
  // One knob for the whole month. Every fixed size below reads from these so the
  // dense card and the roomy live picker stay one grid.
  const cell = dense ? "size-7 text-xs" : "size-9 text-sm";
  const cellBox = dense ? "h-7" : "h-9";
  const gridWidth = dense ? "w-56" : "w-64";
  const weeks = useMemo(() => {
    const lead = firstWeekday(year, month);
    const count = daysInMonth(year, month);
    const cells: (number | null)[] = [];
    for (let i = 0; i < lead; i += 1) cells.push(null);
    for (let d = 1; d <= count; d += 1) cells.push(d);
    // Pad the tail so every row has seven cells and the columns stay square.
    while (cells.length % 7 !== 0) cells.push(null);
    const rows: (number | null)[][] = [];
    for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));
    return rows;
  }, [year, month]);

  const hasRange = lo !== null && hi !== null;
  const isSpan = hasRange && lo !== hi;

  return (
    <div className={cn(gridWidth, className)}>
      <div className={cn("relative flex items-center justify-center", dense ? "mb-0.5 h-7" : "mb-1 h-9")}>
        {onPrev ? (
          <NavButton className={cn("absolute left-0", prevClassName)} label="Previous month" dir="prev" onClick={onPrev} />
        ) : null}
        <span className={cn("font-medium text-foreground", dense ? "text-xs" : "text-sm")}>{titleFmt.format(new Date(year, month, 1))}</span>
        {onNext ? (
          <NavButton className={cn("absolute right-0", nextClassName)} label="Next month" dir="next" onClick={onNext} />
        ) : null}
      </div>

      <div role="grid" aria-label={titleFmt.format(new Date(year, month, 1))}>
        <div role="row" className="grid grid-cols-7">
          {WEEKDAYS.map((w, i) => (
            <div
              key={i}
              role="columnheader"
              aria-label={w.long}
              className={cn(
                "flex items-center justify-center font-medium text-muted-foreground",
                dense ? "h-5 text-[10px]" : "h-8 text-xs",
              )}
            >
              {w.short}
            </div>
          ))}
        </div>

        {weeks.map((week, wi) => (
          <div key={wi} role="row" className="grid grid-cols-7">
            {week.map((day, di) => {
              if (day === null) {
                return <div key={di} role="gridcell" aria-hidden className={cellBox} />;
              }

              const date = new Date(year, month, day);
              const t = date.getTime();
              const isStart = hasRange && t === lo;
              const isEnd = hasRange && t === hi;
              const isEndpoint = isStart || isEnd;
              const inRange = hasRange && t > (lo as number) && t < (hi as number);
              const isToday = t === TODAY_MS;

              const cellBand = isSpan
                ? isStart
                  ? cn(BAND, "rounded-l-full")
                  : isEnd
                    ? cn(BAND, "rounded-r-full")
                    : inRange
                      ? BAND
                      : undefined
                : undefined;

              const circle = cn(
                "relative z-10 flex items-center justify-center rounded-full tabular-nums",
                cell,
                "transition-colors motion-reduce:transition-none",
                isEndpoint
                  ? "bg-violet-600 font-medium text-white"
                  : inRange
                    ? "text-violet-700 dark:text-violet-200"
                    : "text-foreground",
                !isEndpoint && isToday && "ring-1 ring-inset ring-violet-500/50",
                interactive && !isEndpoint && "hover:bg-violet-500/10 dark:hover:bg-violet-500/15",
                interactive && "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500",
              );

              const label = fullFmt.format(date);

              return (
                <div
                  key={di}
                  role="gridcell"
                  aria-selected={isEndpoint || inRange}
                  className={cn("relative flex items-center justify-center", cellBox, cellBand)}
                >
                  {interactive ? (
                    <button
                      type="button"
                      className={circle}
                      aria-label={label}
                      aria-current={isToday ? "date" : undefined}
                      onClick={() => onPick?.(date)}
                      onMouseEnter={() => onHover?.(date)}
                      onFocus={() => onHover?.(date)}
                    >
                      {day}
                    </button>
                  ) : (
                    <span className={circle} aria-label={label} tabIndex={-1}>
                      {day}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

function NavButton({
  label,
  dir,
  onClick,
  className,
}: {
  label: string;
  dir: "prev" | "next";
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={cn(
        "flex size-8 items-center justify-center rounded-lg text-muted-foreground",
        "transition-colors motion-reduce:transition-none hover:bg-violet-500/10 hover:text-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500",
        className,
      )}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4" aria-hidden>
        <path d={dir === "prev" ? "m15 18-6-6 6-6" : "m9 18 6-6-6-6"} />
      </svg>
    </button>
  );
}

/** The card frame, shared by both modes. */
function Shell({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "inline-block rounded-xl border border-border bg-card p-4 text-card-foreground shadow-sm",
        className,
      )}
    >
      {children}
    </div>
  );
}

/**
 * The public component. `compact` is not a hook-bearing branch — it picks between a still
 * card and the live picker, and each of those calls its own hooks unconditionally, so the
 * two never share a hook order.
 */
export function DateRangePicker({ compact = false, className }: { compact?: boolean; className?: string }) {
  if (compact) {
    // A still. One month, the sample range already on it, nothing focusable, and `pan-y` so
    // a finger dragging down the catalogue scrolls the page instead of snagging on the grid.
    // It shares MonthGrid with the live picker, so the two can never drift.
    return (
      <div className={cn("flex h-full items-center justify-center", className)} style={{ touchAction: "pan-y" }}>
        <Shell className="p-3">
          <p className="mb-2 px-0.5 text-[13px] font-medium text-foreground">
            {shortFmt.format(SAMPLE_START)} <span className="text-muted-foreground">–</span>{" "}
            {shortFmt.format(SAMPLE_END)}
          </p>
          <MonthGrid
            year={REF_YEAR}
            month={REF_MONTH}
            lo={SAMPLE_START.getTime()}
            hi={SAMPLE_END.getTime()}
            interactive={false}
            dense
          />
        </Shell>
      </div>
    );
  }
  return <LivePicker className={className} />;
}

function LivePicker({ className }: { className?: string }) {
  const [view, setView] = useState({ year: REF_YEAR, month: REF_MONTH });
  const [start, setStart] = useState<Date | null>(SAMPLE_START);
  const [end, setEnd] = useState<Date | null>(SAMPLE_END);
  const [hover, setHover] = useState<Date | null>(null);

  // A click either opens a fresh range (nothing picked yet, or a full range already sitting
  // there) or closes the open one, ordering the two endpoints so the range is always drawn
  // low-to-high. Clicking a day twice is a legal one-day range.
  const pick = useCallback(
    (date: Date) => {
      if (start === null || end !== null) {
        setStart(date);
        setEnd(null);
        setHover(null);
      } else {
        if (date.getTime() < start.getTime()) {
          setEnd(start);
          setStart(date);
        } else {
          setEnd(date);
        }
        setHover(null);
      }
    },
    [start, end],
  );

  const clear = useCallback(() => {
    setStart(null);
    setEnd(null);
    setHover(null);
  }, []);

  // The effective range folds the hover in: once a start is down and no end is picked, the
  // pointer's day stands in for the end, so what the grid highlights is what a click commits.
  const { lo, hi } = useMemo(() => {
    if (start && end) {
      const a = start.getTime();
      const b = end.getTime();
      return { lo: Math.min(a, b), hi: Math.max(a, b) };
    }
    if (start && hover) {
      const a = start.getTime();
      const b = hover.getTime();
      return { lo: Math.min(a, b), hi: Math.max(a, b) };
    }
    if (start) return { lo: start.getTime(), hi: start.getTime() };
    return { lo: null, hi: null };
  }, [start, end, hover]);

  const second = addMonths(view.year, view.month, 1);
  const goPrev = useCallback(() => setView((v) => addMonths(v.year, v.month, -1)), []);
  const goNext = useCallback(() => setView((v) => addMonths(v.year, v.month, 1)), []);

  const rangeLabel = start
    ? end
      ? `${shortFmt.format(start)} – ${shortFmt.format(end)}`
      : `${shortFmt.format(start)} – …`
    : "Select a start date";

  return (
    <div className={cn("flex justify-center", className)}>
      <Shell>
        <div className="mb-3 flex items-center justify-between gap-4 px-1">
          <p className={cn("text-sm font-medium", start ? "text-foreground" : "text-muted-foreground")}>
            {rangeLabel}
          </p>
          <button
            type="button"
            onClick={clear}
            disabled={!start}
            className={cn(
              "rounded-lg px-2 py-1 text-xs font-medium transition-colors motion-reduce:transition-none",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500",
              start
                ? "text-violet-600 hover:bg-violet-500/10 dark:text-violet-400"
                : "cursor-not-allowed text-muted-foreground/50",
            )}
          >
            Clear
          </button>
        </div>

        <div className="flex gap-6">
          <MonthGrid
            year={view.year}
            month={view.month}
            lo={lo}
            hi={hi}
            interactive
            onPick={pick}
            onHover={setHover}
            onPrev={goPrev}
            // The left panel carries the next arrow only when it is the sole panel; on wide
            // widths the right panel owns it.
            onNext={goNext}
            nextClassName="md:hidden"
          />
          <MonthGrid
            year={second.year}
            month={second.month}
            lo={lo}
            hi={hi}
            interactive
            onPick={pick}
            onHover={setHover}
            onNext={goNext}
            className="hidden md:block"
          />
        </div>
      </Shell>
    </div>
  );
}

export default DateRangePicker;
