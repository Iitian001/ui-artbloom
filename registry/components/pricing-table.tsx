"use client"

import { useState } from "react"
import { motion } from "motion/react"

import { cn } from "@/lib/utils"

export type Plan = {
  name: string
  /** Rendered verbatim when `yearly` is absent — e.g. "Free", "Custom". */
  monthly: number | string
  yearly?: number | string
  blurb: string
  features: string[]
  cta: string
  href?: string
  /** Lifts the card and adds the ring + badge. */
  highlight?: boolean
  badge?: string
}

export type PricingTableProps = {
  plans: Plan[]
  currency?: string
  className?: string
  /** Hide the monthly/yearly switch when no plan has a yearly price. */
  showToggle?: boolean
}

export function PricingTable({
  plans,
  currency = "$",
  className,
  showToggle = true,
}: PricingTableProps) {
  const [yearly, setYearly] = useState(false)
  const hasYearly = plans.some((p) => p.yearly !== undefined)

  return (
    <div className={cn("w-full", className)}>
      {showToggle && hasYearly && (
        <div className="mx-auto mb-10 flex w-fit items-center gap-1 rounded-full border border-border bg-secondary p-1 text-sm">
          {([false, true] as const).map((value) => (
            <button
              key={String(value)}
              type="button"
              onClick={() => setYearly(value)}
              className="relative rounded-full px-4 py-1.5 font-medium transition-colors"
            >
              {yearly === value && (
                <motion.span
                  layoutId="pricing-pill"
                  className="absolute inset-0 rounded-full bg-background shadow-sm"
                  transition={{ type: "spring", stiffness: 320, damping: 28 }}
                />
              )}
              <span
                className={cn(
                  "relative z-10",
                  yearly === value ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {value ? "Yearly" : "Monthly"}
              </span>
            </button>
          ))}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((plan) => {
          const price = yearly && plan.yearly !== undefined ? plan.yearly : plan.monthly
          const isNumber = typeof price === "number"

          return (
            <div
              key={plan.name}
              className={cn(
                "relative flex flex-col rounded-2xl border bg-card p-6",
                plan.highlight
                  ? "border-foreground/20 ring-1 ring-foreground/10 md:-my-2 md:py-8"
                  : "border-border",
              )}
            >
              {plan.highlight && plan.badge && (
                <span className="absolute -top-3 left-6 rounded-full bg-foreground px-2.5 py-0.5 text-[11px] font-medium text-background">
                  {plan.badge}
                </span>
              )}

              <h3 className="text-sm font-medium text-muted-foreground">{plan.name}</h3>

              <div className="mt-3 flex items-baseline gap-1">
                {isNumber && <span className="text-2xl font-medium">{currency}</span>}
                <span className="text-4xl font-semibold tracking-tight tabular-nums">{price}</span>
                {isNumber && (
                  <span className="text-sm text-muted-foreground">/{yearly ? "yr" : "mo"}</span>
                )}
              </div>

              <p className="mt-3 text-sm text-muted-foreground">{plan.blurb}</p>

              {(() => {
                // A tier without a destination renders a button, not an anchor
                // with href="#": that keeps it usable inside a linked card and
                // leaves the click for your own handler.
                const ctaClass = cn(
                  "mt-6 inline-flex h-10 items-center justify-center rounded-lg px-4 text-sm font-medium transition-colors",
                  plan.highlight
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "border border-border bg-secondary text-secondary-foreground hover:bg-accent",
                )
                return plan.href ? (
                  <a href={plan.href} className={ctaClass}>
                    {plan.cta}
                  </a>
                ) : (
                  <button type="button" className={ctaClass}>
                    {plan.cta}
                  </button>
                )
              })()}

              <ul className="mt-7 space-y-2.5 text-sm">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-2.5 text-muted-foreground">
                    <svg
                      aria-hidden
                      viewBox="0 0 20 20"
                      className="mt-0.5 size-4 shrink-0 text-foreground/70"
                      fill="currentColor"
                    >
                      <path d="M8.32 13.6 5.1 10.4l1.13-1.13 2.09 2.09 5.45-5.45 1.13 1.13z" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>
    </div>
  )
}
