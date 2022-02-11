import { ToolKitError } from '@dotcom-tool-kit/error/src'
import { Task } from '@dotcom-tool-kit/types'
const pacote = require('pacote')
const { readState } = require('@dotcom-tool-kit/state')
const pack = require('libnpmpack')
const { publish } = require('libnpmpublish')

export default class NpmPrune extends Task {
  static description = ''

  async run(): Promise<void> {
    // TODO logging
    const packagePath = process.cwd()
    const manifest = await pacote.manifest(packagePath)

    const { tag } = readState('ci')
    // TODO check it's valid semver; better error message
    if (!tag) {
        throw new ToolKitError('no version tag found in Tool Kit ci state')
    }

    // TODO better error message
    if (!process.env.NPM_AUTH_TOKEN) {
        throw new ToolKitError('no NPM_AUTH_TOKEN environment variable')
    }

    // overwrite version from the package.json with the version from e.g. the git tag
    manifest.version = tag.replace(/^v/, '')

    const tarball = await pack(packagePath)

    await publish(manifest, tarball, {
        access: 'public',
        forceAuth: {
            token: process.env.NPM_AUTH_TOKEN
        }
    })
  }
}
