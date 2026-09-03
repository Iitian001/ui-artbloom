"use client"

import { useState } from "react"
import Link from "next/link"
import { LoaderCircleIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { brand } from "@/lib/brand"
import { cn } from "@/lib/utils"

/** lucide dropped brand marks in v1, so both providers carry their own path. */
const PROVIDERS = [
  {
    label: "Continue with GitHub",
    path: "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12",
  },
  {
    label: "Continue with Google",
    path: "M12 11v2.6h6.2c-.25 1.6-1.86 4.7-6.2 4.7A6.3 6.3 0 0 1 12 5.7c1.98 0 3.3.84 4.06 1.57l2-1.93A8.7 8.7 0 0 0 12 3a9 9 0 1 0 0 18c5.2 0 8.63-3.65 8.63-8.8 0-.72-.08-1.2-.18-1.7z",
  },
] as const

/**
 * The sign-in / sign-up form.
 *
 * There is no auth backend yet, so this submits nowhere on purpose — no fetch,
 * no endpoint, nothing that could look like it stored a credential. It reports
 * that plainly instead of failing silently.
 */
export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const [state, setState] = useState<"idle" | "pending" | "unavailable">("idle")
  const isSignup = mode === "signup"

  function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    setState("pending")
    setTimeout(() => setState("unavailable"), 450)
  }

  return (
    <div className="w-full max-w-sm">
      <h1 className="text-2xl font-semibold tracking-tight">
        {isSignup ? `Join ${brand.name}` : "Welcome back"}
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {isSignup
          ? "Two copies a day, free. No card."
          : "Sign in to reach your lists and install history."}
      </p>

      <div className="mt-7 grid gap-2">
        {PROVIDERS.map(({ label, path }) => (
          <Button
            key={label}
            type="button"
            variant="outline"
            className="w-full justify-center"
            onClick={() => setState("unavailable")}
          >
            <svg viewBox="0 0 24 24" className="size-4" aria-hidden>
              <path fill="currentColor" d={path} />
            </svg>
            {label}
          </Button>
        ))}
      </div>

      <div className="my-6 flex items-center gap-3">
        <span className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted-foreground">or</span>
        <span className="h-px flex-1 bg-border" />
      </div>

      <form onSubmit={onSubmit} className="grid gap-3">
        <label className="grid gap-1.5">
          <span className="text-[13px] font-medium">Email</span>
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            placeholder="you@studio.com"
            className="h-10 rounded-lg border border-border bg-background px-3 text-sm outline-none placeholder:text-muted-foreground/70 focus-visible:border-foreground/30 focus-visible:ring-[3px] focus-visible:ring-ring/25"
          />
        </label>

        <label className="grid gap-1.5">
          <span className="text-[13px] font-medium">Password</span>
          <input
            type="password"
            name="password"
            required
            minLength={8}
            autoComplete={isSignup ? "new-password" : "current-password"}
            placeholder="At least 8 characters"
            className="h-10 rounded-lg border border-border bg-background px-3 text-sm outline-none placeholder:text-muted-foreground/70 focus-visible:border-foreground/30 focus-visible:ring-[3px] focus-visible:ring-ring/25"
          />
        </label>

        <Button type="submit" className="mt-1 w-full" disabled={state === "pending"}>
          {state === "pending" && <LoaderCircleIcon className="size-4 animate-spin" />}
          {isSignup ? "Create account" : "Sign in"}
        </Button>
      </form>

      <p
        aria-live="polite"
        className={cn(
          "mt-3 text-xs",
          state === "unavailable" ? "text-muted-foreground" : "sr-only",
        )}
      >
        {state === "unavailable"
          ? "Accounts are not switched on yet — nothing was sent or saved. Everything in the catalogue is browsable and installable without one."
          : ""}
      </p>

      <p className="mt-6 text-sm text-muted-foreground">
        {isSignup ? "Already have an account? " : "New here? "}
        <Link
          href={isSignup ? "/login" : "/signup"}
          className="text-foreground underline decoration-border underline-offset-4 hover:decoration-foreground"
        >
          {isSignup ? "Sign in" : "Create one"}
        </Link>
      </p>

      {isSignup && (
        <p className="mt-4 text-xs text-muted-foreground">
          By creating an account you agree to the{" "}
          <Link href="/terms" className="underline decoration-border underline-offset-4">
            terms
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="underline decoration-border underline-offset-4">
            privacy notice
          </Link>
          .
        </p>
      )}
    </div>
  )
}
