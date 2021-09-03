declare module '@financial-times/package-json' {
  interface IDependency {
    pkg: string
    version: string
    field?: string
  }

  interface IChangelog<E extends string> {
    event: E
    field: string
    previousValue?: string
    alreadyExisted: boolean
    meta: Record<string, unknown>
  }

  export class PackageJson {
    requireScript(options: Record<string, unknown>): IChangelog<'requireScript'>
    requireDependency(options: IDependency): IChangelog<'requireDependency'>
    hasChangesToWrite(): boolean
    writeChanges(): boolean
    getField<T>(name: string): T
  }

  export default function loadPackageJson(options: Record<string, unknown>): PackageJson
}
