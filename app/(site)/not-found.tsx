import Link from "next/link"

import { PageHeader } from "@/components/page-shell"
import { CATEGORY_GROUPS } from "@/lib/categories"
import { itemHref } from "@/lib/hrefs"
import { newest } from "@/lib/registry"

const LINKS = [
  ...CATEGORY_GROUPS.map((group) => ({
    href: `/community/${group.kind}`,
    label: group.label,
    body: group.blurb,
  })),
  { href: "/docs", label: "Docs", body: "How installing works, and what lands in your project." },
]

/**
 * Shown for anything inside the site shell that resolves to nothing — including
 * `/@nobody`, since a bad handle matches the profile route and calls notFound().
 */
export default function NotFound() {
  const suggestions = newest(4)

  return (
    <>
      <PageHeader
        eyebrow="404"
        title="This page moved, or never existed"
        lede="Nothing here. The catalogue is still where you left it, and search (⌘K) covers every piece by name, category, and author."
      />

      <div className="container-page pb-20">
        <div className="grid gap-3 sm:grid-cols-2">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group rounded-xl border border-border p-5 transition-colors hover:border-foreground/20 hover:bg-subtle"
            >
              <p className="text-sm font-medium">
                {link.label}
                <span className="ml-1 inline-block transition-transform group-hover:translate-x-0.5">
                  →
                </span>
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{link.body}</p>
            </Link>
          ))}
        </div>

        {suggestions.length > 0 && (
          <section className="mt-12">
            <h2 className="text-sm font-semibold tracking-tight">Recently added</h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {suggestions.map((item) => (
                <li key={item.name}>
                  <Link
                    href={itemHref(item)}
                    className="inline-flex rounded-full border border-border px-3 py-1.5 text-[13px] text-muted-foreground transition-colors hover:border-foreground/20 hover:text-foreground"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </>
  )
}
