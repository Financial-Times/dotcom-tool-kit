import * as YAML from 'yaml'
import path from 'path'
import CircleCi from '@dotcom-tool-kit/circleci/lib/circleci-config'
import { MockTelemetryClient } from '@dotcom-tool-kit/telemetry'
import winston, { Logger } from 'winston'
import { loadConfig } from 'dotcom-tool-kit/lib/config'
import { loadHookInstallations } from 'dotcom-tool-kit/lib/install'

const logger = winston as unknown as Logger

describe('circleci-deploy', () => {
  describe('config integration test', () => {
    it('should generate a .circleci/config.yml with the base config from circleci-deploy/.toolkitrc.yml', async () => {
      const config = await loadConfig(logger, { root: path.resolve(__dirname, 'files', 'configs', 'base') })
      const metrics = new MockTelemetryClient()
      const hookInstallationsPromise = loadHookInstallations(logger, metrics, config).then((validated) =>
        validated.unwrap('hooks were invalid')
      )

      await expect(hookInstallationsPromise).resolves.toEqual([expect.any(CircleCi)])

      const installation = (await hookInstallationsPromise)[0]

      expect(YAML.stringify(await installation.install())).toMatchSnapshot()
    })
  })
})
