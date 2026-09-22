"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { HomeIcon, LayersIcon, PaletteIcon, PlugZapIcon } from "lucide-react"

import { cn } from "@/lib/utils"

const TABS = [
  { label: "Home", href: "/", Icon: HomeIcon },
  { label: "Browse", href: "/community/templates", Icon: LayersIcon },
  { label: "Themes", href: "/themes", Icon: PaletteIcon },
  { label: "MCP", href: "/docs/mcp", Icon: PlugZapIcon },
]

/** Fixed bottom navigation, phones only. */
export function MobileTabBar() {
  const pathname = usePathname()

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/90 backdrop-blur-xl md:hidden">
      <ul className="grid grid-cols-4">
        {TABS.map(({ label, href, Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href)
          return (
            <li key={label}>
              <Link
                href={href}
                className={cn(
                  "flex flex-col items-center gap-0.5 py-2.5 text-[10px] font-medium transition-colors",
                  active ? "text-foreground" : "text-muted-foreground",
                )}
              >
                <Icon className="size-[18px]" />
                {label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
