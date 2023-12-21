import { HookClass, Init, InitClass, ValidConfig, Validated, reduceValidated } from '@dotcom-tool-kit/types'
import { Logger } from 'winston'
import { importEntryPoint } from './plugin/entry-point'

const loadInitEntrypoints = async (logger: Logger, config: ValidConfig): Promise<Validated<Init[]>> => {
  const initClassResults = reduceValidated(
    await Promise.all(
      config.inits.map(async (entryPoint) => {
        const hookResult = await importEntryPoint(Init, entryPoint)
        return hookResult.map((initClass) => initClass as InitClass)
      })
    )
  )

  return initClassResults.map((initClasses) => initClasses.map((initClass) => new initClass(logger)))
}

export async function runInit(logger: Logger, config: ValidConfig): Promise<void> {
  const initResults = await loadInitEntrypoints(logger, config)
  const inits = initResults.unwrap('plugin initialisation classes were invalid!')

  await Promise.all(inits.map(async (init) => init.init()))
}
