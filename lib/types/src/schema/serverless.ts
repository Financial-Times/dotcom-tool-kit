import { z } from 'zod'

export const ServerlessSchema = z.object({
  configPath: z.string().optional(),
  useVault: z.boolean().default(true),
  ports: z.number().array().default([3001, 3002, 3003])
})
export type ServerlessOptions = z.infer<typeof ServerlessSchema>

export const Schema = ServerlessSchema
