import type { Metadata } from 'next'
import { Providers } from '@/components/providers'
import { Rubik } from 'next/font/google'
import { Nav } from '@/components/nav'
import { ReactNode } from 'react'
import Analytics from '@/components/analytics'

const rubik = Rubik({
  subsets: ['latin'],
  variable: '--font-rubik',
})

export const metadata: Metadata = {
  title: 'Alex Haslehurst',
  description: 'Alex Haslehurst`s Personal Website',
}

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="msapplication-TileColor" content="#b91d47" />
        <meta name="theme-color" content="#ffffff" />

        <Analytics />
      </head>
      <body className={rubik.variable}>
        <Providers>
          <Nav />
          {children}
        </Providers>
      </body>
    </html>
  )
}
