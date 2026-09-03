# ui.artbloom

The living library of interfaces — production-ready React templates and animations, browsable on the web and installable with one command.

Two things live in this repo:

- **the site** (repo root) — Next.js 16 App Router app that renders the catalog *and* serves the registry API at `/r/*`
- **the CLI** (`cli/`) — the `ui.artbloom` npm package that reads that registry and writes files into a user's project

## Run it

```bash
npm install
npm run dev          # http://localhost:3210
```

`.env.local` is required for local CLI testing:

```
NEXT_PUBLIC_SITE_ORIGIN=http://localhost:3210
```

Registry payloads declare binary assets as absolute URLs. Without that variable they point at the production origin, and a CLI install running against localhost cannot resolve them.

```bash
npm run typecheck
npm run build
```

## Layout

| Path | What |
| --- | --- |
| `app/(site)/` | catalog, item pages, docs, legal, auth screens |
| `app/(bare)/preview/[name]/` | full-page template preview, no site chrome |
| `app/r/[name]/` | registry payload — one JSON per item |
| `app/r/asset/[...src]/` | binary asset streaming for registry items |
| `registry/` | the actual source of every published item |
| `lib/registry/` | manifest, schema, source reader |
| `lib/brand.ts` | every user-visible name and URL, derived from `brand.json` |
| `cli/` | the published npm package |

`brand.json` is the single source of truth for the name, domain, npm package and social links. Nothing else hard-codes them.

## The registry

Every item is a shadcn-compatible static payload at `/r/{name}.json`:

- text files are inlined in `files[]`
- binaries are declared in `assets[]` as a same-origin URL plus a byte count, streamed to disk one at a time by the CLI

`/r/registry.json` is the index. `/schema/registry-item.json` is the JSON Schema. Both are prerendered at build time, so adding an item means adding it under `registry/` and to the manifest — there is no database.

## The CLI

```bash
cd cli
npm install
npm run build         # tsc -> dist/
```

The package is `ui.artbloom`; the executable it installs is `artbloom` (a dotted bin name is unrunnable from `cmd.exe`, which reads everything after the last dot as a file extension). npm resolves the package's single bin, so `npx ui.artbloom add <name>` works.

The default registry the CLI talks to is taken from `homepage` in `cli/package.json`. Override per-invocation with `--registry`.

```bash
npx ui.artbloom add bubble-burst
npx ui.artbloom list --kind templates
npx ui.artbloom info cinematic-supercar
```

## Deploy

The site is a stock Next.js app on Vercel. `next build` prerenders the whole catalog plus every registry payload and asset route.

## License

MIT for the site and the CLI. Items under `registry/` carry their own third-party asset licenses where applicable — see the `LICENSES.md` / `LICENSE.txt` files alongside those assets.
