import { PromptGenerators } from '../prompts'
import { z } from 'zod'

export const ServerlessSchema = z.object({
  awsAccountId: z.string(),
  systemCode: z.string(),
  regions: z.array(z.string()).default(['eu-west-1']),
  configPath: z.string().optional(),
  useDoppler: z.boolean().default(true),
  ports: z.number().array().default([3001, 3002, 3003])
})

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
