"use server"

import { redirect } from "next/navigation"

import { endSession, githubAuthorizeUrl, refreshStoredSession, safePath } from "./auth"

/**
 * The whole of sign-in and sign-up. With GitHub as the only provider there is
 * no second thing to create: the first successful round trip is the account.
 */
export async function continueWithGitHub(formData: FormData) {
  const raw = formData.get("next")
  const next = safePath(typeof raw === "string" ? raw : null)

  const url = await githubAuthorizeUrl(next)
  if (!url) redirect("/login?error=unconfigured")

  redirect(url)
}

/** Spend the refresh token so an hour-old tab does not need a provider trip. */
export async function resumeSession(formData: FormData) {
  const raw = formData.get("next")
  const next = safePath(typeof raw === "string" ? raw : null) ?? "/bookmarks"

  const resumed = await refreshStoredSession()
  if (!resumed) redirect(`/login?error=session-ended&next=${encodeURIComponent(next)}`)

  redirect(next)
}

export async function signOut() {
  await endSession()
  redirect("/login?signed-out=1")
}
