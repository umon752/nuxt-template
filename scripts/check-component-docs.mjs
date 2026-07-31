import { access, readdir, readFile } from 'node:fs/promises'
import path from 'node:path'

const repositoryRoot = process.cwd()
const componentsRoot = path.join(repositoryRoot, 'app/components')
const docsRoot = path.join(repositoryRoot, 'docs/components')
const indexPath = path.join(docsRoot, 'README.md')

const toPosix = (value) => value.split(path.sep).join('/')

async function exists(filePath) {
  try {
    await access(filePath)
    return true
  } catch {
    return false
  }
}

async function walk(directory, predicate) {
  const entries = await readdir(directory, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name)

    if (entry.isDirectory()) {
      files.push(...(await walk(entryPath, predicate)))
    } else if (predicate(entryPath)) {
      files.push(entryPath)
    }
  }

  return files
}

const errors = []
const indexContent = await readFile(indexPath, 'utf8')
const componentFiles = await walk(componentsRoot, (filePath) => filePath.endsWith('.vue'))

for (const componentPath of componentFiles) {
  const componentRelative = path.relative(componentsRoot, componentPath)
  const docRelative = componentRelative.replace(/\.vue$/, '/README.md')
  const docPath = path.join(docsRoot, docRelative)

  if (!(await exists(docPath))) {
    errors.push(
      `${toPosix(componentRelative)} 缺少 ${toPosix(path.relative(repositoryRoot, docPath))}`
    )
    continue
  }

  const docContent = await readFile(docPath, 'utf8')
  const sourceLink = toPosix(path.relative(path.dirname(docPath), componentPath))
  const indexLink = toPosix(docRelative)

  if (!docContent.includes(`](${sourceLink})`)) {
    errors.push(`${toPosix(docRelative)} 缺少有效的元件原始碼連結 ${sourceLink}`)
  }

  if (!indexContent.includes(`](${indexLink})`)) {
    errors.push(`docs/components/README.md 缺少 ${indexLink}`)
  }
}

const componentDocs = await walk(
  docsRoot,
  (filePath) => path.basename(filePath) === 'README.md' && filePath !== indexPath
)

for (const docPath of componentDocs) {
  const docRelative = toPosix(path.relative(docsRoot, docPath))
  const componentRelative = docRelative.replace(/\/README\.md$/, '.vue')
  const componentPath = path.join(componentsRoot, componentRelative)

  if (!(await exists(componentPath))) {
    errors.push(`${docRelative} 沒有對應的 app/components/${componentRelative}`)
  }
}

if (errors.length > 0) {
  console.error('Component 文件一致性檢查失敗：')
  for (const error of errors) console.error(`- ${error}`)
  process.exitCode = 1
} else {
  console.log(`Component 文件一致性檢查通過（${componentFiles.length} 個元件）。`)
}
