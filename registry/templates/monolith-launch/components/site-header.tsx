"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useRef } from "react"

import { BASE, brand, nav } from "../data/product"

/**
 * The header, and the only client component in the chrome.
 *
 * The mobile menu is a native `<details>` rather than React state — nothing to
 * get wrong about focus or aria-expanded. The one hook it needs exists because
 * this lives in the layout, and a layout is *not* remounted on navigation: the
 * panel would otherwise stay open over the page you just navigated to.
 */
export function SiteHeader() {
  const pathname = usePathname()
  const menu = useRef<HTMLDetailsElement>(null)

  useEffect(() => {
    if (menu.current) menu.current.open = false
  }, [pathname])

  const links = nav.map((link) => ({ ...link, active: pathname === link.href }))

  return (
    <header className="monoHeader">
      <div className="monoWrap monoHeaderRow">
        <Link className="monoBrand" href={BASE || "/"}>
          <span className="monoBrandMark" aria-hidden="true" />
          <span>{brand.name}</span>
          <span className="monoBrandDescriptor">{brand.descriptor}</span>
        </Link>

        <nav className="monoNav" aria-label="Primary">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="monoNavLink"
              aria-current={link.active ? "page" : undefined}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <details className="monoMenu" ref={menu}>
          <summary className="monoMenuSummary">Menu</summary>
          <nav className="monoMenuPanel" aria-label="Primary">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="monoMenuLink"
                aria-current={link.active ? "page" : undefined}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </details>
      </div>
    </header>
  )
}
