import type { MetadataRoute } from 'next'
import { getAllDailyMeta, getAllInvestmentMeta } from '@/lib/content'
import { LOCALES, SITE_URL } from '@/lib/site'

// 静态板块（每个 locale 都有）。投资板块仅 zh，单独处理。
const STATIC_PATHS = ['', '/daily', '/projects', '/about', '/makancloud', '/buildlog']

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = []
  const now = new Date()

  for (const locale of LOCALES) {
    for (const path of STATIC_PATHS) {
      entries.push({
        url: `${SITE_URL}/${locale}${path}`,
        lastModified: now,
        changeFrequency: path === '' || path === '/daily' || path === '/buildlog' ? 'daily' : 'weekly',
        alternates: {
          languages: {
            en: `${SITE_URL}/en${path}`,
            zh: `${SITE_URL}/zh${path}`,
          },
        },
      })
    }

    // 每日简报详情
    for (const post of getAllDailyMeta(locale)) {
      entries.push({
        url: `${SITE_URL}/${locale}/daily/${post.date}`,
        lastModified: post.date,
        changeFrequency: 'monthly',
      })
    }
  }

  // 投资简报（仅 zh）
  for (const post of getAllInvestmentMeta()) {
    entries.push({
      url: `${SITE_URL}/zh/investment/${post.date}`,
      lastModified: post.date,
      changeFrequency: 'monthly',
    })
  }

  return entries
}
