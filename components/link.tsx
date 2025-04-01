import NextLink from 'next/link'
import {
  Link as ChakraLink,
  LinkProps as ChakraLinkProps,
} from '@chakra-ui/react'
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
  return (
    <ChakraLink {...props} asChild cursor="pointer">
      <NextLink href={href} prefetch={!external}>
        {children}
        {external && externalIcon ? <ExternalLinkIcon /> : <></>}
      </NextLink>
    </ChakraLink>
  )
}
