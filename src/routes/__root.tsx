import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { Providers } from '@/components/providers'
import { Nav } from '@/components/nav'
import { NotFound } from '@/components/not-found'
import { COLOR_MODE_SCRIPT } from '@/components/ui/color-mode'
import { site } from '@/config'

import '@fontsource-variable/rubik'
import '@/global.css'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: site.title },
      { name: 'description', content: site.description },
      { name: 'msapplication-TileColor', content: '#b91d47' },
      { name: 'theme-color', content: '#ffffff' },
    ],
    links: [
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: '/apple-touch-icon.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: '/favicon-32x32.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: '/favicon-16x16.png',
      },
      { rel: 'manifest', href: '/site.webmanifest' },
      { rel: 'alternate', type: 'application/rss+xml', href: '/rss.xml' },
    ],
  }),
  notFoundComponent: NotFound,
  shellComponent: RootDocument,
})

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Must run before paint, and before anything else in <head>, to avoid a theme flash. */}
        <script dangerouslySetInnerHTML={{ __html: COLOR_MODE_SCRIPT }} />
        <HeadContent />
      </head>
      <body>
        <Providers>
          <Nav />
          {children}
        </Providers>
        <Scripts />
      </body>
    </html>
  )
}
