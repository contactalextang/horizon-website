import { getAllBuildlog } from '@/lib/content'
import { absUrl, languageAlternates } from '@/lib/site'
import { personJsonLd } from '@/lib/jsonld'
import JsonLd from '@/components/JsonLd'

type Props = { params: Promise<{ locale: 'en' | 'zh' }> }

const mono = "'Courier New',monospace"
const serif = "'EB Garamond',var(--font-garamond),Georgia,serif"

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const title = locale === 'zh' ? '开发日志 · Building in public' : 'Build log · Building in public'
  const description =
    locale === 'zh'
      ? '我每天和 AI Agent 一起做产品的真实记录：踩坑、决策、上线。'
      : 'A real record of building products with AI agents — decisions, pitfalls, and what shipped.'
  return {
    title,
    description,
    alternates: { canonical: absUrl(locale, '/buildlog'), languages: languageAlternates('/buildlog') },
    openGraph: { title, description, url: absUrl(locale, '/buildlog'), type: 'website' },
  }
}

export default async function BuildlogPage({ params }: Props) {
  const { locale } = await params
  const entries = getAllBuildlog(locale)

  return (
    <div style={{ maxWidth: '760px', margin: '0 auto', padding: '0 24px 80px' }}>
      <JsonLd data={personJsonLd()} />
      <div style={{ padding: '36px 0 24px', borderBottom: '1px solid var(--line)', marginBottom: '24px' }}>
        <div style={{ fontFamily: mono, fontSize: '10px', letterSpacing: '.14em', color: 'var(--gold2)', textTransform: 'uppercase', marginBottom: '10px' }}>
          {locale === 'zh' ? 'Building in public' : 'Building in public'}
        </div>
        <h1 style={{ fontFamily: serif, fontSize: '32px', fontWeight: locale === 'zh' ? 700 : 400, color: 'var(--text)' }}>
          {locale === 'zh' ? '开发日志' : 'Build log'}
        </h1>
        <p style={{ fontSize: '13px', color: 'var(--text2)', marginTop: '8px', lineHeight: 1.7 }}>
          {locale === 'zh'
            ? '我每天和 AI Agent 一起做产品的真实记录：踩坑、决策、上线。'
            : 'A real record of building products with AI agents — decisions, pitfalls, and what shipped.'}
        </p>
      </div>

      {entries.length === 0 ? (
        <p style={{ fontSize: '13px', color: 'var(--text2)' }}>{locale === 'zh' ? '敬请期待。' : 'Coming soon.'}</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {entries.map(e => (
            <a key={e.slug} href={`/${locale}/buildlog/${e.slug}`} className="surface-hover" style={{
              display: 'block', padding: '16px 18px', background: 'var(--surface-bg)', border: '1px solid var(--surface-border)',
              borderRadius: 'var(--r2)', textDecoration: 'none', transition: 'all .2s',
            }}>
              <div style={{ fontFamily: mono, fontSize: '10px', color: 'var(--gold2)', marginBottom: '6px' }}>{e.date}</div>
              <h2 style={{ fontFamily: serif, fontSize: '17px', fontWeight: 400, color: 'var(--text)', marginBottom: '6px', lineHeight: 1.3 }}>{e.title}</h2>
              <p style={{ fontSize: '12px', color: 'var(--text2)', lineHeight: 1.6 }}>{e.summary}</p>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
