import { movedPluginOptions } from '../moved-plugin-options'
import { PromptGenerators } from '../prompts'
import { z } from 'zod'

export const HerokuSchema = z.object({
  pipeline: z
    .string()
    .describe(
      "the ID of your app's Heroku pipeline. this can be found at https://dashboard.heroku.com/pipelines/[PIPELINE_ID]"
    )
})
.passthrough()
.refine(...movedPluginOptions('scaling', 'HerokuProduction'))

export type HerokuOptions = z.infer<typeof HerokuSchema>

export const Schema = HerokuSchema
export const generators: PromptGenerators<typeof HerokuSchema> = {
  pipeline: async (logger, prompt, onCancel, bizOpsSystem) => bizOpsSystem?.herokuApps[0]?.pipelineName
}
