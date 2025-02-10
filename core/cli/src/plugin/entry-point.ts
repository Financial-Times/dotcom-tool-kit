import { styles as s } from '@dotcom-tool-kit/logger'

import type { Base } from '@dotcom-tool-kit/base'
import type { EntryPoint } from '@dotcom-tool-kit/plugin'
import { Validated, invalid, valid } from '@dotcom-tool-kit/validated'
import { __importDefault } from 'tslib'
import type * as z from 'zod'
import { indentReasons } from '../messages'

function guessIsZodSchema(schema: unknown): schema is z.ZodSchema {
  return typeof schema === 'object' && schema !== null && '_def' in schema
}

/* eslint-disable-next-line @typescript-eslint/no-explicit-any --
 * We aren't confident on the most reliable way to ensure the returned modules
 * are the correct shape right now so let's leave this as any and hope for the
 * best.
 **/
async function requireEntrypoint(entryPoint: EntryPoint): Promise<Validated<any>> {
  const resolvedPath = require.resolve(entryPoint.modulePath, { paths: [entryPoint.plugin.root] })

  if (!resolvedPath) {
    return invalid([
      `could not find entrypoint ${s.filepath(entryPoint.modulePath)} in plugin ${s.plugin(
        entryPoint.plugin.id
      )}`
    ])
  }

  let requiredModule
  try {
    requiredModule = require(resolvedPath)
  } catch (e) {
    const err = e as Error
    return invalid([
      `an error was thrown when loading entrypoint ${s.filepath(entryPoint.modulePath)} in plugin ${s.plugin(
        entryPoint.plugin.id
      )}:\n  ${s.code(indentReasons(err.toString()))}`
    ])
  }

  return valid(requiredModule)
}

export async function importSchemaEntryPoint(
  entryPoint: EntryPoint,
  exportName?: string
): Promise<Validated<z.ZodSchema>> {
  const schemaResult = await requireEntrypoint(entryPoint)
  return schemaResult.flatMap((schemaModule) => {
    const schema: unknown = exportName ? schemaModule[exportName] : __importDefault(schemaModule).default
    return guessIsZodSchema(schema)
      ? valid(schema)
      : invalid([
          `found an invalid Zod schema when loading entrypoint ${s.filepath(
            entryPoint.modulePath
          )} in plugin ${s.plugin(entryPoint.plugin.id)}`
        ])
  })
}

// the subclasses of Base have different constructor signatures so we need to omit
// the constructor from the type bound here so you can actually pass in a subclass
export async function importEntryPoint<T extends { name: string } & Omit<typeof Base, 'new'>>(
  type: T,
  entryPoint: EntryPoint
): Promise<Validated<{ baseClass: T; schema?: z.ZodSchema }>> {
  const pluginModuleResult = await requireEntrypoint(entryPoint)
  return pluginModuleResult.flatMap((pluginModule) => {
    const defaultExport: unknown = __importDefault(pluginModule).default
    const schemaExport: unknown = pluginModule.schema

    if (typeof defaultExport === 'function') {
      return type
        .isCompatible<T>(defaultExport)
        .flatMap<{ baseClass: T; schema?: z.ZodTypeAny }>((baseClass) => {
          if (schemaExport === undefined || guessIsZodSchema(schemaExport)) {
            return valid({ baseClass, schema: schemaExport })
          } else {
            return invalid([
              `found an invalid Zod schema exported as ${s.code('schema')} at the entrypoint ${s.filepath(
                pluginModule.modulePath
              )} in plugin ${s.plugin(pluginModule.plugin.id)}`
            ])
          }
        })
        .mapError((reasons) => [
          `the ${type.name.toLowerCase()} ${s.hook(
            defaultExport.name
          )} is not a compatible instance of ${s.code(type.name)}:\n  - ${reasons.join('\n  -  ')}`
        ])
    }

    return invalid([
      `entrypoint ${s.filepath(entryPoint.modulePath)} in plugin ${s.plugin(
        entryPoint.plugin.id
      )} does not export a class as its ${s.code('default')} export or ${s.code('module.exports')}`
    ])
  })
}
