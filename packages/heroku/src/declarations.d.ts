declare module 'heroku-client' {
  export type HerokuClassOptions = {
    token: string | undefined
  }

  export type HerokuApiResGetSlug = {
    current: string
    slug: {
      id: string
    }
  }

  export type HerokuApiResGetReview = {
    app: {
      id: string
    }
    branch: string
    status: string
  }

  export type HerokuApiResGetGtg = {
    name: string
  }

  export type HerokuApiResPost = {
    id: string
  }

  export type HerokuApiReqOptions = {
    body: {
      configVars?: {
        [key: string]: string
      }
      updates?: [
        {
          type: string
          quantity?: number
          size?: number
        }
      ]
      branch?: string
      pipeline?: string
      source_blob?: string
      slug?: string
    }
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
    get<T>(path: string): Promise<T>
    patch(path: string, options?: HerokuApiReqOptions): Promise<HerokuApiResPatch>
    post(path: string, options?: HerokuApiReqOptions): Promise<HerokuApiResPost>
  }
}
