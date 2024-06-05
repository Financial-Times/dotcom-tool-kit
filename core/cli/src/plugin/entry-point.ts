import { styles as s } from '@dotcom-tool-kit/logger'

import type { Base } from '@dotcom-tool-kit/base'
import type { EntryPoint } from '@dotcom-tool-kit/plugin'
import { Validated, invalid } from '@dotcom-tool-kit/validated'
import isObjectLike from 'lodash/isObjectLike.js'
import { pathToFileURL } from 'url'
import { indentReasons } from '../messages.js'

const isObjectLikeGuard = (value: unknown): value is Record<string, unknown> => isObjectLike(value)

// the subclasses of Base have different constructor signatures so we need to omit
// the constructor from the type bound here so you can actually pass in a subclass
export async function importEntryPoint<T extends { name: string } & Omit<typeof Base, 'new'>>(
  type: T,
  entryPoint: EntryPoint
): Promise<Validated<T>> {
  const resolvedPath = import.meta.resolve(entryPoint.modulePath, pathToFileURL(entryPoint.plugin.root + '/'))

  if (!resolvedPath) {
    return invalid([
      `could not find entrypoint ${s.filepath(entryPoint.modulePath)} in plugin ${s.plugin(
        entryPoint.plugin.id
      )}`
    ])
  }

  let pluginModule: unknown
  try {
    pluginModule = await import(resolvedPath)
  } catch (e) {
    const err = e as Error
    return invalid([
      `an error was thrown when loading entrypoint ${s.filepath(entryPoint.modulePath)} in plugin ${s.plugin(
        entryPoint.plugin.id
      )}:\n  ${s.code(indentReasons(err.toString()))}`
    ])
  }

  if (
    isObjectLikeGuard(pluginModule) &&
    'default' in pluginModule &&
    typeof pluginModule.default === 'function'
  ) {
    const name = pluginModule.default.name

    return type
      .isCompatible<T>(pluginModule.default)
      .mapError((reasons) => [
        `the ${type.name.toLowerCase()} ${s.hook(name)} is not a compatible instance of ${s.code(
          type.name
        )}:\n  - ${reasons.join('\n  - ')}`
      ])
  } else {
    return invalid([
      `entrypoint ${s.filepath(entryPoint.modulePath)} in plugin ${s.plugin(
        entryPoint.plugin.id
      )} does not have a ${s.code('default')} export`
    ])
  }
}
