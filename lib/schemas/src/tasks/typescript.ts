import { z } from 'zod'

export const TypeScriptSchema = z.object({
  configPath: z.string().optional(),
  extraArgs: z.string().array().optional()
})

export type TypeScriptOptions = z.infer<typeof TypeScriptSchema>

export const Schema = TypeScriptSchema
