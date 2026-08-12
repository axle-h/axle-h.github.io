import { Link as RouterLink } from '@tanstack/react-router'
import type { ButtonProps } from '@/components/ui/button'
import { Button } from '@/components/ui/button'

export interface ButtonLinkProps extends ButtonProps {
  href: string
}

/**
 * A button that navigates. `asChild` makes the anchor *be* the button, rather than nesting one
 * inside the other — nesting means inheriting Chakra's link recipe, which underlines its text on
 * hover, and in the case of a real <button> produces invalid markup.
 */
export function ButtonLink({ href, children, ...props }: ButtonLinkProps) {
  return (
    <Button asChild {...props}>
      <RouterLink to={href} preload="intent">
        {children}
      </RouterLink>
    </Button>
  )
}
