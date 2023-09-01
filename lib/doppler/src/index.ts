import { spawn } from 'child_process'

import type { Logger } from 'winston'

import { ToolKitError } from '@dotcom-tool-kit/error'
import { styles, waitOnExit } from '@dotcom-tool-kit/logger'
import { getOptions } from '@dotcom-tool-kit/options'
import * as Vault from '@dotcom-tool-kit/vault'
import type { DopplerOptions as ConfiguredDopplerOptions } from '@dotcom-tool-kit/types/lib/schema/doppler'

export type Environment = 'prd' | 'ci' | 'dev'

type DopplerOptions = Required<ConfiguredDopplerOptions>

const dopplerEnvToVaultMap: Record<Environment, Vault.Environment> = {
  prd: 'production',
  ci: 'continuous-integration',
  dev: 'development'
}

let hasLoggedMigrationWarning = false

export class DopplerEnvVars {
  options: DopplerOptions

  constructor(private logger: Logger, public environment: Environment, options?: DopplerOptions) {
    let dopplerOptions = options ?? getOptions('@dotcom-tool-kit/doppler')
    if (!(dopplerOptions && dopplerOptions.project)) {
      // HACK:20230829:IM check the project passed to the Vault options too so
      // that projects don't have to make any changes to their Tool Kit config
      logger.warn('Doppler options not found so falling back to Vault options')
      dopplerOptions = { project: getOptions('@dotcom-tool-kit/vault')?.app }
    }
    if (!(dopplerOptions && dopplerOptions.project)) {
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
    this.options = { project: dopplerOptions.project }
  }

  async get(): Promise<Record<string, string>> {
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
        this.logger.warn(`caught error '${err}' when calling Doppler, falling back to Vault`)
      }
    }
    if (errorMsg) {
      this.logger.warn(
        `doppler CLI failed with the following error logs, falling back to Vault:\n${styles.warningHighlight(
          errorMsg
        )}`
      )
    }

    // fall back to Vault
    if (!hasLoggedMigrationWarning) {
      this.logger.warn(
        `getting Doppler secrets failed so falling back to the ${styles.warningHighlight(
          'DEPRECATED'
        )} Vault secrets manager. please consider migrating to/fixing issues with Doppler.`
      )
      hasLoggedMigrationWarning = true
    }
    const vault = new Vault.VaultEnvVars(this.logger, {
      environment: dopplerEnvToVaultMap[this.environment]
    })
    return vault.get()
  }
}
