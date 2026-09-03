import Link from "next/link"

import { InstallTabs } from "@/components/install-tabs"
import { buttonVariants } from "@/components/ui/button"
import { newest } from "@/lib/registry"
import { cn } from "@/lib/utils"

export function ClosingCta() {
  const [latest] = newest(1)

  return (
    <section className="relative overflow-hidden border-b border-border py-28">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-grid opacity-40" />

      <div className="container-page relative flex flex-col items-center text-center">
        <h2 className="max-w-2xl text-balance text-4xl leading-[1.05] font-semibold tracking-tighter sm:text-5xl">
          Made by hand.
          <br />
          <em className="font-serif font-normal italic">Installed by machine.</em>
        </h2>
        <p className="mt-6 max-w-lg text-pretty text-lg text-muted-foreground">
          Browse it like a portfolio, install it like a package.
        </p>

        {latest && <InstallTabs itemName={latest.name} className="mt-9 w-full max-w-md" />}

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link href="/community/templates" className={buttonVariants({ size: "lg" })}>
            Browse templates
          </Link>
          <Link
            href="/signup"
            className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
          >
            Join for free
          </Link>
        </div>
      </div>
    </section>
  )
}
