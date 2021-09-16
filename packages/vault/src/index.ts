import fetch from '@financial-times/n-fetch'
import { promises as fs } from 'fs'
import path from 'path'
import os from 'os'
import { ToolKitError } from '@dotcom-tool-kit/error'

const VAULT_ROLE_ID = process.env.VAULT_ROLE_ID
const VAULT_SECRET_ID = process.env.VAULT_SECRET_ID
const VAULT_ADDR = 'https://vault.in.ft.com/v1'
const VAULT_AUTH_GITHUB_TOKEN = process.env.VAULT_AUTH_GITHUB_TOKEN
const CIRCLECI = process.env.CIRCLECI

export type VaultPath = {
  team: string
  app: string
}

export type VaultSettings = {
  vaultPath: VaultPath
  environment: string
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
  vaultPath: VaultPath
  environment: string

  constructor(settings: VaultSettings) {
    const { vaultPath, environment } = settings

    this.vaultPath = vaultPath
    this.environment = environment
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
      try {
        const vaultTokenFile = await fs.readFile(path.join(os.homedir(), '.vault-token'), {
          encoding: 'utf8'
        })
        if (vaultTokenFile) {
          return vaultTokenFile
        } else if (VAULT_AUTH_GITHUB_TOKEN) {
          console.log(`You are not logged in, logging you in...`)
          const token = await fetch<Token>(`${VAULT_ADDR}/auth/github/login`, {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify({ token: VAULT_AUTH_GITHUB_TOKEN })
          })
          return token.auth.client_token
        } else {
          const error = new ToolKitError(`VAULT_AUTH_GITHUB_TOKEN variable is not set`)
          error.details = `Follow the guide at https://github.com/Financial-Times/vault/wiki/Getting-Started-With-Vault`
          throw error
        }
      } catch {
        const error = new ToolKitError(`Vault login failed`)
        error.details = `Please check your .vault-token is present`
        throw error
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
