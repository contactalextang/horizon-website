import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'

function readProjectFile(...parts) {
  return fs.readFileSync(path.join(process.cwd(), ...parts), 'utf8')
}

test('home feature cards size naturally while keeping bounded text previews', () => {
  const homePage = readProjectFile('app', '[locale]', 'page.tsx')
  const globals = readProjectFile('app', 'globals.css')

  assert.match(homePage, /className="feature-summary"/)
  assert.match(homePage, /className="feature-list"/)
  assert.doesNotMatch(globals, /\.front-feature\s*{[^}]*height:\s*376px;/s)
  assert.doesNotMatch(globals, /\.front-feature\s*{[^}]*overflow:\s*hidden;/s)
  assert.match(globals, /\.feature-summary\s*{[^}]*-webkit-line-clamp:\s*3;/s)
  assert.match(globals, /\.feature-list\s*{[^}]*-webkit-line-clamp:\s*3;/s)
})
