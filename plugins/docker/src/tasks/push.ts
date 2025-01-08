import { buildImageName } from '../image-info'
import { DockerSchema } from '@dotcom-tool-kit/schemas/lib/plugins/docker'
import { hookFork, waitOnExit } from '@dotcom-tool-kit/logger'
import { spawn } from 'node:child_process'
import { Task } from '@dotcom-tool-kit/base'
import { ToolKitError } from '@dotcom-tool-kit/error'

export default class DockerPush extends Task<{
  plugin: typeof DockerSchema
}> {
  getRegistryAuth(registryName: string) {
    let auth

    if (registryName.startsWith('docker.packages.ft.com')) {
      auth = {
        username: process.env.CLOUDSMITH_SERVICE_ACCOUNT || '',
        password: process.env.CLOUDSMITH_OIDC_TOKEN || '',
        registry: 'docker.packages.ft.com'
      }
    }

    return auth
  }

  async run() {
    // Iterate over different image types like web, worker, etc
    for (const [imageIdentifier, imageOptions] of Object.entries(this.pluginOptions.images)) {
      try {
        const imageName = buildImageName(imageOptions)
        this.logger.info(`Pushing image "${imageIdentifier}" to ${imageName}`)

        const auth = this.getRegistryAuth(imageOptions.registry)

        if (auth) {
          this.logger.info(`Authenticating with ${auth.registry}`)
          const childLogin = spawn('docker', [
            'login',
            '--username',
            auth.username,
            '--password-stdin',
            auth.registry
          ])
          childLogin.stdin.setDefaultEncoding('utf-8')
          childLogin.stdin.write(auth.password)
          childLogin.stdin.end()
          hookFork(this.logger, 'docker-login', childLogin)
          await waitOnExit('docker-login', childLogin)
        }

        const child = spawn('docker', ['push', '--all-tags', imageName])
        hookFork(this.logger, 'docker-push', child)
        await waitOnExit('docker-push', child)
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
  }
}
