import spawk from 'spawk'
import winston, { Logger } from 'winston'
import { VaultEnvVars } from '@dotcom-tool-kit/vault'
import { DopplerEnvVars } from '../src/index.js'

const logger = (winston as unknown) as Logger

jest.mock('@dotcom-tool-kit/vault')
const mockedVaultEnvVars = jest.mocked(VaultEnvVars)
spawk.preventUnmatched()

const environment = 'dev'
const project = 'test-project'
const doppler = new DopplerEnvVars(logger, environment, {
  project
})
const testEnvironment = {
  DOPPLER_MOCK: true,
  FAVOURITE_NUM: 137
}
const expectedArgs = ['secrets', 'download', '--no-file', '--project', project, '--config', environment]

describe(`Doppler CLI invocations`, () => {
  it('should set environment variables downloaded from the CLI', async () => {
    const interceptor = spawk.spawn('doppler', expectedArgs)
    interceptor.stdout(JSON.stringify(testEnvironment))
    const env = await doppler.get()
    expect(env).toEqual(testEnvironment)
    spawk.done()
  })

  it("should fall back to Vault when Doppler isn't installed", async () => {
    const interceptor = spawk.spawn('doppler', expectedArgs)
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any --
     * spawk type definitions are out of date
     **/
    ;(interceptor as any).spawnError('ENOENT')
    const env = await doppler.get()
    expect(env).toBeUndefined()
    expect(mockedVaultEnvVars.mock.instances[0].get).toHaveBeenCalled()
    spawk.done()
  })

  it('should fall back to Vault when Doppler prints an error', async () => {
    const interceptor = spawk.spawn('doppler', expectedArgs)
    interceptor.stderr('doppler had an issue')
    const env = await doppler.get()
    expect(env).toBeUndefined()
    expect(mockedVaultEnvVars.mock.instances[0].get).toHaveBeenCalled()
    spawk.done()
  })

  it('should fall back to Vault when the JSON is unparseable', async () => {
    const interceptor = spawk.spawn('doppler', expectedArgs)
    interceptor.stdout(JSON.stringify(testEnvironment).slice(0, 20))
    const env = await doppler.get()
    expect(env).toBeUndefined()
    expect(mockedVaultEnvVars.mock.instances[0].get).toHaveBeenCalled()
    spawk.done()
  })
})
