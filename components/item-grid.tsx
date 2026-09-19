import { ItemCard } from "@/components/item-card"
import type { RegistryItem } from "@/lib/registry"
import { cn } from "@/lib/utils"

export function ItemGrid({
  items,
  className,
  height,
  emptyMessage = "Nothing here yet.",
}: {
  items: RegistryItem[]
  className?: string
  height?: number
  emptyMessage?: string
}) {
  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border py-20 text-center">
        <p className="text-sm text-muted-foreground">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
        className,
      )}
    >
      {items.map((item) => (
        // No blanket fallback height: when a caller doesn't force one, the card
        // sizes itself per kind (`frameHeight` in `ItemCard`) — blocks to their
        // measured content, components and animations to their authored
        // `previewHeight` — so the grid varies with content instead of flattening
        // a command palette and a breadcrumb to the same 240px box.
        <ItemCard key={item.name} item={item} height={height} />
      ))}
    </div>
  )
}
