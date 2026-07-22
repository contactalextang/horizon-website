/**
 * JSON-LD 结构化数据生成器（GEO/SEO）。
 * 各页面把返回对象传给 <JsonLd> 组件注入 <script type="application/ld+json">。
 */
import { SITE_AUTHOR, SITE_NAME, SITE_URL } from './site'

export function personJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: SITE_AUTHOR,
    url: SITE_URL,
    jobTitle: 'Indie software builder',
    description: 'Solo builder shipping real products with AI; creator of MakanCloud (膳云). Available for custom software work.',
    knowsAbout: ['AI-assisted software development', 'SaaS', 'Restaurant operations software', 'F&B technology', 'Investing'],
    // sameAs：把本站实体与外部资料关联，强化搜索引擎/AI 的知识图谱识别。
    sameAs: ['https://github.com/contactalextang'],
  }
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: ['en', 'zh'],
    author: { '@type': 'Person', name: SITE_AUTHOR },
  }
}

/** 膳云 MakanCloud 的 SoftwareApplication（含套餐 offers）。 */
export function makanCloudJsonLd(locale: 'en' | 'zh') {
  const offers = [
    { name: 'Starter', price: '59' },
    { name: 'Pro', price: '129' },
    { name: 'Growth', price: '199' },
    { name: 'Enterprise', price: '299' },
  ].map((p) => ({
    '@type': 'Offer',
    name: p.name,
    price: p.price,
    priceCurrency: 'SGD',
    priceSpecification: {
      '@type': 'UnitPriceSpecification',
      price: p.price,
      priceCurrency: 'SGD',
      unitText: 'MONTH',
    },
  }))

  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'MakanCloud 膳云',
    applicationCategory: 'BusinessApplication',
    applicationSubCategory: 'Restaurant Management Software',
    operatingSystem: 'Web, Android, iOS (PWA)',
    url: `${SITE_URL}/${locale}/makancloud`,
    description:
      locale === 'zh'
        ? '面向新加坡连锁餐饮的全链路运营平台：订货、中央厨房、配送调度、智能排班、POS 收银与扫码点餐。'
        : 'All-in-one operations platform for Singapore restaurant chains: ordering, central kitchen, delivery dispatch, smart scheduling, POS and QR self-ordering.',
    inLanguage: ['en', 'zh'],
    author: { '@type': 'Person', name: SITE_AUTHOR },
    offers,
    featureList: [
      'Outlet-to-central-kitchen ordering',
      'Central kitchen traceability',
      'Delivery dispatch',
      'OR-Tools staff scheduling',
      'POS with offline checkout',
      'QR self-ordering',
      'Multi-tenant white-label',
      'Bilingual (中文/English)',
    ],
  }
}

export function faqJsonLd(items: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((it) => ({
      '@type': 'Question',
      name: it.q,
      acceptedAnswer: { '@type': 'Answer', text: it.a },
    })),
  }
}

export function breadcrumbJsonLd(locale: 'en' | 'zh', trail: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((t, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: t.name,
      item: `${SITE_URL}/${locale}${t.path === '/' ? '' : t.path}`,
    })),
  }
}

export function blogPostingJsonLd(opts: {
  locale: 'en' | 'zh'
  title: string
  description: string
  date: string
  path: string
  image?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: opts.title,
    description: opts.description,
    ...(opts.image ? { image: opts.image.startsWith('http') ? opts.image : `${SITE_URL}${opts.image}` } : {}),
    datePublished: opts.date,
    dateModified: opts.date,
    inLanguage: opts.locale,
    url: `${SITE_URL}/${opts.locale}${opts.path}`,
    author: { '@type': 'Person', name: SITE_AUTHOR },
    publisher: { '@type': 'Person', name: SITE_AUTHOR },
  }
}
