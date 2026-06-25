import { getAllDailyMeta } from '@/lib/content'
import { SITE_URL } from '@/lib/site'

export const dynamic = 'force-static'

// llms.txt：给 AI 引擎的站点导览（GEO）。约定见 https://llmstxt.org
export async function GET() {
  const latestDaily = getAllDailyMeta('zh')[0]
  const body = `# Alex Tang

> 独立开发者，专注用 AI 构建真实产品。新加坡餐饮 SaaS 膳云 MakanCloud 创始人，同时分享 AI 技术资讯、投资研究和构建日志。

## 关于
- Alex Tang 使用 AI agents（Claude、Codex）构建和发布真实软件产品，并公开分享构建过程。
- 提供软件定制、AI 工具建设和 AI 产品咨询。

## MakanCloud (膳云)
- What: 面向新加坡连锁餐饮的全链路运营平台，覆盖订货、中央厨房、配送调度、OR-Tools 智能排班、POS 和扫码点餐。
- Who: 新加坡餐饮店主和成长中的多门店品牌。
- Pricing: S$59/月起；14 天 Pro 免费试用，无需信用卡。
- Differentiators: POS 与后厨订货/库存打通；离线收银；多租户白标；中央厨房追溯；中英双语。
- Details: ${SITE_URL}/zh/makancloud

## Key pages
- Home: ${SITE_URL}/zh
- MakanCloud (product): ${SITE_URL}/zh/makancloud
- Building in public: ${SITE_URL}/zh/buildlog
- Projects: ${SITE_URL}/zh/projects
- About: ${SITE_URL}/zh/about
- Daily tech digest: ${SITE_URL}/zh/daily${latestDaily ? ` (latest: ${latestDaily.date})` : ''}
- Investment research: ${SITE_URL}/zh/investment

## Notes
- Default language is Simplified Chinese (/zh). English remains available at /en.
- Sitemap: ${SITE_URL}/sitemap.xml
- RSS: ${SITE_URL}/rss.xml
`
  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
