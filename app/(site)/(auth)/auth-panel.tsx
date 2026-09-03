import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"
import { brand } from "@/lib/brand"
import { cn } from "@/lib/utils"

import { continueWithGitHub, resumeSession } from "./actions"
import { ContinueWithGitHub } from "./github-button"
import { readSession } from "./auth"

/** Everything the callback route or an action can report back in `?error=`. */
const MESSAGES: Record<string, string> = {
  unconfigured: "Accounts are not switched on for this deployment yet.",
  denied: "GitHub did not hand back an authorisation, so nothing was created.",
  "stale-request": "That sign-in attempt sat too long and expired. Start it again.",
  "exchange-failed": "GitHub approved the sign-in but the handshake was refused. Try again.",
  unreachable: "The auth service did not answer. Try again in a moment.",
  "no-code": "The provider came back without a code. Start the sign-in again.",
  "session-ended": "Your session has ended. Continue with GitHub to start a new one.",
}

function Notice({ children, tone = "muted" }: { children: React.ReactNode; tone?: "muted" | "warn" }) {
  return (
    <p
      aria-live="polite"
      className={cn(
        "mt-6 rounded-lg border px-3.5 py-3 text-[13px] leading-relaxed",
        tone === "warn"
          ? "border-destructive/30 bg-destructive/5 text-foreground"
          : "border-border bg-secondary text-muted-foreground",
      )}
    >
      {children}
    </p>
  )
}

/**
 * The single sign-in surface behind both /login and /signup.
 *
 * There is one provider and therefore one button: with GitHub OAuth the account
 * is created by the first successful round trip, so a separate sign-up form
 * would have nothing to submit and no password worth holding.
 */
export async function AuthPanel({
  mode,
  next,
  error,
  signedOut,
}: {
  mode: "login" | "signup"
  next: string | null
  error: string | null
  signedOut?: boolean
}) {
  const session = await readSession()
  const isSignup = mode === "signup"
  const message = error ? (MESSAGES[error] ?? MESSAGES.unreachable) : null

  return (
    <div className="w-full max-w-sm">
      <h1 className="text-2xl font-semibold tracking-tight">
        {isSignup ? `Join ${brand.name}` : "Welcome back"}
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {isSignup
          ? "Your GitHub account is the account. There is nothing else to fill in."
          : "One button, no password. Sign in to reach your saved list."}
      </p>

      {session.status === "unconfigured" ? (
        <>
          <Notice>
            Accounts are not switched on yet — this deployment has no auth keys, so there is no
            sign-in to offer and nothing was sent anywhere. Every piece in the catalogue installs
            without an account.
          </Notice>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/community/templates" className={buttonVariants()}>
              Browse templates
            </Link>
            <Link
              href="/community/animations"
              className={cn(buttonVariants({ variant: "outline" }))}
            >
              Browse animations
            </Link>
          </div>
        </>
      ) : (
        <>
          <form action={continueWithGitHub} className="mt-7">
            {next && <input type="hidden" name="next" value={next} />}
            <ContinueWithGitHub label="Continue with GitHub" />
          </form>

          {session.status === "expired" && (
            <form action={resumeSession} className="mt-3">
              <input type="hidden" name="next" value={next ?? "/bookmarks"} />
              <button
                type="submit"
                className={cn(buttonVariants({ variant: "outline", size: "sm" }), "w-full")}
              >
                Resume the session I already had
              </button>
            </form>
          )}

          {message && <Notice tone="warn">{message}</Notice>}

          {!message && signedOut && <Notice>You are signed out. Nothing was deleted.</Notice>}

          {!message && !signedOut && session.status === "unreachable" && (
            <Notice tone="warn">
              Auth is configured but the service did not answer just now. The button still works —
              it may just need a second attempt.
            </Notice>
          )}

          <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
            {isSignup
              ? "First time through, this creates the account. "
              : "New here? The same button creates the account. "}
            Either way you agree to the{" "}
            <Link href="/terms" className="underline decoration-border underline-offset-4">
              terms
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline decoration-border underline-offset-4">
              privacy notice
            </Link>
            . No password is asked for, so none is stored.
          </p>
        </>
      )}
    </div>
  )
}
