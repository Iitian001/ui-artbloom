import type { Metadata } from "next"
import Link from "next/link"

import { CodeBlock } from "@/components/code-block"
import { PageHeader, Prose } from "@/components/page-shell"
import { brand } from "@/lib/brand"
import { pageMeta } from "@/lib/seo"

export const metadata: Metadata = pageMeta({
  title: "Themes",
  description:
    "Every piece reads from the same token contract, so one set of CSS variables restyles the whole catalogue.",
  path: "/themes",
})

const SURFACES = [
  { token: "background", cls: "bg-background" },
  { token: "card", cls: "bg-card" },
  { token: "subtle", cls: "bg-subtle" },
  { token: "secondary", cls: "bg-secondary" },
  { token: "muted", cls: "bg-muted" },
  { token: "accent", cls: "bg-accent" },
  { token: "primary", cls: "bg-primary" },
  { token: "destructive", cls: "bg-destructive" },
]

const TYPE = [
  { label: "Sans — Inter", cls: "font-sans text-2xl", sample: "Ship the interface" },
  {
    label: "Serif — Instrument Serif",
    cls: "font-serif text-2xl italic",
    sample: "Ship the interface",
  },
  { label: "Mono — JetBrains Mono", cls: "font-mono text-xl", sample: "npx ui.artbloom add" },
]

const RADII = ["rounded-sm", "rounded-md", "rounded-lg", "rounded-xl", "rounded-2xl"]

const OVERRIDE = `/* app/globals.css — after the ui.artbloom install */
:root {
  --radius: 0.75rem;
  --background: oklch(0.99 0.005 95);
  --foreground: oklch(0.22 0.02 95);
  --primary: oklch(0.55 0.19 25);
  --border: oklch(0.9 0.01 95);
}

.dark {
  --background: oklch(0.16 0.01 265);
  --card: oklch(0.19 0.015 265);
  --primary: oklch(0.72 0.16 25);
  --border: oklch(0.28 0.02 265);
}`

function Swatches({ mode }: { mode: "light" | "dark" }) {
  return (
    <div
      className={
        mode === "dark"
          ? "dark rounded-xl border border-border bg-background p-4"
          : "rounded-xl border border-border bg-background p-4"
      }
    >
      <p className="mb-3 text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {mode}
      </p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {SURFACES.map((surface) => (
          <div key={surface.token} className="min-w-0">
            <div className={`h-14 rounded-lg border border-border ${surface.cls}`} />
            <p className="mt-1.5 truncate font-mono text-[11px] text-muted-foreground">
              --{surface.token}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function ThemesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Themes"
        title={
          <>
            One token contract.
            <br />
            <em className="font-serif font-normal italic">Every piece obeys it.</em>
          </>
        }
        lede="Nothing in the catalogue hard-codes a colour. Every template and animation reads the same CSS variables, so restyling all of it means editing one block in globals.css."
      />

      <div className="container-page pb-20">
        <section>
          <h2 className="text-lg font-semibold tracking-tight">Surfaces</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Both modes are authored side by side, in oklch, so lightness stays even as the hue moves.
          </p>
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <Swatches mode="light" />
            <Swatches mode="dark" />
          </div>
        </section>

        <section className="mt-14">
          <h2 className="text-lg font-semibold tracking-tight">Type</h2>
          <div className="mt-4 divide-y divide-border rounded-xl border border-border">
            {TYPE.map((face) => (
              <div key={face.label} className="flex flex-wrap items-baseline gap-4 px-5 py-4">
                <span className="w-52 shrink-0 text-xs text-muted-foreground">{face.label}</span>
                <span className={face.cls}>{face.sample}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-14">
          <h2 className="text-lg font-semibold tracking-tight">Radius</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Derived from a single <code className="font-mono text-xs">--radius</code>. Move it and
            every corner in the catalogue moves with it.
          </p>
          <div className="mt-4 flex flex-wrap items-end gap-4">
            {RADII.map((radius) => (
              <div key={radius}>
                <div className={`size-16 border border-border bg-secondary ${radius}`} />
                <p className="mt-1.5 font-mono text-[11px] text-muted-foreground">{radius}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-14 grid items-start gap-8 lg:grid-cols-2">
          <Prose>
            <h2>Retheme in one block</h2>
            <p>
              An installed piece never sets a colour of its own. Override the variables and the
              whole catalogue follows — including the animations, whose gradients are built from{" "}
              <code>--primary</code> and <code>--foreground</code>.
            </p>
            <ul>
              <li>
                Paste the block into <code>app/globals.css</code>, below the{" "}
                <code>@import &quot;tailwindcss&quot;</code> line.
              </li>
              <li>
                Keep the variable names. <code>{brand.npmPackage}</code> reads them by name, not by
                value.
              </li>
              <li>Author both modes. A piece that only looks right in one is a piece with a bug.</li>
            </ul>
            <p>
              Shareable theme presets are not built yet — this page is the contract they will be
              written against. Until then, the block on the right is the whole story. The{" "}
              <Link href="/docs">docs</Link> cover the rest of the install.
            </p>
          </Prose>

          <CodeBlock code={OVERRIDE} lang="css" filename="app/globals.css" maxHeight="30rem" />
        </section>
      </div>
    </>
  )
}
