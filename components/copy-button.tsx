"use client"

import { useState } from "react"
import { CheckIcon, CopyIcon } from "lucide-react"

import { cn } from "@/lib/utils"

export function CopyButton({
  value,
  className,
  label = "Copy",
  variant = "ghost",
}: {
  value: string
  className?: string
  label?: string
  variant?: "ghost" | "solid"
}) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    try {
      await navigator.clipboard.writeText(value)
    } catch {
      // Clipboard can be blocked (insecure origin, denied permission). Fall back
      // to a hidden textarea so the button still does something useful.
      const area = document.createElement("textarea")
      area.value = value
      area.style.position = "fixed"
      area.style.opacity = "0"
      document.body.append(area)
      area.select()
      document.execCommand("copy")
      area.remove()
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 1600)
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={copied ? "Copied" : label}
      className={cn(
        "inline-flex size-7 cursor-pointer items-center justify-center rounded-md transition-colors",
        variant === "ghost"
          ? "text-muted-foreground hover:bg-accent hover:text-foreground"
          : "border border-border bg-secondary text-foreground hover:bg-accent",
        className,
      )}
    >
      {copied ? (
        <CheckIcon className="size-3.5 text-emerald-500" />
      ) : (
        <CopyIcon className="size-3.5" />
      )}
    </button>
  )
}
