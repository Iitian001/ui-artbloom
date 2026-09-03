"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Command } from "cmdk"
import { SearchIcon } from "lucide-react"

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { CATEGORY_GROUPS, KIND_LABEL } from "@/lib/categories"
import { itemHref } from "@/lib/hrefs"
import { ITEMS, categoryCount } from "@/lib/registry"
import { cn, formatCount } from "@/lib/utils"

export function CommandMenu() {
  const router = useRouter()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        setOpen((value) => !value)
      }
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [])

  function go(href: string) {
    setOpen(false)
    router.push(href)
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "flex h-8 cursor-pointer items-center gap-2 rounded-lg border border-border bg-secondary/60 pr-1.5 pl-2.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
          "w-8 justify-center sm:w-auto sm:min-w-56 sm:justify-start",
        )}
      >
        <SearchIcon className="size-3.5 shrink-0" />
        <span className="hidden sm:inline">Search</span>
        <kbd className="ml-auto hidden rounded border border-border bg-background px-1.5 font-mono text-[10px] sm:inline">
          ⌘K
        </kbd>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          showClose={false}
          className="max-w-xl gap-0 overflow-hidden p-0 sm:max-w-2xl"
        >
          <DialogTitle className="sr-only">Search the library</DialogTitle>
          <Command
            loop
            className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:tracking-wide [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group-heading]]:uppercase"
          >
            <div className="flex items-center gap-2.5 border-b border-border px-4">
              <SearchIcon className="size-4 shrink-0 text-muted-foreground" />
              <Command.Input
                autoFocus
                placeholder="Search templates, animations, components…"
                className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
            </div>

            <Command.List className="max-h-[22rem] overflow-y-auto overscroll-contain p-2">
              <Command.Empty className="py-10 text-center text-sm text-muted-foreground">
                Nothing matches that yet.
              </Command.Empty>

              <Command.Group heading="Items">
                {ITEMS.map((item) => (
                  <Command.Item
                    key={item.name}
                    value={`${item.title} ${item.name} ${item.categories.join(" ")}`}
                    onSelect={() => go(itemHref(item))}
                    className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm data-[selected=true]:bg-accent"
                  >
                    <span className="truncate font-medium">{item.title}</span>
                    <span className="shrink-0 text-[11px] text-muted-foreground">
                      {KIND_LABEL[item.kind]}
                    </span>
                    <span className="ml-auto shrink-0 font-mono text-[11px] text-muted-foreground tabular-nums">
                      {formatCount(item.installs)}
                    </span>
                  </Command.Item>
                ))}
              </Command.Group>

              {CATEGORY_GROUPS.map((group) => {
                const populated = group.categories.filter(
                  (c) => categoryCount(group.kind, c.slug) > 0,
                )
                if (populated.length === 0) return null
                return (
                  <Command.Group key={group.kind} heading={`${group.label} categories`}>
                    {populated.map((category) => (
                      <Command.Item
                        key={`${group.kind}-${category.slug}`}
                        value={`${category.label} ${group.label}`}
                        onSelect={() => go(`/community/${group.kind}/s/${category.slug}`)}
                        className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm data-[selected=true]:bg-accent"
                      >
                        <span className="truncate">{category.label}</span>
                        <span className="ml-auto shrink-0 font-mono text-[11px] text-muted-foreground tabular-nums">
                          {categoryCount(group.kind, category.slug)}
                        </span>
                      </Command.Item>
                    ))}
                  </Command.Group>
                )
              })}
            </Command.List>
          </Command>
        </DialogContent>
      </Dialog>
    </>
  )
}
