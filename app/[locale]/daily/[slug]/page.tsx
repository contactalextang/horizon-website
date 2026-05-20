import { notFound } from 'next/navigation'
import { getAllDailyMeta, getDailyPost } from '@/lib/content'
import { routing } from '@/i18n/routing'
import ItemCard from '@/components/daily/ItemCard'

type Props = {
  params: Promise<{ locale: 'en' | 'zh'; slug: string }>
}

export async function generateStaticParams() {
  const params: { locale: string; slug: string }[] = []
  for (const locale of routing.locales) {
    const posts = getAllDailyMeta(locale)
    posts.forEach(p => params.push({ locale, slug: p.date }))
  }
  return params
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params
  const post = getDailyPost(slug, locale)
  if (!post) return {}
  return {
    title: `${post.title} — Horizon Daily`,
    description: `${post.itemCount} items selected from ${post.totalFetched} total`,
  }
}

export default async function DailyDetailPage({ params }: Props) {
  const { locale, slug } = await params
  const post = getDailyPost(slug, locale)
  if (!post) notFound()

  const altLocale = locale === 'en' ? 'zh' : 'en'
  const altSlug = `/${altLocale}/daily/${slug}`

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '0 24px 80px' }}>
      {/* Header */}
      <div style={{ padding: '36px 0 28px', borderBottom: '1px solid var(--line)', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
          <span style={{ fontFamily: "'Courier New',monospace", fontSize: '10px', letterSpacing: '.14em', color: 'var(--gold2)', textTransform: 'uppercase' }}>
            {slug.toUpperCase()} · {locale.toUpperCase()}
          </span>
          <span style={{ fontFamily: "'Courier New',monospace", fontSize: '9px', color: 'var(--text3)' }}>
            | <a href={altSlug} style={{ color: 'var(--text3)', textDecoration: 'none' }}>{altLocale.toUpperCase()} →</a>
          </span>
        </div>
        <h1 style={{ fontFamily: "'EB Garamond',var(--font-garamond),Georgia,serif", fontSize: '32px', fontWeight: 400, lineHeight: 1.15, color: 'var(--text)', marginBottom: '18px' }}>
          {locale === 'en' ? <><em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Intelligence</em> Digest</> : <><em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>智能</em>简报</>}
        </h1>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 0, alignItems: 'center', flexWrap: 'wrap' }}>
          {[
            { val: post.itemCount, lbl: locale === 'en' ? 'Selected' : '精选' },
            { val: post.totalFetched, lbl: locale === 'en' ? 'Fetched' : '采集' },
          ].map((s, i) => (
            <div key={i} style={{
              display: 'flex', flexDirection: 'column', gap: '2px',
              padding: '0 20px 0 0', marginRight: '20px',
              borderRight: i === 0 ? '1px solid var(--line2)' : 'none',
            }}>
              <span style={{ fontFamily: "'Courier New',monospace", fontSize: '20px', color: 'var(--text)', lineHeight: 1 }}>{s.val}</span>
              <span style={{ fontSize: '10px', color: 'var(--text3)' }}>{s.lbl}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Items */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
        <span style={{ fontFamily: "'Courier New',monospace", fontSize: '9px', letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--text3)' }}>
          {locale === 'en' ? 'Stories' : '资讯'}
        </span>
        <div style={{ flex: 1, height: '1px', background: 'var(--line)' }} />
        <span style={{ fontFamily: "'Courier New',monospace", fontSize: '9px', color: 'var(--text3)' }}>
          {post.items.length} {locale === 'en' ? 'items' : '条'}
        </span>
      </div>

      {post.items.map((item, i) => (
        <ItemCard key={item.index} item={item} animDelay={Math.min(i * 0.05, 0.5)} />
      ))}
    </div>
  )
}
