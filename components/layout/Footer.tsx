import { useTranslations } from 'next-intl'

export default function Footer() {
  const t = useTranslations('footer')

  return (
    <footer style={{
      borderTop: '1px solid var(--line)', padding: '20px 24px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      maxWidth: '960px', margin: '0 auto', width: '100%',
    }}>
      <span style={{
        fontFamily: "'STSong','SimSun','Songti SC',Georgia,serif",
        fontSize: '14px', fontWeight: 700, color: 'var(--gold)',
      }}>
        Horizon
      </span>
      <div style={{ display: 'flex', gap: '18px' }}>
        {[
          { href: 'https://github.com/contactalextang/horizon-website', label: 'GitHub' },
          { href: '/rss.xml', label: 'RSS' },
        ].map(link => (
          <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" style={{
            fontFamily: "'Courier New',monospace", fontSize: '10px',
            color: 'var(--text3)', textDecoration: 'none', letterSpacing: '.06em',
            transition: 'color .15s',
          }}>
            {link.label}
          </a>
        ))}
      </div>
      <span style={{ fontFamily: "'Courier New',monospace", fontSize: '9px', color: 'var(--text3)', letterSpacing: '.04em' }}>
        {t('copy')}
      </span>
    </footer>
  )
}
