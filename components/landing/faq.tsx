import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { brand } from "@/lib/brand"

const FAQS = [
  {
    q: `What is ${brand.name}?`,
    a: `A registry of React templates and animations you install into your own project. Every entry is a real file you can read before you take it — ${brand.name} is not a dependency you import from, it is a place you copy from.`,
  },
  {
    q: "Is it free?",
    a: "Completely. Every template, animation and component is free to copy and free to install — no daily limit, no paid tier, no card, and no account needed to use the CLI. Nothing you install ever stops working.",
  },
  {
    q: "How is this different from a component library?",
    a: "A library sits in node_modules and you configure it from the outside. Here the code lands in your repo as plain React and Tailwind — you edit it directly, and there is no upgrade path to fight when you need it to behave differently.",
  },
  {
    q: "How do I install something?",
    a: `Run \`npx ${brand.npmPackage} add <name>\` in your project. The CLI reads your Tailwind and tsconfig setup, writes the files where your project keeps components, appends any required keyframes to your global stylesheet, and tells you which npm packages to add.`,
  },
  {
    q: "Does it work with shadcn/ui?",
    a: "Yes — the registry format is shadcn-compatible, so `shadcn add <url>` works too if you would rather not add another CLI. Components use the same CSS variable tokens, so they inherit your existing theme with no changes.",
  },
  {
    q: "Can I publish my own?",
    a: `No — ${brand.name} is not a marketplace. Everything here is made and maintained by one author, which is what keeps the quality and the licensing predictable. You are free to take any of it, change it, and ship it as your own; you just cannot list your work in this catalogue.`,
  },
  {
    q: "What exactly is a template?",
    a: "A complete, deployable site rather than a single component — every page, every section, and the animations already wired together. Install one and you have something you could put in front of a client the same afternoon.",
  },
]

export function Faq() {
  return (
    <section className="border-b border-border py-24">
      <div className="container-page grid gap-12 lg:grid-cols-[1fr_1.6fr]">
        <div>
          <h2 className="text-balance text-3xl font-semibold tracking-tighter sm:text-4xl">
            Questions, <em className="font-serif font-normal italic">answered</em>
          </h2>
          <p className="mt-4 max-w-xs text-pretty text-muted-foreground">
            The registry, the CLI, and what it costs. Anything else — just email us.
          </p>
          <a
            href={`mailto:${brand.email}`}
            className="mt-4 inline-block text-sm font-medium underline-offset-4 hover:underline"
          >
            {brand.email}
          </a>
        </div>

        <Accordion type="single" collapsible className="min-w-0">
          {FAQS.map((faq, index) => (
            <AccordionItem key={faq.q} value={faq.q}>
              <AccordionTrigger>
                <span className="flex min-w-0 gap-4">
                  <span className="shrink-0 font-mono text-xs text-muted-foreground tabular-nums">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0">{faq.q}</span>
                </span>
              </AccordionTrigger>
              <AccordionContent className="pl-10">{faq.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
