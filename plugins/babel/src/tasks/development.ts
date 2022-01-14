import styles from '@dotcom-tool-kit/styles'
import { Task } from '@dotcom-tool-kit/types'

export default class BabelDevelopment extends Task {
  static description = 'build babel'

  async run(): Promise<void> {
    this.logger.warn(
      `${styles.plugin('babel')} plugin is currently a stub (${styles.task('BabelDevelopment')} task)`
    )
  }
}
