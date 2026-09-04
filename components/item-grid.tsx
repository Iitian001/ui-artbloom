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
        <ItemCard key={item.name} item={item} height={height ?? 240} />
      ))}
    </div>
  )
}
