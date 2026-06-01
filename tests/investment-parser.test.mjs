import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import ts from 'typescript'

function loadParser() {
  const sourcePath = path.join(process.cwd(), 'lib', 'investment-parser.ts')
  const source = fs.readFileSync(sourcePath, 'utf8')
  const compiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
  }).outputText
  const module = { exports: {} }
  const fn = new Function('exports', 'module', compiled)
  fn(module.exports, module)
  return module.exports
}

const sample = `# 🌅 AI产业每日简报 v4 · 2026年5月20日（周三）

> **阅读约15分钟** ｜ 所有标的统一表格化

---

## 🎯 一、本周核心信号（三句话版）

> 📊 数据鲜度：T+0 ~ T-1

1. **今晚就是NVDA** — NVIDIA将于今日盘后发布业绩。
2. **债券市场正在掀桌** — 30年期收益率逼近5.2%。
3. **Anthropic融资签约** — 一级市场定价进入新阶段。

## 🧠 二、大模型动态

| 事件 | 时间 | 关键数据 |
|---|---|---|
| Qwen3 Coder Next发布 | 2026年5月18日 | 长上下文 |
`

test('parseInvestmentMarkdown extracts magazine metadata from v4 markdown', () => {
  const { parseInvestmentMarkdown } = loadParser()

  const parsed = parseInvestmentMarkdown(sample, '2026-05-20')

  assert.equal(parsed.title, 'AI产业每日简报 v4 · 2026年5月20日（周三）')
  assert.equal(parsed.date, '2026-05-20')
  assert.equal(parsed.readingMinutes, 15)
  assert.deepEqual(parsed.sections, [
    '一、本周核心信号（三句话版）',
    '二、大模型动态',
  ])
  assert.deepEqual(parsed.signals, [
    '今晚就是NVDA — NVIDIA将于今日盘后发布业绩。',
    '债券市场正在掀桌 — 30年期收益率逼近5.2%。',
    'Anthropic融资签约 — 一级市场定价进入新阶段。',
  ])
})

test('dateFromInvestmentFilename accepts v4 source and published filenames', () => {
  const { dateFromInvestmentFilename } = loadParser()

  assert.equal(dateFromInvestmentFilename('AI产业每日简报_v4_20260520.md'), '2026-05-20')
  assert.equal(dateFromInvestmentFilename('AI产业每日简报_v4_20260511 (2).md'), '2026-05-11')
  assert.equal(dateFromInvestmentFilename('2026-05-20-zh.md'), '2026-05-20')
  assert.equal(dateFromInvestmentFilename('notes.md'), null)
})
