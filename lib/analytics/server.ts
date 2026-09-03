import "server-only"

import { publicSupabaseReady, restEndpoint, SUPABASE_ANON_KEY } from "./env"
import { restFetch, type RestRequest, type RestResult } from "./rest"

/**
 * The privileged Supabase client. Holds the service role key, which **bypasses
 * row level security entirely** — every policy in `supabase/schema.sql` is
 * invisible to it. Treat any code path that reaches this module as if it were
 * `postgres` at the psql prompt.
 *
 * HOW "NEVER IMPORTED INTO A CLIENT COMPONENT" IS ENFORCED — two independent
 * mechanisms, either of which is sufficient:
 *
 *  1. `import "server-only"` on line 1. Next aliases the `server-only` specifier
 *     to a module that throws when it is pulled into the client compiler
 *     (`server-only$` → `next/dist/compiled/server-only/empty`, see
 *     `node_modules/next/dist/build/create-compiler-aliases.js`). A client
 *     component that imports this file, at any depth, fails the build with a
 *     pointer to the offending import instead of shipping.
 *
 *  2. The key is read from `SUPABASE_SECRET_KEY` / `SUPABASE_SERVICE_ROLE_KEY`,
 *     neither of which has a `NEXT_PUBLIC_` prefix. Next only inlines
 *     `NEXT_PUBLIC_*` into browser bundles, so even if mechanism 1 were removed,
 *     the browser would receive `undefined` here and every call would return
 *     `reason: "unconfigured"` rather than a working key.
 *
 * The rule this file cannot enforce: do not re-export anything from here through
 * a barrel that a client component also imports. There is deliberately no
 * `lib/analytics/index.ts` for that reason — import the specific module you need.
 *
 * TWO NAMES, ONE VALUE, same reason as the anon key in `env.ts`: Supabase's newer
 * `sb_secret_…` key is what a project created today offers, `service_role` is the
 * legacy JWT, and both are accepted. `SUPABASE_SECRET_KEY` is read first because
 * that is the name already in this project's `.env.local`.
 */
const SERVICE_ROLE_KEY =
  process.env.SUPABASE_SECRET_KEY?.trim() ||
  process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ||
  undefined

/** True when a privileged write can actually be attempted. */
export const serviceRoleReady = Boolean(publicSupabaseReady && SERVICE_ROLE_KEY)

/**
 * A PostgREST call as the service role.
 *
 * `path` is a PostgREST path such as `items?select=name,installs` or
 * `rpc/increment_install`. Returns `reason: "unconfigured"` — never throws —
 * when the project URL or the service key is missing.
 */
export function serviceRest<T>(
  path: string,
  options: Omit<RestRequest, "url" | "apiKey" | "accessToken"> = {},
): Promise<RestResult<T>> {
  return restFetch<T>({
    ...options,
    url: restEndpoint(path),
    apiKey: SERVICE_ROLE_KEY,
  })
}

/**
 * A PostgREST call with the anon key and no user — the same privileges a browser
 * would have. Used for the public counter reads, which `items_public_read` allows
 * and which therefore have no business carrying the service role key.
 */
export function publicRest<T>(
  path: string,
  options: Omit<RestRequest, "url" | "apiKey" | "accessToken"> = {},
): Promise<RestResult<T>> {
  return restFetch<T>({
    ...options,
    url: restEndpoint(path),
    apiKey: SUPABASE_ANON_KEY,
  })
}

/**
 * A PostgREST call as a signed-in user: anon key as the project identifier, the
 * user's access token as the bearer, so RLS decides what the request can see.
 *
 * This is what the saves endpoints use. Doing it with the service role instead
 * would mean our own `user_id` filter was the only thing separating one user's
 * library from another's; this way `saves_select_own` in the schema is, and a bug
 * in this codebase cannot leak somebody else's rows.
 */
export function userRest<T>(
  accessToken: string,
  path: string,
  options: Omit<RestRequest, "url" | "apiKey" | "accessToken"> = {},
): Promise<RestResult<T>> {
  return restFetch<T>({
    ...options,
    url: restEndpoint(path),
    apiKey: SUPABASE_ANON_KEY,
    accessToken,
  })
}
