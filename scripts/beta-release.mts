#!/usr/bin/env node

/*
1. get released packages from most recent commit
2. get last prerelease from npm registry for each package
3a. if last prerelease > pending release, bump prerelease suffix
3b. if last prerelease < pending release, add prerelease suffix to pending release
4. update package versions and dependencies
5. publish packages
*/

import { exec as _exec } from 'node:child_process'
import { promisify } from 'util'
import { simpleGit } from 'simple-git'
import { styles as s } from '@dotcom-tool-kit/logger'
import semver from 'semver'
import path from 'path'
import fs from 'fs/promises'

const exec = promisify(_exec)

const git = simpleGit()


type Package = {
  path: string,
  name: string,
}

type PackageWithJson = Package & {
  json: {
    version: string,
    dependencies?: Record<string, string>
    devDependencies?: Record<string, string>
    peerDependencies?: Record<string, string>
  },
}

type PackageWithCurrentVersions = PackageWithJson & {
  latest: string,
  pending: string,
  prerelease: string
}

type PackageWithNextVersion = PackageWithCurrentVersions & {
  nextPrerelease: string
}

async function getPackagesBeingReleased() {
  const changedFiles = await git.diff(['--name-only', 'head', 'head~'])

  return changedFiles
    .split('\n')
    .filter((file) => file.endsWith('/package.json'))
    .map((file) => ({
      path: file,
      name:
        file === 'core/cli/package.json'
          ? 'dotcom-tool-kit'
          : '@dotcom-tool-kit/' + path.basename(path.dirname(file))
    }))
}

function fetchCurrentPackageVersions(packages: Package[]): Promise<PackageWithCurrentVersions[]> {
  return Promise.all(
    packages.map(async ({ name, path }) => {
      const json = await readPackageJson(path)
      const { latest, prerelease } = await getDistTags(name)

      return {
        name,
        path,
        json,
        pending: json.version,
        latest,
        prerelease
      }
    })
  )
}

async function getDistTags(pkg: string) {
  const { stdout } = await exec(`npm dist-tag ls ${pkg}`, {
    encoding: 'utf8'
  })

  return Object.fromEntries(
    stdout
      .split('\n')
      .filter(Boolean)
      .map((line) => {
        const [tag, version] =  line.split(': ')
        return [tag, version] as const
      })
  )
}

function getNextPrerelease({ pending, prerelease }: PackageWithCurrentVersions) {
  const releaseVersionForPrerelease = semver.inc(prerelease, 'release')
  if(!releaseVersionForPrerelease) throw new Error(`Could not increment ${prerelease} to release version. This should never happen`)

  if (!prerelease || semver.gt(pending, releaseVersionForPrerelease)) {
    const version = semver.parse(pending)

    if(!version) throw new Error(`Could not parse semver ${pending}. This should never happen`)

    version.prerelease = ['beta.1']
    return version.format()
  }

  const next = semver.inc(prerelease, 'prerelease', 'beta')
  if(!next) throw new Error(`Could not increment ${prerelease} to next prerelease version. This should never happen`)

  return next
}

async function readPackageJson(path: string) {
  return JSON.parse(await fs.readFile(path, 'utf8'))
}


const releasingPackages = await getPackagesBeingReleased()
const packagesWithVersions = await fetchCurrentPackageVersions(releasingPackages)
const packagesWithNextVersion = packagesWithVersions.map((pkg): PackageWithNextVersion => ({
  ...pkg,
  nextPrerelease: getNextPrerelease(pkg)
}))

for (const { name, path, json, pending, nextPrerelease, latest, prerelease } of packagesWithNextVersion) {
  console.log(
    s.info(
      `${s.plugin(name)}: ${s.code('release-please')} will release ${s.option(pending)} ${s.dim(
        `(current latest: ${s.option(latest)}, prerelease: ${s.option(prerelease)})`
      )}`
    )
  )

  console.log(`bumping ${s.filepath(path)} version to ${s.option(nextPrerelease)}`)
  json.version = nextPrerelease

  const dependents = packagesWithNextVersion.filter((pkg) => (pkg.json.dependencies ?? {})[name])
  const devDependents = packagesWithNextVersion.filter((pkg) => (pkg.json.devDependencies ?? {})[name])
  const peerDependents = packagesWithNextVersion.filter((pkg) => (pkg.json.peerDependencies ?? {})[name])

  if (dependents.length) {
    console.log(`bumping dependencies in ${dependents.map((d) => s.plugin(d.name)).join(', ')}`)
    for (const dep of dependents) {
      // if we are here, then dep.json.dependencies must already exist
      dep.json.dependencies![name] = '^' + nextPrerelease
    }
  }

  if (devDependents.length) {
    console.log(`bumping devDependencies in ${devDependents.map((d) => s.plugin(d.name)).join(', ')}`)
    for (const dep of devDependents) {
      // if we are here, then dep.json.devDependencies must already exist
      dep.json.devDependencies![name] = '^' + nextPrerelease
    }
  }

  if (peerDependents.length) {
    console.log(`bumping peerDependencies in ${peerDependents.map((d) => s.plugin(d.name)).join(', ')}`)
    for (const dep of peerDependents) {
      // if we are here, then dep.json.peerDependencies must already exist
      dep.json.peerDependencies![name] = '^' + nextPrerelease
    }
  }
  console.log()
}

for (const { name, path, json, nextPrerelease } of packagesWithNextVersion) {
  console.log(`writing ${path}`)
  await fs.writeFile(path, JSON.stringify(json, null, 2))

  console.log(`publishing ${s.plugin(name)}${s.dim('@')}${s.option(nextPrerelease)}...`)
  await exec(`npm publish --workspace "${name}" --access=public --tag=prerelease`)

  console.log(s.success(`published ${s.plugin(name)}${s.dim('@')}${s.option(nextPrerelease)}\n`))
}
