import type { Metadata } from "next"
import Link from "next/link"

import { CodeBlock } from "@/components/code-block"
import { PageHeader, Prose } from "@/components/page-shell"
import { buttonVariants } from "@/components/ui/button"
import { brand } from "@/lib/brand"
import { profileHref } from "@/lib/hrefs"
import { totalInstalls } from "@/lib/registry"
import { cn, formatFull } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Publish",
  description: `Get your own templates and animations into the ${brand.name} registry.`,
}

const ITEM = `{
  "name": "tilt-card",
  "title": "Tilt Card",
  "kind": "animations",
  "description": "A card that leans toward the cursor and settles on a spring.",
  "categories": ["hover", "three-d"],
  "dependencies": ["motion@13.2.0"],
  "registryDependencies": [],
  "files": [
    {
      "source": "animations/tilt-card.tsx",
      "target": "components/ui/tilt-card.tsx",
      "type": "registry:ui"
    }
  ],
  "css": "@keyframes tilt-settle { ... }"
}`

const RULES = [
  ["One idea per piece", "If it needs two paragraphs to describe, it is two pieces."],
  ["No colour literals", "Read the tokens. A piece that only works on one background is broken."],
  ["Both modes", "Light and dark. Check the dark one on a real dark background, not grey."],
  ["Pin your packages", "Exact versions in dependencies. A range breaks someone's build later."],
  ["Deterministic render", "No Math.random or Date.now in render — it desyncs server and client."],
  ["Reduced motion", "Respect prefers-reduced-motion for anything that loops."],
]

export default function PublishPage() {
  return (
    <>
      <PageHeader
        eyebrow="Publish"
        title={
          <>
            Your name on it.
            <br />
            <em className="font-serif font-normal italic">Every install.</em>
          </>
        }
        lede={`Every piece in the catalogue is credited to whoever made it, on the card, on the page, and in the JSON the CLI reads. ${formatFull(totalInstalls())} installs so far have an author attached.`}
      >
        <div className="mt-7 flex flex-wrap gap-3">
          <Link href="/signup" className={buttonVariants()}>
            Create an account
          </Link>
          <a
            href={`mailto:${brand.email}?subject=Publishing%20on%20${brand.name}`}
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            Ask a question
          </a>
        </div>
      </PageHeader>

      <div className="container-page pb-20">
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_24rem]">
          <Prose>
            <h2>How it works</h2>
            <ol>
              <li>
                Build the piece in a real project, against Tailwind v4 tokens and the{" "}
                <code>@/*</code> alias.
              </li>
              <li>
                Write the item descriptor — the JSON on the right. <code>source</code> is where the
                file lives in the registry, <code>target</code> is where it lands in someone
                else&apos;s project.
              </li>
              <li>
                Open a pull request with the source file and the descriptor. Review is a read, a
                run, and a look at both colour modes.
              </li>
              <li>
                Once merged it is live at <code>/r/&lt;name&gt;.json</code> and installable by name.
              </li>
            </ol>

            <h2>What gets rejected</h2>
            <p>
              Almost always for one of six reasons. None of them are about taste — they are about
              whether the piece survives contact with someone else&apos;s project.
            </p>

            <h2>Licensing</h2>
            <p>
              You keep the copyright. Publishing grants{" "}
              <strong>{brand.legalEntity}</strong> the right to host it and to let others install and
              modify it — the terms are on the <Link href="/license">licence page</Link>.
            </p>
            <p>
              Only submit work you wrote. Code carried over from a library whose licence forbids
              redistribution cannot go in, however small the snippet — that includes anything under
              Commons Clause or a no-resale rider.
            </p>

            <h2>Getting paid</h2>
            <p>
              Revenue share for Pro pieces is not built yet, and I would rather say that plainly than
              imply a payout that does not exist. Today publishing buys you attribution and install
              numbers on your <Link href={profileHref("artbloom")}>profile</Link>.
            </p>
          </Prose>

          <div className="flex flex-col gap-4">
            <CodeBlock code={ITEM} lang="json" filename="registry item descriptor" maxHeight="30rem" />

            <div className="rounded-xl border border-border">
              <p className="border-b border-border px-4 py-2.5 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                The six rules
              </p>
              <dl className="divide-y divide-border">
                {RULES.map(([rule, why]) => (
                  <div key={rule} className="px-4 py-3">
                    <dt className="text-[13px] font-medium">{rule}</dt>
                    <dd className="mt-0.5 text-xs text-muted-foreground">{why}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
