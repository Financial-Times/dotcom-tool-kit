import { styles } from '@dotcom-tool-kit/logger'
import prompt from 'prompts'

export interface ConfirmationParams {
  deleteConfig: boolean
  addEslintConfig: boolean
  fixGitignore: boolean
  packagesToInstall: string[]
  packagesToRemove: string[]
  configFile: string
}

export default ({
  deleteConfig,
  addEslintConfig,
  fixGitignore,
  packagesToInstall,
  packagesToRemove,
  configFile
}: ConfirmationParams): Promise<prompt.Answers<'confirm'>> => {
  return prompt({
    name: 'confirm',
    type: 'confirm',
    initial: true,
    message: () => {
      return `so, we're gonna:

install the following packages:
${packagesToInstall.map((p) => `- ${styles.plugin(p)}`).join('\n')}\
${addEslintConfig ? `\n\nadd a default eslint config file at ${styles.filepath('./.eslintrc.js')}` : ''}\
${
  packagesToRemove.length > 0
    ? '\n\nuninstall the following packages:\n' +
      packagesToRemove.map((p) => `- ${styles.plugin(p)}`).join('\n')
    : ''
}

create a ${styles.filepath('.toolkitrc.yml')} containing:
${configFile.trimEnd()}\
${deleteConfig ? `\n\nregenerate ${styles.filepath('.circleci/config.yml')}` : ''}\
${fixGitignore ? `\n\nupdate ${styles.filepath('.gitignore')}` : ''}

sound good?`
    }
  })
}
