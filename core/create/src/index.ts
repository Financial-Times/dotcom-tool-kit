import * as ToolkitErrorModule from '@dotcom-tool-kit/error'
import { rootLogger as winstonLogger, styles } from '@dotcom-tool-kit/logger'
import type { RCFile } from '@dotcom-tool-kit/plugin'
import { exec as _exec } from 'child_process'
import type { loadConfig as loadConfigType } from 'dotcom-tool-kit/lib/config'
import fs, { promises as fsp } from 'fs'
import importCwd from 'import-cwd'
import Logger from 'komatsu'
import pacote from 'pacote'
import path from 'path'
import type { PackageJson } from 'type-fest'
import { promisify } from 'util'
import YAML from 'yaml'
import { catchToolKitErrorsInLogger, hasToolKitConflicts } from './logger'
import makefileHint from './makefile'
import confirmationPrompt from './prompts/confirmation'
import conflictsPrompt, { installHooks } from './prompts/conflicts'
import mainPrompt from './prompts/main'
import oidcInfrastructurePrompt from './prompts/oidc'
import optionsPrompt from './prompts/options'
import scheduledPipelinePrompt from './prompts/scheduledPipeline'
import systemCodePrompt from './prompts/systemCode'

const exec = promisify(_exec)

const packagesToInstall = ['dotcom-tool-kit']
const packagesToRemove: string[] = []

const packageJson: PackageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'))
const configPath = path.join(process.cwd(), '.toolkitrc.yml')
const circleConfigPath = path.resolve(process.cwd(), '.circleci/config.yml')
const eslintConfigPath = path.join(process.cwd(), '.eslintrc.js')

const logger = new Logger()

function getEslintConfigContent(): string {
  const shouldIgnorePatterns = packagesToInstall.includes('@dotcom-tool-kit/frontend-app')
  const eslintContentString = `module.exports = {
  extends: ['@financial-times/eslint-config-next'], ${
    shouldIgnorePatterns ? `\n\tignorePatterns: ['public/**'],` : ''
  }
};`
  return eslintContentString
}

async function executeMigration(
  deleteConfig: boolean,
  addEslintConfig: boolean,
  fixGitignore: boolean,
  configFile: string
): Promise<void> {
  for (const pkg of packagesToInstall) {
    const { version } = await pacote.manifest(pkg)
    packageJson.devDependencies ??= {}
    packageJson.devDependencies[pkg] = `^${version}`
  }
  for (const pkg of packagesToRemove) {
    delete packageJson.devDependencies?.[pkg]
  }

  fsp.writeFile('package.json', JSON.stringify(packageJson, undefined, 2))

  await logger.logPromise(exec('npm install'), 'installing dependencies')
  const configPromise = logger.logPromise(
    fsp.writeFile(configPath, configFile),
    `creating ${styles.filepath('.toolkitrc.yml')}`
  )

  const eslintConfigPromise = addEslintConfig
    ? logger.logPromise(
        fsp.writeFile(eslintConfigPath, getEslintConfigContent()),
        `creating ${styles.filepath('.eslintrc.js')}`
      )
    : Promise.resolve()

  const gitignorePath = '.gitignore'
  // wrap this step in an async closure so that we can execute multiple
  // statements and pass it to komatsu to log as one pending task
  const fixGitignoreAsync = async () => {
    const stateIgnore = '/.toolkitstate\n'
    let fixed
    try {
      const gitignore = await fsp.readFile(gitignorePath, 'utf8')
      fixed = gitignore.replace(/^\/?\.eslintrc\.js\n?/m, '')
      if (!fixed.includes('.toolkitstate')) {
        fixed = fixed.trimEnd() + `\n${stateIgnore}`
      }
    } catch {
      fixed = stateIgnore
    }
    await fsp.writeFile(gitignorePath, fixed)
  }

  const ignorePromise = fixGitignore
    ? logger.logPromise(fixGitignoreAsync(), 'fixing gitignore')
    : Promise.resolve()
  const unlinkPromise = deleteConfig
    ? logger.logPromise(fsp.unlink(circleConfigPath), 'removing old CircleCI config')
    : Promise.resolve()

  await Promise.all([configPromise, eslintConfigPromise, unlinkPromise, ignorePromise])
}

