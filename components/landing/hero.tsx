import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"

import { InstallTabs } from "@/components/install-tabs"
import { SpecimenWall } from "@/components/landing/specimen-wall"
import { kindCount } from "@/lib/registry"

/**
 * A single honest count, derived at build time from the registry. No middle-dot
 * meta string, no fabricated install numbers — three real figures the browser
 * can act on, separated by a hairline rule.
 */
function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-2xl font-semibold tracking-tight tabular-nums">{value}</span>
      <span className="mt-0.5 text-[13px] text-muted-foreground">{label}</span>
    </div>
  )
}

export function Hero() {
  const templates = kindCount("templates")
  const animations = kindCount("animations")
  const components = kindCount("components")

  return (
    <section className="relative overflow-hidden border-b border-border">
      {/* One atmospheric accent, behind the type, off-centre — identity, not
          decoration sprinkled on cards. The hairline grid grounds it. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -left-40 -z-10 h-[42rem] w-[42rem] rounded-full opacity-60 blur-3xl [background:radial-gradient(circle,var(--brand),transparent_62%)] dark:opacity-40"
      />
      <div aria-hidden className="bg-grid pointer-events-none absolute inset-0 -z-10 opacity-70" />

      <div className="container-page grid items-center gap-14 py-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-10 lg:py-28">
        {/* ── The argument ─────────────────────────────────────────────── */}
        <div className="max-w-xl">
          <h1 className="text-balance text-5xl leading-[0.98] font-medium tracking-tight sm:text-6xl lg:text-[4.25rem]">
            Interfaces that are
            <br />
            <em className="font-serif text-[1.08em] font-normal text-brand italic">
              already running.
            </em>
          </h1>

          <p className="mt-7 max-w-md text-pretty text-lg leading-relaxed text-muted-foreground">
            A living library of React templates and animations. Everything here is the real
            component — live in your browser, never a screenshot. Copy the code, run one command,
            ship it.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/community/templates"
              className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-brand px-7 text-[15px] font-medium text-white shadow-[0_6px_24px_-6px_var(--brand)] transition-transform hover:scale-[1.02]"
            >
              Explore the library
              <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/docs/cli"
              className="inline-flex h-12 items-center justify-center rounded-full border border-border bg-background/50 px-7 text-[15px] font-medium backdrop-blur-sm transition-colors hover:bg-accent"
            >
              Read the docs
            </Link>
          </div>

          {/* The real product action, inline: one command lands a whole template. */}
          <InstallTabs itemName="afterglow" className="mt-6 max-w-md" />

          <div className="mt-10 flex items-center gap-6 border-t border-border pt-6">
            <Stat value={templates} label="Templates" />
            <div className="h-9 w-px bg-border" />
            <Stat value={animations} label="Animations" />
            <div className="h-9 w-px bg-border" />
            <Stat value={components} label="Components" />
          </div>
        </div>

        {/* ── The proof: the library, running ──────────────────────────── */}
        <SpecimenWall className="hidden lg:flex" />
      </div>
    </section>
  )
}
