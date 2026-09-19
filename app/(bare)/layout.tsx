import type { Metadata } from "next"
import { Inter, Instrument_Serif, JetBrains_Mono, Fraunces, Geist, Geist_Mono } from "next/font/google"

import { ThemeProvider } from "@/components/theme-provider"

import "../globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" })
// Modern grotesk for the atelier product landings (lumen, anvil, on), exposed as
// a CSS variable so only the templates that opt in reference it. Matches the
// measured reference bar (Geist, medium-weight display).
const geist = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" })
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", display: "swap" })
// Italic only, for the reason spelled out in app/(site)/layout.tsx: nothing in
// the tree sets `font-serif` without `italic` beside it.
const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["italic"],
  variable: "--font-instrument",
  display: "swap",
})
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains", display: "swap" })
// Characterful high-contrast serif for the cinematic templates (borealis and on),
// exposed as a CSS variable so only the templates that opt in reference it.
const fraunces = Fraunces({
  subsets: ["latin"],
  axes: ["opsz", "SOFT", "WONK"],
  variable: "--font-fraunces",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Preview",
  robots: { index: false, follow: false },
}

/**
 * Chrome-free root layout. Template previews render here so the iframe shows the
 * template exactly as a user would deploy it — no header, no footer, no padding.
 */
export default function BareLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${instrument.variable} ${jetbrains.variable} ${fraunces.variable} ${geist.variable} ${geistMono.variable} font-sans`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
