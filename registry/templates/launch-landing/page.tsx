import { AuroraBackground } from "@/components/ui/aurora-background"
import { NumberTicker } from "@/components/ui/number-ticker"
import { ShimmerButton } from "@/components/ui/shimmer-button"

const FEATURES = [
  { title: "Ship in an afternoon", body: "Every page, every asset, every animation already wired up." },
  { title: "Yours to edit", body: "Plain React and Tailwind in your repo. No runtime, no lock-in." },
  { title: "Fast by default", body: "Server components, zero layout shift, 100 on Lighthouse." },
]

const STATS = [
  { value: 48000, label: "Developers" },
  { value: 1200, label: "Sites shipped" },
  { value: 99, label: "Uptime %" },
]

export default function LaunchLandingPage() {
  return (
    <main className="min-h-dvh bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <span className="text-sm font-semibold tracking-tight">Launch</span>
          <nav className="hidden gap-7 text-sm text-muted-foreground md:flex">
            <a className="transition-colors hover:text-foreground" href="#features">Features</a>
            <a className="transition-colors hover:text-foreground" href="#pricing">Pricing</a>
            <a className="transition-colors hover:text-foreground" href="#faq">FAQ</a>
          </nav>
          <ShimmerButton className="h-9 px-4 text-xs">Get started</ShimmerButton>
        </div>
      </header>

      <AuroraBackground className="border-b border-border">
        <section className="mx-auto flex max-w-4xl flex-col items-center px-6 py-32 text-center">
          <span className="rounded-full border border-border bg-background/60 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
            v2.0 is out
          </span>
          <h1 className="mt-6 text-balance text-5xl font-semibold tracking-tighter sm:text-7xl">
            Launch the thing
            <br />
            you keep <em className="font-serif font-normal italic">postponing</em>
          </h1>
          <p className="mt-6 max-w-xl text-pretty text-lg text-muted-foreground">
            A complete marketing site you can deploy today and still recognise in six months.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <ShimmerButton>Start building →</ShimmerButton>
            <a
              href="#features"
              className="inline-flex h-11 items-center rounded-full border border-border bg-background/60 px-6 text-sm font-medium backdrop-blur transition-colors hover:bg-accent"
            >
              See what's inside
            </a>
          </div>
        </section>
      </AuroraBackground>

      <section className="border-b border-border">
        <div className="mx-auto grid max-w-6xl grid-cols-1 divide-y divide-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {STATS.map((stat) => (
            <div key={stat.label} className="px-6 py-12 text-center">
              <div className="text-4xl font-semibold tracking-tight">
                <NumberTicker value={stat.value} />
              </div>
              <div className="mt-2 text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="features" className="mx-auto max-w-6xl px-6 py-28">
        <h2 className="max-w-2xl text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          Everything a launch needs, nothing it doesn't
        </h2>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {FEATURES.map((feature) => (
            <div key={feature.title} className="rounded-xl border border-border bg-card p-6">
              <h3 className="font-medium tracking-tight">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{feature.body}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-10 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} Launch</span>
          <div className="flex gap-6">
            <a className="transition-colors hover:text-foreground" href="#">Privacy</a>
            <a className="transition-colors hover:text-foreground" href="#">Terms</a>
            <a className="transition-colors hover:text-foreground" href="#">X</a>
          </div>
        </div>
      </footer>
    </main>
  )
}
