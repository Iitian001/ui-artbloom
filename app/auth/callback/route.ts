import { redirect } from "next/navigation"
import type { NextRequest } from "next/server"

import { completeGitHubSignIn, safePath } from "@/app/(site)/(auth)/auth"

/**
 * Where Supabase sends the browser back after GitHub.
 *
 * This is the only place the one-time code is spent. It has to be a Route
 * Handler rather than a page because the exchange writes the session cookies,
 * and cookies cannot be set while a Server Component renders.
 *
 * Every failure ends at /login with a reason in the query string — a blank page
 * or a raw provider error is not an outcome anyone can act on. `redirect()` is
 * called outside any try block, as it signals by throwing.
 */
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams

  // Only a same-origin path survives `safePath`, so `next` cannot be turned
  // into an open redirect by whoever crafted the link to GitHub.
  const next = safePath(params.get("next")) ?? "/bookmarks"
  const back = (reason: string) =>
    `/login?error=${encodeURIComponent(reason)}&next=${encodeURIComponent(next)}`

  // The provider (or Supabase) refused. `error_description` is deliberately not
  // echoed into the URL: it is provider-worded and not always safe to display.
  if (params.get("error") ?? params.get("error_code")) redirect(back("denied"))

  const code = params.get("code")
  if (!code) redirect(back("no-code"))

  const result = await completeGitHubSignIn(code)
  if (!result.ok) redirect(back(result.reason))

  redirect(next)
}
