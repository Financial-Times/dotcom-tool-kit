import { z } from 'zod'

export const TypeScriptSchema = z.object({
  configPath: z.string().optional(),
  build: z.boolean().default(false),
  watch: z.boolean().default(false),
  noEmit: z.boolean().default(false)
})

export type TypeScriptOptions = z.infer<typeof TypeScriptSchema>

export const Schema = TypeScriptSchema
