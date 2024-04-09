import { z } from 'zod'

export const TypeScriptSchema = z.object({
  configPath: z.string().optional(),
  build: z.literal(true).optional(),
  watch: z.literal(true).optional(),
  noEmit: z.literal(true).optional()
})

export type TypeScriptOptions = z.infer<typeof TypeScriptSchema>

export const Schema = TypeScriptSchema
