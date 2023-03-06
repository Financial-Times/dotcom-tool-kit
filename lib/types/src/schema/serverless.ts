import { z } from 'zod'

export const ServerlessSchema = z.object({
  awsAccountId: z.string(),
  systemCode: z.string(),
  region: z.string(),
  configPath: z.string().optional(),
  useVault: z.boolean().default(true),
  ports: z.number().array().default([3001, 3002, 3003]),
  buildNumVariable: z.string().default("CIRCLE_BUILD_NUM")
})
export type ServerlessOptions = z.infer<typeof ServerlessSchema>

export const Schema = ServerlessSchema
