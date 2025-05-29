import { AssumeRoleWithWebIdentityCommand, STSClient } from '@aws-sdk/client-sts'
import { randomUUID } from 'node:crypto'
import * as z from 'zod'
import { Task } from '@dotcom-tool-kit/base'
import { ToolKitError } from '@dotcom-tool-kit/error'
import { readState, writeState } from '@dotcom-tool-kit/state'

const AwsAssumeRoleSchema = z
  .object({
    roleArn: z
      .string()
      .regex(/^arn:aws:iam::\d+:role\//, 'Role ARN must be a full IAM role ARN including account number')
      .describe('the ARN of an IAM role to assume')
  })
  .describe('Assume an AWS IAM role for use in future tasks')
export { AwsAssumeRoleSchema as schema }

export default class AwsAssumeRole extends Task<{ task: typeof AwsAssumeRoleSchema }> {
  async run() {
    try {
      this.logger.info(`Assuming AWS role "${this.options.roleArn}"`)
      const ciState = readState('ci')

      const RoleArn = this.options.roleArn
      const RoleSessionName = ciState?.repo ? `tool-kit-${ciState.repo}` : 'tool-kit'
      const WebIdentityToken = process.env.CIRCLE_OIDC_TOKEN_V2

      // Note: hard-coded region because STSClient requires it despite IAM roles being global
      const client = new STSClient({ region: 'eu-west-1' })
      const { Credentials } = await client.send(
        new AssumeRoleWithWebIdentityCommand({ RoleArn, RoleSessionName, WebIdentityToken })
      )

      if (!Credentials) {
        throw new Error('Assuming role with web identity did not return credentials')
      }

      const awsCredentials = {
        accessKeyId: Credentials.AccessKeyId,
        secretAccessKey: Credentials.SecretAccessKey,
        sessionToken: Credentials.SessionToken
      }
      writeState('ci', { awsCredentials })
      this.logger.info(`Saved AWS credentials to "ci" state with session name "${RoleSessionName}"`)
    } catch (err) {
      if (err instanceof Error) {
        const error = new ToolKitError('failed to assume AWS role')
        error.details = err.message
        error.exitCode = 1
        throw error
      } else {
        throw err
      }
    }
  }
}
