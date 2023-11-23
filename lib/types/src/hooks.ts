import { z } from 'zod'

export const HookSchemas = {
  'dummy schema to get types working for now': z.never()
}

// Gives the TypeScript type represented by each Schema
export type Options = {
  [plugin in keyof typeof HookSchemas]: typeof HookSchemas[plugin] extends z.ZodTypeAny
    ? z.infer<typeof HookSchemas[plugin]>
    : never
}
