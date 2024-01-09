import type { Logger } from 'winston'

import type { ValidConfig } from '@dotcom-tool-kit/config'
import { Init, type InitClass } from '@dotcom-tool-kit/base'
import { type Validated, reduceValidated } from '@dotcom-tool-kit/validated'

import { importEntryPoint } from './plugin/entry-point'

const loadInitEntrypoints = async (logger: Logger, config: ValidConfig): Promise<Validated<Init[]>> => {
  const initClassResults = reduceValidated(
    await Promise.all(config.inits.map((entryPoint) => importEntryPoint(Init as InitClass, entryPoint)))
  )

  return initClassResults.map((initClasses) => initClasses.map((initClass) => new initClass(logger)))
}

export async function runInit(logger: Logger, config: ValidConfig): Promise<void> {
  const initResults = await loadInitEntrypoints(logger, config)
  const inits = initResults.unwrap('plugin initialisation classes were invalid!')

  await Promise.all(inits.map(async (init) => init.init()))
}
