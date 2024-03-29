import { readFile, writeFile } from 'fs/promises'
import { ToolKitError } from '@dotcom-tool-kit/error'
import { Task } from '@dotcom-tool-kit/types'
import { semVerRegex, prereleaseRegex, releaseRegex } from '@dotcom-tool-kit/types/lib/npm'
import pacote from 'pacote'
import { readState } from '@dotcom-tool-kit/state'
import pack from 'libnpmpack'
import { publish } from 'libnpmpublish'
import { styles } from '@dotcom-tool-kit/logger'
import tar from 'tar'
import { PassThrough as PassThroughStream } from 'stream'

type TagType = 'prerelease' | 'latest'

export default class NpmPublish extends Task {
  static description = ''

  getNpmTag(tag: string): TagType {
    if (!tag) {
      throw new ToolKitError(
        'CIRCLE_TAG environment variable not found. Make sure you are running this on a release version!'
      )
    }
    if (prereleaseRegex.test(tag)) {
      return 'prerelease'
    }
    if (releaseRegex.test(tag)) {
      return 'latest'
    }
    throw new ToolKitError(
      `CIRCLE_TAG does not match regex ${semVerRegex}. Configure your release version to match the regex eg. v1.2.3-beta.8`
    )
  }

  async listPackedFiles(tarball: Buffer): Promise<void> {
    this.logger.info('packed files:')

    new PassThroughStream()
      .end(tarball)
      .pipe(tar.t({ onentry: (entry) => this.logger.info(`- ${styles.filepath(entry.header.path)}`) }))
  }

  async run(): Promise<void> {
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

    const packagePath = 'package.json'
    const packageJson = JSON.parse(await readFile(packagePath, 'utf8'))
    // overwrite version from the package.json with the version from e.g. the git tag
    packageJson.version = tag.replace(/^v/, '')
    await writeFile(packagePath, JSON.stringify(packageJson, null, 2) + '\n')

    const packageRoot = process.cwd()
    const manifest = await pacote.manifest(packageRoot)
    const tarball = await pack(packageRoot)

    await this.listPackedFiles(tarball)

    await publish(manifest, tarball, {
      access: 'public',
      defaultTag: npmTag,
      forceAuth: {
        token: process.env.NPM_AUTH_TOKEN
      }
    })

    this.logger.info(`✅ npm package published`)
  }
}
