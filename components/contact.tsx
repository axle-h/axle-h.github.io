import {
  EarthIcon,
  EmailIcon,
  GitHubIcon,
  LinkedinIcon,
  MapMarkerIcon,
} from '@/components/icons'
import { IconProps } from '@chakra-ui/react'
import { Link } from '@/components/link'
import React from 'react'

interface SocialIconProps extends IconProps {
  iconOnly?: boolean
}

function socialIcon(
  Icon: React.ComponentType<IconProps>,
  href: string,
  label: string,
  isExternal: boolean = true
) {
  return function SocialIcon({ iconOnly = false, ...props }: SocialIconProps) {
    return (
      <Link href={href} external={isExternal} externalIcon={false}>
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
