// workaround for simple-git using DOM types in their definitions

declare global {
  /* eslint-disable @typescript-eslint/no-empty-interface */
  export interface AbortSignal {}
}

export {}
