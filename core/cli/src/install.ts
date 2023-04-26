import { ToolKitError } from '@dotcom-tool-kit/error'
import { OptionKey, setOptions } from '@dotcom-tool-kit/options'
import { Hook, HookConstructor } from '@dotcom-tool-kit/types'
import groupBy from 'lodash/groupBy'
import type { Logger } from 'winston'
import { loadConfig, ValidConfig } from './config'
import { postInstall } from './postInstall'

// implementation of the Array.every method that supports asynchronous predicates
async function asyncEvery<T>(arr: T[], pred: (x: T) => Promise<boolean>): Promise<boolean> {
  for (const val of arr) {
    if (!(await pred(val))) {
      return false
    }
  }
  return true
}

export default async function installHooks(logger: Logger): Promise<ValidConfig> {
  const config = await loadConfig(logger)

  for (const pluginOptions of Object.values(config.options)) {
    if (pluginOptions.forPlugin) {
      setOptions(pluginOptions.forPlugin.id as OptionKey, pluginOptions.options)
    }
  }

  const errors: Error[] = []
  // group hooks without an installGroup separately so that their check()
  // method runs independently
  const hooks: Hook<unknown>[] = await Promise.all(
    Object.entries(config.hooks).map(async ([hookName, pluginId]) => {
      const plugin = await import(pluginId)
      const Hook = plugin.hooks[hookName] as HookConstructor
      return new Hook(logger, hookName)
    })
  )
  const groups = groupBy(hooks, (hook) => hook.installGroup ?? '__' + hook.id)
  for (const group of Object.values(groups)) {
    try {
      const allChecksPassed = await asyncEvery(group, (hook) => hook.check())
      if (!allChecksPassed) {
        let state = undefined
        for (const hook of group) {
          state = await hook.install(state)
        }
        if (state) {
          try {
            await group[0].commitInstall(state)
          } catch (err) {
            if (err instanceof Error) {
              errors.push(err)
            } else {
              throw err
            }
          }
        }
      }
    } catch (err) {
      if (err instanceof Error) {
        errors.push(err)
      } else {
        throw err
      }
    }
  }

  // HACK: achieve backwards compatibility with older versions of the circleci
  // plugin that required a postinstall function to run instead of the new
  // commitInstall method. remove in major update of cli.
  const usesNewCircleCIGroup = Object.keys(groups).includes('circleci')
  if (!usesNewCircleCIGroup) {
    await postInstall(logger)
  }

  if (errors.length) {
    const error = new ToolKitError('could not automatically install hooks:')
    error.details = errors.map((error) => `- ${error.message}`).join('\n')
    throw error
  }

  return config
}
