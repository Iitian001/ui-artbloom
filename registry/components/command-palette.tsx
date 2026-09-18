"use client"

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from "react"

import { cn } from "@/lib/utils"

/* --------------------------------------------------------------------------
   Icons. Inline 1.5px strokes on a 24-grid, currentColor throughout, so a row
   tints with its text and no icon library ships with the card.
-------------------------------------------------------------------------- */
type IconProps = { className?: string }

function Icon({ className, children }: IconProps & { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn("size-4 shrink-0", className)}
    >
      {children}
    </svg>
  )
}

const HomeIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M3 10.5 12 3l9 7.5" />
    <path d="M5 9.5V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.5" />
    <path d="M9.5 21v-6h5v6" />
  </Icon>
)
const SearchIcon = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.2-3.2" />
  </Icon>
)
const FileIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M14 3H7a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V7z" />
    <path d="M14 3v4h4" />
  </Icon>
)
const PlusIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 5v14M5 12h14" />
  </Icon>
)
const CopyIcon = (p: IconProps) => (
  <Icon {...p}>
    <rect x="9" y="9" width="11" height="11" rx="2" />
    <path d="M5 15V5a2 2 0 0 1 2-2h8" />
  </Icon>
)
const ShareIcon = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="6" cy="12" r="2.5" />
    <circle cx="18" cy="6" r="2.5" />
    <circle cx="18" cy="18" r="2.5" />
    <path d="m8.2 10.9 7.6-3.8M8.2 13.1l7.6 3.8" />
  </Icon>
)
const TrashIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    <path d="M6 7v13a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V7M10 11v6M14 11v6" />
  </Icon>
)
const UserIcon = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="8" r="3.5" />
    <path d="M5 20a7 7 0 0 1 14 0" />
  </Icon>
)
const MoonIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M20 13.5A8 8 0 0 1 10.5 4a7 7 0 1 0 9.5 9.5" />
  </Icon>
)
const KeyIcon = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="8" cy="14" r="4" />
    <path d="m11 11 8-8M16 6l2 2M14 8l2 2" />
  </Icon>
)
const BellIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6" />
    <path d="M10.5 20a1.8 1.8 0 0 0 3 0" />
  </Icon>
)
const CogIcon = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="3" />
    <path d="M12 2v3M12 19v3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M2 12h3M19 12h3M4.9 19.1 7 17M17 7l2.1-2.1" />
  </Icon>
)
const BookIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M5 4a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1z" />
    <path d="M9 3v18" />
  </Icon>
)

/* --------------------------------------------------------------------------
   The command list. Grouped by section; a keyboard hint on the ones that carry
   one. `keywords` widens what a substring match will catch without cluttering
   the visible label.
-------------------------------------------------------------------------- */
type Command = {
  id: string
  label: string
  hint?: string[]
  keywords?: string
  icon: (p: IconProps) => ReactNode
}

type Group = { heading: string; commands: Command[] }

const GROUPS: Group[] = [
  {
    heading: "Navigation",
    commands: [
      { id: "home", label: "Go to Dashboard", hint: ["G", "H"], keywords: "overview start", icon: HomeIcon },
      { id: "search", label: "Search the workspace", hint: ["/"], keywords: "find lookup", icon: SearchIcon },
      { id: "docs", label: "Open Documentation", keywords: "guide help reference", icon: BookIcon },
      { id: "profile", label: "View your Profile", keywords: "account me", icon: UserIcon },
    ],
  },
  {
    heading: "Actions",
    commands: [
      { id: "new-file", label: "Create new File", hint: ["⌘", "N"], keywords: "add document", icon: FileIcon },
      { id: "new-project", label: "New Project", hint: ["⌘", "⇧", "N"], keywords: "add create", icon: PlusIcon },
      { id: "copy-link", label: "Copy shareable Link", hint: ["⌘", "C"], keywords: "url clipboard", icon: CopyIcon },
      { id: "share", label: "Share with team", keywords: "invite collaborate", icon: ShareIcon },
      { id: "delete", label: "Delete current item", hint: ["⌘", "⌫"], keywords: "remove trash", icon: TrashIcon },
    ],
  },
  {
    heading: "Settings",
    commands: [
      { id: "theme", label: "Toggle dark mode", hint: ["⌘", "D"], keywords: "appearance light night", icon: MoonIcon },
      { id: "shortcuts", label: "Keyboard shortcuts", hint: ["⌘", "K"], keywords: "keys bindings", icon: KeyIcon },
      { id: "notifications", label: "Notification settings", keywords: "alerts email", icon: BellIcon },
      { id: "preferences", label: "Open Preferences", hint: ["⌘", ","], keywords: "config options", icon: CogIcon },
    ],
  },
]

