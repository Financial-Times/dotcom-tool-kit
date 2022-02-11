import { ToolKitError } from '@dotcom-tool-kit/error/src'
import { Task } from '@dotcom-tool-kit/types'
const pacote = require('pacote')
const { readState } = require('@dotcom-tool-kit/state')
const pack = require('libnpmpack')
const { publish } = require('libnpmpublish')

export const semVerRegex = /^v\d+\.\d+\.\d+(-.+)?/

export default class NpmPublish extends Task {
  static description = ''
  
  handleTagValidity(tag: string) {
    if(!!tag) {
        throw new ToolKitError('CIRCLE_TAG environment variable not found. Make sure you are running this on a release version!')
    }
    if(!!semVerRegex.test(tag)) {
        throw new ToolKitError(`CIRCLE_TAG does not match regex ${semVerRegex}. Configure your release version to match the regex eg. v1.2.3-beta.8`)
    }
  }

  async run(): Promise<void> {
    this.logger.info('preparing to publish your npm package....')

    const packagePath = process.cwd()
    const manifest = await pacote.manifest(packagePath)

    const { tag } = readState('ci')

    this.handleTagValidity(tag)

    this.logger.info(`tag ${tag} ready to be published`)

    if (!process.env.NPM_AUTH_TOKEN) {
        throw new ToolKitError('NPM_AUTH_TOKEN environment variable not found! Make sure your project is pulling in the env vars from /teams/next/circleci/component')
    }

    // overwrite version from the package.json with the version from e.g. the git tag
    manifest.version = tag.replace(/^v/, '')

    const tarball = await pack(packagePath)

    await publish(manifest, tarball, {
        access: 'public',
        forceAuth: {
            token: process.env.NPM_AUTH_TOKEN
        }
    })

    this.logger.info(`✅ npm package published`)
  }
}
