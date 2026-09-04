import type { Metadata } from "next"

import { SiteFooter } from "./components/site-footer"
import { SiteHeader } from "./components/site-header"
import { brand, hero } from "./data/product"

import "./monolith-launch.css"

export const metadata: Metadata = {
  title: {
    default: `${brand.product} — ${brand.descriptor}`,
    template: `%s — ${brand.name}`,
  },
  description: hero.lede,
}

/**
 * The template shell.
 *
 * A nested layout, so it renders no `<html>` or `<body>` — the app's root layout
 * owns those. `.monoSite` is the single wrapper every style in
 * `monolith-launch.css` hangs off, which is what keeps this sheet from touching
 * anything else in the app.
 *
 * The `<noscript>` block matters: scroll reveals start at `opacity: 0` in CSS so
 * they cannot flash in before hydration, which means without JavaScript they
 * would never appear at all. This turns them on for that reader instead of
 * showing them an empty page.
 */
export default function MonolithLaunchLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="monoSite">
      <noscript>
        <style
          dangerouslySetInnerHTML={{
            __html: ".monoReveal{opacity:1;transform:none}.monoTickerTrack{animation:none}",
          }}
        />
      </noscript>
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
    </div>
  )
}
