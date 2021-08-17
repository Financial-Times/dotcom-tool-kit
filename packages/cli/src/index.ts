import { validateConfig, config } from './config'
import { loadPluginConfig } from './plugin'

export async function load(): Promise<void> {
  // start loading config and child plugins, starting from the consumer app directory
  await loadPluginConfig({
    id: 'app root',
    root: process.cwd()
  })
}

export async function runTask(id: string, argv: string[]): Promise<void> {
  //TODO move lifecycle command to here
  const validConfig = await validateConfig(config, {
    // don't check if lifecycles are installed if we're trying to install them
    checkInstall: id !== 'install'
  })

  if (!(id in validConfig.tasks)) {
    // TODO improve error message
    throw new Error(`task "${id}" not found`)
  }

  const Task = validConfig.tasks[id]
  const task = new Task(argv)

  // attach any options from config files to the command instance
  if (Task.plugin && validConfig.options[Task.plugin.id]) {
    task.options = validConfig.options[Task.plugin.id].options
  }

  return task.run()
}
