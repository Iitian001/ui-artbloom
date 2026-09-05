import Link from "next/link"

import { ALL_CATEGORIES, KIND_LABEL, type Kind } from "@/lib/categories"
import { profileHref } from "@/lib/hrefs"
import { allAuthors, categoryCount } from "@/lib/registry"
import { formatCount, monogram } from "@/lib/utils"

/** Keyed by `Kind`, and `Kind` is the whole list — `components` was removed from
 *  the union in `lib/categories.ts`, so a tone for it could never be looked up. */
const KIND_TONE: Record<Kind, string> = {
  templates: "bg-violet-500/12 text-violet-600 dark:text-violet-300",
  animations: "bg-sky-500/12 text-sky-600 dark:text-sky-300",
}

export function CollectionsGrid() {
  const populated = ALL_CATEGORIES.filter((c) => categoryCount(c.kind, c.slug) > 0).sort(
    (a, b) => categoryCount(b.kind, b.slug) - categoryCount(a.kind, a.slug),
  )
  const authors = allAuthors()

  return (
    <section className="border-b border-border py-24">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-semibold tracking-tighter sm:text-4xl">
            Every piece has an <em className="font-serif font-normal italic">author</em>
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground">
            Nothing here is generated in bulk. Browse by what you are building, or by who made it.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
          {populated.map((category) => (
            <Link
              key={`${category.kind}-${category.slug}`}
              href={`/community/${category.kind}/s/${category.slug}`}
              className="group flex items-center gap-3 rounded-xl border border-border bg-card px-3.5 py-3 transition-colors hover:border-foreground/25"
            >
              <span
                className={`flex size-8 shrink-0 items-center justify-center rounded-lg text-[10px] font-bold tracking-tight ${KIND_TONE[category.kind]}`}
                aria-hidden
              >
                {monogram(category.label)}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[13px] font-medium tracking-tight">
                  {category.label}
                </span>
                <span className="block truncate text-[11px] text-muted-foreground">
                  {KIND_LABEL[category.kind]}
                </span>
              </span>
              <span className="shrink-0 font-mono text-[11px] text-muted-foreground tabular-nums">
                {formatCount(categoryCount(category.kind, category.slug))}
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          {authors.map((author) => (
            <Link
              key={author.handle}
              href={profileHref(author.handle)}
              className="flex items-center gap-2.5 rounded-full border border-border bg-card py-1.5 pr-4 pl-1.5 transition-colors hover:border-foreground/25"
            >
              <span className="flex size-7 items-center justify-center rounded-full bg-secondary text-[10px] font-semibold text-muted-foreground">
                {author.org ? "◆" : monogram(author.name)}
              </span>
              <span className="text-[13px] font-medium">@{author.handle}</span>
              <span className="font-mono text-[11px] text-muted-foreground tabular-nums">
                {author.count}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
