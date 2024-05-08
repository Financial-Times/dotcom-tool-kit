import { PromptGenerators } from '../prompts.js'
import { z } from 'zod'

export const HerokuSchema = z.object({
  pipeline: z
    .string()
    .describe(
      "the ID of your app's Heroku pipeline. this can be found at https://dashboard.heroku.com/pipelines/[PIPELINE_ID]"
    ),
  systemCode: z
    .string()
    .describe(
      "your app's Biz Ops system code. this can be found at https://biz-ops.in.ft.com/System/[SYSTEM_CODE]"
    )
})

export type HerokuOptions = z.infer<typeof HerokuSchema>

export const Schema = HerokuSchema
export const generators: PromptGenerators<typeof HerokuSchema> = {
  pipeline: async (logger, prompt, onCancel, bizOpsSystem) => bizOpsSystem?.herokuApps[0]?.pipelineName,
  systemCode: async (logger, prompt, onCancel, bizOpsSystem) => bizOpsSystem?.code
}
