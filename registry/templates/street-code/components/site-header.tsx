"use client"

import { useRef } from "react"

import { BASE, brand, nav } from "../data/content"

/**
 * The header — a sprayed tag, the handle, and the nav.
 *
 * This is a one-page scroll, so the nav points at in-page anchors (`#work`) and
 * there is no active-route logic to run. The only reason it is a client component
 * is the mobile menu: it is a native `<details>`, and a tap on a link inside it
 * should close it before the page scrolls. One ref, one handler, no state.
 */
export function SiteHeader() {
  const menu = useRef<HTMLDetailsElement>(null)

  const closeMenu = () => {
    if (menu.current) menu.current.open = false
  }

  return (
    <header className="scHeader">
      <div className="scWrap scHeaderRow">
        <a className="scBrand" href={BASE || "/"}>
          <span className="scBrandTag">{brand.tag}</span>
          <span className="scBrandHandle">{brand.handle}</span>
        </a>

        <nav className="scNav" aria-label="Primary">
          {nav.map((link) => (
            <a key={link.href} href={link.href} className="scNavLink">
              {link.label}
            </a>
          ))}
          <a href="#contact" className="scNavCta">
            Hire me
          </a>
        </nav>

        <details className="scMenu" ref={menu}>
          <summary className="scMenuSummary" aria-label="Menu">
            <span className="scMenuBar" aria-hidden="true" />
            <span className="scMenuBar" aria-hidden="true" />
            <span className="scMenuBar" aria-hidden="true" />
          </summary>
          <nav className="scMenuPanel" aria-label="Primary">
            {nav.map((link) => (
              <a key={link.href} href={link.href} className="scMenuLink" onClick={closeMenu}>
                {link.label}
              </a>
            ))}
            <a href="#contact" className="scMenuLink scMenuLinkCta" onClick={closeMenu}>
              Hire me
            </a>
          </nav>
        </details>
      </div>
    </header>
  )
}
