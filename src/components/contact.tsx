import {
  EarthIcon,
  EmailIcon,
  GitHubIcon,
  LinkedinIcon,
  MapMarkerIcon,
} from '@/components/icons'
import type { IconProps } from '@chakra-ui/react'
import { Link } from '@/components/link'
import React from 'react'
import { contact } from '@/config'

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
  `mailto:${contact.email}`,
  contact.email,
  false
)

export const Website = socialIcon(
  EarthIcon,
  `https://${contact.website}`,
  contact.website
)

export const GitHub = socialIcon(
  GitHubIcon,
  `https://github.com/${contact.github}`,
  contact.github
)

export const Linkedin = socialIcon(
  LinkedinIcon,
  `https://linkedin.com/in/${contact.linkedin}`,
  contact.linkedin
)

export const GoogleMaps = socialIcon(
  MapMarkerIcon,
  `https://goo.gl/maps/${contact.googleMaps}`,
  contact.location
)
