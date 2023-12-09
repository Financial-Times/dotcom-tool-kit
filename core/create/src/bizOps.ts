import { DopplerEnvVars } from '@dotcom-tool-kit/doppler'
import { rootLogger as winstonLogger } from '@dotcom-tool-kit/logger'
import fetch from 'node-fetch'
import z from 'zod'

export const BizOpsSystem = z.object({
  hostPlatform: z.string(),
  awsResourcesAggregate: z.object({ count: z.number() })
})
export type BizOpsSystem = z.infer<typeof BizOpsSystem>
export const BizOpsData = z.object({
  data: z.object({
    systems: z.array(BizOpsSystem).length(1)
  })
})
export type BizOpsData = z.infer<typeof BizOpsData>

let bizOpsApiKey: string
const getBizOpsApiKey = async () => {
  if (!bizOpsApiKey) {
    const dopplerEnvVars = new DopplerEnvVars(winstonLogger, 'prod', {
      project: 'dotcom-tool-kit'
    })
    const { BIZ_OPS_API_KEY: apiKey } = await dopplerEnvVars.get()
    // keep ESLint happy by kind of avoiding the race condition where
    // bizOpsApiKey could get written to twice, although they (should) write
    // the same key regardless
    if (!bizOpsApiKey) {
      bizOpsApiKey = apiKey
    }
  }
  return bizOpsApiKey
}

export const getBizOpsSystem = async (systemCode: string): Promise<BizOpsSystem> => {
  const query = `#graphql
    query ToolKitMigrationMetadata($systemCode: String!) {
      systems(where: { code: $systemCode }) {
        hostPlatform
        awsResourcesAggregate(where: { resourceType: "AWS::Lambda::Function" }) {
          count
        }
      }
    }
  `
  const variables = JSON.stringify({ systemCode })
  const resp = await fetch(
    'https://api.ft.com/biz-ops/graphql?' + new URLSearchParams({ query, variables }),
    {
      headers: {
        'X-Api-Key': await getBizOpsApiKey(),
        'Client-Id': 'platform-scripts',
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    }
  )
  const { data } = BizOpsData.parse(await resp.json())
  return data.systems[0]
}
