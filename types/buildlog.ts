export interface BuildlogEntry {
  slug: string // = date, YYYY-MM-DD
  date: string
  title: string
  summary: string
  bodyMarkdown: string
  tags: string[]
}

// 存储格式：content/buildlog/<date>.json
// { date, title:{en,zh}, summary:{en,zh}, body:{en,zh}, tags:[] }
export interface BuildlogFile {
  date: string
  title: { en: string; zh: string }
  summary: { en: string; zh: string }
  body: { en: string; zh: string }
  tags: string[]
}
