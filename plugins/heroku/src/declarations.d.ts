declare module 'heroku-client' {
  export type HerokuClassOptions = {
    token: string | undefined
  }

  export type HerokuApiResGetRelease = {
    current: boolean
    slug: {
      id: string
    }
    id: string
    status: string
  }

  export type HerokuApiGetSlug = {
    id: string
    commit: string
  }

  export type HerokuApiResGetPipeline = {
    id: string
  }

  export type HerokuApiResGetPipelineApps = {
    app: {
      id: string
    }
    stage: string
  }

  export type HerokuApiResGetApp = {
    id: string
    slug_size: number | null
  }

  export type HerokuApiResGetReview = {
    id: string
    branch: string
    status: string
    app: {
      id: string
    }
  }

  export type HerokuApiResGetStaging = {
    id: string
    name: string
  }

  export type HerokuApiResBuild = {
    id: string
    status: string
    slug: null | {
      id: string
    }
  }

  export type HerokuApiResGetGtg = {
    name: string
    web_url: string | null
  }

  export type HerokuApiResPost = {
    id: string
    app: {
      id: string
      name: string
    }
    slug: {
      id: string
    }
  }

  export type HerokuApiReqOptions = {
    body?: Record<string, unknown>
  }

  export type HerokuApiResPatch = {
    quantity: number
    type: string
  }

  export type HerokuApiResPipeline = {
    id: string
  }

  export type HerokuApiResGetRegion = {
    region: {
      name: string
    }
  }

  export type HerokuErrorBody = {
    id: string
    message: string
    url?: string
  }

  export interface HerokuError extends Error {
    statusCode: number
    body: HerokuErrorBody
  }

  export default class Heroku {
    constructor(options: HerokuClassOptions)
    get<T>(path: string, options?: HerokuApiReqOptions): Promise<T>
    patch<T>(path: string, options?: HerokuApiReqOptions): Promise<T>
    post<T>(path: string, options?: HerokuApiReqOptions): Promise<T>
  }
}
