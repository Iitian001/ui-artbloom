import Link from "next/link"
import { BookmarkIcon, DownloadIcon } from "lucide-react"

import { AuthorAvatar } from "@/components/author"
import { ItemPreview } from "@/components/item-preview"
import { Badge } from "@/components/ui/badge"
import { itemHref } from "@/lib/hrefs"
import type { RegistryItem } from "@/lib/registry"
import { cn, formatCount } from "@/lib/utils"

export { itemHref }

export type ItemCardProps = {
  item: RegistryItem
  /** Fixed preview height. Defaults to the item's own `previewHeight`. */
  height?: number
  className?: string
  /** Show bookmarks next to installs. */
  showBookmarks?: boolean
}

export function ItemCard({ item, height, className, showBookmarks = false }: ItemCardProps) {
  return (
    <article className={cn("group flex min-w-0 flex-col gap-2.5", className)}>
      <Link
        href={itemHref(item)}
        className="relative block overflow-hidden rounded-xl border border-border bg-card transition-colors duration-200 hover:border-foreground/25 focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
      >
        <ItemPreview
          name={item.name}
          kind={item.kind}
          height={height ?? item.previewHeight ?? 240}
          dark={item.previewDark}
        />

        {(item.isNew || item.access === "pro") && (
          <div className="absolute top-2.5 left-2.5 flex gap-1.5">
            {item.isNew && <Badge variant="new">New</Badge>}
            {item.access === "pro" && <Badge variant="pro">Pro</Badge>}
          </div>
        )}

        {/* Hover veil so the preview settles visually under the cursor. */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-foreground/0 transition-colors duration-200 group-hover:bg-foreground/[0.03]"
        />
      </Link>

      <div className="flex min-w-0 items-center gap-2 px-0.5">
        <AuthorAvatar author={item.author} className="size-5" />
        <Link
          href={itemHref(item)}
          className="min-w-0 flex-1 truncate text-[13px] font-medium tracking-tight transition-colors hover:text-muted-foreground"
        >
          {item.title}
        </Link>

        <span className="flex shrink-0 items-center gap-1 font-mono text-[11px] text-muted-foreground tabular-nums">
          <DownloadIcon className="size-3" aria-hidden />
          {formatCount(item.installs)}
          <span className="sr-only">installs</span>
        </span>

        {showBookmarks && (
          <span className="flex shrink-0 items-center gap-1 font-mono text-[11px] text-muted-foreground tabular-nums">
            <BookmarkIcon className="size-3" aria-hidden />
            {formatCount(item.bookmarks)}
            <span className="sr-only">bookmarks</span>
          </span>
        )}
      </div>
    </article>
  )
}
