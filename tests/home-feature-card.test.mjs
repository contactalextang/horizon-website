import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'

function readProjectFile(...parts) {
  return fs.readFileSync(path.join(process.cwd(), ...parts), 'utf8')
}

test('home feature cards stay aligned with balanced bounded previews', () => {
  const homePage = readProjectFile('app', '[locale]', 'page.tsx')
  const globals = readProjectFile('app', 'globals.css')

  assert.match(homePage, /latestPost\?\.items\.slice\(0,\s*5\)/)
  assert.match(homePage, /className="feature-summary"/)
  assert.match(homePage, /className="feature-list"/)
  assert.doesNotMatch(globals, /\.front-feature\s*{[^}]*height:\s*376px;/s)
  assert.match(globals, /\.front-feature\s*{[^}]*height:\s*320px;/s)
  assert.match(globals, /@media\s*\(max-width:\s*820px\)\s*{[\s\S]*\.front-feature\s*{[^}]*height:\s*350px;/s)
  assert.match(globals, /\.feature-summary\s*{[^}]*-webkit-line-clamp:\s*3;/s)
  assert.match(globals, /\.feature-list\s*{[^}]*-webkit-line-clamp:\s*5;/s)
})
