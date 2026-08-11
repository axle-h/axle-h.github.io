/**
 * Client-safe post metadata.
 *
 * The heavy lifting (fs scan, frontmatter parsing, asset validation) happens at build time in
 * build/posts-index.ts and arrives here as a JSON literal via the `virtual:posts` module. This
 * file is a thin, synchronous view over it — the old async `allPosts()` / React `cache()` are gone.
 */
import { posts as raw } from 'virtual:posts'

export interface Post {
  title: string
  name: string
  categories: string[]
  url: string
  slug: string[]
  date: Date
  filename: string
  logo: string
  banner: string
  readingTime: string
}

// Rebuild the Date locally from the [y, m, d] tuple. See the note in build/posts-index.ts: going
// via ISO/UTC would shift the rendered day for negative-offset visitors and break hydration.
const posts: Post[] = raw.map((post) => ({
  ...post,
  date: new Date(post.date[0], post.date[1] - 1, post.date[2]),
}))

export function allPosts(): Post[] {
  return posts
}

export function findPostBySlug(slug: string[]): Post | null {
  const url = '/' + slug.join('/')
  return posts.find((p) => p.url === url) ?? null
}

export function findPostByName(name: string): Post | null {
  return posts.find((p) => p.name === name) ?? null
}
