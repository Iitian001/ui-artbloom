import type { Metadata, Viewport } from "next"
import { Inter, Instrument_Serif, JetBrains_Mono } from "next/font/google"

import { MobileTabBar } from "@/components/mobile-tab-bar"
import { SavesProvider } from "@/components/saves-provider"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { ThemeProvider } from "@/components/theme-provider"
import { TooltipProvider } from "@/components/ui/tooltip"
import { brand, siteOrigin } from "@/lib/brand"
import { siteCard } from "@/lib/seo"

import "../globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

/**
 * Italic only. Every `font-serif` in the tree is an `<em>` that also carries
 * `italic` — grep it — so the upright face was a second file fetched and
 * preloaded on every page to be used by nothing. Add `"normal"` back in the same
 * change as the first upright serif.
 */
const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["italic"],
  variable: "--font-instrument",
  display: "swap",
})

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin),
  title: {
    default: `${brand.name} — ${brand.tagline}`,
    template: `%s | ${brand.name}`,
  },
  description: brand.description,
  /*
   * `images` is spelled out even though `app/opengraph-image.tsx` exists, because
   * that file only contributes to the segment it sits in — `app/` — and this
   * `openGraph` object replaces the one it contributed to. Without this line the
   * home page, the only page in the group that does not build its own metadata
   * through `lib/seo.ts`, is the one page on the site with no card.
   */
  openGraph: {
    type: "website",
    siteName: brand.name,
    title: `${brand.name} — ${brand.tagline}`,
    description: brand.description,
    images: [siteCard],
  },
  twitter: { card: "summary_large_image", images: [siteCard] },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${instrument.variable} ${jetbrains.variable} font-sans`}
      >
        <ThemeProvider>
          <TooltipProvider>
            <SavesProvider>
              <a
                href="#content"
                className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-100 focus:rounded-md focus:bg-foreground focus:px-3 focus:py-2 focus:text-sm focus:text-background"
              >
                Skip to content
              </a>
              <SiteHeader />
              <main id="content" className="pb-16 md:pb-0">
                {children}
              </main>
              <SiteFooter />
              <MobileTabBar />
            </SavesProvider>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
