"use client"

import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CATEGORY_GROUPS } from "@/lib/categories"
import { categoryCount, kindCount } from "@/lib/registry"
import { formatCount } from "@/lib/utils"

/** One column per kind, so the panel never renders an empty column. */
const COLUMNS: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
}

/**
 * The browse mega-panel. Counts come straight from the registry, so a category
 * with nothing in it renders greyed and unlinked rather than promising items
 * that do not exist yet.
 */
export function CategoryPanel({ onNavigate }: { onNavigate?: () => void }) {
  const columns = COLUMNS[CATEGORY_GROUPS.length] ?? "grid-cols-3"
  const width = `${Math.min(24 * CATEGORY_GROUPS.length, 72)}rem`

  return (
    <div
      className="absolute top-full left-0 z-50 mt-1.5 origin-top animate-in fade-in-0 zoom-in-[0.98] rounded-xl border border-border bg-popover shadow-2xl duration-150"
      style={{ width: `min(${width}, calc(100vw - 2rem))` }}
    >
      <ScrollArea className="max-h-[min(34rem,calc(100vh-6rem))]">
        <div className={`grid ${columns} divide-x divide-border`}>
          {CATEGORY_GROUPS.map((group) => (
            <div key={group.kind} className="p-5">
              <div className="mb-3 flex items-baseline justify-between gap-2">
                <Link
                  href={`/community/${group.kind}`}
                  onClick={onNavigate}
                  className="text-[13px] font-semibold tracking-tight hover:underline"
                >
                  {group.label}
                </Link>
                <span className="font-mono text-[11px] text-muted-foreground tabular-nums">
                  {formatCount(kindCount(group.kind))}
                </span>
              </div>
              <p className="mb-4 text-xs leading-relaxed text-muted-foreground">{group.blurb}</p>

              <ul className="space-y-px">
                {group.categories.map((category) => {
                  const count = categoryCount(group.kind, category.slug)
                  const empty = count === 0

                  if (empty) {
                    return (
                      <li
                        key={category.slug}
                        className="flex items-center justify-between rounded-md px-2 py-1.5 text-[13px] text-muted-foreground/45"
                      >
                        <span className="truncate">{category.label}</span>
                        {category.isNew ? (
                          <Badge variant="new" className="opacity-60">Soon</Badge>
                        ) : (
                          <span className="font-mono text-[11px]">—</span>
                        )}
                      </li>
                    )
                  }

                  return (
                    <li key={category.slug}>
                      <Link
                        href={`/community/${group.kind}/s/${category.slug}`}
                        onClick={onNavigate}
                        className="flex items-center justify-between gap-2 rounded-md px-2 py-1.5 text-[13px] text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                      >
                        <span className="truncate">{category.label}</span>
                        {category.isNew ? (
                          <Badge variant="new">New</Badge>
                        ) : (
                          <span className="font-mono text-[11px] tabular-nums">
                            {formatCount(count)}
                          </span>
                        )}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="flex items-center justify-between border-t border-border px-5 py-3 text-xs text-muted-foreground">
        <span>
          Press{" "}
          <kbd className="rounded border border-border bg-secondary px-1 font-mono text-[10px]">/</kbd>{" "}
          to toggle,{" "}
          <kbd className="rounded border border-border bg-secondary px-1 font-mono text-[10px]">
            esc
          </kbd>{" "}
          to close
        </span>
        <Link
          href="/community/templates"
          onClick={onNavigate}
          className="font-medium text-foreground hover:underline"
        >
          Browse everything →
        </Link>
      </div>
    </div>
  )
}
