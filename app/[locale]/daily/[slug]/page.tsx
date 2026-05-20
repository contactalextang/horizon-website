import { notFound } from 'next/navigation'
import { getAllDailyMeta, getDailyPost } from '@/lib/content'
import { routing } from '@/i18n/routing'
import ItemCard from '@/components/daily/ItemCard'
import type { DailyItem } from '@/types/daily'

type Props = {
  params: Promise<{ locale: 'en' | 'zh'; slug: string }>
}

export async function generateStaticParams() {
  const params: { locale: string; slug: string }[] = []
  for (const locale of routing.locales) {
    const posts = getAllDailyMeta(locale)
    posts.forEach(p => params.push({ locale, slug: p.date }))
  }
  // Also generate from English for zh fallback
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

function LayerSection({
  num, label, badge, badgeStyle, items, locale,
}: {
  num: string; label: string; badge: string
  badgeStyle: { bg: string; color: string; border: string }
  items: DailyItem[]; locale: string
}) {
  if (items.length === 0) return null
  return (
    <div style={{ marginBottom: '28px' }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        marginBottom: '10px', paddingBottom: '8px',
        borderBottom: '1px solid var(--line)',
      }}>
        <span style={{ fontFamily: "'Courier New',monospace", fontSize: '10px', color: 'var(--gold)', letterSpacing: '.06em' }}>{num}</span>
        <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text)' }}>{label}</span>
        <span style={{ fontFamily: "'Courier New',monospace", fontSize: '9px', letterSpacing: '.08em', padding: '2px 8px', borderRadius: '3px', marginLeft: 'auto', background: badgeStyle.bg, color: badgeStyle.color, border: `1px solid ${badgeStyle.border}` }}>{badge}</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '10px' }}>
        {items.map((item, i) => (
          <ItemCard key={item.index} item={item} animDelay={Math.min(i * 0.04, 0.4)} />
        ))}
      </div>
    </div>
  )
}

export default async function DailyDetailPage({ params }: Props) {
  const { locale, slug } = await params
  const post = getDailyPost(slug, locale) ?? getDailyPost(slug, 'en')
  if (!post) notFound()

  const altLocale = locale === 'en' ? 'zh' : 'en'
  const altPost = getDailyPost(slug, altLocale)

  const critical  = post.items.filter(i => i.score >= 8)
  const important = post.items.filter(i => i.score >= 7 && i.score < 8)
  const notable   = post.items.filter(i => i.score >= 5 && i.score < 7)
  const low       = post.items.filter(i => i.score < 5)

  const layers = [
    { num: 'L1', label: locale === 'en' ? 'Critical'  : '重点',    badge: 'CRITICAL',  badgeStyle: { bg: 'var(--amberbg)', color: '#E89E30', border: 'rgba(212,130,10,.4)' }, items: critical },
    { num: 'L2', label: locale === 'en' ? 'Important' : '重要',    badge: 'IMPORTANT', badgeStyle: { bg: 'var(--goldbg2)', color: 'var(--gold)', border: 'var(--gold2)' }, items: important },
    { num: 'L3', label: locale === 'en' ? 'Notable'   : '值得关注', badge: 'NOTABLE',   badgeStyle: { bg: 'var(--greenbg)', color: '#4DC882', border: 'rgba(42,157,92,.3)' }, items: notable },
    { num: 'L4', label: locale === 'en' ? 'Mentions'  : '其他资讯', badge: 'MENTIONS',  badgeStyle: { bg: 'var(--bg4)', color: 'var(--text3)', border: 'var(--line2)' }, items: low },
  ]

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px 80px' }}>

      {/* Header */}
      <div style={{ padding: '28px 0 20px', borderBottom: '1px solid var(--line)', marginBottom: '24px' }}>
        <div style={{
          fontFamily: "'Courier New',monospace", fontSize: '10px',
          letterSpacing: '.14em', color: 'var(--gold2)',
          textTransform: 'uppercase', marginBottom: '8px',
          display: 'flex', alignItems: 'center', gap: '10px',
        }}>
          <span>{slug.toUpperCase()}</span>
          <span style={{ color: 'var(--text3)' }}>·</span>
          <span>{locale.toUpperCase()}</span>
          {altPost && (
            <><span style={{ color: 'var(--text3)' }}>·</span>
            <a href={`/${altLocale}/daily/${slug}`} style={{ color: 'var(--text3)', textDecoration: 'none', transition: 'color .15s' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text3)')}>
              {altLocale.toUpperCase()} →
            </a></>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <h1 style={{
            fontFamily: "'STSong','SimSun','Songti SC',Georgia,serif",
            fontSize: 'clamp(20px, 4vw, 28px)', fontWeight: 700,
            color: 'var(--text)',
          }}>
            {locale === 'en' ? 'Intelligence Digest' : '智能简报'}
          </h1>

          <div style={{ display: 'flex', gap: '20px' }}>
            {[
              { val: post.itemCount, lbl: locale === 'en' ? 'Selected' : '精选' },
              { val: post.totalFetched, lbl: locale === 'en' ? 'Fetched' : '采集' },
              { val: critical.length, lbl: 'L1' },
              { val: important.length, lbl: 'L2' },
              { val: notable.length, lbl: 'L3' },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: "'Courier New',monospace", fontSize: '16px', color: 'var(--text)', lineHeight: 1 }}>{s.val}</div>
                <div style={{ fontSize: '9px', color: 'var(--text3)', letterSpacing: '.06em', marginTop: '2px' }}>{s.lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Layer sections */}
      {layers.map(l => (
        <LayerSection key={l.num} locale={locale} {...l} />
      ))}
    </div>
  )
}
