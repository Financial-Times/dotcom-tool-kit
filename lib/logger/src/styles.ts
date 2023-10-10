import colours from 'ansi-colors'

// consistent styling use cases for terminal colours
// don't use ansi-colors directly, define a style please
export const styles = {
  hook: colours.magenta,
  task: colours.blueBright,
  plugin: colours.cyan,
  URL: colours.cyan.underline,
  filepath: colours.italic,
  app: colours.green,
  option: colours.blue,
  makeTarget: colours.grey.italic,
  heading: colours.bold,
  code: colours.grey.italic,
  dim: colours.grey,
  title: colours.bold.underline,
  taskHeader: colours.bgWhite.black,
  errorHighlight: colours.red,
  error: (string: string): string => `${styles.errorHighlight.bold('‼︎')} ${styles.title(string)}`,
  warningHighlight: colours.yellow,
  warning: (string: string): string => styles.warningHighlight.bold('⚠︎') + ' ' + string,
  ruler: (): string => styles.dim('─'.repeat(process.stdout.columns / 2))
}
