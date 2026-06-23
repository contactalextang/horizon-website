import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getAllInvestmentMeta, getInvestmentPost } from '@/lib/content'

type Props = {
  params: Promise<{ locale: 'en' | 'zh'; slug: string }>
}

export function generateStaticParams() {
  return getAllInvestmentMeta().map(post => ({
    locale: 'zh',
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params
  if (locale !== 'zh') return {}

  const post = await getInvestmentPost(slug)
  if (!post) return {}

  return {
    title: `${post.title} — 投资研究 · Alex Tang`,
    description: post.signals[0] || 'AI 产业、资本市场与上市公司每日投研笔记',
  }
}

export default async function InvestmentDetailPage({ params }: Props) {
  const { locale, slug } = await params
  if (locale !== 'zh') notFound()

  const post = await getInvestmentPost(slug)
  if (!post) notFound()

  return (
    <main className="page-shell wide">
      <section className="investment-cover">
        <Link className="text-link" href="/zh/investment">← 投资研究归档</Link>
        <div className="kicker">{post.date} · AI INVESTMENT RESEARCH</div>
        <h1>{post.title}</h1>
        <div className="issue-meta strong">
          <span>{post.readingMinutes} 分钟阅读</span>
          <span>{post.sections.length} 个模块</span>
          <span>中文</span>
        </div>

        {post.signals.length > 0 && (
          <div className="signal-panel">
            <div className="label">核心信号</div>
            <ol>
              {post.signals.map(signal => (
                <li key={signal}>{signal}</li>
              ))}
            </ol>
          </div>
        )}
      </section>

      <div className="article-layout">
        <aside className="toc">
          <div className="label">目录</div>
          {post.sections.slice(0, 14).map(section => (
            <div key={section}>{section}</div>
          ))}
        </aside>

        <article
          className="markdown-article investment-article"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />
      </div>
    </main>
  )
}
