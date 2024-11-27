import type { ValidConfig } from '@dotcom-tool-kit/config'
import { Init, InitClass } from '@dotcom-tool-kit/base'
import { Validated, reduceValidated } from '@dotcom-tool-kit/validated'
import type { Logger } from 'winston'
import { importEntryPoint } from './plugin/entry-point'

const loadInitEntrypoints = async (logger: Logger, config: ValidConfig): Promise<Validated<Init[]>> => {
  const initModuleResults = reduceValidated(
    await Promise.all(config.inits.map((entryPoint) => importEntryPoint(Init as InitClass, entryPoint)))
  )

  return initModuleResults.map((initModules) =>
    initModules.map((initModule) => new initModule.baseClass(logger))
  )
}

export async function runInit(logger: Logger, config: ValidConfig): Promise<void> {
  const initResults = await loadInitEntrypoints(logger, config)
  const inits = initResults.unwrap('plugin initialisation classes were invalid!')

  await Promise.all(inits.map(async (init) => init.init({
    cwd: config.root
  })))
}
