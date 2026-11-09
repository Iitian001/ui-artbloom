"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronDownIcon, PlugZapIcon } from "lucide-react"

import { CategoryPanel } from "@/components/category-panel"
import { CommandMenu } from "@/components/command-menu"
import { Logo } from "@/components/logo"
import { ThemeToggle } from "@/components/theme-toggle"
import { brand } from "@/lib/brand"
import { cn } from "@/lib/utils"

const NAV: { label: string; href: string; wide?: boolean; feature?: boolean }[] = [
  { label: "Templates", href: "/community/templates" },
  { label: "Components", href: "/community/components" },
  { label: "Blocks", href: "/community/blocks" },
  { label: "Animations", href: "/community/animations" },
  { label: "Themes", href: "/themes", wide: true },
  { label: "MCP", href: "/docs/mcp", feature: true },
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

        <nav className="hidden items-center gap-0.5 lg:flex">
          {NAV.map((link) => {
            const active = pathname === link.href || pathname.startsWith(`${link.href}/`)
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium transition-colors",
                  link.wide && "hidden xl:inline-flex",
                  link.feature
                    ? active
                      ? "text-brand"
                      : "text-brand/80 hover:text-brand"
                    : active
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                )}
              >
                {link.feature && <PlugZapIcon className="size-3.5" />}
                {link.label}
              </Link>
            )
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <CommandMenu />
          {brand.social.github ? (
            <a
              href={brand.social.github}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={`${brand.name} on GitHub`}
              className="hidden size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground sm:flex"
            >
              {/* The GitHub mark, inline: lucide no longer ships brand icons. */}
              <svg viewBox="0 0 16 16" aria-hidden="true" className="size-4" fill="currentColor">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
              </svg>
            </a>
          ) : null}
          <ThemeToggle className="hidden sm:flex" />
        </div>
      </div>
    </header>
  )
}

