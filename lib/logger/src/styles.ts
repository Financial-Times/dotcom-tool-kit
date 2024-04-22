import colours from 'chalk'
import stripAnsi from 'strip-ansi'
import boxen from 'boxen'

// consistent styling use cases for terminal colours
// don't use ansi-colors directly, define a style please
export const styles = {
  hook: colours.yellow,
  command: colours.magenta,
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
  errorHighlight: colours.bgRed.black,
  error: (string: string): string => `${styles.errorHighlight(' × ')} ${styles.title(string)}`,
  warningHighlight: colours.bgYellow.black,
  warning: (string: string): string => styles.warningHighlight(' ! ') + ' ' + string,
  infoHighlight: colours.bgBlueBright.black,
  info: (string: string): string => styles.infoHighlight(' i ') + ' ' + string,
  helpHighlight: colours.bgGreen.black,
  help: (string: string): string => styles.helpHighlight(' ? ') + ' ' + string,
  ruler: (): string => styles.dim('─'.repeat(process.stdout.columns / 2)),
  box: (string: string, options: Partial<boxen.Options>) =>
    boxen(string, {
      borderStyle: 'round',
      padding: { top: 0, bottom: 0, left: 1, right: 1 },
      ...options
    }),
  groupHeader: (string: string) => ` ╭─${'─'.repeat(stripAnsi(string).length)}─╮
─┤ ${string} ├─${'─'.repeat(process.stdout.columns / 2 - stripAnsi(string).length - 6)}
 ╰─${'─'.repeat(stripAnsi(string).length)}─╯`
}
