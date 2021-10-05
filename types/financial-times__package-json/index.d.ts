declare module '@financial-times/package-json' {
  export type DependencyField =
    | 'dependencies'
    | 'devDependencies'
    | 'optionalDependencies'
    | 'peerDependencies'

  export interface IDependency {
    pkg: string
    version: string
    field: DependencyField
  }

  export interface IChangelog<E extends string> {
    event: E
    field: string
    previousValue?: string
    alreadyExisted: boolean
    meta: Record<string, unknown>
  }

  export class PackageJson {
    requireScript(options: Record<string, unknown>): IChangelog<'requireScript'>
    requireDependency(options: IDependency): IChangelog<'requireDependency'>
    removeDependency(options: Omit<IDependency, 'version'>): IChangelog<'removeDependency'>
    hasChangesToWrite(): boolean
    writeChanges(): boolean
    getField<T>(name: string): T
  }

  export default function loadPackageJson(options: Record<string, unknown>): PackageJson
}
