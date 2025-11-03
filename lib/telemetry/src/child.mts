import type { TelemetryEvent } from './types.ts'

let currentlyPublishing = false
let messageQueue: TelemetryEvent[] = []

process.on('message', (message) => {
  messageQueue.push(message as TelemetryEvent)
  tryToPublish()
})

const tryToPublish = async () => {
  if (!currentlyPublishing) {
    currentlyPublishing = true
    while (messageQueue.length > 0) {
      const messages = JSON.stringify(messageQueue)
      messageQueue = []
      await fetch('http://127.0.0.1:1370', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: messages
      })
      console.log('finished publishing')
    }
    /* eslint-disable-next-line require-atomic-updates --
     * This is safe because this code can only be run if currentlyPublishing
     * was previously false for the batch publisher.
     **/
    currentlyPublishing = false
  }
}
