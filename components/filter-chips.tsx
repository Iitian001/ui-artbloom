import Link from "next/link"

import type { Kind } from "@/lib/categories"
import { categoryCount, populatedCategories } from "@/lib/registry"
import { cn } from "@/lib/utils"

/** Quick-jump chips for the busiest categories in a kind. */
export function FilterChips({
  kind,
  activeSlug,
  limit = 10,
  className,
}: {
  kind: Kind
  activeSlug?: string
  limit?: number
  className?: string
}) {
  const categories = populatedCategories(kind).slice(0, limit)
  if (categories.length === 0) return null

  return (
    <div className={cn("scrollbar-none flex items-center gap-2 overflow-x-auto", className)}>
      <span className="shrink-0 text-xs font-medium tracking-wide text-muted-foreground uppercase">
        Filters
      </span>
      <Link
        href={`/community/${kind}`}
        className={cn(
          "shrink-0 rounded-full border px-3 py-1 text-[13px] transition-colors",
          !activeSlug
            ? "border-foreground/25 bg-secondary text-foreground"
            : "border-border text-muted-foreground hover:border-foreground/25 hover:text-foreground",
        )}
      >
        All
      </Link>
      {categories.map((category) => {
        const active = category.slug === activeSlug
        return (
          <Link
            key={category.slug}
            href={`/community/${kind}/s/${category.slug}`}
            className={cn(
              "shrink-0 rounded-full border px-3 py-1 text-[13px] transition-colors",
              active
                ? "border-foreground/25 bg-secondary text-foreground"
                : "border-border text-muted-foreground hover:border-foreground/25 hover:text-foreground",
            )}
          >
            {category.label}
            <span className="ml-1.5 font-mono text-[10px] opacity-60 tabular-nums">
              {categoryCount(kind, category.slug)}
            </span>
          </Link>
        )
      })}
    </div>
  )
}
