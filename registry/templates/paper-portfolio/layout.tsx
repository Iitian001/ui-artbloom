import type { Metadata } from "next"

import { SiteFooter } from "./components/site-footer"
import { SiteHeader } from "./components/site-header"
import { profile } from "./data/projects"

import "./paper-portfolio.css"

export const metadata: Metadata = {
  title: {
    default: `${profile.name} ${profile.surname} — ${profile.role}`,
    template: `%s — ${profile.name} ${profile.surname}`,
  },
  description: `Portfolio of ${profile.name} ${profile.surname} — AI engineer, developer and builder creating AI products, web experiences and experimental software.`,
}

/**
 * The template shell.
 *
 * This is a nested layout, so it renders no `<html>` or `<body>` — the app's root
 * layout owns those. Two wrappers instead: `.paperDesk` paints the surface the
 * sheet sits on, `.paperSite` is the sheet and the scope for every style in
 * `paper-portfolio.css`.
 */
export default function PaperPortfolioLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="paperDesk">
      <div className="paperSite">
        <div className="paperNoise" aria-hidden="true" />
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </div>
    </div>
  )
}
