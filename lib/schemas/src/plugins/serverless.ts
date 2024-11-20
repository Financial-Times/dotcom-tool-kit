import { movedPluginOptions } from '../moved-plugin-options'
import { PromptGenerators } from '../prompts'
import { z } from 'zod'

export const ServerlessSchema = z.object({
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

export type ServerlessOptions = z.infer<typeof ServerlessSchema>

export const Schema = ServerlessSchema
export const generators: PromptGenerators<typeof ServerlessSchema> = {
  awsAccountId: async (logger, prompt, onCancel, bizOpsSystem) => {
    const awsAccounts = bizOpsSystem?.awsAccounts
    if (awsAccounts) {
      const { accountId } = await prompt(
        {
          type: 'select',
          name: 'accountId',
          message: 'please select the AWS account you deploy to',
          choices: awsAccounts.map(({ code, name }) => ({ title: code, description: name, value: code }))
        },
        { onCancel }
      )
      return accountId
    }
  },
  systemCode: async (logger, prompt, onCancel, bizOpsSystem) => bizOpsSystem?.code
}