/**
 * A ⌘K command palette in the Raycast / Linear mould, rendered open inline.
 *
 * The catalogue card is a still: it needs to read as a palette at a glance, so
 * `compact` freezes it mid-search — a sample query, one result lit — and takes
 * everything out of the tab order, because a focusable node behind a thumbnail
 * is a trap with no way back. The full component is the live control: the input
 * autofocuses, the query filters the list on every keystroke, and the arrows
 * walk the flattened results so selection can wrap from the last row to the
 * first without minding which group each row sits in.
 *
 * The one motion here is the fade of the run-confirmation and the selection
 * tint; both drop to nothing under `prefers-reduced-motion` via `motion-reduce`,
 * so the palette still lights the active row, it just does not ease into it.
 */

/** Case-insensitive substring over label + keywords. Empty query keeps all. */
function filterGroups(query: string): Group[] {
  const q = query.trim().toLowerCase()
  if (!q) return GROUPS
  return GROUPS.map((group) => ({
    heading: group.heading,
    commands: group.commands.filter((cmd) =>
      `${cmd.label} ${cmd.keywords ?? ""}`.toLowerCase().includes(q),
    ),
  })).filter((group) => group.commands.length > 0)
}

/** Flatten the filtered groups to the running order the arrow keys walk. */
function orderOf(groups: Group[]): Command[] {
  return groups.flatMap((group) => group.commands)
}

/** A single ⌘-key cap. */
function Key({ children }: { children: ReactNode }) {
  return (
    <kbd className="inline-flex min-w-5 items-center justify-center rounded-[5px] border border-border bg-background px-1 py-0.5 text-[11px] font-medium leading-none text-muted-foreground">
      {children}
    </kbd>
  )
}

/** One result row. `active` lights it with the accent; the whole row is a
 *  button in full mode and inert markup in the card. */
function Row({
  command,
  active,
  optionId,
  compact,
  onSelect,
  onHover,
}: {
  command: Command
  active: boolean
  optionId: string
  compact: boolean
  onSelect: () => void
  onHover: () => void
}) {
  const IconEl = command.icon
  return (
    <div
      id={optionId}
      role="option"
      aria-selected={active}
      onClick={compact ? undefined : onSelect}
      onMouseMove={compact ? undefined : onHover}
      className={cn(
        "flex cursor-pointer items-center gap-3 rounded-lg px-2.5 py-2 text-sm transition-colors motion-reduce:transition-none",
        active
          ? "bg-violet-500 text-white"
          : "text-foreground/90 hover:bg-foreground/[0.04]",
      )}
    >
      <IconEl className={cn(active ? "text-white" : "text-muted-foreground")} />
      <span className="flex-1 truncate">{command.label}</span>
      {command.hint ? (
        <span
          className={cn(
            "flex items-center gap-1",
            active ? "[&_kbd]:border-white/30 [&_kbd]:bg-white/15 [&_kbd]:text-white/90" : "",
          )}
        >
          {command.hint.map((key, i) => (
            <Key key={i}>{key}</Key>
          ))}
        </span>
      ) : null}
    </div>
  )
}

export type CommandPaletteProps = {
  /** Catalogue-card mode: a static, untabbable thumbnail. */
  compact?: boolean
  className?: string
}

