import { z } from 'zod'

export const AwsAssumeRoleSchema = z
  .object({
    roleArn: z
      .string()
      .regex(/^arn:aws:iam::\d+:role\//, 'Role ARN must be a full IAM role ARN including account number')
      .describe('the ARN of an IAM role to assume')
  })
  .describe('Assume an AWS IAM role for use in future tasks')

export type AwsAssumeRoleOptions = z.infer<typeof AwsAssumeRoleSchema>

export const Schema = AwsAssumeRoleSchema
