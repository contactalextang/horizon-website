import { absUrl, languageAlternates } from '@/lib/site'
import { personJsonLd } from '@/lib/jsonld'
import JsonLd from '@/components/JsonLd'

type Props = { params: Promise<{ locale: 'en' | 'zh' }> }

const mono = "'Courier New',monospace"
const serif = "'EB Garamond',var(--font-garamond),Georgia,serif"

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const title = locale === 'zh' ? '关于 — AI · 软件定制 · 投资交流' : 'About — building with AI, custom software, investing'
  const description =
    locale === 'zh'
      ? '我是一名独立开发者，用 AI 把想法做成真产品（膳云 MakanCloud），承接软件定制，并做投资交流。'
      : 'Indie builder shipping real products with AI (MakanCloud). Available for custom software; sharing investing notes.'
  return {
    title,
    description,
    alternates: { canonical: absUrl(locale, '/about'), languages: languageAlternates('/about') },
    openGraph: { title, description, url: absUrl(locale, '/about'), type: 'profile' },
  }
}

const tracks = [
  {
    kicker: { en: 'AI', zh: 'AI' },
    title: { en: 'Building with AI, every day', zh: '每天和 AI 一起做产品' },
    body: {
      en: 'I work with AI agents (Claude, Codex) on real projects and share the workflows, decisions and pitfalls. AI is the leverage that lets one person ship a full business system.',
      zh: '我每天和 AI Agent（Claude、Codex）一起做真实项目，公开分享工作流、决策与踩坑。AI 是让一个人也能交付完整商业系统的杠杆。',
    },
    href: '/buildlog',
    cta: { en: 'Read the build log →', zh: '看开发日志 →' },
  },
  {
    kicker: { en: 'Custom software', zh: '软件定制' },
    title: { en: 'One person + AI can ship enterprise-grade', zh: '一个人 + AI 也能交付企业级系统' },
    body: {
      en: 'MakanCloud — a full Singapore F&B operations SaaS (ordering, central kitchen, delivery, scheduling, POS, QR self-ordering) — is the proof. I take on custom software, internal tools, automation and dashboards.',
      zh: '膳云 MakanCloud——独立做出的新加坡餐饮全链路 SaaS（订货/中央厨房/配送/排班/POS/扫码点餐）就是证明。我承接软件定制、内部工具、自动化与数据看板。',
    },
    href: '/makancloud',
    cta: { en: 'See MakanCloud →', zh: '了解膳云 →' },
  },
  {
    kicker: { en: 'Investing notes', zh: '投资交流' },
    title: { en: 'Long-term value, from the AI frontier', zh: '从 AI 产业看长期价值' },
    body: {
      en: 'I share observations on the AI industry, business models and markets — as exchange, not advice.',
      zh: '我分享对 AI 产业、商业模式与市场的观察与思考——仅为交流，不构成投资建议。',
    },
    href: '/daily',
    cta: { en: 'Daily tech digest →', zh: '每日科技简报 →' },
  },
]

export default async function AboutPage({ params }: Props) {
  const { locale } = await params
  const L = (b: { en: string; zh: string }) => (locale === 'zh' ? b.zh : b.en)

  return (
    <div style={{ maxWidth: '760px', margin: '0 auto', padding: '0 24px 80px' }}>
      <JsonLd data={personJsonLd()} />

      <div style={{ padding: '36px 0 24px', borderBottom: '1px solid var(--line)', marginBottom: '28px' }}>
        <div style={{ fontFamily: mono, fontSize: '10px', letterSpacing: '.14em', color: 'var(--gold2)', textTransform: 'uppercase', marginBottom: '10px' }}>
          {locale === 'zh' ? '关于' : 'About'}
        </div>
        <h1 style={{ fontFamily: serif, fontSize: '32px', fontWeight: locale === 'zh' ? 700 : 400, color: 'var(--text)', lineHeight: 1.2 }}>
          {locale === 'zh' ? 'AI · 软件定制 · 投资交流' : 'Building with AI · custom software · investing'}
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--text2)', lineHeight: 1.8, marginTop: '12px' }}>
          {locale === 'zh' ? (
            <>
              我是一名独立开发者，辞职后全职用 AI 把想法做成真产品。第一个商业项目是
              <a href="https://makancloud.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--gold)', textDecoration: 'none' }}>
                膳云 MakanCloud
              </a>
              。这里记录我在做的事，也欢迎找我聊软件定制与合作。
            </>
          ) : (
            <>
              I&apos;m an indie builder, now full-time shipping real products with AI. My first commercial product is{' '}
              <a href="https://makancloud.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--gold)', textDecoration: 'none' }}>
                MakanCloud
              </a>
              . This site is where I work in public — reach out for custom software or to collaborate.
            </>
          )}
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {tracks.map((t, i) => (
          <div key={i} style={{ padding: '20px', background: 'var(--surface-bg)', border: '1px solid var(--surface-border)', borderRadius: 'var(--r2)' }}>
            <div style={{ fontFamily: mono, fontSize: '10px', letterSpacing: '.12em', color: 'var(--gold2)', textTransform: 'uppercase', marginBottom: '8px' }}>{L(t.kicker)}</div>
            <h2 style={{ fontFamily: serif, fontSize: '18px', fontWeight: locale === 'zh' ? 600 : 400, color: 'var(--text)', marginBottom: '8px' }}>{L(t.title)}</h2>
            <p style={{ fontSize: '13px', color: 'var(--text2)', lineHeight: 1.75, marginBottom: '10px' }}>{L(t.body)}</p>
            <a href={`/${locale}${t.href}`} style={{ fontFamily: mono, fontSize: '11px', color: 'var(--gold)', textDecoration: 'none' }}>{L(t.cta)}</a>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '28px', paddingTop: '20px', borderTop: '1px solid var(--line)', fontSize: '13px', color: 'var(--text2)', lineHeight: 1.8 }}>
        <p>
          {locale === 'zh' ? '联系 / 合作：' : 'Contact / work with me: '}
          <a href="https://github.com/contactalextang" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--gold)', textDecoration: 'none' }}>GitHub</a>
        </p>
      </div>
    </div>
  )
}
