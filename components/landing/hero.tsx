import Link from "next/link"

import { AuroraBackground } from "@/registry/animations/aurora-background"
import { buttonVariants } from "@/components/ui/button"
import { ALL_CATEGORIES } from "@/lib/categories"
import { ITEMS, categoryCount, populatedCategories } from "@/lib/registry"
import { cn } from "@/lib/utils"

function PillCluster({
  heading,
  kind,
  limit = 7,
}: {
  heading: string
  kind: "templates" | "animations" | "components"
  limit?: number
}) {
  const categories = populatedCategories(kind).slice(0, limit)
  if (categories.length === 0) return null

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <span className="text-sm text-muted-foreground">{heading}</span>
      {categories.map((category) => (
        <Link
          key={category.slug}
          href={`/community/${kind}/s/${category.slug}`}
          className="rounded-full border border-border bg-background/60 px-3 py-1 text-[13px] text-muted-foreground backdrop-blur transition-colors hover:border-foreground/25 hover:text-foreground"
        >
          {category.label}
          <span className="ml-1.5 font-mono text-[10px] opacity-60 tabular-nums">
            {categoryCount(kind, category.slug)}
          </span>
        </Link>
      ))}
    </div>
  )
}

export function Hero() {
  const total = ITEMS.length
  const categoriesWithItems = ALL_CATEGORIES.filter(
    (c) => categoryCount(c.kind, c.slug) > 0,
  ).length

  return (
    <AuroraBackground className="border-b border-border" duration={30}>
      <section className="container-page flex flex-col items-center py-24 text-center sm:py-32">
        <Link
          href="/community/templates"
          className="mb-7 inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-3 py-1 text-xs text-muted-foreground backdrop-blur transition-colors hover:text-foreground"
        >
          <span className="size-1.5 rounded-full bg-emerald-500" />
          New templates every week
        </Link>

        <h1 className="max-w-4xl text-balance text-5xl leading-[0.98] font-semibold tracking-tighter sm:text-6xl lg:text-7xl">
          The <em className="font-serif font-normal italic">living</em> library
          <br className="hidden sm:block" /> of interfaces
        </h1>

        <p className="mt-7 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
          {total} crafted React templates, animations, and components across{" "}
          {categoriesWithItems} categories. Copy the code, run one command, ship it.
        </p>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Link href="/community/templates" className={cn(buttonVariants({ size: "lg" }))}>
            Browse the library
          </Link>
          <Link
            href="/docs/cli"
            className={cn(buttonVariants({ variant: "outline", size: "lg" }), "backdrop-blur")}
          >
            How the CLI works
          </Link>
        </div>

        <div className="mt-16 flex w-full max-w-3xl flex-col gap-3">
          <PillCluster heading="Templates:" kind="templates" />
          <PillCluster heading="Animations:" kind="animations" />
          <PillCluster heading="Components:" kind="components" />
        </div>
      </section>
    </AuroraBackground>
  )
}
