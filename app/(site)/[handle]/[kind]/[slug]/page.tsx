import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowUpRightIcon, BookmarkIcon, ChevronRightIcon, DownloadIcon } from "lucide-react"

import { AuthorAvatar } from "@/components/author"
import { CodeBlock } from "@/components/code-block"
import { CopyButton } from "@/components/copy-button"
import { InstallTabs } from "@/components/install-tabs"
import { ItemCard } from "@/components/item-card"
import { ItemPreview } from "@/components/item-preview"
import { PreviewCodeTabs } from "@/components/preview-code-tabs"
import { Badge } from "@/components/ui/badge"
import { registryUrl } from "@/lib/brand"
import { categoryLabel, isKind, KIND_LABEL, KIND_SINGULAR } from "@/lib/categories"
import { itemHref, profileHref } from "@/lib/hrefs"
import { getItem, ITEMS, relatedItems, type RegistryItem } from "@/lib/registry"
import { loadFiles } from "@/lib/registry/source"
import { formatCount, formatFull } from "@/lib/utils"

type Params = { handle: string; kind: string; slug: string }

/** `/handle/kind/name` — bare handle, no `@`; see `lib/hrefs.ts`. */
function resolve({ handle, kind, slug }: Params): RegistryItem | null {
  if (handle.startsWith("@") || !isKind(kind)) return null
  const item = getItem(slug)
  if (!item || item.kind !== kind || item.author.handle !== handle) return null
  return item
}

