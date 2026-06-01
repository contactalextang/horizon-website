import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'

const modulePath = path.join(process.cwd(), 'scripts', 'sync-investment-content.mjs')

test('syncInvestmentBriefs mirrors v4 markdown into investment content files', async () => {
  const { syncInvestmentBriefs } = await import(modulePath)
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'investment-sync-'))
  const sourceDir = path.join(root, 'v4版每日简报')
  const destDir = path.join(root, 'content', 'investment')
  fs.mkdirSync(sourceDir, { recursive: true })
  fs.mkdirSync(destDir, { recursive: true })

  fs.writeFileSync(
    path.join(sourceDir, 'AI产业每日简报_v4_20260601.md'),
    [
      '# 🌅 AI产业每日简报 v4 · 2026-06-01',
      '',
      '> **一句话阅读引导**：测试同步。',
      '',
      '## 🎯 一、本周核心信号（三句话版）',
      '',
      '1. **同步生效** — 最新简报进入网站内容目录。',
      '',
    ].join('\n'),
  )
  fs.writeFileSync(
    path.join(destDir, '2026-05-01-zh.md'),
    [
      '---',
      'title: "Old"',
      'date: "2026-05-01"',
      'lang: "zh"',
      'source: "investment-v4"',
      '---',
      '# Old',
      '',
    ].join('\n'),
  )

  const result = syncInvestmentBriefs({ sourceDir, destDir })

  assert.deepEqual(result, {
    sourceDir,
    destDir,
    copied: 1,
    removed: 1,
    skipped: false,
  })
  assert.equal(fs.existsSync(path.join(destDir, '2026-05-01-zh.md')), false)

  const published = fs.readFileSync(path.join(destDir, '2026-06-01-zh.md'), 'utf8')
  assert.match(published, /^---\ntitle: "AI产业每日简报 v4 · 2026-06-01"\n/m)
  assert.match(published, /date: "2026-06-01"/)
  assert.match(published, /source: "investment-v4"/)
  assert.match(published, /^# 🌅 AI产业每日简报 v4 · 2026-06-01/m)
})

test('syncInvestmentBriefs skips cleanly when the source directory is absent', async () => {
  const { syncInvestmentBriefs } = await import(modulePath)
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'investment-sync-missing-'))
  const sourceDir = path.join(root, 'missing')
  const destDir = path.join(root, 'content', 'investment')

  const result = syncInvestmentBriefs({ sourceDir, destDir })

  assert.deepEqual(result, {
    sourceDir,
    destDir,
    copied: 0,
    removed: 0,
    skipped: true,
  })
})
