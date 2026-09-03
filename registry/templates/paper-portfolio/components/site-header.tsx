"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

import { BASE, href, profile } from "../data/projects"

const links: Array<[string, string]> = [
  ["/", "Home"],
  ["/work", "Work"],
  ["/about", "About"],
  ["/projects", "Projects"],
  ["/contact", "Contact"],
  ["/sketchbook", "Sketchbook"],
]

export function SiteHeader() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  /*
   * The mobile drawer is absolutely positioned inside the header, so a route
   * change leaves it hanging open over the new page. Close it whenever the path
   * changes rather than relying on every link remembering to.
   */
  useEffect(() => setOpen(false), [pathname])

  /* Escape closes it too — it covers the page and traps nothing. */
  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open])

  const home = BASE || "/"
  const isActive = (path: string) =>
    path === "/" ? pathname === home : pathname.startsWith(href(path))

  return (
    <header className="siteHeader">
      <Link className="brand" href={home} aria-label={`${profile.name} ${profile.surname} home`}>
        <span className="brandStar" aria-hidden="true">
          ✱
        </span>
        <span>
          {profile.name} {profile.surname}
        </span>
        <span className="brandUnderline" aria-hidden="true" />
      </Link>

      <button
        type="button"
        className="menuButton"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-label="Toggle navigation"
      >
        <span aria-hidden="true" />
        <span aria-hidden="true" />
      </button>

      <nav className={open ? "mainNav open" : "mainNav"} aria-label="Primary">
        {links.map(([path, label]) => (
          <Link
            key={path}
            href={href(path)}
            className={isActive(path) ? "active" : undefined}
            aria-current={isActive(path) ? "page" : undefined}
          >
            {label}
          </Link>
        ))}
      </nav>

      <Link className="talkButton" href={href("/contact")}>
        <span className="talkBubble" aria-hidden="true">
          ◌
        </span>{" "}
        Let&apos;s Talk! <b aria-hidden="true">›</b>
      </Link>
    </header>
  )
}
