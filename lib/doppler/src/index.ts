import { spawn } from 'child_process'

import type { Logger } from 'winston'

import { ToolKitError } from '@dotcom-tool-kit/error'
import { waitOnExit } from '@dotcom-tool-kit/logger'
import { getOptions } from '@dotcom-tool-kit/options'
import type { DopplerOptions } from '@dotcom-tool-kit/types/lib/schema/doppler'

export type Environment = 'prd' | 'ci' | 'dev'

export class DopplerEnvVars {
  options: DopplerOptions

  constructor(private logger: Logger, public environment: Environment, options?: DopplerOptions) {
    const dopplerOptions = options ?? getOptions('@dotcom-tool-kit/doppler')
    if (!dopplerOptions || !('project' in dopplerOptions)) {
      const error = new ToolKitError('Doppler options not found in your Tool Kit configuration')
      error.details = `"project" is needed to get your app's secrets from doppler, e.g.
        options:
          '@dotcom-tool-kit/doppler':
              project: "your-app"
            `
      throw error
    }
    this.options = dopplerOptions
  }

  async get(): Promise<Record<string, string>> {
    try {
      const dopplerChild = spawn('doppler', [
        'secrets',
        'download',
        '--no-file',
        '--project',
        this.options.project!,
        '--config',
        this.environment
      ])
      let secrets = ''
      dopplerChild.stdout.on('data', (data) => (secrets += data))
      await waitOnExit('doppler', dopplerChild)
      return JSON.parse(secrets)
    } catch {
      const error = new ToolKitError(`Unable to retrieve secrets from doppler`)
      error.details = `Please check that your system code is correct`
      throw error
    }
  }
}
