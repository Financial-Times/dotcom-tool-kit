import type { SchemaOptions } from '@dotcom-tool-kit/schemas'

const options: Partial<SchemaOptions> = {}

export type OptionKey = keyof SchemaOptions

export const getOptions = <T extends OptionKey>(plugin: T): SchemaOptions[T] | undefined => options[plugin]

export const setOptions = <T extends OptionKey>(plugin: T, opts: SchemaOptions[T]): void => {
  options[plugin] = opts
}
