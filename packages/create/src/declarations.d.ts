declare module 'komatsu' {
  type LogOptions = {
    status?: 'pending' | 'done' | 'info' | 'fail'
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

  export default class Spinners {
    log(id: string, options: LogOptions): void
    logPromise<T>(promise: Promise<T>, labels?: LogPromiseLabels<T>): Promise<T>
  }
}
