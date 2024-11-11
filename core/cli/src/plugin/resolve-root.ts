import path from "path"

export function resolveRoot(id: string, root: string): string {
  const isPath = id.startsWith('.') || id.startsWith('/')
  // resolve the package.json of a plugin as many plugins don't have valid
  // entrypoints now that we're intending their tasks/hooks to be loaded via
  // entrypoints defined in config
  const modulePath = isPath ? id : path.join(id, 'package.json')
  const resolvedPath = require.resolve(modulePath, { paths: [root] })
  return path.dirname(resolvedPath)
}
