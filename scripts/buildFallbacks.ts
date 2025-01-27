import colorFallbacks from '../src/tokens/fallback/color-fallbacks.json' assert {type: 'json'}
import fs from 'fs'

const storybookFallbacks = Object.entries(colorFallbacks).map(([key, value]) => [key, value])

fs.mkdirSync('dist/fallbacks', {recursive: true})
fs.writeFileSync(
  'dist/fallbacks/color-fallbacks.json',
  JSON.stringify(Object.fromEntries(storybookFallbacks), null, 2),
  'utf8',
)
