# axle-h.github.io

Source for [ax-h.com](https://ax-h.com) — a statically generated blog and CV built with
[TanStack Start](https://tanstack.com/start) (TanStack Router + Vite), Chakra UI and MDX,
deployed to GitHub Pages by [a GitHub Action](.github/workflows/main.yml).

## Development

Requires Node 24 (see `.nvmrc`) and pnpm.

```bash
pnpm install
pnpm dev          # http://localhost:3000
```

```bash
pnpm build        # prerenders every page into .output/public
pnpm preview      # serve the built output
pnpm typecheck
pnpm lint
pnpm format
```

Note that `pnpm preview` does **not** reproduce GitHub Pages' URL resolution — it answers `200`
for `/ai/diffy/`, where Pages answers `404`. It is fine for checking behaviour, but not for
checking URLs; for that, compare the emitted file layout (see below).

## Writing a post

Add an MDX file to `posts/`. The filename **must** match `YYYY-MM-DD-<name>.mdx` — the date and
the post's `name` are both parsed from it.

```mdx
---
title: My Post Title
categories: [ai]
---

Body content…
```

| Frontmatter  | Required | Meaning                                                        |
| ------------ | -------- | -------------------------------------------------------------- |
| `title`      | yes      | Page title and `<title>` tag                                   |
| `categories` | no       | Prepended to the URL, e.g. `[ai]` → `/ai/<name>`               |
| `legacySlug` | no       | Keeps the old dated URL form `/<categories>/YYYY/MM/DD/<name>` |

Every post also **requires** an asset folder at `public/<name>/` containing a `logo.{png,jpg,gif}`
and a `banner.{png,jpg,gif}`. The build fails loudly if either is missing.

Images in the post body are resolved relative to that folder, so `![alt](guts.jpg)` loads
`/<name>/guts.jpg`.

### Components available in MDX

`PostLink` (links another post by `name`), `PintoraDiagram`, `Latex`, `BarChart`, `LineChart`,
`CheckList` / `CheckListItem` / `XListItem` / `NewListItem`, plus Chakra's `Box`, `Image`,
`Badge` and `SimpleGrid`. See `src/components/mdx.tsx`.

## How the build works

Most of the interesting work happens at build time, in Node, and ships zero runtime JavaScript:

- **`build/posts-index.ts`** scans `posts/`, parses frontmatter, derives slugs and reading time,
  and validates the asset folders. It is exposed to the app as the `virtual:posts` module and is
  also read directly by `vite.config.ts` to enumerate the pages to prerender.
- **`build/remark-build-time.ts`** rewrites `<PintoraDiagram>` into pre-rendered light/dark SVG
  (via `build/pintora.ts`, cached in `node_modules/.cache/pintora`) and `<Latex>` into KaTeX
  markup.
- **Syntax highlighting** is done by `@shikijs/rehype` during MDX compilation, in dual
  light/dark themes.
- **`build/seo.ts`** writes `sitemap.xml`, `robots.txt` and `rss.xml` after the build.

### Colour mode

`src/components/ui/color-mode.tsx` owns light/dark. `<html>`'s `light`/`dark` class is the state;
React subscribes to it via `useSyncExternalStore`. `COLOR_MODE_SCRIPT` is inlined into `<head>` by
the root route and applies the stored (or system) mode before first paint — without it the page
would flash the wrong theme, and no React code can run early enough to prevent that.

The store reports `undefined` during SSR and on the first client render so hydration matches the
prerendered HTML exactly; the real value lands immediately after.

### URLs are load-bearing

Pages are emitted as flat files (`/ai/diffy.html`), _not_ `index.html` inside a directory. This is
what `prerender.autoSubfolderIndex: false` in `vite.config.ts` controls, and it is deliberate:
GitHub Pages serves `/ai/diffy` from `ai/diffy.html` directly, whereas the directory form would
redirect `/ai/diffy` → `/ai/diffy/` and break every existing inbound link. Don't change it.
