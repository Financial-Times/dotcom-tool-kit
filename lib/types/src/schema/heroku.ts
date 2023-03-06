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
  logger.error('You must configure the scaling for each of the Heroku apps in your pipeline.')
  const scaling: HerokuScaling = {}
  let allAppsConfigured = false
  while (!allAppsConfigured) {
    const { app } = await prompt(
      {
        name: 'app',
        type: 'text',
        message: 'Enter the name of the Heroku app to configure'
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
        { name: 'size', type: 'text', initial: 'standard-1X', message: `What should the size of ${app} be?` },
        { name: 'quantity', type: 'number', message: `What should the dyno size of ${app} be?` },
        { name: 'moreApps', type: 'confirm', message: 'Are there more Heroku apps in this pipeline?' }
      ],
      { onCancel }
    )
    scaling[app] = { [processType]: { size, quantity } }
    allAppsConfigured = !moreApps
  }
  return scaling
}

export const HerokuSchema = z.object({
  pipeline: z.string(),
  systemCode: z.string(),
  scaling: HerokuScalingSchema
})
export type HerokuOptions = z.infer<typeof HerokuSchema>

export const Schema = HerokuSchema
export const generators: PromptGenerators<typeof HerokuSchema> = {
  scaling
}
