import type { Logger } from 'winston'
import heroku from './herokuClient'
import { ToolKitError } from '@dotcom-tool-kit/error'
import { HerokuApiResPost } from 'heroku-client'
import { writeState } from '@dotcom-tool-kit/state'

async function setStagingSlug(logger: Logger, appName: string, slug: string): Promise<void> {
	try{
		logger.info(`updating slug id ${slug} on ${appName}`)
	  
		const { slug: {id: slugId}} = await heroku.post<HerokuApiResPost>(`/apps/${appName}/releases`, {
			body: {
			slug
			}
		})
		writeState('staging', {slugId})
	} catch(err) {
        const error = new ToolKitError(
          `there was an error with setting the slug on ${appName}`
        )
		if (err instanceof Error) {
			error.details = err.message
		  }
		throw error
      }
}

export { setStagingSlug }