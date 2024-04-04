'use client'

import { Box, Button, Flex, Image, useColorMode } from '@chakra-ui/react'
import { Link } from '@chakra-ui/next-js'
import { MoonIcon, SunIcon } from '@chakra-ui/icons'
import { usePathname } from 'next/navigation'
import { ArrowBackIcon } from '@/components/icons'

export function Nav() {
  const pathName = usePathname()
  const { colorMode, toggleColorMode } = useColorMode()
  const isRoot = pathName === '/'
  return (
    <Box as="nav" bg="brand.800" px={4} _dark={{ bg: 'brand.900' }}>
      <Flex h={16} alignItems={'center'}>
        <Flex
          flex={1}
          justifyContent="flex-start"
          display={{ base: 'flex', md: isRoot ? 'none' : 'flex' }}
        >
          <Link href="/">
            <Button
              leftIcon={<ArrowBackIcon />}
              display={isRoot ? 'none' : 'flex'}
              variant="outline"
              color="white"
              _dark={{ color: 'gray.100' }}
              _hover={{ bg: 'gray.600' }}
            >
              Back
            </Button>
          </Link>
        </Flex>

        <Flex>
          <Link href="/">
            <Image
              borderRadius="full"
              boxSize="40px"
              src="/mugshot.png"
              alt="Alex"
              objectFit="cover"
            />
          </Link>
        </Flex>

        <Flex flex={1} justifyContent="flex-end">
          <Button
            onClick={toggleColorMode}
            variant="outline"
            _hover={{ bg: 'gray.600' }}
          >
            {colorMode === 'light' ? (
              <MoonIcon color="white" />
            ) : (
              <SunIcon color="gray.100" />
            )}
          </Button>
        </Flex>
      </Flex>
    </Box>
  )
}
