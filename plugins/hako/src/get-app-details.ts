import { styles } from '@dotcom-tool-kit/logger'
import { readState } from '@dotcom-tool-kit/state'
import { createHash } from 'node:crypto'

export function getAppDetails({
  name,
  ephemeralId,
  asReviewApp
}: {
  name: string
  ephemeralId?: string
  asReviewApp: boolean
}) {
  if (asReviewApp) {
    const ciState = readState('ci')

    if (!ciState) {
      throw new Error(
        `Couldn't get CI state to generate the hashed branch name. Make sure this task is running in CI and you have a Tool Kit plugin that provides CI state, such as ${styles.plugin(
          '@dotcom-tool-kit/circleci'
        )}, installed.`
      )
    }

    const hash = createHash('sha256').update(ciState.branch).digest('hex').slice(0, 6)

    return {
      subdomain: `${name}-${hash}`,
      ephemeralId: hash
    }
  } else {
    return {
      subdomain: name,
      ephemeralId
    }
  }
}
