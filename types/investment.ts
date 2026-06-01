export interface InvestmentMeta {
  slug: string
  date: string
  lang: 'zh'
  title: string
  readingMinutes: number
  sections: string[]
  signals: string[]
}

export interface InvestmentPost extends InvestmentMeta {
  rawContent: string
  html: string
}
