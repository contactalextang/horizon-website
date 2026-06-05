#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(scriptDir, '..')

function quoteYaml(value) {
  return JSON.stringify(String(value))
}

function cleanHeading(value) {
  return value
    .replace(/^#+\s*/, '')
    .replace(/^[^\p{Letter}\p{Number}]+/u, '')
    .trim()
}

function stripFrontmatter(content) {
  return content.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, '')
}

export function dateFromSourceFilename(filename) {
  const compactMatch = filename.match(/^AI产业每日简报_v4_(20\d{2})(\d{2})(\d{2})(?: \(\d+\))?\.md$/)
  if (compactMatch) return `${compactMatch[1]}-${compactMatch[2]}-${compactMatch[3]}`

  const isoMatch = filename.match(/^(20\d{2})-(\d{2})-(\d{2})(?:-zh)?\.md$/)
  if (isoMatch) return `${isoMatch[1]}-${isoMatch[2]}-${isoMatch[3]}`

  return null
}

function titleFromBody(body, date) {
  const titleMatch = body.match(/^#\s+(.+)$/m)
  return titleMatch ? cleanHeading(titleMatch[1]) : `AI产业每日简报 v4 · ${date}`
}

export function buildPublishedInvestmentMarkdown(sourceContent, date) {
  const body = stripFrontmatter(sourceContent).trimStart()
  const title = titleFromBody(body, date)
  const frontmatter = [
    '---',
    `title: ${quoteYaml(title)}`,
    `date: ${quoteYaml(date)}`,
    'lang: "zh"',
    'source: "investment-v4"',
    '---',
    '',
  ].join('\n')

  return `${frontmatter}${body.endsWith('\n') ? body : `${body}\n`}`
}

function isGeneratedInvestmentV4(content) {
  const frontmatterMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  return frontmatterMatch ? /^source:\s*["']?investment-v4["']?\s*$/m.test(frontmatterMatch[1]) : false
}

export function syncInvestmentBriefs({ sourceDir, destDir }) {
  const resolvedSource = path.resolve(sourceDir)
  const resolvedDest = path.resolve(destDir)

  if (!fs.existsSync(resolvedSource)) {
    return {
      sourceDir: resolvedSource,
      destDir: resolvedDest,
      copied: 0,
      removed: 0,
      skipped: true,
    }
  }

  fs.mkdirSync(resolvedDest, { recursive: true })

  const sourceFiles = fs.readdirSync(resolvedSource)
    .filter(file => file.endsWith('.md'))
    .map(file => ({ file, date: dateFromSourceFilename(file) }))
    .filter(entry => entry.date !== null)
    .sort((a, b) => a.date.localeCompare(b.date))

  const expectedTargetFiles = new Set()
  let copied = 0

  for (const entry of sourceFiles) {
    const targetFile = `${entry.date}-zh.md`
    expectedTargetFiles.add(targetFile)

    const sourcePath = path.join(resolvedSource, entry.file)
    const targetPath = path.join(resolvedDest, targetFile)
    const output = buildPublishedInvestmentMarkdown(fs.readFileSync(sourcePath, 'utf8'), entry.date)

    if (!fs.existsSync(targetPath) || fs.readFileSync(targetPath, 'utf8') !== output) {
      fs.writeFileSync(targetPath, output)
      copied += 1
    }
  }

  let removed = 0
  for (const file of fs.readdirSync(resolvedDest)) {
    if (!file.endsWith('.md') || expectedTargetFiles.has(file)) continue

    const targetPath = path.join(resolvedDest, file)
    const content = fs.readFileSync(targetPath, 'utf8')
    if (isGeneratedInvestmentV4(content)) {
      fs.unlinkSync(targetPath)
      removed += 1
    }
  }

  return {
    sourceDir: resolvedSource,
    destDir: resolvedDest,
    copied,
    removed,
    skipped: false,
  }
}

function readArg(name) {
  const index = process.argv.indexOf(name)
  return index >= 0 ? process.argv[index + 1] : undefined
}

function main() {
  const sourceDir = readArg('--source')
    || process.env.INVESTMENT_SOURCE_DIR
    || path.resolve(repoRoot, '..', 'v4版每日简报')
  const destDir = readArg('--dest')
    || process.env.INVESTMENT_DEST_DIR
    || path.join(repoRoot, 'content', 'investment')
  const required = process.argv.includes('--required') || process.env.INVESTMENT_SYNC_REQUIRED === '1'

  const result = syncInvestmentBriefs({ sourceDir, destDir })
  if (result.skipped) {
    const message = `Investment source directory not found: ${result.sourceDir}`
    if (required) {
      console.error(message)
      process.exitCode = 1
      return
    }
    console.log(`${message}; skipping sync.`)
    return
  }

  console.log(`Investment sync: ${result.copied} copied, ${result.removed} removed.`)
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main()
}
