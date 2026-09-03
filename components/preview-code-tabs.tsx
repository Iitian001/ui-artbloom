"use client"

import { type ReactNode, useState } from "react"
import { CodeIcon, EyeIcon } from "lucide-react"

import { cn } from "@/lib/utils"

export type PreviewCodeTabsProps = {
  preview: ReactNode
  code: ReactNode
  /** Shown to the right of the tabs — install command, filename, links. */
  toolbar?: ReactNode
  defaultTab?: "preview" | "code"
  className?: string
}

/**
 * Preview/code switcher.
 *
 * Both panels are rendered on the server and only toggled here, so the code
 * panel needs no client-side highlighter and the preview keeps its state when
 * you flip back to it.
 */
export function PreviewCodeTabs({
  preview,
  code,
  toolbar,
  defaultTab = "preview",
  className,
}: PreviewCodeTabsProps) {
  const [tab, setTab] = useState(defaultTab)

  return (
    <div className={cn("min-w-0", className)}>
      <div className="mb-3 flex items-center gap-3">
        <div
          role="tablist"
          aria-label="Preview or code"
          className="flex items-center gap-1 rounded-lg bg-secondary p-0.5"
        >
          {(
            [
              { value: "preview", label: "Preview", Icon: EyeIcon },
              { value: "code", label: "Code", Icon: CodeIcon },
            ] as const
          ).map(({ value, label, Icon }) => (
            <button
              key={value}
              type="button"
              role="tab"
              aria-selected={tab === value}
              onClick={() => setTab(value)}
              className={cn(
                "flex cursor-pointer items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[13px] font-medium transition-colors",
                tab === value
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="size-3.5" />
              {label}
            </button>
          ))}
        </div>

        {toolbar && <div className="ml-auto flex min-w-0 items-center gap-2">{toolbar}</div>}
      </div>

      {/* Both stay mounted: hiding rather than unmounting keeps the preview's
          animation state and avoids a re-mount flash on every toggle. */}
      <div className={tab === "preview" ? "block" : "hidden"}>{preview}</div>
      <div className={tab === "code" ? "block" : "hidden"}>{code}</div>
    </div>
  )
}
