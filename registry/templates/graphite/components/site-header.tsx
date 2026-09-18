"use client"

import { useRef } from "react"

import { nav, profile } from "../data/content"

/**
 * The header. A client component only so the mobile `<details>` menu can close
 * itself when a link is tapped — this is a one-page scroll, so the links are
 * in-page anchors and there is no route change to key off.
 *
 * The menu is a native `<details>` rather than React state: nothing to get
 * wrong about focus or `aria-expanded`, and it still works if hydration never
 * happens.
 */
export function SiteHeader() {
  const menu = useRef<HTMLDetailsElement>(null)

  const closeMenu = () => {
    if (menu.current) menu.current.open = false
  }

  return (
    <header className="grHeader">
      <div className="grWrap grHeaderRow">
        <a className="grBrand" href="#top" aria-label={`${profile.name}, home`}>
          <span className="grBrandName">{profile.name}</span>
          <span className="grBrandRole">{profile.role}</span>
        </a>

        <nav className="grNav" aria-label="Primary">
          {nav.map((link) => (
            <a key={link.href} href={link.href} className="grNavLink">
              {link.label}
            </a>
          ))}
        </nav>

        <details className="grMenu" ref={menu}>
          <summary className="grMenuSummary">Menu</summary>
          <nav className="grMenuPanel" aria-label="Primary">
            {nav.map((link) => (
              <a key={link.href} href={link.href} className="grMenuLink" onClick={closeMenu}>
                {link.label}
              </a>
            ))}
          </nav>
        </details>
      </div>
    </header>
  )
}
