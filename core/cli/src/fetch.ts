import { RootOptions } from '@dotcom-tool-kit/schemas/src/plugins/dotcom-tool-kit'

// function that plugins can check if they need to implement their own logic to
// disable Node 18's native fetch
export const shouldDisableNativeFetch = (options: RootOptions): boolean => {
  // disable Node 18's native fetch if the Node runtime supports it (older
  // runtimes don't support the flag, implying they also don't use native
  // fetch) and the user hasn't opted out of the behaviour
  return (
    options.allowNativeFetch &&
    process.allowedNodeEnvironmentFlags.has('--no-experimental-fetch')
  )
}
