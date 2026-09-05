import type { Metadata } from "next"
import { Inter, Instrument_Serif, JetBrains_Mono } from "next/font/google"

import { ThemeProvider } from "@/components/theme-provider"

import "../globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" })
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
      <body className={`${inter.variable} ${instrument.variable} ${jetbrains.variable} font-sans`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
