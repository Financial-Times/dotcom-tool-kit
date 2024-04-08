import { PromptGenerators } from '../prompts'
import { z } from 'zod'

export const HerokuSchema = z.object({
  pipeline: z.string().describe('this can be found at https://dashboard.heroku.com/pipelines/[APP_ID]'),
  systemCode: z.string().describe('this can be found at https://biz-ops.in.ft.com/System/[APP_NAME]')
})

export type HerokuOptions = z.infer<typeof HerokuSchema>

export const Schema = HerokuSchema
export const generators: PromptGenerators<typeof HerokuSchema> = {
  pipeline: async (logger, prompt, onCancel, bizOpsSystem) => bizOpsSystem?.herokuApps[0]?.pipelineName,
  systemCode: async (logger, prompt, onCancel, bizOpsSystem) => bizOpsSystem?.code
}
