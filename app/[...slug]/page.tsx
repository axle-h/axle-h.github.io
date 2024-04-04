import { notFound } from 'next/navigation'
import { allPosts, findPostBySlug } from '@/posts'
import { components } from '@/components/mdx'
import { MDXRemote } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'
import readingTime from 'reading-time'

import {
  Container,
  Heading,
  Image,
  List,
  ListIcon,
  ListItem,
} from '@chakra-ui/react'
import { TimeIcon, CalendarIcon, UserIcon } from '@/components/icons'
import Date from '@/components/date'

const options = {
  mdxOptions: {
    remarkPlugins: [remarkGfm],
  },
}

export default async function PostPage({
  params: { slug },
}: {
  params: { slug: string[] }
}) {
  const post = await findPostBySlug(slug)
  if (!post) {
    return notFound()
  }
  return (
    <>
      <Container maxW={1000} px={{ base: 0, md: 4 }} pt={{ base: 0, md: 4 }}>
        <Image
          objectFit="cover"
          src={post.banner}
          w="100%"
          maxW={{ base: '100%', md: 1000 }}
          alt={post.title}
        />
      </Container>

      <Container>
        <Heading mt={{ base: 4, md: 6, lg: 12 }} mb={4}>
          {post.title}
        </Heading>

        <List spacing={1} mb={4}>
          <ListItem>
            <ListIcon as={CalendarIcon} color="gray.500" />
            <Date date={post.date} />
          </ListItem>
          <ListItem>
            <ListIcon as={UserIcon} color="gray.500" />
            Alex Haslehurst
          </ListItem>
          <ListItem>
            <ListIcon as={TimeIcon} color="gray.500" />
            {readingTime(post.content).text}
          </ListItem>
        </List>

        <MDXRemote
          source={post.content}
          options={options as any}
          components={components}
        />
      </Container>
    </>
  )
}

export async function generateStaticParams() {
  const posts = await allPosts()
  return posts.map((post) => ({ slug: post.slug }))
}
