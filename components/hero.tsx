import {
  Image,
  Box,
  Icon,
  Heading,
  Text,
  Link,
  Button,
  Container,
} from '@chakra-ui/react'
import NextLink from 'next/link'
import { Email, GitHub, Linkedin } from '@/components/contact'

const bg = 'white'
const bgDark = 'gray.800'

export function Hero() {
  return (
    <Container maxW="1200px" px={{ base: 4, lg: 0 }}>
      <Box pos="relative" overflow="hidden" bg={bg} _dark={{ bg: bgDark }}>
        <Box
          pos="relative"
          pb={{
            base: 8,
            sm: 16,
            md: 20,
            lg: 28,
            xl: 32,
          }}
          maxW={{
            lg: 'xl',
          }}
          w={{
            lg: '50%',
          }}
          zIndex={1}
          bg={bg}
          _dark={{ bg: bgDark }}
          border="solid 1px transparent"
        >
          <Icon
            display={{
              base: 'none',
              lg: 'block',
            }}
            position="absolute"
            right={0}
            top={0}
            bottom={0}
            h="full"
            w={48}
            color={bg}
            _dark={{ color: bgDark }}
            transform="translateX(50%)"
            fill="currentColor"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <polygon points="50,0 100,0 50,100 0,100" />
          </Icon>
          <Box
            pl={{
              base: 4,
              sm: 6,
              lg: 8,
            }}
            pr={{
              base: 4,
              sm: 6,
              lg: 16,
            }}
            mt={{
              base: 10,
              sm: 12,
              md: 16,
              lg: 20,
              xl: 28,
            }}
          >
            <Box
              w="full"
              textAlign={{
                sm: 'center',
                lg: 'left',
              }}
              justifyContent="center"
              alignItems="center"
            >
              <Heading
                as="h1"
                fontSize={{
                  base: '4xl',
                  sm: '5xl',
                  md: '6xl',
                }}
                letterSpacing="tight"
                lineHeight="short"
                fontWeight="extrabold"
                color="gray.900"
                _dark={{
                  color: 'white',
                }}
              >
                Alex Haslehurst
              </Heading>
              <Heading
                as="h2"
                fontSize={{
                  base: '2xl',
                  sm: '3xl',
                  md: '4xl',
                }}
                letterSpacing="tight"
                lineHeight="short"
                fontWeight="extrabold"
                color="brand.600"
                _dark={{
                  color: 'brand.400',
                }}
              >
                Software Developer
              </Heading>
              <Box my={3}>
                <Email iconOnly boxSize="2em" />
                <GitHub iconOnly boxSize="2em" />
                <Linkedin iconOnly boxSize="2em" />
              </Box>
              <Text
                mt={{
                  base: 3,
                  sm: 5,
                  md: 5,
                }}
                fontSize={{
                  sm: 'lg',
                  md: 'xl',
                }}
                maxW={{
                  sm: 'xl',
                }}
                mx={{
                  sm: 'auto',
                  lg: 0,
                }}
                color="gray.500"
              >
                Hi, I&apos;m Alex, a software developer with over 10 years
                experience across many industries, platforms and within
                government.
              </Text>
              <Box
                mt={{
                  base: 5,
                  sm: 8,
                }}
                display={{
                  sm: 'flex',
                }}
                justifyContent={{
                  sm: 'center',
                  lg: 'start',
                }}
                fontWeight="extrabold"
              >
                <Link as={NextLink} href="/cv">
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
                    About Me
                  </Button>
                </Link>
              </Box>
            </Box>
          </Box>
        </Box>
        <Box
          position={{
            lg: 'absolute',
          }}
          top={{
            lg: 0,
          }}
          bottom={{
            lg: 0,
          }}
          right={{
            lg: 0,
          }}
          w={{
            lg: '60%',
          }}
          border="solid 1px transparent"
          display={{ base: 'none', lg: 'block' }}
        >
          <Image
            h={[56, 72, 96, 'full']}
            w="full"
            fit="cover"
            src="/rock.jpg"
            alt=""
            loading="lazy"
          />
        </Box>
      </Box>
    </Container>
  )
}
