import { Container, Grid, GridItem } from '@chakra-ui/react'
import { allPosts } from '@/posts'
import PostLogo from '@/components/post-logo'
import { Hero } from '@/components/hero'

export default async function BlogHome() {
  const posts = await allPosts()
  return (
    <>
      <Hero />
      <Container py={4}>
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
