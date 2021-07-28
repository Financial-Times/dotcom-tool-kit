import fetch from '@financial-times/n-fetch'
import fs from 'fs'
import path from 'path'
import os from 'os'
import { ToolKitError } from '@dotcom-tool-kit/error'

export type VaultSettings = {
  systemCode: string
  environments: []
}

type Secrets = {
  [key: string]: string
}

type Token = {
  auth: {
    client_token: string
  }
}

export class VaultEnvVars {
  systemCode: string
  environments = []
  credentials = {
    role_id: process.env.VAULT_ROLE_ID,
    secret_id: process.env.VAULT_SECRET_ID
  }

  constructor(settings: VaultSettings) {
    const { systemCode, environments } = settings

    this.systemCode = systemCode
    this.environments = environments
  }

  async get(): Promise<Secrets[]> {
    const token = await this.getAuthToken()
    return this.makeApiCall(token)
  }

  async getAuthToken(): Promise<string> {
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
      // const key = fs.readFile(path.join(os.homedir(), '.vault-token'), { encoding: 'utf8' }, (err, data) => {
      //     if (err) {
      //         const error = new ToolKitError(`Vault login failed`)
      //         error.details = `Please check your .vault-token is present`
      //         throw error
      //     } else {
      //         return data
      //     }
      //     return key
      // }
    }
    return ''
  }

  async makeApiCall(token: string): Promise<Secrets[]> {
    try {
      const shared: Secrets[] = await Promise.all(
        this.environments.map((env) => {
          return fetch<Secrets>(`secret/teams/next/shared/${env}}`, { headers: { 'X-Vault-Token': token } })
        })
      )
      const app: Secrets[] = await Promise.all(
        this.environments.map((env) => {
          return fetch<Secrets>(`secret/teams/next/${this.systemCode}/${env}}`, {
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
