import type { PluginOptions } from '@dotcom-tool-kit/schemas'

const options: Partial<PluginOptions> = {}

export type OptionKey = keyof PluginOptions

export const getOptions = <T extends OptionKey>(plugin: T): PluginOptions[T] | undefined => options[plugin]

export const setOptions = <T extends OptionKey>(plugin: T, opts: PluginOptions[T]): void => {
  options[plugin] = opts
}
