import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

/** Shared heading block for the non-catalog pages. */
export function PageHeader({
  eyebrow,
  title,
  lede,
  children,
  className,
}: {
  eyebrow?: ReactNode
  title: ReactNode
  lede?: ReactNode
  children?: ReactNode
  className?: string
}) {
  return (
    <header className={cn("container-page pt-14 pb-10", className)}>
      {eyebrow && (
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          {eyebrow}
        </p>
      )}
      <h1 className="mt-2 text-3xl font-semibold tracking-tighter text-balance sm:text-4xl">
        {title}
      </h1>
      {lede && <p className="mt-4 max-w-xl text-pretty text-muted-foreground">{lede}</p>}
      {children}
    </header>
  )
}

/**
 * Long-form text styling. Scoped with arbitrary variants rather than a plugin so
 * there is one less dependency to keep in step with Tailwind v4.
 */
export function Prose({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "max-w-2xl text-[15px] leading-relaxed text-muted-foreground",
        "[&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:text-foreground",
        "[&_h3]:mt-7 [&_h3]:mb-2 [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:text-foreground",
        "[&_p]:mt-4 [&_ul]:mt-4 [&_ul]:space-y-2 [&_ol]:mt-4 [&_ol]:space-y-2",
        "[&_li]:relative [&_li]:pl-5",
        "[&_ul>li]:before:absolute [&_ul>li]:before:top-[0.6em] [&_ul>li]:before:left-1 [&_ul>li]:before:size-1 [&_ul>li]:before:rounded-full [&_ul>li]:before:bg-muted-foreground/50",
        "[&_ol]:[counter-reset:step] [&_ol>li]:[counter-increment:step] [&_ol>li]:before:absolute [&_ol>li]:before:left-0 [&_ol>li]:before:font-mono [&_ol>li]:before:text-xs [&_ol>li]:before:text-muted-foreground/70 [&_ol>li]:before:content-[counter(step)'.']",
        "[&_a]:text-foreground [&_a]:underline [&_a]:decoration-border [&_a]:underline-offset-4 [&_a:hover]:decoration-foreground",
        "[&_code]:rounded [&_code]:bg-secondary [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.85em] [&_code]:text-foreground",
        "[&_strong]:font-medium [&_strong]:text-foreground",
        className,
      )}
    >
      {children}
    </div>
  )
}
