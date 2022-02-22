import { ToolKitError } from '@dotcom-tool-kit/error'
import { Task } from '@dotcom-tool-kit/types'
import pacote from 'pacote'
import { readState } from '@dotcom-tool-kit/state'
import pack from 'libnpmpack'
import { publish } from 'libnpmpublish'
import { styles } from '@dotcom-tool-kit/logger'
import tar from 'tar'
import { PassThrough as PassThroughStream } from 'stream';

export const semVerRegex = /^v\d+\.\d+\.\d+(-.+)?/

export default class NpmPublish extends Task {
  static description = ''
  
  handleTagValidity(tag: string): void {
    if(!tag) {
        throw new ToolKitError('CIRCLE_TAG environment variable not found. Make sure you are running this on a release version!')
    }
    if(!semVerRegex.test(tag)) {
        throw new ToolKitError(`CIRCLE_TAG does not match regex ${semVerRegex}. Configure your release version to match the regex eg. v1.2.3-beta.8`)
    }
  }

  async listPackedFiles(tarball: Buffer): Promise<void> {
    this.logger.info('packed files:')

    new PassThroughStream()
      .end(tarball)
      .pipe(tar.t({onentry: entry => this.logger.info(`- ${styles.filepath(entry.header.path)}`)}))
    }

  async run(): Promise<void> {
    this.logger.info('preparing to publish your npm package....')

    const packagePath = process.cwd()
    const manifest = await pacote.manifest(packagePath)

    const ci = readState('ci')
    
    if(!ci) {
      throw new ToolKitError(
        `Could not find state for ci, check that ${styles.hook('publish:tag')} ran successfully`
      )
    }

    const tag = ci.tag

    this.handleTagValidity(tag)

    this.logger.info(`tag ${tag} ready to be published`)

    if (!process.env.NPM_AUTH_TOKEN) {
        throw new ToolKitError('NPM_AUTH_TOKEN environment variable not found! Make sure your project is pulling in the env vars from /teams/next/circleci/component')
    }

    // overwrite version from the package.json with the version from e.g. the git tag
    manifest.version = tag.replace(/^v/, '')

    const tarball = await pack(packagePath)

    await this.listPackedFiles(tarball)

    await publish(manifest, tarball, {
        access: 'public',
        forceAuth: {
            token: process.env.NPM_AUTH_TOKEN
        }
    })

    this.logger.info(`✅ npm package published`)
  }
}
