import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import { nitro } from 'nitro/vite'
import mdx from '@mdx-js/rollup'
import remarkFrontmatter from 'remark-frontmatter'
import remarkGfm from 'remark-gfm'
import rehypeShiki from '@shikijs/rehype'
import { readPostIndex } from './build/posts-index.ts'
import { postsIndexPlugin } from './build/posts-plugin.ts'
import { remarkPintora, remarkLatex } from './build/remark-build-time.ts'

// Runs the fs scan (and its asset guards) once, before the build starts, so a post missing its
// logo/banner fails immediately rather than part-way through prerendering.
const posts = await readPostIndex()

export default defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [
    // `enforce: 'pre'` so MDX claims .mdx before anything else does.
    {
      enforce: 'pre',
      ...mdx({
        remarkPlugins: [
          // Required: without it the `---` frontmatter block renders as body content.
          remarkFrontmatter,
          remarkGfm,
          remarkPintora,
          remarkLatex,
        ],
        rehypePlugins: [
          [
            rehypeShiki,
            {
              themes: { light: 'github-light', dark: 'github-dark' },
              // 4 fences in the posts have no language; Shiki throws on those by default.
              defaultLanguage: 'text',
              fallbackLanguage: 'text',
            },
          ],
        ],
      }),
    },
    postsIndexPlugin(),
    nitro(),
    tanstackStart({
      prerender: {
        enabled: true,
        // CRITICAL: keeps URLs as flat `/ai/diffy.html`, matching the Next export and the live
        // site. The default (true) emits `/ai/diffy/index.html`, which makes GitHub Pages 301
        // every existing inbound link to a trailing-slash variant.
        autoSubfolderIndex: false,
        // Two posts link to PDFs under public/. The crawler would treat those as routes and, with
        // failOnError, break the build. Every real path is enumerated below anyway.
        crawlLinks: false,
        failOnError: true,
      },
      pages: posts.map((post) => ({
        path: post.url,
        prerender: { enabled: true },
      })),
    }),
    viteReact(),
  ],
})
