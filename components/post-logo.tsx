import { Post } from '@/posts'
import { Box, Heading, Image, Text } from '@chakra-ui/react'
import { CalendarIcon } from '@/components/icons'
import Date from '@/components/date'
import NextLink from 'next/link'

export default function PostLogo({ post }: { post: Post }) {
  return (
    <Box pos="relative" key={post.name} bgColor="black">
      <NextLink href={post.url}>
        <Image
          src={post.logo}
          alt={post.title}
          objectFit="cover"
          css={{
            maskImage: {
              base: 'linear-gradient(to bottom, black 50%, rgba(0, 0, 0, 0.3) 100%)',
              sm: 'linear-gradient(to bottom, black 60%, rgba(0, 0, 0, 0.3) 100%)',
              md: 'linear-gradient(to bottom, black 70%, rgba(0, 0, 0, 0.3) 100%)',
            },
          }}
          boxSize="full"
        />
      </NextLink>

      <Box pos="absolute" bottom="0" left="0" p={4} color="white">
        <Heading fontSize={{ base: 'md', md: 'lg' }}>
          <NextLink href={post.url}>{post.title}</NextLink>
        </Heading>
        <Text fontSize={{ base: 'sm', md: 'md' }}>
          <CalendarIcon mr={2} />
          <Date date={post.date} />
        </Text>
      </Box>
    </Box>
  )
}
