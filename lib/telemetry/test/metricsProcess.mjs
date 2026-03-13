import winston from 'winston'

import { TelemetryProcess } from '../lib/index.js'

const telemetryProcess = new TelemetryProcess(winston, true)
const metrics = telemetryProcess.root()

process.on('message', ({ action }) => {
  switch (action) {
    case 'send':
      metrics.recordEvent('tasks.completed', { success: true })
      break
    case 'disconnect':
      // unreference everything so that this process's event loop can exit.
      // explicitly disconnecting can mean that some messages are left unsent
      telemetryProcess.child.unref()
      telemetryProcess.child.channel?.unref()
      telemetryProcess.child.stderr?.destroy()
  }
})
