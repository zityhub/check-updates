import { run } from 'npm-check-updates'
import * as process from 'node:process'

type MessageLog = {
  type: {
    name: string
    data: {
      jobName: string
      message?: string
    }
  }
}

const info = (title: string, message: MessageLog) => {
  process.stdout.write(
    `${new Date().toISOString()} \x1b[102mINFO\x1b[0m \x1b[34m${title}\x1b[0m\n${JSON.stringify(message, null, 2)}\n`
  )
}
const error = (title: string, message: MessageLog) => {
  process.stderr.write(
    `${new Date().toISOString()} \x1b[41mERROR\x1b[0m \x1b[34m${title}\x1b[0m\n${JSON.stringify(message, null, 2)}\n`
  )
}

const parseArguments = (args: string[]) => {
  const exclude: string[] = []
  args.forEach((arg) => {
    const [key, value] = arg.split('=')
    if (key.startsWith('--exclude') && value) exclude.push(value)
  })
  return exclude
}

const hasVersion = (version?: number | null) => {
  return version !== undefined && version !== null
}

const packagesToUpdate = async () => {
  const upgraded = (await run({
    filterResults: (
      packageName,
      { currentVersionSemver, upgradedVersionSemver }
    ) => {
      const currentMajor = parseInt(currentVersionSemver[0]?.major, 10)
      const upgradedMajor = parseInt(upgradedVersionSemver?.major, 10)
      if (hasVersion(currentMajor) && hasVersion(upgradedMajor))
        return currentMajor !== upgradedMajor
      return true
    }
  })) as { [key: string]: string }
  return Object.keys(upgraded)
}

const main = async (exclude: string[]) => {
  const packages = await packagesToUpdate()
  const toUpdate = packages.filter(
    (packageName) => !exclude.includes(packageName)
  )
  const message = `Major update available for: ${packages.join(',')}`
  if (toUpdate.length) return Promise.reject(message)
  return Promise.resolve(packages.length ? message : undefined)
}

main(parseArguments(process.argv.slice(2)))
  .then((message) => {
    info('Job check-updates finished success', {
      type: {
        name: 'job',
        data: { jobName: 'check-updates', ...(message && { message }) }
      }
    })
    process.exit(0)
  })
  .catch((err) => {
    error('Job check-updates finished failed', {
      type: {
        name: 'job',
        data: { jobName: 'check-updates', message: err }
      }
    })
    process.exit(1)
  })
