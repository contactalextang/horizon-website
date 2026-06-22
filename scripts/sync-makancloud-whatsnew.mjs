#!/usr/bin/env node
/**
 * 从膳云仓库的 docs/sprint-log.md 维护 content/makancloud/whatsnew.json 的「最近更新」。
 *
 * 策略（保守、增量）：
 *  - 只追加日期晚于现有最新条目的更新（每个日期取最靠上的一条 = 当天最新）。
 *  - 绝不删除/改写已有条目（保留人工润色的 en/zh）。
 *  - 新条目 en 留空，待人工补译（页面回退到 zh）。
 *  - 找不到膳云仓库（如 Vercel 构建机）时跳过，不动已提交的 json。
 *
 * 源路径：env MAKANCLOUD_REPO，或常见候选路径。
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(scriptDir, '..')
const WHATSNEW = path.join(repoRoot, 'content', 'makancloud', 'whatsnew.json')

const CANDIDATES = [
  process.env.MAKANCLOUD_REPO,
  path.resolve(repoRoot, '..', '膳云'),
  '/home/alex/桌面/膳云集舍/膳云',
  '/home/alex/桌面/baimixiang',
].filter(Boolean)

function findSprintLog() {
  for (const base of CANDIDATES) {
    const p = path.join(base, 'docs', 'sprint-log.md')
    if (fs.existsSync(p)) return p
  }
  return null
}

const DATE_RE = /(20\d{2})-(\d{2})-(\d{2})/

export function parseSprintLog(md) {
  const out = []
  for (const line of md.split(/\r?\n/)) {
    const h = line.match(/^##\s+(.+?)\s*$/)
    if (!h) continue
    const heading = h[1]
    const dm = heading.match(DATE_RE)
    if (!dm) continue
    const date = `${dm[1]}-${dm[2]}-${dm[3]}`
    // 取破折号/括号/日期之前的标题主体作为公开摘要
    let title = heading.split(/[—\-（(]/)[0].trim()
    title = title.replace(/[✅\s]+$/u, '').trim()
    let version = ''
    let zh = title
    if (title.includes('：')) {
      const idx = title.indexOf('：')
      version = title.slice(0, idx).trim()
      zh = title.slice(idx + 1).trim()
    }
    if (zh) out.push({ version, date, zh, en: '' })
  }
  return out
}

function main() {
  const src = findSprintLog()
  if (!src) {
    console.log('makancloud whatsnew: 未找到膳云 sprint-log.md，跳过（保留已提交 json）。')
    return
  }
  const data = JSON.parse(fs.readFileSync(WHATSNEW, 'utf8'))
  const items = Array.isArray(data.items) ? data.items : []
  const latest = items.reduce((m, i) => (i.date > m ? i.date : m), '0000-00-00')

  const parsed = parseSprintLog(fs.readFileSync(src, 'utf8'))
  // 每个日期保留最靠上一条；只要晚于现有最新日期
  const seenDate = new Set(items.map((i) => i.date))
  const additions = []
  for (const e of parsed) {
    if (e.date <= latest) continue
    if (seenDate.has(e.date)) continue
    seenDate.add(e.date)
    additions.push(e)
  }

  if (additions.length === 0) {
    console.log('makancloud whatsnew: 无新条目。')
    return
  }

  data.items = [...additions, ...items].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 12)
  fs.writeFileSync(WHATSNEW, JSON.stringify(data, null, 2) + '\n')
  console.log(`makancloud whatsnew: 新增 ${additions.length} 条（${additions.map((a) => a.date).join(', ')}）。`)
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main()
}
