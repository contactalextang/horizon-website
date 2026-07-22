'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'

type Props = { locale: 'en' | 'zh' }

export default function Navbar({ locale }: Props) {
  const t = useTranslations('nav')
  const pathname = usePathname()
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)

  const basePath = pathname.replace(/^\/(en|zh)/, '') || '/'

  function isActive(href: string) {
    if (href === '/') return basePath === '/' || basePath === ''
    return basePath.startsWith(href)
  }

  function switchLocale(next: 'en' | 'zh') {
    const newPath = `/${next}${basePath}`
    router.push(newPath)
  }

  const today = new Date()
  const dateStr = today.toLocaleDateString('en-US', {
    year: 'numeric', month: '2-digit', day: '2-digit'
  }).replace(/(\d+)\/(\d+)\/(\d+)/, '$3·$1·$2')

  const navItems = [
    { href: '/daily', label: t('daily') },
    ...(locale === 'zh' ? [{ href: '/investment', label: t('investment') }] : []),
    { href: '/projects', label: t('projects') },
    { href: '/buildlog', label: t('buildlog') },
    { href: '/about', label: t('about') },
  ]

  function linkClass(href: string) {
    return `navbar-link${isActive(href) ? ' is-active' : ''}`
  }

  return (
    <nav className="navbar">
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Link href={`/${locale}`} className="navbar-logo">
          Alex Tang
        </Link>
      </div>

      {/* Nav links (desktop) */}
      <ul className="navbar-links">
        {navItems.map(item => (
          <li key={item.href}>
            <Link href={`/${locale}${item.href}`} className={linkClass(item.href)}>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>

      {/* Right: date + lang toggle + burger */}
      <div className="navbar-right">
        <span className="navbar-date">{dateStr}</span>
        <div className="navbar-lang">
          {(['en', 'zh'] as const).map(lang => (
            <button key={lang} onClick={() => switchLocale(lang)}
              className={`navbar-lang-btn${locale === lang ? ' is-active' : ''}`}>
              {lang === 'en' ? 'EN' : '中'}
            </button>
          ))}
        </div>
        <button
          className="navbar-burger"
          aria-label="Menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(o => !o)}
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="navbar-menu">
          {navItems.map(item => (
            <Link
              key={item.href}
              href={`/${locale}${item.href}`}
              className={linkClass(item.href)}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}
