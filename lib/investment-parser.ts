export type ParsedInvestmentMarkdown = {
  title: string
  date: string
  readingMinutes: number
  sections: string[]
  signals: string[]
  summary: string
}

function cleanHeading(value: string): string {
  return value
    .replace(/^#+\s*/, '')
    .replace(/^[^\p{Letter}\p{Number}]+/u, '')
    .trim()
}

function stripMarkdown(value: string): string {
  return value
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[*_`#>]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

export function dateFromInvestmentFilename(filename: string): string | null {
  const isoMatch = filename.match(/(20\d{2})-(\d{2})-(\d{2})/)
  if (isoMatch) return `${isoMatch[1]}-${isoMatch[2]}-${isoMatch[3]}`

  const compactMatch = filename.match(/(20\d{2})(\d{2})(\d{2})/)
  if (compactMatch) return `${compactMatch[1]}-${compactMatch[2]}-${compactMatch[3]}`

  return null
}

export function parseInvestmentMarkdown(content: string, fallbackDate: string): ParsedInvestmentMarkdown {
  const titleMatch = content.match(/^#\s+(.+)$/m)
  const title = titleMatch ? cleanHeading(titleMatch[1]) : `AI产业每日简报 · ${fallbackDate}`

  const readingMatch = content.match(/阅读约\s*(\d+)\s*分钟/)
  const readingMinutes = readingMatch ? Number(readingMatch[1]) : Math.max(1, Math.ceil(content.length / 650))

  const sections = [...content.matchAll(/^##\s+(.+)$/gm)]
    .map(match => cleanHeading(match[1]))
    .filter(Boolean)

  const signalHeadingMatch = content.match(/^##\s+.*核心信号.*$/m)
  let signalBlock = ''
  if (signalHeadingMatch?.index !== undefined) {
    const rest = content.slice(signalHeadingMatch.index)
    const nextSectionIndex = rest.search(/\n##\s+/)
    signalBlock = nextSectionIndex >= 0 ? rest.slice(0, nextSectionIndex) : rest
  }

  const signals = signalBlock
    ? [...signalBlock.matchAll(/^\d+\.\s+\*\*(.+?)\*\*\s*[—-]\s*(.+)$/gm)]
      .map(match => `${stripMarkdown(match[1])} — ${stripMarkdown(match[2])}`)
      .slice(0, 3)
    : []

  // 概要：抽取正文「一句话阅读引导」blockquote 作为卡片摘要
  const summaryMatch = content.match(/一句话阅读引导[^：:]*[：:]\s*([^\n]+)/)
  let summary = summaryMatch ? stripMarkdown(summaryMatch[1]) : ''
  if (summary.length > 120) summary = summary.slice(0, 118).trimEnd() + '…'

  return {
    title,
    date: fallbackDate,
    readingMinutes,
    sections,
    signals,
    summary,
  }
}
