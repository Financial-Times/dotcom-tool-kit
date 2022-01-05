import colours from 'ansi-colors'

// consistent styling use cases for terminal colours
// don't use ansi-colors directly, define a style please
const styles = {
  hook: colours.magenta,
  task: colours.blueBright,
  plugin: colours.cyan,
  URL: colours.cyan.underline,
  filepath: colours.italic,
  app: colours.green,
  option: colours.blue,
  makeTarget: colours.grey.italic,
  heading: colours.bold,
  dim: colours.grey,
  title: colours.bold.underline,
  error: (string: string): string => `${colours.red.bold('‼︎')} ${styles.title(string)}`,
  warning: (string: string): string => `${colours.yellow.bold('⚠︎')} ${styles.title(string)}`,
  ruler: (): string => styles.dim('─'.repeat(process.stdout.columns / 2))
}

export default styles
