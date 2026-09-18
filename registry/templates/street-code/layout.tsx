import type { Metadata } from "next"

import { SiteFooter } from "./components/site-footer"
import { SiteHeader } from "./components/site-header"
import { brand, hero } from "./data/content"

import "./street-code.css"

export const metadata: Metadata = {
  title: `${brand.name} (${brand.tag}) — ${brand.role}`,
  description: hero.lede,
}

/**
 * The template shell.
 *
 * A nested layout, so it renders no `<html>` or `<body>` — the app's root layout
 * owns those. `.scSite` is the single wrapper every rule in `street-code.css`
 * hangs off, which is what keeps this sheet from touching anything else in the
 * app. The grain overlay is a `::before` on this wrapper, so it too is contained.
 *
 * The `<noscript>` block matters: scroll reveals and the drawn-in doodles start
 * hidden in CSS so they cannot flash in before hydration, which means without
 * JavaScript they would never appear. This turns them on for that reader and
 * stops the marquee, rather than showing an empty, half-drawn page.
 */
export default function StreetCodeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="scSite">
      <noscript>
        <style
          dangerouslySetInnerHTML={{
            __html:
              ".scReveal{opacity:1;transform:none}.scMarqueeTrack{animation:none}.scDraw path{stroke-dashoffset:0}",
          }}
        />
      </noscript>
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
    </div>
  )
}
