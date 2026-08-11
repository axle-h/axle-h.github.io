/**
 * Emits sitemap.xml, robots.txt and rss.xml into the prerendered output.
 *
 * Run as a post-build step rather than a Vite plugin: the static output lands in `.output/public`
 * after Nitro copies the client build, so a closeBundle hook would race that copy.
 *
 * Driven by the same post index that drives prerendering, so the two can never disagree.
 */
import { writeFile } from 'node:fs/promises'
import path from 'node:path'
import { Feed } from 'feed'
import { readPostIndex, ROOT } from './posts-index.ts'
import { site } from '../src/config.ts'

const OUT_DIR = path.join(ROOT, '.output/public')

const toDate = ([y, m, d]: [number, number, number]) => new Date(y, m - 1, d)

const posts = await readPostIndex()

const urls = [
  { loc: '/', lastmod: toDate(posts[0].date) },
  { loc: '/cv', lastmod: toDate(posts[0].date) },
  ...posts.map((p) => ({ loc: p.url, lastmod: toDate(p.date) })),
]

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    ({ loc, lastmod }) =>
      `  <url><loc>${site.origin}${loc}</loc><lastmod>${lastmod.toISOString().slice(0, 10)}</lastmod></url>`
  )
  .join('\n')}
</urlset>
`

const robots = `User-agent: *
Allow: /

Sitemap: ${site.origin}/sitemap.xml
`

const feed = new Feed({
  title: site.title,
  description: site.description,
  id: site.origin,
  link: site.origin,
  language: 'en',
  copyright: `All rights reserved, ${site.author}`,
  author: { name: site.author, link: site.origin },
})
for (const post of posts) {
  feed.addItem({
    title: post.title,
    id: `${site.origin}${post.url}`,
    link: `${site.origin}${post.url}`,
    date: toDate(post.date),
    image: `${site.origin}${post.banner}`,
    author: [{ name: site.author }],
  })
}

await Promise.all([
  writeFile(path.join(OUT_DIR, 'sitemap.xml'), sitemap),
  writeFile(path.join(OUT_DIR, 'robots.txt'), robots),
  writeFile(path.join(OUT_DIR, 'rss.xml'), feed.rss2()),
])

console.log(
  `[seo] wrote sitemap.xml (${urls.length} urls), robots.txt, rss.xml`
)
