import Link from "next/link"

import { AuthorLink } from "@/components/author"
import { CodeBlock } from "@/components/code-block"
import { InstallTabs } from "@/components/install-tabs"
import { ItemPreview } from "@/components/item-preview"
import { PreviewCodeTabs } from "@/components/preview-code-tabs"
import { itemHref } from "@/components/item-card"
import { getItem } from "@/lib/registry"
import { loadFiles } from "@/lib/registry/source"

/** The item whose source anchors the landing page. */
const SHOWCASE = "shimmer-button"

export async function CodeShowcase() {
  const item = getItem(SHOWCASE)
  if (!item) return null
  const [file] = await loadFiles(item)

  return (
    <section className="border-b border-border py-24">
      <div className="container-page grid gap-14 lg:grid-cols-[1fr_1.25fr] lg:items-center">
        <div className="min-w-0">
          <h2 className="text-balance text-3xl font-semibold tracking-tighter sm:text-4xl">
            Real code, <em className="font-serif font-normal italic">ready to ship</em>
          </h2>
          <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
            React and Tailwind, written to shadcn conventions. It lands in your repo as a plain
            file you own — edit it, delete it, rename it. There is no package to keep upgrading.
          </p>

          <InstallTabs itemName={item.name} className="mt-7" />

          <div className="mt-6 flex items-center gap-4 text-sm">
            <AuthorLink author={item.author} />
            <Link
              href={itemHref(item)}
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              Open {item.title} →
            </Link>
          </div>
        </div>

        <PreviewCodeTabs
          className="min-w-0"
          defaultTab="code"
          preview={
            <div className="overflow-hidden rounded-xl border border-border bg-card">
              <ItemPreview name={item.name} kind={item.kind} height={380} />
            </div>
          }
          code={
            <CodeBlock
              code={file.content}
              lang={file.lang}
              filename={file.target}
              maxHeight="23.75rem"
            />
          }
        />
      </div>
    </section>
  )
}
