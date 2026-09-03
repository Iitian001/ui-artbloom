import type { Metadata } from "next"
import Link from "next/link"

import { PageHeader, Prose } from "@/components/page-shell"
import { brand } from "@/lib/brand"

export const metadata: Metadata = {
  title: "Licence",
  description: `How you may use code installed from ${brand.name}.`,
}

const UPDATED = "3 September 2026"

export default function LicensePage() {
  return (
    <>
      <PageHeader
        eyebrow="Licence"
        title="What you may do with the code"
        lede={`Short version: the pieces are yours to ship. The catalogue as a whole is not yours to resell.`}
      />

      <div className="container-page pb-20">
        <Prose>
          <p className="text-xs">Last updated {UPDATED}.</p>

          <h2>The pieces you install</h2>
          <p>
            Every file written into your project by <code>{brand.npmPackage}</code> is released under
            the MIT licence. You may use, copy, modify, merge, publish, distribute, sublicense and
            sell it, in closed-source and commercial work, for any number of clients, with no
            attribution required and no notice to us.
          </p>
          <p>
            The code is provided <strong>as is</strong>, without warranty of any kind. We are not
            liable for what happens when you ship it.
          </p>

          <h2>What the licence does not cover</h2>
          <ul>
            <li>
              <strong>The collection itself.</strong> You may not republish the catalogue, or a
              substantial part of it, as a competing library, registry, template pack, or paid
              bundle. Installing fifty pieces to build a site is the point; installing fifty pieces
              to resell as &ldquo;500 UI blocks&rdquo; is not.
            </li>
            <li>
              <strong>Scraping.</strong> The registry API is open so tools can install from it. Bulk
              mirroring it is not use, it is duplication.
            </li>
            <li>
              <strong>Our marks.</strong> The {brand.wordmark} name and logo stay ours. Say you built
              with it; do not imply we endorse or made your product.
            </li>
            <li>
              <strong>Fonts, photographs and icons</strong> that ship inside a template carry their
              own licences. Where a template depends on a font or image we cannot sublicense, it uses
              a substitute and says so on its page.
            </li>
          </ul>

          <h2>Work published by other people</h2>
          <p>
            Authors keep the copyright in what they publish and grant the terms above. If a piece
            arrives under something more restrictive than MIT, it does not go in the catalogue — see{" "}
            <Link href="/publish">publishing</Link>.
          </p>

          <h2>Third-party dependencies</h2>
          <p>
            A piece may require npm packages. Those keep their own licences, listed on each item page
            under Dependencies. We do not relicense them.
          </p>

          <h2>Questions</h2>
          <p>
            This page is written to be read, not to be litigated. If your legal team needs something
            firmer before you adopt it, write to{" "}
            <a href={`mailto:${brand.email}`}>{brand.email}</a> and we will put it in writing.
          </p>
        </Prose>
      </div>
    </>
  )
}
