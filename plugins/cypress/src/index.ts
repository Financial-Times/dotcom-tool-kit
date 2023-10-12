import { PackageJsonHook } from '@dotcom-tool-kit/package-json-hook'
import { CypressLocal, CypressCi } from './tasks/cypress'

class E2ETestHook extends PackageJsonHook {
  key = 'e2e-test'
  hook = 'e2e:local'
}

export const hooks = {
  'e2e:local': E2ETestHook
}

export const tasks = { CypressLocal, CypressCi }
