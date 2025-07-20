import { MDXComponents } from 'mdx/types'
import {
  Box,
  Badge,
  Separator,
  Heading,
  HeadingProps,
  HStack,
  Image,
  ImageProps,
  LinkBox,
  LinkOverlay,
  List,
  Table,
  Text,
  SimpleGrid,
} from '@chakra-ui/react'
import { Children, ReactElement, ReactNode } from 'react'
import { CheckCircleIcon, LinkIcon, XIcon } from '@/components/icons'
import { Code } from 'bright'
import { findPostByName } from '@/posts'
import './mdx.css'
import { PintoraDiagram } from '@/components/diagram'
import { Latex } from '@/components/latex'
import { Link, LinkProps } from '@/components/link'
import { BarChart } from '@/components/chart/bar-chart'
import { LineChart } from '@/components/chart/line-chart'

function flatten(text: string, child: ReactNode): string {
  return typeof child === 'string'
    ? text + child
    : Children.toArray((child as ReactElement<any>).props.children).reduce(
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
    <LinkBox as="article" role="group" className="group">
      <LinkOverlay href={`#${slug}`}>
        <HStack w="full" gap={2} align="baseline" justify="flex-start">
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
  const external = hrefIsExternal(href) || href.endsWith('.pdf')

  return (
    <Link
      external={external}
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
  return (
    <List.Root gap={2} variant="plain">
      {children}
    </List.Root>
  )
}

function CheckListItem({ children }: { children: ReactNode }) {
  return (
    <List.Item>
      <List.Indicator asChild color="green.500">
        <CheckCircleIcon />
      </List.Indicator>
      {children}
    </List.Item>
  )
}

function XListItem({ children }: { children: ReactNode }) {
  return (
    <List.Item>
      <List.Indicator asChild color="red.500">
        <XIcon />
      </List.Indicator>
      {children}
    </List.Item>
  )
}

function NewListItem({ children }: { children: ReactNode }) {
  return (
    <List.Item>
      <Badge colorPalette="yellow">NEW</Badge>
      {children}
    </List.Item>
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
      mb={4}
      {...props}
    />
  ),
  a: (props: any) => <AppLink {...props} />,
  ul: (props: any) => <List.Root ms="1em" my={6} gap={2} {...props} />,
  ol: (props: any) => <List.Root as="ol" ms="1em" my={6} gap={2} {...props} />,
  li: (props: any) => <List.Item paddingStart={2} {...props} />,
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
  table: (props: any) => <Table.Root mb={4} variant="line" {...props} />,
  thead: (props: any) => <Table.Header {...props} />,
  tr: (props: any) => <Table.Row {...props} />,
  td: (props: any) => <Table.Cell {...props} />,
  th: (props: any) => (
    <Table.ColumnHeader
      color="brand.700"
      _dark={{ color: 'brand.200' }}
      textTransform="uppercase"
      {...props}
    />
  ),
  tfoot: (props: any) => <Table.Footer {...props} />,
  hr: (props) => <Separator my={{ base: 12, md: 14 }} {...props} />,
  pre: Code,
  PostLink,
  Badge,
  CheckList,
  CheckListItem,
  XListItem,
  NewListItem,
  PintoraDiagram,
  Latex,
  SimpleGrid,
  Box,
  Image,
  BarChart,
  LineChart,
}

function postImage(name: string) {
  return function PostImage({ src, ...props }: ImageProps) {
    return (
      <Image
        src={src === 'string' && hrefIsExternal(src) ? src : `/${name}/${src}`}
        alt={`${name}-${src}`}
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
