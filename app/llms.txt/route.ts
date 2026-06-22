import { getAllDailyMeta } from '@/lib/content'
import { SITE_URL } from '@/lib/site'

export const dynamic = 'force-static'

// llms.txt：给 AI 引擎的站点导览（GEO）。约定见 https://llmstxt.org
export async function GET() {
  const latestDaily = getAllDailyMeta('en')[0]
  const body = `# Horizon — Alex Tang

> Solo builder shipping real products with AI. Creator of MakanCloud (膳云), a Singapore F&B operations SaaS. Also: custom software, an AI-curated tech digest, and investing notes.

## About
- Alex Tang builds software with AI agents (Claude, Codex) and shares the process in public.
- Available for custom software work and AI-build consulting.

## MakanCloud (膳云)
- What: All-in-one operations platform for Singapore restaurant chains — ordering, central kitchen, delivery dispatch, OR-Tools staff scheduling, POS, and QR self-ordering.
- Who: Singapore F&B owners and growing multi-outlet chains.
- Pricing: from SGD 59/month; 14-day Pro free trial, no credit card.
- Differentiators: POS integrated with back-of-house ordering/inventory; offline checkout; multi-tenant white-label; central-kitchen traceability; bilingual (中/EN).
- Details: ${SITE_URL}/en/makancloud

## Key pages
- Home: ${SITE_URL}/en
- MakanCloud (product): ${SITE_URL}/en/makancloud
- Building in public: ${SITE_URL}/en/buildlog
- Projects: ${SITE_URL}/en/projects
- About: ${SITE_URL}/en/about
- Daily tech digest: ${SITE_URL}/en/daily${latestDaily ? ` (latest: ${latestDaily.date})` : ''}

## Notes
- Content is available in English (/en) and Simplified Chinese (/zh).
- Sitemap: ${SITE_URL}/sitemap.xml
- RSS: ${SITE_URL}/rss.xml
`
  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
