import path from "path"
import { resolve } from "./require-resolve"

export function resolveRoot(id: string, root: string): string {
  const isRelative = id.startsWith('./')
  // resolve the .toolkitrc.yml of a plugin as many plugins don't have valid
  // entrypoints now that we're intending their tasks/hooks to be loaded via
  // entrypoints defined in config
  const pluginPath = path.join(id, '.toolkitrc.yml')
  const resolvedPath = resolve(isRelative ? './' + pluginPath :  pluginPath, { paths: [root] })

  return path.dirname(resolvedPath)
}
