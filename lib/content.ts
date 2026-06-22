import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import type { DailyMeta, DailyPost } from '@/types/daily'
import type { InvestmentMeta, InvestmentPost } from '@/types/investment'
import type { Project } from '@/types/project'
import type { WhatsNewItem } from '@/types/makancloud'
import type { BuildlogEntry, BuildlogFile } from '@/types/buildlog'
import { parseHorizonMarkdown, parseStats } from './daily-parser'
import { dateFromInvestmentFilename, parseInvestmentMarkdown } from './investment-parser'
import { renderMarkdownToHtml } from './markdown'

const CONTENT_DIR = path.join(process.cwd(), 'content')
const DAILY_DIR = path.join(CONTENT_DIR, 'daily')
const INVESTMENT_DIR = path.join(CONTENT_DIR, 'investment')
const PROJECTS_DIR = path.join(CONTENT_DIR, 'projects')
const MAKANCLOUD_DIR = path.join(CONTENT_DIR, 'makancloud')
const BUILDLOG_DIR = path.join(CONTENT_DIR, 'buildlog')

// ─── Daily Posts ────────────────────────────────────────────────

export function getAllDailyMeta(locale: 'en' | 'zh'): DailyMeta[] {
  if (!fs.existsSync(DAILY_DIR)) return []

  return fs.readdirSync(DAILY_DIR)
    .filter(f => f.endsWith(`-${locale}.md`) && !f.startsWith('_'))
    .map(f => {
      const raw = fs.readFileSync(path.join(DAILY_DIR, f), 'utf8')
      const { data } = matter(raw)
      const slug = f.replace('.md', '')
      const date = slug.replace(`-${locale}`, '')
      return {
        slug,
        date,
        lang: locale,
        title: data.title || `Horizon Daily: ${date}`,
        itemCount: data.item_count || 0,
        totalFetched: data.total_fetched || 0,
        sources: data.sources || [],
        topTags: data.top_tags || [],
        status: data.status === 'warning' ? 'warning' : 'normal',
        warningReason: data.warning_reason,
      } satisfies DailyMeta
    })
    .sort((a, b) => b.date.localeCompare(a.date))
}

export function getDailyPost(date: string, locale: 'en' | 'zh'): DailyPost | null {
  const slug = `${date}-${locale}`
  const filePath = path.join(DAILY_DIR, `${slug}.md`)
  if (!fs.existsSync(filePath)) return null

  const raw = fs.readFileSync(filePath, 'utf8')
  const { data, content } = matter(raw)
  const { totalFetched, itemCount } = parseStats(content)

  return {
    slug,
    date,
    lang: locale,
    title: data.title || `Horizon Daily: ${date}`,
    itemCount: data.item_count || itemCount,
    totalFetched: data.total_fetched || totalFetched,
    sources: data.sources || [],
    topTags: data.top_tags || [],
    status: data.status === 'warning' ? 'warning' : 'normal',
    warningReason: data.warning_reason,
    items: parseHorizonMarkdown(content),
    rawContent: content,
  }
}

export function getLatestDailySlug(locale: 'en' | 'zh'): string | null {
  const all = getAllDailyMeta(locale)
  return all.length > 0 ? all[0].slug : null
}

// ─── Investment Briefs ─────────────────────────────────────────

export function getAllInvestmentMeta(): InvestmentMeta[] {
  if (!fs.existsSync(INVESTMENT_DIR)) return []

  return fs.readdirSync(INVESTMENT_DIR)
    .filter(f => f.endsWith('.md') && !f.startsWith('_'))
    .map(f => {
      const date = dateFromInvestmentFilename(f)
      if (!date) return null

      const raw = fs.readFileSync(path.join(INVESTMENT_DIR, f), 'utf8')
      const { data, content } = matter(raw)
      const parsed = parseInvestmentMarkdown(content, date)

      return {
        slug: date,
        date,
        lang: 'zh',
        title: data.title || parsed.title,
        readingMinutes: data.reading_minutes || parsed.readingMinutes,
        sections: data.sections || parsed.sections,
        signals: data.signals || parsed.signals,
      } satisfies InvestmentMeta
    })
    .filter((post): post is InvestmentMeta => post !== null)
    .sort((a, b) => b.date.localeCompare(a.date))
}

