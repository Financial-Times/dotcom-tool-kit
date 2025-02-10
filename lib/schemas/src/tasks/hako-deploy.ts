import { z } from 'zod'

const HakoEnvironmentNames = z.enum(['ft-com-prod-eu', 'ft-com-prod-us', 'ft-com-test-eu'])

export type HakoEnvironmentNames = (typeof HakoEnvironmentNames.options)[number]

export const HakoDeploySchema = z
  .object({
    environments: z.array(HakoEnvironmentNames).describe('the Hako environments to deploy an image to')
  })
  .describe('Deploy to ECS via the Hako CLI')

export type HakoDeployOptions = z.infer<typeof HakoDeploySchema>

export const Schema = HakoDeploySchema
