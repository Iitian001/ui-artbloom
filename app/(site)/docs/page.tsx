import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"

import { CodeBlock } from "@/components/code-block"
import { InstallTabs } from "@/components/install-tabs"
import { PageHeader, Prose } from "@/components/page-shell"
import { brand, registryUrl } from "@/lib/brand"
import { newest } from "@/lib/registry"

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
    href: "/publish",
    title: "Publishing",
    body: "Get your own work into the registry.",
  },
  {
    href: "/themes",
    title: "Theming",
    body: "The token contract every piece reads.",
  },
]

const AFTER_INSTALL = `app/
  page.tsx                 # unchanged
components/
  ui/
    aurora-background.tsx  # new
    number-ticker.tsx      # new
    shimmer-button.tsx     # new
app/globals.css            # 2 keyframes appended`

export default function DocsPage() {
  const [latest] = newest(1)
  const example = latest?.name ?? "aurora-background"

  return (
    <>
      <PageHeader
        eyebrow="Docs"
        title="Install anything here in one command"
        lede={`${brand.name} is a registry, not a dependency. The CLI copies real source files into your project — you own them the moment they land, and nothing on this site is in your bundle.`}
      />

      <div className="container-page pb-20">
        <InstallTabs itemName={example} className="max-w-xl" />

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
                <code>motion</code> for anything animated. The CLI names the packages it needs
                before writing a file.
              </li>
            </ul>

            <h2>What a piece is</h2>
            <p>
              An <strong>animation</strong> is one file. A <strong>component</strong> is one file
              plus whatever it composes. A <strong>template</strong> is a whole page — every
              section, every animation it uses — pulled in transitively.
            </p>
            <p>
              Every piece is served as plain JSON. Fetch one yourself:{" "}
              <a href={registryUrl(example)}>
                <code>
                  /r/{example}.json
                </code>
              </a>
              . The index of everything lives at <a href="/r/registry.json">/r/registry.json</a>.
            </p>

            <h2>What lands in your project</h2>
            <p>
              Files go where your project already keeps things. Keyframes and CSS variables a piece
              needs are appended to your <code>globals.css</code> rather than shipped as a second
              stylesheet.
            </p>

            <h2>shadcn compatibility</h2>
            <p>
              The payload is a superset of the shadcn registry item shape, so{" "}
              <code>npx shadcn@latest add {registryUrl(example)}</code> works too. Our extra fields
              sit under <code>meta</code>, which shadcn ignores. Use whichever CLI you already have.
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
              code={AFTER_INSTALL}
              lang="text"
              filename="after: npx ui.artbloom add launch-landing"
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
