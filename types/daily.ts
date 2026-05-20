export interface DailyItem {
  index: number
  title: string
  url: string
  score: number
  summary: string
  source: string        // e.g. "hackernews"
  feedName: string      // e.g. "Hacker News RSS"
  author?: string
  publishedAt?: string
  discussionUrl?: string
  background?: string
  references: { title: string; url: string }[]
  discussion?: string
  tags: string[]
}

export interface DailyMeta {
  slug: string          // "2026-05-20-en"
  date: string          // "2026-05-20"
  lang: 'en' | 'zh'
  title: string
  itemCount: number
  totalFetched: number
  sources: string[]
  topTags: string[]
}

export interface DailyPost extends DailyMeta {
  items: DailyItem[]
  rawContent: string
}
