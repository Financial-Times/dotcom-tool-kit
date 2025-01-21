import { CIState } from '@dotcom-tool-kit/state'
import { join as joinPath } from 'node:path'
import { randomInt } from 'node:crypto'

export function buildImageName({ registry, name }: { registry: string; name: string }) {
  return joinPath(registry, name)
}

// See https://docs.docker.com/reference/cli/docker/image/tag/#description
// We're just doing some basic sanitization now to avoid git tags causing issues.
// If the tag isn't valid then Docker will error so it's not high risk
function sanitizeDockerTag(tag: string): string {
  return tag.replace(/[^a-z0-9\._-]+/gi, '')
}

interface ImageTags {
  deploy: string
  gitCommit?: string
  gitTag?: string
  gitBranch?: string
}

function generateImageTags(ciState: CIState | null): ImageTags {
  const tags: ImageTags = {
    deploy: getDeployTag(ciState)
  }

  if (ciState?.version) {
    tags.gitCommit = `git-${ciState.version.slice(0, 7)}`
  }

  if (ciState?.tag) {
    tags.gitTag = `release-${ciState.tag}`
  }

  if (ciState?.branch) {
    tags.gitBranch = `branch-${ciState.branch}`
  }

  return tags
}

export function getDeployTag(ciState: CIState | null): string {
  return ciState?.buildNumber
    ? `ci-${ciState.buildNumber}`
    : `local-${process.env.USER || 'unknown'}-${randomInt(1000, 9999)}`
}

export function getImageTagsFromEnvironment({
  ciState,
  registry,
  name
}: {
  ciState: CIState | null
  registry: string
  name: string
}): string[] {
  const imageName = buildImageName({ registry, name })
  const tags = Object.values(generateImageTags(ciState))
  return tags.map((tag) => `${imageName}:${sanitizeDockerTag(tag)}`)
}