async function main() {
  const toolKitConfig: RCFile = {
    plugins: [],
    installs: {},
    tasks: {},
    commands: {},
    options: { plugins: {}, tasks: {}, hooks: [] },
    init: []
  }

  const originalCircleConfig = await fsp.readFile(circleConfigPath, 'utf8').catch(() => undefined)
  const bizOpsSystem = await systemCodePrompt({ packageJson })
  // Start with the initial prompt which will get most of the information we
  // need for the remainder of the execution
  const { preset, additional, addEslintConfig, deleteConfig, fixGitignore, uninstall } = await mainPrompt({
    bizOpsSystem,
    packageJson,
    originalCircleConfig,
    eslintConfigPath
  })

  const selectedPackages = [preset, ...additional].map((plugin) => `@dotcom-tool-kit/${plugin}`)
  if (addEslintConfig) {
    packagesToInstall.push('@financial-times/eslint-config-next')
  }
  packagesToInstall.push(...selectedPackages)
  toolKitConfig.plugins.push(...selectedPackages)

  if (uninstall) {
    packagesToRemove.push('@financial-times/n-gage', '@financial-times/n-heroku-tools')
  }

  // Confirm that the proposed changes are what the user was expecting, giving
  // them a chance to see what we're going to do.
  const configFile = YAML.stringify(toolKitConfig)
  const { confirm } = await confirmationPrompt({
    deleteConfig,
    addEslintConfig,
    fixGitignore,
    packagesToInstall,
    packagesToRemove,
    configFile
  })

  if (!confirm) {
    return
  }
  // Carry out the proposed changes: install + uninstall packages, add config
  // files, etc.
  await executeMigration(deleteConfig, addEslintConfig, fixGitignore, configFile)
  // Use user's version of Tool Kit that we've just installed for them to load
  // the config to avoid any incompatibilities with a version that create might
  // use
  const { loadConfig } = importCwd('dotcom-tool-kit/lib/config') as { loadConfig: typeof loadConfigType }
  const config = await loadConfig(winstonLogger, { validate: false })
  // Give the user a chance to set any configurable options for the plugins
  // they've installed.
  const optionsCancelled = await optionsPrompt({ logger, config, toolKitConfig, configPath, bizOpsSystem })
  if (optionsCancelled) {
    return
  }
  try {
    await catchToolKitErrorsInLogger(logger, installHooks(winstonLogger), 'installing Tool Kit hooks', true)
  } catch (error) {
    if (hasToolKitConflicts(error)) {
      // Additional questions asked if we have any task conflicts, letting the
      // user to specify the order they want tasks to run in.
      const conflictsCancelled = await conflictsPrompt({
        error: error as ToolkitErrorModule.ToolKitConflictError,
        logger,
        toolKitConfig,
        configPath
      })
      if (conflictsCancelled) {
        return
      }
      await catchToolKitErrorsInLogger(
        logger,
        installHooks(winstonLogger),
        'installing Tool Kit hooks again',
        false
      )
    } else {
      throw error
    }
  }

  if (originalCircleConfig?.includes('triggers')) {
    await scheduledPipelinePrompt()
  }
  if (Object.keys(config.plugins).some((id) => id.includes('serverless'))) {
    const oidcCancelled = await oidcInfrastructurePrompt({ toolKitConfig })
    if (oidcCancelled) {
      return
    }
  }

  // Suggest they delete the old n-gage makefile after verifying all its
  // logic has been migrated to Tool Kit.
  await makefileHint()
}

main().catch((error) => {
  if (!error.logged) {
    winstonLogger.error(error.stack)
  }
  process.exit(1)
})
