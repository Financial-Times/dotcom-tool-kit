import type { Options } from '@dotcom-tool-kit/types/src/schema'

const options: Options = {}

export type OptionKey = keyof Options

export const getOptions = <T extends OptionKey>(plugin: T): Options[T] | undefined => options[plugin]

export const setOptions = <T extends OptionKey>(plugin: T, opts: Options[T]): void => {
  options[plugin] = opts
}
