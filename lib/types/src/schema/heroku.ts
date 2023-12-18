import { SchemaPromptGenerator, PromptGenerators } from '../schema'

import { waitOnExit } from '@dotcom-tool-kit/logger'

import { spawn } from 'node:child_process'

import type { Logger } from 'winston'
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

const HerokuDynoList = z.array(
  z.object({
    size: z.string(),
    state: z.string(),
    type: z.string()
  })
)
type HerokuDynoList = z.infer<typeof HerokuDynoList>

const getDynos = async (logger: Logger, appName: string): Promise<HerokuDynoList> => {
  // call the Heroku CLI so we can use the user's personal API token rather
  // than sharing one that might be rate-limited/compromised
  const herokuChild = spawn('heroku', ['ps', '--json', '-a', appName], {
    // If the user isn't logged in they will get an error printed to stderr,
    // with a call to login confirmed by stdin. The JSON result will get
    // printed to stdout which is the only thing we want.
    stdio: ['inherit', 'pipe', 'inherit']
  })
  let resp = ''
  herokuChild.stdout.on('data', (data) => (resp += data))
  await waitOnExit('heroku', herokuChild)
  // if the user logs in as part of the heroku ps call their username will be
  // (obnoxiously) printed to stdout before the well-formatted JSON is printed
  if (resp.startsWith('Logged in')) {
    resp = resp.slice(resp.indexOf('\n') + 1)
  }
  return HerokuDynoList.parse(JSON.parse(resp))
}

const scaling: SchemaPromptGenerator<HerokuScaling> = async (logger, prompt, onCancel, bizOpsSystem) => {
  logger.error(
    "you must specify the scaling for each of the production Heroku apps in your pipeline, but we'll try and guess your previous configuration first. you may have to sign into the Heroku CLI to do this"
  )
  let scaling: HerokuScaling = {}
  let allAppsConfigured = false
  if (bizOpsSystem?.herokuApps.length ?? 0 > 0) {
    /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion --
     * we just checked whether the bizOpsSystem variable is defined
     **/
    for (const { code } of bizOpsSystem!.herokuApps) {
      const dynos = await getDynos(logger, code)
      const upDynos = dynos.filter(({ state }) => state === 'up')
      const quantity = upDynos.length
      if (quantity > 0) {
        scaling[code] = {
          [upDynos[0].type]: { size: upDynos[0].size.toLowerCase(), quantity }
        }
      }
    }
    const { confirmGuess } = await prompt(
      {
        name: 'confirmGuess',
        type: 'confirm',
        initial: true,
        message: `based on Biz Ops and the Heroku API, we think your heroku plugin settings should be:\n${JSON.stringify(
          scaling,
          undefined,
          2
        )}\ndoes this look correct? if you say no you can enter the options manually instead`
      },
      { onCancel }
    )
    if (!confirmGuess) {
      scaling = {}
    }
    allAppsConfigured = confirmGuess
  }
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
  pipeline: async (logger, prompt, onCancel, bizOpsSystem) => bizOpsSystem?.herokuApps[0]?.pipelineName,
  systemCode: async (logger, prompt, onCancel, bizOpsSystem) => bizOpsSystem?.code,
  scaling
}
