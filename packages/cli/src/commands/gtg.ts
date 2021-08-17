import { Task } from '@dotcom-tool-kit/task'
import waitForOk from '@dotcom-tool-kit/wait-for-ok'

function getURL(appName?: string) {
  let host = appName || 'http://local.ft.com:3002'

  if (!/:|\./.test(host)) host += '.herokuapp.com/__gtg'

  if (!/https?:\/\//.test(host)) host = 'http://' + host

  return host
}

export default class GoodToGo extends Task {
  // TODO do we want to support args parsing? maybe using yargs?
  //
  // static flags = {
  //   app: flags.string({
  //     char: 'a',
  //     description: "Runs gtg ('good to go') checks for an app",
  //     required: true
  //   })
  // }

  async run(): Promise<void> {
    // const { flags } = this.parse(GoodToGo)
    // const { app } = flags
    // const url = getURL(app)

    const url = getURL()

    return waitForOk(url)
  }
}
