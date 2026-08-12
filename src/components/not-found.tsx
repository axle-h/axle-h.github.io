import { Container, Heading, Stack, Text } from '@chakra-ui/react'
import { ButtonLink } from '@/components/button-link'

export function NotFound() {
  return (
    <Container py={8}>
      <Stack direction="column" alignItems="center" gap={4}>
        <Heading size="4xl" fontWeight="normal">
          404
        </Heading>
        <Text>Page cannot be found</Text>
        <ButtonLink
          href="/"
          colorPalette="brand"
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
        >
          Back Home
        </ButtonLink>
      </Stack>
    </Container>
  )
}
