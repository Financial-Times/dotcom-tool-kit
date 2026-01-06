import path from 'path'
import LoadWorkspaceConfigs from '../src/load-workspace-configs'
import winston, { Logger } from 'winston'
import { removeRoots } from '../../../core/cli/test/helpers.ts'

const logger = winston as unknown as Logger

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

    expect(removeRoots(LoadWorkspaceConfigs.configs)).toMatchSnapshot()
  })

  it('should report all config load failures as an AggregateError', async () => {
    const lwc = new LoadWorkspaceConfigs(logger)

    await expect(
      lwc.init({
        cwd: path.relative(process.cwd(), path.resolve(__dirname, './files/invalid'))
      })
    ).rejects.toMatchInlineSnapshot(`
      AggregateError "1 error loading .toolkitrc.yml in workspace packages" {
        "errors": [
          "@monorepo-plugin-tests/b → ToolKitError" "There are options in your .toolkitrc.yml that aren't what Tool Kit expected." {
            "details": "Please update the options so that they are the expected types.
       !  2 issues in @dotcom-tool-kit/serverless:
      - Required at "awsAccountId"
      - Required at "systemCode"

      You can refer to the README for the plugin for examples and descriptions of the options used.",
          },
        ],
      }
    `)
  })
})
