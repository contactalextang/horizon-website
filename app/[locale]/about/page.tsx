type Props = { params: Promise<{ locale: 'en' | 'zh' }> }

export default async function AboutPage({ params }: Props) {
  const { locale } = await params

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '0 24px 80px' }}>
      <div style={{ padding: '36px 0 24px', borderBottom: '1px solid var(--line)', marginBottom: '24px' }}>
        <div style={{ fontFamily: "'Courier New',monospace", fontSize: '10px', letterSpacing: '.14em', color: 'var(--gold2)', textTransform: 'uppercase', marginBottom: '10px' }}>
          About
        </div>
        <h1 style={{ fontFamily: "'EB Garamond',var(--font-garamond),Georgia,serif", fontSize: '32px', fontWeight: 400, color: 'var(--text)' }}>
          {locale === 'en' ? 'About Horizon Daily' : '关于 Horizon Daily'}
        </h1>
      </div>
      <div style={{ fontSize: '13px', lineHeight: 1.8, color: 'var(--text2)', maxWidth: '640px' }}>
        {locale === 'en' ? (
          <>
            <p style={{ marginBottom: '16px' }}>
              <strong style={{ color: 'var(--text)', fontFamily: "'EB Garamond',Georgia,serif", fontSize: '15px' }}>Horizon Daily</strong> is an AI-curated daily digest of technology and research news, automatically assembled every day from 8+ sources including Hacker News, Reddit, GitHub, and RSS feeds.
            </p>
            <p style={{ marginBottom: '16px' }}>
              Each item is scored 0–10 by AI models (Claude, GPT, Gemini), summarized, and enriched with background context and community discussion highlights. Only items scoring 5.0+ are published.
            </p>
            <p>
              Built with <a href="https://github.com/contactalextang/Horizon" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--gold)', textDecoration: 'none' }}>Horizon</a> — an open-source AI news aggregation system.
            </p>
          </>
        ) : (
          <>
            <p style={{ marginBottom: '16px' }}>
              <strong style={{ color: 'var(--text)', fontFamily: "'STSong','SimSun',Georgia,serif", fontSize: '15px' }}>Horizon Daily</strong> 是一个由 AI 每日自动生成的技术与研究资讯精选，从 HackerNews、Reddit、GitHub、RSS 等 8 个以上数据源自动采集。
            </p>
            <p style={{ marginBottom: '16px' }}>
              每条资讯由 AI 模型（Claude、GPT、Gemini）评分（0–10）、生成摘要，并补充背景信息和社区讨论要点。仅展示评分 5.0 以上的内容。
            </p>
            <p>
              基于开源项目 <a href="https://github.com/contactalextang/Horizon" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--gold)', textDecoration: 'none' }}>Horizon</a> 构建。
            </p>
          </>
        )}
      </div>
    </div>
  )
}
