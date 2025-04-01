'use client'

import {
  createSystem,
  defaultConfig,
  ChakraProvider,
  defineConfig,
} from '@chakra-ui/react'
import { ReactNode } from 'react'
import { ColorModeProvider } from '@/components/ui/color-mode'

const system = createSystem(
  defaultConfig,
  defineConfig({
    globalCss: {
      html: {
        colorPalette: 'gray',
      },
    },
    theme: {
      tokens: {
        fonts: {
          heading: { value: 'var(--font-rubik)' },
          body: { value: 'var(--font-rubik)' },
        },
        colors: {
          brand: {
            50: { value: '#E7F3FE' },
            100: { value: '#BADCFC' },
            200: { value: '#8EC6FA' },
            300: { value: '#62B0F8' },
            400: { value: '#369AF7' },
            500: { value: '#0A84F5' },
            600: { value: '#0869C4' },
            700: { value: '#064F93' },
            800: { value: '#043562' },
            900: { value: '#021A31' },
          },
          red: {
            50: { value: '#FDE7E7' },
            100: { value: '#FABDBD' },
            200: { value: '#F69393' },
            300: { value: '#F36868' },
            400: { value: '#EF3E3E' },
            500: { value: '#EC1313' },
            600: { value: '#BD0F0F' },
            700: { value: '#8D0C0C' },
            800: { value: '#5E0808' },
            900: { value: '#2F0404' },
          },
          orange: {
            50: { value: '#FDF0E7' },
            100: { value: '#FAD5BD' },
            200: { value: '#F6BA93' },
            300: { value: '#F29E68' },
            400: { value: '#EF833E' },
            500: { value: '#EB6814' },
            600: { value: '#BC5310' },
            700: { value: '#8D3F0C' },
            800: { value: '#5E2A08' },
            900: { value: '#2F1504' },
          },
          gray: {
            50: { value: '#EDF1F8' },
            100: { value: '#CCD9EA' },
            200: { value: '#ACC0DD' },
            300: { value: '#8BA7D0' },
            400: { value: '#6B8EC2' },
            500: { value: '#4A76B5' },
            600: { value: '#3B5E91' },
            700: { value: '#2C476D' },
            800: { value: '#1E2F48' },
            900: { value: '#0F1824' },
          },
          purple: {
            50: { value: '#EEE8FD' },
            100: { value: '#CFBDF9' },
            200: { value: '#B193F6' },
            300: { value: '#9269F2' },
            400: { value: '#743FEE' },
            500: { value: '#5514EB' },
            600: { value: '#4410BC' },
            700: { value: '#330C8D' },
            800: { value: '#22085E' },
            900: { value: '#11042F' },
          },
          yellow: {
            50: { value: '#FEF6E7' },
            100: { value: '#FCE6BB' },
            200: { value: '#FAD68F' },
            300: { value: '#F8C663' },
            400: { value: '#F5B538' },
            500: { value: '#F3A50C' },
            600: { value: '#C38409' },
            700: { value: '#926307' },
            800: { value: '#614205' },
            900: { value: '#312102' },
          },
          green: {
            50: { value: '#ECF9F1' },
            100: { value: '#C9EDD9' },
            200: { value: '#A7E2C1' },
            300: { value: '#85D6A8' },
            400: { value: '#62CB90' },
            500: { value: '#40BF78' },
            600: { value: '#339960' },
            700: { value: '#267348' },
            800: { value: '#1A4D30' },
            900: { value: '#0D2618' },
          },
          blue: {
            50: { value: '#E7F3FE' },
            100: { value: '#BADCFC' },
            200: { value: '#8EC6FA' },
            300: { value: '#62B0F8' },
            400: { value: '#369AF7' },
            500: { value: '#0A84F5' },
            600: { value: '#0869C4' },
            700: { value: '#064F93' },
            800: { value: '#043562' },
            900: { value: '#021A31' },
          },
          pink: {
            50: { value: '#FDE8F2' },
            100: { value: '#F9BDDC' },
            200: { value: '#F693C5' },
            300: { value: '#F269AF' },
            400: { value: '#EE3F98' },
            500: { value: '#EB1482' },
            600: { value: '#BC1068' },
            700: { value: '#8D0C4E' },
            800: { value: '#5E0834' },
            900: { value: '#2F041A' },
          },
        },
      },
      semanticTokens: {
        colors: {
          bg: {
            value: {
              _light: 'white',
              _dark: '{colors.gray.800}',
            },
          },
          border: {
            value: {
              _light: '{colors.brand.100}',
              _dark: '{colors.brand.300/40}',
            },
          },
          brand: {
            solid: { value: '{colors.brand.500}' },
            contrast: { value: '{colors.brand.100}' },
            fg: {
              value: {
                _light: '{colors.brand.700}',
                _dark: '{colors.brand.200}',
              },
            },
            muted: { value: '{colors.brand.400}' },
            subtle: {
              value: {
                _light: '{colors.brand.50}',
                _dark: '{colors.brand.800}',
              },
            },
            emphasized: { value: '{colors.brand.300}' },
            focusRing: { value: '{colors.brand.500}' },
          },
        },
      },
    },
  })
)

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ChakraProvider value={system}>
      <ColorModeProvider>{children}</ColorModeProvider>
    </ChakraProvider>
  )
}
