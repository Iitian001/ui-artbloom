import type { Metadata } from "next"
import { redirect } from "next/navigation"

import { queryValue, readSession, safePath } from "../auth"
import { AuthPanel } from "../auth-panel"
import { pageMeta } from "@/lib/seo"

// `index: false`: a sign-in form is not a search result. See `app/robots.ts` for
// why it is noindexed here rather than disallowed there.
export const metadata: Metadata = pageMeta({
  title: "Sign in",
  description: "Continue with GitHub to reach your saved list.",
  path: "/login",
  index: false,
})

/** Query shape, inlined to match how the rest of `app/` types its pages. */
type Search = Promise<Record<string, string | string[] | undefined>>

export default async function LoginPage({ searchParams }: { searchParams: Search }) {
  const query = await searchParams
  const next = safePath(queryValue(query.next))

  // Already signed in: there is nothing on this page to do.
  const session = await readSession()
  if (session.status === "signed-in") redirect(next ?? "/bookmarks")

  return (
    <AuthPanel
      mode="login"
      next={next}
      error={queryValue(query.error)}
      signedOut={queryValue(query["signed-out"]) === "1"}
    />
  )
}
