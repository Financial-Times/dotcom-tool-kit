import { z } from 'zod'

export const NodemonSchema = z.object({
  entry: z.string().optional(),
  configPath: z.string().optional(),
  useVault: z.boolean().optional(),
  ports: z.number().array().optional()
})
export type NodemonOptions = z.infer<typeof NodemonSchema>

export const Schema = NodemonSchema
