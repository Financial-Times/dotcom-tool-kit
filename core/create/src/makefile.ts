import { rootLogger as winstonLogger, styles } from '@dotcom-tool-kit/logger'
import parseMakefileRules from '@quarterto/parse-makefile-rules'
import { promises as fs } from 'fs'
import partition from 'lodash/partition'
import path from 'path'

export default async (): Promise<void> => {
  // Handle case-sensitive file systems
  let makefile
  try {
    makefile = await fs.readFile(path.join(process.cwd(), 'makefile'), 'utf8')
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code !== 'ENOENT') {
      throw err
    }
  }
  try {
    makefile = await fs.readFile(path.join(process.cwd(), 'Makefile'), 'utf8')
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code !== 'ENOENT') {
      throw err
    }
  }
  if (makefile) {
    const rules = parseMakefileRules(makefile)
    const targets = Object.keys(rules)
    winstonLogger.info(`${styles.ruler()}\n`)
    winstonLogger.info(
      'We recommend deleting your old Makefile as it will no longer be used. In the ' +
        "future you can run tasks with 'npm run' instead. Make sure that you won't be " +
        "deleting any task logic that hasn't already been migrated to Tool Kit. If you " +
        "find anything that can't be handled by Tool Kit then please let the Platforms " +
        'team know.'
    )

    const equivalentHooks: Record<string, string> = {
      'unit-test': 'test:*',
      test: 'test:local',
      build: 'build:local'
    }

    const mappedSuggestions = targets
      .filter((target) => target !== 'node_modules/@financial-times/n-gage/index.mk' && target !== '.PHONY')
      .map((target) => [target, equivalentHooks[target]])
    // split the targets into ones we have suggestions for and ones we don't
    const [suggested, unrecognised] = partition(mappedSuggestions, 1)
    const suggestionsFound = suggested.length > 0

    if (suggestionsFound) {
      winstonLogger.info("\nWe've found some targets in your Makefile which could be migrated to Tool Kit:")
      for (const [target, suggestion] of suggested) {
        if (suggestion) {
          winstonLogger.info(
            `- Your ${styles.makeTarget(target)} target is likely handled by the ${styles.hook(
              suggestion
            )} hook in Tool Kit`
          )
        }
      }
    }

    if (unrecognised.length > 0) {
      winstonLogger.info(
        `\nWe don't know if these${
          suggestionsFound ? ' other' : ''
        } Makefile targets can be migrated to Tool Kit. Please check what they're doing:`
      )
      for (const [target] of unrecognised) {
        winstonLogger.info(`- ${styles.makeTarget(target)}`)
      }
    }
  }
}
