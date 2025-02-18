const z = require('zod')

module.exports = z.object({
  awsRoleArnStaging: z
    .string()
    .regex(/^arn:aws:iam::\d+:role\//, 'Role ARN must be a full IAM role ARN including account number')
    .describe('the ARN of an IAM role to assume when deploying to staging'),
  awsRoleArnProduction: z
    .string()
    .regex(/^arn:aws:iam::\d+:role\//, 'Role ARN must be a full IAM role ARN including account number')
    .describe('the ARN of an IAM role to assume when deploying to production'),
  // HACK: must be either `true` or `undefined` because of the way !toolkit/if-defined works
  multiregion: z
    .literal(true)
    .optional()
    .describe('Whether the app is deployed across both EU and US regions')
})
