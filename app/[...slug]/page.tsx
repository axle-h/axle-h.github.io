import { notFound } from 'next/navigation'
import { allPosts, findPostBySlug } from '@/posts'

import { Container, Flex, Heading, Image, List } from '@chakra-ui/react'
import { TimeIcon, CalendarIcon, UserIcon } from '@/components/icons'
import Date from '@/components/date'

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string[] }>
}) {
  const { slug } = await params
  const post = await findPostBySlug(slug)
  if (!post) {
    return notFound()
  }
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
            <Date date={post.date} />
          </List.Item>
          <List.Item>
            <List.Indicator asChild color="gray.500">
              <UserIcon />
            </List.Indicator>
            Alex Haslehurst
          </List.Item>
          <List.Item>
            <List.Indicator asChild color="gray.500">
              <TimeIcon />
            </List.Indicator>
            {post.readingTime}
          </List.Item>
        </List.Root>
        {post.content}
      </Container>
    </>
  )
}

export async function generateStaticParams() {
  const posts = await allPosts()
  return posts.map((post) => ({ slug: post.slug }))
}
