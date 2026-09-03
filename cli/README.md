# ui.artbloom

Copy React templates, animations, and components out of [ui.artbloom](https://ui.artbloom.tech) and into your project. One command, plain files, no runtime dependency on this CLI.

```bash
npx ui.artbloom add aurora-background
```

## What it does

It fetches an item from the registry, prints the whole plan — every file, every keyframe, every npm package — waits for you to say yes, and then writes it. The code lands in your repo as ordinary source you own and can edit. Nothing is added to your dependencies except the packages an item genuinely needs.

## Commands

```bash
npx ui.artbloom list                    # the whole catalogue
npx ui.artbloom list --kind animations  # one kind
npx ui.artbloom info aurora-background  # what it would write. writes nothing
npx ui.artbloom add aurora-background   # write it
npx ui.artbloom init                    # record your paths so you stop passing them
```

Installed as a dependency, the executable is `artbloom` — `npm i -D ui.artbloom` then `artbloom add aurora-background`. The names differ on purpose: a dot in an executable name is unrunnable on Windows, because `cmd.exe` reads everything after the last dot as a file extension and so never finds the `.cmd` shim.

## Flags

All of these apply to `add`.

| Flag | |
| --- | --- |
| `-y, --yes` | Answer every prompt with the default. For CI. |
| `-o, --overwrite` | Replace files that already exist. Off by default — a clash is an error. |
| `-c, --cwd <path>` | Project root. Defaults to the current directory. |
| `--css <path>` | Stylesheet that receives keyframes. Default: `app/globals.css`. |
| `--ui <path>` | Where component files land. Default: `components/ui`. |
| `--registry <url>` | Read from a different registry origin. For self-hosting or a fork. |
| `--dry-run` | Print the plan and exit. |
| `--no-deps` | Skip the npm install step. |
| `-s, --silent` | No output except errors. |

## Configuration

Optional. `init` writes it, and the CLI guesses the same values without it.

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

## Requirements

React 19 and Node 20.11 or newer. Beyond that, each item declares what it needs and `info` will tell you before you install: some animations are plain CSS with no dependencies at all, others pull [`motion`](https://motion.dev), and anything styled with utility classes expects Tailwind CSS v4. Templates assume a Next.js App Router project.

## Exit codes

`0` — everything asked for was written. `1` — nothing was written. The whole install is planned before anything touches disk, so a failure leaves your project as it was.

## Other CLIs

Every item is also a valid shadcn registry item:

```bash
npx shadcn@latest add https://ui.artbloom.tech/r/aurora-background.json
```

MIT. Installed code is yours — ship it, sell it, no attribution required.
