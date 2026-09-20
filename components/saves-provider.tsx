"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"

import { publicSupabaseReady } from "@/lib/analytics/env"

/**
 * One read of `/api/saves` per page load, shared by every card on the page.
 *
 * The alternative — a `useEffect` fetch inside each `SaveButton` — would mean 29
 * requests to list the same list on `/community/animations`, each one costing a
 * round trip to the Supabase Auth server to verify the same token (see
 * `getSessionUser`), against a 60-per-minute limit. So the list is fetched once
 * here and the buttons read it out of context.
 *
 * There is no server-rendered seed for it on purpose. Every catalogue page is
 * prerendered at build time and cached publicly; a per-user set baked into that
 * HTML would be one visitor's library served to the next. The buttons therefore
 * start in a `loading` state and settle a moment later, which is the cost of the
 * pages staying static.
 *
 * Nothing here is imported by `lib/analytics/env.ts`'s server side: the only
 * variables that file reads are `NEXT_PUBLIC_`-prefixed, so `publicSupabaseReady`
 * is a build-time boolean in the browser bundle. A deployment with no Supabase
 * keys skips the fetch entirely rather than making a request to be told 503.
 */

type Status =
  /** No account system on this deployment. Nothing to render. */
  | "off"
  /** The list is in flight. */
  | "loading"
  /** Configured, but nobody is signed in. The button becomes a link to /login. */
  | "signed-out"
  /** Signed in, list known. */
  | "ready"
  /** Configured, signed in or not — but the read failed. Nothing to render. */
  | "unavailable"

/**
 * Who is signed in, for the header to greet. Comes back on the same `/api/saves`
 * read as the list — the one place the app spends an Auth-server verification — so
 * the header shows real signed-in state without a second round trip. Null until the
 * list settles, and whenever nobody is signed in.
 */
export type AccountUser = {
  handle: string | null
  name: string | null
  avatar: string | null
  email: string | null
}

type SavesValue = {
  status: Status
  /** True if `name` is in the caller's library. Meaningless unless `ready`. */
  has: (name: string) => boolean
  /** True while a write for `name` is in flight. */
  busy: (name: string) => boolean
  toggle: (name: string) => void
  /** The signed-in visitor, or null. Only meaningful once `status` is `ready`. */
  user: AccountUser | null
}

const FALLBACK: SavesValue = {
  status: "off",
  has: () => false,
  busy: () => false,
  toggle: () => {},
  user: null,
}

const SavesContext = createContext<SavesValue>(FALLBACK)

/**
 * Usable outside the provider, and silent about it.
 *
 * `ItemCard` renders in places that are not under the site layout — the item
 * page's "More like this" rail is, but a template's own `(bare)` space is not, and
 * neither is anything rendered by a demo. Throwing "must be used within a
 * provider" would turn a missing wrapper into a blank page, so the default is a
 * value whose status is `off`, and `SaveButton` renders nothing for it.
 */
export function useSaves() {
  return useContext(SavesContext)
}

function withName(set: Set<string>, name: string, present: boolean) {
  const next = new Set(set)
  if (present) next.add(name)
  else next.delete(name)
  return next
}

