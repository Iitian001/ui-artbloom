"use client"

import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export type CatalogTab = {
  value: string
  label: string
  badge?: string
}

/**
 * Tab strip driven by `?tab=`, so every view is a shareable URL and the server
 * component decides what to render — no client-side data fetching.
 */
export function CatalogTabs({
  tabs,
  defaultValue,
  className,
}: {
  tabs: CatalogTab[]
  defaultValue: string
  className?: string
}) {
  const pathname = usePathname()
  const params = useSearchParams()
  const active = params.get("tab") ?? defaultValue

  return (
    <div
      role="tablist"
      aria-label="Catalog view"
      className={cn(
        "scrollbar-none -mb-px flex items-center gap-1 overflow-x-auto border-b border-border",
        className,
      )}
    >
      {tabs.map((tab) => {
        const selected = tab.value === active
        const href = tab.value === defaultValue ? pathname : `${pathname}?tab=${tab.value}`
        return (
          <Link
            key={tab.value}
            href={href}
            role="tab"
            aria-selected={selected}
            scroll={false}
            className={cn(
              "relative flex shrink-0 items-center gap-1.5 px-3 py-2.5 text-sm font-medium transition-colors",
              selected
                ? "text-foreground after:absolute after:inset-x-2 after:-bottom-px after:h-0.5 after:rounded-full after:bg-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {tab.label}
            {tab.badge && <Badge variant="new">{tab.badge}</Badge>}
          </Link>
        )
      })}
    </div>
  )
}
