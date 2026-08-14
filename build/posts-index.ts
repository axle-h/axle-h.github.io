/**
 * Build-time post index. Node only — this module must never enter the client graph.
 *
 * Ported from the old `posts/index.ts`, which did the same fs work inside a React Server
 * Component. Behaviour (filename parsing, slug rules, asset guards) is preserved exactly.
 */
import { readdir, readFile, access } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import matter from 'gray-matter'
import readingTime from 'reading-time'

export const ROOT = fileURLToPath(new URL('..', import.meta.url))
export const POSTS_DIR = path.join(ROOT, 'posts')
const PUBLIC_DIR = path.join(ROOT, 'public')

interface PostFrontmatter {
  title: string
  categories?: string[]
  legacySlug?: boolean
}

/**
 * Serialisable post metadata, as embedded into the `virtual:posts` module.
 *
 * `date` is a [year, month(1-12), day] tuple rather than a Date or an ISO string. The original
 * code built `new Date(y, m - 1, d)` — *local* midnight — and formatted it locally. Round-tripping
 * through toISOString() would shift the rendered day for any visitor at a negative UTC offset and
 * cause a prerender/hydration mismatch, since CI prerenders in UTC.
 */
export interface PostMetaJson {
  title: string
  name: string
  categories: string[]
  url: string
  slug: string[]
  date: [number, number, number]
  filename: string
  logo: string
  banner: string
  readingTime: string
}

export async function readPostIndex(): Promise<PostMetaJson[]> {
  const files = (await readdir(POSTS_DIR)).filter(
    (file) => path.extname(file) === '.mdx'
  )
  const posts = await Promise.all(files.map(readPost))
  return posts.toSorted((p1, p2) => compareDate(p2.date, p1.date))
}

function compareDate(a: [number, number, number], b: [number, number, number]) {
  return a[0] - b[0] || a[1] - b[1] || a[2] - b[2]
}

async function readPost(filename: string): Promise<PostMetaJson> {
  const match = filename.match(/(\d{4})-(\d{2})-(\d{2})-(.+)\.mdx/)
  if (!match) {
    throw new Error(`invalid post filename ${filename}`)
  }

  const name = match[4]
  const source = await readFile(path.join(POSTS_DIR, filename), {
    encoding: 'utf8',
  })
  const {
    title,
    categories = [],
    legacySlug = false,
  } = matter(source).data as PostFrontmatter

  if (!title) {
    throw new Error(`${filename} requires a title in its frontmatter`)
  }

  const slug = legacySlug
    ? [...categories, ...match.slice(1)]
    : [...categories, name]

  const assetsPath = path.join(PUBLIC_DIR, name)
  const assetsExists = await access(assetsPath)
    .then(() => true)
    .catch(() => false)
  if (!assetsExists) {
    throw new Error(`${name} requires assets folder at ${assetsPath}`)
  }

  const assets = await readdir(assetsPath)
  const logo = assets.find((f) => /logo\.(?:png|jpg|gif|webp)/i.test(f))
  if (!logo) {
    throw new Error(`${name} requires logo.{png|jpg|gif|webp} at ${assetsPath}`)
  }

  const banner = assets.find((f) => /banner\.(?:png|jpg|gif|webp)/i.test(f))
  if (!banner) {
    throw new Error(`${name} requires banner.{png|jpg|gif|webp} at ${assetsPath}`)
  }

  return {
    title,
    name,
    categories,
    url: '/' + slug.join('/'),
    slug,
    date: [
      Number.parseInt(match[1]),
      Number.parseInt(match[2]),
      Number.parseInt(match[3]),
    ],
    filename,
    logo: `/${name}/${logo}`,
    banner: `/${name}/${banner}`,
    // Same input as the original: the whole file, frontmatter included.
    readingTime: readingTime(source).text,
  }
}
