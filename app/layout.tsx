import type { Metadata } from 'next'
import { EB_Garamond } from 'next/font/google'
import { SITE_NAME, SITE_URL } from '@/lib/site'
import './globals.css'

const garamond = EB_Garamond({
  subsets: ['latin'],
  variable: '--font-garamond',
  display: 'swap',
})

const description =
  'Alex Tang — building with AI in public. MakanCloud (膳云), a Singapore F&B operations SaaS, plus custom software, an AI-curated tech digest, and investing notes.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — building with AI`,
    template: `%s — ${SITE_NAME}`,
  },
  description,
  applicationName: SITE_NAME,
  authors: [{ name: 'Alex Tang' }],
  alternates: {
    canonical: '/',
    languages: {
      en: '/en',
      zh: '/zh',
      'x-default': '/en',
    },
  },
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    title: `${SITE_NAME} — building with AI`,
    description,
    url: SITE_URL,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} — building with AI`,
    description,
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html className={garamond.variable}>
      <body>{children}</body>
    </html>
  )
}
