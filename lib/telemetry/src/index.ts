import { type ChildProcess, fork } from 'node:child_process'

import type { Logger } from 'winston'

import { createWritableLogger } from '@dotcom-tool-kit/logger'

import type { TelemetryEvent, MetricAttributes } from './types'

export class MetricsProcess {
  child: ChildProcess

  constructor(private logger: Logger) {
    const allowFetchArgv = process.execArgv.filter((arg) => arg !== '--no-experimental-fetch')
    this.child = fork(`${__dirname}/child.mjs`, {
      stdio: ['ignore', 'ignore', 'pipe', 'ipc'],
      detached: true,
      execArgv: allowFetchArgv
    })
    this.child.stderr?.pipe(createWritableLogger(logger, 'telemetry', 'warn'))
    if (!process.env.CI) {
      this.child.unref()
    }
  }

  root(rootDetails: MetricAttributes = {}): ScopedMetricsClient {
    return new ScopedMetricsClient(this, rootDetails)
  }

  disconnect() {
    if (this.child.connected) {
      if (!process.env.CI) {
        this.child.stderr?.destroy()
      }
      this.child.disconnect()
    }
  }
}

export class ScopedMetricsClient {
  constructor(private process: MetricsProcess, public attributes: MetricAttributes) {}

  scoped(details: MetricAttributes): ScopedMetricsClient {
    return new ScopedMetricsClient(this.process, { ...this.attributes, ...details })
  }

  recordEvent(namespace: string, details: TelemetryEvent) {
    const telemetryChild = this.process.child
    if (telemetryChild.connected) {
      const message = { ...this.attributes, ...details, namespace }
      telemetryChild.send(message)
    }
  }
}

export class MockMetricsClient extends ScopedMetricsClient {
  constructor() {
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any --
     *  Safe to pass an undefined child process here because we override all
     *  the methods that use it.
     **/
    super(undefined as any, {})
  }

  override scoped(_details: MetricAttributes): ScopedMetricsClient {
    return this
  }
  // eslint-disable-next-line @typescript-eslint/no-empty-function -- mocked function
  override recordEvent(_namespace: string, _details: TelemetryEvent) {}
}

export { TelemetryEvent }
