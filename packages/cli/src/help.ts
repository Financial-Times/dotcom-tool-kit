import { isConflict } from './conflict'
import { Task } from '@dotcom-tool-kit/task'
import { loadConfig } from './config'

export default async function showHelp() {
  const config = await loadConfig({ checkInstall: false })

  // TODO print lifecycles; single-task help

  for (const [id, task] of Object.entries(config.tasks)) {
    if (task.hidden) continue
    console.log(`${id}\t${task.description}`)
  }
}
