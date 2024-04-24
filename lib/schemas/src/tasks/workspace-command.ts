import { z } from 'zod'

export const WorkspaceCommandSchema = z.object({
  command: z.string().optional()
})

export type WorkspaceCommandOptions = z.infer<typeof WorkspaceCommandSchema>

export const Schema = WorkspaceCommandSchema
