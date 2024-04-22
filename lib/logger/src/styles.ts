import colours from 'chalk'
import stripAnsi from 'strip-ansi'
import { boxen } from '@visulima/boxen'

type BoxenOptions = typeof boxen extends (text: string, options?: infer O) => string ? O : never

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
  errorHighlight: colours.bgRed.bold,
  error: (string: string): string => `${styles.errorHighlight(' × ')} ${styles.title(string)}`,
  warningHighlight: colours.bgYellow.bold,
  warning: (string: string): string => styles.warningHighlight(' ! ') + ' ' + string,
  infoHighlight: colours.bgBlueBright.bold,
  info: (string: string): string => styles.infoHighlight(' i ') + ' ' + string,
  helpHighlight: colours.bgGreen.bold,
  help: (string: string): string => styles.helpHighlight(' ? ') + ' ' + string,
  ruler: (): string => styles.dim('─'.repeat(process.stdout.columns / 2)),
  box: (string: string, options: Partial<BoxenOptions>) =>
    boxen(string, {
      borderStyle: 'round',
      padding: { left: 1, right: 1 },
      ...options
    }),
  groupHeader: (string: string) => ` ╭─${'─'.repeat(stripAnsi(string).length)}─╮
─┤ ${string} ├─${'─'.repeat(process.stdout.columns / 2 - stripAnsi(string).length - 6)}
 ╰─${'─'.repeat(stripAnsi(string).length)}─╯`
}
