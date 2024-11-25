import { readFile, writeFile } from 'fs/promises'
import { ToolKitError } from '@dotcom-tool-kit/error'
import { Task, TaskRunContext } from '@dotcom-tool-kit/base'
import pacote from 'pacote'
import { readState } from '@dotcom-tool-kit/state'
import pack from 'libnpmpack'
import { publish } from 'libnpmpublish'
import { styles } from '@dotcom-tool-kit/logger'
import tar from 'tar'
import { PassThrough as PassThroughStream } from 'stream'
import type { PackageJson } from '@npm/types'
import path from 'path'

type TagType = 'prerelease' | 'latest'

const semVerRegex = /^v\d+\.\d+\.\d+(-.+)?/
const prereleaseRegex = /^v\d+\.\d+\.\d+(?:-\w+\.\d+)$/
const releaseRegex = /^v\d+\.\d+\.\d+$/

export default class NpmPublish extends Task {
  getNpmTag(tag: string): TagType {
    if (!tag) {
      throw new ToolKitError(
        'No `tag` variable found in the Tool Kit `ci` state. Make sure this task is running on a CI tag branch.'
      )
    }
    if (prereleaseRegex.test(tag)) {
      return 'prerelease'
    }
    if (releaseRegex.test(tag)) {
      return 'latest'
    }
    throw new ToolKitError(
      `The Tool Kit \`ci\` state \`tag\` variable ${tag} does not match regex ${semVerRegex}. Configure your release version to match the regex eg. v1.2.3-beta.8`
    )
  }

  async listPackedFiles(tarball: Buffer): Promise<void> {
    this.logger.info('packed files:')

    new PassThroughStream()
      .end(tarball)
      .pipe(tar.t({ onentry: (entry) => this.logger.info(`- ${styles.filepath(entry.path)}`) }))
  }

  async run({ cwd }: TaskRunContext): Promise<void> {
    this.logger.info('preparing to publish your npm package....')

    const ci = readState('ci')

    if (!ci) {
      throw new ToolKitError(`Could not find state for ci, check that you are running this task on circleci`)
    }

    const tag = ci.tag

    const npmTag = this.getNpmTag(tag)

    this.logger.info(`version ${tag} ready to be published with ${npmTag} tag`)

    if (!process.env.NPM_AUTH_TOKEN) {
      throw new ToolKitError(
        'NPM_AUTH_TOKEN environment variable not found! Make sure you have added the npm-publish-token context under toolkit/publish job in your circleci config'
      )
    }

    const packagePath = path.resolve(cwd, 'package.json')
    const packageJson = JSON.parse(await readFile(packagePath, 'utf8'))
    // overwrite version from the package.json with the version from e.g. the git tag
    packageJson.version = tag.replace(/^v/, '')
    await writeFile(packagePath, JSON.stringify(packageJson, null, 2) + '\n')

    const manifest = await pacote.manifest(cwd)
    const tarball = await pack(cwd)

    await this.listPackedFiles(tarball)

    // HACK:KB:20231127 cast the manifest to a PackageJson. libnpmpublish expects a
    // PackageJson, but pacote.ManifestResult isn't assignable to that, because the
    // definition of PackageJson in @npm/types is incorrect lol
    // https://github.com/npm/types/pull/18
    await publish(manifest as PackageJson, tarball, {
      access: 'public',
      defaultTag: npmTag,
      forceAuth: {
        token: process.env.NPM_AUTH_TOKEN
      }
    })

    this.logger.info(`✅ npm package published`)
  }
}
