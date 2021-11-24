declare module 'ft-next-router' {
  type Service = {
    service: string
    port: number
  }

  export function register(args: Service): Promise<void>
}