export function CommandPalette({ compact = false, className }: CommandPaletteProps) {
  const uid = useId()
  const listId = `${uid}-list`
  const inputRef = useRef<HTMLInputElement | null>(null)
  const scrollRef = useRef<HTMLDivElement | null>(null)

  // The card is a still of a search in progress; the live one starts empty.
  const [query, setQuery] = useState(compact ? "new" : "")
  const [active, setActive] = useState(0)
  // A run leaves a brief inline flash naming what was invoked.
  const [ran, setRan] = useState<string | null>(null)

  const groups = useMemo(() => filterGroups(query), [query])
  const order = useMemo(() => orderOf(groups), [groups])

  // Clamp selection whenever the result set shrinks under the cursor.
  useEffect(() => {
    setActive((i) => (order.length === 0 ? 0 : Math.min(i, order.length - 1)))
  }, [order.length])

  // Autofocus the input in full mode only — the card must not steal focus.
  useEffect(() => {
    if (!compact) inputRef.current?.focus()
  }, [compact])

  // Keep the selected row in view as the arrows walk past the fold.
  useEffect(() => {
    if (compact) return
    const el = scrollRef.current?.querySelector<HTMLElement>('[aria-selected="true"]')
    el?.scrollIntoView({ block: "nearest" })
  }, [active, compact])

  const run = useCallback((cmd: Command | undefined) => {
    if (!cmd) return
    setRan(cmd.label)
  }, [])

  // The flash clears itself so the palette does not keep stale confirmation.
  useEffect(() => {
    if (!ran) return
    const t = window.setTimeout(() => setRan(null), 1600)
    return () => window.clearTimeout(t)
  }, [ran])

  const onKeyDown = useCallback(
    (e: ReactKeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault()
        setActive((i) => (order.length === 0 ? 0 : (i + 1) % order.length))
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        setActive((i) => (order.length === 0 ? 0 : (i - 1 + order.length) % order.length))
      } else if (e.key === "Enter") {
        e.preventDefault()
        run(order[active])
      } else if (e.key === "Escape") {
        e.preventDefault()
        // Esc clears the query rather than closing — there is nothing to close
        // in an always-open demo, and clearing is the next thing a user wants.
        setQuery("")
        setActive(0)
      }
    },
    [order, active, run],
  )

  const activeId = order.length > 0 ? `${uid}-opt-${order[active]?.id}` : undefined

  return (
    <div
      className={cn(
        "flex h-full w-full items-center justify-center p-4",
        compact && "pointer-events-none",
        className,
      )}
      style={compact ? { touchAction: "pan-y" } : undefined}
    >
      <div
        role="dialog"
        aria-modal={compact ? undefined : true}
        aria-label="Command palette"
        className={cn(
          "flex w-full flex-col overflow-hidden rounded-xl border border-border bg-card/95 text-card-foreground shadow-2xl shadow-black/10 ring-1 ring-black/5 backdrop-blur-xl dark:shadow-black/40 dark:ring-white/5",
          compact ? "max-w-sm" : "max-w-lg",
        )}
      >
        {/* Search field. In the card it is read-only and off the tab order. */}
        <div className="flex items-center gap-3 border-b border-border px-4">
          <SearchIcon className="text-muted-foreground" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            readOnly={compact}
            tabIndex={compact ? -1 : undefined}
            aria-hidden={compact ? true : undefined}
            onChange={compact ? undefined : (e) => {
              setQuery(e.target.value)
              setActive(0)
            }}
            onKeyDown={compact ? undefined : onKeyDown}
            placeholder="Type a command or search..."
            aria-label="Command"
            aria-controls={listId}
            aria-activedescendant={activeId}
            role="combobox"
            aria-expanded="true"
            spellCheck={false}
            autoComplete="off"
            className="w-full bg-transparent py-3.5 text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
          {!compact ? (
            <span className="hidden items-center gap-1 sm:flex">
              <Key>esc</Key>
            </span>
          ) : null}
        </div>

        {/* Results. Grouped, scrollable, capped so long lists stay a palette. */}
        <div
          ref={scrollRef}
          id={listId}
          role="listbox"
          aria-label="Commands"
          className="max-h-80 overflow-y-auto overscroll-contain p-2"
        >
          {order.length === 0 ? (
            <p className="px-3 py-8 text-center text-sm text-muted-foreground">
              No commands match &ldquo;{query}&rdquo;
            </p>
          ) : (
            groups.map((group) => (
              <div key={group.heading} className="mb-1 last:mb-0">
                <p className="px-2.5 pb-1 pt-2 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                  {group.heading}
                </p>
                {group.commands.map((cmd) => {
                  const index = order.indexOf(cmd)
                  return (
                    <Row
                      key={cmd.id}
                      command={cmd}
                      compact={compact}
                      optionId={`${uid}-opt-${cmd.id}`}
                      active={index === active}
                      onSelect={() => run(cmd)}
                      onHover={() => setActive(index)}
                    />
                  )
                })}
              </div>
            ))
          )}
        </div>

        {/* Footer: nav legend on the left, run confirmation flash on the right. */}
        <div className="flex items-center justify-between gap-2 border-t border-border px-4 py-2.5 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Key>↑</Key>
              <Key>↓</Key>
              <span className="ml-1">navigate</span>
            </span>
            <span className="hidden items-center gap-1 sm:flex">
              <Key>↵</Key>
              <span className="ml-1">run</span>
            </span>
          </span>
          <span
            aria-live="polite"
            className={cn(
              "flex items-center gap-1.5 font-medium text-violet-500 transition-opacity duration-200 motion-reduce:transition-none",
              ran ? "opacity-100" : "opacity-0",
            )}
          >
            {ran ? (
              <>
                <span className="size-1.5 rounded-full bg-violet-500" />
                Ran &ldquo;{ran}&rdquo;
              </>
            ) : (
              // Placeholder keeps the footer height stable when nothing ran.
              <span className="select-none">&nbsp;</span>
            )}
          </span>
        </div>
      </div>
    </div>
  )
}

export default CommandPalette
