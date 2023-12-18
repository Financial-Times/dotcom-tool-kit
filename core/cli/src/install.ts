import { ToolKitError } from '@dotcom-tool-kit/error'
import { OptionKey, setOptions } from '@dotcom-tool-kit/options'
import groupBy from 'lodash/groupBy'
import type { Logger } from 'winston'
import { loadConfig, loadHookInstallations, updateHashes, ValidConfig } from './config'
import { unwrapValidated } from '@dotcom-tool-kit/types'

// implementation of the Array.some method that supports asynchronous predicates
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
  // group hooks without an installGroup separately so that their check()
  // method runs independently
  const hooks = unwrapValidated(await loadHookInstallations(logger, config), 'hooks are invalid')

  const groups = groupBy(hooks, (hook) => hook.installGroup ?? '__' + hook.id)

  for (const group of Object.values(groups)) {
    try {
      if (await asyncSome(group, async (hook) => !(await hook.check()))) {
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

  if (errors.length) {
    const error = new ToolKitError('could not automatically install hooks:')
    error.details = errors.map((error) => `- ${error.message}`).join('\n')
    throw error
  }

  await updateHashes()

  return config
}
