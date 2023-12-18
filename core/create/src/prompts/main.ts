import { styles } from '@dotcom-tool-kit/logger'
import type { PackageJson } from 'type-fest'
import { existsSync } from 'fs'
import prompt from 'prompts'
import { BizOpsSystem } from '../bizOps'

type PromptNames = 'preset' | 'additional' | 'addEslintConfig' | 'deleteConfig' | 'fixGitignore' | 'uninstall'

export interface MainParams {
  bizOpsSystem?: BizOpsSystem
  packageJson: PackageJson
  originalCircleConfig?: string
  eslintConfigPath: string
}

export default async ({
  bizOpsSystem,
  packageJson,
  originalCircleConfig,
  eslintConfigPath
}: MainParams): Promise<prompt.Answers<PromptNames>> => {
  const isPackageInstalled = (packageName: string) =>
    Object.keys(packageJson.devDependencies ?? {}).includes(packageName)

  const presetChoices = [
    { title: 'A user-facing (frontend) app', value: 'frontend-app' },
    { title: 'A Heroku backend app', value: 'backend-heroku-app' },
    { title: 'A Serverless backend app', value: 'backend-serverless-app' },
    { title: 'An npm component', value: 'component' }
  ]
  let guessedPreset: string
  if (!bizOpsSystem) {
    guessedPreset = 'component'
  } else if (bizOpsSystem.hostPlatform.includes('Heroku')) {
    const probablyFrontend = isPackageInstalled('webpack')
    guessedPreset = probablyFrontend ? 'frontend-app' : 'backend-heroku-app'
  } else if (bizOpsSystem.awsResourcesAggregate.count > 0) {
    guessedPreset = 'backend-serverless-app'
  } else {
    guessedPreset = 'component'
  }

  return prompt(
    [
      {
        name: 'preset',
        type: 'select',
        message: `What kind of app is ${packageJson.name ? styles.app(packageJson.name) : 'this'}?`,
        initial: presetChoices.findIndex(({ value }) => value === guessedPreset),
        choices: presetChoices
      },
      {
        name: 'additional',
        type: 'multiselect',
        message: 'Would you like to install any additional plugins?',
        choices: (prev) =>
          [
            {
              title: 'Jest',
              value: 'jest',
              description: 'a delightful JavaScript Testing Framework with a focus on simplicity'
            },
            {
              title: 'Mocha',
              value: 'mocha',
              description:
                'a feature-rich JavaScript test framework, making asynchronous testing simple and fun'
            },
            { title: 'ESLint', value: 'eslint', description: 'an open source JavaScript linting utility' },
            { title: 'Prettier', value: 'prettier', description: 'an opinionated code formatter' },
            { title: 'lint-staged', value: 'lint-staged', description: 'run linters on git staged files' },
            {
              title: 'Upload assets to S3',
              value: 'upload-assets-to-s3',
              description: "required this to make your app's CSS and JS available in production"
            }
          ].map((choice) => ({
            ...choice,
            title: styles.plugin(choice.title),
            selected:
              choice.value === 'upload-assets-to-s3'
                ? prev === 'frontend-app'
                : isPackageInstalled(choice.value)
          }))
      },
      {
        name: 'addEslintConfig',
        // Only show prompt if eslint plugin was selected
        type: (prev) => (prev.includes('eslint') ? 'confirm' : null),
        // Default to creating a config if config doesn't currently exist
        initial: !existsSync(eslintConfigPath),
        message: `Would you like to set a default eslint config file at ${styles.filepath('./eslintrc.js')}?`
      },
      {
        name: 'deleteConfig',
        // Skip prompt if CircleCI config doesn't exist
        type: originalCircleConfig ? ('confirm' as const) : null,
        initial: true,
        message: `Would you like a CircleCI config to be generated? This will overwrite the current config at ${styles.filepath(
          '.circleci/config.yml'
        )}.`
      },
      {
        name: 'fixGitignore',
        type: 'confirm',
        initial: true,
        message: `Would you like your ${styles.filepath(
          '.gitignore'
        )} to be updated? Tool Kit stores some state files that shouldn't be committed to your repository, whereas ESLint configuration should now be committed.`
      },
      {
        name: 'uninstall',
        type: 'confirm',
        initial: true,
        message: `Should we uninstall obsolete ${styles.app('n-gage')} and ${styles.app(
          'n-heroku-tools'
        )} packages?`
      }
    ],
    {
      onCancel: () => process.exit(1)
    }
  )
}
