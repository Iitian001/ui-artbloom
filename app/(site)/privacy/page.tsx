import type { Metadata } from "next"
import Link from "next/link"

import { PageHeader, Prose } from "@/components/page-shell"
import { brand } from "@/lib/brand"

export const metadata: Metadata = {
  title: "Privacy",
  description: `What ${brand.name} collects, which right now is almost nothing.`,
}

const UPDATED = "3 September 2026"

export default function PrivacyPage() {
  return (
    <>
      <PageHeader
        eyebrow="Privacy"
        title="What we collect"
        lede="Today: no accounts, no analytics, no cookies of ours. This page will grow when that changes, and it will say so."
      />

      <div className="container-page pb-20">
        <Prose>
          <p className="text-xs">Last updated {UPDATED}. Controller: {brand.legalEntity}.</p>

          <h2>Right now</h2>
          <p>
            The site is statically generated and serves no tracking script. We set no cookies. There
            is no account system, so there is no profile to build. Your theme choice is kept in your
            own browser&apos;s local storage and never leaves the device.
          </p>
          <p>
            Our host keeps ordinary server logs — IP address, user agent, the path requested — for a
            short window, to serve traffic and absorb abuse. We do not join those logs to anything.
          </p>

          <h2>The registry API and the CLI</h2>
          <p>
            When you run <code>npx {brand.npmPackage} add …</code>, your machine fetches JSON from{" "}
            <code>/r/&lt;name&gt;.json</code>. That is an ordinary HTTP request, so it reaches the host
            with your IP address. The CLI itself sends no telemetry: it reads nothing about your
            project and reports nothing back. Install counts on the site are aggregate request counts,
            not per-person histories.
          </p>

          <h2>What changes when accounts arrive</h2>
          <p>
            An account will mean an email address, a password hash, and the lists you save. Payment
            will go through a payment processor that handles card details — we will not see or store
            a card number. If we add analytics it will be aggregate and cookieless, and this page will
            name the tool before it goes live.
          </p>

          <h2>Your rights</h2>
          <p>
            Under the GDPR and similar laws you can ask for a copy of anything we hold about you, ask
            for it corrected, or ask for it deleted. Today the answer to the first question is
            genuinely &ldquo;nothing we can tie to you&rdquo;. Once there is an account, deleting it
            deletes the data with it. Write to{" "}
            <a href={`mailto:${brand.email}`}>{brand.email}</a>.
          </p>

          <h2>Other people&apos;s services</h2>
          <p>
            Templates you install may load fonts or images from third parties in{" "}
            <em>your</em> project — that is your users&apos; data and your privacy notice, not ours.
            Each template page lists what it fetches. See also the{" "}
            <Link href="/license">licence</Link> and <Link href="/terms">terms</Link>.
          </p>

          <h2>Children</h2>
          <p>This is a developer tool and not intended for anyone under 16.</p>
        </Prose>
      </div>
    </>
  )
}
