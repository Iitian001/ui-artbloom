# Contributing to ui.artbloom

Thanks for taking the time to contribute. ui.artbloom is a living library of React
templates and animations — browsable on the web, installable with one command. Every
item in it started as a contribution, and yours is welcome.

This guide covers how to get set up, how the repo is laid out, and what a good
contribution looks like.

## Code of Conduct

This project follows a [Code of Conduct](CODE_OF_CONDUCT.md). By participating you agree
to uphold it. Report unacceptable behavior to the contact listed there.

## Getting started

You need Node.js 20+ and npm.

```bash
git clone https://github.com/Iitian001/ui-artbloom.git
cd ui-artbloom
npm install
npm run dev          # http://localhost:3210
```

Create a `.env.local` before testing the CLI locally:

```
NEXT_PUBLIC_SITE_ORIGIN=http://localhost:3210
```

Registry payloads declare binary assets as absolute URLs. Without that variable they
point at the production origin, and a CLI install running against localhost cannot
resolve them.

Before you open a pull request, both of these must pass:

```bash
npm run typecheck
npm run build
```

## How the repo is laid out

| Path | What |
| --- | --- |
| `app/(site)/` | catalog, item pages, docs, legal, auth screens |
| `app/(bare)/preview/[name]/` | full-page template preview, no site chrome |
| `app/r/[name]/` | registry payload — one JSON per item |
| `registry/` | the actual source of every published item |
| `lib/registry/` | manifest, schema, source reader |
| `lib/brand.ts` | every user-visible name and URL, derived from `brand.json` |
| `cli/` | the published npm package |

There is no database. Every item is a static, shadcn-compatible payload served at
`/r/{name}.json`, prerendered at build time.

## Adding an item to the registry

The fastest path is an animation — one file, built on the shared canvas hook.

### Ship a piece in 30 minutes

1. Pick an idea. Issues labelled [`good first piece`](https://github.com/Iitian001/ui-artbloom/labels/good%20first%20piece)
   are ready to claim — comment on one so nobody doubles up — or bring your own.
2. Scaffold it:

   ```bash
   npm run new-piece -- pendulum-progress --handle your-github-handle
   ```

   This writes `registry/animations/pendulum-progress.tsx`: a working damped
   pendulum on `registry/hooks/use-canvas-scene.ts`, with reduced motion already
   handled. It prints the two snippets to paste into `lib/registry/items.ts`
   (your `AUTHORS` entry and the item) and `components/demos.tsx`.
3. Replace the pendulum with your physics. Read a neighbour first —
   `registry/animations/chip-pile.tsx` (rigid bodies) or
   `registry/animations/ripple-tank.tsx` (wave field) show the house style.
4. `npm run dev`, open `/artbloom/animations/<name>`, then `npm run typecheck`
   and `npm run build`.

Templates and components follow the same registration, with their source under
`registry/templates/` or `registry/components/`.

### What gets merged

A piece is accepted when it:

- **simulates something** — mass, springs, contacts, fluid, waves. An easing curve
  or a keyframed tween is not a physics piece;
- **looks and behaves unlike what is already here;**
- **respects `prefers-reduced-motion`** — one settled, static frame, no loop;
- **is keyboard- and screen-reader-sane** — a `role` and `aria-label` that say
  what the scene shows, and real controls if it is interactive;
- **adds no runtime dependencies** beyond the shared hook;
- **stays smooth** — aim for 60fps on a mid-range laptop (check with Chrome DevTools
  Performance at 4x CPU slowdown);
- **reads well** — comment the physics the way the existing pieces do.

If a review asks for changes you get one revision round; we will say exactly which
point above it misses. Bulk or generated submissions that skip this list are
closed with a pointer back here.

### How it is served

There is no database. Every item is a static, shadcn-compatible payload served at
`/r/{name}.json`, prerendered at build time. Text files are inlined in the
payload’s `files[]`. Binary assets are declared in `assets[]` as a same-origin
URL plus a byte count, and streamed to disk one at a time by the CLI.

If an item bundles third-party assets (fonts, images, models), include their license
file next to the asset and make sure redistribution is permitted. Assets whose
license forbids redistribution cannot be published here.

## Making changes

- **Branch** off `main`. Name it for the change: `feat/tag-cloud-animation`,
  `fix/registry-asset-mime`.
- **Keep pull requests focused.** One feature or fix per PR is easier to review and
  to revert.
- **Match the surrounding code.** This repo favors small, typed, dependency-light
  code. Read a neighboring file before writing a new one.
- **Do not hard-code the brand.** The name, domain, npm package and social links all
  come from `brand.json` via `lib/brand.ts`. Add new user-visible strings there.
- **Do not commit scratch work.** The `lab/` directory is git-ignored on purpose;
  keep experiments there until they are ready to ship.

## Opening a pull request

1. Confirm `npm run typecheck` and `npm run build` both pass.
2. Push your branch and open a PR against `main`.
3. Fill in the PR template — what changed, why, and how you verified it.
4. A maintainer will review. Automated review from CodeRabbit runs on every PR;
   addressing its comments before a human looks speeds things up.

## Reporting bugs and requesting features

Use the [issue templates](.github/ISSUE_TEMPLATE). A good bug report includes the
item or page affected, what you expected, what happened, and steps to reproduce.

## License

Contributions come in under the same [MIT License](LICENSE) they go out under
(inbound = outbound). There is no CLA and no sign-off step: opening a pull request
is agreeing to that. Your GitHub handle is credited on the piece’s page and in a
header comment of its source.
