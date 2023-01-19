import { z } from 'zod'

export const NodeSchema = z.object({
  entry: z.string().optional(),
  args: z.string().array().optional(),
  useVault: z.boolean().optional(),
  ports: z.number().array().optional()
})
export type NodeOptions = z.infer<typeof NodeSchema>

export const Schema = NodeSchema
