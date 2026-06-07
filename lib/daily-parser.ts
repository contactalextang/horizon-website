import type { DailyItem } from '@/types/daily'

// Extract score from "⭐️ 8.0/10" or "★ 8.0/10"
function parseScore(text: string): number {
  const m = text.match(/(\d+\.\d+)\/10/)
  return m ? parseFloat(m[1]) : 0
}

// Extract tags from "**Tags**: `#tag1`, `#tag2`"
function parseTags(text: string): string[] {
  const tagLine = text.match(/\*\*Tags?\*\*:([^\n]+)/i)
  if (!tagLine) return []
  return [...tagLine[1].matchAll(/`#([^`]+)`/g)].map(m => m[1])
}

// Extract references from <details>...</details>
function parseReferences(block: string): { title: string; url: string }[] {
  const refs: { title: string; url: string }[] = []
  const detailsMatch = block.match(/<details[\s\S]*?<\/details>/i)
  if (!detailsMatch) return refs
  const linkRe = /<a\s+href="([^"]+)"[^>]*>([^<]+)<\/a>/gi
  let m
  while ((m = linkRe.exec(detailsMatch[0])) !== null) {
    refs.push({ url: m[1], title: m[2].trim() })
  }
  return refs
}

// Parse "source · feed · author · date · [Discussion](url)"
function parseSourceLine(line: string): { source: string; feedName: string; author?: string; publishedAt?: string; discussionUrl?: string } {
  const parts = line.split('·').map(s => s.trim())
  const source = parts[0] || ''
  const feedName = parts[1] || ''
  const discMatch = line.match(/\[Discussion\]\(([^)]+)\)/)
  const discussionUrl = discMatch ? discMatch[1] : undefined
  const dateMatch = parts.find(p => /\w+\s+\d+,?\s+\d{2}:\d{2}/.test(p) || /\w+\s+\d+/.test(p))
  return { source, feedName, author: parts[2], publishedAt: dateMatch, discussionUrl }
}

export function parseHorizonMarkdown(content: string): DailyItem[] {
  const items: DailyItem[] = []

  // Split on <a id="item-N"></a> markers
  const blocks = content.split(/<a\s+id="item-(\d+)"[^>]*><\/a>/i)

  // blocks[0] is preamble, then pairs: [index, content, index, content, ...]
  for (let i = 1; i < blocks.length; i += 2) {
    const indexStr = blocks[i]
    const block = blocks[i + 1] || ''

    const index = parseInt(indexStr, 10)

    // Extract title line: "## [Title](URL) ⭐️ 8.0/10"
    const titleLineMatch = block.match(/^##\s+\[([^\]]+)\]\(([^)]+)\)\s*(.*)/m)
    if (!titleLineMatch) continue

    const title = titleLineMatch[1].trim()
    const url = titleLineMatch[2].trim()
    const scoreStr = titleLineMatch[3]
    const score = parseScore(scoreStr)

    // Extract summary: first paragraph after the title line
    const afterTitle = block.slice(titleLineMatch.index! + titleLineMatch[0].length).trim()
    const summaryMatch = afterTitle.match(/^([^\n*#<]+(?:\n[^\n*#<]+)*)/m)
    const summary = summaryMatch ? summaryMatch[1].replace(/\n/g, ' ').trim() : ''

    // Extract source line: line matching "word · word" pattern (before **Background**)
    const sourceLineMatch = afterTitle.match(/^([a-zA-Z][^\n]+·[^\n]+)$/m)
    const sourceParsed = sourceLineMatch ? parseSourceLine(sourceLineMatch[1]) : { source: '', feedName: '' }

    // Extract background
    const bgMatch = afterTitle.match(/\*\*Background\*\*:\s*([^\n*]+(?:\n(?!\*\*)[^\n*]+)*)/i)
    const background = bgMatch ? bgMatch[1].trim() : undefined

    // Extract discussion
    const discMatch = afterTitle.match(/\*\*Discussion\*\*:\s*([^\n*]+(?:\n(?!\*\*)[^\n*]+)*)/i)
    const discussion = discMatch ? discMatch[1].trim() : undefined

    const references = parseReferences(block)
    const tags = parseTags(block)

    items.push({
      index,
      title,
      url,
      score,
      summary,
      source: sourceParsed.source,
      feedName: sourceParsed.feedName,
      author: sourceParsed.author,
      publishedAt: sourceParsed.publishedAt,
      discussionUrl: sourceParsed.discussionUrl,
      background,
      references,
      discussion,
      tags,
    })
  }

  return items
}

// Extract the preamble stats: "From 75 items, 46 important content pieces were selected"
export function parseStats(content: string): { totalFetched: number; itemCount: number } {
  const m = content.match(/From\s+(\d+)\s+items?,\s+(\d+)\s+important/i)
  if (m) return { totalFetched: parseInt(m[1]), itemCount: parseInt(m[2]) }
  const warning = content.match(/Warning:\s+analyzed\s+(\d+)\s+items?,\s+but\s+scoring\s+selected\s+0/i)
  if (warning) return { totalFetched: parseInt(warning[1]), itemCount: 0 }
  const zhWarning = content.match(/警告：已分析\s+(\d+)\s+条内容，但评分筛选结果为\s+0/i)
  if (zhWarning) return { totalFetched: parseInt(zhWarning[1]), itemCount: 0 }
  return { totalFetched: 0, itemCount: 0 }
}
