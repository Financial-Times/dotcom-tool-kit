import { DopplerEnvVars } from '@dotcom-tool-kit/doppler'
import { rootLogger as winstonLogger } from '@dotcom-tool-kit/logger'
import { BizOpsData, BizOpsSystem } from '@dotcom-tool-kit/types/lib/bizOps'
import fetch from 'node-fetch'

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
        code
        hostPlatform
        herokuApps(where: { pipelineStage: "production", dynoUnits_GT: 0 }) {
          code
          pipelineName
        }
        awsResourcesAggregate(where: { resourceType: "AWS::Lambda::Function" }) {
          count
        }
        awsAccounts {
          code
          name
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

export { BizOpsData, BizOpsSystem }
