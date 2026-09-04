# ui.artbloom

Copy React templates and animations out of [ui.artbloom](https://ui.artbloom.tech) and into your project. One command, plain files, no runtime dependency on this CLI.

```bash
npx ui.artbloom add liquid-nav
```

## What it does

It fetches the items you name from the registry, prints the whole plan — every file, every asset, every keyframe, every npm package — waits for you to say yes, and then writes it. The code lands in your repo as ordinary source you own and can edit. Nothing is added to your dependencies except the packages an item genuinely needs.

## Commands

```bash
npx ui.artbloom list                    # the whole catalogue
npx ui.artbloom list --kind animations  # one kind
npx ui.artbloom info liquid-nav          # what it would write. writes nothing
npx ui.artbloom add liquid-nav           # write it. or several
npx ui.artbloom init                    # record your paths so you stop passing them
```

Installed as a dependency, the executable is `artbloom` — `npm i -D ui.artbloom`, then `npx artbloom add liquid-nav`, or plain `artbloom` inside a package.json script. Both of those put `node_modules/.bin` on PATH; typing `artbloom` straight into a shell does not find it. The names differ on purpose: a dot in an executable name is unrunnable on Windows, because `cmd.exe` reads everything after the last dot as a file extension and so never finds the `.cmd` shim.

## Flags

All of these apply to `add`. `-c`, `--registry` and `-s` apply to every command; `--css` and `--ui` also to `info` and `init`; `-y` and `-o` also to `init`.

| Flag | |
| --- | --- |
| `-y, --yes` | Answer every prompt with the default. For CI. |
| `-o, --overwrite` | Replace files that already exist. Off by default — a clash is an error. |
| `-c, --cwd <path>` | Project root. Defaults to the current directory. |
| `--css <path>` | Stylesheet that receives keyframes. Default: the first one it finds, usually `app/globals.css`. |
| `--ui <path>` | Where component files land. Default: `components/ui`, or `src/components/ui` in a `src` project. |
| `--registry <url>` | Read from a different registry origin. For self-hosting or a fork. |
| `--dry-run` | Print the plan and exit. |
| `--no-deps` | Skip the npm install step. |
| `--no-telemetry` | Do not report the install. See [What we collect](#what-we-collect). |
| `-s, --silent` | No output except errors. |

## Configuration

Optional. `init` writes `ui.artbloom.json`, and the CLI guesses the same values without it.

```json
{
  "registry": "https://ui.artbloom.tech",
  "alias": "@",
  "paths": {
    "ui": "components/ui",
    "pages": "app",
    "hooks": "hooks",
    "css": "app/globals.css"
  }
}
```

## What we collect

One HTTP request per item, sent after an `add` that wrote your files and exited `0`. It goes to `<registry>/api/track/install` and carries this and nothing else:

```json
{ "name": "liquid-nav", "version": "0.1.0", "runner": "npm" }
```

The item you asked for, this CLI's version, and which package manager your project uses. One request per name you typed; the registry dependencies an item pulls in are not reported. There are no file paths, no directory or project names, no username, no hostname, no machine or session id — nothing that identifies you and no id of any kind, so two installs from the same machine are indistinguishable in the body. The request does reach the host with your IP address, as every HTTP request does, including the one that fetched the item a second earlier.

Why: so the install count on an item page is a count of installs rather than a guess.

It goes to the registry you pointed the CLI at, never a fixed address. A fork, or `--registry http://localhost:3000`, reports to its own site.

Nothing is sent at all when:

- the run did not finish — a declined prompt, a file that already exists, a download that failed, a package install that exited non-zero, a missing stylesheet. Exit `1` means nothing was reported.
- you passed `--dry-run`, or `list` / `info` / `init` (they never install anything).
- you passed `--no-telemetry`.
- `DO_NOT_TRACK` is set to anything other than `0` or `false`.
- `CI` is set to anything other than `0` or `false` — a build server reinstalling on every green commit is not a person choosing an item.

The request is fire and forget, with a two-second ceiling: offline, a DNS failure, a timeout, a `500` — each is ignored in silence, and none of them can fail an install, print anything, or change the exit code. The only thing you may notice is a run that has finished printing and takes up to two seconds longer to hand back the prompt, in the case where the endpoint accepts the connection and never answers.

## Requirements

React 19 and Node 22.12 or newer. Beyond that, each item declares what it needs and `info` will tell you before you install: some animations are plain CSS with no dependencies at all, others pull [`motion`](https://motion.dev), and anything styled with utility classes expects Tailwind CSS v4. Templates assume a Next.js App Router project.

## Exit codes

`0` — the run did everything the plan promised. `1` — it did not. Everything the plan can catch — an unknown name, a file that already exists, a target outside the project, a declined prompt — is caught before the first write, so those leave your project exactly as it was. A shortfall found later is not a warning either: a missing stylesheet, or a package install that exits non-zero, keeps what already landed on disk, prints what is left to do, and still exits `1`, because a plan that half happened must not read as success. A failure after writing has begun, like an asset that will not download, likewise keeps what landed and prints what is missing.

## Other CLIs

Every item is also a valid shadcn registry item:

```bash
npx shadcn@latest add https://ui.artbloom.tech/r/liquid-nav.json
```

Assets are the exception: `cinematic-supercar` declares its 15MB of models and audio in a field only this CLI reads, so `shadcn` writes the code and downloads none of the media.

MIT. Installed code is yours — ship it, sell it, no attribution required.
