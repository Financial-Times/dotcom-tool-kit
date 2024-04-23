const { TaskSchemas } = require('../lib/schemas/lib/tasks')
const { HookSchemas } = require('../lib/schemas/lib/hooks')
const { PluginSchemas } = require('../lib/schemas/lib/plugins')

const { convertSchemas, formatModelsAsMarkdown } = require('zod2md')

const converted = convertSchemas([{ name: 'Babel', schema: TaskSchemas.Babel }])

console.log(
  formatModelsAsMarkdown(converted, {
    title: 'Options'
  })
)