export async function getInvestmentPost(date: string): Promise<InvestmentPost | null> {
  if (!fs.existsSync(INVESTMENT_DIR)) return null

  const filename = fs.readdirSync(INVESTMENT_DIR)
    .find(f => f.endsWith('.md') && dateFromInvestmentFilename(f) === date)
  if (!filename) return null

  const raw = fs.readFileSync(path.join(INVESTMENT_DIR, filename), 'utf8')
  const { data, content } = matter(raw)
  const parsed = parseInvestmentMarkdown(content, date)

  return {
    slug: date,
    date,
    lang: 'zh',
    title: data.title || parsed.title,
    readingMinutes: data.reading_minutes || parsed.readingMinutes,
    sections: data.sections || parsed.sections,
    signals: data.signals || parsed.signals,
    rawContent: content,
    html: await renderMarkdownToHtml(content),
  }
}

// ─── Projects ────────────────────────────────────────────────────

export function getAllProjects(): Project[] {
  if (!fs.existsSync(PROJECTS_DIR)) return []

  return fs.readdirSync(PROJECTS_DIR)
    .filter(f => f.endsWith('.md') && !f.startsWith('_'))
    .map(f => {
      const raw = fs.readFileSync(path.join(PROJECTS_DIR, f), 'utf8')
      const { data, content } = matter(raw)
      return {
        slug: f.replace('.md', ''),
        title: data.title || '',
        description: data.description || '',
        type: data.type || 'text',
        lang: data.lang || 'zh',
        tags: data.tags || [],
        cover: data.cover,
        videoUrl: data.video_url,
        demoUrl: data.demo_url,
        githubUrl: data.github_url,
        featured: data.featured || false,
        date: data.date || '',
        status: data.status || 'active',
        order: data.order || 99,
        content,
      } satisfies Project
    })
    .sort((a, b) => a.order - b.order)
}

export function getFeaturedProjects(): Project[] {
  return getAllProjects().filter(p => p.featured)
}

// ─── MakanCloud What's New（由 sync 脚本从膳云 changelog 维护）──────

export function getMakanWhatsNew(): WhatsNewItem[] {
  const file = path.join(MAKANCLOUD_DIR, 'whatsnew.json')
  if (!fs.existsSync(file)) return []
  try {
    const data = JSON.parse(fs.readFileSync(file, 'utf8'))
    const items: WhatsNewItem[] = Array.isArray(data.items) ? data.items : []
    return items
      .filter(i => i && i.date && (i.zh || i.en))
      .sort((a, b) => b.date.localeCompare(a.date))
  } catch {
    return []
  }
}

// ─── Build log（building-in-public，仅放已审核条目）─────────────

function readBuildlogFile(file: string, locale: 'en' | 'zh'): BuildlogEntry | null {
  try {
    const data = JSON.parse(fs.readFileSync(path.join(BUILDLOG_DIR, file), 'utf8')) as BuildlogFile
    if (!data.date) return null
    const pickLocale = (b: { en: string; zh: string }) => b[locale] || b.zh || b.en || ''
    return {
      slug: data.date,
      date: data.date,
      title: pickLocale(data.title),
      summary: pickLocale(data.summary),
      bodyMarkdown: pickLocale(data.body),
      tags: data.tags || [],
    }
  } catch {
    return null
  }
}

export function getAllBuildlog(locale: 'en' | 'zh'): BuildlogEntry[] {
  if (!fs.existsSync(BUILDLOG_DIR)) return []
  return fs.readdirSync(BUILDLOG_DIR)
    .filter(f => f.endsWith('.json') && !f.startsWith('_'))
    .map(f => readBuildlogFile(f, locale))
    .filter((e): e is BuildlogEntry => e !== null)
    .sort((a, b) => b.date.localeCompare(a.date))
}

export function getBuildlogEntry(slug: string, locale: 'en' | 'zh'): BuildlogEntry | null {
  if (!fs.existsSync(path.join(BUILDLOG_DIR, `${slug}.json`))) return null
  return readBuildlogFile(`${slug}.json`, locale)
}
