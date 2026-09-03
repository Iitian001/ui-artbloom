import "server-only"

/**
 * Address hashing and the per-instance rate limiter.
 *
 * The raw IP of a person installing a component is never sent to Supabase and
 * never written anywhere. What the dedup ledger stores is a salted SHA-256 of it,
 * computed here, truncated to 128 bits. The salt stays in the server environment,
 * so even a full dump of `install_events` does not let anyone test "did
 * 203.0.113.7 install this" without also having the salt.
 *
 * `INSTALL_TRACK_SALT` is the name already in this project's `.env.local`;
 * `INSTALL_IP_SALT` is read as well so either spelling works. Neither has a
 * `NEXT_PUBLIC_` prefix, and it matters: a salt in the browser bundle is a salt
 * everyone has, which makes the hashes reversible over the address space again.
 */

const CONFIGURED_SALT =
  process.env.INSTALL_TRACK_SALT?.trim() || process.env.INSTALL_IP_SALT?.trim() || undefined

function hex(bytes: Uint8Array): string {
  let out = ""
  for (const byte of bytes) out += byte.toString(16).padStart(2, "0")
  return out
}

/**
 * Used when `INSTALL_IP_SALT` is unset, so the site still works before any
 * configuration happens. A random per-process salt is the right failure mode: an
 * unsalted or hard-coded hash would be trivially reversible over the IPv4 space,
 * which is worse than weak dedup.
 */
const FALLBACK_SALT = (() => {
  const bytes = new Uint8Array(32)
  crypto.getRandomValues(bytes)
  return hex(bytes)
})()

let warnedAboutSalt = false

function salt(): string {
  if (CONFIGURED_SALT) return CONFIGURED_SALT
  if (!warnedAboutSalt) {
    warnedAboutSalt = true
    console.warn(
      "[analytics] INSTALL_TRACK_SALT is not set, falling back to a per-process salt. " +
        "Per-day install dedup will reset on every deploy and is not shared between " +
        "serverless instances until you set it.",
    )
  }
  return FALLBACK_SALT
}

/**
 * The caller's address, as reported by whatever proxy is in front of us.
 *
 * `NextRequest.ip` and `.geo` were removed in Next 15 (see the version history in
 * `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/next-request.md`),
 * so this reads headers or nothing.
 *
 * Trust level: none of these headers is trustworthy on its own — they are only as
 * honest as the proxy that set them. `x-forwarded-for` is a comma-separated chain
 * that a client can prepend to, so it is consulted last; `x-real-ip` and
 * `cf-connecting-ip` are single values written by the edge. Whichever we use, a
 * caller that can set the header can pick its own dedup bucket. That is a stated
 * limitation of the install counter, not something this function can fix.
 */
export function clientIp(headers: Headers): string | undefined {
  const single = headers.get("x-real-ip")?.trim() || headers.get("cf-connecting-ip")?.trim()
  if (single) return single
  const first = headers.get("x-forwarded-for")?.split(",")[0]?.trim()
  return first || undefined
}

/** Salted SHA-256, hex, first 128 bits. */
export async function hashIp(ip: string): Promise<string> {
  const data = new TextEncoder().encode(`${salt()}:${ip}`)
  const digest = await crypto.subtle.digest("SHA-256", data)
  return hex(new Uint8Array(digest)).slice(0, 32)
}

/**
 * The dedup key for a request.
 *
 * When no address header is present at all, every such request shares one bucket
 * — so the first one that day counts and the rest do not. Under-counting is the
 * correct way to fail here; the alternative (a fresh bucket per request) would
 * turn an absent header into an uncapped write primitive.
 */
export async function clientIpHash(headers: Headers): Promise<string> {
  return hashIp(clientIp(headers) ?? "no-forwarded-address")
}

/* ── rate limit ───────────────────────────────────────────────────────────────
 *
 * A fixed window in process memory. Be clear-eyed about what that is worth:
 * every serverless instance keeps its own Map and instances scale out under load,
 * so the real ceiling is `limit × number of live instances`, and it resets
 * whenever an instance is recycled. It stops an accidental retry loop and a lazy
 * `while true; do curl; done`. It is not a defence against anyone determined.
 *
 * The durable limit is in the database: the primary key on
 * `install_events (item_name, ip_hash, day)` caps one hashed address at one
 * counted install per item per day no matter how many instances are running.
 */

type Window = { count: number; resetAt: number }

const windows = new Map<string, Window>()
const MAX_TRACKED_KEYS = 10_000

function prune(now: number): void {
  for (const [key, window] of windows) {
    if (window.resetAt <= now) windows.delete(key)
  }
}

export type RateLimitVerdict = { allowed: boolean; retryAfterSeconds: number }

export function rateLimit(key: string, limit: number, windowMs: number): RateLimitVerdict {
  const now = Date.now()
  const existing = windows.get(key)

  if (!existing || existing.resetAt <= now) {
    if (windows.size >= MAX_TRACKED_KEYS) prune(now)
    windows.set(key, { count: 1, resetAt: now + windowMs })
    return { allowed: true, retryAfterSeconds: 0 }
  }

  existing.count += 1
  if (existing.count > limit) {
    return { allowed: false, retryAfterSeconds: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)) }
  }
  return { allowed: true, retryAfterSeconds: 0 }
}
