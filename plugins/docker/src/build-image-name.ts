import { join as joinPath } from 'node:path'

export function buildImageName({ registry, name }: { registry: string; name: string }) {
  const tag = process.env.CIRCLE_BUILD_NUM || `local-${process.env.USER || 'unknown'}`
  return joinPath(registry, `${name}:${tag}`)
}
