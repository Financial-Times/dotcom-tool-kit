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
    if (!process.env.CIRCLE_BRANCH) {
      throw new Error(`CIRCLE_BRANCH environment variable not found. This is required to create a review app`)
    }

    const hash = createHash('sha256').update(process.env.CIRCLE_BRANCH).digest('hex').slice(0, 6)

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
