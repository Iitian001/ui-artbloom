import { request as httpRequest, type IncomingMessage, type RequestOptions } from "node:http"
import { request as httpsRequest } from "node:https"

import type { Manager } from "./apply.js"
import { VERSION } from "./pkg.js"

/**
 * Where the install counter lives, on whatever origin the CLI was pointed at.
 *
 * The registry the user asked for, never a hard-coded host: a fork or a
 * `--registry http://localhost:3000` run reports to its own site, and the
 * default origin only ever hears about installs it actually served. A ping to a
 * host the user did not address is telemetry nobody agreed to.
 */
const ENDPOINT = "/api/track/install"

/** All the time one ping gets before it is abandoned. */
const TIMEOUT_MS = 2000

/**
 * Whether an environment variable is asking for something, rather than merely
 * being present.
 *
 * `CI=false` is a documented way of saying "not CI", and `0` is the spelled-out
 * no of the console-do-not-track convention, so an empty value, `0` and `false`
 * all read as unset. Anything else reads as set — leaning towards sending
 * nothing costs nothing, and leaning the other way cannot be taken back.
 */
function asks(value: string | undefined) {
  const clean = value?.trim().toLowerCase()
  return clean !== undefined && clean !== "" && clean !== "0" && clean !== "false"
}

/**
 * Every reason to send nothing at all.
 *
 * CI is out because a build server reinstalling the same item on every green
 * commit is not a person choosing it, and counting that would only make the
 * number wrong.
 */
function optedOut(telemetry: boolean | undefined) {
  return telemetry === false || asks(process.env.DO_NOT_TRACK) || asks(process.env.CI)
}

/**
 * Post one ping and settle when it is over, however it ended. Never rejects.
 *
 * `node:http` rather than `fetch`, for one measured reason: aborting a `fetch`
 * does not release its socket. `AbortSignal.timeout(2000)` against a blackholed
 * address rejects on time and then holds the event loop for another eight
 * seconds — 2.0s to reject, 10.7s to exit, on Node 24.15.0 — because undici
 * keeps the connecting socket until its own 10s connect timeout, and there is no
 * public API to shorten that. `request.destroy()` drops the handle immediately,
 * so the same address costs 2.0s here and the process leaves on time. An
 * analytics ping is not worth eight seconds of somebody's terminal.
 *
 * The socket stays referenced on purpose. An unreferenced one would let Node
 * exit before the request left the machine, which for a ping sent at the very
 * end of a command means it is never sent at all; the timer below is what bounds
 * the wait instead, and it is unreferenced so it can never extend one.
 */
function post(url: URL, body: string) {
  return new Promise<void>((resolve) => {
    let timer: ReturnType<typeof setTimeout> | undefined
    let settled = false

    const finish = () => {
      if (settled) return
      settled = true
      if (timer) clearTimeout(timer)
      resolve()
    }

    try {
      const options: RequestOptions = {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "content-length": Buffer.byteLength(body),
          // Nothing pooled that could outlive the request, on either end.
          connection: "close",
        },
        agent: false,
      }

      const onResponse = (response: IncomingMessage) => {
        // A body nobody reads holds the socket open. We do not read it.
        response.resume()
        response.on("end", finish)
        response.on("error", finish)
      }

      const request =
        url.protocol === "https:"
          ? httpsRequest(url, options, onResponse)
          : httpRequest(url, options, onResponse)

      // Refused, reset, DNS, TLS — all of it lands here and stops here.
      request.on("error", finish)

      timer = setTimeout(() => {
        request.destroy()
        finish()
      }, TIMEOUT_MS)
      timer.unref()

      request.end(body)
    } catch {
      finish()
    }
  })
}

/**
 * Tell the site an install happened, so the number on an item page is a count of
 * real installs rather than a guess.
 *
 * Three fields go out per item — the install name, this CLI's version, and which
 * package manager the project uses — and that is the whole payload. No path, no
 * cwd, no project name, no username, no hostname, no machine id, no id of any
 * kind: this module never reads the filesystem or the environment beyond the two
 * opt-out variables, so there is nothing else here to leak. `runner` arrives as
 * an argument for the same reason — detecting it is somebody else's job. The
 * request itself reaches the host with your IP address, as every HTTP request
 * does; what that host keeps is documented in its privacy notice, not here.
 *
 * Returns nothing, synchronously, and swallows every failure — offline, DNS,
 * refused, 500, timeout. The install is already finished and on disk by the time
 * this runs, so a counter that cannot be reached must not be able to change how
 * that run ends: there is no error path back to the caller by construction, and
 * a `void` return is one nobody can await, branch on, or let reject by accident.
 */
export function reportInstalls(
  registry: string,
  names: string[],
  runner: Manager,
  telemetry?: boolean,
): void {
  if (optedOut(telemetry) || names.length === 0) return

  let url: URL
  try {
    url = new URL(`${registry}${ENDPOINT}`)
  } catch {
    return
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") return

  for (const name of names) {
    // `post` is written not to reject; an unhandled rejection would take the
    // process down over an analytics ping, so it is caught here as well.
    void post(url, JSON.stringify({ name, version: VERSION, runner })).catch(() => {})
  }
}
