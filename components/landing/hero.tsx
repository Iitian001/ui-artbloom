import Link from "next/link"

import { ALL_CATEGORIES } from "@/lib/categories"
import { ITEMS, categoryCount, populatedCategories } from "@/lib/registry"
import { cn } from "@/lib/utils"

function PillCluster({
  heading,
  kind,
  limit = 7,
}: {
  heading: string
  kind: "templates" | "animations"
  limit?: number
}) {
  const categories = populatedCategories(kind).slice(0, limit)
  if (categories.length === 0) return null

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <span className="text-sm font-medium text-muted-foreground/80">{heading}</span>
      {categories.map((category) => (
        <Link
          key={category.slug}
          href={`/community/${kind}/s/${category.slug}`}
          className="group relative flex items-center overflow-hidden rounded-full border border-border/50 bg-background/40 px-3 py-1 text-[13px] text-muted-foreground backdrop-blur-md transition-all hover:border-foreground/20 hover:bg-background/80 hover:text-foreground hover:shadow-sm"
        >
          <span className="relative z-10">{category.label}</span>
          <span className="relative z-10 ml-1.5 font-mono text-[10px] opacity-50 tabular-nums group-hover:opacity-100">
            {categoryCount(kind, category.slug)}
          </span>
          <div className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-foreground/[0.03] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
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
    <section className="relative overflow-hidden border-b border-border bg-slate-50 py-16 dark:bg-zinc-950 sm:py-24">
      
      <div className="container-page relative z-10 flex flex-col items-center text-center">
        
        <h1 className="max-w-4xl text-balance text-5xl font-light tracking-tight text-slate-900 dark:text-white sm:text-6xl lg:text-7xl">
          The <strong className="font-semibold text-slate-900 dark:text-white">living library</strong>
          <br className="hidden sm:block" /> of interfaces
        </h1>

        <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-slate-600 dark:text-slate-400 sm:text-xl">
          Elevate your projects with {total} crafted UI components and animations across {categoriesWithItems} categories. Designed for seamless modern experiences.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:gap-4">
          <Link 
            href="/community/templates" 
            className="inline-flex h-12 items-center justify-center rounded-full bg-[#3b82f6] px-8 text-[15px] font-medium text-white shadow-[0_4px_14px_0_rgba(59,130,246,0.39)] transition-all hover:bg-blue-600 hover:shadow-[0_6px_20px_rgba(59,130,246,0.23)] w-full sm:w-auto"
          >
            Explore Components
          </Link>
          <Link
            href="/docs/cli"
            className="inline-flex h-12 items-center justify-center rounded-full border border-slate-200 bg-white/50 px-8 text-[15px] font-medium text-slate-900 shadow-sm backdrop-blur-md transition-colors hover:bg-white/80 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10 w-full sm:w-auto"
          >
            Get Started
          </Link>
        </div>

        <div className="mt-20 flex w-full max-w-3xl flex-col gap-4">
          <PillCluster heading="Templates:" kind="templates" />
          <PillCluster heading="Animations:" kind="animations" />
        </div>
      </div>
    </section>
  )
}
