import { Link as RouterLink } from '@tanstack/react-router'
import { Link as ChakraLink } from '@chakra-ui/react'
import type { LinkProps as ChakraLinkProps } from '@chakra-ui/react'
import { ExternalLinkIcon } from '@/components/icons'

export interface LinkProps extends ChakraLinkProps {
  href: string
  external?: boolean
  externalIcon?: boolean
}

export function Link({
  external = false,
  externalIcon = true,
  href,
  children,
  ...props
}: LinkProps) {
  // TanStack's Link only understands in-app routes. External hrefs — and the mailto:/https: links
  // in contact.tsx — must stay plain anchors.
  const content = (
    <>
      {children}
      {external && externalIcon ? <ExternalLinkIcon /> : <></>}
    </>
  )

  if (external) {
    return (
      <ChakraLink {...props} href={href} cursor="pointer">
        {content}
      </ChakraLink>
    )
  }

  return (
    <ChakraLink {...props} asChild cursor="pointer">
      <RouterLink to={href} preload="intent">
        {content}
      </RouterLink>
    </ChakraLink>
  )
}
