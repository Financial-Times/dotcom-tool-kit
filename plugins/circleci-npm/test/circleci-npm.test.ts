import * as YAML from 'yaml'
import path from 'path'
import CircleCi from '@dotcom-tool-kit/circleci/lib/circleci-config'
import winston, { Logger } from 'winston'
import { loadConfig } from 'dotcom-tool-kit/lib/config'
import { loadHookInstallations } from 'dotcom-tool-kit/lib/install'

const logger = winston as unknown as Logger

describe('circleci-npm', () => {
  describe('config integration test', () => {
    it('should generate a .circleci/config.yml with the base config from circleci-npm/.toolkitrc.yml', async () => {
      const config = await loadConfig(logger, { root: path.resolve(__dirname, '..') })
      const hookInstallationsPromise = loadHookInstallations(logger, config).then((validated) =>
        validated.unwrap('hooks were invalid')
      )

      await expect(hookInstallationsPromise).resolves.toEqual([expect.any(CircleCi)])

      const installation = (await hookInstallationsPromise)[0]

      expect(YAML.stringify(await installation.install())).toMatchSnapshot()
    })
  })
})
