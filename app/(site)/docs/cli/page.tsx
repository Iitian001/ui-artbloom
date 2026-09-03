import type { Metadata } from "next"
import Link from "next/link"

import { CodeBlock } from "@/components/code-block"
import { PageHeader, Prose } from "@/components/page-shell"
import { brand } from "@/lib/brand"

export const metadata: Metadata = {
  title: "CLI reference",
  description: `Every command and flag in the ${brand.npmPackage} CLI.`,
}

const COMMANDS = [
  {
    usage: `npx ${brand.npmPackage} add <name...>`,
    body: "Fetch one or more pieces and write their files into the project. Names are the install names shown on every item page.",
  },
  {
    usage: `npx ${brand.npmPackage} list [--kind <kind>]`,
    body: "Print the catalogue: name, kind, and one-line description. Filter with templates, animations, or components.",
  },
  {
    usage: `npx ${brand.npmPackage} info <name>`,
    body: "Show exactly which files a piece would write, which npm packages it needs, and what it pulls in transitively. Writes nothing.",
  },
  {
    usage: `npx ${brand.npmPackage} init`,
    body: `Write a ${brand.npmPackage}.json so you stop passing paths on every call. Optional — the CLI guesses sensible defaults without it.`,
  },
]

const FLAGS = [
  ["-y, --yes", "Answer every prompt with the default. For CI."],
  ["-o, --overwrite", "Replace files that already exist. Off by default — a clash is an error."],
  ["-c, --cwd <path>", "Project root. Defaults to the current directory."],
  ["--css <path>", "Stylesheet that receives keyframes. Default: app/globals.css."],
  ["--ui <path>", "Where component files land. Default: components/ui."],
  ["--registry <url>", "Read from a different registry origin. For self-hosting or a fork."],
  ["--dry-run", "Print the plan and exit. Nothing is written, nothing is installed."],
  ["--no-deps", "Skip the npm install step. You handle the packages yourself."],
  ["-s, --silent", "No output except errors."],
]

const CONFIG = `{
  "registry": "${brand.origin}",
  "alias": "@",
  "paths": {
    "ui": "components/ui",
    "pages": "app",
    "css": "app/globals.css"
  }
}`

const SESSION = `$ npx ${brand.npmPackage} add launch-landing

  launch-landing  template by @artbloom
  A complete product landing page — aurora hero, animated
  stat band, feature grid, footer. Deploys as-is.
  Pulls in 3 registry dependencies.

  will write
    components/ui/aurora-background.tsx
    components/ui/number-ticker.tsx
    components/ui/shimmer-button.tsx
    app/(launch)/page.tsx
  will append 2 keyframes to app/globals.css
  will install motion@13.2.0

? Proceed? (Y/n) y

  ✓ wrote 4 files
  ✓ updated app/globals.css
  ✓ installed 1 package

  done in 10.5s`

export default function CliDocsPage() {
  return (
    <>
      <PageHeader
        eyebrow={
          <>
            <Link href="/docs" className="hover:text-foreground">
              Docs
            </Link>{" "}
            / CLI
          </>
        }
        title={`${brand.npmPackage}`}
        lede="No global install and no lock-in: it runs from npx, writes plain files, and never adds itself to your dependencies."
      />

      <div className="container-page pb-20">
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_24rem]">
          <div>
            <section>
              <h2 className="text-lg font-semibold tracking-tight">Commands</h2>
              <div className="mt-4 divide-y divide-border rounded-xl border border-border">
                {COMMANDS.map((command) => (
                  <div key={command.usage} className="px-5 py-4">
                    <code className="font-mono text-[13px] text-foreground">{command.usage}</code>
                    <p className="mt-1.5 text-sm text-muted-foreground">{command.body}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-12">
              <h2 className="text-lg font-semibold tracking-tight">Flags</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                All of these apply to <code className="font-mono text-xs">add</code>.
              </p>
              <dl className="mt-4 divide-y divide-border rounded-xl border border-border">
                {FLAGS.map(([flag, body]) => (
                  <div key={flag} className="flex flex-col gap-1 px-5 py-3 sm:flex-row sm:gap-5">
                    <dt className="shrink-0 sm:w-44">
                      <code className="font-mono text-[13px]">{flag}</code>
                    </dt>
                    <dd className="text-sm text-muted-foreground">{body}</dd>
                  </div>
                ))}
              </dl>
            </section>

            <section className="mt-12">
              <Prose>
                <h2>Exit codes</h2>
                <ul>
                  <li>
                    <code>0</code> — everything asked for was written.
                  </li>
                  <li>
                    <code>1</code> — nothing was written. An unknown name, a file clash without{" "}
                    <code>--overwrite</code>, an unreachable registry, or a refused prompt. The CLI
                    plans the whole install before touching disk, so a failure leaves the project as
                    it was.
                  </li>
                </ul>

                <h2>Self-hosting</h2>
                <p>
                  <code>--registry</code> points at any origin that serves the same JSON shape. That
                  is the whole integration surface — see the{" "}
                  <a href="/schema/registry-item.json">item schema</a> and{" "}
                  <Link href="/docs">the registry notes</Link>.
                </p>
              </Prose>
            </section>
          </div>

          <div className="flex flex-col gap-4">
            <CodeBlock code={SESSION} lang="bash" showLineNumbers={false} maxHeight="34rem" />
            <CodeBlock
              code={CONFIG}
              lang="json"
              filename={`${brand.npmPackage}.json`}
              showLineNumbers={false}
            />
          </div>
        </div>
      </div>
    </>
  )
}
