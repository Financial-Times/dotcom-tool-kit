import { checkInstall, loadConfig } from './config'
import { setOptions } from '@dotcom-tool-kit/options'
import { styles } from '@dotcom-tool-kit/logger'
import type { Logger } from 'winston'

export default async function showHelp(logger: Logger, hooks: string[]): Promise<void> {
  const config = await loadConfig(logger)

  if (hooks.length === 0) {
    hooks = Object.keys(config.hooks).sort()
  }

  for (const pluginOptions of Object.values(config.options)) {
    if (pluginOptions.forPlugin) {
      setOptions(pluginOptions.forPlugin.id as any, pluginOptions.options)
    }
  }

  await checkInstall(config)

  const missingHooks = hooks.filter((hook) => !config.hooks[hook])

  logger.info(`
🧰 ${styles.title(`welcome to ${styles.app('Tool Kit')}!`)}

Tool Kit is modern, maintainable & modular developer tooling for FT.com projects.

${styles.URL('https://github.com/financial-times/dotcom-tool-kit')}

${styles.ruler()}
${
  Object.keys(config.hooks).length === 0
    ? `there are no hooks available. you'll need to install plugins that define hooks to be able to run Tool Kit tasks.`
    : styles.dim(
        hooks.length === 0
          ? 'available hooks'
          : `help for ${hooks.length - missingHooks.length} ${
              hooks.length - missingHooks.length > 1 ? 'hooks' : 'hook'
            }`
      )
}:
`)

  for (const hook of hooks) {
    const Hook = config.hooks[hook]

    if (Hook) {
      const tasks = config.hookTasks[hook]
      /* eslint-disable @typescript-eslint/no-explicit-any -- Object.constructor does not consider static properties */
      logger.info(`${styles.heading(hook)}
${(Hook.constructor as any).description ? (Hook.constructor as any).description + '\n' : ''}
${
  tasks && tasks.tasks.length
    ? `runs ${tasks.tasks.length > 1 ? 'these tasks' : 'this task'}:
${tasks.tasks
  .map((task) => `- ${styles.task(task)} ${styles.dim(config.tasks[task].description)}`)
  .join('\n')}`
    : styles.dim('no tasks configured to run on this hook.')
}
${styles.ruler()}
`)
      /*eslint-enable @typescript-eslint/no-explicit-any */
    }
  }

  if (missingHooks.length) {
    logger.warn(
      `no such ${missingHooks.length > 1 ? 'hooks' : 'hook'} ${missingHooks.map(styles.hook).join(', ')}`
    )
  }
}
