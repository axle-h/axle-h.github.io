import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Container, Flex, Grid, GridItem } from '@chakra-ui/react'
import { allPosts } from '@/posts'
import PostLogo from '@/components/post-logo'
import { Hero } from '@/components/hero'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/')({ component: BlogHome })

const PAGE_SIZE = 6

function BlogHome() {
  const posts = allPosts()
  const [visible, setVisible] = useState(PAGE_SIZE)
  return (
    <>
      <Hero />
      <Container mt={6} mb={12}>
        <Grid
          templateColumns={{ base: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
          gap={6}
        >
          {posts.slice(0, visible).map((post) => (
            <GridItem key={post.url}>
              <PostLogo post={post} />
            </GridItem>
          ))}
        </Grid>
        {visible < posts.length && (
          <Flex justifyContent="center" mt={8}>
            <Button
              colorPalette="brand"
              variant="outline"
              size="lg"
              px={10}
              fontWeight="extrabold"
              onClick={() => setVisible((v) => v + PAGE_SIZE)}
            >
              Show more
            </Button>
          </Flex>
        )}
      </Container>
    </>
  )
}
