'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'

type Props = { locale: 'en' | 'zh' }

export default function Navbar({ locale }: Props) {
  const t = useTranslations('nav')
  const pathname = usePathname()
  const router = useRouter()

  // Strip leading locale prefix to get the base path
  const basePath = pathname.replace(/^\/(en|zh)/, '') || '/'

  function isActive(href: string) {
    if (href === '/') return basePath === '/' || basePath === ''
    return basePath.startsWith(href)
  }

  function switchLocale(next: 'en' | 'zh') {
    const newPath = `/${next}${basePath}`
    router.push(newPath)
  }

  // Format today's date
  const today = new Date()
  const dateStr = today.toLocaleDateString('en-US', {
    year: 'numeric', month: '2-digit', day: '2-digit'
  }).replace(/(\d+)\/(\d+)\/(\d+)/, '$3·$1·$2')

  const navItems = [
    { href: '/daily', label: t('daily') },
    { href: '/projects', label: t('projects') },
    { href: '/about', label: t('about') },
  ]

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100, height: '50px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 24px', borderBottom: '1px solid var(--line)', gap: '12px',
      background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(16px)',
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Link href={`/${locale}`} style={{
          fontFamily: "'STSong','SimSun','Songti SC',Georgia,serif",
          fontSize: '16px', fontWeight: 700,
          color: 'var(--gold)', letterSpacing: '.06em', textDecoration: 'none',
        }}>
          Horizon
          <span style={{ color: 'var(--text3)', margin: '0 6px', fontSize: '10px' }}>·</span>
          <span style={{ fontSize: '10px', color: 'var(--text3)', fontFamily: "'Courier New',monospace", letterSpacing: '.1em' }}>
            DAILY
          </span>
        </Link>
      </div>

      {/* Nav links */}
      <ul style={{ display: 'flex', alignItems: 'center', gap: '2px', listStyle: 'none', flex: 1 }}>
        {navItems.map(item => (
          <li key={item.href}>
            <Link href={`/${locale}${item.href}`} style={{
              display: 'block', padding: '5px 11px', fontSize: '12px',
              color: isActive(item.href) ? 'var(--gold)' : 'var(--text2)',
              textDecoration: 'none', borderRadius: 'var(--r)',
              border: `1px solid ${isActive(item.href) ? 'var(--gold2)' : 'transparent'}`,
              background: isActive(item.href) ? 'var(--goldbg)' : 'transparent',
              transition: 'all .15s',
            }}>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>

      {/* Right: date + lang toggle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
        <span style={{ fontFamily: "'Courier New',monospace", fontSize: '10px', color: 'var(--text3)', letterSpacing: '.06em' }}>
          {dateStr}
        </span>
        <div style={{
          display: 'flex', alignItems: 'center',
          background: 'var(--bg3)', border: '1px solid var(--line2)',
          borderRadius: '16px', padding: '2px', gap: '2px',
        }}>
          {(['en', 'zh'] as const).map(lang => (
            <button key={lang} onClick={() => switchLocale(lang)} style={{
              padding: '3px 10px', borderRadius: '12px',
              fontFamily: "'Courier New',monospace", fontSize: '10px', fontWeight: 600,
              letterSpacing: '.06em', cursor: 'pointer', border: locale === lang ? '1px solid var(--gold2)' : 'none',
              background: locale === lang ? 'var(--goldbg2)' : 'transparent',
              color: locale === lang ? 'var(--gold)' : 'var(--text3)',
              transition: 'all .18s',
            }}>
              {lang === 'en' ? 'EN' : '中'}
            </button>
          ))}
        </div>
      </div>
    </nav>
  )
}
