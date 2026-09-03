import { BookmarkIcon, CheckIcon, TerminalIcon } from "lucide-react"

import { ItemCard } from "@/components/item-card"
import { brand } from "@/lib/brand"
import { ITEMS, popular } from "@/lib/registry"

function Chip({
  Icon,
  value,
  label,
  className,
}: {
  Icon: typeof BookmarkIcon
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
          <ItemCard item={item} height={260} />

          <Chip
            Icon={CheckIcon}
            value="Saved"
            label="in your bookmarks"
            className="absolute -top-5 -left-6 hidden sm:flex"
          />
          <Chip
            Icon={TerminalIcon}
            value={`${brand.npmPackage} add`}
            label="straight from the list"
            className="absolute -right-6 bottom-16 hidden sm:flex"
          />
        </div>

        <div className="min-w-0 pt-14 lg:pt-0">
          <h2 className="text-balance text-3xl font-semibold tracking-tighter sm:text-4xl">
            Save it for <em className="font-serif font-normal italic">later</em>
          </h2>
          <p className="mt-4 max-w-md text-pretty leading-relaxed text-muted-foreground">
            Sign in with GitHub and the bookmark on any card keeps it. Your bookmarks live on one
            page, private to you, and every one of them is a name you can hand to the CLI.
          </p>
          <dl className="mt-8 grid grid-cols-2 gap-6 text-sm sm:max-w-sm">
            <div>
              <dt className="text-muted-foreground">Bookmarks</dt>
              <dd className="mt-1 font-medium">Unlimited, and free</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">In the catalogue</dt>
              <dd className="mt-1 font-medium tabular-nums">{ITEMS.length} to choose from</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  )
}
