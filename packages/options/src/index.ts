import type { Options } from '@dotcom-tool-kit/types/src/schema'

const options: Options = {}

export const getOptions = <T extends keyof Options>(plugin: T): Options[T] | Record<string, never> =>
  options[plugin] || {}

export const setOptions = <T extends keyof Options>(plugin: T, opts: Options[T]): void => {
  options[plugin] = opts
}
