import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import ts from 'typescript'

function loadParser() {
  const sourcePath = path.join(process.cwd(), 'lib', 'daily-parser.ts')
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

test('parseStats reads score anomaly warning totals', () => {
  const { parseStats } = loadParser()

  const result = parseStats([
    '# Horizon Daily - 2026-06-07',
    '',
    '> Warning: analyzed 63 items, but scoring selected 0.',
    '',
  ].join('\n'))

  assert.deepEqual(result, { totalFetched: 63, itemCount: 0 })
})

test('parseStats reads Chinese score anomaly warning totals', () => {
  const { parseStats } = loadParser()

  const result = parseStats([
    '# Horizon 每日速递 - 2026-06-07',
    '',
    '> 警告：已分析 63 条内容，但评分筛选结果为 0。',
    '',
  ].join('\n'))

  assert.deepEqual(result, { totalFetched: 63, itemCount: 0 })
})
