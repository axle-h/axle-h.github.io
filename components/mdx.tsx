import { MDXComponents } from 'mdx/types'
import {
  Badge,
  Divider,
  Heading,
  HeadingProps,
  HStack,
  Image,
  ImageProps,
  Link,
  LinkBox,
  LinkOverlay,
  LinkProps,
  List,
  ListIcon,
  ListItem,
  OrderedList,
  Table,
  Td,
  Text,
  Tfoot,
  Th,
  Thead,
  Tr,
  UnorderedList,
} from '@chakra-ui/react'
import { Children, ReactElement, ReactNode } from 'react'
import { CheckCircleIcon, ExternalLinkIcon, LinkIcon } from '@/components/icons'
import NextLink from 'next/link'
import { Code } from 'bright'
import { findPostByName } from '@/posts'
import './mdx.css'
import { PintoraDiagram } from '@/components/diagram'

function flatten(text: string, child: ReactNode): string {
  return typeof child === 'string'
    ? text + child
    : Children.toArray((child as ReactElement).props.children).reduce(
        flatten,
        text
      )
}

function DocsHeading({ children, ...props }: HeadingProps) {
  const text = Children.toArray(children).reduce(flatten, '')

  if (!text) {
    return <></>
  }

  const slug = text
    .toLowerCase()
    .trim()
    .replace(/[^a-zA-Z0-9-\s/]+/g, '')
    .replace(/ /g, '-')
    .replace(/(\/)$/, '') //should not end with a /

  return (
    <LinkBox as="article" role="group">
      <LinkOverlay href={`#${slug}`}>
        <HStack w="full" spacing={2} align="baseline" justify="flex-start">
          <Heading id={slug} css={{ scrollMarginTop: '24px' }} {...props}>
            {text}
          </Heading>

          <LinkIcon display="none" _groupHover={{ display: 'inline' }} />
        </HStack>
      </LinkOverlay>
    </LinkBox>
  )
}

function hrefIsExternal(href: string) {
  return /^https?:\/\//i.test(href)
}

function AppLink({ children, ...props }: LinkProps) {
  const href = props.href
  if (!href) return <></>
  const isExternal = hrefIsExternal(href) || href.endsWith('.pdf')

  return (
    <Link
      as={isExternal ? 'a' : NextLink}
      isExternal={isExternal}
      fontWeight={500}
      transitionProperty="common"
      transitionDuration="fast"
      transitionTimingFunction="east-out"
      cursor="pointer"
      textDecoration="none"
      outline="none"
      color="inherit"
      _hover={{
        textDecoration: 'underline',
      }}
      _focus={{
        boxShadow: 'outline',
      }}
      {...props}
    >
      {children}
      {isExternal ? <ExternalLinkIcon mx="2px" /> : <></>}
    </Link>
  )
}

async function PostLink({
  name,
  children,
}: {
  name: string
  children?: ReactNode
}) {
  const post = await findPostByName(name)
  if (!post) {
    throw new Error(`unknown post ${name}`)
  }
  return <AppLink href={post.url}>{children ?? post.title}</AppLink>
}

function CheckList({ children }: { children: ReactNode }) {
  return <List spacing={3}>{children}</List>
}

function CheckListItem({ children }: { children: ReactNode }) {
  return (
    <ListItem>
      <ListIcon as={CheckCircleIcon} color="green.500" />
      {children}
    </ListItem>
  )
}

function NewListItem({ children }: { children: ReactNode }) {
  return (
    <ListItem>
      <Badge colorScheme="yellow">NEW</Badge>
      {children}
    </ListItem>
  )
}

Code.theme = {
  dark: 'github-dark',
  light: 'github-light',
}

const components: MDXComponents = {
  h1: (props) => (
    <Heading
      as="h1"
      fontFamily="heading"
      fontWeight="bold"
      fontSize={{ base: '4xl', md: '5xl' }}
      my={{ base: 4, md: 6 }}
      {...props}
    />
  ),
  h2: (props) => (
    <DocsHeading
      as="h2"
      fontFamily="heading"
      fontWeight="bold"
      fontSize={{ base: '2xl', md: '3xl' }}
      my={{ base: 2, md: 4 }}
      {...props}
    />
  ),
  h3: (props) => (
    <DocsHeading
      as="h3"
      fontFamily="heading"
      fontWeight="semibold"
      fontSize={{ base: 'xl', md: '2xl' }}
      my={{ base: 2, md: 4 }}
      {...props}
    />
  ),
  h4: (props) => (
    <DocsHeading
      as="h4"
      fontFamily="heading"
      fontWeight="semibold"
      fontSize={{ base: 'md', md: 'lg' }}
      mt={{ base: 2, md: 4 }}
      mb={2}
      {...props}
    />
  ),
  h5: (props) => (
    <DocsHeading
      as="h5"
      fontFamily="heading"
      fontWeight="semibold"
      fontSize="md"
      mt={{ base: 2, md: 4 }}
      mb={2}
      {...props}
    />
  ),
  h6: (props) => (
    <DocsHeading
      as="h6"
      fontFamily="heading"
      fontWeight="semibold"
      fontSize="md"
      mt={{ base: 2, md: 4 }}
      mb={2}
      {...props}
    />
  ),
  p: (props: any) => (
    <Text
      fontFamily="body"
      fontWeight="normal"
      fontSize="md"
      lineHeight={6}
      mb={4}
      {...props}
    />
  ),
  a: AppLink,
  ul: (props: any) => (
    <UnorderedList my={6} listStyleType="disc" spacing={2} {...props} />
  ),
  ol: (props: any) => <OrderedList my={6} spacing={2} {...props} />,
  li: (props: any) => <ListItem paddingStart={2} {...props} />,
  blockquote: (props: any) => (
    <Text
      as="blockquote"
      fontStyle="italic"
      fontWeight="semibold"
      paddingStart={4}
      mb={4}
      borderStartWidth="4px"
      borderStartColor="gray.200"
      _dark={{ borderStartColor: 'gray.600' }}
      {...props}
    />
  ),
  table: Table,
  thead: Thead,
  tr: Tr,
  td: Td,
  th: Th,
  tfoot: Tfoot,
  hr: (props) => (
    <Divider
      borderColor="gray.200"
      _dark={{ borderColor: 'gray.600' }}
      my={{ base: 12, md: 14 }}
      {...props}
    />
  ),
  pre: Code,
  PostLink,
  Badge,
  CheckList,
  CheckListItem,
  NewListItem,
  PintoraDiagram,
}

function postImage(name: string) {
  return function PostImage({ src, ...props }: ImageProps) {
    return (
      <Image
        src={src === 'string' && hrefIsExternal(src) ? src : `/${name}/${src}`}
        maxW={{ sm: 450, md: 600, lg: 800 }}
        mx="auto"
        {...props}
      />
    )
  }
}

export function postComponents(name: string): MDXComponents {
  return {
    ...components,
    img: postImage(name),
  }
}
