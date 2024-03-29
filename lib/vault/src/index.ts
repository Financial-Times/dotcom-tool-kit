import fetch from '@financial-times/n-fetch'
import { promises as fs } from 'fs'
import path from 'path'
import os from 'os'
import type { Logger } from 'winston'
import { ToolKitError } from '@dotcom-tool-kit/error'
import { getOptions } from '@dotcom-tool-kit/options'
import { VaultOptions } from '@dotcom-tool-kit/types/lib/schema/vault'

const VAULT_ROLE_ID = process.env.VAULT_ROLE_ID
const VAULT_SECRET_ID = process.env.VAULT_SECRET_ID
const VAULT_ADDR = 'https://vault.in.ft.com/v1'

export type Environment = 'production' | 'continuous-integration' | 'development'

export type VaultSettings = {
  environment: Environment
  vaultPath?: VaultOptions
}

type ReturnFetch = {
  data: Secrets
  status: number
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
  vaultTokenFile: string
  logger: Logger

  constructor(logger: Logger, { environment, vaultPath }: VaultSettings) {
    this.logger = logger

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
    this.vaultTokenFile = path.join(os.homedir(), '.vault-token')
  }

  async get(): Promise<Secrets> {
    const token = await this.getAuthToken()
    return this.fetchSecrets(token)
  }

  private async fetchTest(token: string): Promise<boolean> {
    try {
      await fetch<ReturnFetch>(`${VAULT_ADDR}/secret?help=1`, {
        headers: { 'X-Vault-Token': token }
      })
      return true
    } catch {
      return false
    }
  }

  private async getLocalToken(): Promise<string> {
    try {
      this.logger.debug('checking for current vault token')
      const vaultToken = await fs.readFile(this.vaultTokenFile, {
        encoding: 'utf8'
      })
      this.logger.debug('testing current vault token')
      const isValidToken = await this.fetchTest(vaultToken)
      if (isValidToken) {
        this.logger.verbose('success testing current vault token!')
        return vaultToken
      } else {
        const message = 'current vault token invalid, requesting new one...'
        this.logger.error(message)
        throw new ToolKitError(message)
      }
    } catch {
      throw new ToolKitError('no current vault token found, requesting new token....')
    }
  }

  private async getTokenFromVault(githubToken: string) {
    try {
      this.logger.info(`you are not logged in to vault, logging you in...`)
      const token = await fetch<Token>(`${VAULT_ADDR}/auth/github/login`, {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({ token: githubToken })
      })
      await fs.writeFile(this.vaultTokenFile, token.auth.client_token)
      return token.auth.client_token
    } catch {
      throw new ToolKitError('unable to complete vault authentication')
    }
  }

  private async getAuthToken(): Promise<string> {
    const VAULT_AUTH_GITHUB_TOKEN = process.env.VAULT_AUTH_GITHUB_TOKEN
    const CIRCLECI = process.env.CIRCLECI
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
      try {
        const token = await this.getLocalToken()
        return token
      } catch {
        if (VAULT_AUTH_GITHUB_TOKEN) {
          const token = await this.getTokenFromVault(VAULT_AUTH_GITHUB_TOKEN)
          return token
        } else {
          const error = new ToolKitError(`VAULT_AUTH_GITHUB_TOKEN variable is not set`)
          error.details = `Follow the guide at https://github.com/Financial-Times/vault/wiki/Getting-Started-With-Vault`
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
      this.logger.debug(`vault add: ${VAULT_ADDR}, team: ${this.vaultPath.team}, env: ${this.environment}`)
      const allShared = await fetch<ReturnFetch>(
        `${VAULT_ADDR}/secret/teams/${this.vaultPath.team}/shared/${this.environment}`,
        headers
      ).then((json) => json.data)
      this.logger.debug(`allShared: ${Object.keys(allShared)}`)

      const appEnv = await fetch<ReturnFetch>(
        `${VAULT_ADDR}/secret/teams/${this.vaultPath.team}/${this.vaultPath.app}/${this.environment}`,
        headers
      ).then((json) => json.data)
      this.logger.debug(`appEnv: ${Object.keys(appEnv)}`)

      const appShared = await fetch<RequiredShared>(
        `${VAULT_ADDR}/secret/teams/${this.vaultPath.team}/${this.vaultPath.app}/shared`,
        headers
      ).then((json) => json.data)
      this.logger.debug(`appShared: ${JSON.stringify(appShared)}`)

      const required: Secrets = {}

      appShared.env.forEach((envVar) => {
        if (allShared.hasOwnProperty(envVar)) {
          required[envVar] = allShared[envVar]
        }
      })
      this.logger.debug(`required: ${Object.keys(required)}`)

      return Object.assign({}, required, appEnv)
    } catch {
      const error = new ToolKitError(`Unable to retrieve secrets from vault`)
      error.details = `Please check that your system code is correct`
      throw error
    }
  }
}
