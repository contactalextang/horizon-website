import { getAllDailyMeta } from '@/lib/content'
import { SITE_NAME, SITE_URL } from '@/lib/site'

export const dynamic = 'force-static'

function escapeXml(s: string): string {
  return s.replace(/[<>&'"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[c] as string))
}

export async function GET() {
  const daily = getAllDailyMeta('en').slice(0, 40)

  const items = daily
    .map((p) => {
      const link = `${SITE_URL}/en/daily/${p.date}`
      const pub = new Date(`${p.date}T08:00:00+08:00`).toUTCString()
      return `    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${pub}</pubDate>
      <description>${escapeXml(`${p.itemCount} items selected from ${p.totalFetched} fetched.`)}</description>
    </item>`
    })
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_NAME)} — Daily</title>
    <link>${SITE_URL}</link>
    <description>AI-curated daily digest of tech and research news, plus building-in-public updates.</description>
    <language>en</language>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  })
}
