import type { Metadata, Viewport } from "next"
import { Inter, Instrument_Serif, JetBrains_Mono } from "next/font/google"

import { MobileTabBar } from "@/components/mobile-tab-bar"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { ThemeProvider } from "@/components/theme-provider"
import { TooltipProvider } from "@/components/ui/tooltip"
import { brand, siteOrigin } from "@/lib/brand"

import "../globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["italic", "normal"],
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
  openGraph: {
    type: "website",
    siteName: brand.name,
    title: `${brand.name} — ${brand.tagline}`,
    description: brand.description,
  },
  twitter: { card: "summary_large_image" },
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
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