export function SavesProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<Status>(publicSupabaseReady ? "loading" : "off")
  const [saved, setSaved] = useState<Set<string>>(() => new Set())
  const [pending, setPending] = useState<Set<string>>(() => new Set())
  const [notice, setNotice] = useState<string | null>(null)
  const [user, setUser] = useState<AccountUser | null>(null)

  /**
   * `saved` as a ref, read by `toggle` instead of the state value.
   *
   * `toggle` is memoised so that a re-render of the provider does not re-render
   * every card; if it closed over `saved` it would need that state in its
   * dependency list, which puts the identity back. The ref is the same data
   * without the dependency.
   */
  const savedRef = useRef(saved)
  savedRef.current = saved

  useEffect(() => {
    if (!publicSupabaseReady) return

    const controller = new AbortController()

    void (async () => {
      try {
        const response = await fetch("/api/saves", {
          headers: { accept: "application/json" },
          signal: controller.signal,
        })

        // Configured but signed out. Not an error — the button turns into a
        // sign-in link, which is the one honest thing it can be.
        if (response.status === 401) {
          setUser(null)
          setStatus("signed-out")
          return
        }
        if (!response.ok) {
          setStatus("unavailable")
          return
        }

        const body: unknown = await response.json()
        const shape = body as { configured?: unknown; saves?: unknown; user?: unknown }

        // A deployment whose keys were removed after this bundle was built.
        if (shape.configured === false) {
          setStatus("off")
          return
        }

        const names = Array.isArray(shape.saves)
          ? shape.saves
              .map((row) => (row as { name?: unknown }).name)
              .filter((name): name is string => typeof name === "string")
          : []

        // The signed-in identity the route attached to this read. Each field is
        // optional (GitHub may not send a display name), so read defensively.
        const raw = (shape.user ?? null) as Record<string, unknown> | null
        const field = (key: string): string | null => {
          const value = raw?.[key]
          return typeof value === "string" && value.length > 0 ? value : null
        }
        setUser(
          raw
            ? {
                handle: field("handle"),
                name: field("name"),
                avatar: field("avatar"),
                email: field("email"),
              }
            : null,
        )

        setSaved(new Set(names))
        setStatus("ready")
      } catch (error) {
        // An aborted fetch is a navigation, not a failure.
        if (controller.signal.aborted) return
        console.warn("[saves] could not read the saved list", error)
        setStatus("unavailable")
      }
    })()

    return () => controller.abort()
  }, [])

  /** Auto-dismiss, so a transient failure does not sit on the page for ever. */
  useEffect(() => {
    if (!notice) return
    const timer = setTimeout(() => setNotice(null), 5000)
    return () => clearTimeout(timer)
  }, [notice])

  const toggle = useCallback((name: string) => {
    setPending((current) => {
      if (current.has(name)) return current
      return withName(current, name, true)
    })

    void (async () => {
      const wasSaved = savedRef.current.has(name)
      // Optimistic: the request is one round trip plus a token verification, and
      // a bookmark that waits half a second to fill in feels broken.
      setSaved((current) => withName(current, name, !wasSaved))

      const revert = () => setSaved((current) => withName(current, name, wasSaved))

      try {
        const response = wasSaved
          ? await fetch(`/api/saves?name=${encodeURIComponent(name)}`, { method: "DELETE" })
          : await fetch("/api/saves", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({ name }),
            })

        if (response.ok) {
          setNotice(null)
          return
        }

        revert()

        if (response.status === 401) {
          // The cookie expired between the list and this click.
          setUser(null)
          setStatus("signed-out")
          setNotice("Your session ended. Sign in again to keep saving.")
        } else if (response.status === 503) {
          setStatus("off")
        } else if (response.status === 429) {
          setNotice("Too many changes at once. Try again in a moment.")
        } else {
          setNotice(wasSaved ? "Could not remove that one." : "Could not save that one.")
        }
      } catch {
        revert()
        setNotice("No connection. Nothing was changed.")
      } finally {
        setPending((current) => withName(current, name, false))
      }
    })()
  }, [])

  const value = useMemo<SavesValue>(
    () => ({
      status,
      has: (name) => saved.has(name),
      busy: (name) => pending.has(name),
      toggle,
      user,
    }),
    [status, saved, pending, toggle, user],
  )

  return (
    <SavesContext.Provider value={value}>
      {children}
      {/*
        One live region for the whole page rather than one per card. A failed
        save is announced once; twenty-nine polite regions would announce the
        same sentence twenty-nine times.
      */}
      <div aria-live="polite" className="sr-only">
        {notice}
      </div>
      {notice && (
        <div className="pointer-events-none fixed inset-x-0 bottom-20 z-100 flex justify-center px-4 md:bottom-6">
          <p className="rounded-full border border-border bg-popover px-4 py-2 text-[13px] shadow-xl">
            {notice}
          </p>
        </div>
      )}
    </SavesContext.Provider>
  )
}
