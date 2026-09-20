"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronDownIcon } from "lucide-react"

import { signOut } from "@/app/(site)/(auth)/actions"
import { CategoryPanel } from "@/components/category-panel"
import { CommandMenu } from "@/components/command-menu"
import { Logo } from "@/components/logo"
import { useSaves } from "@/components/saves-provider"
import { ThemeToggle } from "@/components/theme-toggle"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const NAV = [
  { label: "Templates", href: "/community/templates" },
  { label: "Animations", href: "/community/animations" },
  { label: "Themes", href: "/themes" },
]

export function SiteHeader() {
  const pathname = usePathname()
  const [panelOpen, setPanelOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  // Close on route change, Escape, or a click anywhere outside the panel.
  useEffect(() => setPanelOpen(false), [pathname])

  useEffect(() => {
    if (!panelOpen) return
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setPanelOpen(false)
    }
    function onClick(event: MouseEvent) {
      if (!panelRef.current?.contains(event.target as Node)) setPanelOpen(false)
    }
    document.addEventListener("keydown", onKey)
    document.addEventListener("mousedown", onClick)
    return () => {
      document.removeEventListener("keydown", onKey)
      document.removeEventListener("mousedown", onClick)
    }
  }, [panelOpen])

  // "/" focuses browse, matching the hint next to the trigger.
  useEffect(() => {
    function onSlash(event: KeyboardEvent) {
      if (event.key !== "/" || event.metaKey || event.ctrlKey) return
      const target = event.target as HTMLElement | null
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return
      if (target?.isContentEditable) return
      event.preventDefault()
      setPanelOpen((open) => !open)
    }
    document.addEventListener("keydown", onSlash)
    return () => document.removeEventListener("keydown", onSlash)
  }, [])

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="container-page flex h-14 items-center gap-3">
        <Logo />

        <div ref={panelRef} className="hidden md:block">
          <button
            type="button"
            onClick={() => setPanelOpen((open) => !open)}
            aria-expanded={panelOpen}
            className={cn(
              "ml-2 flex h-8 cursor-pointer items-center gap-1.5 rounded-lg px-2.5 text-sm font-medium transition-colors",
              panelOpen ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground",
            )}
          >
            Browse
            <kbd className="rounded border border-border bg-secondary px-1 font-mono text-[10px] text-muted-foreground">
              /
            </kbd>
            <ChevronDownIcon
              className={cn("size-3.5 transition-transform", panelOpen && "rotate-180")}
            />
          </button>

          {panelOpen && <CategoryPanel onNavigate={() => setPanelOpen(false)} />}
        </div>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV.map((link) => {
            const active = pathname === link.href || pathname.startsWith(`${link.href}/`)
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-lg px-2.5 py-1.5 text-sm font-medium transition-colors",
                  active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <CommandMenu />
          <ThemeToggle className="hidden sm:flex" />
          <AccountControls />
        </div>
      </div>
    </header>
  )
}

/**
 * The sign-in corner, driven by the one session read the page already makes
 * (`SavesProvider`). Signed in, it becomes the account: avatar/handle to the
 * saved list, and a real sign-out. Signed out — or while auth is off, loading or
 * unreachable — it stays the two links it always was, so nothing regresses on a
 * deployment with no accounts.
 *
 * `loading` holds a fixed-width placeholder instead of flashing "Log in" for the
 * moment before the session settles, matching how the save buttons wait on the
 * same fetch.
 */
function AccountControls() {
  const { status, user } = useSaves()

  if (status === "ready" && user) {
    const label = user.handle ? `@${user.handle}` : (user.name ?? "Account")
    const initial = (user.handle ?? user.name ?? user.email ?? "?").charAt(0).toUpperCase()

    return (
      <div className="flex items-center gap-1.5">
        <Link
          href="/bookmarks"
          className="flex items-center gap-2 rounded-lg py-1 pr-1 pl-1 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          title={label}
        >
          {user.avatar ? (
            // Remote GitHub avatar — a plain img so no remote-image config or
            // optimizer round trip is needed for one 28px picture.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.avatar}
              alt=""
              width={28}
              height={28}
              className="size-7 rounded-full border border-border object-cover"
            />
          ) : (
            <span
              aria-hidden="true"
              className="flex size-7 items-center justify-center rounded-full border border-border bg-secondary text-xs font-semibold text-muted-foreground"
            >
              {initial}
            </span>
          )}
          <span className="hidden max-w-32 truncate sm:inline">{label}</span>
        </Link>
        <form action={signOut}>
          <button
            type="submit"
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
          >
            Sign out
          </button>
        </form>
      </div>
    )
  }

  // The session read is still in flight — hold the space rather than flash a
  // "Log in" that is about to become an avatar.
  if (status === "loading") {
    return <div aria-hidden="true" className="h-8 w-20 sm:w-28" />
  }

  return (
    <>
      <Link
        href="/login"
        className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "hidden sm:inline-flex")}
      >
        Log in
      </Link>
      <Link href="/signup" className={buttonVariants({ size: "sm" })}>
        Sign up
      </Link>
    </>
  )
}
