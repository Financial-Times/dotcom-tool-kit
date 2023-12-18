import { styles as s } from '@dotcom-tool-kit/logger'
import path from 'path'
import fs from 'fs'
import { baseSymbol, typeSymbol } from './symbols'
import { Validated, invalid, valid } from './validated'
import semver from 'semver'

const packageJsonPath = path.resolve(__dirname, '../package.json')
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
const version: string = packageJson.version

export abstract class Base {
  static version = version
  version = version

  static get [typeSymbol](): symbol {
    return baseSymbol
  }

  get [typeSymbol](): symbol {
    return baseSymbol
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static is<T extends Base>(objectToCheck: any): objectToCheck is T {
    return objectToCheck[typeSymbol] === this[typeSymbol]
  }

  static isCompatible<T extends Base>(objectToCheck: unknown): Validated<T> {
    if (!this.is(objectToCheck)) {
      return invalid([
        `${s.plugin(
          '@dotcom-tool-kit/types'
        )} type symbol is missing, make sure that this object derives from the ${s.code('Task')} or ${s.code(
          'Hook'
        )} class defined by the plugin`
      ])
    }

    // an 'objectToCheck' from a plugin is compatible with this CLI if its
    // version is semver-compatible with the @dotcom-tool-kit/types included by
    // the CLI (which is what's calling this). so, prepend ^ to our version,
    // and check our version satisfies that.

    // this lets e.g. a CLI that includes types@2.2.0 load any plugin
    // that depends on any higher minor version of types.
    const range = `^${this.version}`
    if (semver.satisfies(objectToCheck.version, range)) {
      return valid(objectToCheck as T)
    } else {
      return invalid([
        `object is from an outdated version of ${s.plugin(
          '@dotcom-tool-kit/types'
        )}, make sure you're using at least version ${s.heading(this.version)} of the plugin`
      ])
    }
  }
}
