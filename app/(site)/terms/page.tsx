import type { Metadata } from "next"
import Link from "next/link"

import { PageHeader, Prose } from "@/components/page-shell"
import { brand } from "@/lib/brand"
import { pageMeta } from "@/lib/seo"

export const metadata: Metadata = pageMeta({
  title: "Terms",
  description: `The terms of use for ${brand.name}.`,
  path: "/terms",
})

const UPDATED = "3 September 2026"

export default function TermsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Terms"
        title="Terms of use"
        lede="Plain language, because terms nobody reads protect nobody."
      />

      <div className="container-page pb-20">
        <Prose>
          <p className="text-xs">Last updated {UPDATED}. Operated by {brand.legalEntity}.</p>

          <h2>What we provide</h2>
          <p>
            {brand.name} is a catalogue of templates, animations and components, plus a registry API
            and a CLI that copy their source into your project. It is a distribution service, not a
            runtime dependency: nothing we host ends up in your production bundle.
          </p>

          <h2>Using the service</h2>
          <p>
            There are no accounts: the catalogue, the registry and the CLI are open to everyone with
            no sign-in. In return, use them as intended. We may block traffic that scrapes the
            catalogue in bulk, resells it, or attacks the service.
          </p>

          <h2>What it costs</h2>
          <p>
            Nothing. Every template, animation and component in the catalogue is free to copy and
            free to install, with no daily limit, no paid tier and no account required to use the
            CLI. If that ever changes it will not change retroactively for code you have already
            installed — what you copied is yours under the terms on the{" "}
            <Link href="/license">licence page</Link>.
          </p>

          <h2>What you may not do</h2>
          <ul>
            <li>Resell or republish the catalogue, in whole or in substantial part.</li>
            <li>Mirror the registry in bulk, or hammer it beyond ordinary CLI use.</li>
            <li>Upload anything malicious, or code that exfiltrates a user&apos;s data.</li>
          </ul>
          <p>
            The full licence terms for installed code are on the{" "}
            <Link href="/license">licence page</Link>.
          </p>

          <h2>Availability</h2>
          <p>
            No uptime promise. The registry is static JSON on a CDN, which is about as durable as this
            gets, but we do not guarantee it — and because the CLI copies files rather than linking to
            them, an outage here cannot break a site you have already built.
          </p>

          <h2>Liability</h2>
          <p>
            The service and the code are provided as is. To the extent the law allows,{" "}
            {brand.legalEntity} is not liable for indirect or consequential loss, and total liability
            is capped at what you paid us in the previous twelve months.
          </p>

          <h2>Changes</h2>
          <p>
            We will change these terms as the product grows. Material changes get a note on the site.
            Continuing to use the service after a change means you accept it.
          </p>

          <h2>Contact</h2>
          <p>
            <a href={`mailto:${brand.email}`}>{brand.email}</a>.
          </p>
        </Prose>
      </div>
    </>
  )
}
