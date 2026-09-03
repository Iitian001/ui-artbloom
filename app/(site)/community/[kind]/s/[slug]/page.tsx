import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ChevronRightIcon } from "lucide-react"

import { CatalogTabs, type CatalogTab } from "@/components/catalog-tabs"
import { FilterChips } from "@/components/filter-chips"
import { ItemGrid } from "@/components/item-grid"
import { ALL_CATEGORIES, findCategory, KIND_LABEL } from "@/lib/categories"
import {
  categoryCount,
  isBrowsableKind,
  itemsByCategory,
  populatedCategories,
} from "@/lib/registry"
import { formatFull } from "@/lib/utils"

const TABS: CatalogTab[] = [
  { value: "newest", label: "Newest" },
  { value: "popular", label: "Popular" },
]

/** Only categories of a kind you can still browse — see `isBrowsableKind`. */
export function generateStaticParams() {
  return ALL_CATEGORIES.filter((category) => isBrowsableKind(category.kind)).map((category) => ({
    kind: category.kind,
    slug: category.slug,
  }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ kind: string; slug: string }>
}): Promise<Metadata> {
  const { kind, slug } = await params
  if (!isBrowsableKind(kind)) return {}
  const category = findCategory(kind, slug)
  if (!category) return {}
  const count = categoryCount(kind, slug)
  return {
    title: `${category.label} — ${KIND_LABEL[kind]}`,
    description: count
      ? `${formatFull(count)} ${category.label.toLowerCase()} you can install with one command.`
      : `${category.label} is coming to the ${KIND_LABEL[kind].toLowerCase()} catalogue.`,
  }
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ kind: string; slug: string }>
  searchParams: Promise<{ tab?: string }>
}) {
  const { kind, slug } = await params
  if (!isBrowsableKind(kind)) notFound()

  const category = findCategory(kind, slug)
  if (!category) notFound()

  const { tab } = await searchParams
  const active = tab === "popular" ? "popular" : "newest"

  const items = itemsByCategory(kind, slug)
  const sorted =
    active === "popular"
      ? [...items].sort((a, b) => b.installs - a.installs)
      : [...items].sort((a, b) =>
          (b.updatedAt ?? b.createdAt).localeCompare(a.updatedAt ?? a.createdAt),
        )

  const siblings = populatedCategories(kind)
    .filter((other) => other.slug !== slug)
    .slice(0, 12)

  return (
    <>
      <div className="container-page pt-10">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-xs">
          <Link
            href={`/community/${kind}`}
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            {KIND_LABEL[kind]}
          </Link>
          <ChevronRightIcon className="size-3 text-muted-foreground/60" aria-hidden />
          <span className="text-foreground">{category.label}</span>
        </nav>

        <h1 className="mt-2 text-3xl font-semibold tracking-tighter sm:text-4xl">
          {category.label}
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          {items.length > 0 ? (
            <>
              <span className="font-mono tabular-nums">{formatFull(items.length)}</span>{" "}
              {items.length === 1 ? "piece" : "pieces"} in this category
            </>
          ) : (
            <>Nothing in this category yet.</>
          )}
        </p>

        <FilterChips kind={kind} activeSlug={slug} className="mt-7" />
        {items.length > 1 && (
          <CatalogTabs tabs={TABS} defaultValue="newest" className="mt-6" />
        )}
      </div>

      <div className="container-page py-10">
        <ItemGrid
          items={sorted}
          emptyMessage={`No ${category.label.toLowerCase()} in the catalogue yet.`}
        />

        {siblings.length > 0 && (
          <div className="mt-16 border-t border-border pt-8">
            <h2 className="text-sm font-medium">More in {KIND_LABEL[kind]}</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {siblings.map((other) => (
                <Link
                  key={other.slug}
                  href={`/community/${kind}/s/${other.slug}`}
                  className="rounded-full border border-border px-3 py-1 text-[13px] text-muted-foreground transition-colors hover:border-foreground/25 hover:text-foreground"
                >
                  {other.label}
                  <span className="ml-1.5 font-mono text-[10px] opacity-60 tabular-nums">
                    {categoryCount(kind, other.slug)}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
