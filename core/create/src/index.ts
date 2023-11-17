import * as ToolkitErrorModule from '@dotcom-tool-kit/error'
import { rootLogger as winstonLogger, styles } from '@dotcom-tool-kit/logger'
import type { RCFile } from '@dotcom-tool-kit/types'
import loadPackageJson from '@financial-times/package-json'
import { exec as _exec } from 'child_process'
import type { cosmiconfig } from 'cosmiconfig'
import type { loadConfig as loadConfigType } from 'dotcom-tool-kit/lib/config'
import { promises as fs } from 'fs'
import importCwd from 'import-cwd'
import Logger from 'komatsu'
import pacote from 'pacote'
import path from 'path'
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

const exec = promisify(_exec)

const packagesToInstall = ['dotcom-tool-kit']
const packagesToRemove: string[] = []

const packageJson = loadPackageJson({ filepath: path.resolve(process.cwd(), 'package.json') })
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

function clearConfigCache() {
  // we need to import explorer from the app itself instead of npx as this is
  // the object used by installHooks()
  return (importCwd('dotcom-tool-kit/lib/rc-file') as {
    explorer: ReturnType<typeof cosmiconfig>
  }).explorer.clearSearchCache()
}

async function executeMigration(
  deleteConfig: boolean,
  addEslintConfig: boolean,
  configFile: string
): Promise<void> {
  for (const pkg of packagesToInstall) {
    const { version } = await pacote.manifest(pkg)
    packageJson.requireDependency({
      pkg,
      version: `^${version}`,
      field: 'devDependencies'
    })
  }
  for (const pkg of packagesToRemove) {
    packageJson.removeDependency({
      pkg,
      field: 'devDependencies'
    })
  }

  packageJson.writeChanges()

  await logger.logPromise(exec('npm install'), 'installing dependencies')
  const configPromise = logger.logPromise(
    fs.writeFile(configPath, configFile),
    `creating ${styles.filepath('.toolkitrc.yml')}`
  )

  const eslintConfigPromise = addEslintConfig
    ? logger.logPromise(
        fs.writeFile(eslintConfigPath, getEslintConfigContent()),
        `creating ${styles.filepath('.eslintrc.js')}`
      )
    : Promise.resolve()

  const unlinkPromise = deleteConfig
    ? logger.logPromise(fs.unlink(circleConfigPath), 'removing old CircleCI config')
    : Promise.resolve()

  await Promise.all([configPromise, eslintConfigPromise, unlinkPromise])
}

async function main() {
  const toolKitConfig: RCFile = {
    plugins: [],
    installs: {},
    tasks: {},
    commands: {},
    options: {}
  }

  const originalCircleConfig = await fs.readFile(circleConfigPath, 'utf8').catch(() => undefined)
  // Start with the initial prompt which will get most of the information we
  // need for the remainder of the execution
  const { preset, additional, addEslintConfig, deleteConfig, uninstall } = await mainPrompt({
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
    packagesToInstall,
    packagesToRemove,
    configFile
  })

  if (!confirm) {
    return
  }
  // Carry out the proposed changes: install + uninstall packages, add config
  // files, etc.
  await executeMigration(deleteConfig, addEslintConfig, configFile)
  // Use user's version of Tool Kit that we've just installed for them to load
  // the config to avoid any incompatibilities with a version that create might
  // use
  const { loadConfig } = importCwd('dotcom-tool-kit/lib/config') as { loadConfig: typeof loadConfigType }
  const config = await loadConfig(winstonLogger, { validate: false })
  // Give the user a chance to set any configurable options for the plugins
  // they've installed.
  const optionsCancelled = await optionsPrompt({ logger, config, toolKitConfig, configPath })
  if (optionsCancelled) {
    return
  }
  clearConfigCache()
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
      clearConfigCache()
    } else {
      throw error
    }
  }

  if (originalCircleConfig?.includes('triggers')) {
    await scheduledPipelinePrompt()
  }
  if (Object.keys(config.plugins).some((id) => id.includes('serverless'))) {
    const oidcCancelled = await oidcInfrastructurePrompt()
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
