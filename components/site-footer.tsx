import Link from "next/link"

import { LogoMark } from "@/components/logo"
import { ThemeToggle } from "@/components/theme-toggle"
import { brand } from "@/lib/brand"

const COLUMNS = [
  {
    heading: "Product",
    links: [
      { label: "Templates", href: "/community/templates" },
      { label: "Animations", href: "/community/animations" },
      { label: "Components", href: "/community/components" },
      { label: "Themes", href: "/themes" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "Docs", href: "/docs" },
      { label: "CLI", href: "/docs/cli" },
      { label: "Publish", href: "/publish" },
      { label: "Sign in", href: "/login" },
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
]

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="container-page grid gap-10 py-14 md:grid-cols-[1.4fr_repeat(4,1fr)]">
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
                  <Link
                    href={link.href}
                    className="text-[13px] text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        <nav className="flex flex-col gap-3">
          <h3 className="text-[13px] font-semibold tracking-tight">Connect</h3>
          <ul className="flex flex-col gap-2.5">
            <li>
              <a
                href={brand.social.x}
                rel="noreferrer noopener"
                target="_blank"
                className="text-[13px] text-muted-foreground transition-colors hover:text-foreground"
              >
                X (Twitter)
              </a>
            </li>
            <li>
              <a
                href={brand.social.github}
                rel="noreferrer noopener"
                target="_blank"
                className="text-[13px] text-muted-foreground transition-colors hover:text-foreground"
              >
                GitHub
              </a>
            </li>
          </ul>
        </nav>
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
