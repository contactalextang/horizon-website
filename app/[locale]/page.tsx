import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { getAllDailyMeta, getFeaturedProjects, getDailyPost } from '@/lib/content'
import ItemCard from '@/components/daily/ItemCard'

type Props = { params: Promise<{ locale: 'en' | 'zh' }> }

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'home' })
  return { title: `Horizon Daily — ${t('eyebrow')}` }
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params

  // Fallback to 'en' if no content in current locale
  const allDays = getAllDailyMeta(locale)
  const displayLocale: 'en' | 'zh' = allDays.length > 0 ? locale : 'en'
  const allDaysDisplay = displayLocale === locale ? allDays : getAllDailyMeta('en')
  const latestMeta = allDaysDisplay[0] || null
  const latestPost = latestMeta ? getDailyPost(latestMeta.date, displayLocale) : null
  const top5 = latestPost?.items.slice(0, 5) || []
  const featuredProjects = getFeaturedProjects()

  const today = new Date()
  const dateLabel = locale === 'zh'
    ? `${today.getFullYear()}年${today.getMonth()+1}月${today.getDate()}日`
    : today.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).toUpperCase()

  // Score distribution
  let high = 0, mid = 0, ok = 0, low = 0
  latestPost?.items.forEach(item => {
    if (item.score >= 8) high++
    else if (item.score >= 7) mid++
    else if (item.score >= 5) ok++
    else low++
  })
  const total = latestPost?.items.length || 1

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '0 24px 80px' }}>

      {/* ── Hero ──────────────────────────────────────────────── */}
      <div className="animate-fade-up" style={{ padding: '44px 0 32px', borderBottom: '1px solid var(--line)', marginBottom: '28px' }}>
        <div style={{
          fontFamily: "'Courier New',monospace", fontSize: '10px',
          letterSpacing: '.14em', color: 'var(--gold2)',
          textTransform: 'uppercase', marginBottom: '12px',
        }}>
          {dateLabel} · {locale === 'en' ? 'AI INTELLIGENCE DIGEST' : '人工智能文摘'}
        </div>

        <h1 style={{
          fontFamily: "'STSong','SimSun','Songti SC','EB Garamond',var(--font-garamond),Georgia,serif",
          fontSize: 'clamp(28px, 5vw, 42px)',
          fontWeight: locale === 'zh' ? 700 : 400,
          lineHeight: 1.1, letterSpacing: locale === 'zh' ? '.02em' : '-.3px',
          color: 'var(--text)', marginBottom: '20px',
        }}>
          {locale === 'zh'
            ? <>今日<em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>情报</em><br />摘要</>
            : <>Today&apos;s <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>Intelligence</em><br />Digest</>
          }
        </h1>

        {/* Stats */}
        {latestMeta && (
          <>
            <div style={{ display: 'flex', gap: 0, alignItems: 'center', marginBottom: '20px' }}>
              {[
                { val: latestPost?.itemCount || latestMeta.itemCount, lbl: locale === 'zh' ? '已选条目' : 'Selected' },
                { val: latestPost?.totalFetched || latestMeta.totalFetched, lbl: locale === 'zh' ? '总采集量' : 'Fetched' },
                { val: latestMeta.sources.length || 8, lbl: locale === 'zh' ? '来源' : 'Sources' },
              ].map((s, i) => (
                <div key={i} style={{
                  display: 'flex', flexDirection: 'column', gap: '3px',
                  padding: '0 24px 0 0', marginRight: i < 2 ? '24px' : 0,
                  borderRight: i < 2 ? '1px solid var(--line2)' : 'none',
                }}>
                  <span style={{ fontFamily: "'Courier New',monospace", fontSize: '22px', color: 'var(--text)', lineHeight: 1 }}>
                    {s.val}
                  </span>
                  <span style={{ fontSize: '10px', color: 'var(--text3)', letterSpacing: '.04em' }}>{s.lbl}</span>
                </div>
              ))}
            </div>

            {/* Signal bar */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '10px 14px', background: 'var(--bg2)',
              border: '1px solid var(--line2)', borderRadius: 'var(--r2)',
              width: 'fit-content', marginBottom: '16px',
            }}>
              <span style={{ fontFamily: "'Courier New',monospace", fontSize: '9px', color: 'var(--text3)', letterSpacing: '.1em', textTransform: 'uppercase' }}>
                {locale === 'zh' ? '信号' : 'Signal'}
              </span>
              <div style={{ display: 'flex', height: '4px', width: '160px', borderRadius: '2px', overflow: 'hidden', gap: '1px' }}>
                <div style={{ height: '100%', width: `${high/total*100}%`, background: 'var(--amber)', opacity: .9, borderRadius: '1px' }} />
                <div style={{ height: '100%', width: `${mid/total*100}%`, background: 'var(--gold)', opacity: .85, borderRadius: '1px' }} />
                <div style={{ height: '100%', width: `${ok/total*100}%`, background: 'var(--green)', opacity: .7, borderRadius: '1px' }} />
                <div style={{ height: '100%', flex: 1, background: 'var(--bg5)', borderRadius: '1px' }} />
              </div>
              <span style={{ fontFamily: "'Courier New',monospace", fontSize: '9px', color: 'var(--text3)', letterSpacing: '.06em' }}>
                8+ · 7+ · 5+ · &lt;5
              </span>
            </div>

            {/* Source chips */}
            {latestMeta.sources.length > 0 && (
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {latestMeta.sources.map(src => (
                  <span key={src} style={{
                    display: 'inline-flex', alignItems: 'center', gap: '5px',
                    padding: '4px 11px', background: 'none',
                    border: '1px solid var(--line2)', borderRadius: '20px',
                    fontSize: '11px', color: 'var(--text2)',
                    fontFamily: "'Courier New',monospace", letterSpacing: '.04em',
                  }}>
                    <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--text3)' }} />
                    {src}
                  </span>
                ))}
              </div>
            )}
          </>
        )}

        {!latestMeta && (
          <p style={{ fontSize: '13px', color: 'var(--text2)' }}>
            {locale === 'zh' ? '暂无简报，请稍后查看。' : 'No digest available yet. Check back soon.'}
          </p>
        )}
      </div>

      {/* ── Top 5 Items ───────────────────────────────────────── */}
      {top5.length > 0 && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <span style={{ fontFamily: "'Courier New',monospace", fontSize: '9px', letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--text3)' }}>
              {locale === 'zh' ? '头条新闻' : 'Top Stories'}
            </span>
            <div style={{ flex: 1, height: '1px', background: 'var(--line)' }} />
            <Link href={`/${locale}/daily/${latestMeta!.date}`} style={{
              fontFamily: "'Courier New',monospace", fontSize: '9px',
              color: 'var(--gold2)', textDecoration: 'none', letterSpacing: '.06em',
            }}>
              {locale === 'zh' ? '完整简报 →' : 'Full digest →'}
            </Link>
          </div>

          <div>
            {top5.map((item, i) => (
              <ItemCard key={item.index} item={item} animDelay={i * 0.08} />
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <Link href={`/${locale}/daily/${latestMeta!.date}`} style={{
              display: 'inline-block', padding: '8px 20px',
              background: 'none', border: '1px solid var(--gold2)',
              borderRadius: 'var(--r)', color: 'var(--gold)',
              fontFamily: "'Courier New',monospace", fontSize: '11px',
              letterSpacing: '.06em', textDecoration: 'none', transition: 'all .15s',
            }}>
              {locale === 'zh'
                ? `阅读全部 ${latestPost?.itemCount} 条 →`
                : `Read all ${latestPost?.itemCount} items →`}
            </Link>
          </div>
        </>
      )}

      {/* ── Featured Projects ──────────────────────────────────── */}
      {featuredProjects.length > 0 && (
        <div style={{ marginTop: '48px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
            <span style={{ fontFamily: "'Courier New',monospace", fontSize: '9px', letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--text3)' }}>
              {locale === 'zh' ? '精选项目' : 'Featured Projects'}
            </span>
            <div style={{ flex: 1, height: '1px', background: 'var(--line)' }} />
            <Link href={`/${locale}/projects`} style={{ fontFamily: "'Courier New',monospace", fontSize: '9px', color: 'var(--gold2)', textDecoration: 'none' }}>
              {locale === 'zh' ? '全部项目 →' : 'All projects →'}
            </Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '10px' }}>
            {featuredProjects.map(p => (
              <div key={p.slug} style={{
                padding: '16px', background: 'var(--bg2)',
                border: '1px solid var(--line2)', borderRadius: 'var(--r2)',
                display: 'flex', flexDirection: 'column', gap: '8px',
              }}>
                <div style={{ fontFamily: "'STSong','SimSun',Georgia,serif", fontSize: '14px', color: 'var(--text)' }}>{p.title}</div>
                <div style={{ fontSize: '12px', color: 'var(--text2)', lineHeight: 1.6 }}>{p.description}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {p.tags.slice(0, 3).map(tag => (
                    <span key={tag} style={{ fontFamily: "'Courier New',monospace", fontSize: '9px', padding: '2px 6px', borderRadius: '3px', background: 'var(--bg4)', color: 'var(--text3)', border: '1px solid var(--line2)' }}>{tag}</span>
                  ))}
                </div>
                {p.githubUrl && (
                  <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" style={{ fontFamily: "'Courier New',monospace", fontSize: '9px', color: 'var(--text3)', textDecoration: 'none' }}>
                    GitHub ↗
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
