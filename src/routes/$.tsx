import { createFileRoute, notFound } from '@tanstack/react-router'
import { Suspense } from 'react'
import { Container, Flex, Heading, Image, List } from '@chakra-ui/react'
import { TimeIcon, CalendarIcon, UserIcon } from '@/components/icons'
import PostDate from '@/components/date'
import { NotFound } from '@/components/not-found'
import { findPostBySlug } from '@/posts'
import { loadPostContent, usePostContent } from '@/posts/content'
import { postComponents } from '@/components/mdx'
import { site } from '@/config'

export const Route = createFileRoute('/$')({
  loader: async ({ params }) => {
    const slug = (params._splat ?? '').split('/').filter(Boolean)
    const post = findPostBySlug(slug)
    if (!post) throw notFound()
    // Prime the content cache so the prerendered HTML is complete.
    await loadPostContent(post.filename)
    return post
  },
  head: ({ loaderData: post }) => {
    if (!post) return {}
    const url = `${site.origin}${post.url}`
    const banner = `${site.origin}${post.banner}`
    return {
      meta: [
        { title: `${post.title} | ${site.title}` },
        { name: 'author', content: site.author },
        { property: 'og:type', content: 'article' },
        { property: 'og:title', content: post.title },
        { property: 'og:url', content: url },
        { property: 'og:image', content: banner },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: post.title },
        { name: 'twitter:image', content: banner },
      ],
      links: [{ rel: 'canonical', href: url }],
    }
  },
  notFoundComponent: NotFound,
  component: PostPage,
})

function PostPage() {
  const post = Route.useLoaderData()
  return (
    <>
      <Flex
        w="100%"
        px={{ base: 0, md: 4 }}
        pt={{ base: 0, md: 4 }}
        justifyContent="center"
      >
        <Image
          objectFit="cover"
          src={post.banner}
          w="100%"
          maxW={{ base: '100%', md: 600 }}
          alt={post.title}
        />
      </Flex>

      <Container pb={12}>
        <Heading size="4xl" mt={{ base: 4, md: 6, lg: 12 }} mb={4}>
          {post.title}
        </Heading>

        <List.Root gap={1} mb={4} variant="plain">
          <List.Item>
            <List.Indicator asChild color="gray.500">
              <CalendarIcon />
            </List.Indicator>
            <PostDate date={post.date} />
          </List.Item>
          <List.Item>
            <List.Indicator asChild color="gray.500">
              <UserIcon />
            </List.Indicator>
            {site.author}
          </List.Item>
          <List.Item>
            <List.Indicator asChild color="gray.500">
              <TimeIcon />
            </List.Indicator>
            {post.readingTime}
          </List.Item>
        </List.Root>

        <Suspense fallback={null}>
          <PostContent filename={post.filename} name={post.name} />
        </Suspense>
      </Container>
    </>
  )
}

function PostContent({ filename, name }: { filename: string; name: string }) {
  // Not a component created during render: usePostContent returns the same cached module export
  // on every call for a given filename, so the identity is stable and state is never reset.
  const Content = usePostContent(filename)
  // eslint-disable-next-line react-hooks/static-components
  return <Content components={postComponents(name)} />
}
