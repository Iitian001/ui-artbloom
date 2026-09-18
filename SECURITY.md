# Security Policy

## Supported versions

ui.artbloom is a continuously deployed web app plus a published CLI (`ui.artbloom`).
Security fixes always land on `main` and the latest npm release. Older CLI versions are
not patched — upgrade to the latest.

## Reporting a vulnerability

Please do not open a public issue for security vulnerabilities.

Report privately through either:

- GitHub's [private vulnerability reporting](https://github.com/Iitian001/ui-artbloom/security/advisories/new)
  (Security → Report a vulnerability), or
- email **hey@ui.artbloom.tech** with the details.

Include what you found, where (URL, item, CLI command, or file), how to reproduce it,
and the impact you believe it has. A proof of concept helps.

## What to expect

- We aim to acknowledge a report within 5 business days.
- We will confirm the issue, tell you our assessment, and keep you updated as we work
  on a fix.
- Once a fix ships, we are happy to credit you in the release notes unless you prefer
  to stay anonymous.

## Scope

In scope:

- The site at `ui.artbloom.tech` and its registry API (`/r/*`).
- The `ui.artbloom` CLI and what it writes to a user's project.

Out of scope:

- Third-party assets bundled with individual registry items — report those upstream.
- Denial of service through automated traffic, and issues that require a compromised
  host or a modified CLI build.

Thanks for helping keep ui.artbloom and the people who use it safe.
