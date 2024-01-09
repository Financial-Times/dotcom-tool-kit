import type { z } from 'zod'
import { Hook, HookInstallation } from '@dotcom-tool-kit/base'
import type { Plugin } from '@dotcom-tool-kit/plugin'
import fs from 'fs'
import get from 'lodash/get'
import set from 'lodash/set'
import partition from 'lodash/partition'
import update from 'lodash/update'
import merge from 'lodash/merge'
import path from 'path'

import { PackageJsonSchema } from '@dotcom-tool-kit/schemas/lib/hooks/package-json'
import { Conflict, isConflict } from '@dotcom-tool-kit/conflict'

interface PackageJsonContents {
  [field: string]: PackageJsonContents | string
}

interface PackageJsonStateValue {
  commands: string[]
  trailingString?: string
  installedBy: PackageJson
}

interface PackageJsonState {
  [path: string]: PackageJsonStateValue
}

function installationsOverlap(
  installation: HookInstallation<z.output<typeof PackageJsonSchema>>,
  other: HookInstallation<z.output<typeof PackageJsonSchema>>
): boolean {
  for (const [field, object] of Object.entries(installation.options)) {
    for (const key of Object.keys(object)) {
      if (field in other.options && key in other.options[field]) {
        return true
      }
    }
  }

  return false
}

function partitionInstallations(
  installation: HookInstallation<z.output<typeof PackageJsonSchema>>,
  mergeable: HookInstallation<z.output<typeof PackageJsonSchema>>[],
  unmergeable: HookInstallation<z.output<typeof PackageJsonSchema>>[]
): [
  HookInstallation<z.output<typeof PackageJsonSchema>>[],
  HookInstallation<z.output<typeof PackageJsonSchema>>[]
] {
  const [noLongerMergeable, stillMergeable] = partition(mergeable, (other) =>
    installationsOverlap(installation, other)
  )

  const overlapsWithUnmergeable = unmergeable.some((other) => installationsOverlap(installation, other))

  if (noLongerMergeable.length > 0 || overlapsWithUnmergeable) {
    return [stillMergeable, [...unmergeable, ...noLongerMergeable, installation]]
  }

  return [[...stillMergeable, installation], unmergeable]
}

function mergeInstallationResults(
  plugin: Plugin,
  mergeable: HookInstallation<z.output<typeof PackageJsonSchema>>[],
  unmergeable: HookInstallation<z.output<typeof PackageJsonSchema>>[]
) {
  const results: (HookInstallation<z.output<typeof PackageJsonSchema>> | Conflict<HookInstallation>)[] = []

  if (mergeable.length > 0) {
    results.push({
      plugin,
      forHook: 'PackageJson',
      hookConstructor: PackageJson,
      options: merge({}, ...mergeable.map((installation) => installation.options))
    })
  }

  if (unmergeable.length > 0) {
    results.push({
      plugin,
      conflicting: unmergeable
    })
  }

  return results
}

export default class PackageJson extends Hook<typeof PackageJsonSchema, PackageJsonState> {
  private _packageJson?: PackageJsonContents

  installGroup = 'package-json'

  filepath = path.resolve(process.cwd(), 'package.json')

  static mergeChildInstallations(
    plugin: Plugin,
    childInstallations: (
      | HookInstallation<z.output<typeof PackageJsonSchema>>
      | Conflict<HookInstallation<z.output<typeof PackageJsonSchema>>>
    )[]
  ): (HookInstallation<z.output<typeof PackageJsonSchema>> | Conflict<HookInstallation>)[] {
    let mergeable: HookInstallation<z.output<typeof PackageJsonSchema>>[] = []
    let unmergeable: HookInstallation<z.output<typeof PackageJsonSchema>>[] = []

    for (const installation of childInstallations) {
      if (isConflict(installation)) {
        unmergeable.push(...installation.conflicting)
      } else {
        ;[mergeable, unmergeable] = partitionInstallations(installation, mergeable, unmergeable)
      }
    }

    return mergeInstallationResults(plugin, mergeable, unmergeable)
  }

  static overrideChildInstallations(
    plugin: Plugin,
    parentInstallation: HookInstallation<z.output<typeof PackageJsonSchema>>,
    childInstallations: (
      | HookInstallation<z.output<typeof PackageJsonSchema>>
      | Conflict<HookInstallation<z.output<typeof PackageJsonSchema>>>
    )[]
  ): (HookInstallation<z.output<typeof PackageJsonSchema>> | Conflict<HookInstallation>)[] {
    const mergeable: HookInstallation<z.output<typeof PackageJsonSchema>>[] = []
    const unmergeable: HookInstallation<z.output<typeof PackageJsonSchema>>[] = []

    for (const installation of childInstallations) {
      if (isConflict(installation)) {
        const [canHandle, cannotHandle] = partition(installation.conflicting, (other) =>
          installationsOverlap(parentInstallation, other)
        )

        mergeable.push(...canHandle)
        unmergeable.push(...cannotHandle)
      } else {
        mergeable.push(installation)
      }
    }

    mergeable.push(parentInstallation)

    return mergeInstallationResults(plugin, mergeable, unmergeable)
  }

  async getPackageJson(): Promise<PackageJsonContents> {
    if (!this._packageJson) {
      const rawPackageJson = await fs.promises.readFile(this.filepath, 'utf8')
      const packageJson = JSON.parse(rawPackageJson)
      this._packageJson = packageJson
      return packageJson
    }

    return this._packageJson
  }

  async isInstalled(): Promise<boolean> {
    const packageJson = await this.getPackageJson()

    // this instance's `options` is a nested object of expected package.json field/command mappings, e.g.
    // { "scripts": { "build": "build:local" } }. in the package.json, they'll have the same structure
    // with a `dotcom-tool-kit` CLI prefix, e.g. { "scripts": { "build": "dotcom-tool-kit build:local" } }.
    // loop through the nested options object, get the same nested key from package.json, and check that
    // field exists, and its string includes the name of the command. if any command from our options is
    // missing, the check should fail.
    for (const [field, object] of Object.entries(this.options)) {
      for (const [key, command] of Object.entries(object)) {
        const currentPackageJsonField = get(packageJson, [field, key])

        if (!currentPackageJsonField || !currentPackageJsonField.includes(command)) {
          return false
        }
      }
    }

    return true
  }

  async install(state: PackageJsonState = {}): Promise<PackageJsonState> {
    for (const [field, object] of Object.entries(this.options)) {
      for (const [key, entry] of Object.entries(object)) {
        let trailingString: string | undefined
        let commands: string[]

        if (Array.isArray(entry)) {
          commands = entry
        } else if (typeof entry === 'string') {
          commands = [entry]
        } else {
          commands = Array.isArray(entry.commands) ? entry.commands : [entry.commands]
          trailingString = entry.trailingString
        }

        update(
          state,
          [field + '.' + key],
          (hookState?: PackageJsonStateValue): PackageJsonStateValue => ({
            // prepend each command to maintain the same order as previous implementations
            commands: [...commands, ...(hookState?.commands ?? [])],
            installedBy: this,
            trailingString: trailingString
          })
        )
      }
    }

    return state
  }

  async commitInstall(state: PackageJsonState): Promise<void> {
    const packageJson = await this.getPackageJson()

    for (const [path, installation] of Object.entries(state)) {
      set(
        packageJson,
        path,
        `dotcom-tool-kit ${installation.commands.join(' ')}${
          installation.trailingString ? ' ' + installation.trailingString : ''
        }`
      )
    }

    await fs.promises.writeFile(this.filepath, JSON.stringify(packageJson, null, 2) + '\n')
  }
}
