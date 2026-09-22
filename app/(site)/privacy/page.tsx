import type { Metadata } from "next"
import Link from "next/link"

import { PageHeader, Prose } from "@/components/page-shell"
import { brand } from "@/lib/brand"
import { pageMeta } from "@/lib/seo"

export const metadata: Metadata = pageMeta({
  title: "Privacy",
  description: `What ${brand.name} collects: no account, no analytics, and a CLI ping we do not record.`,
  path: "/privacy",
})

const UPDATED = "4 September 2026"

/*
 * WRITTEN FROM THE CODE, NOT FROM MEMORY. A privacy notice that denies what the product
 * does is worse than no notice at all, so the rule for editing this file is: name the
 * file that does the thing, and read that file first.
 *
 * What the code actually does, as of this writing:
 *
 *   - No accounts. There is no sign-in, no user row, and no cookie this site sets; the
 *     theme choice lives in local storage, not a cookie.
 *   - The CLI still posts one line per installed piece (`cli/src/track.ts`), but the
 *     route that recorded it is gone, so the request reaches this origin and is dropped.
 *   - Error monitoring is Sentry, and only when a DSN is configured — see
 *     `instrumentation.ts` and `instrumentation-client.ts`. With no DSN it never loads.
 *   - No payment. Everything in the catalogue is free.
 */
export default function PrivacyPage() {
  return (
    <>
      <PageHeader
        eyebrow="Privacy"
        title="What we collect"
        lede="No account, no third-party analytics, no cookies of ours, and nothing to buy. What little reaches us carries no name."
      />

      <div className="container-page pb-20">
        <Prose>
          <p className="text-xs">
            Last updated {UPDATED}. Controller: {brand.legalEntity}.
          </p>
          <h2>Browsing the site</h2>
          <p>
            Every page here is generated at build time and served as static HTML. There is no ad
            network, no session recorder, and no third-party analytics of any kind; the only
            third-party code that can load is the error monitor described below, and only when a
            deployment switches it on. The one thing we put in your browser is your theme choice,
            which lives in local storage on your own device and is never sent anywhere.
          </p>
          <p>
            Our host keeps ordinary server logs — IP address, user agent, the path requested — for a
            short window, to serve traffic and absorb abuse. We do not join those logs to anything
            else described on this page.
          </p>

          <h2>The CLI</h2>
          <p>
            When you run <code>npx {brand.npmPackage} add …</code>, your machine fetches JSON from{" "}
            <code>/r/&lt;name&gt;.json</code>. That is an ordinary HTTP request, so it reaches the
            host with your IP address, exactly like loading a page.
          </p>
          <p>
            Then, once the files are on disk, the CLI posts one short message per installed piece:
            the name of the piece, the CLI&apos;s version, and which package manager you use. Nothing
            else — not your project name, not a file path, not your username, not a machine id, and
            nothing that persists between runs to link two installs together. It is a single{" "}
            <code>POST</code> with a two-second timeout, and a failure is silent, so a counter can
            never break an install.
          </p>
          <p>Three ways to send nothing at all:</p>
          <ul>
            <li>
              <code>--no-telemetry</code> on any command.
            </li>
            <li>
              <code>DO_NOT_TRACK=1</code> in the environment.
            </li>
            <li>
              <code>CI=1</code>, which most build servers set for you — automated installs are not
              counted.
            </li>
          </ul>
          <p>
            We keep none of it. The endpoint that once recorded these pings has been removed, so the
            request arrives at our origin and is dropped with nothing written down — no counter, no
            database, no hash of your address. The CLI still sends it because the same command works
            against any registry, and yours may run one that listens; ours does not. Sending nothing
            in the first place is still the cleaner option, so the opt-outs above continue to work.
          </p>

          <h2>Error monitoring</h2>
          <p>
            When a deployment is configured with a Sentry key, an uncaught error — in the browser or
            on the server — sends a report to <strong>Sentry</strong> so it can be fixed. A report is
            a stack trace and the technical context around the failure: the URL, the browser and
            operating system, and the error message. It is sent only when something breaks, never on
            an ordinary page view, and it carries no name because we have none to attach. We do not
            enable session replay, so your browsing is not recorded. When no key is configured —
            which is the default — the monitoring code never loads and nothing leaves your browser.
          </p>

          <h2>What we do not do</h2>
          <p>
            We do not sell or share any of this with anyone. There is no advertising, no cross-site
            tracking, no profiling, and no mailing list — outside of sign-in we never learn your
            address, so we could not email you if we wanted to. There is no payment processor and no
            card handling either, because everything in the catalogue is free.
          </p>

          <h2>Your rights</h2>
          <p>
            Under the GDPR and similar laws you can ask for a copy of anything we hold about you, ask
            for it corrected, or ask for it deleted. The honest answer is that we hold nothing we can
            tie to you: there is no account, and the one request your machine sends us is discarded
            unread. If a Sentry error report has captured something you believe identifies you, write
            to <a href={`mailto:${brand.email}`}>{brand.email}</a> and we will remove it.
          </p>

          <h2>Other people&apos;s services</h2>
          <p>
            Our <strong>host</strong> serves the pages and keeps the ordinary server logs described
            above. <strong>Sentry</strong> receives an error report if — and only if — monitoring is
            switched on for a deployment, and then only when something breaks. That is the entire
            list.
          </p>
          <p>
            Separately, a template you install may load fonts or images from a third party inside{" "}
            <em>your</em> project — that is your users&apos; data and your privacy notice, not ours.
            Each item page lists what it fetches. See also the <Link href="/license">licence</Link>{" "}
            and <Link href="/terms">terms</Link>.
          </p>

          <h2>Changes</h2>
          <p>
            If what we collect changes, the date at the top changes with it and the section that
            changed says what it now does. This page is meant to be checked against the code rather
            than believed: there are no cookies to find, and error monitoring lives in the two
            instrumentation files named above.
          </p>

          <h2>Children</h2>
          <p>This is a developer tool and not intended for anyone under 16.</p>
        </Prose>
      </div>
    </>
  )
}
