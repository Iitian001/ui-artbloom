import Link from "next/link"

import { LogoMark } from "@/components/logo"
import { ThemeToggle } from "@/components/theme-toggle"
import { brand } from "@/lib/brand"

type FooterLink = { label: string; href: string; external?: boolean }
type FooterColumn = { heading: string; links: FooterLink[] }

/**
 * Only the handles that exist. `brand.social` keys are optional because an
 * unclaimed handle should be absent rather than linked and returning 404.
 */
const SOCIAL_LINKS: FooterLink[] = (
  [
    ["X (Twitter)", brand.social.x],
    ["GitHub", brand.social.github],
  ] satisfies Array<[string, string | undefined]>
)
  .filter((entry): entry is [string, string] => Boolean(entry[1]))
  .map(([label, href]) => ({ label, href, external: true }))

const COLUMNS: FooterColumn[] = [
  {
    heading: "Product",
    links: [
      { label: "Templates", href: "/community/templates" },
      { label: "Animations", href: "/community/animations" },
      { label: "Themes", href: "/themes" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "Docs", href: "/docs" },
      { label: "CLI", href: "/docs/cli" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "Contact", href: `mailto:${brand.email}` },
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
      { label: "License", href: "/license" },
    ],
  },
  ...(SOCIAL_LINKS.length > 0 ? [{ heading: "Connect", links: SOCIAL_LINKS }] : []),
]

/**
 * The brand block plus one track per column actually rendered. Keyed by count
 * rather than hardcoded so removing a column cannot leave a dead track behind,
 * and written out in full because Tailwind scans source text — a class name
 * assembled from a template literal would never be generated.
 */
const GRID_COLUMNS: Record<number, string> = {
  3: "md:grid-cols-[1.4fr_repeat(3,1fr)]",
  4: "md:grid-cols-[1.4fr_repeat(4,1fr)]",
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className={`container-page grid gap-10 py-14 ${GRID_COLUMNS[COLUMNS.length]}`}>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <LogoMark className="size-6" />
            <span className="text-sm font-semibold tracking-tight">Built with {brand.name}</span>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
            {brand.description}
          </p>
          <ThemeToggle className="w-fit" />
        </div>

        {COLUMNS.map((column) => (
          <nav key={column.heading} className="flex flex-col gap-3">
            <h3 className="text-[13px] font-semibold tracking-tight">{column.heading}</h3>
            <ul className="flex flex-col gap-2.5">
              {column.links.map((link) => (
                <li key={link.label}>
                  {link.external ? (
                    <a
                      href={link.href}
                      rel="noreferrer noopener"
                      target="_blank"
                      className="text-[13px] text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className="text-[13px] text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="container-page flex flex-col gap-2 border-t border-border py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <span>
          © {new Date().getFullYear()} {brand.legalEntity}
        </span>
        <span className="font-mono">
          npx {brand.npmPackage} add &lt;name&gt;
        </span>
      </div>
    </footer>
  )
}
