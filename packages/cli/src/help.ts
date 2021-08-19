import { loadConfig } from './config'
import { styles } from './messages'

export default async function showHelp(hooks: string[]): Promise<void> {
  const config = await loadConfig({ checkInstall: false })

  if (hooks.length === 0) {
    hooks = Object.keys(config.hooks).sort()
  }

  const missingHooks = hooks.filter((hook) => !config.hooks[hook])

  console.log(`
🧰 ${styles.title(`welcome to ${styles.app('Tool Kit')}!`)}

Tool Kit is modern, maintainable & modular developer tooling for FT.com projects.

${styles.URL('https://github.com/financial-times/dotcom-tool-kit')}

${styles.ruler()}
${styles.dim(
  hooks.length === 0
    ? 'available hooks'
    : `help for ${hooks.length - missingHooks.length} ${
        hooks.length - missingHooks.length > 1 ? 'hooks' : 'hook'
      }`
)}:
`)

  for (const hook of hooks) {
    const Hook = config.hooks[hook]

    if (Hook) {
      const tasks = config.hookTasks[hook]
      console.log(`${styles.heading(hook)}
${Hook.description ? Hook.description + '\n' : ''}
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
    }
  }

  if (missingHooks.length) {
    console.warn(
      styles.warning(
        `no such ${missingHooks.length > 1 ? 'hooks' : 'hook'} ${missingHooks.map(styles.hook).join(', ')}`
      )
    )
  }
}
