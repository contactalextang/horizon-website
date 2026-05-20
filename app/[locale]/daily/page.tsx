import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { getAllDailyMeta } from '@/lib/content'

type Props = { params: Promise<{ locale: 'en' | 'zh' }> }

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'daily' })
  return { title: `${t('listTitle')} — Horizon Daily` }
}

export default async function DailyListPage({ params }: Props) {
  const { locale } = await params
  const posts = getAllDailyMeta(locale)

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '0 24px 80px' }}>
      <div style={{ padding: '36px 0 24px', borderBottom: '1px solid var(--line)', marginBottom: '24px' }}>
        <div style={{ fontFamily: "'Courier New',monospace", fontSize: '10px', letterSpacing: '.14em', color: 'var(--gold2)', textTransform: 'uppercase', marginBottom: '10px' }}>
          {locale === 'en' ? 'Archive' : '归档'}
        </div>
        <h1 style={{ fontFamily: "'EB Garamond',var(--font-garamond),Georgia,serif", fontSize: '32px', fontWeight: 400, color: 'var(--text)' }}>
          {locale === 'en' ? 'Daily Archive' : '简报归档'}
        </h1>
      </div>

      {posts.length === 0 ? (
        <p style={{ fontSize: '13px', color: 'var(--text2)' }}>
          {locale === 'en' ? 'No digests yet.' : '暂无简报。'}
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {posts.map(post => (
            <Link key={post.slug} href={`/${locale}/daily/${post.date}`} style={{ textDecoration: 'none' }}>
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '14px 18px', background: 'var(--bg2)', border: '1px solid var(--line2)',
                borderRadius: 'var(--r2)', transition: 'all .18s', cursor: 'pointer',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = 'var(--bg3)'; (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--line3)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'var(--bg2)'; (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--line2)' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <span style={{ fontFamily: "'Courier New',monospace", fontSize: '11px', color: 'var(--gold)', letterSpacing: '.06em' }}>
                    {post.date}
                  </span>
                  <span style={{ fontFamily: "'EB Garamond',Georgia,serif", fontSize: '14px', color: 'var(--text)' }}>
                    {post.itemCount} {locale === 'en' ? 'items selected' : '条精选'}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {post.topTags.slice(0, 3).map(tag => (
                    <span key={tag} style={{ fontFamily: "'Courier New',monospace", fontSize: '9px', padding: '2px 6px', borderRadius: '3px', background: 'var(--bg4)', color: 'var(--text3)', border: '1px solid var(--line2)' }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
