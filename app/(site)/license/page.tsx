import type { Metadata } from "next"
import Link from "next/link"

import { PageHeader, Prose } from "@/components/page-shell"
import { brand } from "@/lib/brand"
import { itemHref } from "@/lib/hrefs"
import { getItem } from "@/lib/registry"
import { pageMeta } from "@/lib/seo"

export const metadata: Metadata = pageMeta({
  title: "Licence",
  description: `Everything in ${brand.name} is MIT and free — commercial work included, no attribution required.`,
  path: "/license",
})

const UPDATED = "3 September 2026"

/** The only template that bundles work I did not make. */
const SUPERCAR = getItem("cinematic-supercar")

/**
 * Read from the LICENSE files that ship inside that template, not from memory:
 * `assets/models/aventador/LICENSE.txt`, `assets/images/LICENSES.md` and
 * `assets/audio/LICENSES.md`. If those files change, change this list with them.
 */
const THIRD_PARTY = [
  {
    what: "The car model and its textures",
    lands: "public/cinematic-supercar/models/aventador/LICENSE.txt",
    terms:
      "MIT, copyright (c) 2021 Santosh Arron. The same permissive terms as everything else here, but someone else's copyright — so that notice has to travel with the files.",
  },
  {
    what: "The photograph",
    lands: "public/cinematic-supercar/images/LICENSES.md",
    terms:
      "CC BY-SA 4.0, by Blue0ne87 on Wikimedia Commons, resized and converted to WebP. Credit the author, keep the licence link, say what you changed — and whatever you adapt from it stays under CC BY-SA 4.0.",
  },
  {
    what: "The V12 idle and rev",
    lands: "public/cinematic-supercar/audio/LICENSES.md",
    terms:
      "CC0 1.0, by cheesepuff on Freesound. A public-domain dedication: nothing at all is required of you.",
  },
  {
    what: "The ignition and exhaust",
    lands: "public/cinematic-supercar/audio/LICENSES.md",
    terms:
      "No named licence. Used under the permission its source page states, which lists commercial films, games, trailers and social media. Creator given by the source as Mateo Bode, via deadsounds.com.",
  },
]

export default function LicensePage() {
  return (
    <>
      <PageHeader
        eyebrow="Licence"
        title={
          <>
            MIT. Free. Yours to ship.
            <br />
            <em className="font-serif font-normal italic">No fee, no credit, no catch.</em>
          </>
        }
        lede="Every line of code here is MIT-licensed. Use it in personal and commercial work, for yourself or for a client, without paying and without crediting anyone. The one exception is a handful of third-party assets bundled inside a single template, and they are named below."
      />

      <div className="container-page pb-20">
        <Prose>
          <p className="text-xs">Last updated {UPDATED}.</p>

          <h2>The code is MIT</h2>
          <p>
            Every file <code>{brand.npmPackage}</code> writes into your project, and every file you
            copy off a page here, is released under the MIT licence, copyright{" "}
            {brand.legalEntity}. You may use, copy, modify, merge, publish, distribute, sublicense
            and sell it — closed source, commercial, client work, as many projects as you like.
          </p>
          <ul>
            <li>
              <strong>No fee.</strong> There are no plans, no metering and nothing to buy. This is
              not a trial that turns into a bill.
            </li>
            <li>
              <strong>No attribution.</strong> You do not have to credit {brand.wordmark}, link
              back, or keep a comment header. Do it if you want to; nothing depends on it.
            </li>
            <li>
              <strong>No account.</strong> The registry is read-only static JSON, so the CLI needs
              no login and no API key.
            </li>
          </ul>
          <p>
            The code is provided <strong>as is</strong>, without warranty of any kind, and nobody
            here is liable for what happens once you ship it. That is not fine print added on top of
            MIT — it is the second half of MIT, and it is the half people skip.
          </p>

          <h2>The catalogue is closed to submissions</h2>
          <p>
            Everything here is one author&apos;s own work. There is no submission queue, no review
            process to enter, and no revenue share — there is no revenue. That is a statement about
            who adds to the catalogue, not about who may use it. What is already here is yours under
            the terms above, whoever you are.
          </p>
          <p>
            MIT permits redistribution, and I am not going to bolt on a clause that contradicts the
            licence I just named. So this is a request rather than a term: install the pieces you
            need instead of mirroring the registry in bulk.
          </p>

          <h2>What MIT here cannot cover</h2>
          <p>
            {SUPERCAR ? <Link href={itemHref(SUPERCAR)}>{SUPERCAR.title}</Link> : "Cinematic Supercar"}{" "}
            ships bytes I did not make: a car model, a photograph and two engine recordings. Their
            terms are not mine to waive, and two of the four do ask something of you. The licence
            files install alongside the assets, so an install cannot lose them.
          </p>
          <ul>
            {THIRD_PARTY.map((asset) => (
              <li key={asset.what + asset.lands}>
                <strong>{asset.what}.</strong> {asset.terms} Ships to{" "}
                <code>{asset.lands}</code>.
              </li>
            ))}
          </ul>
          <p>
            No other item bundles third-party assets. Those three licence files are the only ones in
            the whole registry, so everywhere else the MIT grant above is the entire story.
          </p>

          <h2>npm packages</h2>
          <p>
            A piece may require packages from npm — <code>motion</code> and the like. Those keep
            their own licences and are listed on each item page under Dependencies. Nothing here
            relicenses them.
          </p>

          <h2>The name and the logo</h2>
          <p>
            MIT is a copyright licence, not a trademark grant, so the {brand.wordmark} name and mark
            are not part of it. Say you built with it as much as you like; do not ship something that
            implies it came from here.
          </p>

          <h2>Questions</h2>
          <p>
            This page is written to be read, not litigated. The operative licence is the standard,
            unmodified MIT text — nothing on this page adds a condition to it. If your legal team
            wants that in writing over a name, <a href={`mailto:${brand.email}`}>{brand.email}</a>{" "}
            reaches a human.
          </p>
        </Prose>
      </div>
    </>
  )
}