export function generateStaticParams() {
  return ITEMS.map((item) => ({
    handle: item.author.handle,
    kind: item.kind,
    slug: item.name,
  }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const item = resolve(await params)
  if (!item) return {}
  return { title: `${item.title} by @${item.author.handle}`, description: item.description }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

function MetaRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5">
      <dt className="shrink-0 text-xs text-muted-foreground">{label}</dt>
      <dd className="min-w-0 text-right text-[13px]">{children}</dd>
    </div>
  )
}

export default async function ItemPage({ params }: { params: Promise<Params> }) {
  const resolved = await params
  const item = resolve(resolved)
  if (!item) notFound()

  const files = await loadFiles(item)
  const related = relatedItems(item, 8)
  const url = registryUrl(item.name)
  const deps = item.dependencies ?? []
  const registryDeps = item.registryDependencies ?? []

  return (
    <div className="container-page py-10">
      <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-xs">
        <Link
          href={`/community/${item.kind}`}
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          {KIND_LABEL[item.kind]}
        </Link>
        <ChevronRightIcon className="size-3 text-muted-foreground/60" aria-hidden />
        <Link
          href={`/community/${item.kind}/s/${item.categories[0]}`}
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          {categoryLabel(item.kind, item.categories[0] ?? "")}
        </Link>
        <ChevronRightIcon className="size-3 text-muted-foreground/60" aria-hidden />
        <span className="text-foreground">{item.title}</span>
      </nav>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{item.title}</h1>
            {item.isNew && <Badge variant="new">New</Badge>}
            {item.access === "pro" && <Badge variant="pro">Pro</Badge>}
          </div>
          <p className="mt-2 max-w-2xl text-pretty text-muted-foreground">{item.description}</p>

          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
            <Link
              href={profileHref(item.author.handle)}
              className="flex items-center gap-1.5 transition-colors hover:text-foreground"
            >
              <AuthorAvatar author={item.author} />
              <span>{item.author.name}</span>
            </Link>
            <span className="flex items-center gap-1.5">
              <DownloadIcon className="size-3.5" aria-hidden />
              <span className="font-mono tabular-nums">{formatCount(item.installs)}</span> installs
            </span>
            <span className="flex items-center gap-1.5">
              <BookmarkIcon className="size-3.5" aria-hidden />
              <span className="font-mono tabular-nums">{formatCount(item.bookmarks)}</span> saved
            </span>
            <span>Updated {formatDate(item.updatedAt ?? item.createdAt)}</span>
          </div>
        </div>

        {item.kind === "templates" && (
          <Link
            href={`/preview/${item.name}`}
            target="_blank"
            rel="noreferrer"
            className="flex shrink-0 items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-[13px] font-medium transition-colors hover:border-foreground/25 hover:bg-secondary/50"
          >
            Open full preview
            <ArrowUpRightIcon className="size-3.5" aria-hidden />
          </Link>
        )}
      </div>

      <div className="mt-8 grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,1fr)_19rem]">
        <PreviewCodeTabs
          preview={
            <div className="overflow-hidden rounded-xl border border-border">
              <ItemPreview
                name={item.name}
                kind={item.kind}
                height={item.previewHeight ?? (item.kind === "templates" ? 620 : 420)}
                dark={item.previewDark}
                // Not inside a link here, so the demo can be dragged, pressed and
                // hovered — several animations are only legible when you touch them.
                interactive
              />
            </div>
          }
          code={
            <div className="flex flex-col gap-4">
              {files.map((file) => (
                <CodeBlock
                  key={file.target}
                  code={file.content}
                  lang={file.lang}
                  filename={file.target}
                />
              ))}
              {item.css && (
                <CodeBlock code={item.css} lang="css" filename="app/globals.css" />
              )}
            </div>
          }
        />

        <aside className="flex flex-col gap-6 lg:sticky lg:top-20">
          <div>
            <h2 className="mb-2 text-sm font-medium">Install</h2>
            <InstallTabs itemName={item.name} />
            <p className="mt-2 text-xs text-muted-foreground">
              Writes {files.length === 1 ? "one file" : `${files.length} files`} into your project.
              {registryDeps.length > 0 && " Pulls its registry dependencies with it."}
            </p>
          </div>

          <dl className="divide-y divide-border rounded-xl border border-border px-4 py-1">
            <MetaRow label={KIND_SINGULAR[item.kind]}>
              <code className="font-mono text-xs">{item.name}</code>
            </MetaRow>
            <MetaRow label="Categories">
              <span className="flex flex-wrap justify-end gap-1.5">
                {item.categories.map((slug) => (
                  <Link
                    key={slug}
                    href={`/community/${item.kind}/s/${slug}`}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {categoryLabel(item.kind, slug)}
                  </Link>
                ))}
              </span>
            </MetaRow>
            {deps.length > 0 && (
              <MetaRow label="Dependencies">
                <span className="flex flex-wrap justify-end gap-1.5 font-mono text-xs">
                  {deps.map((dep) => (
                    <span key={dep} className="text-muted-foreground">
                      {dep}
                    </span>
                  ))}
                </span>
              </MetaRow>
            )}
            {registryDeps.length > 0 && (
              <MetaRow label="Includes">
                <span className="flex flex-wrap justify-end gap-1.5">
                  {registryDeps.map((dep) => {
                    const child = getItem(dep)
                    if (!child) return null
                    return (
                      <Link
                        key={dep}
                        href={itemHref(child)}
                        className="text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {child.title}
                      </Link>
                    )
                  })}
                </span>
              </MetaRow>
            )}
            <MetaRow label="Published">{formatDate(item.createdAt)}</MetaRow>
            <MetaRow label="Installs">
              <span className="font-mono tabular-nums">{formatFull(item.installs)}</span>
            </MetaRow>
          </dl>

          <div>
            <h2 className="mb-2 text-sm font-medium">Registry endpoint</h2>
            <div className="flex items-center gap-2 rounded-xl border border-border bg-subtle px-3 py-2.5">
              <code className="min-w-0 flex-1 overflow-x-auto font-mono text-xs whitespace-nowrap text-muted-foreground">
                {url}
              </code>
              <CopyButton value={url} label="Copy registry URL" />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Plain JSON. Any shadcn-compatible tool can read it.
            </p>
          </div>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="mt-16 border-t border-border pt-10">
          <h2 className="text-lg font-semibold tracking-tight">More like this</h2>
          <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {related.map((other) => (
              <ItemCard key={other.name} item={other} height={200} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
