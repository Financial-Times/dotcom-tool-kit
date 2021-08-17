import path from 'path'

import type { TaskClass } from './task'
import type { LifecycleAssignment, LifecycleClass } from './lifecycle'
import type { Plugin } from './plugin'
import { Conflict, findConflicts, withoutConflicts } from './conflict'
import { ToolKitError } from '@dotcom-tool-kit/error'
import {
  formatCommandConflicts,
  formatUndefinedLifecycleAssignments,
  formatLifecycleAssignmentConflicts,
  formatLifecycleConflicts,
  formatOptionConflicts,
  formatUninstalledLifecycles
} from './messages'
import HelpCommand from './commands/help'
import LifecycleCommand from './commands/lifecycle'
import InstallCommand from './commands/install'

export interface PluginOptions {
  options: Record<string, unknown>
  plugin: Plugin
  forPlugin: Plugin
}

export interface Config {
  root: string
  findCommand(): boolean
  plugins: { [id: string]: Plugin }
  tasks: { [id: string]: TaskClass | Conflict<TaskClass> }
  lifecycleAssignments: { [id: string]: LifecycleAssignment | Conflict<LifecycleAssignment> }
  options: { [id: string]: PluginOptions | Conflict<PluginOptions> }
  lifecycles: { [id: string]: LifecycleClass | Conflict<LifecycleClass> }
}

export interface ValidConfig extends Config {
  tasks: { [id: string]: TaskClass }
  lifecycleAssignments: { [id: string]: LifecycleAssignment }
  options: { [id: string]: PluginOptions }
  lifecycles: { [id: string]: LifecycleClass }
}

const coreRoot = path.resolve(__dirname, '../')

export const config: Config = {
  root: coreRoot,
  findCommand: () => false,
  plugins: {},
  tasks: {},
  lifecycleAssignments: {},
  options: {},
  lifecycles: {}
}

async function asyncFilter<T>(items: T[], predicate: (item: T) => Promise<boolean>): Promise<T[]> {
  const results = await Promise.all(items.map(async (item) => ({ item, keep: await predicate(item) })))

  return results.filter(({ keep }) => keep).map(({ item }) => item)
}

export async function validateConfig(config: Config, { checkInstall = true } = {}): Promise<ValidConfig> {
  const lifecycleAssignmentConflicts = findConflicts(Object.values(config.lifecycleAssignments))
  const lifecycleConflicts = findConflicts(Object.values(config.lifecycles))
  const taskConflicts = findConflicts(Object.values(config.tasks))
  const optionConflicts = findConflicts(Object.values(config.options))

  let shouldThrow = false
  const error = new ToolKitError('There are problems with your Tool Kit configuration.')
  error.details = ''

  if (
    lifecycleConflicts.length > 0 ||
    lifecycleAssignmentConflicts.length > 0 ||
    taskConflicts.length > 0 ||
    optionConflicts.length > 0
  ) {
    shouldThrow = true

    if (lifecycleConflicts.length) {
      error.details += formatLifecycleConflicts(lifecycleConflicts)
    }

    if (lifecycleAssignmentConflicts.length) {
      error.details += formatLifecycleAssignmentConflicts(lifecycleAssignmentConflicts)
    }

    if (taskConflicts.length) {
      error.details += formatCommandConflicts(taskConflicts)
    }

    if (optionConflicts.length) {
      error.details += formatOptionConflicts(optionConflicts)
    }
  }

  const assignedLifecycles = withoutConflicts(Object.values(config.lifecycleAssignments))
  const definedLifecycles = withoutConflicts(Object.values(config.lifecycles))
  const definedLifecycleIds = new Set(Object.keys(config.lifecycles))
  const undefinedLifecycleAssignments = assignedLifecycles.filter(
    (lifecycle) => !definedLifecycleIds.has(lifecycle.id)
  )

  if (undefinedLifecycleAssignments.length > 0) {
    shouldThrow = true
    error.details += formatUndefinedLifecycleAssignments(
      undefinedLifecycleAssignments,
      Array.from(definedLifecycleIds)
    )
  }

  if (checkInstall) {
    const uninstalledLifecycles = await asyncFilter(definedLifecycles, async (Lifecycle) => {
      const lifecycle = new Lifecycle()
      return !(await lifecycle.check())
    })

    if (uninstalledLifecycles.length > 0) {
      shouldThrow = true
      error.details += formatUninstalledLifecycles(uninstalledLifecycles)
    }
  }

  if (shouldThrow) {
    throw error
  }

  return config as ValidConfig
}
