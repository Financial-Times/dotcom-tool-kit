import spawk from 'spawk'
import winston, { Logger } from 'winston'
import { ToolKitError } from '@dotcom-tool-kit/error'
import { DopplerEnvVars } from '../src/index'

const logger = winston as unknown as Logger

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

  it("should throw an error when Doppler isn't installed", async () => {
    expect.assertions(1)
    const interceptor = spawk.spawn('doppler', expectedArgs)
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any --
     * spawk type definitions are out of date
     **/
    ;(interceptor as any).spawnError('ENOENT')
    await expect(doppler.get()).rejects.toThrow(ToolKitError)
    spawk.done()
  })

  it('should throw an error when Doppler prints an error', async () => {
    expect.assertions(1)
    const interceptor = spawk.spawn('doppler', expectedArgs)
    interceptor.stderr('doppler had an issue')
    await expect(doppler.get()).rejects.toThrow(ToolKitError)
    spawk.done()
  })

  it('should throw an error when the JSON is unparseable', async () => {
    expect.assertions(1)
    const interceptor = spawk.spawn('doppler', expectedArgs)
    interceptor.stdout(JSON.stringify(testEnvironment).slice(0, 20))
    await expect(doppler.get()).rejects.toThrow(ToolKitError)
    spawk.done()
  })
})
