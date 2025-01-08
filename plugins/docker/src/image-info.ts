import { join as joinPath } from 'node:path'

export function buildImageName({ registry, name }: { registry: string; name: string }) {
  return joinPath(registry, name)
}

// See https://docs.docker.com/reference/cli/docker/image/tag/#description
// We're just doing some basic sanitization now to avoid git tags causing issues.
// If the tag isn't valid then Docker will error so it's not high risk
function sanitizeDockerTag(tag: string): string {
  return tag.replace(/[^a-z0-9\._-]+/i, '')
}

export function getImageTagsFromEnvironment({
  registry,
  name
}: {
  registry: string
  name: string
}): string[] {
  const tags = []

  const gitCommit = process.env.CIRCLE_SHA1
  if (gitCommit) {
    tags.push(`git-${gitCommit.slice(0, 7)}`)
  }

  const gitTag = process.env.CIRCLE_TAG
  if (gitTag) {
    tags.push(`git-${gitTag}`)
  }

  const buildNumber = process.env.CIRCLE_BUILD_NUM
  if (buildNumber) {
    tags.push(`ci-${buildNumber}`)
  } else {
    tags.push(`local-${process.env.USER || 'unknown'}`)
  }

  const imageName = buildImageName({ registry, name })
  return tags.map((tag) => `${imageName}:${sanitizeDockerTag(tag)}`)
}
