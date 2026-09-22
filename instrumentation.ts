import * as Sentry from "@sentry/nextjs"

/*
 * Server-side error monitoring — and only when a DSN is configured.
 *
 * `register()` runs once when a server instance boots, before it takes any
 * request. We read the server DSN, falling back to the public one because they
 * are almost always the same value, and initialise Sentry only if a DSN is
 * present. With no DSN the SDK never initialises: no transport opens, nothing is
 * sent, and importing this module is the whole cost. That default — nothing —
 * is what ships unless a deployment sets a key.
 *
 * Init lives here by hand rather than through `withSentryConfig`, so
 * `next.config.ts` and the Turbopack build are untouched. The trade-off is
 * deliberate: source-map upload needs Sentry's build plugin, which we do not
 * wire, so server stack traces point at compiled output, not original source.
 *
 * `tracesSampleRate: 0` keeps this to errors only — no per-request performance
 * transactions — which is what the privacy notice promises: a report is sent
 * when something breaks, never on an ordinary page view. `sendDefaultPii: false`
 * keeps IPs and headers off the report, so it carries no name.
 *
 * The browser half is `instrumentation-client.ts`; the two env names are in
 * `.env.example`. `@sentry/nextjs` resolves to the matching runtime build
 * (node or edge) on its own, so a single `Sentry.init` covers both.
 */
const dsn = process.env.SENTRY_DSN ?? process.env.NEXT_PUBLIC_SENTRY_DSN

export function register() {
  if (!dsn) return

  Sentry.init({
    dsn,
    tracesSampleRate: 0,
    sendDefaultPii: false,
  })
}

export const onRequestError = Sentry.captureRequestError
