import Link from 'next/link'
import { getAllDailyMeta, getAllInvestmentMeta, getDailyPost, getAllProjects } from '@/lib/content'

type Props = { params: Promise<{ locale: 'en' | 'zh' }> }

const mono = "'Courier New',monospace"
const serif = "'STSong','SimSun','Songti SC','EB Garamond',Georgia,serif"

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  return {
    title: locale === 'zh'
      ? 'Alex Tang — 独立开发者 · AI 产品构建者'
      : 'Alex Tang — Indie Builder · AI Products',
    description: locale === 'zh'
      ? '独立开发者，专注用 AI 构建真实产品。新加坡餐饮 SaaS 膳云 MakanCloud 创始人。'
      : 'Indie builder shipping real products with AI. Founder of MakanCloud (Singapore F&B SaaS).',
  }
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params
  const L = (zh: string, en: string) => locale === 'zh' ? zh : en

  // Tech news
  const allDays = getAllDailyMeta(locale)
  const displayLocale: 'en' | 'zh' = allDays.length > 0 ? locale : 'en'
  const allDaysDisplay = displayLocale === locale ? allDays : getAllDailyMeta('en')
  const latestMeta = allDaysDisplay[0] || null
  const latestPost = latestMeta ? getDailyPost(latestMeta.date, displayLocale) : null
  const topStories = latestPost?.items.slice(0, 5) || []

  // Investment research (zh only)
  const investmentPosts = locale === 'zh' ? getAllInvestmentMeta() : []
  const latestInvestment = investmentPosts[0] || null

  // Projects: 指定三张「更多项目」卡 —— 智囊团 / 内容生产大师 / 量化交易系统
  const ORDER = ['site-selection', 'content-engine', 'v8-trading']
  const bySlug = Object.fromEntries(getAllProjects().map(p => [p.slug, p]))
  const otherProjects = ORDER.map(s => bySlug[s]).filter(Boolean)

  const makanBadges = [
    L('门店订货', 'Ordering'), L('中央厨房', 'Kitchen'), L('配送调度', 'Delivery'),
    L('智能排班', 'Scheduling'), L('POS 收银', 'POS'), L('扫码点餐', 'QR Order'),
  ]

  return (
    <main className="page-shell">

      {/* ══ HERO ══ */}
      <section className="animate-fade-up" style={{ padding: '64px 0 52px', borderBottom: '1px solid var(--line)' }}>
        <div style={{ fontFamily: mono, fontSize: '10px', letterSpacing: '.18em', color: 'var(--gold2)', textTransform: 'uppercase', marginBottom: '18px' }}>
          {L('独立开发者 · AI 产品构建者', 'Indie Builder · AI Products')}
        </div>
        <h1 style={{ fontFamily: serif, fontSize: 'clamp(44px, 7vw, 72px)', fontWeight: 700, color: 'var(--text)', lineHeight: 1.05, marginBottom: '22px', letterSpacing: '-.01em' }}>
          Alex Tang
        </h1>
        <p style={{ fontSize: '15px', color: 'var(--text2)', lineHeight: 1.88, maxWidth: '560px', marginBottom: '28px' }}>
          {L(
            '独立开发者，专注用 AI 构建真实产品。新加坡餐饮 SaaS「膳云 MakanCloud」创始人。展开软件定制与 AI 工具建设。',
            'Indie builder shipping real products with AI. Founder of MakanCloud (Singapore F&B SaaS). Open for custom software & AI tools.'
          )}
        </p>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <a href="https://github.com/contactalextang" target="_blank" rel="noopener noreferrer"
            style={{ fontFamily: mono, fontSize: '11px', padding: '8px 16px', borderRadius: 'var(--r)', border: '1px solid var(--line3)', color: 'var(--text2)', textDecoration: 'none', letterSpacing: '.04em' }}>
            GitHub ↗
          </a>
          <a href="mailto:contact.alextang@gmail.com"
            style={{ fontFamily: mono, fontSize: '11px', padding: '8px 16px', borderRadius: 'var(--r)', borderTop: '1px solid rgba(184,146,42,0.4)', borderRight: '1px solid rgba(184,146,42,0.4)', borderBottom: '1px solid rgba(184,146,42,0.4)', borderLeft: '1px solid rgba(184,146,42,0.4)', color: 'var(--gold)', textDecoration: 'none', letterSpacing: '.04em', background: 'var(--goldbg)' }}>
            {L('联系我 →', 'Contact →')}
          </a>
          <Link href={`/${locale}/projects`}
            style={{ fontFamily: mono, fontSize: '11px', padding: '8px 16px', borderRadius: 'var(--r)', border: '1px solid var(--line2)', color: 'var(--text3)', textDecoration: 'none', letterSpacing: '.04em' }}>
            {L('查看项目 →', 'View Projects →')}
          </Link>
        </div>
      </section>

      {/* ══ CONTENT PREVIEW ══ */}
      <section className="front-grid" style={{ marginTop: '44px' }}>
        {/* Tech news column */}
        <div className="front-section">
          <div className="kicker">{L('技术资讯', 'Tech News')}</div>
          <h2>{L('最新技术日报', 'Latest Tech Digest')}</h2>

          {latestMeta && latestPost ? (
            <>
              <Link className="front-feature" href={`/${locale}/daily/${latestMeta.date}`}>
                <div className="issue-date">{latestMeta.date}</div>
                <h3>
                  {latestPost.status === 'warning'
                    ? L('今日评分异常诊断', 'Scoring Anomaly Diagnostic')
                    : L('今日技术情报精选', "Today's Technical Intelligence")}
                </h3>
                {latestPost.status !== 'warning' && (
                  <p className="feature-summary">
                    {latestPost.itemCount} {L('条精选，来自', 'selected from')} {latestPost.totalFetched}
                    {L(' 条采集内容。', ' fetched items.')}
                  </p>
                )}
                {topStories.length > 0 && (
                  <ul className="feature-list">{topStories.map(item => <li key={item.index}>{item.title}</li>)}</ul>
                )}
              </Link>
            </>
          ) : (
            <p className="muted">{L('暂无技术资讯。', 'No tech digest yet.')}</p>
          )}
        </div>

        {/* Investment research column (zh only) */}
        {locale === 'zh' && (
          <div className="front-section">
            <div className="kicker">投资研究</div>
            <h2>最新投资研究</h2>
            {latestInvestment ? (
              <Link className="front-feature investment" href={`/zh/investment/${latestInvestment.slug}`}>
                <div className="issue-date">{latestInvestment.date}</div>
                <h3>{latestInvestment.title}</h3>
                <p className="feature-summary">
                  {latestInvestment.readingMinutes} 分钟阅读，覆盖 {latestInvestment.sections.length} 个产业与市场模块。
                </p>
                {latestInvestment.summary && (
                  <p className="feature-summary">{latestInvestment.summary}</p>
                )}
                {latestInvestment.signals.length > 0 && (
                  <ul className="feature-list">{latestInvestment.signals.map(s => <li key={s}>{s}</li>)}</ul>
                )}
              </Link>
            ) : (
              <p className="muted">暂无投资研究。</p>
            )}
            <div style={{ marginTop: '14px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <Link className="text-link gold" href="/zh/investment">查看投资研究归档 →</Link>
              {latestMeta && <Link className="text-link" href={`/zh/daily/${latestMeta.date}`}>阅读技术日报 →</Link>}
            </div>
          </div>
        )}
      </section>

      {/* ══ MAKANCLOUD FLAGSHIP ══ */}
      <section style={{ marginTop: '44px' }}>
        <div style={{ fontFamily: mono, fontSize: '10px', letterSpacing: '.14em', color: 'var(--text3)', textTransform: 'uppercase', marginBottom: '14px' }}>
          {L('旗舰产品', 'Flagship Product')}
        </div>
        <div style={{
          padding: '28px 30px',
          background: 'var(--goldbg)',
          borderRadius: '0 var(--r2) var(--r2) 0',
          borderTop: '1px solid rgba(184,146,42,0.25)',
          borderRight: '1px solid rgba(184,146,42,0.25)',
          borderBottom: '1px solid rgba(184,146,42,0.25)',
          borderLeft: '3px solid var(--gold)',
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '24px', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '240px' }}>
              <div style={{ fontFamily: mono, fontSize: '9px', letterSpacing: '.12em', color: 'var(--gold2)', textTransform: 'uppercase', marginBottom: '10px' }}>
                {L('新加坡餐饮全链路运营 SaaS', 'Singapore F&B Operations SaaS')}
              </div>
              <h2 style={{ fontFamily: serif, fontSize: 'clamp(22px, 4vw, 34px)', fontWeight: 700, color: 'var(--text)', marginBottom: '12px', lineHeight: 1.15 }}>
                {L('膳云 MakanCloud', 'MakanCloud')}
              </h2>
              <p style={{ fontSize: '13px', color: 'var(--text2)', lineHeight: 1.82, maxWidth: '520px', marginBottom: '18px' }}>
                {L(
                  '一套系统接住订货、厨房、配送和 POS。从门店订货到中央厨房生产、冷链配送、前台收银，全链路一体化，一个人 + AI 独立构建并商业化运营。',
                  'One system for ordering, kitchen, delivery and POS. Built solo with AI, now commercially live in Singapore.'
                )}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px' }}>
                {makanBadges.map((b) => (
                  <span key={b} style={{ fontFamily: mono, fontSize: '10px', padding: '4px 9px', borderRadius: 'var(--r)', background: 'rgba(184,146,42,0.12)', color: 'var(--gold2)', border: '1px solid rgba(184,146,42,0.28)', letterSpacing: '.04em' }}>
                    {b}
                  </span>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                <Link href={`/${locale}/makancloud`} style={{ fontFamily: mono, fontSize: '11px', padding: '8px 16px', borderRadius: 'var(--r)', background: 'var(--gold)', color: '#fff', textDecoration: 'none', letterSpacing: '.04em' }}>
                  {L('了解膳云 →', 'Learn more →')}
                </Link>
                <a href="https://makancloud.com" target="_blank" rel="noopener noreferrer" style={{ fontFamily: mono, fontSize: '11px', color: 'var(--gold2)', textDecoration: 'none', letterSpacing: '.04em' }}>
                  makancloud.com ↗
                </a>
              </div>
            </div>

            <div style={{ flexShrink: 0, textAlign: 'right', paddingTop: '2px' }}>
              <div style={{ fontFamily: mono, fontSize: '9px', color: 'var(--text3)', letterSpacing: '.08em', marginBottom: '4px', textTransform: 'uppercase' }}>
                {L('起步价', 'Starting from')}
              </div>
              <div style={{ fontFamily: serif, fontSize: '30px', color: 'var(--gold)', fontWeight: 700, lineHeight: 1 }}>S$59</div>
              <div style={{ fontFamily: mono, fontSize: '9px', color: 'var(--text3)', letterSpacing: '.06em', marginBottom: '14px' }}>{L('/月', '/month')}</div>
              <div style={{ fontFamily: mono, fontSize: '9px', color: 'var(--green)', letterSpacing: '.06em', padding: '4px 10px', background: 'var(--greenbg)', borderRadius: 'var(--r)', border: '1px solid rgba(42,157,92,0.2)', display: 'inline-block' }}>
                ● Active
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ OTHER PROJECTS ══ */}
      {otherProjects.length > 0 && (
        <section style={{ marginTop: '44px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div style={{ fontFamily: mono, fontSize: '10px', letterSpacing: '.14em', color: 'var(--text3)', textTransform: 'uppercase' }}>
              {L('更多项目', 'More Projects')}
            </div>
            <Link href={`/${locale}/projects`} style={{ fontFamily: mono, fontSize: '10px', color: 'var(--gold2)', textDecoration: 'none', letterSpacing: '.04em' }}>
              {L('查看全部 →', 'View all →')}
            </Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '10px' }}>
            {otherProjects.map(p => (
              <div key={p.slug} className="surface-hover" style={{
                padding: '20px', background: 'var(--surface-bg)', border: '1px solid var(--surface-border)',
                borderRadius: 'var(--r2)', display: 'flex', flexDirection: 'column', gap: '10px', transition: 'all .2s',
              }}>
                <h3 style={{ fontFamily: serif, fontSize: '16px', fontWeight: locale === 'zh' ? 600 : 400, color: 'var(--text)', lineHeight: 1.3 }}>{p.title}</h3>
                <p style={{ fontSize: '12px', color: 'var(--text2)', lineHeight: 1.68, flex: 1 }}>{p.description}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {p.tags.slice(0, 3).map(tag => (
                    <span key={tag} style={{ fontFamily: mono, fontSize: '9px', padding: '2px 6px', borderRadius: '3px', background: 'var(--bg4)', color: 'var(--text3)', border: '1px solid var(--line2)' }}>{tag}</span>
                  ))}
                </div>
                {(p.demoUrl || p.githubUrl) && (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {p.demoUrl && <a href={p.demoUrl} target="_blank" rel="noopener noreferrer" style={{ fontFamily: mono, fontSize: '9px', padding: '4px 10px', borderRadius: 'var(--r)', border: '1px solid var(--gold2)', color: 'var(--gold)', textDecoration: 'none' }}>Demo ↗</a>}
                    {p.githubUrl && <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" style={{ fontFamily: mono, fontSize: '9px', padding: '4px 10px', borderRadius: 'var(--r)', border: '1px solid var(--line2)', color: 'var(--text3)', textDecoration: 'none' }}>GitHub ↗</a>}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

    </main>
  )
}
