import fetch from '@financial-times/n-fetch'
import { promises as fs } from 'fs'
import path from 'path'
import os from 'os'
import { ToolKitError } from '@dotcom-tool-kit/error'

const VAULT_ROLE_ID = process.env.VAULT_ROLE_ID
const VAULT_SECRET_ID = process.env.VAULT_SECRET_ID
const VAULT_ADDR = 'https://vault.in.ft.com'
const VAULT_AUTH_GITHUB_TOKEN = process.env.VAULT_AUTH_GITHUB_TOKEN
const CIRCLECI = process.env.CIRCLECI

export type VaultSettings = {
  vaultPath: string
  environment: string
}

type Secrets = {
  [key: string]: string
}

type RequiredShared = {
  [key: string]: string[]
}

type Token = {
  auth: {
    client_token: string
  }
}

export class VaultEnvVars {
  vaultPath: string
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
        const json = await fetch<Token>(`${VAULT_ADDR}/v1/auth/approle/login`, {
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
          const token = await fetch<Token>(`${VAULT_ADDR}/v1/auth/github/login`, {
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
      const allShared = await fetch<Secrets>(
        `${VAULT_ADDR}:8080/ui/vault/secrets/secret/list/teams/next/shared/${this.environment}`,
        headers
      )
      const appEnv = await fetch<Secrets>(
        `${VAULT_ADDR}:8080/ui/vault/secrets/secret/list/teams/next/${this.vaultPath}/${this.environment}`,
        headers
      )
      const appShared = await fetch<RequiredShared>(
        `${VAULT_ADDR}:8080/ui/vault/secrets/secret/list/teams/next/${this.vaultPath}/shared`,
        headers
      )

      const required: Secrets = {}

      appShared.env.map((envVar) => {
        if (allShared.hasOwnProperty(envVar)) {
          required[envVar] = allShared[envVar]
        }
      })

      return Object.assign({}, required, appEnv)
    } catch {
      const error = new ToolKitError(`Unable to retreive secrets from vault`)
      error.details = `Please check that your system code is correct`
      throw error
    }
  }
}
