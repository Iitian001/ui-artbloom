import type { Metadata } from "next"
import { redirect } from "next/navigation"

import { queryValue, readSession, safePath } from "../auth"
import { AuthPanel } from "../auth-panel"
import { pageMeta } from "@/lib/seo"

// `index: false`, like /login — and for the same reason recorded there.
export const metadata: Metadata = pageMeta({
  title: "Sign up",
  description: "Your GitHub account is the account. No password, no card.",
  path: "/signup",
  index: false,
})

type Search = Promise<Record<string, string | string[] | undefined>>

/**
 * /signup is kept as its own route because the header, the pricing CTA and the
 * closing CTA all link to it — but with GitHub as the only provider there is no
 * second form to fill in, so it renders the same panel with sign-up wording.
 * The old password fields are gone rather than disabled: a form that cannot
 * create an account is worse than no form.
 */
export default async function SignupPage({ searchParams }: { searchParams: Search }) {
  const query = await searchParams
  const next = safePath(queryValue(query.next))

  const session = await readSession()
  if (session.status === "signed-in") redirect(next ?? "/bookmarks")

  return (
    <AuthPanel mode="signup" next={next} error={queryValue(query.error)} />
  )
}
