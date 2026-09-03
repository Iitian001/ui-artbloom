import Link from "next/link"

import { AuthorLink } from "@/components/author"
import { CodeBlock } from "@/components/code-block"
import { InstallTabs } from "@/components/install-tabs"
import { ItemPreview } from "@/components/item-preview"
import { PreviewCodeTabs } from "@/components/preview-code-tabs"
import { itemHref } from "@/components/item-card"
import { getItem } from "@/lib/registry"
import { loadFiles } from "@/lib/registry/source"

/**
 * The item whose source anchors the landing page.
 *
 * Two things this has to satisfy, both easy to break by swapping the name alone:
 * the panel shows the item's *first* file and nothing else, so it wants an item
 * whose opening file is the substance rather than a shell around a stylesheet;
 * and the preview tab mounts `DEMOS[name]`, so the item needs an entry in
 * `components/demos.tsx` or the tab reads "No demo yet".
 */
const SHOWCASE = "kinetic-texture-mesh"

export async function CodeShowcase() {
  const item = getItem(SHOWCASE)
  if (!item) return null
  const files = await loadFiles(item)
  const [file] = files
  if (!file) return null

  return (
    <section className="border-b border-border py-24">
      <div className="container-page grid gap-14 lg:grid-cols-[1fr_1.25fr] lg:items-center">
        <div className="min-w-0">
          <h2 className="text-balance text-3xl font-semibold tracking-tighter sm:text-4xl">
            Real code, <em className="font-serif font-normal italic">ready to ship</em>
          </h2>
          <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
            Plain React and CSS, in the shadcn registry format. It lands in your repo as files you
            own — edit them, delete them, rename them. There is no package to keep upgrading.
          </p>

          <InstallTabs itemName={item.name} className="mt-7" />

          <p className="mt-2 text-xs text-muted-foreground">
            Writes {files.length === 1 ? "one file" : `${files.length} files`} into your project.
            The code panel shows the first.
          </p>

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
              {/* Not inside a link here, so the demo can be dragged and pressed —
                  the mesh is only legible once you pull on it. */}
              <ItemPreview
                name={item.name}
                kind={item.kind}
                height={380}
                dark={item.previewDark}
                interactive
              />
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
