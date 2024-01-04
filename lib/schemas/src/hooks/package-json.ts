import { z } from 'zod'

const CommandListSchema = z.union([z.array(z.string()), z.string()])
export const PackageJsonSchema = z.record(
  z.record(
    z.union([
      CommandListSchema,
      z.object({
        commands: CommandListSchema,
        trailingString: z.string()
      })
    ])
  )
)

export type PackageJsonOptions = z.infer<typeof PackageJsonSchema>

export const Schema = PackageJsonSchema
