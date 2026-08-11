import { createFileRoute } from '@tanstack/react-router'
import { Container, Grid, GridItem } from '@chakra-ui/react'
import { allPosts } from '@/posts'
import PostLogo from '@/components/post-logo'
import { Hero } from '@/components/hero'

export const Route = createFileRoute('/')({ component: BlogHome })

function BlogHome() {
  const posts = allPosts()
  return (
    <>
      <Hero />
      <Container mt={6} mb={12}>
        <Grid
          templateColumns={{ base: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
          gap={6}
        >
          {posts.map((post) => (
            <GridItem key={post.url}>
              <PostLogo post={post} />
            </GridItem>
          ))}
        </Grid>
      </Container>
    </>
  )
}
