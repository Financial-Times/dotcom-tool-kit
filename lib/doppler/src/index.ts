import { spawn } from 'node:child_process'

import type { Logger } from 'winston'
import type * as z from 'zod'

import { ToolKitError } from '@dotcom-tool-kit/error'
import { styles, waitOnExit } from '@dotcom-tool-kit/logger'

import type DopplerSchema from './schema'

export type Environment = 'prod' | 'ci' | 'dev'

export type DopplerSecrets = Record<string, string>

type DopplerOptions = z.infer<typeof DopplerSchema>

export class DopplerEnvVars {
  options: Required<DopplerOptions>

  constructor(private logger: Logger, public environment: Environment, options: DopplerOptions = {}) {
    if (!(options && options.project)) {
      const error = new ToolKitError('Doppler options not found in your Tool Kit configuration')
      error.details = `"project" is needed to get your app's secrets from doppler, e.g.
        options:
          '@dotcom-tool-kit/doppler':
              project: "your-app"
            `
      throw error
    }
    // TypeScript can't seem to detect that the project field is no longer
    // partial unless it is accessed directly
    this.options = { project: options.project }
  }

  async invokeCLI(): Promise<DopplerSecrets | undefined> {
    let errorMsg = ''
    try {
      let secrets = ''
      const dopplerChild = spawn('doppler', [
        'secrets',
        'download',
        '--no-file',
        '--project',
        this.options.project,
        '--config',
        this.environment
      ])
      dopplerChild.stdout?.on('data', (data) => (secrets += data))
      dopplerChild.stderr?.on('data', (data) => (errorMsg += data))
      await waitOnExit('doppler', dopplerChild)

      // the Doppler CLI doesn't reliably exit with an error code even if it
      // encountered one so we need to check stderr too
      if (!errorMsg) {
        return JSON.parse(secrets)
      }
    } catch (err) {
      if (!errorMsg) {
        this.logger.warn(`caught error '${err}' when calling Doppler`)
      }
    }
    if (errorMsg) {
      this.logger.warn(
        `doppler CLI failed with the following error logs:\n${styles.warningHighlight(errorMsg)}`
      )
    }
    return undefined
  }

  async get(): Promise<DopplerSecrets> {
    if (process.env.CIRCLECI && process.env.NODE_ENV !== 'test') {
      const error = new ToolKitError('Doppler options cannot be dynamically accessed within CircleCI')
      error.details =
        this.environment === 'ci'
          ? "Doppler automatically syncs secrets to CircleCI's project settings so you can access secrets via process.env rather than pulling them with DopplerEnvVars"
          : "dev/prod secrets are not synced to CircleCI and CircleCI shouldn't be able to access them so it's recommended that they are synced directly to the service (e.g. AWS) that needs them rather than being pulled into CircleCI"
      throw error
    }

    const secrets = await this.invokeCLI()
    if (!secrets) {
      throw new ToolKitError('failed to get secrets from Doppler')
    }
    return secrets
  }
}
