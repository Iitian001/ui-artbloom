import { BookmarkIcon, DownloadIcon, PlusIcon } from "lucide-react"

import { ItemCard } from "@/components/item-card"
import { popular } from "@/lib/registry"
import { formatFull } from "@/lib/utils"

const LISTS = [
  { name: "Landing v2", count: 12 },
  { name: "Inspiration", count: 34 },
  { name: "Client — Meridian", count: 7 },
]

function Chip({
  Icon,
  value,
  label,
  className,
}: {
  Icon: typeof DownloadIcon
  value: string
  label: string
  className?: string
}) {
  return (
    <div
      className={`flex items-center gap-2.5 rounded-xl border border-border bg-popover/90 px-3.5 py-2.5 shadow-xl backdrop-blur ${className ?? ""}`}
    >
      <Icon className="size-4 shrink-0 text-muted-foreground" />
      <div className="leading-tight">
        <div className="text-sm font-semibold tabular-nums">{value}</div>
        <div className="text-[11px] text-muted-foreground">{label}</div>
      </div>
    </div>
  )
}

export function ListsSection() {
  const [item] = popular(1)
  if (!item) return null

  return (
    <section className="border-b border-border py-24">
      <div className="container-page grid gap-16 lg:grid-cols-[1.1fr_1fr] lg:items-center">
        <div className="relative mx-auto w-full max-w-sm">
          <ItemCard item={item} showBookmarks height={260} />

          <Chip
            Icon={DownloadIcon}
            value={formatFull(item.installs)}
            label="installs this week"
            className="absolute -top-5 -left-6 hidden sm:flex"
          />
          <Chip
            Icon={BookmarkIcon}
            value={formatFull(item.bookmarks)}
            label="saved to bookmarks"
            className="absolute -right-6 bottom-16 hidden sm:flex"
          />

          <div className="absolute -bottom-10 left-4 hidden w-56 overflow-hidden rounded-xl border border-border bg-popover/95 shadow-xl backdrop-blur sm:block">
            <div className="border-b border-border px-3 py-2 text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
              Save to
            </div>
            <ul className="p-1">
              {LISTS.map((list) => (
                <li
                  key={list.name}
                  className="flex items-center justify-between rounded-md px-2.5 py-1.5 text-[13px] hover:bg-accent"
                >
                  <span className="truncate">{list.name}</span>
                  <span className="font-mono text-[11px] text-muted-foreground tabular-nums">
                    {list.count}
                  </span>
                </li>
              ))}
              <li className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[13px] text-muted-foreground hover:bg-accent">
                <PlusIcon className="size-3.5" />
                Create list
              </li>
            </ul>
          </div>
        </div>

        <div className="min-w-0 pt-14 lg:pt-0">
          <h2 className="text-balance text-3xl font-semibold tracking-tighter sm:text-4xl">
            Save it for <em className="font-serif font-normal italic">later</em>
          </h2>
          <p className="mt-4 max-w-md text-pretty leading-relaxed text-muted-foreground">
            Bookmark anything into a private list, or a shared one your whole team can pull from.
            Lists export as a single install command, so handing a design direction to a teammate is
            one line in a message.
          </p>
          <dl className="mt-8 grid grid-cols-2 gap-6 text-sm sm:max-w-sm">
            <div>
              <dt className="text-muted-foreground">Private lists</dt>
              <dd className="mt-1 font-medium">Unlimited on Pro</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Team lists</dt>
              <dd className="mt-1 font-medium">Shared across seats</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  )
}
