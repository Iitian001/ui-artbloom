import type { Metadata } from "next"
import Link from "next/link"
import { BookmarkIcon } from "lucide-react"

import { ItemCard } from "@/components/item-card"
import { PageHeader } from "@/components/page-shell"
import { buttonVariants } from "@/components/ui/button"
import { popular } from "@/lib/registry"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Bookmarks",
  description: "Everything you saved, in one place.",
}

export default function BookmarksPage() {
  const suggestions = popular(8)

  return (
    <>
      <PageHeader eyebrow="Bookmarks" title="Saved" />

      <div className="container-page pb-20">
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-border px-6 py-20 text-center">
          <span className="flex size-11 items-center justify-center rounded-full border border-border bg-secondary">
            <BookmarkIcon className="size-5 text-muted-foreground" aria-hidden />
          </span>
          <p className="mt-5 text-lg font-medium">Nothing saved yet</p>
          <p className="mt-2 max-w-sm text-pretty text-sm text-muted-foreground">
            Bookmarks are stored on your account, and accounts are not switched on yet. Until then
            nothing here persists — but every piece is installable without one.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/community/templates" className={buttonVariants()}>
              Browse templates
            </Link>
            <Link
              href="/community/animations"
              className={cn(buttonVariants({ variant: "outline" }))}
            >
              Browse animations
            </Link>
          </div>
        </div>

        <section className="mt-14">
          <h2 className="text-lg font-semibold tracking-tight">Most installed this week</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            A reasonable place to start a list.
          </p>
          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {suggestions.map((item) => (
              <ItemCard key={item.name} item={item} height={200} />
            ))}
          </div>
        </section>
      </div>
    </>
  )
}
