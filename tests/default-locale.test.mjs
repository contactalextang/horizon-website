import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'

function readProjectFile(...parts) {
  return fs.readFileSync(path.join(process.cwd(), ...parts), 'utf8')
}

test('site defaults to the Chinese locale', () => {
  const routing = readProjectFile('i18n', 'routing.ts')
  const rootPage = readProjectFile('app', 'page.tsx')
  const site = readProjectFile('lib', 'site.ts')
  const layout = readProjectFile('app', 'layout.tsx')
  const llms = readProjectFile('app', 'llms.txt', 'route.ts')

  assert.match(routing, /locales:\s*\[\s*'zh'\s*,\s*'en'\s*\]/)
  assert.match(routing, /defaultLocale:\s*'zh'/)
  assert.match(rootPage, /redirect\('\/zh'\)/)
  assert.match(site, /'x-default':\s*`\$\{SITE_URL\}\/zh\$\{clean\}`/)
  assert.match(layout, /'x-default':\s*'\/zh'/)
  assert.match(layout, /独立开发者/)
  assert.match(llms, /Home:\s*\$\{SITE_URL\}\/zh/)
})
