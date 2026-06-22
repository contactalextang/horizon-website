import { notFound } from 'next/navigation'
import { getAllBuildlog, getBuildlogEntry } from '@/lib/content'
import { renderMarkdownToHtml } from '@/lib/markdown'
import { routing } from '@/i18n/routing'
import { absUrl, languageAlternates } from '@/lib/site'
import { blogPostingJsonLd, breadcrumbJsonLd } from '@/lib/jsonld'
import JsonLd from '@/components/JsonLd'

type Props = { params: Promise<{ locale: 'en' | 'zh'; slug: string }> }

const mono = "'Courier New',monospace"
const serif = "'EB Garamond',var(--font-garamond),Georgia,serif"

export async function generateStaticParams() {
  const params: { locale: string; slug: string }[] = []
  for (const locale of routing.locales) {
    for (const e of getAllBuildlog(locale)) params.push({ locale, slug: e.slug })
  }
  return params
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params
  const entry = getBuildlogEntry(slug, locale)
  if (!entry) return {}
  return {
    title: entry.title,
    description: entry.summary,
    alternates: { canonical: absUrl(locale, `/buildlog/${slug}`), languages: languageAlternates(`/buildlog/${slug}`) },
    openGraph: { title: entry.title, description: entry.summary, type: 'article', url: absUrl(locale, `/buildlog/${slug}`) },
  }
}

export default async function BuildlogDetail({ params }: Props) {
  const { locale, slug } = await params
  const entry = getBuildlogEntry(slug, locale)
  if (!entry) notFound()

  const html = await renderMarkdownToHtml(entry.bodyMarkdown)

  return (
    <article style={{ maxWidth: '720px', margin: '0 auto', padding: '0 24px 80px' }}>
      <JsonLd data={[
        blogPostingJsonLd({ locale, title: entry.title, description: entry.summary, date: entry.date, path: `/buildlog/${slug}` }),
        breadcrumbJsonLd(locale, [
          { name: locale === 'zh' ? '首页' : 'Home', path: '/' },
          { name: locale === 'zh' ? '开发日志' : 'Build log', path: '/buildlog' },
          { name: entry.title, path: `/buildlog/${slug}` },
        ]),
      ]} />

      <div style={{ padding: '36px 0 20px', borderBottom: '1px solid var(--line)', marginBottom: '24px' }}>
        <div style={{ fontFamily: mono, fontSize: '10px', letterSpacing: '.14em', color: 'var(--gold2)', marginBottom: '10px' }}>
          {entry.date} · {locale === 'zh' ? '开发日志' : 'BUILD LOG'}
        </div>
        <h1 style={{ fontFamily: serif, fontSize: 'clamp(22px, 4vw, 32px)', fontWeight: locale === 'zh' ? 700 : 400, color: 'var(--text)', lineHeight: 1.2 }}>
          {entry.title}
        </h1>
        {entry.tags.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '12px' }}>
            {entry.tags.map(t => (
              <span key={t} style={{ fontFamily: mono, fontSize: '9px', padding: '2px 7px', borderRadius: '3px', background: 'var(--bg4)', color: 'var(--text3)', border: '1px solid var(--line2)' }}>{t}</span>
            ))}
          </div>
        )}
      </div>

      <div className="prose" style={{ fontSize: '15px', color: 'var(--text)', lineHeight: 1.85 }} dangerouslySetInnerHTML={{ __html: html }} />

      <div style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid var(--line)' }}>
        <a href={`/${locale}/buildlog`} style={{ fontFamily: mono, fontSize: '11px', color: 'var(--gold)', textDecoration: 'none' }}>
          ← {locale === 'zh' ? '返回开发日志' : 'Back to build log'}
        </a>
      </div>
    </article>
  )
}
