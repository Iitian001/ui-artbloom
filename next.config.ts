import path from "node:path"
import { fileURLToPath } from "node:url"
import type { NextConfig } from "next"

const here = path.dirname(fileURLToPath(import.meta.url))

const nextConfig: NextConfig = {
  // Without this, Turbopack walks up looking for a lockfile and lands on the
  // home directory, which it would then try to treat as the workspace root.
  turbopack: { root: here },
  // No `images.remotePatterns` on purpose. Nothing in the repo imports
  // `next/image` — every asset is served by a template's own route or straight
  // out of `public/` — so a pattern list would authorize nothing we use. The
  // entry that used to sit here was `{ protocol: "https", hostname: "**" }`,
  // which let anyone hand `/_next/image` an arbitrary https URL and have this
  // deployment fetch, re-encode and cache it: an open image proxy on our
  // bandwidth. With the block gone the default empty list refuses every remote
  // URL while local optimization still works. If a remote image is ever needed,
  // list that one host — never a wildcard.
  async headers() {
    return [
      {
        // The registry is a public read-only API consumed by the `ui.artbloom`
        // CLI from a user's machine, so it has to be CORS-open.
        source: "/r/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET, OPTIONS" },
          { key: "Cache-Control", value: "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400" },
        ],
      },
    ]
  },
}

export default nextConfig
