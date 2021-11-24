declare module '@financial-times/n-test' {
  type SmokeTestOptions = {
    browsers?: string[]
    host?: string
    config?: string
    interactive?: boolean
    header?: { [name: string]: string }
  }

  export class SmokeTest {
    constructor(options: SmokeTestOptions)
    run(sets?: string[]): Promise<void>
  }
}
