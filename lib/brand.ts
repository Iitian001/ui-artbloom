import brandJson from "@/brand.json"

/**
 * Every user-visible product string resolves through here. The npm name and the
 * domain are the two things most likely to change late, so nothing else in the
 * codebase is allowed to hardcode them — change brand.json and the whole site,
 * the registry URLs and the CLI copy follow.
 */
export type Brand = {
  name: string
  shortName: string
  wordmark: string
  legalEntity: string
  domain: string
  origin: string
  npmPackage: string
  tagline: string
  description: string
  email: string
  /**
   * Both handles are optional. `x.com/uiartbloom` and `github.com/uiartbloom`
   * are unclaimed, and a footer link that 404s is worse than no link, so the
   * footer renders only the keys that are actually present.
   */
  social: { x?: string; github?: string }
}

export const brand = brandJson as Brand

/** Absolute origin for registry links — respects the deploy URL at build time. */
export const siteOrigin =
  process.env.NEXT_PUBLIC_SITE_ORIGIN ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : brand.origin)

/** The command a user copies off an item page. */
export function installCommand(
  itemName: string,
  runner: "npx" | "pnpm" | "yarn" | "bun" = "npx",
) {
  const target = `${brand.npmPackage} add ${itemName}`
  switch (runner) {
    case "pnpm":
      return `pnpm dlx ${target}`
    case "yarn":
      return `yarn dlx ${target}`
    case "bun":
      return `bunx ${target}`
    default:
      return `npx ${target}`
  }
}

/** The raw registry URL, usable with any shadcn-compatible CLI. */
export function registryUrl(itemName: string) {
  return `${siteOrigin}/r/${itemName}.json`
}
