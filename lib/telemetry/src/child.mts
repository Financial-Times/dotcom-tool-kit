import { randomUUID } from 'node:crypto'

import type { TelemetryEvent } from './types.ts'

const endpoint = process.env.TOOL_KIT_TELEMETRY_ENDPOINT || 'https://client-metrics.ft.com/api/v1/ingest'

const sessionId = randomUUID()

let currentlyPublishing = false
let messageQueue: TelemetryEvent[] = []

process.on('message', (message: TelemetryEvent) => {
  messageQueue.push(message)
  tryToPublish()
})

const tryToPublish = async () => {
  // will publish all the events stored in the messageQueue buffer if there
  // isn't already a publish in progress (i.e., we aren't waiting for a
  // response from the endpoint.)
  if (!currentlyPublishing) {
    // as long as there are no points that would cause us to yield to the event
    // loop (e.g., an await expression,) we can treat this as a critical
    // section and it's safe to read then write to currentlyPublishing.
    currentlyPublishing = true
    while (messageQueue.length > 0) {
      const messages = JSON.stringify(messageQueue)
      messageQueue = []
      await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // use the same request ID throughout the Tool Kit session so that we
          // can correlate metrics from within the same invocation
          'X-Request-Id': sessionId
        },
        body: messages
      })
    }
    /* eslint-disable-next-line require-atomic-updates --
     * This is safe because this code can only be run if currentlyPublishing
     * was previously false for the batch publisher.
     **/
    currentlyPublishing = false
  }
}
