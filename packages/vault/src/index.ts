import fetch from '@financial-times/n-fetch'
import fs from 'fs'
import path from 'path'
import os from 'os'
import { ToolKitError } from '@dotcom-tool-kit/error'

export type VaultSettings = {
  repo: string
  environments: []
}

type Secrets = {
  [key: string]: string
}

type Registry = {
  [key: string]: string
}

type Token = {
  auth: {
    client_token: string
  }
}

export class VaultEnvVars {
  repo: string
  environments = []
  credentials = {
    role_id: process.env.VAULT_ROLE_ID,
    secret_id: process.env.VAULT_SECRET_ID
  }

  constructor(settings: VaultSettings) {
    const { repo, environments } = settings

    this.repo = repo
    this.environments = environments
  }

  async get(): Promise<Secrets[]> {
    const vaultPath = await this.getVaultPath(this.repo)
    const token = await this.getAuthToken()
    return this.makeApiCall(token, vaultPath)
  }

  private async getVaultPath(repo: string): Promise<string> {
    const res = await fetch<Registry[]>('https://next-registry.ft.com/v2/')
    const system = res.find((system) => system.repository === repo)
    if (system) {
      return system.config
    } else {
      const error = new ToolKitError(`Unable to find vault path`)
      error.details = `please check that both repository and config fields are present in the registry`
      throw error
    }
  }

  private async getAuthToken(): Promise<string> {
    if (process.env.CIRCLECI) {
      try {
        const json = await fetch<Token>('https://vault.in.ft.com/v1/auth/approle/login', {
          method: 'POST',
          body: JSON.stringify({ role_id: process.env.VAULT_ROLE_ID, secret_id: process.env.VAULT_SECRET_ID })
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
        return fs.readFileSync(path.join(os.homedir(), '.vault-token'), { encoding: 'utf8' })
      } catch {
        const error = new ToolKitError(`Vault login failed`)
        error.details = `Please check your .vault-token is present`
        throw error
      }
    }
  }

  private async makeApiCall(token: string, vaultPath: string): Promise<Secrets[]> {
    try {
      const shared: Secrets[] = await Promise.all(
        this.environments.map((env) => {
          return fetch<Secrets>(`secret/teams/next/shared/${env}}`, { headers: { 'X-Vault-Token': token } })
        })
      )
      const app: Secrets[] = await Promise.all(
        this.environments.map((env) => {
          return fetch<Secrets>(`${vaultPath}/${env}}`, {
            headers: { 'X-Vault-Token': token }
          })
        })
      )
      return [...shared, ...app]
    } catch {
      const error = new ToolKitError(`Unable to retreive secrets from vault`)
      error.details = `Please check that your system code is correct`
      throw error
    }
  }
}
