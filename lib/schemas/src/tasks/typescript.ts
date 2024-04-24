import { z } from 'zod'

export const TypeScriptSchema = z
  .object({
    configPath: z
      .string()
      .optional()
      .describe(
        "to the [TypeScript config file](https://www.typescriptlang.org/tsconfig). Uses TypeScript's own [tsconfig.json resolution](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html#using-tsconfigjson-or-jsconfigjson) by default"
      ),
    build: z
      .literal(true)
      .optional()
      .describe(
        'Run Typescript in [build mode](https://www.typescriptlang.org/docs/handbook/project-references.html#build-mode-for-typescript).'
      ),
    watch: z.literal(true).optional().describe('Run Typescript in watch mode.'),
    noEmit: z
      .literal(true)
      .optional()
      .describe(
        'Run Typescript with `--noEmit`, for checking your types without outputting compiled Javascript.'
      )
  })
  .describe('Compile code with `tsc`.')

export type TypeScriptOptions = z.infer<typeof TypeScriptSchema>

export const Schema = TypeScriptSchema
