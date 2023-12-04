/* eslint-disable @typescript-eslint/no-explicit-any */

declare module 'lighthouse' {
  export interface LighthouseOptions {
    [key: string]: any
  }

  export interface LighthouseResult {
    [key: string]: any
  }

  export default function runLighthouse(url: string, opts?: LighthouseOptions): Promise<LighthouseResult>
}
