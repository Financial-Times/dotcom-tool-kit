import * as fs from 'fs'
import * as path from 'path'
import { mocked } from 'ts-jest/utils'
import HerokuInstall from '../../../src/commands/heroku/install'

jest.mock('fs')
const mockedFS = mocked(fs)
const fsp = jest.requireActual('fs').promises

const testDir = path.resolve(__dirname, '../../files')

describe('heroku-postbuild install', () => {
  it('should write script when missing', async () => {
    const packageJSON = await fsp.readFile(testDir + '/test-no-scripts-package.json')
    mockedFS.readFileSync.mockReturnValue(packageJSON)

    const command = new HerokuInstall([], {} as any)
    await command.run()

    expect(mockedFS.writeFileSync).toHaveBeenCalled()
  })

  it('should not touch file when script already installed', async () => {
    const packageJSON = await fsp.readFile(testDir + '/test-package.json')
    mockedFS.readFileSync.mockReturnValue(packageJSON)

    const command = new HerokuInstall([], {} as any)
    await command.run()

    expect(mockedFS.writeFileSync).not.toHaveBeenCalled()
  })

  it('should return an error on bad file', async () => {
    const packageJSON = await fsp.readFile(testDir + '/bad-package.json')
    mockedFS.readFileSync.mockReturnValue(packageJSON)

    const command = new HerokuInstall([], {} as any)

    expect.assertions(1)
    try {
      await command.run()
    } catch (e) {
      expect(e).toBeTruthy()
    }
  })
})
