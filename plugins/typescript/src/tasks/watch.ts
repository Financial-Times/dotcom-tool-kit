import TypeScriptTask from './typescript'

export default class TypeScriptWatch extends TypeScriptTask {
  static description = 'rebuild TypeScript project every file change'

  taskArgs = ['--watch']
}
