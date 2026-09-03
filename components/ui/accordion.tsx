"use client"

import type { ComponentProps } from "react"
import { Accordion as AccordionPrimitive } from "radix-ui"
import { PlusIcon } from "lucide-react"

import { cn } from "@/lib/utils"

export function Accordion(props: ComponentProps<typeof AccordionPrimitive.Root>) {
  return <AccordionPrimitive.Root data-slot="accordion" {...props} />
}

export function AccordionItem({
  className,
  ...props
}: ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn("border-b border-border last:border-b-0", className)}
      {...props}
    />
  )
}

export function AccordionTrigger({
  className,
  children,
  ...props
}: ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "group flex flex-1 cursor-pointer items-start justify-between gap-4 py-5 text-left text-base font-medium transition-colors hover:text-muted-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none",
          className,
        )}
        {...props}
      >
        {children}
        <PlusIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-45" />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

export function AccordionContent({
  className,
  children,
  ...props
}: ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
      {...props}
    >
      <div className={cn("pb-5 pr-10 text-[15px] leading-relaxed text-muted-foreground", className)}>
        {children}
      </div>
    </AccordionPrimitive.Content>
  )
}
