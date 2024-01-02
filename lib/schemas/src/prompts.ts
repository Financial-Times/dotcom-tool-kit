import type prompts from 'prompts'
import type { Logger } from 'winston'
import type { z } from 'zod'

import type { BizOpsSystem } from './bizOps'

/**
 * A function that should use the `prompt` parameter passed to build a more
 * complex option structure, like a nested object, from user input. Returning
 * an undefined value will cause the program to fall back to the default prompt
 * interface.
 * @param onCancel - pass this to `prompt`'s options so that a user
 *   interrupting the prompt can be handled properly
 */
export type SchemaPromptGenerator<T> = (
  logger: Logger,
  prompt: typeof prompts,
  onCancel: () => void,
  // HACK:20231209:IM add bizOpsSystem as optional parameter to maintain
  // backwards compatibility
  bizOpsSystem?: BizOpsSystem
) => Promise<T | undefined>
// This type defines an interface you can use to export prompt generators. The
// `T` type parameter should be the type of your `Schema` object, and it will
// be mapped into a partial object of `SchemaPromptGenerator` functions with
// all their return types set to the output type of each option schema.
export type PromptGenerators<T> = T extends z.ZodObject<infer Shape>
  ? {
      [option in keyof Shape as Shape[option] extends z.ZodType
        ? option
        : never]?: Shape[option] extends z.ZodType ? SchemaPromptGenerator<z.output<Shape[option]>> : never
    }
  : never
