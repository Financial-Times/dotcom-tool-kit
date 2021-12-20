import { SchemaOutput, SchemaPromptGenerator } from '../schema'

export interface HerokuScaling {
  [app: string]: { [appType: string]: { size: string; quantity: number } }
}

const scaling: SchemaPromptGenerator<HerokuScaling> = async (prompt, onCancel) => {
  console.log('You must configure the scaling for each of the Heroku apps in your pipeline.')
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
    const { appType, size, quantity, moreApps } = await prompt(
      [
        {
          name: 'appType',
          type: 'text',
          initial: 'web',
          message: `What type of app is ${app}?`
        },
        { name: 'size', type: 'text', initial: 'standard-1X', message: `What should the size of ${app} be?` },
        { name: 'quantity', type: 'number', message: `How many ${app} processes should be run?` },
        { name: 'moreApps', type: 'confirm', message: 'Are there more Heroku apps in this pipeline?' }
      ],
      { onCancel }
    )
    scaling[app] = { [appType]: { size, quantity } }
    allAppsConfigured = !moreApps
  }
  return scaling
}

export const HerokuSchema = {
  pipeline: 'string',
  systemCode: 'string',
  scaling
} as const
export type HerokuOptions = SchemaOutput<typeof HerokuSchema>

export const Schema = HerokuSchema
