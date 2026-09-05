import type { Metadata } from "next"
import type { ReactNode } from "react"
import Link from "next/link"
import { BookmarkIcon, CloudOffIcon, LogOutIcon, TriangleAlertIcon } from "lucide-react"

import { signOut } from "@/app/(site)/(auth)/actions"
import { readSession, restSelect } from "@/app/(site)/(auth)/auth"
import { ItemCard } from "@/components/item-card"
import { PageHeader } from "@/components/page-shell"
import { buttonVariants } from "@/components/ui/button"
import { getItem, newest, type RegistryItem } from "@/lib/registry"
import { pageMeta } from "@/lib/seo"
import { cn } from "@/lib/utils"

/*
 * `index: false`, because this page's content is one person's saved list — it is
 * different for every visitor and empty for a crawler, which has no session.
 * `app/robots.ts` deliberately does not disallow it: a crawler has to fetch the
 * page to read this.
 */
export const metadata: Metadata = pageMeta({
  title: "Bookmarks",
  description: "Everything you saved, in one place.",
  path: "/bookmarks",
  index: false,
})

/**
 * One row of `public.saves` (see `supabase/schema.sql`): the table stores the
 * registry name, not a copy of the item, so a save survives the item being
 * edited. Fields are `unknown` because they arrive from the network.
 */
type SaveRow = { item_name?: unknown; created_at?: unknown }

/** Newest first. The limit is a page's worth, not a claim about the maximum. */
function savesQuery(userId: string) {
  // `user_id=eq.` is redundant — the `saves_select_own` policy in
  // supabase/schema.sql already limits the result to `auth.uid()`. It is here as
  // a second lock, the same way `listSaves()` in lib/analytics/saves.ts writes
  // it: if RLS were ever disabled on the table by accident, the filter still
  // scopes the read. The id comes from the auth service, not from the request.
  return `saves?select=item_name,created_at&user_id=eq.${encodeURIComponent(userId)}&order=created_at.desc&limit=200`
}

function Panel({
  icon,
  title,
  children,
  actions,
  tone = "muted",
}: {
  icon: ReactNode
  title: string
  children: ReactNode
  actions?: ReactNode
  tone?: "muted" | "warn"
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center rounded-2xl border border-dashed px-6 py-20 text-center",
        tone === "warn" ? "border-destructive/40" : "border-border",
      )}
    >
      <span className="flex size-11 items-center justify-center rounded-full border border-border bg-secondary">
        {icon}
      </span>
      <p className="mt-5 text-lg font-medium">{title}</p>
      <p className="mt-2 max-w-sm text-pretty text-sm text-muted-foreground">{children}</p>
      {actions && <div className="mt-6 flex flex-wrap justify-center gap-3">{actions}</div>}
    </div>
  )
}

function BrowseLinks() {
  return (
    <>
      <Link href="/community/templates" className={buttonVariants()}>
        Browse templates
      </Link>
      <Link href="/community/animations" className={cn(buttonVariants({ variant: "outline" }))}>
        Browse animations
      </Link>
    </>
  )
}

/**
 * Something to look at on a page that is otherwise one empty panel.
 *
 * This was "Most installed", rendering `popular(8)`. `popular()` sorted by
 * `item.installs`, which was `0` on every item — so the heading named a ranking
 * and the grid showed the first eight items in file order. Newest is a real
 * ordering, and the subtitle now says exactly what the sort is.
 */
function RecentlyAdded() {
  return (
    <section className="mt-14">
      <h2 className="text-lg font-semibold tracking-tight">Recently added</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        The newest eight pieces in the catalogue — not a chart, and not personalised.
      </p>
      <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {newest(8).map((item) => (
          <ItemCard key={item.name} item={item} />
        ))}
      </div>
    </section>
  )
}

function SignOutButton() {
  return (
    <form action={signOut} className="mt-6">
      <button
        type="submit"
        className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
      >
        <LogOutIcon className="size-4" aria-hidden />
        Sign out
      </button>
    </form>
  )
}

const SIGN_IN_HREF = "/login?next=%2Fbookmarks"

/**
 * The four ways to have no list, each said plainly. None of them is "nothing
 * saved yet" — that is a claim about the account, and in three of these cases
 * the account has not been read at all.
 */
