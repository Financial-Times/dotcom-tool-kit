import { getOptions } from '@dotcom-tool-kit/options'

// function that plugins can check if they need to implement their own logic to
// disable Node 18's native fetch
export const shouldDisableNativeFetch = (): boolean => {
  // disable Node 18's native fetch if the Node runtime supports it (older
  // runtimes don't support the flag, implying they also don't use native
  // fetch) and the user hasn't opted out of the behaviour
  return (
    /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion --
     * the root plugin has default options and it always exists so is always
     * defined
     **/
    !getOptions('app root')!.allowNativeFetch &&
    process.allowedNodeEnvironmentFlags.has('--no-experimental-fetch')
  )
}
