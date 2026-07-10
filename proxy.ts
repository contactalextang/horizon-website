import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

const handler = createMiddleware(routing)

export function proxy(request: Parameters<typeof handler>[0]) {
  return handler(request)
}

export const config = {
  // 排除元数据图片路由（opengraph-image / twitter-image）——它们无 locale 前缀，
  // 否则会被 i18n 重定向到 /zh 导致社媒抓取器拿不到 OG 图。
  matcher: ['/((?!api|_next|_vercel|opengraph-image|twitter-image|.*\\..*).*)']
}
