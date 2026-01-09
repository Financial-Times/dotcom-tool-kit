import { type ChildProcess, fork } from 'node:child_process'

import type { Logger } from 'winston'

import { createWritableLogger } from '@dotcom-tool-kit/logger'

import type { TelemetryEvent, TelemetryAttributes, Namespace, NamespaceSchemas } from './types'

/**
 * A TelemetryProcess will spawn a child process that will publish recording
 * telemetry event asynchronously from the main Tool Kit process. Note that you
 * will need a TelemetryRecorder to actually record telemetry events, which is
 * typically created with this class's `.root()` method.
 */
export class TelemetryProcess {
  child: ChildProcess

  constructor(private logger: Logger) {
    // by default, we disable native fetch in the process so that all the code
    // we call out to works as we expect but we know it's safe to use fetch()
    // here
    const allowFetchArgv = process.execArgv.filter((arg) => arg !== '--no-experimental-fetch')
    // we handle all communication with the HTTP telemetry endpoint in a child
    // process so we can close the Tool Kit process before all telemetry events
    // have been uploaded. this effectively allows us to run the telemetry
    // upload as a background process and exit Tool Kit ASAP
    // note that tests run the TypeScript file directly so we need to make sure
    // to explicitly use the lib directory where the transpiled JavaScript is
    // located
    this.child = fork(`${__dirname}/../lib/child.mjs`, {
      // we only care to log text from stderr
      stdio: ['ignore', 'ignore', 'pipe', 'ipc'],
      detached: true,
      execArgv: allowFetchArgv,
      // HACK:IM:20260107 for some reason the overridden endpoint in tests only
      // gets picked up if we explicitly pass the environment here instead of
      // implicitly?
      env: { ...process.env }
    })
    // print all errors (or anything else that's logged to stderr) as winston
    // warnings
    this.child.stderr?.pipe(createWritableLogger(logger, 'telemetry', 'warn'))
    // we want to un-reference the child process so that this process can
    // terminate before it. we don't want to do that in CI though so that we
    // can ensure all the events have been recorded before ending the CI job.
    if (!process.env.CI) {
      this.child.unref()
    }
  }

  /**
   * @param rootDetails Initial attributes to be included in all recorded events
   */
  root(rootDetails: TelemetryAttributes = {}): TelemetryRecorder {
    return new TelemetryRecorder(this, rootDetails)
  }

  /**
   * Disconnect from the child process. All future recorded events will be
   * discarded. Calling this method is required to guarantee that the parent
   * process can exit before the child process is finished. This will _not_
   * prevent the child process from asynchronously finishing the publishing of
   * the remaining recorded events.
   */
  disconnect() {
    if (this.child.connected) {
      if (!process.env.CI) {
        this.child.stderr?.destroy()
      }
      this.child.disconnect()
    }
  }
}

/** Class to asynchronously record events via a `TelemetryProcess`. */
export class TelemetryRecorder {
  constructor(private process: TelemetryProcess, public attributes: TelemetryAttributes) {}

  /**
   * Create a copy of this `TelemetryRecorder` but with new default attributes
   * merged with its current ones that will be included in every recorded event.
   * Only affects the returned `TelemetryRecorder`.
   */
  scoped(details: TelemetryAttributes): TelemetryRecorder {
    return new TelemetryRecorder(this.process, { ...this.attributes, ...details })
  }

  /**
   * Record an event for a given namespace. The schema is strictly typed
   * per-namespace as our backend server validates that the events are
   * structured properly for both correctness and security purposes.
   */
  recordEvent<N extends Namespace>(namespace: N, details: NamespaceSchemas[N]) {
    const telemetryChild = this.process.child
    if (telemetryChild.connected) {
      const event: TelemetryEvent = {
        namespace: `dotcom-tool-kit.${namespace}`,
        eventTimestamp: Date.now(),
        data: { ...this.attributes, ...details }
      }
      telemetryChild.send(event)
    }
  }
}

/**
 * Mock client that can be used for testing or as a default fallback to a real
 * telemetry client. Any events recorded to it or any of its scoped children
 * will be discarded.
 */
export class MockTelemetryClient extends TelemetryRecorder {
  constructor() {
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any --
     *  Safe to pass an undefined child process here because we override all
     *  the methods that use it.
     **/
    super(undefined as any, {})
  }

  override scoped(_details: TelemetryAttributes): TelemetryRecorder {
    return this
  }
  // eslint-disable-next-line @typescript-eslint/no-empty-function -- mocked function
  override recordEvent(_namespace: string, _details: NamespaceSchemas[Namespace]) {}
}

export { TelemetryEvent }
