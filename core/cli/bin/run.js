#!/usr/bin/env node

import minimist from 'minimist'
const argv = minimist(process.argv.slice(2), {
  boolean: ['help', 'install', 'listPlugins'],
  '--': true
})

import { rootLogger, styles } from '@dotcom-tool-kit/logger'
import { installHooks, listPlugins, printConfig, showHelp, runTasks } from '../lib/index.js'

try {
  if (argv.install) {
    await installHooks(rootLogger)
  } else if (argv.listPlugins) {
    await listPlugins(rootLogger)
  } else if (argv.printConfig) {
    await printConfig(rootLogger)
  } else if (argv.help || argv._.length === 0) {
    await showHelp(rootLogger, argv._)
  } else {
    if (argv['--'].length > 0) {
      // The `--` in a command such as `dotcom-tool-kit test:staged --`
      // delineates between hooks and file patterns. For example, when the
      // lint-staged task is run it will identify the files that are staged
      // and match its glob patterns and append them to the command, so that
      // the command becomes something like `dotcom-tool-kit test:staged --
      // index.js`. When this command is executed it runs the configured task
      // where the file path arguments would then be extracted.
      await runTasks(rootLogger, argv._, argv['--'])
    } else {
      await runTasks(rootLogger, argv._)
    }
  }
} catch (error) {
  if (error.details) {
    rootLogger.error('', { skipformat: true })
    rootLogger.error(error.message)
    rootLogger.error(styles.ruler() + '\n', { skipformat: true })
    rootLogger.error(error.details, { skipformat: true })
  } else {
    rootLogger.error(error.stack)
  }

  process.exitCode = error.exitCode || 1
}
