import * as fs from 'node:fs'
import * as path from 'node:path'
import * as process from 'node:process'
import { packagesToUpdate } from './check-dependencies'

const SCRIPT_KEY = 'check-updates'

const detectIndent = (raw: string) => {
  const match = raw.match(/^[^\n]*\n([ \t]+)/)
  return match ? match[1] : '  '
}

const rewriteExcludes = (command: string, packages: string[]) => {
  const kept = command.split(/\s+/).filter((token) => {
    return token && !token.startsWith('--exclude=')
  })
  const excludes = [...packages].sort().map((name) => `--exclude=${name}`)
  return [...kept, ...excludes].join(' ')
}

export const addExcludeToScript = async () => {
  const packageJsonPath = path.join(process.cwd(), 'package.json')
  const raw = fs.readFileSync(packageJsonPath, 'utf8')
  const packageJson = JSON.parse(raw) as {
    scripts?: { [key: string]: string }
  }

  const scripts = packageJson.scripts
  if (!scripts || !scripts[SCRIPT_KEY])
    return 'No check-updates script found, nothing to update'

  const packages = await packagesToUpdate()
  scripts[SCRIPT_KEY] = rewriteExcludes(scripts[SCRIPT_KEY], packages)

  const trailingNewline = raw.endsWith('\n') ? '\n' : ''
  fs.writeFileSync(
    packageJsonPath,
    JSON.stringify(packageJson, null, detectIndent(raw)) + trailingNewline
  )

  return packages.length
    ? `Updated check-updates excludes: ${[...packages].sort().join(',')}`
    : 'Updated check-updates script: no excludes needed'
}
