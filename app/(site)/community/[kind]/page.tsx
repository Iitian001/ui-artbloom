import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { AuthorAvatar } from "@/components/author"
import { CatalogTabs, type CatalogTab } from "@/components/catalog-tabs"
import { FilterChips } from "@/components/filter-chips"
import { ItemGrid } from "@/components/item-grid"
import { CATEGORY_GROUPS, KIND_LABEL, type Kind } from "@/lib/categories"
import {
  type Author,
  browsableKinds,
  featured,
  isBrowsableKind,
  itemsByKind,
  kindCount,
  newest,
  popular,
  populatedCategories,
  reshuffled,
} from "@/lib/registry"
import { profileHref } from "@/lib/hrefs"
import { formatCount, formatFull } from "@/lib/utils"

const TABS: CatalogTab[] = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "popular", label: "Popular" },
  { value: "authors", label: "Authors" },
]

export function generateStaticParams() {
  return browsableKinds().map((kind) => ({ kind }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ kind: string }>
}): Promise<Metadata> {
  const { kind } = await params
  if (!isBrowsableKind(kind)) return {}
  const group = CATEGORY_GROUPS.find((g) => g.kind === kind)
  return { title: KIND_LABEL[kind], description: group?.blurb }
}

/** Authors scoped to one kind, so the numbers on this page describe this page. */
function authorsForKind(kind: Kind): (Author & { count: number; installs: number })[] {
  const map = new Map<string, Author & { count: number; installs: number }>()
  for (const item of itemsByKind(kind)) {
    const found = map.get(item.author.handle)
    if (found) {
      found.count += 1
      found.installs += item.installs
    } else {
      map.set(item.author.handle, { ...item.author, count: 1, installs: item.installs })
    }
  }
  return [...map.values()].sort((a, b) => b.installs - a.installs)
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <span className="flex items-baseline gap-1.5">
      <span className="font-mono text-sm tabular-nums">{value}</span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </span>
  )
}

function Empty({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-dashed border-border py-20 text-center">
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  )
}

function SectionHead({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-4">
      <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      {subtitle && <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p>}
    </div>
  )
}

/**
 * The default view. Two grids, and every item appears in exactly one of them.
 *
 * This used to be five or six horizontal rails — Featured, Just added, Most
 * installed, then one per category, then a grid of everything. On a catalogue
 * this size that put the same card on the page three and four times over, and
 * each rail carried sideways scroll far past the window: twenty-six animations
 * at about 3300px of track, of which four were visible and the rest were behind
 * a gesture. A grid shows all twenty-six at once and the page scrolls the one
 * direction a page is supposed to.
 *
 * Categories are still navigable — `FilterChips` above this links every one of
 * them to its own route. They just no longer each get a rail of cards that are
 * already on the page.
 */
function CatalogueView({ kind }: { kind: Kind }) {
  // Never empty: the route 404s for a kind with nothing in it, so there is no
  // "the first ones land soon" state to fall back to.
  const spotlight = featured(undefined, kind)
  const picked = new Set(spotlight.map((item) => item.name))
  const rest = reshuffled(undefined, kind).filter((item) => !picked.has(item.name))

  return (
    <div className="container-page flex flex-col gap-14">
      {spotlight.length > 0 && (
        <section>
          <SectionHead title="Featured" subtitle="Hand-picked this week" />
          <ItemGrid items={spotlight} />
        </section>
      )}

      {rest.length > 0 && (
        <section>
          <SectionHead
            title={spotlight.length > 0 ? "Everything else" : "Everything"}
            subtitle="The rest of the catalogue, reshuffled daily."
          />
          <ItemGrid items={rest} />
        </section>
      )}
    </div>
  )
}

function AuthorsView({ kind }: { kind: Kind }) {
  const authors = authorsForKind(kind)
  if (authors.length === 0) return <Empty message="No authors yet." />

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {authors.map((author) => (
        <Link
          key={author.handle}
          href={profileHref(author.handle)}
          className="flex items-center gap-3 rounded-xl border border-border p-4 transition-colors hover:border-foreground/25 hover:bg-secondary/40"
        >
          <AuthorAvatar author={author} className="size-9 text-[11px]" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{author.name}</p>
            <p className="truncate text-xs text-muted-foreground">@{author.handle}</p>
          </div>
          <div className="shrink-0 text-right">
            <p className="font-mono text-sm tabular-nums">{formatCount(author.installs)}</p>
            <p className="text-[11px] text-muted-foreground">
              {author.count} {author.count === 1 ? "item" : "items"}
            </p>
          </div>
        </Link>
      ))}
    </div>
  )
}

export default async function CatalogPage({
  params,
  searchParams,
}: {
  params: Promise<{ kind: string }>
  searchParams: Promise<{ tab?: string }>
}) {
  const { kind } = await params
  if (!isBrowsableKind(kind)) notFound()

  const { tab } = await searchParams
  const active = tab && TABS.some((t) => t.value === tab) ? tab : "featured"

  const group = CATEGORY_GROUPS.find((g) => g.kind === kind)
  const total = kindCount(kind)
  const cats = populatedCategories(kind)
  const installs = itemsByKind(kind).reduce((sum, item) => sum + item.installs, 0)

  return (
    <>
      <div className="container-page pt-10">
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Community
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tighter sm:text-4xl">
          {KIND_LABEL[kind]}
        </h1>
        {group && <p className="mt-3 max-w-xl text-pretty text-muted-foreground">{group.blurb}</p>}

        <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2">
          <Stat value={formatFull(total)} label={total === 1 ? "item" : "items"} />
          <Stat
            value={formatFull(cats.length)}
            label={cats.length === 1 ? "category" : "categories"}
          />
          <Stat value={formatFull(installs)} label="installs" />
        </div>

        <FilterChips kind={kind} className="mt-7" />
        <CatalogTabs tabs={TABS} defaultValue="featured" className="mt-6" />
      </div>

      <div className="py-10">
        {active === "featured" && <CatalogueView kind={kind} />}
        {active !== "featured" && (
          <div className="container-page">
            {active === "newest" && <ItemGrid items={newest(undefined, kind)} />}
            {active === "popular" && <ItemGrid items={popular(undefined, kind)} />}
            {active === "authors" && <AuthorsView kind={kind} />}
          </div>
        )}
      </div>
    </>
  )
}
