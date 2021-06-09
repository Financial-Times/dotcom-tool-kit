/* eslint-disable no-unused-vars */

declare module '@financial-times/package-json' {
  class PackageJson {
    requireScript(options: Record<string, unknown>): void
    hasChangesToWrite(): boolean
    writeChanges(): void
    getField<T>(name: string): T
  }

  function loadPackageJson(options: Record<string, unknown>): PackageJson

  export = loadPackageJson
}
