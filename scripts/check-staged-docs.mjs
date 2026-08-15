import { createHash } from 'node:crypto'
import { execFileSync } from 'node:child_process'
import path from 'node:path'

const repositoryRoot = execFileSync('git', ['rev-parse', '--show-toplevel'], {
  encoding: 'utf8',
}).trim()

const runGit = (...args) =>
  execFileSync('git', args, {
    cwd: repositoryRoot,
    encoding: 'utf8',
  })

const stagedPaths = runGit('ls-files', '--cached', '-z').split('\0').filter(Boolean)
const stagedPathSet = new Set(stagedPaths)

const componentSourcePrefix = 'app/components/'
const componentDocsPrefix = 'docs/components/'
const composableSourcePrefix = 'app/composables/'
const composableDocsPrefix = 'docs/composables/'
const componentIndexPath = `${componentDocsPrefix}README.md`
const composableIndexPath = `${composableDocsPrefix}README.md`
const baselinePath = 'scripts/docs-consistency-baseline.json'

const toKebabCase = (value) =>
  value
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .toLowerCase()

const readStagedFile = (filePath) => {
  if (!stagedPathSet.has(filePath)) return null

  return runGit('show', `:${filePath}`)
}

const createStagedHash = (filePath) => {
  const content = readStagedFile(filePath)

  if (content === null) return null

  return createHash('sha256').update(content).digest('hex')
}

const componentFiles = stagedPaths
  .filter((filePath) => filePath.startsWith(componentSourcePrefix) && filePath.endsWith('.vue'))
  .sort()

const componentDocs = stagedPaths
  .filter(
    (filePath) =>
      filePath.startsWith(componentDocsPrefix) &&
      filePath.endsWith('/README.md') &&
      filePath !== componentIndexPath
  )
  .sort()

const composableFiles = stagedPaths
  .filter((filePath) => {
    if (!filePath.startsWith(composableSourcePrefix) || !filePath.endsWith('.ts')) {
      return false
    }

    return !filePath.slice(composableSourcePrefix.length).includes('/')
  })
  .sort()

const composableDocs = stagedPaths
  .filter((filePath) => {
    if (
      !filePath.startsWith(composableDocsPrefix) ||
      !filePath.endsWith('.md') ||
      filePath === composableIndexPath
    ) {
      return false
    }

    return !filePath.slice(composableDocsPrefix.length).includes('/')
  })
  .sort()

const errors = []
const componentIndexContent = readStagedFile(componentIndexPath)

if (componentIndexContent === null) {
  errors.push(`缺少 ${componentIndexPath}`)
}

for (const componentPath of componentFiles) {
  const componentRelative = componentPath.slice(componentSourcePrefix.length)
  const docRelative = componentRelative.replace(/\.vue$/, '/README.md')
  const docPath = `${componentDocsPrefix}${docRelative}`
  const docContent = readStagedFile(docPath)

  if (docContent === null) {
    errors.push(`${componentPath} 缺少 ${docPath}`)
    continue
  }

  const sourceLink = path.posix.relative(path.posix.dirname(docPath), componentPath)

  if (!docContent.includes(`](${sourceLink})`)) {
    errors.push(`${docPath} 缺少有效的元件原始碼連結 ${sourceLink}`)
  }

  if (componentIndexContent !== null && !componentIndexContent.includes(`](${docRelative})`)) {
    errors.push(`${componentIndexPath} 缺少 ${docRelative}`)
  }
}

for (const docPath of componentDocs) {
  const docRelative = docPath.slice(componentDocsPrefix.length)
  const componentRelative = docRelative.replace(/\/README\.md$/, '.vue')
  const componentPath = `${componentSourcePrefix}${componentRelative}`

  if (!stagedPathSet.has(componentPath)) {
    errors.push(`${docPath} 沒有對應的 ${componentPath}`)
  }
}

const composableIndexContent = readStagedFile(composableIndexPath)

if (composableIndexContent === null) {
  errors.push(`缺少 ${composableIndexPath}`)
}

let baselineComposables = new Map()
const baselineContent = readStagedFile(baselinePath)

if (baselineContent === null) {
  errors.push(`缺少 ${baselinePath}`)
} else {
  try {
    const baseline = JSON.parse(baselineContent)
    baselineComposables = new Map(Object.entries(baseline.composables ?? {}))
  } catch {
    errors.push(`${baselinePath} 不是有效的 JSON`)
  }
}

for (const composablePath of composableFiles) {
  const composableName = path.posix.basename(composablePath, '.ts')
  const docFile = `${toKebabCase(composableName)}.md`
  const docPath = `${composableDocsPrefix}${docFile}`
  const baselineHash = baselineComposables.get(composablePath)
  const docContent = readStagedFile(docPath)

  if (baselineHash) {
    if (docContent !== null) {
      errors.push(`${composablePath} 已有文件，請從 baseline 移除`)
      continue
    }

    const currentHash = createStagedHash(composablePath)

    if (currentHash !== baselineHash) {
      errors.push(`${composablePath} 已偏離 baseline，必須補上 ${docPath} 並移出 baseline`)
    }

    continue
  }

  if (docContent === null) {
    errors.push(`${composablePath} 缺少 ${docPath}`)
    continue
  }

  const sourceLink = path.posix.relative(path.posix.dirname(docPath), composablePath)

  if (!docContent.includes(`](${sourceLink})`)) {
    errors.push(`${docPath} 缺少有效的原始碼連結 ${sourceLink}`)
  }

  if (composableIndexContent !== null && !composableIndexContent.includes(`](${docFile})`)) {
    errors.push(`${composableIndexPath} 缺少 ${docFile}`)
  }
}

for (const baselineSource of baselineComposables.keys()) {
  if (!stagedPathSet.has(baselineSource)) {
    errors.push(`baseline 包含不存在的檔案 ${baselineSource}`)
  }
}

for (const docFile of composableDocs) {
  const docName = path.posix.basename(docFile)
  const matchingSource = composableFiles.find(
    (sourceFile) => `${toKebabCase(path.posix.basename(sourceFile, '.ts'))}.md` === docName
  )

  if (!matchingSource) {
    errors.push(`${docFile} 沒有對應的 app/composables 原始碼`)
  }
}

if (errors.length > 0) {
  console.error('Staged 文件一致性檢查失敗：')
  for (const error of errors) console.error(`- ${error}`)
  process.exitCode = 1
} else {
  console.log(
    `Staged 文件一致性檢查通過（${componentFiles.length} 個元件，${composableFiles.length - baselineComposables.size} 份 composable 文件，${baselineComposables.size} 個既有 baseline 項目）。`
  )
}
