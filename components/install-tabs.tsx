"use client"

import { useState } from "react"

import { CopyButton } from "@/components/copy-button"
import { installCommand } from "@/lib/brand"
import { cn } from "@/lib/utils"

const RUNNERS = ["npx", "pnpm", "yarn", "bun"] as const
type Runner = (typeof RUNNERS)[number]

export function InstallTabs({
  itemName,
  className,
}: {
  itemName: string
  className?: string
}) {
  const [runner, setRunner] = useState<Runner>("npx")
  const command = installCommand(itemName, runner)

  return (
    <div className={cn("overflow-hidden rounded-xl border border-border bg-subtle", className)}>
      <div
        role="tablist"
        aria-label="Package runner"
        className="flex items-center gap-1 border-b border-border px-2"
      >
        {RUNNERS.map((value) => (
          <button
            key={value}
            role="tab"
            aria-selected={runner === value}
            type="button"
            onClick={() => setRunner(value)}
            className={cn(
              "relative cursor-pointer px-2.5 py-2 font-mono text-xs transition-colors",
              runner === value
                ? "text-foreground after:absolute after:inset-x-2 after:-bottom-px after:h-px after:bg-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {value}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3 px-3.5 py-3">
        <code className="min-w-0 flex-1 overflow-x-auto font-mono text-[13px] whitespace-nowrap">
          {command}
        </code>
        <CopyButton value={command} label="Copy install command" />
      </div>
    </div>
  )
}
