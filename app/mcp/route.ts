import {
  callTool,
  CAPABILITIES,
  instructions,
  LEGACY_DEFAULT,
  LEGACY_VERSIONS,
  RPC,
  SERVER_INFO,
  SUPPORTED_VERSIONS,
  TOOL_NAMES,
  TOOLS,
} from "@/lib/mcp"

/**
 * `/mcp` — the catalogue over the Model Context Protocol, in about 300 lines and
 * with no SDK.
 *
 * It is **dual-era**: it answers both the current revision, `2026-07-28`, which
 * declares its version in per-request `_meta` and has no handshake at all, and the
 * older `initialize` handshake that every shipped client still speaks. That is not
 * hedging — the compatibility matrix in the spec says a legacy client against a
 * modern-only server simply *fails*, with no fall-forward, so a server that
 * answered only the current revision would be a correctness exhibit that nothing
 * could connect to.
 *
 * The pieces of the transport that are easy to get wrong, all in one list:
 *   - No sessions. `Mcp-Session-Id` is neither minted nor echoed; `Last-Event-ID`
 *     is ignored. Both were removed from the transport in this revision.
 *   - No GET stream, so `GET` and `DELETE` are `405`.
 *   - Every response is a single JSON object. SSE is optional and there is nothing
 *     here that streams: a tool call is one catalogue lookup.
 *   - A notification gets `202` and an empty body — never a JSON-RPC result.
 *   - Modern requests must mirror `method` into `Mcp-Method` and `params.name`
 *     into `Mcp-Name`; a mismatch is `400` with `-32020`, not a `200` error body.
 *   - An unknown method is `404` with `-32601`, which is the one status a modern
 *     client reads as "modern server, unknown method" rather than "wrong URL".
 *
 * There is no authentication, deliberately. Every byte this endpoint can return is
 * already public at `/r/<name>.json` and on the site itself; both tools are
 * read-only and take no path, so there is nothing here to authorize. The moment a
 * tool writes anything, or reads anything not already public, that stops being
 * true and `originAllowed` below is where the check belongs.
 */
export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const CORS = {
  /*
   * Open, like `/r/`. `*` and not a reflected origin because there are no
   * credentials to protect and nothing user-specific to leak — which is also why
   * `Allow-Headers` can be `*` rather than a list that would have to be kept in
   * step with `Mcp-Param-*`.
   */
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "*",
  "Access-Control-Expose-Headers": "MCP-Protocol-Version",
} as const

const JSON_HEADERS = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store",
  ...CORS,
} as const

/** `_meta` keys the revision reserves. Prefixed, per the `_meta` naming rules. */
const META_VERSION = "io.modelcontextprotocol/protocolVersion"
const META_SERVER_INFO = "io.modelcontextprotocol/serverInfo"

/** An hour, matching the `s-maxage` on `/r/` — the catalogue changes on deploy. */
const TTL_MS = 3_600_000

type Rpc = {
  jsonrpc?: unknown
  id?: string | number | null
  method?: unknown
  params?: Record<string, unknown>
}

function json(body: unknown, status = 200, extra: Record<string, string> = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...JSON_HEADERS, ...extra },
  })
}

function rpcResult(id: string | number | null, result: Record<string, unknown>) {
  return json({ jsonrpc: "2.0", id, result })
}

function rpcError(
  id: string | number | null,
  code: number,
  message: string,
  status = 200,
  data?: unknown,
) {
  return json(
    {
      jsonrpc: "2.0",
      id,
      error: { code, message, ...(data === undefined ? {} : { data }) },
    },
    status,
  )
}

/**
 * `Mcp-Name` and `Mcp-Param-*` may arrive wrapped as `=?base64?{value}?=` when the
 * value would not survive as a header — non-ASCII, or a newline. Servers **MUST**
 * decode before comparing, so a tool called `get_item` sent encoded still has to
 * match the `name` in the body.
 */
const SENTINEL = /^=\?base64\?([\s\S]*)\?=$/

function headerValue(request: Request, name: string) {
  const raw = request.headers.get(name)
  if (raw === null) return null
  const match = SENTINEL.exec(raw)
  if (!match) return raw
  try {
    return Buffer.from(match[1], "base64").toString("utf8")
  } catch {
    return raw
  }
}

/**
 * The `Origin` hook the spec requires servers to have, answering `true`.
 *
 * The rule exists to stop DNS rebinding: a page on the attacker's site posting to
 * `http://localhost:port/mcp` and driving a local server that holds the user's
 * files or credentials. This server holds neither. It reads a catalogue that is
 * already public, over CORS that is already `*`, so an allowlist here would block
 * browser clients while protecting nothing. Narrow it in the same change that
 * gives a tool the ability to write.
 */
