'use client';

import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from 'react';

/**
 * An autocomplete combobox: type to filter a list, arrow to navigate, Enter to pick.
 *
 * The list is filtered by case-insensitive substring, then ranked by where the match
 * lands — a query at index 0 is a prefix match and sorts above one buried mid-word, so
 * "re" surfaces React before Preact. The matched run is marked in accent in every row.
 *
 * The single accent is violet: the theme's own `--accent` token is a neutral hover
 * grey, so the colour that means "this is the choice" comes from Tailwind's built-in
 * `violet` scale, shifted a step lighter in the dark to hold the same contrast.
 *
 * `compact` is the catalogue card. The same open list with the same highlighted match,
 * but nothing tabbable: the input is read-only and out of the tab order, the rows are
 * plain divs, and `touch-action: pan-y` lets a thumb scroll the page past the card
 * instead of getting caught selecting an option.
 */

/** ~20 items, alphabetical so the no-query list reads as a tidy index. Frameworks,
 *  because the audience is developers and the sample query "re" ranks three prefix
 *  matches above one substring match — the ranking is visible in the demo, not asserted. */
const ITEMS = [
  'Alpine.js',
  'Angular',
  'Astro',
  'Backbone',
  'Ember',
  'Fresh',
  'Gatsby',
  'Lit',
  'Meteor',
  'Next.js',
  'Nuxt',
  'Preact',
  'Qwik',
  'React',
  'Redwood',
  'Remix',
  'Solid',
  'Svelte',
  'SvelteKit',
  'Vue',
] as const;

/** What the card and the freshly-mounted full widget open with, so neither is ever an
 *  empty box. Short enough to keep several matches on screen at once. */
const SAMPLE_QUERY = 're';

/** Join truthy class fragments. Saves a clsx dependency for a component that needs no
 *  more than this. */
function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

/** Rank order for the current query: substring matches only, earliest match first (so
 *  prefix matches lead), ties broken alphabetically. Empty query is the whole list. */
function rank(query: string): string[] {
  const q = query.trim().toLowerCase();
  if (!q) return [...ITEMS];
  return ITEMS.filter((item) => item.toLowerCase().includes(q)).sort((a, b) => {
    const ai = a.toLowerCase().indexOf(q);
    const bi = b.toLowerCase().indexOf(q);
    if (ai !== bi) return ai - bi;
    return a.localeCompare(b);
  });
}

/** The option label with its matched run wrapped for highlighting. Splits on the first
 *  case-insensitive hit; a blank or absent match returns the plain label. */
