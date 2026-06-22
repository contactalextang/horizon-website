import { getMakanWhatsNew } from '@/lib/content'
import { absUrl, languageAlternates } from '@/lib/site'
import { breadcrumbJsonLd, faqJsonLd, makanCloudJsonLd } from '@/lib/jsonld'
import JsonLd from '@/components/JsonLd'
import {
  faq, features, makanHero, pick, pricing, valueProps, type Locale,
} from '@/lib/makancloud-data'

type Props = { params: Promise<{ locale: Locale }> }

export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'zh' }]
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const title = locale === 'zh' ? '膳云 MakanCloud · 餐饮全链路运营平台' : 'MakanCloud · Cloud Operations for Modern Dining Brands'
  const description = pick(makanHero.subtitle, locale)
  return {
    title,
    description,
    alternates: { canonical: absUrl(locale, '/makancloud'), languages: languageAlternates('/makancloud') },
    openGraph: { title, description, url: absUrl(locale, '/makancloud'), type: 'website' },
    twitter: { card: 'summary_large_image', title, description },
  }
}

const mono = "'Courier New',monospace"
const serif = "'EB Garamond',var(--font-garamond),Georgia,serif"

export default async function MakanCloudPage({ params }: Props) {
  const { locale } = await params
  const whatsNew = getMakanWhatsNew()
  const tryUrl = 'https://makancloud.com/register'

  const jsonld = [
    makanCloudJsonLd(locale),
    faqJsonLd(faq.map((f) => ({ q: pick(f.q, locale), a: pick(f.a, locale) }))),
    breadcrumbJsonLd(locale, [
      { name: locale === 'zh' ? '首页' : 'Home', path: '/' },
      { name: 'MakanCloud', path: '/makancloud' },
    ]),
  ]

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '0 24px 80px' }}>
      <JsonLd data={jsonld} />

      {/* Hero */}
      <section style={{ padding: '44px 0 28px', borderBottom: '1px solid var(--line)', marginBottom: '32px' }}>
        <div style={{ fontFamily: mono, fontSize: '10px', letterSpacing: '.14em', color: 'var(--gold2)', textTransform: 'uppercase', marginBottom: '12px' }}>
          {pick(makanHero.kicker, locale)}
        </div>
        <h1 style={{ fontFamily: serif, fontSize: 'clamp(26px, 5vw, 40px)', fontWeight: locale === 'zh' ? 700 : 400, color: 'var(--text)', lineHeight: 1.15, maxWidth: '760px' }}>
          {pick(makanHero.title, locale)}
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--text2)', lineHeight: 1.8, marginTop: '14px', maxWidth: '680px' }}>
          {pick(makanHero.subtitle, locale)}
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '18px' }}>
          {makanHero.badges.map((b, i) => (
            <span key={i} style={{ fontFamily: mono, fontSize: '10px', padding: '4px 9px', borderRadius: 'var(--r)', background: 'var(--greenbg)', color: '#4DC882', border: '1px solid var(--line2)' }}>
              {pick(b, locale)}
            </span>
          ))}
        </div>
        <div style={{ marginTop: '22px' }}>
          <a href={tryUrl} style={{ display: 'inline-block', fontFamily: mono, fontSize: '12px', padding: '9px 18px', borderRadius: 'var(--r)', background: 'var(--gold)', color: '#fff', textDecoration: 'none', letterSpacing: '.04em' }}>
            {locale === 'zh' ? '开始 14 天免费试用 →' : 'Start 14-day free trial →'}
          </a>
        </div>
      </section>

      {/* Value props */}
      <SectionTitle locale={locale} en="Why MakanCloud" zh="为什么选膳云" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: '10px', marginBottom: '40px' }}>
        {valueProps.map((v, i) => (
          <div key={i} style={{ padding: '16px', background: 'var(--surface-bg)', border: '1px solid var(--surface-border)', borderRadius: 'var(--r2)' }}>
            <div style={{ fontFamily: serif, fontSize: '16px', color: 'var(--gold)', marginBottom: '6px' }}>{pick(v.title, locale)}</div>
            <p style={{ fontSize: '12px', color: 'var(--text2)', lineHeight: 1.65 }}>{pick(v.body, locale)}</p>
          </div>
        ))}
      </div>

      {/* Features */}
      <SectionTitle locale={locale} en="What it does" zh="它能做什么" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '10px', marginBottom: '40px' }}>
        {features.map((f, i) => (
          <div key={i} style={{ padding: '16px', background: 'var(--surface-bg)', border: '1px solid var(--surface-border)', borderRadius: 'var(--r2)' }}>
            <h3 style={{ fontFamily: serif, fontSize: '15px', fontWeight: 400, color: 'var(--text)', marginBottom: '6px' }}>{pick(f.name, locale)}</h3>
            <p style={{ fontSize: '12px', color: 'var(--text2)', lineHeight: 1.65 }}>{pick(f.pain, locale)}</p>
          </div>
        ))}
      </div>

      {/* Pricing */}
      <SectionTitle locale={locale} en="Pricing (SGD / month)" zh="定价（SGD / 月）" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px', marginBottom: '40px' }}>
        {pricing.map((p) => (
          <div key={p.name} style={{ padding: '18px', background: p.featured ? 'var(--goldbg)' : 'var(--surface-bg)', border: `1px solid ${p.featured ? 'var(--gold2)' : 'var(--surface-border)'}`, borderRadius: 'var(--r2)' }}>
            <div style={{ fontFamily: mono, fontSize: '11px', letterSpacing: '.1em', color: 'var(--text3)', textTransform: 'uppercase' }}>{p.name}</div>
            <div style={{ fontFamily: serif, fontSize: '30px', color: 'var(--text)', margin: '4px 0 10px' }}>
              <span style={{ fontSize: '14px', color: 'var(--text3)' }}>S$</span>{p.price}
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {[p.outlets, p.terminals, p.extra].map((x, i) => (
                <li key={i} style={{ fontSize: '12px', color: 'var(--text2)', lineHeight: 1.5 }}>· {pick(x, locale)}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* What's New */}
      {whatsNew.length > 0 && (
        <>
          <SectionTitle locale={locale} en="What's new" zh="最近更新" />
          <div style={{ marginBottom: '40px' }}>
            {whatsNew.map((w, i) => (
              <div key={i} style={{ display: 'flex', gap: '14px', padding: '10px 0', borderBottom: '1px solid var(--line)' }}>
                <span style={{ fontFamily: mono, fontSize: '11px', color: 'var(--gold2)', flexShrink: 0, width: '92px' }}>{w.date}</span>
                <span style={{ fontSize: '13px', color: 'var(--text2)', lineHeight: 1.6 }}>{(locale === 'zh' ? w.zh : w.en) || w.zh}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {/* FAQ */}
      <SectionTitle locale={locale} en="FAQ" zh="常见问题" />
      <div>
        {faq.map((f, i) => (
          <div key={i} style={{ padding: '14px 0', borderBottom: '1px solid var(--line)' }}>
            <h3 style={{ fontFamily: serif, fontSize: '15px', fontWeight: locale === 'zh' ? 600 : 400, color: 'var(--text)', marginBottom: '6px' }}>{pick(f.q, locale)}</h3>
            <p style={{ fontSize: '13px', color: 'var(--text2)', lineHeight: 1.75 }}>{pick(f.a, locale)}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function SectionTitle({ locale, en, zh }: { locale: Locale; en: string; zh: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
      <span style={{ fontFamily: mono, fontSize: '9px', letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--text3)' }}>
        {locale === 'zh' ? zh : en}
      </span>
      <div style={{ flex: 1, height: '1px', background: 'var(--line)' }} />
    </div>
  )
}
