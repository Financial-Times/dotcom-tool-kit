import { DockerPushSchema } from '@dotcom-tool-kit/schemas/src/tasks/docker-push'
import { DockerSchema } from '@dotcom-tool-kit/schemas/lib/plugins/docker'
import { hookFork, waitOnExit } from '@dotcom-tool-kit/logger'
import { spawn } from 'child_process'
import { Task } from '@dotcom-tool-kit/base'

export default class DockerBuild extends Task<{
  plugin: typeof DockerSchema
  task: typeof DockerPushSchema
}> {
  async run() {
    for (const [imageIdentifier, imageOptions] of Object.entries(this.pluginOptions.images)) {
        const registries = imageOptions.registries.filter((registry) => {
          return registry.stage === this.options.stage
        })

		// TODO if no registries

        for (const registry of registries) {
          try {
			this.logger.info(`Pushing image "${imageIdentifier}" to ${registry.name}`)

            // let auth
            // if (registry.name.startsWith('registry.heroku.com')) {
            //   auth = {
            //     username: process.env.HEROKU_LOGIN || '',
            //     password: process.env.HEROKU_AUTH_TOKEN || '',
            //     registry: 'registry.heroku.com'
            //   }
            // } else if (registry.name.startsWith('docker.packages.ft.com')) {
            //   auth = {
            //     username: process.env.CLOUDSMITH_SERVICE_ACCOUNT || '',
            //     password: process.env.CLOUDSMITH_OIDC_TOKEN || '',
            //     registry: 'docker.packages.ft.com'
            //   }
            // }

            // if (auth) {
            //   this.logger.info(`Authenticating with ${auth.registry}`)
            //   const childLogin = spawn(
            //     'docker',
            //     ['login', '--username', auth.username, '--password-stdin', auth.registry],
            //     { silent: true }
            //   )
            //   childLogin.stdin.setEncoding('utf-8')
            //   childLogin.stdin.write(auth.password)
            //   childLogin.stdin.end()
            //   hookFork(this.logger, 'dockerLogin', childLogin)
            //   await waitOnExit('dockerLogin', childLogin)
            // }

            const childTag = spawn('docker', ['tag', imageIdentifier, registry.name], { silent: true })
            hookFork(this.logger, 'dockerTag', childTag)
            await waitOnExit('dockerTag', childTag)

            const childPush = spawn('docker', ['push', registry.name], { silent: true })
            hookFork(this.logger, 'dockerPush', childPush)
            await waitOnExit('dockerPush', childPush)
          } catch (err) {
            if (err instanceof Error) {
				const error = new ToolKitError('docker push failed to run')
				error.details = err.message
				throw error
			  } else {
				throw err
			  }
          }
        }

        // const child = spawn('docker', [
        //   'push',
        //   '--platform',
        //   options.platform,
        //   '--tag',
        //   imageIdentifier,
        //   '--file',
        //   options.definition,
        //   process.cwd()
        // ])
        // hookFork(this.logger, 'docker', child)
        // await waitOnExit('docker', child)
    }
  }
}
