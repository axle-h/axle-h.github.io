declare module 'virtual:posts' {
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
  export const posts: PostMetaJson[]
}
