"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronDownIcon } from "lucide-react"

import { CategoryPanel } from "@/components/category-panel"
import { CommandMenu } from "@/components/command-menu"
import { Logo } from "@/components/logo"
import { ThemeToggle } from "@/components/theme-toggle"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const NAV = [
  { label: "Templates", href: "/community/templates" },
  { label: "Animations", href: "/community/animations" },
  { label: "Components", href: "/community/components" },
  { label: "Themes", href: "/themes" },
  { label: "Pricing", href: "/pricing" },
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
          <Link
            href="/login"
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "hidden sm:inline-flex")}
          >
            Log in
          </Link>
          <Link href="/signup" className={buttonVariants({ size: "sm" })}>
            Sign up
          </Link>
        </div>
      </div>
    </header>
  )
}
