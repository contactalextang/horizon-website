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
  'Alex Tang — 独立开发者，专注用 AI 构建真实产品。新加坡餐饮 SaaS 膳云 MakanCloud 创始人，同时分享 AI 技术资讯、投资研究和构建日志。'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — 独立开发者 · AI 产品构建者`,
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
      'x-default': '/zh',
    },
  },
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    title: `${SITE_NAME} — 独立开发者 · AI 产品构建者`,
    description,
    url: SITE_URL,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} — 独立开发者 · AI 产品构建者`,
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
