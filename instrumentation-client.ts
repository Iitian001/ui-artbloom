import * as Sentry from "@sentry/nextjs"

/*
 * Browser-side error monitoring — the client half of `instrumentation.ts`.
 *
 * This file runs after the HTML loads but before React hydrates. We read the
 * public DSN and initialise Sentry only if it is set; with no DSN the SDK never
 * initialises and nothing leaves the browser, which is the default.
 *
 * Same shape as the server side and for the same reasons: `tracesSampleRate: 0`
 * means errors only, never a report on an ordinary page view, and
 * `sendDefaultPii: false` keeps the visitor's IP off the report. We do not add
 * the Replay integration, so browsing is not recorded — the privacy notice says
 * as much.
 *
 * `onRouterTransitionStart` lets Sentry mark App Router navigations; it is a
 * no-op until a DSN turns the SDK on.
 */
const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN

if (dsn) {
  Sentry.init({
    dsn,
    tracesSampleRate: 0,
    sendDefaultPii: false,
  })
}

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart
