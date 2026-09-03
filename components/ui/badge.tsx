import type { ComponentProps } from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center justify-center gap-1 whitespace-nowrap rounded-full border px-2 py-0.5 text-[11px] font-medium leading-none transition-colors [&>svg]:size-3",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground",
        secondary: "border-border bg-secondary text-secondary-foreground",
        outline: "border-border text-muted-foreground",
        new: "border-transparent bg-emerald-500/12 text-emerald-600 dark:text-emerald-400",
        pro: "border-transparent bg-amber-500/12 text-amber-600 dark:text-amber-400",
      },
    },
    defaultVariants: { variant: "default" },
  },
)

export type BadgeProps = ComponentProps<"span"> & VariantProps<typeof badgeVariants>

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span data-slot="badge" className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { badgeVariants }
