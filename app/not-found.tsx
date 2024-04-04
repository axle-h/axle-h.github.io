import { Button, Container, Heading, Link, Stack, Text } from '@chakra-ui/react'
import NextLink from 'next/link'

export default function NotFound() {
  return (
    <Container py={8}>
      <Stack direction="column" alignItems="center" spacing={4}>
        <Heading size="4xl" fontWeight="normal">
          404
        </Heading>
        <Text>Page cannot be found</Text>
        <Link as={NextLink} href="/">
          <Button
            as="span"
            colorScheme="brand"
            variant="outline"
            fontSize={{
              base: 'md',
              md: 'lg',
            }}
            px={{
              base: 8,
              md: 10,
            }}
            size="lg"
            w="full"
          >
            Back Home
          </Button>
        </Link>
      </Stack>
    </Container>
  )
}
