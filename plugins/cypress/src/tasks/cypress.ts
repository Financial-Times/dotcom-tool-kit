import { spawn } from 'child_process'
import { DopplerEnvVars } from '@dotcom-tool-kit/doppler'
import { hookFork, waitOnExit } from '@dotcom-tool-kit/logger'
import { readState } from '@dotcom-tool-kit/state'
import { Task, TaskRunContext } from '@dotcom-tool-kit/base'
import * as z from 'zod'

const CypressSchema = z
  .object({
    url: z
      .string()
      .optional()
      .describe(
        'URL to run Cypress against. If running in an environment such as a review or staging app build that has Tool Kit state with a URL for an app to run against, that will override this option.'
      ),
    openModeOnLocal: z
      .boolean()
      .optional()
      .describe(
        'Determines whether Cypress tests run in the local environment will run in Open Mode (described here: https://docs.cypress.io/app/core-concepts/open-mode).'
      )
  })
  .describe('Run Cypress end-to-end tests')
export { CypressSchema as schema }

export default class Cypress extends Task<{ task: typeof CypressSchema }> {
  async run({ cwd, config }: TaskRunContext): Promise<void> {
    const localState = readState('local')
    const reviewState = readState('review')
    const appState = reviewState ?? readState('staging')
    const cypressEnv: Record<string, string> = {}
    let dopplerEnv = {}

    if (this.options.url) {
      cypressEnv.CYPRESS_BASE_URL = this.options.url
    }

    if (appState) {
      cypressEnv.CYPRESS_BASE_URL = appState.url ?? `https://${appState.appName}.herokuapp.com`

      if (reviewState) {
        cypressEnv.CYPRESS_REVIEW_APP = 'true'
      }
    } else {
      const doppler = new DopplerEnvVars(
        this.logger,
        'dev',
        config.pluginOptions['@dotcom-tool-kit/doppler']?.options
      )
      dopplerEnv = await doppler.get()
    }

    const args = ['run'];

    if (Boolean(localState) && this.options.openModeOnLocal) {
      args.unshift('open');
    }

    this.logger.info(
      'running cypress' + (cypressEnv.CYPRESS_BASE_URL ? ` against ${cypressEnv.CYPRESS_BASE_URL}` : '')
    )
    const testProcess = spawn('cypress', args, {
      env: { ...process.env, ...dopplerEnv, ...cypressEnv },
      cwd
    })
    hookFork(this.logger, 'cypress', testProcess)
    return waitOnExit('cypress', testProcess)
  }
}
