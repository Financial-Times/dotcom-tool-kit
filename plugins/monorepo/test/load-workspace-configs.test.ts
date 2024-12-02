import path from 'path'
import LoadWorkspaceConfigs from '../src/load-workspace-configs'
import winston, { Logger } from 'winston'

const logger = winston as unknown as Logger

describe('LoadWorkspaceConfigs', () => {
  it('should load multiple tool kit configs from workspace packages', async () => {
    const lwc = new LoadWorkspaceConfigs(logger)

    await expect(
      lwc.init({
        cwd: path.relative(process.cwd(), path.resolve(__dirname, './files'))
      })
    ).resolves.toBeUndefined()

    expect(LoadWorkspaceConfigs.configs).toMatchSnapshot()
  })
})
