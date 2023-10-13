import { SchemaPromptGenerator, PromptGenerators } from '../schema'
import { z } from 'zod'

export const HerokuScalingSchema = z.record(
  z.record(
    z.object({
      size: z.string(),
      quantity: z.number()
    })
  )
)
export type HerokuScaling = z.infer<typeof HerokuScalingSchema>

const scaling: SchemaPromptGenerator<HerokuScaling> = async (logger, prompt, onCancel) => {
  logger.error('You must configure the scaling for each of the production Heroku apps in your pipeline.')
  const scaling: HerokuScaling = {}
  let allAppsConfigured = false
  while (!allAppsConfigured) {
    const { app } = await prompt(
      {
        name: 'app',
        type: 'text',
        message:
          'Enter the name of the production Heroku app to configure. You can find the app name and resource details at https://dashboard.heroku.com/apps/[APP_NAME].'
      },
      { onCancel }
    )
    const { processType, size, quantity, moreApps } = await prompt(
      [
        {
          name: 'processType',
          type: 'text',
          initial: 'web',
          message: `What is the process type of ${app}?`
        },
        {
          name: 'size',
          type: 'text',
          initial: 'standard-1X',
          message: `What should the resource size of ${app} be?`
        },
        {
          name: 'quantity',
          type: 'number',
          message: `What should the number of dynos for ${app} be?`
        },
        {
          name: 'moreApps',
          type: 'confirm',
          message: 'Are there more production Heroku apps in this pipeline?'
        }
      ],
      { onCancel }
    )
    scaling[app] = { [processType]: { size, quantity } }
    allAppsConfigured = !moreApps
  }
  return scaling
}

export const HerokuSchema = z.object({
  pipeline: z.string().describe('this can be found at https://dashboard.heroku.com/pipelines/[APP_ID]'),
  systemCode: z.string().describe('this can be found at https://biz-ops.in.ft.com/System/[APP_NAME]'),
  scaling: HerokuScalingSchema
})
export type HerokuOptions = z.infer<typeof HerokuSchema>

export const Schema = HerokuSchema
export const generators: PromptGenerators<typeof HerokuSchema> = {
  scaling
}
