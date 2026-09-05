import type { Metadata } from "next"
import Link from "next/link"

import { PageHeader, Prose } from "@/components/page-shell"
import { brand } from "@/lib/brand"

export const metadata: Metadata = {
  title: "Privacy",
  description: `Every cookie ${brand.name} sets, and the one thing the CLI reports back.`,
}

const UPDATED = "4 September 2026"

/*
 * WRITTEN FROM THE CODE, NOT FROM MEMORY. Three things this page used to claim, and the
 * files that contradict them:
 *
 *   "no accounts, no analytics, no cookies of ours"
 *      -> `app/(site)/(auth)/auth.ts` sets three, and Supabase holds a user row.
 *   "The CLI itself sends no telemetry ... reports nothing back"
 *      -> `cli/src/track.ts` posts one line per installed item, and the CLI's own
 *         README documents it. This page was the only place denying it.
 *   "Payment will go through a payment processor that handles card details"
 *      -> there is no payment. Everything in the catalogue is free.
 *
 * A privacy notice that denies what the product does is worse than no notice at all, so
 * the rule for editing this file is: name the file that does the thing, and read that
 * file first.
 */
export default function PrivacyPage() {
  return (
    <>
      <PageHeader
        eyebrow="Privacy"
        title="What we collect"
        lede="An install count with no name attached to it and, only if you sign in, your GitHub identity and the pieces you bookmarked. No ads, no third-party analytics, nothing to buy."
      />

      <div className="container-page pb-20">
        <Prose>
          <p className="text-xs">
            Last updated {UPDATED}. Controller: {brand.legalEntity}.
          </p>
          <h2>Browsing the site</h2>
          <p>
            Every page here is generated at build time and served as static HTML. There is no
            tracking script, no ad network, no session recorder, and no third-party analytics of any
            kind. Signed out, the only thing we put in your browser is your theme choice, which
            lives in local storage on your own device and is never sent anywhere.
          </p>
          <p>
            Our host keeps ordinary server logs — IP address, user agent, the path requested — for a
            short window, to serve traffic and absorb abuse. We do not join those logs to anything
            else described on this page.
          </p>

          <h2>Signing in</h2>
          <p>
            Sign-in is GitHub only, through Supabase Auth. GitHub tells us your account id, your
            handle, your display name, your avatar URL and the email address on your GitHub account;
            Supabase keeps that as your user row. What we add to it is one line per bookmark — the
            name of the piece, when you saved it, and which account it belongs to. That is the whole
            of it; there is no password here, because there is no password to set.
          </p>
          <p>Signing in sets three cookies, and only signing in sets them:</p>
          <ul>
            <li>
              <code>ab-access</code> — your Supabase access token, so a page load knows who you are.
              Expires when the token does, usually an hour.
            </li>
            <li>
              <code>ab-refresh</code> — the token that fetches a fresh one, so you are not signed
              out every hour. 30 days.
            </li>
            <li>
              <code>ab-verifier</code> — a single-use value proving the sign-in coming back from
              GitHub is the one you started. 10 minutes, then it is deleted.
            </li>
          </ul>
          <p>
            All three are <code>httpOnly</code>, so no script on the page can read them — not ours
            and not anybody else&apos;s — <code>SameSite=Lax</code>, and <code>Secure</code> in
            production. None of them measures anything or follows you anywhere; without them the
            bookmark button cannot work at all. Signing out deletes all three on the spot.
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
            What we keep of that message is the name of the piece, the day, and a salted SHA-256 hash
            of your IP address cut to 128 bits. The hash is there so one machine installing one piece
            twice in a day counts once; the salt is a server secret we do not publish. Your address
            itself is never written to the database, and the hash cannot be turned back into it. The
            result is a number per piece per day, and nothing on this site displays those numbers
            today.
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
            for it corrected, or ask for it deleted. Signed out, the honest answer is that we hold
            nothing we can tie to you. Signed in, it is your user row and your bookmarks, and
            deleting the account takes both with it. Write to{" "}
            <a href={`mailto:${brand.email}`}>{brand.email}</a>.
          </p>

          <h2>Other people&apos;s services</h2>
          <p>
            <strong>Supabase</strong> hosts the authentication service and the database the rows
            above live in. <strong>GitHub</strong> is the identity provider, and sees that you signed
            in here. Our <strong>host</strong> serves the pages and keeps the logs. That is the
            entire list.
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
            than believed: the cookies are set in one file, and the counter is one route.
          </p>

          <h2>Children</h2>
          <p>This is a developer tool and not intended for anyone under 16.</p>
        </Prose>
      </div>
    </>
  )
}
