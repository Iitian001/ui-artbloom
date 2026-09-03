import type { Metadata } from "next"
import Link from "next/link"

import { PageHeader, Prose } from "@/components/page-shell"
import { brand } from "@/lib/brand"

export const metadata: Metadata = {
  title: "Terms",
  description: `The terms of use for ${brand.name}.`,
}

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

          <h2>Your account</h2>
          <p>
            Accounts are not live yet. When they are: one person per account, keep your credentials
            to yourself, and you are responsible for what happens under yours. We may suspend an
            account that is used to scrape the catalogue, resell it, or attack the service.
          </p>

          <h2>Free and paid use</h2>
          <p>
            The free tier allows two copies or installs a day. Paid plans lift that limit — the
            current prices are on <Link href="/pricing">the pricing page</Link> and apply from the day
            you subscribe. If a price changes, existing subscribers keep theirs until they cancel.
            Cancel whenever; access runs to the end of the period you paid for.
          </p>

          <h2>What you may not do</h2>
          <ul>
            <li>Resell or republish the catalogue, in whole or in substantial part.</li>
            <li>Mirror the registry in bulk, or hammer it beyond ordinary CLI use.</li>
            <li>Publish work that is not yours, or that you cannot license to us.</li>
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
            We will change these terms as the product grows. Material changes get a note on the site
            and, once accounts exist, an email. Continuing to use the service after a change means you
            accept it.
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
