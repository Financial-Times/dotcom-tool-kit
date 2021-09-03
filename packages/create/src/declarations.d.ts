declare module 'komatsu' {
  type Status = 'pending' | 'done' | 'info' | 'fail'

  type LogOptions<S = Status> = {
    status?: S
    message: string
    error?: Error
  }

  type LogPromiseLabels<T> =
    | string
    | {
        pending: string | (() => string)
        done: string | ((result: T) => string)
        fail: string | ((error: Error) => string)
      }

  type Spinner = {
    message: string
    status: Status
    frame: number
    error?: Error
    tick: NodeJS.Timer
  }

  export default class Spinners {
    spinners: Map<string, Spinner>
    log<S>(id: string, options: LogOptions<S>): void
    logPromise<T>(promise: Promise<T>, labels?: LogPromiseLabels<T>): Promise<T>
    renderSymbol(spinner: Spinner): string
    stop(): void
  }
}
