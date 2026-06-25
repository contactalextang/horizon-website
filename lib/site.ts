/**
 * 站点级常量。生产域名通过环境变量 NEXT_PUBLIC_SITE_URL 覆盖
 * （部署时在实例上为 pm2 进程配置；本地/未配置时回退到正式域名）。
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://alextang.dev').replace(/\/$/, '')

export const SITE_NAME = 'Alex Tang'
export const SITE_AUTHOR = 'Alex Tang'

export const LOCALES = ['zh', 'en'] as const
export type Locale = (typeof LOCALES)[number]

/** 给定 locale 与 path（以 / 开头，不含 locale 前缀），返回绝对 URL。 */
export function absUrl(locale: Locale, path = ''): string {
  const clean = path === '/' ? '' : path
  return `${SITE_URL}/${locale}${clean}`
}

/** hreflang alternates，供 generateMetadata 的 alternates.languages 使用。 */
export function languageAlternates(path = ''): Record<string, string> {
  const clean = path === '/' ? '' : path
  return {
    en: `${SITE_URL}/en${clean}`,
    zh: `${SITE_URL}/zh${clean}`,
    'x-default': `${SITE_URL}/zh${clean}`,
  }
}
