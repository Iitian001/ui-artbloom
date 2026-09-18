import type { Metadata } from "next"

import { SiteFooter } from "./components/site-footer"
import { SiteHeader } from "./components/site-header"
import { profile } from "./data/content"

import "./daylight.css"

export const metadata: Metadata = {
  title: {
    default: `${profile.name} ${profile.surname} — ${profile.role}`,
    template: `%s — ${profile.name} ${profile.surname}`,
  },
  description: `Portfolio of ${profile.name} ${profile.surname}, a ${profile.role.toLowerCase()} based in ${profile.location}.`,
}

/**
 * The template shell.
 *
 * A nested layout, so it renders no `<html>` or `<body>` — the app's root
 * layout owns those. `.dlSite` is the single wrapper every style in
 * `daylight.css` hangs off, which is what keeps this sheet from touching
 * anything else in the app.
 *
 * The `<noscript>` block matters: scroll reveals start at `opacity: 0` in CSS
 * so they cannot flash in before hydration, which means without JavaScript they
 * would never appear at all. This turns them on for that reader instead of
 * showing them an empty page.
 */
export default function DaylightLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="dlSite">
      <noscript>
        <style
          dangerouslySetInnerHTML={{
            __html: ".dlReveal{opacity:1;transform:none}",
          }}
        />
      </noscript>
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
    </div>
  )
}
