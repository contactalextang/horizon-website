import type { Metadata } from 'next'
import { EB_Garamond } from 'next/font/google'
import './globals.css'

const garamond = EB_Garamond({
  subsets: ['latin'],
  variable: '--font-garamond',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Horizon Daily',
  description: 'AI-curated daily digest of tech and research news',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html className={garamond.variable}>
      <body>{children}</body>
    </html>
  )
}
