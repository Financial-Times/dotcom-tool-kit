import vault from 'node-vault'
;({ endpoint: 'https://vault.in.ft.com:8080' })
import { ToolKitError } from '@dotcom-tool-kit/error'

export type VaultSettings = {
  systemCode: string
  environments: []
}

export type Secrets = {
  [key: string]: string
}

export class VaultEnvVars {
  systemCode: string
  environments = []
  FTvault = vault({ endpoint: 'vault.in.ft.com:8080' })
  credentials = {
    role_id: process.env.VAULT_ROLE_ID,
    secret_id: process.env.VAULT_SECRET_ID
  }

  constructor(settings: VaultSettings) {
    const { systemCode, environments } = settings

    this.systemCode = systemCode
    this.environments = environments

    this.initialiseConn()
  }

  async initialiseConn(): Promise<vault.client> {
    try {
      const data = await this.FTvault.write('auth/approle/login', this.credentials)
      this.FTvault.token = data.auth.client_token
      const lease = data.auth.lease_duration
      console.log({ event: 'VAULT_AUTH', lease: `${lease}s` })
      return this.FTvault
    } catch {
      const error = new ToolKitError(`Vault login failed`)
      error.details = `Please check your VAULT_ROLE_ID and VAULT_SECRET_ID environment variables are present.`
      throw error
    }
  }

  get(): Promise<Secrets[]> {
    return this.makeApiCall()
  }

  async makeApiCall(): Promise<Secrets[]> {
    // const shared: Secrets[] = await Promise.all(this.environments.map(env => {
    //     return this.FTvault.read(`secret/teams/next/shared/${env}}`)
    // }))
    const app: Secrets[] = await Promise.all(
      this.environments.map((env) => {
        return this.FTvault.read(`secret/teams/next/${this.systemCode}/${env}}`)
      })
    )
    // return [...shared, ...app]
    return app
  }
}
