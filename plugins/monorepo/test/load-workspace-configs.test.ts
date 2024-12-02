import path from 'path'
import LoadWorkspaceConfigs from '../src/load-workspace-configs'
import winston, { Logger } from 'winston'

const logger = winston as unknown as Logger

expect.addSnapshotSerializer({
  test(value) {
    return value instanceof Error && value.name === 'AggregateError'
  },

  serialize(val, config, indentation, depth, refs, printer) {
    return `AggregateError ${printer(val.message, config, indentation, depth, refs)} ${printer(
      { errors: val.errors },
      config,
      indentation,
      depth,
      refs
    )}`
  }
})

expect.addSnapshotSerializer({
  test(value) {
    return value instanceof Error && value.constructor.name === 'ToolKitError'
  },

  serialize(val, config, indentation, depth, refs, printer) {
    return `${val.name} ${printer(val.message, config, indentation, depth, refs)} ${printer(
      { details: val.details },
      config,
      indentation,
      depth,
      refs
    )}`
  }
})

describe('LoadWorkspaceConfigs', () => {
  beforeEach(() => {
    // clear the singleton before each test
    LoadWorkspaceConfigs['configs'] = []
  })

  it('should load multiple tool kit configs from workspace packages', async () => {
    const lwc = new LoadWorkspaceConfigs(logger)

    await expect(
      lwc.init({
        cwd: path.relative(process.cwd(), path.resolve(__dirname, './files/successful'))
      })
    ).resolves.toBeUndefined()

    expect(LoadWorkspaceConfigs.configs).toMatchSnapshot()
  })

  it('should report all config load failures as an AggregateError', async () => {
    const lwc = new LoadWorkspaceConfigs(logger)

    await expect(
      lwc.init({
        cwd: path.relative(process.cwd(), path.resolve(__dirname, './files/invalid'))
      })
    ).rejects.toMatchInlineSnapshot(`
      AggregateError "2 errors loading [3m.toolkitrc.yml[23m in workspace packages" {
        "errors": [
          [36m@monorepo-plugin-tests/b[39m → ToolKitError "There are options in your [3m.toolkitrc.yml[23m that aren't what Tool Kit expected." {
            "details": "Please update the options so that they are the expected types.
      [43m[30m ! [39m[49m 2 issues in [36m[36m@dotcom-tool-kit/serverless[39m[36m[39m:
      - Required at "awsAccountId"
      - Required at "systemCode"

      You can refer to the README for the plugin for examples and descriptions of the options used.",
          },
          [36m@monorepo-plugin-tests/c[39m → ToolKitError "There are options in your [3m.toolkitrc.yml[23m that aren't what Tool Kit expected." {
            "details": "Please update the options so that they are the expected types.
      [43m[30m ! [39m[49m 1 issue in [36m[36m@dotcom-tool-kit/heroku[39m[36m[39m:
      - Required at "pipeline"

      You can refer to the README for the plugin for examples and descriptions of the options used.",
          },
        ],
      }
    `)
  })
})
