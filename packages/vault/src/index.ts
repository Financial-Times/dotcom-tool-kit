import fetch from '@financial-times/n-fetch'
import { promises as fs } from 'fs'
import path from 'path'
import os from 'os'
import { ToolKitError } from '@dotcom-tool-kit/error'

const VAULT_ROLE_ID = process.env.VAULT_ROLE_ID
const VAULT_SECRET_ID = process.env.VAULT_SECRET_ID
const VAULT_ADDR = 'https://vault.in.ft.com:8080/ui/vault/secrets/secret/list/teams/next'

export type VaultSettings = {
  repo: string
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
  repo: string
  environment: string
  credentials = {
    role_id: process.env.VAULT_ROLE_ID,
    secret_id: process.env.VAULT_SECRET_ID
  }

  constructor(settings: VaultSettings) {
    const { repo, environment } = settings

    this.repo = repo
    this.environment = environment
  }

  async get(): Promise<Secrets> {
    const token = await this.getAuthToken()
    return this.fetchSecrets(token)
  }

  private async getAuthToken(): Promise<string> {
    if (process.env.CIRCLECI) {
      try {
        const json = await fetch<Token>('https://vault.in.ft.com/v1/auth/approle/login', {
          method: 'POST',
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
        return await fs.readFile(path.join(os.homedir(), '.vault-token'), { encoding: 'utf8' })
      } catch {
        const error = new ToolKitError(`Vault login failed`)
        error.details = `Please check your .vault-token is present`
        throw error
      }
    }
  }

  private async fetchSecrets(token: string): Promise<Secrets> {
    try {
      const allShared = await fetch<Secrets>(`secret/teams/next/shared/${this.environment}`, {
        headers: { 'X-Vault-Token': token }
      })
      const appEnv = await fetch<Secrets>(`${VAULT_ADDR}/${this.repo}/${this.environment}`, {
        headers: { 'X-Vault-Token': token }
      })
      const appShared = await fetch<RequiredShared>(`${VAULT_ADDR}/${this.repo}/shared`, {
        headers: { 'X-Vault-Token': token }
      })

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