function originAllowed(_origin: string) {
  return true
}

/**
 * This deployment's own origin, used to fetch `/r/<name>.json`. Read from the
 * request rather than `siteOrigin` so a preview build reads its own payloads —
 * `NEXT_PUBLIC_SITE_ORIGIN` names production, and a preview asking production for
 * an item it has just added would get a 404.
 */
function selfOrigin(request: Request) {
  const url = new URL(request.url)
  const forwardedProto = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim()
  const forwardedHost = request.headers.get("x-forwarded-host")?.split(",")[0]?.trim()
  const proto = forwardedProto || url.protocol.replace(":", "")
  const host = forwardedHost || request.headers.get("host") || url.host
  return `${proto}://${host}`
}

/** The version a modern request declares, or `null` for a legacy one. */
function declaredVersion(params: Record<string, unknown> | undefined) {
  const meta = params?._meta
  if (typeof meta !== "object" || meta === null) return null
  const value = (meta as Record<string, unknown>)[META_VERSION]
  return typeof value === "string" ? value : null
}

function unsupported(id: string | number | null, requested: string) {
  return rpcError(id, RPC.UNSUPPORTED_VERSION, "Unsupported protocol version", 400, {
    supported: SUPPORTED_VERSIONS,
    requested,
  })
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin")
  if (origin !== null && !originAllowed(origin)) {
    /* No `id`: the body was never parsed, so there is nothing to correlate to. */
    return json({ jsonrpc: "2.0", error: { code: RPC.INVALID_REQUEST, message: "Origin not allowed" } }, 403)
  }

  let parsed: unknown
  try {
    parsed = await request.json()
  } catch {
    return rpcError(null, RPC.PARSE, "Parse error: the body is not JSON.", 400)
  }

  if (Array.isArray(parsed)) {
    return rpcError(
      null,
      RPC.INVALID_REQUEST,
      "Batching was removed from the transport. Send one JSON-RPC message per POST.",
      400,
    )
  }
  if (typeof parsed !== "object" || parsed === null) {
    return rpcError(null, RPC.INVALID_REQUEST, "Expected a JSON-RPC object.", 400)
  }

  const message = parsed as Rpc
  /* `0` and `""` are valid ids, so this cannot be `message.id ?? null`. */
  const id = message.id === undefined ? null : message.id
  const isNotification = id === null
  const method = typeof message.method === "string" ? message.method : ""
  const params =
    typeof message.params === "object" && message.params !== null && !Array.isArray(message.params)
      ? (message.params as Record<string, unknown>)
      : undefined

  if (!method) {
    return rpcError(id, RPC.INVALID_REQUEST, "`method` is required and must be a string.", 400)
  }

  /*
   * Era is decided by the body, not by us: a request that declares a version in
   * `_meta` is modern and gets held to the modern rules; one that does not is a
   * legacy client and gets the handshake it expects.
   */
  const declared = declaredVersion(params)
  const modern = declared !== null
  const headerVersion = headerValue(request, "mcp-protocol-version")

  /*
   * Version support before header mirroring, on purpose. A client speaking a
   * version we do not know may not know the mirrored-header rule either, and
   * `-32022` carries the list it needs to retry — `-32020` would tell it nothing.
   */
  if (declared !== null && !SUPPORTED_VERSIONS.includes(declared)) {
    return unsupported(id, declared)
  }
  if (
    declared === null &&
    headerVersion !== null &&
    !SUPPORTED_VERSIONS.includes(headerVersion)
  ) {
    return unsupported(id, headerVersion)
  }

  if (modern) {
    if (headerVersion === null || headerVersion !== declared) {
      return rpcError(
        id,
        RPC.HEADER_MISMATCH,
        `MCP-Protocol-Version header ${headerVersion === null ? "is required and must equal" : `("${headerVersion}") must equal`} params._meta["${META_VERSION}"] ("${declared}").`,
        400,
      )
    }

    const headerMethod = headerValue(request, "mcp-method")
    if (headerMethod === null || headerMethod !== method) {
      return rpcError(
        id,
        RPC.HEADER_MISMATCH,
        `Mcp-Method header ${headerMethod === null ? "is required and must equal" : `("${headerMethod}") must equal`} "method" ("${method}").`,
        400,
      )
    }

    if (method === "tools/call") {
      const bodyName = typeof params?.name === "string" ? params.name : ""
      const headerName = headerValue(request, "mcp-name")
      if (headerName === null || headerName !== bodyName) {
        return rpcError(
          id,
          RPC.HEADER_MISMATCH,
          `Mcp-Name header ${headerName === null ? "is required on tools/call and" : `("${headerName}")`} must equal params.name ("${bodyName}").`,
          400,
        )
      }
    }
  }

  /*
   * `202` and an empty body, whatever the notification was. This is checked after
   * header validation so a malformed modern notification still gets told; it is
   * checked before dispatch because a notification must never draw a result, and
   * the only one a client of this server sends is `notifications/initialized`.
   */
  if (isNotification) {
    return new Response(null, { status: 202, headers: CORS })
  }

  /* Caching hints are required on `resultType: "complete"`, so they follow it. */
  const complete = modern
    ? { resultType: "complete" as const, ttlMs: TTL_MS, cacheScope: "public" as const }
    : {}

  if (method === "server/discover") {
    /*
     * Answered in both eras. A modern client sends it with `_meta`; a probe may
     * send it bare, and refusing that would make the server undiscoverable for
     * the sake of a rule that exists to describe well-formed modern requests.
     */
    return rpcResult(id, {
      resultType: "complete",
      supportedVersions: SUPPORTED_VERSIONS,
      capabilities: CAPABILITIES,
      instructions: instructions(),
      ttlMs: TTL_MS,
      cacheScope: "public",
      _meta: { [META_SERVER_INFO]: SERVER_INFO },
    })
  }

  if (method === "initialize") {
    /*
     * Clamped to the legacy list: a client that sends `initialize` at all cannot
     * speak the modern revision, so echoing one back would agree on something it
     * has no code for.
     */
    const requested = typeof params?.protocolVersion === "string" ? params.protocolVersion : ""
    return rpcResult(id, {
      protocolVersion: LEGACY_VERSIONS.includes(requested) ? requested : LEGACY_DEFAULT,
      capabilities: CAPABILITIES,
      serverInfo: SERVER_INFO,
      instructions: instructions(),
    })
  }

  if (method === "ping") return rpcResult(id, {})

  if (method === "tools/list") {
    /* Two tools, so no cursor: `nextCursor` is omitted, which means "that is all". */
    return rpcResult(id, { ...complete, tools: TOOLS })
  }

  if (method === "tools/call") {
    const toolName = typeof params?.name === "string" ? params.name : ""
    if (!TOOL_NAMES.includes(toolName)) {
      /*
       * A protocol error, not a tool error: the call never reached a tool. Tool
       * *execution* failures — an item that does not exist, a category slug that
       * is misspelled — come back as results with `isError`, so the model can read
       * the message and fix the call itself.
       */
      return rpcError(
        id,
        RPC.INVALID_PARAMS,
        `Unknown tool "${toolName}". This server has: ${TOOL_NAMES.join(", ")}.`,
      )
    }

    const raw = params?.arguments
    const args =
      typeof raw === "object" && raw !== null && !Array.isArray(raw)
        ? (raw as Record<string, unknown>)
        : {}

    try {
      const result = await callTool(toolName, args, selfOrigin(request))
      return rpcResult(id, { ...complete, ...result })
    } catch (error) {
      return rpcError(
        id,
        RPC.INTERNAL,
        error instanceof Error ? error.message : "The tool failed.",
      )
    }
  }

  /*
   * `404` for a modern client and `200` for a legacy one, for the same reason in
   * opposite directions. The modern transport specifies `404` for an unknown
   * method, and a modern client reads a `404` whose body is a recognized JSON-RPC
   * error as "modern server, unknown method". A legacy client has no such rule and
   * would read `404` as "wrong URL", then fall back to the deprecated HTTP+SSE
   * transport and fail at its opening GET — so it gets the error in a `200`.
   */
  return rpcError(
    id,
    RPC.METHOD_NOT_FOUND,
    `Unknown method "${method}". This server implements server/discover, initialize, ping, tools/list and tools/call.`,
    modern ? 404 : 200,
  )
}

export function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: { ...CORS, "Access-Control-Max-Age": "86400" },
  })
}

/**
 * The revision removed the GET stream and the DELETE that ended a session, so
 * both are `405` with an `Allow` naming what is left. A client that gets this on
 * GET knows it is talking to a post-session server rather than a broken one.
 */
function notAllowed() {
  return json(
    {
      jsonrpc: "2.0",
      id: null,
      error: {
        code: RPC.INVALID_REQUEST,
        message:
          "This endpoint is POST-only: the transport has no GET stream and no sessions to delete.",
      },
    },
    405,
    { Allow: "POST, OPTIONS" },
  )
}

export function GET() {
  return notAllowed()
}

export function DELETE() {
  return notAllowed()
}
