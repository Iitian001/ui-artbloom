import Link from "next/link"
import { ArrowUpRightIcon } from "lucide-react"

import { AuthorAvatar } from "@/components/author"
import { ItemPreview } from "@/components/item-preview"
import { SaveButton } from "@/components/save-button"
import { Badge } from "@/components/ui/badge"
import { categoryLabel } from "@/lib/categories"
import { itemHref } from "@/lib/hrefs"
import type { RegistryItem } from "@/lib/registry"
import { cn } from "@/lib/utils"

export { itemHref }

/**
 * The card frame height for an item, by kind.
 *
 * Templates get a fixed tall window (a full page shown shrunk). Blocks measure
 * their own content, so the number here is only a fallback until that lands.
 * Components and animations mount a card composition authored against the item's
 * own `previewHeight` — using it verbatim makes every card as tall as the demo it
 * holds, so the grid varies with content the way the block grid already does,
 * instead of forcing one height on a breadcrumb and a command palette alike.
 */
function frameHeight(item: RegistryItem): number {
  if (item.kind === "templates") return 420
  if (item.kind === "blocks") return 300
  return item.previewHeight ?? 300
}

export type ItemCardProps = {
  item: RegistryItem
  /**
   * Frame height in px. Deliberately *not* the item's own `previewHeight`: cards
   * sit in a grid and a row of frames at four different heights reads as a bug.
   * The item's authored height still travels to `ItemPreview` as `designHeight`,
   * which is only consulted by the scaled fallback for an item with no card
   * composition yet.
   *
   * 300, not the old 240: a taller frame gives the scaled block previews (a whole
   * pricing table, a testimonial grid) enough room to read at a glance, and the
   * compact component stills — a calendar month, a command list — stop feeling
   * cramped against the top and bottom edges.
   */
  height?: number
  className?: string
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
export function ItemCard({ item, height, className }: ItemCardProps) {
  const href = itemHref(item)
  /**
   * The primary category, where an install count used to sit.
   *
   * That chip read `formatCount(item.installs)` behind a download glyph, and
   * `installs` was `0` on every item in the catalogue — so every card in every
   * grid carried the same "0" next to a download icon, which says "nobody has
   * ever installed this" about 29 things at once. The category is true, it differs
   * between cards, and it tells a browser something they can act on.
   */
  const primary = item.categories[0]

  return (
    <article className={cn("group flex min-w-0 flex-col gap-2.5", className)}>
      <div className="relative overflow-hidden rounded-xl border border-border bg-card transition-colors duration-200 group-hover:border-foreground/25 group-focus-within:border-foreground/25">
        <ItemPreview
          name={item.name}
          kind={item.kind}
          // Each kind sizes its frame differently:
          //   • templates — whole sites shown shrunk, so a taller fixed window (420)
          //     keeps the hero legible; a 300px card scaled it to a strip.
          //   • blocks — fit their own measured content height (see `blockFit`), so
          //     this is only the pre-measurement fallback.
          //   • components / animations — mount a card composition authored to fill a
          //     specific box, and that box height is the item's own `previewHeight`.
          //     A uniform 300 left a tall command palette clipped and a short
          //     breadcrumb marooned in empty space; the authored height is the one
          //     the demo was actually built for, so each card sizes to its content.
          height={height ?? frameHeight(item)}
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

        {primary && (
          <span className="shrink-0 text-[11px] text-muted-foreground">
            {categoryLabel(item.kind, primary)}
          </span>
        )}

        <SaveButton name={item.name} title={item.title} className="-mr-1" />
      </div>
    </article>
  )
}

