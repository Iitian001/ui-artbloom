import { Marquee } from "@/registry/animations/marquee"
import { NumberTicker } from "@/registry/animations/number-ticker"
import { totalInstalls } from "@/lib/registry"

/**
 * PLACEHOLDER LOGOS — replace with real customers before launch.
 *
 * These are invented studio names on purpose. Dropping real company wordmarks
 * in here would claim usage that has not happened, so the slot is built and the
 * content is left obviously fake.
 */
const TEAMS = [
  "Northwind",
  "Meridian",
  "Halcyon",
  "Atlas Type",
  "Fieldnote",
  "Verdant",
  "Lumen Labs",
  "Cassava",
]

const STUDIOS = [
  "Studio Kilo",
  "Oyster",
  "Paper Crane",
  "Tenfold",
  "Bright Angle",
  "Nine Volt",
  "Harborline",
  "Slow Press",
]

function Wordmark({ name }: { name: string }) {
  return (
    <span className="flex items-center gap-2.5 text-lg font-medium tracking-tight text-muted-foreground/80">
      <svg viewBox="0 0 20 20" aria-hidden className="size-4 shrink-0 fill-current opacity-60">
        <circle cx="10" cy="10" r="9" />
      </svg>
      {name}
    </span>
  )
}

export function SocialProof() {
  const installs = totalInstalls()

  return (
    <section className="border-b border-border py-20">
      <div className="container-page text-center">
        <h2 className="mx-auto max-w-2xl text-balance text-3xl font-semibold tracking-tighter sm:text-4xl">
          <NumberTicker value={installs} /> components installed by{" "}
          <em className="font-serif font-normal italic">builders</em>
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-pretty text-muted-foreground">
          From solo makers shipping a weekend idea to product teams replacing a design system.
        </p>
      </div>

      <div className="mt-14 flex flex-col gap-6">
        <Marquee duration={42} gap="4rem">
          {TEAMS.map((name) => (
            <Wordmark key={name} name={name} />
          ))}
        </Marquee>
        <Marquee duration={52} gap="4rem" reverse>
          {STUDIOS.map((name) => (
            <Wordmark key={name} name={name} />
          ))}
        </Marquee>
      </div>
    </section>
  )
}
