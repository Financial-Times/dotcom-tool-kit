import { loadConfig } from 'dotcom-tool-kit/lib/config'
import { render } from 'ink'
import React from 'react'
import winston from 'winston'
import { TabbedView } from './components/TabbedView'

export async function main(): Promise<void> {
  const logger = winston.createLogger({ silent: true })
  const config = await loadConfig(logger)

  render(
    <React.StrictMode>
      <TabbedView config={config} />
    </React.StrictMode>
  )
}
