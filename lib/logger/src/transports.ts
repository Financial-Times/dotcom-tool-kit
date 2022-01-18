import { MESSAGE } from 'triple-beam'
import { transports } from 'winston'
import Transport from 'winston-transport'

export type CallbackHook = (message: string, callback: () => void) => void

export class HookTransport extends Transport {
  hook: CallbackHook

  constructor(
    opts: Transport.TransportStreamOptions & {
      hook?: CallbackHook
    } = {}
  ) {
    super(opts)

    if (!opts.hook) {
      throw new Error('options.hook is required')
    }

    this.hook = opts.hook
  }

  log: Transport['log'] = (info, winstonCallback) => {
    setImmediate(() => this.emit('logged', info))
    this.hook(info[MESSAGE], () => {
      // There are two potential callbacks here: the callback passed to this
      // function from Winston for when the logging is complete, and another
      // from the overridden write() function that is passed in the logging
      // metadata. Both of these functions are wrapped into the callback we pass
      // to the hook function which should call them when it is complete.
      if (info.callback) {
        info.callback()
      }
      if (winstonCallback) {
        winstonCallback()
      }
    })
  }
}

export const consoleTransport = new transports.Console({
  stderrLevels: ['error'],
  consoleWarnLevels: ['warn']
})
