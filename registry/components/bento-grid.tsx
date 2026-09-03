import type { ComponentProps, ReactNode } from "react"

import { cn } from "@/lib/utils"

export type BentoGridProps = ComponentProps<"div">

/** A 3-column asymmetric grid. Children opt into spans via BentoCard. */
export function BentoGrid({ className, children, ...props }: BentoGridProps) {
  return (
    <div
      className={cn(
        "grid w-full auto-rows-[16rem] grid-cols-1 gap-4 md:grid-cols-3",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export type BentoCardProps = {
  title: string
  description: string
  /** Anything decorative — an illustration, a chart, a looping video. */
  visual?: ReactNode
  icon?: ReactNode
  href?: string
  cta?: string
  /** Tailwind span classes, e.g. "md:col-span-2 md:row-span-2". */
  className?: string
}

export function BentoCard({
  title,
  description,
  visual,
  icon,
  href,
  cta = "Learn more",
  className,
}: BentoCardProps) {
  return (
    <div
      className={cn(
        "group relative flex flex-col justify-end overflow-hidden rounded-xl",
        "border border-border bg-card",
        "transition-shadow duration-300 hover:shadow-lg",
        className,
      )}
    >
      {visual && <div className="absolute inset-0">{visual}</div>}

      <div className="pointer-events-none relative z-10 flex flex-col gap-1.5 p-6 transition-transform duration-300 group-hover:-translate-y-2">
        {icon && (
          <div className="mb-2 w-fit text-muted-foreground transition-transform duration-300 group-hover:scale-90">
            {icon}
          </div>
        )}
        <h3 className="text-lg font-semibold tracking-tight text-card-foreground">{title}</h3>
        <p className="max-w-lg text-sm text-muted-foreground">{description}</p>
      </div>

      {href && (
        <div className="pointer-events-none absolute bottom-0 z-10 w-full translate-y-6 p-6 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <a
            href={href}
            className="pointer-events-auto inline-flex items-center gap-1 text-sm font-medium text-card-foreground underline-offset-4 hover:underline"
          >
            {cta}
            <span aria-hidden>→</span>
          </a>
        </div>
      )}

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 transition-colors duration-300 group-hover:bg-foreground/[0.02]"
      />
    </div>
  )
}
