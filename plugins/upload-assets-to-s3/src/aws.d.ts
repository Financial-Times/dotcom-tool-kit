// workaround for aws-sdk using DOM types in their definitions

declare global {
  /* eslint-disable @typescript-eslint/no-empty-interface */
  export interface Blob {}
}

export {}
