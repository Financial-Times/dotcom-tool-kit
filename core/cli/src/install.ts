import { ToolKitError } from '@dotcom-tool-kit/error'
import { OptionKey, setOptions } from '@dotcom-tool-kit/options'
import groupBy from 'lodash/groupBy'
import type { Logger } from 'winston'
import { loadConfig, ValidConfig } from './config'
import { postInstall } from './postInstall'

async function asyncSome<T>(arr: T[], pred: (x: T) => Promise<boolean>): Promise<boolean> {
  for (const val of arr) {
    if (await pred(val)) {
      return true
    }
  }
  return false
}

export default async function installHooks(logger: Logger): Promise<ValidConfig> {
  const config = await loadConfig(logger)

  for (const pluginOptions of Object.values(config.options)) {
    if (pluginOptions.forPlugin) {
      setOptions(pluginOptions.forPlugin.id as OptionKey, pluginOptions.options)
    }
  }

  const errors: Error[] = []
  // HACK: achieve backwards compatibility with older versions of the circleci
  // plugin that required a postinstall function to run instead of the new
  // commitInstall method. remove in major update of cli.
  let usesNewCircleCIGroup = false
  // group hooks without an installGroup separately so that their check()
  // method runs independently
  const groups = groupBy(config.hooks, (hook) => hook.installGroup ?? '__' + hook.id)
  for (const [groupId, group] of Object.entries(groups)) {
    try {
      if (await asyncSome(group, async (hook) => !(await hook.check()))) {
        let state = undefined
        for (const hook of group) {
          state = await hook.install(state)
        }
        if (state) {
          if (groupId === 'circleci') {
            usesNewCircleCIGroup = true
          }
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
