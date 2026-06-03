#!/usr/bin/env node
import * as process from 'node:process'
import { checkDependencies } from './src/check-dependencies'
import { addExcludeToScript } from './src/add-exclude'

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

const main = async (args: string[]) => {
  if (args.includes('--add-exclude')) return addExcludeToScript()

  return checkDependencies(parseArguments(args))
}

main(process.argv.slice(2))
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
