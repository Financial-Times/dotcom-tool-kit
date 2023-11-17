import TypeScriptTask from './typescript'

export default class TypeScriptTest extends TypeScriptTask {
  static description = 'type check TypeScript code'

  taskArgs = ['--noEmit']
}
