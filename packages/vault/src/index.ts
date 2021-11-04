import fetch from '@financial-times/n-fetch'
import { promises as fs } from 'fs'
import path from 'path'
import os from 'os'
import moment from 'moment'
import { ToolKitError } from '@dotcom-tool-kit/error'
import { getOptions } from '@dotcom-tool-kit/options'
import { VaultOptions } from '@dotcom-tool-kit/types/lib/schema/vault'

const VAULT_ROLE_ID = process.env.VAULT_ROLE_ID
const VAULT_SECRET_ID = process.env.VAULT_SECRET_ID
const VAULT_ADDR = 'https://vault.in.ft.com/v1'
const VAULT_AUTH_GITHUB_TOKEN = process.env.VAULT_AUTH_GITHUB_TOKEN
const CIRCLECI = process.env.CIRCLECI

export type Environment = 'production' | 'continuous-integration' | 'development'

export type VaultSettings = {
  environment: Environment
  vaultPath?: VaultOptions
}

type ReturnFetch = {
  data: Secrets
}

type Secrets = {
  [key: string]: string
}

type RequiredShared = {
  [key: string]: {
    [key: string]: string[]
  }
}

type Token = {
  auth: {
    client_token: string
  }
}

export class VaultEnvVars {
  vaultPath: VaultOptions
  environment: string

  constructor({ environment, vaultPath }: VaultSettings) {
    this.environment = environment
    const options = vaultPath || getOptions('@dotcom-tool-kit/vault')
    if (!options || !('team' in options && 'app' in options)) {
      const error = new ToolKitError('Vault options not found in your Tool Kit configuration')
      error.details = `"team" and "app" are needed to get your app's secrets from vault, e.g.
        options:
          '@dotcom-tool-kit/vault':
              team: "next",
              app: "your-app"
            `
      throw error
    }

    this.vaultPath = options
  }

  async get(): Promise<Secrets> {
    const token = await this.getAuthToken()
    return this.fetchSecrets(token)
  }

  private async getAuthToken(): Promise<string> {
    if (CIRCLECI) {
      try {
        const json = await fetch<Token>(`${VAULT_ADDR}/auth/approle/login`, {
          method: 'POST',
          headers: { 'Content-type': 'application/json' },
          body: JSON.stringify({ role_id: VAULT_ROLE_ID, secret_id: VAULT_SECRET_ID })
        })
        return json.auth.client_token
      } catch {
        const error = new ToolKitError(`Vault login failed`)
        error.details = `Please check your VAULT_ROLE_ID and VAULT_SECRET_ID environment variables are present`
        throw error
      }
    } else {
      // developer's local machine
      const vaultTokenFile = path.join(os.homedir(), '.vault-token')
      try {
        const stats = await fs.stat(vaultTokenFile)
        const fileExpired = moment().diff(stats.birthtime, 'hours') > 8
        if (!fileExpired) {
          const vaultToken = await fs.readFile(vaultTokenFile, {
            encoding: 'utf8'
          })
          return vaultToken
        }
      } catch {
        console.log('no current vault token found, requesting new token....')
      }

      try {
        if (VAULT_AUTH_GITHUB_TOKEN) {
          console.log(`You are not logged in, logging you in...`)
          const token = await fetch<Token>(`${VAULT_ADDR}/auth/github/login`, {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify({ token: VAULT_AUTH_GITHUB_TOKEN })
          })
          await fs.writeFile(vaultTokenFile, token.auth.client_token)
          return token.auth.client_token
        } else {
          const error = new ToolKitError(`VAULT_AUTH_GITHUB_TOKEN variable is not set`)
          error.details = `Follow the guide at https://github.com/Financial-Times/vault/wiki/Getting-Started-With-Vault`
          throw error
        }
      } catch (err) {
        if (err instanceof ToolKitError) {
          throw err
        } else {
          const error = new ToolKitError(`Vault login failed`)
          if (err instanceof Error) {
            error.details = err.message
          }
          throw error
        }
      }
    }
  }

  private async fetchSecrets(token: string): Promise<Secrets> {
    const headers = {
      headers: { 'X-Vault-Token': token }
    }

    try {
      console.log(`vault add: ${VAULT_ADDR}, team: ${this.vaultPath.team}, env: ${this.environment}`)
      const allShared = await fetch<ReturnFetch>(
        `${VAULT_ADDR}/secret/teams/${this.vaultPath.team}/shared/${this.environment}`,
        headers
      ).then((json) => json.data)
      console.log(`allShared: ${Object.keys(allShared)}`)

      const appEnv = await fetch<ReturnFetch>(
        `${VAULT_ADDR}/secret/teams/${this.vaultPath.team}/${this.vaultPath.app}/${this.environment}`,
        headers
      ).then((json) => json.data)
      console.log(`appEnv: ${Object.keys(appEnv)}`)

      const appShared = await fetch<RequiredShared>(
        `${VAULT_ADDR}/secret/teams/${this.vaultPath.team}/${this.vaultPath.app}/shared`,
        headers
      ).then((json) => json.data)
      console.log(`appShared: ${appShared}`)

      const required: Secrets = {}

      appShared.env.map((envVar) => {
        if (allShared.hasOwnProperty(envVar)) {
          required[envVar] = allShared[envVar]
        }
      })
      console.log(`required: ${Object.keys(required)}`)

      return Object.assign({}, required, appEnv)
    } catch {
      const error = new ToolKitError(`Unable to retrieve secrets from vault`)
      error.details = `Please check that your system code is correct`
      throw error
    }
  }
}
