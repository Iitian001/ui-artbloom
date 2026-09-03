import { CheckIcon, GitPullRequestIcon, SparklesIcon, TerminalIcon } from "lucide-react"

import { brand } from "@/lib/brand"
import { cn } from "@/lib/utils"

function Frame({
  label,
  Icon,
  children,
  className,
}: {
  label: string
  Icon: typeof TerminalIcon
  children: React.ReactNode
  className?: string
}) {
  return (
    <figure className={cn("flex min-w-0 flex-col gap-3", className)}>
      <div className="flex h-[19rem] flex-col overflow-hidden rounded-xl border border-border bg-subtle">
        {children}
      </div>
      <figcaption className="flex items-center gap-2 px-1 text-[13px] font-medium text-muted-foreground">
        <Icon className="size-3.5" />
        {label}
      </figcaption>
    </figure>
  )
}

function TitleBar({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 border-b border-border px-3 py-2">
      <div className="flex gap-1.5">
        {["bg-red-400/70", "bg-amber-400/70", "bg-emerald-400/70"].map((tone) => (
          <span key={tone} className={cn("size-2.5 rounded-full", tone)} />
        ))}
      </div>
      <span className="ml-1 truncate font-mono text-[11px] text-muted-foreground">{children}</span>
    </div>
  )
}

export function AgentMockups() {
  return (
    <section className="border-b border-border py-24">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-semibold tracking-tighter sm:text-4xl">
            Copy the command. <em className="font-serif font-normal italic">Paste it anywhere.</em>
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground">
            One registry, every agent. The files land in the paths your project already uses — no
            wrapper, no runtime, nothing to import from us.
          </p>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {/* ── CLI ─────────────────────────────────────────────────────── */}
          <Frame label="Any terminal" Icon={TerminalIcon}>
            <TitleBar>~/acme/website</TitleBar>
            <div className="flex-1 space-y-2 p-3.5 font-mono text-[12px] leading-relaxed">
              {/*
                A mockup, but not a fictional one: the item, both targets and the
                line counts are what `add aurora-thread-loom` really writes. It
                ships its own stylesheet rather than keyframes, so nothing here
                claims to touch the project's globals.css.
              */}
              <p>
                <span className="text-muted-foreground">$</span> npx {brand.npmPackage} add
                aurora-thread-loom
              </p>
              <p className="text-muted-foreground">✔ Resolved 1 item, 0 dependencies to add</p>
              <p className="text-emerald-500">
                ✔ components/ui/aurora-thread-loom.tsx
                <span className="text-muted-foreground"> +28</span>
              </p>
              <p className="text-emerald-500">
                ✔ components/ui/aurora-thread-loom.css
                <span className="text-muted-foreground"> +111</span>
              </p>
              <p className="text-muted-foreground">
                Done in 1.2s — written to your components path.
              </p>
              <p className="pt-2">
                <span className="text-muted-foreground">$</span>
                <span className="ml-1.5 inline-block h-3.5 w-1.5 translate-y-px animate-pulse bg-foreground align-middle" />
              </p>
            </div>
          </Frame>

          {/* ── Pull request ────────────────────────────────────────────── */}
          <Frame label="Coding agents" Icon={GitPullRequestIcon}>
            <TitleBar>acme/website · main</TitleBar>
            <div className="flex flex-1 flex-col">
              <div className="flex items-center justify-between border-b border-border px-3.5 py-2 font-mono text-[11px]">
                <span className="truncate">components/ui/hero.tsx</span>
                <span className="shrink-0">
                  <span className="text-emerald-500">+148</span>{" "}
                  <span className="text-red-400">−12</span>
                </span>
              </div>
              <div className="flex-1 space-y-0.5 overflow-hidden p-3.5 font-mono text-[11.5px] leading-relaxed">
                {/*
                  The loom paints its own surface and takes no children, so it goes
                  in as a sibling inside a sized box — the stage fills its parent.
                  Three lines in for one out, which is what the hunk header says.
                */}
                <p className="text-muted-foreground">@@ -18,7 +18,9 @@</p>
                <p className="rounded bg-red-500/10 px-1.5 text-red-400">- &lt;OldHero /&gt;</p>
                <p className="rounded bg-emerald-500/10 px-1.5 text-emerald-500">
                  + &lt;div className=&quot;relative h-[32rem]&quot;&gt;
                </p>
                <p className="rounded bg-emerald-500/10 px-1.5 text-emerald-500">
                  + &nbsp;&lt;AuroraThreadLoom /&gt;
                </p>
                <p className="rounded bg-emerald-500/10 px-1.5 text-emerald-500">
                  + &lt;/div&gt;
                </p>
              </div>
              <div className="flex items-center justify-between border-t border-border px-3.5 py-2.5">
                <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <span className="size-1.5 rounded-full bg-emerald-500" />
                  Ready to review
                </span>
                <span className="rounded-md bg-primary px-2.5 py-1 text-[11px] font-medium text-primary-foreground">
                  Create PR
                </span>
              </div>
            </div>
          </Frame>

          {/* ── Builder ─────────────────────────────────────────────────── */}
          <Frame label="Prompt-to-app builders" Icon={SparklesIcon}>
            <TitleBar>Preview · localhost:3000</TitleBar>
            <div className="flex-1 space-y-2.5 p-3.5 text-[12.5px]">
              <p className="text-muted-foreground">Worked for 14s</p>
              {[
                "created components/ui/aurora-thread-loom.tsx",
                "created components/ui/aurora-thread-loom.css",
                "created components/ui/number-ticker.tsx",
                "edited app/page.tsx",
              ].map((line) => (
                <p key={line} className="flex items-start gap-2 font-mono text-[11.5px]">
                  <CheckIcon className="mt-0.5 size-3 shrink-0 text-emerald-500" />
                  <span className="min-w-0 break-all text-muted-foreground">{line}</span>
                </p>
              ))}
              <p className="flex items-center gap-2 pt-1.5 text-[12px] font-medium">
                <span className="size-1.5 rounded-full bg-emerald-500" />
                Preview updated
              </p>
            </div>
          </Frame>
        </div>
      </div>
    </section>
  )
}
