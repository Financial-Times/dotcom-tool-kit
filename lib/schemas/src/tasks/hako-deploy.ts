import { z } from 'zod'

export const HakoDeploySchema = z
  .object({
    environments: z.array(z.string()).describe('the Hako environments to deploy an image to')
  })
  .describe('Deploy to ECS via the Hako CLI')

export type HakoDeployOptions = z.infer<typeof HakoDeploySchema>

export const Schema = HakoDeploySchema
