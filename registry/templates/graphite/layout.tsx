import type { Metadata } from "next"

import { SiteFooter } from "./components/site-footer"
import { SiteHeader } from "./components/site-header"
import { hero, profile } from "./data/content"

import "./graphite.css"

export const metadata: Metadata = {
  title: {
    default: `${profile.name} — ${profile.role}`,
    template: `%s — ${profile.name}`,
  },
  description: hero.lede,
}

/**
 * The template shell.
 *
 * A nested layout, so it renders no `<html>` or `<body>` — the app's root layout
 * owns those. `.grSite` is the single wrapper every style in `graphite.css`
 * hangs off, which is what keeps this sheet from touching anything else.
 *
 * The `<noscript>` block matters: scroll reveals start at `opacity: 0` in CSS so
 * they cannot flash in before hydration, and the hand-drawn marks start
 * un-inked. Without JavaScript the observer never runs, so this turns them all
 * on for that reader instead of showing an empty, unmarked page.
 */
export default function GraphiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grSite" id="top">
      <noscript>
        <style
          dangerouslySetInnerHTML={{
            __html:
              ".grReveal{opacity:1;transform:none}.grStroke{stroke-dashoffset:0}",
          }}
        />
      </noscript>
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
    </div>
  )
}
