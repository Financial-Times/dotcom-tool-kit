// @ts-ignore
import Heroku from 'heroku-client'
import { readState } from '@dotcom-tool-kit/state'

const HEROKU_API_TOKEN = process.env.HEROKU_API_TOKEN

export default async function getSlug(environment: string): Promise<string> {

	const { appName } = await readState(environment, ['appName']) 
    const heroku = new Heroku({ token: HEROKU_API_TOKEN })
    const releases = await heroku.get(`/apps/${appName}/releases`)
    const latest = releases.find((release: {current: string}) => release.current)

    return latest.slug.id
}
