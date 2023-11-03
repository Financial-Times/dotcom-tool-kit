import { spawn } from 'node:child_process'
import { ToolKitError } from '@dotcom-tool-kit/error'
import { Task } from '@dotcom-tool-kit/types'
import { semVerRegex, prereleaseRegex, releaseRegex } from '@dotcom-tool-kit/types/lib/npm'
import { readState } from '@dotcom-tool-kit/state'
import { hookFork, waitOnExit } from '@dotcom-tool-kit/logger'

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

  async executeNpmTask(npmTask: 'version' | 'publish', options: string[]): Promise<void> {
    try {
      this.logger.verbose(`running \`npm ${npmTask} ${options.join(' ')}\``)
      const task = spawn('npm', [npmTask, ...options])
      hookFork(this.logger, `npm ${npmTask}`, task)
      await waitOnExit(`npm ${npmTask}`, task)
    } catch (err) {
      const error = new ToolKitError(`unable to ${npmTask} package`)
      if (err instanceof Error) {
        error.details = err.message
      }
      throw error
    }
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

    await this.executeNpmTask('version', [tag, '--no-git-tag-version'])
    await this.executeNpmTask('publish', ['--tag', npmTag])

    this.logger.info(`✅ npm package published`)
  }
}
