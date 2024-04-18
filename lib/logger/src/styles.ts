import colours, { stripColor } from 'ansi-colors'
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
  errorHighlight: colours.red,
  error: (string: string): string => `${styles.errorHighlight.bold('‼︎')} ${styles.title(string)}`,
  warningHighlight: colours.yellow,
  warning: (string: string): string => styles.warningHighlight.bold('⚠︎') + ' ' + string,
  infoHighlight: colours.blue,
  info: (string: string): string => styles.infoHighlight('ℹ︎') + ' ' + string,
  ruler: (): string => styles.dim('─'.repeat(process.stdout.columns / 2)),
  box: (string: string, options: Partial<BoxenOptions>) =>
    boxen(string, {
      borderStyle: 'round',
      padding: { left: 1, right: 1 },
      ...options
    }),
  groupHeader: (string: string) => ` ╭─${'─'.repeat(stripColor(string).length)}─╮
─┤ ${string} ├─${'─'.repeat(process.stdout.columns / 2 - stripColor(string).length - 6)}
 ╰─${'─'.repeat(stripColor(string).length)}─╯`
}
