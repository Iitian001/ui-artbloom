"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BookmarkIcon } from "lucide-react"

import { useSaves } from "@/components/saves-provider"
import { cn } from "@/lib/utils"

/**
 * The bookmark the landing page has always promised.
 *
 * `/api/saves`, `lib/analytics/saves.ts`, the `saves` table with its four RLS
 * policies, the whole GitHub sign-in and the `/bookmarks` page were all shipped and
 * working — with nothing anywhere on the site that could create a save. So
 * `/bookmarks` could only ever be empty, and the copy on the landing page ("the
 * bookmark on any card keeps it") described a control that did not exist. This is
 * that control.
 *
 * Every state it can be in is a state the API actually returns; see
 * `components/saves-provider.tsx` for where each one comes from. It renders nothing
 * at all on a deployment with no Supabase keys, rather than a button that would 503.
 */
export function SaveButton({
  name,
  title,
  variant = "icon",
  className,
}: {
  name: string
  /** For the accessible name, so a screen reader hears which item this is. */
  title: string
  variant?: "icon" | "wide"
  className?: string
}) {
  const { status, has, busy, toggle } = useSaves()
  const pathname = usePathname()

  // Nothing to offer: no account system here, or the list could not be read and a
  // button that might silently fail is worse than no button.
  if (status === "off" || status === "unavailable") return null

  const wide = variant === "wide"

  const shell = wide
    ? "flex shrink-0 items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-[13px] font-medium"
    : "flex size-6 shrink-0 items-center justify-center rounded-md"

  if (status === "loading") {
    return (
      <span aria-hidden className={cn(shell, "text-muted-foreground/40", className)}>
        <BookmarkIcon className="size-3.5" />
        {wide && "Save"}
      </span>
    )
  }

  if (status === "signed-out") {
    return (
      <Link
        href={`/login?next=${encodeURIComponent(pathname)}`}
        aria-label={`Sign in to save ${title}`}
        className={cn(
          shell,
          "text-muted-foreground transition-colors hover:text-foreground",
          wide && "hover:border-foreground/25 hover:bg-secondary/50",
          !wide && "hover:bg-accent",
          className,
        )}
      >
        <BookmarkIcon className="size-3.5" />
        {wide && "Save"}
      </Link>
    )
  }

  const saved = has(name)
  const pending = busy(name)

  return (
    <button
      type="button"
      onClick={() => toggle(name)}
      disabled={pending}
      aria-pressed={saved}
      aria-label={saved ? `Remove ${title} from your bookmarks` : `Save ${title} to your bookmarks`}
      className={cn(
        shell,
        "cursor-pointer transition-colors disabled:cursor-progress",
        saved ? "text-foreground" : "text-muted-foreground hover:text-foreground",
        wide ? "hover:border-foreground/25 hover:bg-secondary/50" : "hover:bg-accent",
        className,
      )}
    >
      <BookmarkIcon className={cn("size-3.5", saved && "fill-current")} />
      {wide && (saved ? "Saved" : "Save")}
    </button>
  )
}
