"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react"

import { cn } from "@/lib/utils"

const OPTIONS = [
  { value: "light", label: "Light", Icon: SunIcon },
  { value: "dark", label: "Dark", Icon: MoonIcon },
  { value: "system", label: "System", Icon: MonitorIcon },
] as const

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // `theme` is unknown until hydration, so render the shell first to avoid a
  // server/client mismatch on the active pill.
  useEffect(() => setMounted(true), [])

  return (
    <div
      className={cn(
        "flex items-center gap-0.5 rounded-full border border-border bg-secondary/60 p-0.5",
        className,
      )}
    >
      {OPTIONS.map(({ value, label, Icon }) => (
        <button
          key={value}
          type="button"
          aria-label={label}
          aria-pressed={mounted ? theme === value : undefined}
          onClick={() => setTheme(value)}
          className={cn(
            "flex size-6 cursor-pointer items-center justify-center rounded-full transition-colors",
            mounted && theme === value
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <Icon className="size-3.5" />
        </button>
      ))}
    </div>
  )
}
