'use client'

import { createIcon } from '@chakra-ui/icons'
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons'
import {
  faEarthEurope,
  faMapMarkerAlt,
  faUser,
  faEnvelope,
} from '@fortawesome/free-solid-svg-icons'
import { IconDefinition } from '@fortawesome/fontawesome-common-types'

function wrapFontAwesome(icon: IconDefinition) {
  const [width, height, ligatures, unicode, path] = icon.icon
  return createIcon({
    displayName: icon.iconName,
    viewBox: `0 0 ${width} ${height}`,
    d: typeof path === 'string' ? path : path.join(' '),
    defaultProps: {},
  })
}

export const GitHubIcon = wrapFontAwesome(faGithub)
export const LinkedinIcon = wrapFontAwesome(faLinkedin)
export const EarthIcon = wrapFontAwesome(faEarthEurope)
export const MapMarkerIcon = wrapFontAwesome(faMapMarkerAlt)
export const UserIcon = wrapFontAwesome(faUser)

export const EmailIcon = wrapFontAwesome(faEnvelope)