function highlight(label: string, query: string) {
  const q = query.trim();
  if (!q) return label;
  const at = label.toLowerCase().indexOf(q.toLowerCase());
  if (at === -1) return label;
  return (
    <>
      {label.slice(0, at)}
      <mark className="bg-transparent font-semibold text-violet-600 dark:text-violet-300">
        {label.slice(at, at + q.length)}
      </mark>
      {label.slice(at + q.length)}
    </>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.2-3.2" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="size-3.5">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="size-4">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export function Combobox({
  compact = false,
  className,
}: {
  compact?: boolean;
  className?: string;
}) {
  const [query, setQuery] = useState<string>(SAMPLE_QUERY);
  const [selected, setSelected] = useState<string | null>(null);
  const [open, setOpen] = useState<boolean>(true);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const uid = useId();
  const inputId = `${uid}-input`;
  const labelId = `${uid}-label`;
  const listId = `${uid}-list`;
  const optionId = (i: number) => `${uid}-opt-${i}`;

  const inputRef = useRef<HTMLInputElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);

  const results = useMemo(() => rank(query), [query]);

  // The card is a fixed exhibit: always open, and its "chosen" row is the top match so
  // the check has something to sit on. The live widget tracks a real selection instead.
  const isOpen = compact ? true : open;
  const selectedValue = compact ? results[0] ?? null : selected;

  // A new query invalidates the old cursor; land it back on the strongest match.
  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  // Keep the cursored row in view as ↑/↓ walk past the visible window. `nearest` so a
  // row already on screen doesn't jerk, and it scrolls the list, never the page.
  useEffect(() => {
    if (compact || !isOpen) return;
    const row = listRef.current?.querySelector<HTMLElement>(`#${CSS.escape(optionId(activeIndex))}`);
    row?.scrollIntoView({ block: 'nearest' });
  });

  function commit(value: string) {
    setSelected(value);
    setQuery(value);
    setOpen(false);
    inputRef.current?.focus();
  }

  function clear() {
    setSelected(null);
    setQuery('');
    setOpen(true);
    inputRef.current?.focus();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (compact) return;

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (!open) {
        setOpen(true);
        return;
      }
      if (results.length === 0) return;
      const step = event.key === 'ArrowDown' ? 1 : -1;
      // Wrap at both ends: (i + step + n) % n stays positive for step = -1.
      setActiveIndex((i) => (i + step + results.length) % results.length);
      return;
    }

    if (event.key === 'Enter') {
      if (open && results[activeIndex]) {
        event.preventDefault();
        commit(results[activeIndex]);
      }
      return;
    }

    if (event.key === 'Escape') {
      if (open) {
        event.preventDefault();
        setOpen(false);
      }
      return;
    }
  }

  const activeDescendant =
    isOpen && results.length > 0 && activeIndex < results.length
      ? optionId(activeIndex)
      : undefined;

  return (
    <div
      className={cn(
        'mx-auto w-full max-w-sm text-left',
        compact && 'touch-pan-y select-none',
        className,
      )}
      onBlur={(event) => {
        if (compact) return;
        if (event.currentTarget.contains(event.relatedTarget as Node | null)) return;
        setOpen(false);
      }}
    >
      <label
        id={labelId}
        htmlFor={inputId}
        className="mb-1.5 block text-sm font-medium text-foreground"
      >
        Framework
      </label>

      <div className="relative">
        <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-muted-foreground">
          <SearchIcon />
        </span>

        <input
          ref={inputRef}
          id={inputId}
          type="text"
          role="combobox"
          autoComplete="off"
          spellCheck={false}
          aria-labelledby={labelId}
          aria-expanded={isOpen}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={activeDescendant}
          readOnly={compact}
          tabIndex={compact ? -1 : undefined}
          placeholder="Search frameworks…"
          value={query}
          onChange={(event) => {
            if (compact) return;
            setQuery(event.target.value);
            setOpen(true);
          }}
          onFocus={() => {
            if (compact) return;
            setOpen(true);
          }}
          onKeyDown={handleKeyDown}
          className={cn(
            'w-full rounded-lg border border-input bg-background py-2.5 pl-10 pr-10 text-sm text-foreground shadow-sm',
            'outline-none transition-[color,border-color,box-shadow] motion-reduce:transition-none',
            'placeholder:text-muted-foreground',
            'focus:border-violet-500 focus:ring-4 focus:ring-violet-500/15',
            'dark:focus:border-violet-400 dark:focus:ring-violet-400/20',
            compact && 'cursor-default',
          )}
        />

        {query && (
          <button
            type="button"
            aria-label="Clear selection"
            aria-hidden={compact}
            tabIndex={compact ? -1 : undefined}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => {
              if (compact) return;
              clear();
            }}
            className={cn(
              'absolute inset-y-0 right-0 my-1.5 mr-1.5 flex items-center rounded-md px-2 text-muted-foreground',
              'transition-colors motion-reduce:transition-none hover:bg-muted hover:text-foreground',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/40',
              compact && 'pointer-events-none',
            )}
          >
            <XIcon />
          </button>
        )}

        {isOpen && (
          <ul
            ref={listRef}
            id={listId}
            role="listbox"
            aria-labelledby={labelId}
            className={cn(
              'absolute z-50 mt-2 max-h-64 w-full origin-top overflow-y-auto rounded-xl border border-border bg-popover p-1.5 text-popover-foreground',
              'shadow-lg shadow-black/5 ring-1 ring-black/[0.02] dark:shadow-black/40 dark:ring-white/[0.04]',
              'motion-safe:animate-in motion-safe:fade-in-0 motion-safe:zoom-in-95 motion-safe:slide-in-from-top-1 motion-safe:duration-150',
              compact && 'touch-pan-y',
            )}
          >
            {results.length === 0 && (
              <li
                role="presentation"
                className="px-3 py-6 text-center text-sm text-muted-foreground"
              >
                No frameworks found.
              </li>
            )}

            {results.map((item, index) => {
              const active = index === activeIndex;
              const chosen = item === selectedValue;
              return (
                <li
                  key={item}
                  id={optionId(index)}
                  role="option"
                  aria-selected={chosen}
                  data-active={active || undefined}
                  onMouseDown={(event) => event.preventDefault()}
                  onMouseEnter={() => {
                    if (compact) return;
                    setActiveIndex(index);
                  }}
                  onClick={() => {
                    if (compact) return;
                    commit(item);
                  }}
                  className={cn(
                    'flex select-none items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm text-popover-foreground/90',
                    !compact && 'cursor-pointer',
                    'transition-colors motion-reduce:transition-none',
                    'data-[active]:bg-violet-500/10 data-[active]:text-foreground dark:data-[active]:bg-violet-400/15',
                  )}
                >
                  <span className="truncate">{highlight(item, query)}</span>
                  {chosen && (
                    <span className="shrink-0 text-violet-600 dark:text-violet-300">
                      <CheckIcon />
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Combobox;
