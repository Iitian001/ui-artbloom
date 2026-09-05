import type { ReactNode } from "react"

import { Logo } from "@/components/logo"
import { AuroraBackground } from "@/registry/animations/aurora-background"
import { brand } from "@/lib/brand"
import { ALL_CATEGORIES } from "@/lib/categories"
import { categoryCount, kindCount } from "@/lib/registry"
import { formatFull } from "@/lib/utils"

/** Shared two-pane shell for /login and /signup. */
export default function AuthLayout({ children }: { children: ReactNode }) {
  /**
   * All three derived from `lib/registry/items.ts`. The third used to be
   * `formatCount(totalInstalls())`, which summed an `installs` field that was `0`
   * on every item — so the panel beside the sign-in button advertised "0 installs"
   * to somebody deciding whether this library is worth an account.
   */
  const categories = ALL_CATEGORIES.filter((c) => categoryCount(c.kind, c.slug) > 0).length
  const stats = [
    { value: formatFull(kindCount("templates")), label: "templates" },
    { value: formatFull(kindCount("animations")), label: "animations" },
    { value: formatFull(categories), label: "categories" },
  ]

  return (
    <div className="grid min-h-[calc(100vh-3.5rem)] lg:grid-cols-2">
      <div className="flex items-center justify-center px-6 py-16">{children}</div>

      <div className="relative hidden overflow-hidden border-l border-border lg:block">
        <AuroraBackground className="absolute inset-0" />
        <div className="relative flex size-full flex-col justify-between p-10">
          {/*
            `Logo` renders its own <Link href="/">. Wrapping it in another one
            nested an <a> inside an <a>, which the HTML parser un-nests during
            hydration — a hydration mismatch on every /login and /signup render.
            The className goes to the same anchor, so the layout is unchanged.
          */}
          <Logo className="w-fit" />

          <div>
            <p className="max-w-sm text-2xl leading-snug font-medium tracking-tight text-balance">
              Browse it like a portfolio.
              <br />
              <em className="font-serif font-normal italic">Install it like a package.</em>
            </p>

            <div className="mt-8 flex gap-8">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <p className="font-mono text-xl tabular-nums">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <p className="font-mono text-xs text-muted-foreground">
            {brand.npmPackage} — {brand.domain}
          </p>
        </div>
      </div>
    </div>
  )
}
