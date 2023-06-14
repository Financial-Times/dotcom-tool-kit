import { z } from 'zod'

export const NodemonSchema = z.object({
  entry: z.string().default('./server/app.js'),
  configPath: z.string().optional(),
  useVault: z.boolean().default(true),
  ports: z.number().array().default([3001, 3002, 3003])
})
export type NodemonOptions = z.infer<typeof NodemonSchema>

export const Schema = NodemonSchema
