import { z } from 'zod'

export const TypeScriptSchema = z.object({
  configPath: z.string().optional()
})

export type TypeScriptOptions = z.infer<typeof TypeScriptSchema>

export const Schema = TypeScriptSchema