function NoList({ status }: { status: "unconfigured" | "signed-out" | "expired" | "unreachable" }) {
  if (status === "unconfigured") {
    return (
      <Panel
        icon={<BookmarkIcon className="size-5 text-muted-foreground" aria-hidden />}
        title="Accounts are not switched on yet"
        actions={<BrowseLinks />}
      >
        This deployment has no auth keys, so there is no account to hang a list on and nothing
        here is being stored anywhere. Every piece in the catalogue installs without one.
      </Panel>
    )
  }

  if (status === "unreachable") {
    return (
      <Panel
        tone="warn"
        icon={<CloudOffIcon className="size-5 text-muted-foreground" aria-hidden />}
        title="Could not reach the account service"
        actions={
          <Link href="/bookmarks" className={buttonVariants()}>
            Try again
          </Link>
        }
      >
        Your saved list lives on the server, so nothing has been lost — this page just could not
        read it. Reloading is usually enough.
      </Panel>
    )
  }

  return (
    <Panel
      icon={<BookmarkIcon className="size-5 text-muted-foreground" aria-hidden />}
      title={status === "expired" ? "Your session has ended" : "Sign in to see your list"}
      actions={
        <>
          <Link href={SIGN_IN_HREF} className={buttonVariants()}>
            Continue with GitHub
          </Link>
          <Link href="/community/templates" className={cn(buttonVariants({ variant: "outline" }))}>
            Browse templates
          </Link>
        </>
      }
    >
      {status === "expired"
        ? "Signing in again brings the same list back — saves are stored on the account, not in this browser."
        : "Bookmarks are stored on your account, so they follow you between machines. Signing in takes one click and no password."}
    </Panel>
  )
}

export default async function BookmarksPage() {
  const session = await readSession()

  // Not signed in for any of four different reasons. The suggestions still
  // render, because a page with one panel on it reads as broken.
  if (session.status !== "signed-in") {
    return (
      <>
        <PageHeader eyebrow="Bookmarks" title="Saved" />
        <div className="container-page pb-20">
          <NoList status={session.status} />
          <RecentlyAdded />
        </div>
      </>
    )
  }

  // The user's own token goes on this request, so row level security decides
  // what comes back. `null` means the read did not happen; `[]` means the
  // account genuinely has no saves — two different things to say.
  const rows = await restSelect<SaveRow>(savesQuery(session.user.id))
  const names = (rows ?? [])
    .map((row) => (typeof row.item_name === "string" ? row.item_name : null))
    .filter((name): name is string => name !== null)
  const saved = names
    .map((name) => getItem(name))
    .filter((item): item is RegistryItem => item !== undefined)
  /** Saved names the catalogue no longer carries. Counted rather than hidden. */
  const retired = names.length - saved.length
  const who = session.user.handle ?? session.user.name ?? session.user.email

  return (
    <>
      <PageHeader eyebrow="Bookmarks" title="Saved" lede={who ? `Signed in as ${who}.` : undefined}>
        <SignOutButton />
      </PageHeader>

      <div className="container-page pb-20">
        {rows === null ? (
          <Panel
            tone="warn"
            icon={<TriangleAlertIcon className="size-5 text-muted-foreground" aria-hidden />}
            title="Could not read your saved list"
            actions={
              <Link href="/bookmarks" className={buttonVariants()}>
                Try again
              </Link>
            }
          >
            You are signed in, but the list did not come back. Nothing has been deleted — this is a
            failed read, not an empty account.
          </Panel>
        ) : saved.length === 0 ? (
          <>
            <Panel
              icon={<BookmarkIcon className="size-5 text-muted-foreground" aria-hidden />}
              title={retired > 0 ? "Nothing left to show" : "Nothing saved yet"}
              actions={<BrowseLinks />}
            >
              {retired > 0
                ? `Your ${retired === 1 ? "one save is" : `${retired} saves are`} no longer in the catalogue, so there is nothing to open.`
                : "Save anything from the catalogue and it lands here, on your account rather than in this browser."}
            </Panel>
            <RecentlyAdded />
          </>
        ) : (
          <>
            <p className="text-sm text-muted-foreground">
              {saved.length === 1 ? "1 saved item" : `${saved.length} saved items`}
              {retired > 0 &&
                `, and ${retired === 1 ? "one that is" : `${retired} that are`} no longer in the catalogue`}
              .
            </p>
            <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {saved.map((item) => (
                <ItemCard key={item.name} item={item} />
              ))}
            </div>
          </>
        )}
      </div>
    </>
  )
}
