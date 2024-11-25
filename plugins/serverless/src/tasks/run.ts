import { Task, TaskRunContext } from '@dotcom-tool-kit/base'
import { ServerlessSchema } from '@dotcom-tool-kit/schemas/lib/plugins/serverless'
import { ServerlessRunSchema } from '@dotcom-tool-kit/schemas/src/tasks/serverless-run'
import { spawn } from 'child_process'
import { DopplerEnvVars } from '@dotcom-tool-kit/doppler'
import { hookConsole, hookFork } from '@dotcom-tool-kit/logger'
import getPort from 'get-port'
import waitPort from 'wait-port'

export default class ServerlessRun extends Task<{
  task: typeof ServerlessRunSchema
  plugin: typeof ServerlessSchema
}> {
  async run({cwd}: TaskRunContext): Promise<void> {
    const { useDoppler, ports } = this.options
    const { configPath } = this.pluginOptions

    let dopplerEnv = {}

    if (useDoppler) {
      const doppler = new DopplerEnvVars(this.logger, 'dev')

      dopplerEnv = await doppler.get()
    }

    const port =
      Number(process.env.PORT) ||
      (await getPort({
        port: ports
      }))

    this.logger.verbose('starting the child serverless process...')
    const args = ['offline', 'start', '--host', 'local.ft.com', '--httpPort', `${port}`]
    if (configPath) {
      args.push('--config', './serverless.yml')
    }

    const child = spawn('serverless', args, {
      env: {
        ...dopplerEnv,
        PORT: port.toString(),
        ...process.env
      },
      cwd
    })

    hookFork(this.logger, 'serverless', child)

    const unhook = hookConsole(this.logger, 'wait-port')
    try {
      await waitPort({
        host: 'localhost',
        port: port
      })
    } finally {
      unhook()
    }
  }
}
