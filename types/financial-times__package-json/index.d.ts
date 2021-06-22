declare module '@financial-times/package-json' {
  export class PackageJson {
    requireScript(options: Record<string, unknown>): void
    hasChangesToWrite(): boolean
    writeChanges(): void
    getField<T>(name: string): T
  }

  export default function loadPackageJson(options: Record<string, unknown>): PackageJson
}
