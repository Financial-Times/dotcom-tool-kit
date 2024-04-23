const { loadToolKitRC } = require('../core/cli/lib/rc-file')
const { TaskSchemas } = require('../lib/schemas/lib/tasks')
const { HookSchemas } = require('../lib/schemas/lib/hooks')
const { PluginSchemas } = require('../lib/schemas/lib/plugins')
const { default: $t } = require('endent')
const logger = require('winston')

const { convertSchemas, formatModelsAsMarkdown } = require('zod2md')
const path = require('path')

function formatSchemas(title, schemas) {
  const converted = convertSchemas(schemas)
  return formatModelsAsMarkdown(converted, { title })
}

function formatPluginSchemas({ plugin, hooks, tasks }) {
  const tasksWithSchemas = tasks.filter((task) => TaskSchemas[task])
  const hooksWithSchemas = hooks.filter((hook) => HookSchemas[hook])
  return $t`
    ${
      PluginSchemas[plugin]
        ? formatSchemas(plugin, [
            {
              name: ' ',
              schema: PluginSchemas[plugin]
            }
          ])
        : ''
    }
    ${
      tasksWithSchemas.length
        ? formatSchemas(
            'Tasks',
            tasksWithSchemas.map((task) => ({
              name: task,
              schema: TaskSchemas[task]
            }))
          )
        : ''
    }
    ${
      hooksWithSchemas.length
        ? formatSchemas(
            'Hooks',
            hooksWithSchemas.map((hook) => ({
              name: hook,
              schema: HookSchemas[hook]
            }))
          )
        : ''
    }
	`
}

async function getPluginSchemas(plugin) {
  const rcFile = await loadToolKitRC(logger, path.join('plugins', plugin), false)
  return {
    plugin: `@dotcom-tool-kit/${plugin}`,
    hooks: Object.keys(rcFile.installs),
    tasks: Object.keys(rcFile.tasks)
  }
}

getPluginSchemas('heroku').then(formatPluginSchemas).then(console.log, console.error)
