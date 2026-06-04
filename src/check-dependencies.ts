import { run } from 'npm-check-updates'

const hasVersion = (version?: number | null) => {
  return version !== undefined && version !== null
}

export const packagesToUpdate = async () => {
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

export const checkDependencies = async (exclude: string[]) => {
  const packages = await packagesToUpdate()
  const toUpdate = packages.filter(
    (packageName) => !exclude.includes(packageName)
  )

  const prefix = `Major update available for:`
  if (toUpdate.length) return Promise.reject(`${prefix} ${toUpdate.join(',')}`)

  return Promise.resolve(
    packages.length ? `${prefix} ${packages.join(',')}` : undefined
  )
}
