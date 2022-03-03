import type { Logger } from 'winston'
import heroku from './herokuClient'
import { ToolKitError } from '@dotcom-tool-kit/error'
import type { HerokuApiResBuild } from 'heroku-client'
import getRepoDetails from './githubApi'

async function createBuild(logger: Logger, appName: string): Promise<HerokuApiResBuild> {
	try {
		logger.info(`getting latest tarball path for ${appName}...`)
		const { branch, source_blob } = await getRepoDetails(logger)
		source_blob.checksum = null

		logger.info(`creating new build for ${appName} from ${branch}...`)
		const buildInfo: HerokuApiResBuild = await heroku.post(`/apps/${appName}/builds`, {
			body: {
				source_blob
			  }
		})
		return buildInfo
	} catch(err) {
		const error = new ToolKitError('Unable to create build from latest tarball')
		if (err instanceof Error) {
			error.details = err.message
		  }
		throw Error
	}
}

export { createBuild }
