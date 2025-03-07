import { Task, TaskRunContext } from '@dotcom-tool-kit/base'
import { DopplerEnvVars } from '@dotcom-tool-kit/doppler'
import { register } from 'ft-next-router'
import { readState } from '@dotcom-tool-kit/state'
import { hookConsole, hookFork, styles, waitOnExit } from '@dotcom-tool-kit/logger'
import { ToolKitError } from '@dotcom-tool-kit/error'
import { fork } from 'child_process'
import type NextRouterSchema from '../schema'

export default class NextRouter extends Task<{ plugin: typeof NextRouterSchema }> {
  async run({ cwd }: TaskRunContext): Promise<void> {
    const doppler = new DopplerEnvVars(this.logger, 'dev', {
      project: 'next-router'
    })

    const routerBin = require.resolve('ft-next-router/bin/next-router')
    const dopplerEnv = await doppler.get()
    const child = fork(routerBin, ['--daemon'], {
      env: {
        ...process.env,
        ...dopplerEnv
      },
      silent: true,
      cwd
    })
    hookFork(this.logger, 'next-router', child)
    await waitOnExit('next-router', child)

    const local = readState('local')
    if (!local) {
      const error = new ToolKitError('no locally running app found')
      error.details = `make sure there's a task running your app, e.g. via the ${styles.plugin(
        'node'
      )} plugin, configured to run before the ${styles.task('NextRouter')} task.`
      throw error
    }

    const unhook = hookConsole(this.logger, 'ft-next-router')
    try {
      await register({ service: this.pluginOptions.appName, port: local.port })
    } finally {
      unhook()
    }
  }
}
