declare module 'heroku-client' {
  export type HerokuClassOptions = {
    token: string | undefined
  }

  export type HerokuApiResGetRelease = {
    current: string
    slug: {
      id: string
      commit: string
      status: string
    }
    id: string
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

  export type HerokuApiResGetGtg = {
    name: string
  }

  export type HerokuApiResPost = {
    id: string
    app: {
      id: string
      name: string
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

  export default class Heroku {
    constructor(options: HerokuClassOptions)
    get<T>(path: string, options?: HerokuApiReqOptions): Promise<T>
    patch<T>(path: string, options?: HerokuApiReqOptions): Promise<T>
    post(path: string, options?: HerokuApiReqOptions): Promise<HerokuApiResPost>
  }
}
