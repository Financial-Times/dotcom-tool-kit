declare module '@financial-times/n-fetch' {
  function fetch<T>(
    url: string,
    options: {
      headers?: {
        'X-Vault-Token': string
      }
      body?: string
      method?: string
    }
  ): Promise<T>
  export = fetch
}
