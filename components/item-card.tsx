import Link from "next/link"
import { ArrowUpRightIcon, BookmarkIcon, DownloadIcon } from "lucide-react"

import { AuthorAvatar } from "@/components/author"
import { ItemPreview } from "@/components/item-preview"
import { Badge } from "@/components/ui/badge"
import { itemHref } from "@/lib/hrefs"
import type { RegistryItem } from "@/lib/registry"
import { cn, formatCount } from "@/lib/utils"

export { itemHref }

export type ItemCardProps = {
  item: RegistryItem
  /**
   * Frame height in px. Deliberately *not* the item's own `previewHeight`: cards
   * sit in a grid and a row of frames at four different heights reads as a bug.
   * The item's authored height still travels to `ItemPreview` as `designHeight`,
   * which is only consulted by the scaled fallback for an item with no card
   * composition yet.
   */
  height?: number
  className?: string
  /** Show bookmarks next to installs. */
  showBookmarks?: boolean
}

/**
 * One catalogue card: a live preview, and the item's name under it.
 *
 * The preview is deliberately *not* inside a link any more. It used to be — the
 * whole frame was the anchor to the item page — which meant every demo had to be
 * `inert` and `pointer-events-none`, because a drag inside an anchor is a click on
 * the anchor and the demo's own copy would have been read out as part of the
 * link's name. The result was a catalogue of stills for a library whose entire
 * subject is what happens when you touch something.
 *
 * So the frame is a plain box now, the demo inside it is live, and navigation
 * moved to two explicit links: the title underneath, and an "Open" pill in the
 * corner of the frame. The pill is what the pointer finds; the title is what a
 * screen reader and the keyboard find.
 */
export function ItemCard({ item, height, className, showBookmarks }: ItemCardProps) {
  const href = itemHref(item)

  return (
    <article className={cn("group flex min-w-0 flex-col gap-2.5", className)}>
      <div className="relative overflow-hidden rounded-xl border border-border bg-card transition-colors duration-200 group-hover:border-foreground/25 group-focus-within:border-foreground/25">
        <ItemPreview
          name={item.name}
          kind={item.kind}
          height={height ?? 240}
          designHeight={item.previewHeight}
          dark={item.previewDark}
          compact
        />

        {item.isNew && (
          <div className="pointer-events-none absolute top-2.5 left-2.5">
            <Badge variant="new">New</Badge>
          </div>
        )}

        {/*
         * A pointer affordance only, and hidden from assistive tech on purpose:
         * the title link below goes to the same place, so a second tab stop and a
         * second announcement of the same destination would be noise. `tabIndex`
         * is what makes the `aria-hidden` legitimate — an unfocusable node.
         *
         * Hidden until the card is hovered or something in it takes focus, so it
         * does not sit on top of the demo the rest of the time — but always
         * visible where there is no hover to wait for, which is every touch
         * screen.
         */}
        <Link
          href={href}
          tabIndex={-1}
          aria-hidden
          className="absolute top-2.5 right-2.5 flex items-center gap-1 rounded-full border border-border/70 bg-card/85 px-2.5 py-1 text-[11px] font-medium text-foreground opacity-0 backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100 hover:bg-card [@media(hover:none)]:opacity-100"
        >
          Open
          <ArrowUpRightIcon className="size-3" />
        </Link>
      </div>

      <div className="flex min-w-0 items-center gap-2 px-0.5">
        <AuthorAvatar author={item.author} className="size-5" />
        <Link
          href={href}
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

