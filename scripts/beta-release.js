#!/usr/bin/env node

/*
1. get released packages from most recent commit
2. get last prerelease from npm registry for each package
3a. if last prerelease > pending release, bump prerelease suffix
3b. if last prerelease < pending release, add prerelease suffix to pending release
4. update package versions and dependencies
5. publish packages
*/

const { exec: _exec } = require('node:child_process')
const { promisify } = require('util')
const { simpleGit } = require('simple-git')
const { styles: s } = require('../lib/logger')
const semver = require('semver')
const path = require('path')
const fs = require('fs/promises')

const exec = promisify(_exec)

const git = simpleGit()

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

async function getDistTags(pkg) {
  const { stdout } = await exec(`npm dist-tag ls ${pkg}`, {
    encoding: 'utf8'
  })

  return Object.fromEntries(
    stdout
      .split('\n')
      .filter(Boolean)
      .map((line) => line.split(': '))
  )
}

function getNextPrerelease({ pending, prerelease }) {
  if (!prerelease || semver.gt(pending, s.inc(prerelease, 'release'))) {
    const version = semver.parse(pending)
    version.prerelease = ['beta.1']
    return version.format()
  }

  return semver.inc(prerelease, 'prerelease', 'beta')
}

async function readPackageJson(path) {
  return JSON.parse(await fs.readFile(path, 'utf8'))
}

async function main() {
  const releasingPackages = await getPackagesBeingReleased()
  const packages = await Promise.all(
    releasingPackages.map(async ({ name, path }) => {
      const json = await readPackageJson(path)

      return {
        name,
        path,
        json,
        pending: json.version,
        ...(await getDistTags(name))
      }
    })
  )

  const packagesWithNextVersion = packages.map((pkg) => ({
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

    const dependents = packages.filter((pkg) => (pkg.json.dependencies ?? {})[name])

    const devDependents = packages.filter((pkg) => (pkg.json.devDependencies ?? {})[name])

    const peerDependents = packages.filter((pkg) => (pkg.json.peerDependencies ?? {})[name])

    if (dependents.length) {
      console.log(`bumping dependencies in ${dependents.map((d) => s.plugin(d.name)).join(', ')}`)
      for (const dep of dependents) {
        dep.json.dependencies[name] = '^' + nextPrerelease
      }
    }

    if (devDependents.length) {
      console.log(`bumping devDependencies in ${devDependents.map((d) => s.plugin(d.name)).join(', ')}`)
      for (const dep of devDependents) {
        dep.json.devDependencies[name] = '^' + nextPrerelease
      }
    }

    if (peerDependents.length) {
      console.log(`bumping peerDependencies in ${peerDependents.map((d) => s.plugin(d.name)).join(', ')}`)
      for (const dep of peerDependents) {
        dep.json.peerDependencies[name] = '^' + nextPrerelease
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
}

main()
