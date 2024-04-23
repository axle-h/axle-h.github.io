import { readdir, readFile, access } from 'node:fs/promises'
import path from 'node:path'
import { cache, ReactElement } from 'react'
import { compileMDX } from 'next-mdx-remote/rsc'
import { postComponents } from '@/components/mdx'
import remarkGfm from 'remark-gfm'
import readingTime from 'reading-time'

interface PostFrontmatter {
  title: string
  categories?: string[]
}

export interface Post {
  title: string
  name: string
  categories: string[]
  url: string
  slug: string[]
  date: Date
  filename: string
  content: ReactElement
  logo: string
  banner: string
  readingTime: string
}

const POSTS_PATH = 'posts'

const options = {
  parseFrontmatter: true,
  mdxOptions: {
    remarkPlugins: [remarkGfm],
  },
}

async function getPost(filename: string): Promise<Post> {
  const match = filename.match(/(\d{4})-(\d{2})-(\d{2})-(.+)\.mdx/)
  if (!match) {
    throw new Error(`invalid post filename ${filename}`)
  }

  const filePath = path.join(POSTS_PATH, filename)
  const source = await readFile(filePath, { encoding: 'utf8' })

  const name = match[4]
  const { frontmatter, content } = await compileMDX<PostFrontmatter>({
    source,
    options,
    components: postComponents(name),
  })

  const categories = frontmatter.categories ?? []
  const slug = categories.concat(...match.slice(1))
  const date = new Date(
    parseInt(match[1]),
    parseInt(match[2]) - 1,
    parseInt(match[3])
  )

  const assetsPath = path.resolve('public', name)
  const assetsExists = await access(assetsPath)
    .then(() => true)
    .catch(() => false)
  if (!assetsExists) {
    throw new Error(`${name} requires assets folder at ${assetsPath}`)
  }

  const assets = await readdir(assetsPath)
  const logo = assets.find((f) => /logo\.(?:png|jpg)/i.test(f))
  if (!logo) {
    throw new Error(`${name} requires logo.jpg or logo.png at ${assetsPath}`)
  }

  const banner = assets.find((f) => /banner\.(?:png|jpg)/i.test(f))
  if (!banner) {
    throw new Error(
      `${name} requires banner.jpg or banner.png at ${assetsPath}`
    )
  }

  return {
    title: frontmatter.title,
    name,
    categories,
    url: '/' + slug.join('/'),
    slug,
    date,
    filename,
    content,
    logo: `/${name}/${logo}`,
    banner: `/${name}/${banner}`,
    readingTime: readingTime(source).text, // TODO trim out frontmatter, tables, source code etc
  }
}

export const allPosts = cache(async () => {
  const files = await readdir(POSTS_PATH)
  const posts = await Promise.all(
    files.filter((file) => path.extname(file) === '.mdx').map(getPost)
  )
  return posts.toSorted((p1, p2) => p2.date.getTime() - p1.date.getTime())
})

export async function findPostBySlug(slug: string[]): Promise<Post | null> {
  const url = '/' + slug.join('/')
  const posts = await allPosts()
  return posts.find((p) => p.url === url) || null
}

export async function findPostByName(name: string): Promise<Post | null> {
  const posts = await allPosts()
  return posts.find((p) => p.name === name) || null
}
