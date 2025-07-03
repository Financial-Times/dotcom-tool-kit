import * as z from 'zod/v3'

import { styles } from '@dotcom-tool-kit/logger'

const movedPluginOptions = <T extends Record<string, unknown>>(
  option: string,
  task: string,
  newName = option
) =>
  [
    (options: T) => !(option in options),
    {
      message: `the option ${styles.code(option)} has moved to ${styles.code(
        `options.tasks.${styles.task(task)}.${newName}`
      )}`
    }
  ] as const

export default z
  .object({
    awsAccountId: z
      .string()
      .describe(
        'the ID of the AWS account you wish to deploy to (account IDs can be found at the [FT login page](https://awslogin.in.ft.com/))'
      ),
    systemCode: z.string().describe('the system code for your app'),
    regions: z
      .array(z.string())
      .default(['eu-west-1'])
      .describe('an array of AWS regions you want to deploy to'),
    configPath: z
      .string()
      .optional()
      .describe(
        'path to your serverless config file. If this is not provided, Serverless defaults to `./serverless.yml` but [other config fomats are accepted](https://www.serverless.com/framework/docs/providers/aws/guide/intro#alternative-configuration-format)'
      )
  })
  .passthrough()
  .refine(...movedPluginOptions('useVault', 'ServerlessRun', 'useDoppler'))
  .refine(...movedPluginOptions('ports', 'ServerlessRun'))
