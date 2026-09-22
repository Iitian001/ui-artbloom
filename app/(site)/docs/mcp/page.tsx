import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRightIcon, PlugZapIcon } from "lucide-react"

import { CodeBlock } from "@/components/code-block"
import { CopyButton } from "@/components/copy-button"
import { PageHeader, Prose } from "@/components/page-shell"
import { brand, siteOrigin } from "@/lib/brand"
import { pageMeta } from "@/lib/seo"

const ENDPOINT = `${siteOrigin}/mcp`

export const metadata: Metadata = pageMeta({
  title: "MCP server",
  description: `Point an AI agent at ${brand.name} over the Model Context Protocol — search the catalogue and read any piece's source, with no key and no account.`,
  path: "/docs/mcp",
})

const CLAUDE_CODE = `claude mcp add --transport http artbloom ${ENDPOINT}`

const MCP_JSON = `{
  "mcpServers": {
    "artbloom": {
      "url": "${ENDPOINT}"
    }
  }
}`

const STDIO_JSON = `{
  "mcpServers": {
    "artbloom": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "${ENDPOINT}"]
    }
  }
}`

const PROBE = `curl -sX POST ${ENDPOINT} \\
  -H 'content-type: application/json' \\
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'`

const CARDS = [
  { href: "/docs", title: "How installs work", body: "What a registry item is, and what lands in your project." },
  { href: "/docs/cli", title: "CLI reference", body: "Every command and flag, for humans at a terminal." },
  { href: "/llms.txt", title: "/llms.txt", body: "The whole catalogue as one plain-text page — no tools required." },
]

export default function McpDocsPage() {
  return (
    <>
      <PageHeader
        eyebrow={
          <>
            <Link href="/docs" className="hover:text-foreground">
              Docs
            </Link>{" "}
            / MCP
          </>
        }
        title="Point your agent at the catalogue"
        lede={`${brand.name} speaks the Model Context Protocol. Connect any MCP client and it can search every template, block, component and animation here — then read a piece's exact install command and source — without a key or an account.`}
      />

      <div className="container-page pb-20">
        {/* The endpoint, front and centre: the one string everything else needs. */}
        <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 sm:flex-row sm:items-center sm:gap-5 sm:p-6">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
            <PlugZapIcon className="size-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium">Server endpoint</p>
            <div className="mt-1.5 flex items-center gap-2">
              <code className="truncate font-mono text-sm text-foreground sm:text-base">
                {ENDPOINT}
              </code>
              <CopyButton value={ENDPOINT} variant="solid" label="Copy endpoint" />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="rounded-full border border-border bg-secondary px-2.5 py-1 text-xs font-medium text-muted-foreground">
              Streamable HTTP
            </span>
            <span className="rounded-full border border-border bg-secondary px-2.5 py-1 text-xs font-medium text-muted-foreground">
              No key · read-only
            </span>
          </div>
        </div>
        <div className="mt-14 grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <div>
            <section>
              <h2 className="text-lg font-semibold tracking-tight">Add it to your client</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Every MCP client takes the same endpoint — three of the common ones, verbatim.
              </p>
              <div className="mt-4 flex flex-col gap-4">
                <div>
                  <p className="mb-2 text-sm font-medium">Claude Code</p>
                  <CodeBlock code={CLAUDE_CODE} lang="bash" showLineNumbers={false} />
                </div>
                <div>
                  <p className="mb-2 text-sm font-medium">Cursor, Windsurf, VS Code</p>
                  <CodeBlock
                    code={MCP_JSON}
                    lang="json"
                    filename=".cursor/mcp.json"
                    showLineNumbers={false}
                  />
                </div>
                <div>
                  <p className="mb-2 text-sm font-medium">Claude Desktop, or any stdio-only client</p>
                  <CodeBlock
                    code={STDIO_JSON}
                    lang="json"
                    filename="claude_desktop_config.json"
                    showLineNumbers={false}
                  />
                  <p className="mt-2 text-xs text-muted-foreground">
                    <code className="font-mono">mcp-remote</code> bridges the HTTP endpoint to
                    clients that only speak stdio. Nothing to install first — npx fetches it.
                  </p>
                </div>
              </div>
            </section>
            <section className="mt-12">
              <Prose>
                <h2>The two tools</h2>
                <p>
                  The server is deliberately small. It reads the same registry the site and CLI
                  read, so an agent never sees a piece the catalogue doesn&rsquo;t ship.
                </p>
                <h3>search_registry</h3>
                <p>
                  Find pieces by free text and, optionally, by kind — templates, blocks, components
                  or animations. Returns each match&rsquo;s name, kind and one-line description:
                  enough to choose, not the whole payload.
                </p>
                <h3>get_item</h3>
                <p>
                  Read one piece by name: its install command, the exact files it writes with their
                  sizes, the npm packages it needs, and — only when asked — the full source. This is
                  what lets an agent install something and know what landed.
                </p>
                <p>
                  Both are read-only. There is nothing the server can change in your project, and
                  nothing it needs to know about you — no key, no account, no rate-limited sign-up.
                </p>
              </Prose>
            </section>

            <section className="mt-12">
              <h2 className="text-lg font-semibold tracking-tight">Verify it&rsquo;s live</h2>
              <p className="mt-1 mb-4 text-sm text-muted-foreground">
                The endpoint is POST-only, so a browser visit shows nothing. One request lists the
                tools:
              </p>
              <CodeBlock code={PROBE} lang="bash" showLineNumbers={false} />
            </section>
          </div>
          <div className="flex flex-col gap-3">
            {CARDS.map((card) => (
              <Link
                key={card.href}
                href={card.href}
                className="group rounded-xl border border-border p-4 transition-colors hover:border-foreground/25 hover:bg-secondary/40"
              >
                <p className="flex items-center gap-1.5 text-sm font-medium">
                  {card.title}
                  <ArrowRightIcon className="size-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{card.body}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
