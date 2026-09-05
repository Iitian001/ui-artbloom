import { Marquee } from "@/registry/animations/marquee"
import { NumberTicker } from "@/registry/animations/number-ticker"
import { ALL_CATEGORIES, KIND_LABEL } from "@/lib/categories"
import { categoryCount, ITEMS, kindCount } from "@/lib/registry"

/**
 * What is actually in here, counted.
 *
 * This replaces a section called `SocialProof`, which is worth describing because
 * the shape of it is a trap worth not walking back into. It rendered
 * `<NumberTicker value={totalInstalls()} /> components installed by builders` over
 * two marquees of sixteen wordmarks — "Northwind", "Studio Kilo", "Paper Crane" —
 * under a header comment that admitted, in capitals, that they were placeholders to
 * be replaced with real customers before launch.
 *
 * Both halves were false in the same direction. `totalInstalls()` summed an
 * `installs` field that was `0` on all twenty-nine items, so the headline read "0
 * components installed by builders"; and the logo wall claimed adoption by sixteen
 * companies that do not exist. A visitor cannot tell an honest placeholder from a
 * fabricated client list, and the comment explaining the difference ships in the
 * source, not on the page.
 *
 * So: no logos, and every number here is derived from `lib/registry/items.ts` at
 * build time. The marquees now carry the names of the pieces themselves, which is
 * content a browser can act on rather than a claim they have to take on trust. When
 * there are real install counts in `public.items` and real teams using this, both
 * belong here — as separate changes, each with its source.
 */

/** Populated categories across every kind, most populated first. */
function categoryChips() {
  return ALL_CATEGORIES.map((category) => ({
    ...category,
    count: categoryCount(category.kind, category.slug),
  }))
    .filter((category) => category.count > 0)
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))
}

function Chip({ label, detail }: { label: string; detail: string }) {
  return (
    <span className="flex items-baseline gap-2 text-base tracking-tight whitespace-nowrap text-muted-foreground/85">
      {label}
      <span className="font-mono text-[11px] text-muted-foreground/60 tabular-nums">{detail}</span>
    </span>
  )
}

export function CatalogueScale() {
  const templates = kindCount("templates")
  const animations = kindCount("animations")
  const categories = categoryChips()

  return (
    <section className="border-b border-border py-20">
      <div className="container-page text-center">
        <h2 className="mx-auto max-w-2xl text-balance text-3xl font-semibold tracking-tighter sm:text-4xl">
          <NumberTicker value={ITEMS.length} /> pieces, and every one of them{" "}
          <em className="font-serif font-normal italic">running above</em>
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-pretty text-muted-foreground">
          {templates === 1 ? "One template" : `${templates} templates`} and {animations} animations,
          across {categories.length} categories. Every card on this page is the component itself,
          live — not a screenshot of one — and every one installs with a single command.
        </p>
      </div>

      <div className="mt-14 flex flex-col gap-6">
        {/* Real titles, in registry order, so the row is a table of contents. */}
        <Marquee duration={64} gap="3.5rem">
          {ITEMS.map((item) => (
            <Chip key={item.name} label={item.title} detail={KIND_LABEL[item.kind]} />
          ))}
        </Marquee>
        <Marquee duration={48} gap="3.5rem" reverse>
          {categories.map((category) => (
            <Chip
              key={`${category.kind}-${category.slug}`}
              label={category.label}
              detail={String(category.count)}
            />
          ))}
        </Marquee>
      </div>
    </section>
  )
}
