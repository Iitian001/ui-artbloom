# Governance

This document describes how ui.artbloom is run: who makes decisions, how they
are made, and how that changes over time. It is deliberately short. ui.artbloom
is a young project maintained by a small team, and this describes that honestly
rather than a structure that does not exist yet.

## Project scope

ui.artbloom is two things in one repository:

- **the site** — a Next.js app that renders the catalog and serves the registry
  API at `/r/*`
- **the CLI** — the `ui.artbloom` npm package that installs registry items into
  a user's project

The remit is production-ready React templates and animations that are free to
copy and safe to redistribute. Work that fits that remit is in scope; anything
requiring a backend, an account system, or a paywall is not — the registry is
static and stays that way.

## Roles

**Users** install items with the CLI or browse the site. They need no
permissions and are welcome to open issues and pull requests.

**Contributors** are anyone who opens a pull request or issue. There is no
barrier to entry: read [CONTRIBUTING.md](CONTRIBUTING.md) and open a PR. By
contributing you license your work under the [MIT License](LICENSE) that covers
the site and the CLI.

**Maintainers** review and merge pull requests, triage issues, publish CLI
releases, and steward the project's direction. The project is currently led by a
single maintainer, [@Iitian001](https://github.com/Iitian001), operating as
Artbloom Labs. More maintainers will be added as the project grows (see below).

## How decisions are made

Most decisions are made in the open, on pull requests and issues:

- **Everyday changes** — a bug fix, a new registry item, a doc edit — are made
  by pull request against `main`. Every PR runs the CI gate (typecheck + build)
  and an automated CodeRabbit review before a maintainer reviews and merges.
- **Lazy consensus.** A proposal with no objection after reasonable time is
  taken as agreed. For anything larger than a single item or fix, open an issue
  first so direction can be discussed before code is written.
- **Final say.** Where there is disagreement, a maintainer decides and explains
  the reasoning. Changes that are hard to reverse — dropping an item, changing
  the registry payload schema, or a breaking CLI change — get extra scrutiny and
  a clear note in the PR.

## Releases

- **The site** is continuously deployed: merging to `main` deploys it.
- **The CLI** is published to npm as `ui.artbloom`. Security fixes always land
  on `main` and the latest npm release; older CLI versions are not patched (see
  [SECURITY.md](SECURITY.md)).

## Becoming a maintainer

Maintainers are added by invitation from the existing maintainers, on the basis
of sustained, high-quality contribution and sound judgment in review — not a
fixed commit count. If you have been contributing and want to help maintain, say
so in an issue or reach out (below). Maintainers who need to step back are moved
to an emeritus list rather than removed, with thanks.

## Code of conduct

Everyone taking part — users, contributors, and maintainers — is held to the
[Code of Conduct](CODE_OF_CONDUCT.md). Maintainers are responsible for enforcing
it. Report unacceptable behavior to the contact listed there.

## Changing this document

Governance changes the same way the code does: by pull request against `main`,
reviewed and merged by a maintainer. Propose a change and it will be discussed
in the open.

## Contact

- General and project questions: **hello@shreyashmishra.in**, or open an issue.
- Security: see [SECURITY.md](SECURITY.md) — please do not open a public issue.
- Conduct: see [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).
