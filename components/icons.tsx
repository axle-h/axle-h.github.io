import { Icon, IconProps } from '@chakra-ui/react'
import { IconType } from 'react-icons'
import React from 'react'
import {
  FiLink,
  FiExternalLink,
  FiClock,
  FiCalendar,
  FiCheckCircle,
  FiArrowLeft,
  FiAtSign,
  FiGithub,
  FiLinkedin,
  FiGlobe,
  FiMapPin,
  FiUser,
  FiMail,
  FiMoon,
  FiSun,
} from 'react-icons/fi'

function toChakraIcon(IconType: IconType) {
  return function ChakraIcon(props: IconProps) {
    return (
      <Icon {...props}>
        <IconType />
      </Icon>
    )
  }
}

export const LinkIcon = toChakraIcon(FiLink)
export const ExternalLinkIcon = toChakraIcon(FiExternalLink)
export const TimeIcon = toChakraIcon(FiClock)
export const CalendarIcon = toChakraIcon(FiCalendar)
export const CheckCircleIcon = toChakraIcon(FiCheckCircle)
export const ArrowBackIcon = toChakraIcon(FiArrowLeft)
export const AtSignIcon = toChakraIcon(FiAtSign)
export const GitHubIcon = toChakraIcon(FiGithub)
export const LinkedinIcon = toChakraIcon(FiLinkedin)
export const EarthIcon = toChakraIcon(FiGlobe)
export const MapMarkerIcon = toChakraIcon(FiMapPin)
export const UserIcon = toChakraIcon(FiUser)
export const EmailIcon = toChakraIcon(FiMail)
export const MoonIcon = toChakraIcon(FiMoon)
export const SunIcon = toChakraIcon(FiSun)
