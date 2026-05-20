import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { getAllDailyMeta, getFeaturedProjects, getDailyPost } from '@/lib/content'
import ItemCard from '@/components/daily/ItemCard'
import type { DailyItem } from '@/types/daily'

type Props = { params: Promise<{ locale: 'en' | 'zh' }> }

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'home' })
  return { title: `Horizon Daily — ${t('eyebrow')}` }
}

function LayerHeader({
  num, label, badge, badgeStyle,
}: {
  num: string
  label: string
  badge: string
  badgeStyle: { bg: string; color: string; border: string }
}) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '10px',
      marginBottom: '10px', paddingBottom: '8px',
      borderBottom: '1px solid var(--line)',
    }}>
      <span style={{
        fontFamily: "'Courier New',monospace", fontSize: '10px',
        color: 'var(--gold)', letterSpacing: '.06em',
      }}>{num}</span>
      <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text)' }}>{label}</span>
      <span style={{
        fontFamily: "'Courier New',monospace", fontSize: '9px',
        letterSpacing: '.08em', padding: '2px 8px', borderRadius: '3px',
        marginLeft: 'auto',
        background: badgeStyle.bg, color: badgeStyle.color,
        border: `1px solid ${badgeStyle.border}`,
      }}>{badge}</span>
    </div>
  )
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params

  const allDays = getAllDailyMeta(locale)
  const displayLocale: 'en' | 'zh' = allDays.length > 0 ? locale : 'en'
  const allDaysDisplay = displayLocale === locale ? allDays : getAllDailyMeta('en')
  const latestMeta = allDaysDisplay[0] || null
  const latestPost = latestMeta ? getDailyPost(latestMeta.date, displayLocale) : null
  const featuredProjects = getFeaturedProjects()

  const today = new Date()
  const dateStr = today.toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  }).toUpperCase()

  // Group items into layers by score
  const critical: DailyItem[] = []  // 8+
  const important: DailyItem[] = [] // 7–7.9
  const notable: DailyItem[] = []   // 5–6.9

  latestPost?.items.forEach(item => {
    if (item.score >= 8) critical.push(item)
    else if (item.score >= 7) important.push(item)
    else notable.push(item)
  })

  const total = latestPost?.items.length || 1
  const layers = [
    { items: critical,  num: 'L1', label: locale === 'en' ? 'Critical · Top Stories' : '重点 · 头条资讯',  badge: 'CRITICAL',  badgeStyle: { bg: 'var(--amberbg)', color: '#E89E30', border: 'rgba(212,130,10,.4)' } },
    { items: important, num: 'L2', label: locale === 'en' ? 'Important · Must Read'  : '重要 · 必读资讯',  badge: 'IMPORTANT', badgeStyle: { bg: 'var(--goldbg2)', color: 'var(--gold)', border: 'var(--gold2)' } },
    { items: notable,   num: 'L3', label: locale === 'en' ? 'Notable · Worth Noting' : '值得关注',         badge: 'NOTABLE',   badgeStyle: { bg: 'var(--greenbg)', color: '#4DC882', border: 'rgba(42,157,92,.3)' } },
  ]

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px 80px' }}>

      {/* ── Command Center Header ─────────────────────────────── */}
      <div style={{ padding: '28px 0 20px', borderBottom: '1px solid var(--line)', marginBottom: '24px' }}>
        <div style={{
          fontFamily: "'Courier New',monospace", fontSize: '10px',
          letterSpacing: '.14em', color: 'var(--gold2)',
          textTransform: 'uppercase', marginBottom: '8px',
        }}>
          {dateStr} · {locale === 'en' ? 'AI INTELLIGENCE DIGEST' : 'AI 智能简报'}
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <h1 style={{
            fontFamily: "'STSong','SimSun','Songti SC',Georgia,serif",
            fontSize: 'clamp(22px, 4vw, 32px)', fontWeight: 700,
            color: 'var(--text)', letterSpacing: '.02em',
          }}>
            {locale === 'en' ? 'Intelligence Digest' : '智能简报'}
            {latestMeta && (
              <span style={{
                fontFamily: "'Courier New',monospace", fontSize: '11px',
                color: 'var(--text3)', fontWeight: 400, marginLeft: '14px',
                letterSpacing: '.06em',
              }}>
                {latestMeta.date}
              </span>
            )}
          </h1>

          {/* Stats row */}
          {latestMeta && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              {[
                { val: latestPost?.itemCount || latestMeta.itemCount, lbl: locale === 'en' ? 'Selected' : '精选' },
                { val: latestPost?.totalFetched || latestMeta.totalFetched, lbl: locale === 'en' ? 'Fetched' : '采集' },
                { val: latestMeta.sources.length || 8, lbl: locale === 'en' ? 'Sources' : '来源' },
              ].map((s, i) => (
                <div key={i} style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: "'Courier New',monospace", fontSize: '18px', color: 'var(--text)', lineHeight: 1 }}>
                    {s.val}
                  </div>
                  <div style={{ fontSize: '9px', color: 'var(--text3)', letterSpacing: '.06em', marginTop: '2px' }}>
                    {s.lbl}
                  </div>
                </div>
              ))}
              {/* Signal bar */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ display: 'flex', height: '3px', width: '100px', borderRadius: '2px', overflow: 'hidden', gap: '1px' }}>
                  <div style={{ height: '100%', width: `${critical.length/total*100}%`, background: 'var(--amber)' }} />
                  <div style={{ height: '100%', width: `${important.length/total*100}%`, background: 'var(--gold)' }} />
                  <div style={{ height: '100%', width: `${notable.length/total*100}%`, background: 'var(--green)' }} />
                </div>
                <div style={{ fontFamily: "'Courier New',monospace", fontSize: '8px', color: 'var(--text3)', letterSpacing: '.06em' }}>
                  SIGNAL
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Source filter chips (like model pills in reference) */}
        {latestMeta && latestMeta.sources.length > 0 && (
          <div style={{ display: 'flex', gap: '6px', marginTop: '14px', flexWrap: 'wrap' }}>
            {latestMeta.sources.map(src => (
              <span key={src} style={{
                display: 'flex', alignItems: 'center', gap: '4px',
                padding: '4px 10px',
                background: 'none', border: '1px solid var(--line2)',
                borderRadius: '20px', fontSize: '11px',
                color: 'var(--text2)', fontFamily: "'Courier New',monospace",
                letterSpacing: '.04em',
              }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--text3)' }} />
                {src}
              </span>
            ))}
            <Link href={`/${locale}/daily/${latestMeta.date}`} style={{
              display: 'flex', alignItems: 'center', gap: '4px',
              padding: '4px 10px',
              background: 'var(--goldbg)', border: '1px solid var(--gold2)',
              borderRadius: '20px', fontSize: '11px',
              color: 'var(--gold)', fontFamily: "'Courier New',monospace",
              letterSpacing: '.04em', textDecoration: 'none',
            }}>
              {locale === 'en' ? 'Full digest →' : '完整简报 →'}
            </Link>
          </div>
        )}
      </div>

      {/* ── No content fallback ──────────────────────────────── */}
      {!latestPost && (
        <p style={{ fontSize: '13px', color: 'var(--text2)' }}>
          {locale === 'en' ? 'No digest available yet.' : '暂无简报，请稍后查看。'}
        </p>
      )}

      {/* ── Layer blocks (L1 / L2 / L3) ─────────────────────── */}
      {latestPost && layers.map(layer => layer.items.length > 0 && (
        <div key={layer.num} style={{ marginBottom: '28px' }}>
          <LayerHeader
            num={layer.num}
            label={layer.label}
            badge={layer.badge}
            badgeStyle={layer.badgeStyle}
          />
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '10px',
          }}>
            {layer.items.map((item, i) => (
              <ItemCard key={item.index} item={item} animDelay={i * 0.04} />
            ))}
          </div>
        </div>
      ))}

      {/* ── Featured Projects ────────────────────────────────── */}
      {featuredProjects.length > 0 && (
        <div style={{ marginTop: '12px' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            marginBottom: '10px', paddingBottom: '8px',
            borderBottom: '1px solid var(--line)',
          }}>
            <span style={{ fontFamily: "'Courier New',monospace", fontSize: '10px', color: 'var(--gold)', letterSpacing: '.06em' }}>P1</span>
            <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text)' }}>
              {locale === 'en' ? 'Featured Projects' : '精选项目'}
            </span>
            <Link href={`/${locale}/projects`} style={{
              fontFamily: "'Courier New',monospace", fontSize: '9px',
              color: 'var(--gold2)', textDecoration: 'none', marginLeft: 'auto',
              letterSpacing: '.06em',
            }}>
              {locale === 'en' ? 'All projects →' : '全部项目 →'}
            </Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '10px' }}>
            {featuredProjects.map(p => (
              <div key={p.slug} style={{
                padding: '16px', background: 'var(--bg2)',
                border: '1px solid var(--line2)', borderRadius: 'var(--r2)',
                display: 'flex', flexDirection: 'column', gap: '8px',
              }}>
                <div style={{
                  fontFamily: "'STSong','SimSun','Songti SC',Georgia,serif",
                  fontSize: '14px', color: 'var(--text)',
                }}>{p.title}</div>
                <div style={{ fontSize: '11px', color: 'var(--text2)', lineHeight: 1.65 }}>{p.description}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {p.tags.slice(0, 3).map(tag => (
                    <span key={tag} style={{
                      fontFamily: "'Courier New',monospace", fontSize: '9px',
                      padding: '2px 6px', borderRadius: '3px',
                      background: 'var(--bg4)', color: 'var(--text3)', border: '1px solid var(--line2)',
                    }}>{tag}</span>
                  ))}
                </div>
                {p.githubUrl && (
                  <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" style={{
                    fontFamily: "'Courier New',monospace", fontSize: '9px',
                    color: 'var(--text3)', textDecoration: 'none',
                    alignSelf: 'flex-start', marginTop: '2px',
                  }}>GitHub ↗</a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
