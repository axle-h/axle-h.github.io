import {
  EarthIcon,
  EmailIcon,
  GitHubIcon,
  LinkedinIcon,
  MapMarkerIcon,
} from '@/components/icons'
import { ComponentWithAs, Link } from '@chakra-ui/react'
import { IconProps } from '@chakra-ui/icons'

interface SocialIconProps extends IconProps {
  iconOnly?: boolean
}

function socialIcon(
  Icon: ComponentWithAs<'svg', IconProps>,
  href: string,
  label: string,
  isExternal: boolean = true
) {
  return function SocialIcon({ iconOnly = false, ...props }: SocialIconProps) {
    return (
      <Link href={href} isExternal={isExternal}>
        <Icon {...props} /> {!iconOnly && label}
      </Link>
    )
  }
}

export const Email = socialIcon(
  EmailIcon,
  `mailto:${process.env.email}`,
  process.env.email!,
  false
)

export const Website = socialIcon(
  EarthIcon,
  `https://${process.env.website}`,
  process.env.website!
)

export const GitHub = socialIcon(
  GitHubIcon,
  `https://github.com/${process.env.github}`,
  process.env.github!
)

export const Linkedin = socialIcon(
  LinkedinIcon,
  `https://linkedin.com/in/${process.env.linkedin}`,
  process.env.linkedin!
)

export const GoogleMaps = socialIcon(
  MapMarkerIcon,
  `https://goo.gl/maps/${process.env.googleMaps}`,
  process.env.location!
)
