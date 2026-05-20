import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import type { DailyMeta, DailyPost } from '@/types/daily'
import type { Project } from '@/types/project'
import { parseHorizonMarkdown, parseStats } from './daily-parser'

const CONTENT_DIR = path.join(process.cwd(), 'content')
const DAILY_DIR = path.join(CONTENT_DIR, 'daily')
const PROJECTS_DIR = path.join(CONTENT_DIR, 'projects')

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
    items: parseHorizonMarkdown(content),
    rawContent: content,
  }
}

export function getLatestDailySlug(locale: 'en' | 'zh'): string | null {
  const all = getAllDailyMeta(locale)
  return all.length > 0 ? all[0].slug : null
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
