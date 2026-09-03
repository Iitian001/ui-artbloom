import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"

import { CodeBlock } from "@/components/code-block"
import { InstallTabs } from "@/components/install-tabs"
import { PageHeader, Prose } from "@/components/page-shell"
import { brand, installCommand, registryUrl } from "@/lib/brand"
import { newest, type RegistryItem } from "@/lib/registry"

export const metadata: Metadata = {
  title: "Docs",
  description: `How to install a template or animation from ${brand.name}, and how the registry behind it works.`,
}

const CARDS = [
  {
    href: "/docs/cli",
    title: "CLI reference",
    body: "Every command, flag, and exit code.",
  },
  {
    href: "/community/templates",
    title: "The catalogue",
    body: "Every template and animation, all free to install.",
  },
  {
    href: "/themes",
    title: "Theming",
    body: "The token contract every piece reads.",
  },
]

/**
 * What an install leaves behind, read off the item's own targets.
 *
 * Derived rather than typed out: a hand-written listing outlives the piece it
 * describes, and a path in the docs that no install ever writes is worse than no
 * listing at all. The targets are shown as the CLI's defaults resolve them —
 * `components/ui`, `hooks`, `app` — which is what a reader gets if they never
 * write a config file.
 */
function afterInstall(item: RegistryItem) {
  const rows: { path: string; note: string }[] = item.files.map((file) => ({
    path: file.target,
    note: "new",
  }))

  const keyframes = new Set(
    [...(item.css ?? "").matchAll(/@keyframes\s+([\w-]+)/g)].map((match) => match[1]),
  ).size
  if (keyframes > 0) {
    rows.push({
      path: "app/globals.css",
      note: `${keyframes} ${keyframes === 1 ? "keyframe" : "keyframes"} appended`,
    })
  }

  const width = Math.max(...rows.map((row) => row.path.length))
  return rows.map((row) => `${row.path.padEnd(width)}  # ${row.note}`).join("\n")
}

export default function DocsPage() {
  /**
   * The newest piece in the catalogue, and nothing behind it: `newest` sorts
   * ITEMS, which is a non-empty module constant, so there is always a first
   * entry. A fallback name spelled out here could only ever rot unnoticed.
   */
  const [example] = newest(1)

  return (
    <>
      <PageHeader
        eyebrow="Docs"
        title="Install anything here in one command"
        lede={`${brand.name} is a registry, not a dependency. The CLI copies real source files into your project — you own them the moment they land, and nothing on this site is in your bundle.`}
      />

      <div className="container-page pb-20">
        <InstallTabs itemName={example.name} className="max-w-xl" />

        <div className="mt-14 grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <Prose>
            <h2>Requirements</h2>
            <ul>
              <li>
                React 19 and either Next.js 15+ or any bundler that resolves the{" "}
                <code>@/*</code> alias.
              </li>
              <li>
                Tailwind CSS v4. Pieces are written against v4 syntax — <code>@theme inline</code>,{" "}
                oklch tokens — and will not style correctly on v3.
              </li>
              <li>
                <code>motion</code> only where a piece asks for it. Most animations here are plain
                CSS and need no packages at all; the CLI names every package it needs before it
                writes a file.
              </li>
            </ul>

            <h2>What a piece is</h2>
            <p>
              An <strong>animation</strong> is a file or two — the component, plus the stylesheet or
              hook it imports. A <strong>template</strong> is a whole site: every page, every
              component it composes, and the images, models and audio it needs, written into your
              project rather than linked from ours.
            </p>
            <p>
              Everything in the catalogue is made and maintained in-house by @artbloom. There is no
              submission flow, and nothing here is behind a paywall.
            </p>
            <p>
              Every piece is served as plain JSON. Fetch one yourself:{" "}
              <a href={registryUrl(example.name)}>
                <code>
                  /r/{example.name}.json
                </code>
              </a>
              . The index of everything lives at <a href="/r/registry.json">/r/registry.json</a>.
            </p>

            <h2>What lands in your project</h2>
            <p>
              Files go where your project already keeps things — components under{" "}
              <code>components/ui</code>, hooks under <code>hooks</code>, pages under{" "}
              <code>app</code>. An animation that needs a stylesheet ships one and imports it
              itself; where a piece needs bare keyframes or CSS variables instead, they are appended
              to your <code>globals.css</code> rather than left as a second file to wire up.
            </p>

            <h2>shadcn compatibility</h2>
            <p>
              The payload is a superset of the shadcn registry item shape, so{" "}
              <code>npx shadcn@latest add {registryUrl(example.name)}</code> works too. Our extra
              fields sit under <code>meta</code>, which shadcn ignores. One thing does not survive
              the trip: shadcn knows nothing about our <code>assets</code>, so a template installed
              that way arrives without the bytes that cannot be inlined as text.
            </p>

            <h2>Licence</h2>
            <p>
              Copy it, edit it, ship it commercially. What you may not do is republish the catalogue
              itself as a competing library — the full terms are on the{" "}
              <Link href="/license">licence page</Link>.
            </p>
          </Prose>

          <div className="flex flex-col gap-4">
            <CodeBlock
              code={afterInstall(example)}
              lang="text"
              filename={`after: ${installCommand(example.name)}`}
              showLineNumbers={false}
              maxHeight="20rem"
            />

            <div className="grid gap-3">
              {CARDS.map((card) => (
                <Link
                  key={card.href}
                  href={card.href}
                  className="group rounded-xl border border-border p-4 transition-colors hover:border-foreground/25 hover:bg-secondary/40"
                >
                  <p className="flex items-center gap-1.5 text-sm font-medium">
                    {card.title}
                    <ArrowRightIcon className="size-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">{card.body}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
