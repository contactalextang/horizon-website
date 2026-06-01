import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getAllInvestmentMeta } from '@/lib/content'

type Props = { params: Promise<{ locale: 'en' | 'zh' }> }

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  if (locale !== 'zh') return {}
  return {
    title: 'AI 投资简报 — Horizon Daily',
    description: 'AI 产业、资本市场与上市公司每日投研简报',
  }
}

export default async function InvestmentListPage({ params }: Props) {
  const { locale } = await params
  if (locale !== 'zh') notFound()

  const posts = getAllInvestmentMeta()
  const latest = posts[0]

  return (
    <main className="page-shell">
      <section className="magazine-hero compact">
        <div className="kicker">AI INVESTMENT RESEARCH</div>
        <h1>AI 投资简报</h1>
        <p>
          面向 AI 产业链、资本市场、一级市场和技术突破的每日研究笔记。
        </p>
        {latest && (
          <Link className="text-link gold" href={`/zh/investment/${latest.slug}`}>
            阅读最新一期
          </Link>
        )}
      </section>

      {posts.length === 0 ? (
        <p className="muted">暂无投资简报。</p>
      ) : (
        <section className="issue-grid">
          {posts.map(post => (
            <Link key={post.slug} href={`/zh/investment/${post.slug}`} className="issue-card">
              <div className="issue-date">{post.date}</div>
              <h2>{post.title}</h2>
              <div className="issue-meta">
                <span>{post.readingMinutes} 分钟</span>
                <span>{post.sections.length} 个模块</span>
              </div>
              {post.signals.length > 0 && (
                <ul>
                  {post.signals.slice(0, 3).map(signal => (
                    <li key={signal}>{signal}</li>
                  ))}
                </ul>
              )}
            </Link>
          ))}
        </section>
      )}
    </main>
  )
}
