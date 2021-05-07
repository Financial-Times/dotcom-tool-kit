import request from 'superagent'
// @ts-ignore
import Heroku from 'heroku-client'

const VAULT_ROLE_ID = process.env.VAULT_ROLE_ID
const VAULT_SECRET_ID = process.env.VAULT_SECRET_ID
const VAULT_ADDR = 'https://vault.in.ft.com:8080'
const HEROKU_TOKEN = process.env.HEROKU_API_TOKEN
const CIRCLE_PROJECT_REPONAME = process.env.CIRCLE_PROJECT_REPONAME

export default async function setConfigVars(appId: string, environment: string) {
    try {
		// Get a fresh Vault token
		const tokenResponse = await request
				.post(`${VAULT_ADDR}/auth/approle/login`)
				.send({role_id: VAULT_ROLE_ID,secret_id: VAULT_SECRET_ID})

		console.log('Fetching config values from Vault...') // eslint-disable-line no-console

		const vaultResponse = await request
			.get(`${VAULT_ADDR}/ui/vault/secrets/secret/list/teams/next/${CIRCLE_PROJECT_REPONAME}/${environment}`)
			.set('X-Vault-Token', tokenResponse.body.auth.client_token)

		const appConfigValues = vaultResponse.body.data
		const configVars = Object.assign({}, appConfigValues)

		// We send everything in Vault with the request but Heroku will only
		// update the changed values or add the missing keys.
		// i.e. if the JSON in Vault matches Heroku, request will not result in
		// a new release.
		// The changed values can be seen in the app activities/releases.
		const heroku = new Heroku({ token: HEROKU_TOKEN })

		await heroku.patch(`/apps/${appId}/config-vars`, { body: configVars })

		console.log('Following values have been set:', Object.keys(appConfigValues).join())// eslint-disable-line no-console

		console.log(`${CIRCLE_PROJECT_REPONAME} ${appId} config vars have been updated successfully.`) // eslint-disable-line no-console
	} catch (err) {
		console.error('Error updating config vars:', err) // eslint-disable-line no-console
		process.exit(1)
	}
}