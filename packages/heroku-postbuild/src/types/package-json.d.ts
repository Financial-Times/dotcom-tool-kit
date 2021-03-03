declare module '@financial-times/package-json' {
   class PackageJson {
      requireScript(options: Object): void
      hasChangesToWrite(): boolean
      writeChanges(): void
      getField<T>(name: string): T
   }

   function loadPackageJson(options: Object): PackageJson

   export = loadPackageJson
}
