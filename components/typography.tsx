import { Box, Heading, HeadingProps, Stack } from '@chakra-ui/react'

export function SectionHeading(props: HeadingProps) {
  return (
    <Heading
      as="h2"
      size="2xl"
      fontWeight="500"
      paddingStart={4}
      mt={0}
      mb={8}
      borderStartWidth="4px"
      borderStartColor="brand.200"
      _dark={{ borderStartColor: 'brand.600' }}
      textTransform="uppercase"
      {...props}
    />
  )
}

export function DataDefinition({
  title,
  value,
}: {
  title: string
  value: string
}) {
  return (
    <Stack
      as="dl"
      direction={{ base: 'column', md: 'row' }}
      gap={0}
      mb={{ base: 3, md: 0 }}
    >
      <Box as="dt" fontWeight="600" w={{ md: '17%' }}>
        {title}
      </Box>
      <Box as="dd" flex={1}>
        {value}
      </Box>
    </Stack>
  )
}
