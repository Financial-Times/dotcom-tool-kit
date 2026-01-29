import { CIState } from '@dotcom-tool-kit/state'
import { join as joinPath } from 'node:path'
import { randomInt } from 'node:crypto'

export function buildImageName({ registry, name }: { registry: string; name: string }) {
  return joinPath(registry, name)
}

interface ImageLabels {
  'org.opencontainers.image.created': string
  'org.opencontainers.image.vendor': string
  'org.opencontainers.image.source': string | undefined
  'org.opencontainers.image.revision': string | undefined
  'org.opencontainers.image.version': string | undefined
  'com.ft.system.code': string
  'com.ft.build.url': string | undefined
  'com.ft.source.branch': string | undefined
}

export function generateImageLabels(systemCode: string): ImageLabels {
  return {
    'org.opencontainers.image.created': new Date().toISOString(),
    'org.opencontainers.image.vendor': 'Financial Times',
    'org.opencontainers.image.source': process.env.CIRCLE_REPOSITORY_URL,
    'org.opencontainers.image.revision': process.env.CIRCLE_SHA1
      ? process.env.CIRCLE_SHA1.slice(0, 7)
      : undefined,
    'org.opencontainers.image.version': process.env.CIRCLE_TAG,
    'com.ft.system.code': systemCode,
    'com.ft.build.url': process.env.CIRCLE_BUILD_URL,
    'com.ft.source.branch': process.env.CIRCLE_BRANCH
  }
}

export function getDeployTag(ciState: CIState | null): string {
  return ciState?.buildNumber
    ? `ci-${ciState.buildNumber}`
    : `local-${process.env.USER || 'unknown'}-${randomInt(1000, 9999)}`
}
