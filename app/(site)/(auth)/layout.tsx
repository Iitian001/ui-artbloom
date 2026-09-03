import type { ReactNode } from "react"
import Link from "next/link"

import { Logo } from "@/components/logo"
import { AuroraBackground } from "@/registry/animations/aurora-background"
import { brand } from "@/lib/brand"
import { kindCount, totalInstalls } from "@/lib/registry"
import { formatCount, formatFull } from "@/lib/utils"

/** Shared two-pane shell for /login and /signup. */
export default function AuthLayout({ children }: { children: ReactNode }) {
  const stats = [
    { value: formatFull(kindCount("templates")), label: "templates" },
    { value: formatFull(kindCount("animations")), label: "animations" },
    { value: formatCount(totalInstalls()), label: "installs" },
  ]

  return (
    <div className="grid min-h-[calc(100vh-3.5rem)] lg:grid-cols-2">
      <div className="flex items-center justify-center px-6 py-16">{children}</div>

      <div className="relative hidden overflow-hidden border-l border-border lg:block">
        <AuroraBackground className="absolute inset-0" />
        <div className="relative flex size-full flex-col justify-between p-10">
          <Link href="/" className="w-fit">
            <Logo />
          </Link>

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
