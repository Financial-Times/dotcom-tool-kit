import styles from '@dotcom-tool-kit/styles'
import { Task } from '@dotcom-tool-kit/types'

export default class BabelProduction extends Task {
  static description = 'build babel'

  async run(): Promise<void> {
    console.log(
      `${styles.warning(
        `${styles.plugin('babel')} plugin is currently a stub (${styles.task('BabelProduction')} task)`
      )}`
    )
  }
}
