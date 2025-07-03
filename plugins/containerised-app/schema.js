const z = require('zod/v3')
const { HakoEnvironmentName } = require('@dotcom-tool-kit/hako/lib/tasks/deploy')
const { styles } = require('@dotcom-tool-kit/logger')

// We don't want to transform the environment yet as the value will get
// substituted into the HakoDeploy task options where it will then get
// transformed. The transform isn't idempotent so will result in a parse error
// if applied twice.
const HakoEnvironmentNameInner = HakoEnvironmentName.innerType()

module.exports = z
  .object({
    awsRoleArnStaging: z
      .string()
      .regex(/^arn:aws:iam::\d+:role\//, 'Role ARN must be a full IAM role ARN including account number')
      .describe('the ARN of an IAM role to assume when deploying to staging'),
    awsRoleArnProduction: z
      .string()
      .regex(/^arn:aws:iam::\d+:role\//, 'Role ARN must be a full IAM role ARN including account number')
      .describe('the ARN of an IAM role to assume when deploying to production'),
    hakoReviewEnvironments: z
      .array(HakoEnvironmentNameInner)
      .default(['ft-com-review-eu'])
      .describe('the set of Hako environments to deploy to in the deploy:review command'),
    hakoStagingEnvironments: z
      .array(HakoEnvironmentNameInner)
      .default(['ft-com-test-eu'])
      .describe('the set of Hako environments to deploy to in the deploy:staging command'),
    hakoProductionEnvironments: z
      .array(HakoEnvironmentNameInner)
      .default(['ft-com-prod-eu'])
      .describe('the set of Hako environments to deploy to in the deploy:production command')
  })
  .passthrough()
  .refine((options) => !('multiregion' in options), {
    message: `the option ${styles.code('multiregion')} has been replaced by ${styles.code(
      'hakoReviewEnvironments'
    )}, ${styles.code('hakoStagingEnvironments')}, and ${styles.code(
      'hakoProductionEnvironments'
    )}. set ${styles.code('hakoProductionEnvironments')} to ${styles.code(
      '[ft-com-prod-eu, ft-com-prod-us]'
    )} for equivalent behaviour.`
  })
