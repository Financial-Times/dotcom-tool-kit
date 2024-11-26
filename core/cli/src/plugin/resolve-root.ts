import path from "path"
import { resolve } from "./require-resolve"
import { ToolKitError } from "@dotcom-tool-kit/error"
import { styles } from "@dotcom-tool-kit/logger"

export function resolveRoot(id: string, root: string): string {
  const isRelative = id.startsWith('./')
  // resolve the .toolkitrc.yml of a plugin as many plugins don't have valid
  // entrypoints now that we're intending their tasks/hooks to be loaded via
  // entrypoints defined in config
  const pluginPath = path.join(id, '.toolkitrc.yml')

  try {
    const resolvedPath = resolve(isRelative ? './' + pluginPath :  pluginPath, { paths: [root] })

    return path.dirname(resolvedPath)
  } catch(error) {
    if(error instanceof Error && 'code' in error && error.code === 'MODULE_NOT_FOUND') {
      const error = new ToolKitError(`Couldn't resolve plugin ${styles.plugin(id)} from directory ${styles.filepath(root)}`)
      error.details = `If this is a built-in Tool Kit plugin, check it's installed as a dependency. If it's a custom plugin, check it has a ${styles.filepath('.toolkitrc.yml')}, and that the path is the correct relative path to the plugin from the ${styles.filepath('.toolkitrc.yml')} it's being included from.`
      throw error
    }

    throw error
  }
}
