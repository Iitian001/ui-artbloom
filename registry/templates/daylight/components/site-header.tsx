"use client"

import Link from "next/link"
import { useRef } from "react"

import { BASE, nav, profile } from "../data/content"

/**
 * The header, and the only client component in the chrome.
 *
 * The nav is a set of in-page anchors, so there is no active-route state to
 * track. The mobile menu is a native `<details>` — nothing to get wrong about
 * focus or aria-expanded — and the one bit of JS closes it after a link is
 * tapped, since a hash jump does not remount the layout to close it for us.
 */
export function SiteHeader() {
  const menu = useRef<HTMLDetailsElement>(null)
  const close = () => {
    if (menu.current) menu.current.open = false
  }

  return (
    <header className="dlHeader">
      <div className="dlWrap dlHeaderRow">
        <Link className="dlBrand" href={BASE || "/"}>
          <span className="dlBrandMark" aria-hidden="true">
            {profile.name[0]}
            {profile.surname[0]}
          </span>
          <span>
            {profile.name} {profile.surname}
          </span>
          <span className="dlBrandRole">{profile.role}</span>
        </Link>

        <nav className="dlNav" aria-label="Primary">
          {nav.map((link) => (
            <a key={link.href} href={link.href} className="dlNavLink">
              {link.label}
            </a>
          ))}
        </nav>

        <details className="dlMenu" ref={menu}>
          <summary className="dlMenuSummary">Menu</summary>
          <nav className="dlMenuPanel" aria-label="Primary">
            {nav.map((link) => (
              <a key={link.href} href={link.href} className="dlMenuLink" onClick={close}>
                {link.label}
              </a>
            ))}
          </nav>
        </details>
      </div>
    </header>
  )
}
