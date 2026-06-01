import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { getAllDailyMeta, getAllInvestmentMeta, getDailyPost, getFeaturedProjects } from '@/lib/content'
import ItemCard from '@/components/daily/ItemCard'

type Props = { params: Promise<{ locale: 'en' | 'zh' }> }

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'home' })
  return { title: `Horizon Daily — ${t('eyebrow')}` }
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params

  const allDays = getAllDailyMeta(locale)
  const displayLocale: 'en' | 'zh' = allDays.length > 0 ? locale : 'en'
  const allDaysDisplay = displayLocale === locale ? allDays : getAllDailyMeta('en')
  const latestMeta = allDaysDisplay[0] || null
  const latestPost = latestMeta ? getDailyPost(latestMeta.date, displayLocale) : null
  const topStories = latestPost?.items.slice(0, 3) || []
  const investmentPosts = locale === 'zh' ? getAllInvestmentMeta() : []
  const latestInvestment = investmentPosts[0] || null
  const featuredProjects = getFeaturedProjects()

  const today = new Date()
  const dateLabel = locale === 'zh'
    ? `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日`
    : today.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).toUpperCase()

  return (
    <main className="page-shell">
      <section className="magazine-hero animate-fade-up">
        <div className="kicker">{dateLabel} · HORIZON DAILY</div>
        <h1>
          {locale === 'zh'
            ? <>AI 情报与<br />产业投资雷达</>
            : <>AI Intelligence<br />Digest</>}
        </h1>
        <p>
          {locale === 'zh'
            ? '以出版物的方式组织每日 AI 技术资讯、产业链变化和资本市场信号。'
            : 'A daily editorial briefing for AI technology, research, and developer signals.'}
        </p>
      </section>

      <section className="front-grid">
        <div className="front-section">
          <div className="kicker">{locale === 'zh' ? 'AI 技术资讯' : 'AI TECHNOLOGY'}</div>
          <h2>{locale === 'zh' ? 'Horizon 生成的技术日报' : 'Horizon Technology Daily'}</h2>

          {latestMeta && latestPost ? (
            <>
              <Link className="front-feature" href={`/${locale}/daily/${latestMeta.date}`}>
                <div className="issue-date">{latestMeta.date}</div>
                <h3>{locale === 'zh' ? '今日技术情报精选' : 'Today’s Technical Intelligence'}</h3>
                <p>
                  {latestPost.itemCount} {locale === 'zh' ? '条精选，来自' : 'selected items from'} {latestPost.totalFetched}
                  {locale === 'zh' ? ' 条采集内容。' : ' fetched items.'}
                </p>
                {topStories.length > 0 && (
                  <ul>
                    {topStories.map(item => (
                      <li key={item.index}>{item.title}</li>
                    ))}
                  </ul>
                )}
              </Link>

              <div style={{ marginTop: '14px' }}>
                {topStories.map((item, i) => (
                  <ItemCard key={item.index} item={item} animDelay={i * 0.06} />
                ))}
              </div>
            </>
          ) : (
            <p className="muted">{locale === 'zh' ? '暂无技术日报。' : 'No technology digest available yet.'}</p>
          )}
        </div>

        {locale === 'zh' && (
          <div className="front-section">
            <div className="kicker">AI 投资研究</div>
            <h2>每日简报 v4 投资板块</h2>

            {latestInvestment ? (
              <Link className="front-feature investment" href={`/zh/investment/${latestInvestment.slug}`}>
                <div className="issue-date">{latestInvestment.date}</div>
                <h3>{latestInvestment.title}</h3>
                <p>
                  {latestInvestment.readingMinutes} 分钟阅读，覆盖 {latestInvestment.sections.length} 个产业与市场模块。
                </p>
                {latestInvestment.signals.length > 0 && (
                  <ul>
                    {latestInvestment.signals.map(signal => (
                      <li key={signal}>{signal}</li>
                    ))}
                  </ul>
                )}
              </Link>
            ) : (
              <p className="muted">暂无投资简报。</p>
            )}

            <div style={{ marginTop: '14px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <Link className="text-link gold" href="/zh/investment">查看投资简报归档 →</Link>
              {latestMeta && <Link className="text-link" href={`/zh/daily/${latestMeta.date}`}>阅读技术日报 →</Link>}
            </div>
          </div>
        )}
      </section>

      {featuredProjects.length > 0 && (
        <section className="front-section" style={{ marginTop: '42px' }}>
          <div className="kicker">{locale === 'zh' ? '精选项目' : 'Featured Projects'}</div>
          <h2>{locale === 'zh' ? '项目展示' : 'Projects'}</h2>
          <div className="issue-grid">
            {featuredProjects.map(project => (
              <div key={project.slug} className="issue-card">
                <div className="issue-date">{project.status}</div>
                <h2>{project.title}</h2>
                <p className="muted">{project.description}</p>
                {project.githubUrl && (
                  <a className="text-link gold" href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                    GitHub ↗
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  )
}
