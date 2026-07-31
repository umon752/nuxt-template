import { access, readdir, readFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import path from 'node:path'

const repositoryRoot = process.cwd()
const composablesRoot = path.join(repositoryRoot, 'app/composables')
const docsRoot = path.join(repositoryRoot, 'docs/composables')
const indexPath = path.join(docsRoot, 'README.md')
const baselinePath = path.join(repositoryRoot, 'scripts/docs-consistency-baseline.json')

const toPosix = (value) => value.split(path.sep).join('/')
const toKebabCase = (value) =>
  value
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .toLowerCase()

async function exists(filePath) {
  try {
    await access(filePath)
    return true
  } catch {
    return false
  }
}

const errors = []
const indexContent = await readFile(indexPath, 'utf8')
const baseline = JSON.parse(await readFile(baselinePath, 'utf8'))
const baselineComposables = new Map(Object.entries(baseline.composables ?? {}))

const composableFiles = (await readdir(composablesRoot, { withFileTypes: true }))
  .filter((entry) => entry.isFile() && entry.name.endsWith('.ts'))
  .map((entry) => entry.name)
  .sort()

for (const composableFile of composableFiles) {
  const sourceRelative = `app/composables/${composableFile}`
  const docFile = `${toKebabCase(path.basename(composableFile, '.ts'))}.md`
  const docPath = path.join(docsRoot, docFile)
  const baselineHash = baselineComposables.get(sourceRelative)
  const hasDoc = await exists(docPath)

  if (baselineHash) {
    if (hasDoc) {
      errors.push(`${sourceRelative} 已有文件，請從 baseline 移除`)
    } else {
      const sourceContent = await readFile(path.join(repositoryRoot, sourceRelative))
      const currentHash = createHash('sha256').update(sourceContent).digest('hex')

      if (currentHash !== baselineHash) {
        errors.push(
          `${sourceRelative} 已偏離 baseline，必須補上 docs/composables/${docFile} 並移出 baseline`
        )
      }
    }
    continue
  }

  if (!hasDoc) {
    errors.push(`${sourceRelative} 缺少 docs/composables/${docFile}`)
    continue
  }

  const docContent = await readFile(docPath, 'utf8')
  const sourcePath = path.join(repositoryRoot, sourceRelative)
  const sourceLink = toPosix(path.relative(path.dirname(docPath), sourcePath))

  if (!docContent.includes(`](${sourceLink})`)) {
    errors.push(`docs/composables/${docFile} 缺少有效的原始碼連結 ${sourceLink}`)
  }

  if (!indexContent.includes(`](${docFile})`)) {
    errors.push(`docs/composables/README.md 缺少 ${docFile}`)
  }
}

for (const baselineSource of baselineComposables.keys()) {
  if (!(await exists(path.join(repositoryRoot, baselineSource)))) {
    errors.push(`baseline 包含不存在的檔案 ${baselineSource}`)
  }
}

const docFiles = (await readdir(docsRoot, { withFileTypes: true }))
  .filter((entry) => entry.isFile() && entry.name.endsWith('.md') && entry.name !== 'README.md')
  .map((entry) => entry.name)

for (const docFile of docFiles) {
  const matchingSource = composableFiles.find(
    (sourceFile) => `${toKebabCase(path.basename(sourceFile, '.ts'))}.md` === docFile
  )

  if (!matchingSource) {
    errors.push(`docs/composables/${docFile} 沒有對應的 app/composables 原始碼`)
  }
}

if (errors.length > 0) {
  console.error('Composable 文件一致性檢查失敗：')
  for (const error of errors) console.error(`- ${error}`)
  process.exitCode = 1
} else {
  console.log(
    `Composable 文件一致性檢查通過（${composableFiles.length - baselineComposables.size} 份文件，${baselineComposables.size} 個既有 baseline 項目）。`
  )
}
