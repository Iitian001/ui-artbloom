import { BlurReveal } from "@/components/ui/blur-reveal"
import { Marquee } from "@/components/ui/marquee"
import { SpotlightCard } from "@/components/ui/spotlight-card"
import { TextShimmer } from "@/components/ui/text-shimmer"

const WORK = [
  { title: "Meridian", year: "2026", role: "Brand & site", tone: "from-violet-500/20 to-blue-500/10" },
  { title: "Halcyon", year: "2025", role: "Design system", tone: "from-rose-500/20 to-orange-400/10" },
  { title: "Northwind", year: "2025", role: "Product design", tone: "from-emerald-500/20 to-teal-400/10" },
  { title: "Atlas Type", year: "2024", role: "Type specimen", tone: "from-amber-500/20 to-yellow-400/10" },
]

const CLIENTS = ["Vercel", "Linear", "Raycast", "Arc", "Framer", "Figma", "Stripe", "Notion"]

export default function StudioPortfolioPage() {
  return (
    <main className="min-h-dvh bg-background text-foreground">
      <div className="mx-auto max-w-5xl px-6">
        <header className="flex h-20 items-center justify-between">
          <span className="text-sm font-medium tracking-tight">Ada Okonkwo</span>
          <nav className="flex gap-6 text-sm text-muted-foreground">
            <a className="transition-colors hover:text-foreground" href="#work">Work</a>
            <a className="transition-colors hover:text-foreground" href="#about">About</a>
            <a className="transition-colors hover:text-foreground" href="mailto:hey@example.com">Contact</a>
          </nav>
        </header>

        <section className="py-24">
          <BlurReveal stagger={0.14}>
            <p className="text-sm text-muted-foreground">Independent designer, Lagos → Berlin</p>
            <h1 className="mt-5 max-w-3xl text-balance text-5xl font-semibold leading-[1.05] tracking-tighter sm:text-6xl">
              I design interfaces that feel <em className="font-serif font-normal italic">inevitable</em>
            </h1>
            <p className="mt-6 max-w-xl text-pretty text-lg text-muted-foreground">
              Twelve years of product and brand work for teams who care about the last five percent.
            </p>
            <p className="mt-8 text-sm">
              <TextShimmer className="font-medium">Available for new work from March</TextShimmer>
            </p>
          </BlurReveal>
        </section>

        <section id="work" className="border-t border-border py-20">
          <h2 className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Selected work
          </h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {WORK.map((project) => (
              <SpotlightCard key={project.title} className="aspect-4/3">
                <div className={`flex size-full flex-col justify-end bg-gradient-to-br ${project.tone} p-6`}>
                  <div className="flex items-baseline justify-between">
                    <h3 className="text-xl font-medium tracking-tight">{project.title}</h3>
                    <span className="text-xs text-muted-foreground tabular-nums">{project.year}</span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{project.role}</p>
                </div>
              </SpotlightCard>
            ))}
          </div>
        </section>
      </div>

      <section className="border-y border-border py-10">
        <Marquee duration={28} gap="4rem" pauseOnHover>
          {CLIENTS.map((client) => (
            <span key={client} className="text-2xl font-medium tracking-tight text-muted-foreground">
              {client}
            </span>
          ))}
        </Marquee>
      </section>

      <div className="mx-auto max-w-5xl px-6">
        <section id="about" className="grid gap-10 py-24 md:grid-cols-[1fr_2fr]">
          <h2 className="text-xs font-medium uppercase tracking-widest text-muted-foreground">About</h2>
          <div className="space-y-5 text-lg leading-relaxed text-muted-foreground">
            <p>
              I work end to end — research, systems, interface, motion — usually embedded with one
              team at a time so the work actually ships.
            </p>
            <p>
              Previously design lead at two Series-B startups. Currently taking on two engagements a
              quarter.
            </p>
          </div>
        </section>

        <footer className="flex flex-col gap-4 border-t border-border py-10 text-sm text-muted-foreground sm:flex-row sm:justify-between">
          <span>© {new Date().getFullYear()} Ada Okonkwo</span>
          <a className="transition-colors hover:text-foreground" href="mailto:hey@example.com">
            hey@example.com
          </a>
        </footer>
      </div>
    </main>
  )
}
