import { hookFork, waitOnExit } from '@dotcom-tool-kit/logger'
import { spawn } from 'node:child_process'
import { Task } from '@dotcom-tool-kit/base'
import { ToolKitError } from '@dotcom-tool-kit/error'

export default class DockerAuthCloudsmith extends Task {
  async run() {
    try {
      const auth = {
        username: process.env.CLOUDSMITH_SERVICE_ACCOUNT,
        password: process.env.CLOUDSMITH_OIDC_TOKEN,
        registry: 'docker.packages.ft.com'
      }

      if (!auth.username || !auth.password) {
        throw new Error(
          'No CloudSmith service account found. Install @dotcom-tool-kit/cloudsmith and use the serviceAccount option'
        )
      }

      const child = spawn('docker', ['login', '--username', auth.username, '--password-stdin', auth.registry])
      child.stdin.setDefaultEncoding('utf-8')
      child.stdin.write(auth.password)
      child.stdin.end()
      hookFork(this.logger, 'docker-login', child)
      await waitOnExit('docker-login', child)
    } catch (err) {
      // We wrap non-ToolKitError errors to ensure that they exit the process
      if (err instanceof Error && !(err instanceof ToolKitError)) {
        const error = new ToolKitError(err.message)
        error.exitCode = 1
        throw error
      }
      throw err
    }
  }
}
