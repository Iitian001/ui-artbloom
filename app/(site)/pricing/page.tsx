import type { Metadata } from "next"

import { Faq } from "@/components/landing/faq"
import { PageHeader } from "@/components/page-shell"
import { PricingTable, type Plan } from "@/registry/components/pricing-table"
import { brand } from "@/lib/brand"
import { kindCount } from "@/lib/registry"

export const metadata: Metadata = {
  title: "Pricing",
  description: `Copy two pieces a day for free. Go unlimited for $10 a month.`,
}

const PLANS: Plan[] = [
  {
    name: "Free",
    monthly: "Free",
    blurb: "Enough to build a page and see whether this fits how you work.",
    cta: "Start free",
    href: "/signup",
    features: [
      "2 copies or installs a day",
      "Every preview, every source file, readable",
      "The full CLI",
      "Publish your own pieces",
    ],
  },
  {
    name: "Pro",
    monthly: 10,
    yearly: 96,
    highlight: true,
    badge: "Most popular",
    blurb: "Unlimited installs, and the templates that take a week to build by hand.",
    cta: "Go Pro",
    href: "/signup?plan=pro",
    features: [
      "Unlimited copies and installs",
      "Every template, including Pro-only",
      "Private lists",
      "New pieces every week",
      "Cancel whenever — no annual lock-in",
    ],
  },
  {
    name: "Team",
    monthly: "Custom",
    blurb: "One registry your whole team installs from, with your own tokens baked in.",
    cta: "Talk to us",
    href: `mailto:${brand.email}?subject=Team%20plan`,
    features: [
      "Everything in Pro, per seat",
      "A private registry on your domain",
      "Your design tokens applied to every piece",
      "Invoiced annually",
    ],
  },
]

export default function PricingPage() {
  const templates = kindCount("templates")
  const animations = kindCount("animations")

  return (
    <>
      <PageHeader
        eyebrow="Pricing"
        title={
          <>
            Free to try.
            <br />
            <em className="font-serif font-normal italic">Cheap to keep.</em>
          </>
        }
        lede={
          <>
            {templates} templates and {animations} animations today, more every week. Copy two a day
            for nothing; pay when it becomes part of how you work.
          </>
        }
        className="text-center [&>p]:mx-auto"
      />

      <div className="container-page pb-6">
        <PricingTable plans={PLANS} className="mx-auto max-w-5xl" />
        <p className="mt-8 text-center text-xs text-muted-foreground">
          Prices in USD. Yearly is billed once at $96 — two months off.
        </p>
      </div>

      <Faq />
    </>
  )
}
