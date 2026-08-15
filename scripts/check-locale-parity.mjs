import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const scriptDirectory = fileURLToPath(new URL('.', import.meta.url))
const localeDirectory = resolve(scriptDirectory, '../app/i18n/locales')

function getLeafPaths(value, prefix = '') {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return [prefix]
  }

  return Object.entries(value).flatMap(([key, child]) =>
    getLeafPaths(child, prefix ? `${prefix}.${key}` : key)
  )
}

function readLocale(fileName) {
  return JSON.parse(readFileSync(resolve(localeDirectory, fileName), 'utf8'))
}

const sourcePaths = new Set(getLeafPaths(readLocale('zh-TW.json')))
const targetPaths = new Set(getLeafPaths(readLocale('en.json')))
const missingPaths = [...sourcePaths].filter((path) => !targetPaths.has(path))
const extraPaths = [...targetPaths].filter((path) => !sourcePaths.has(path))

if (missingPaths.length || extraPaths.length) {
  if (missingPaths.length) {
    console.error(`Missing en locale keys:\n${missingPaths.join('\n')}`)
  }

  if (extraPaths.length) {
    console.error(`Unexpected en locale keys:\n${extraPaths.join('\n')}`)
  }

  process.exitCode = 1
} else {
  console.log(`Locale key parity check passed (${sourcePaths.size} keys).`)
}
