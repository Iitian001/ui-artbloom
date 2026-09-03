import Link from "next/link"

import { profileHref } from "@/lib/hrefs"
import type { Author } from "@/lib/registry"
import { cn, monogram } from "@/lib/utils"

export function AuthorAvatar({
  author,
  className,
}: {
  author: Author
  className?: string
}) {
  return (
    <span
      className={cn(
        "flex size-6 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-secondary text-[9px] font-semibold tracking-wide text-muted-foreground select-none",
        className,
      )}
      aria-hidden
    >
      {author.avatar ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={author.avatar} alt="" className="size-full object-cover" />
      ) : author.org ? null : (
        monogram(author.name)
      )}
    </span>
  )
}

export function AuthorLink({
  author,
  className,
  showAvatar = true,
}: {
  author: Author
  className?: string
  showAvatar?: boolean
}) {
  return (
    <Link
      href={profileHref(author.handle)}
      className={cn(
        "flex min-w-0 items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground",
        className,
      )}
    >
      {showAvatar && <AuthorAvatar author={author} />}
      <span className="truncate">@{author.handle}</span>
    </Link>
  )
}
