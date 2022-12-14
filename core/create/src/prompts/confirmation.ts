import { styles } from '@dotcom-tool-kit/logger'
import prompt from 'prompts'

export interface ConfirmationParams {
  deleteConfig: boolean
  addEslintConfig: boolean
  packagesToInstall: string[]
  packagesToRemove: string[]
  configFile: string
}

export default ({
  deleteConfig,
  addEslintConfig,
  packagesToInstall,
  packagesToRemove,
  configFile
}: ConfirmationParams): Promise<prompt.Answers<'confirm'>> => {
  return prompt({
    name: 'confirm',
    type: 'confirm',
    message: () => {
      return `so, we're gonna:

install the following packages:
${packagesToInstall.map((p) => `- ${styles.plugin(p)}`).join('\n')}\

${addEslintConfig ? `\nadd a default eslint config file at ${styles.filepath('./.eslintrc.js')}` : ''}

${
  packagesToRemove.length > 0
    ? '\nuninstall the following packages:\n' +
      packagesToRemove.map((p) => `- ${styles.plugin(p)}`).join('\n') +
      '\n'
    : ''
}
create a ${styles.filepath('.toolkitrc.yml')} containing:
${configFile}\
${deleteConfig ? `\nregenerate ${styles.filepath('.circleci/config.yml')}\n` : ''}
sound good?`
    }
  })
}