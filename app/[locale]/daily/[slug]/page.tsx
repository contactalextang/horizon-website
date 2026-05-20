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
  // zh fallback: generate from English dates too
  const enPosts = getAllDailyMeta('en')
  enPosts.forEach(p => {
    if (!params.find(x => x.locale === 'zh' && x.slug === p.date)) {
      params.push({ locale: 'zh', slug: p.date })
    }
  })
  return params
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params
  const post = getDailyPost(slug, locale) ?? getDailyPost(slug, 'en')
  if (!post) return {}
  return {
    title: `${post.title} — Horizon Daily`,
    description: `${post.itemCount} items selected from ${post.totalFetched} total`,
  }
}

export default async function DailyDetailPage({ params }: Props) {
  const { locale, slug } = await params
  const post = getDailyPost(slug, locale) ?? getDailyPost(slug, 'en')
  if (!post) notFound()

  const altLocale = locale === 'en' ? 'zh' : 'en'
  const altPost = getDailyPost(slug, altLocale)

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '0 24px 80px' }}>

      {/* Header */}
      <div style={{ padding: '36px 0 24px', borderBottom: '1px solid var(--line)', marginBottom: '22px' }}>
        <div style={{
          fontFamily: "'Courier New',monospace", fontSize: '10px',
          letterSpacing: '.14em', color: 'var(--gold2)',
          textTransform: 'uppercase', marginBottom: '10px',
          display: 'flex', alignItems: 'center', gap: '10px',
        }}>
          <span>{slug.toUpperCase()}</span>
          <span style={{ color: 'var(--text3)' }}>·</span>
          <span>{locale.toUpperCase()}</span>
          {altPost && (
            <>
              <span style={{ color: 'var(--text3)' }}>·</span>
              <a href={`/${altLocale}/daily/${slug}`} style={{ color: 'var(--text3)', textDecoration: 'none' }}>
                {altLocale.toUpperCase()} →
              </a>
            </>
          )}
        </div>

        <h1 style={{
          fontFamily: "'STSong','SimSun','Songti SC','EB Garamond',var(--font-garamond),Georgia,serif",
          fontSize: 'clamp(22px, 4vw, 32px)',
          fontWeight: locale === 'zh' ? 700 : 400,
          color: 'var(--text)', marginBottom: '16px',
        }}>
          {locale === 'zh'
            ? <><em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>智能</em>简报</>
            : <><em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>Intelligence</em> Digest</>
          }
        </h1>

        <div style={{ display: 'flex', gap: 0, alignItems: 'center' }}>
          {[
            { val: post.itemCount, lbl: locale === 'zh' ? '已选' : 'Selected' },
            { val: post.totalFetched, lbl: locale === 'zh' ? '采集' : 'Fetched' },
          ].map((s, i) => (
            <div key={i} style={{
              display: 'flex', flexDirection: 'column', gap: '2px',
              padding: '0 20px 0 0', marginRight: '20px',
              borderRight: i === 0 ? '1px solid var(--line2)' : 'none',
            }}>
              <span style={{ fontFamily: "'Courier New',monospace", fontSize: '18px', color: 'var(--text)', lineHeight: 1 }}>{s.val}</span>
              <span style={{ fontSize: '10px', color: 'var(--text3)' }}>{s.lbl}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Section header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
        <span style={{ fontFamily: "'Courier New',monospace", fontSize: '9px', letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--text3)' }}>
          {locale === 'zh' ? '资讯' : 'Stories'}
        </span>
        <div style={{ flex: 1, height: '1px', background: 'var(--line)' }} />
        <span style={{ fontFamily: "'Courier New',monospace", fontSize: '9px', color: 'var(--text3)' }}>
          {post.items.length} {locale === 'zh' ? '条' : 'items'}
        </span>
      </div>

      {/* Items list */}
      <div>
        {post.items.map((item, i) => (
          <ItemCard key={item.index} item={item} animDelay={Math.min(i * 0.04, 0.5)} />
        ))}
      </div>
    </div>
  )
}
