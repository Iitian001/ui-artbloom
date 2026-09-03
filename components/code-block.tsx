import { CopyButton } from "@/components/copy-button"
import { highlight } from "@/lib/highlight"
import { cn } from "@/lib/utils"

export type CodeBlockProps = {
  code: string
  lang?: string
  /** Shown in the title bar. Omit for a bare block. */
  filename?: string
  className?: string
  /** Max height before the block scrolls, e.g. "28rem". */
  maxHeight?: string
  showLineNumbers?: boolean
}

/**
 * Highlighted, copyable source. Async server component — the highlighting
 * happens at build/request time so no grammar ships to the browser.
 */
export async function CodeBlock({
  code,
  lang = "tsx",
  filename,
  className,
  maxHeight = "32rem",
  showLineNumbers = true,
}: CodeBlockProps) {
  const html = await highlight(code, lang)

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl border border-border bg-subtle",
        className,
      )}
    >
      {filename ? (
        <div className="flex items-center gap-2 border-b border-border px-3 py-2">
          <span className="font-mono text-xs text-muted-foreground">{filename}</span>
          <CopyButton value={code} className="ml-auto" />
        </div>
      ) : (
        <CopyButton
          value={code}
          className="absolute top-2 right-2 z-10 opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
        />
      )}

      <div
        style={{ maxHeight }}
        className={cn(
          "overflow-auto text-[13px] leading-[1.65]",
          "[&_pre]:bg-transparent! [&_pre]:px-4 [&_pre]:py-3.5",
          "[&_code]:font-mono",
          showLineNumbers && [
            "[&_code]:grid [&_code]:min-w-fit",
            "[&_.line]:relative [&_.line]:pl-9",
            "[&_.line]:before:absolute [&_.line]:before:left-0 [&_.line]:before:w-6",
            "[&_.line]:before:text-right [&_.line]:before:text-muted-foreground/45",
            "[&_.line]:before:content-[counter(line)] [&_.line]:before:[counter-increment:line]",
            "[&_code]:[counter-reset:line]",
          ],
        )}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  )
}
