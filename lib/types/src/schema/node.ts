import { z } from 'zod'

export const NodeSchema = z.object({
  entry: z.string().default('./server/app.js'),
  args: z.string().array().optional(),
  useVault: z.boolean().default(true),
  ports: z.number().array().default([3001, 3002, 3003])
})
export type NodeOptions = z.infer<typeof NodeSchema>

export const Schema = NodeSchema
