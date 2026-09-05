import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { AuthorAvatar } from "@/components/author"
import { ItemGrid } from "@/components/item-grid"
import { KIND_LABEL } from "@/lib/categories"
import { allAuthors, browsableKinds, getAuthor, itemsByAuthor } from "@/lib/registry"
import { formatFull } from "@/lib/utils"

type Params = { handle: string }

function handleOf({ handle }: Params) {
  // The URL carries the bare handle; see `lib/hrefs.ts` for why there is no `@`.
  return handle.startsWith("@") ? null : handle
}

/**
 * One page per author who actually has something in the catalogue — today that
 * is exactly one. Every other handle 404s through the site's `not-found`.
 */
export function generateStaticParams() {
  return allAuthors().map((author) => ({ handle: author.handle }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const handle = handleOf(await params)
  const author = handle ? getAuthor(handle) : undefined
  if (!author) return {}
  return {
    title: `${author.name} (@${author.handle})`,
    description: author.bio ?? `${formatFull(author.count)} pieces published by @${author.handle}.`,
  }
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="font-mono text-xl tabular-nums">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  )
}

export default async function AuthorPage({ params }: { params: Promise<Params> }) {
  const handle = handleOf(await params)
  if (!handle) notFound()

  const author = getAuthor(handle)
  if (!author) notFound()

  const items = itemsByAuthor(handle)
  /**
   * Three stats used to sit here; two of them were `installs` and `saved`, summed
   * from per-item fields that were `0` on every item in the catalogue. A profile
   * header reading "29 pieces / 0 installs / 0 saved" is worse than one that says
   * nothing about installs at all, so the two zeroes are replaced by counts this
   * repo can actually derive.
   */
  const byKind = browsableKinds()
    .map((kind) => ({ kind, count: items.filter((item) => item.kind === kind).length }))
    .filter((entry) => entry.count > 0)

  return (
    <div className="container-page py-12">
      <header className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          <AuthorAvatar author={author} className="size-14 text-base" />
          <div className="min-w-0">
            <h1 className="text-2xl font-semibold tracking-tight">{author.name}</h1>
            <p className="font-mono text-sm text-muted-foreground">@{author.handle}</p>
            {author.bio && (
              <p className="mt-2 max-w-lg text-pretty text-sm text-muted-foreground">
                {author.bio}
              </p>
            )}
          </div>
        </div>

        <div className="flex shrink-0 gap-8">
          <Stat value={formatFull(items.length)} label={items.length === 1 ? "piece" : "pieces"} />
          {byKind.map((entry) => (
            <Stat
              key={entry.kind}
              value={formatFull(entry.count)}
              label={KIND_LABEL[entry.kind].toLowerCase()}
            />
          ))}
        </div>
      </header>

      <div className="mt-12 flex flex-col gap-12">
        {byKind.map(({ kind }) => {
          const owned = items.filter((item) => item.kind === kind)
          return (
            <section key={kind}>
              <div className="mb-4 flex items-baseline gap-2">
                <h2 className="text-lg font-semibold tracking-tight">{KIND_LABEL[kind]}</h2>
                <span className="font-mono text-xs text-muted-foreground tabular-nums">
                  {owned.length}
                </span>
              </div>
              <ItemGrid items={owned} />
            </section>
          )
        })}
      </div>
    </div>
  )
}
