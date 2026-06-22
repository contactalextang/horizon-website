export interface BuildlogEntry {
  slug: string // = date, YYYY-MM-DD
  date: string
  title: string
  summary: string
  bodyMarkdown: string
  tags: string[]
}

// 存储格式：content/buildlog/<date>.json 或 <date>-<campaign>.json
// slug 字段可选：有则用，无则退回 date（向后兼容旧格式）
export interface BuildlogFile {
  slug?: string
  date: string
  title: { en: string; zh: string }
  summary: { en: string; zh: string }
  body: { en: string; zh: string }
  tags: string[]
}
