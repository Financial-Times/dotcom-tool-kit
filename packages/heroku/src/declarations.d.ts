// declare module 'heroku-client'

declare module 'heroku-client' {
  export type HerokuClassOptions = {
    token: string | undefined
  }

  export type HerokuApiResGetSlug = [
    {
      current: string
      slug: string
      id: string
    }
  ]

  export type HerokuApiResGetReview = [
    {
      app: {
        id: string
      }
      branch: string
      status: string
    }
  ]

  export type HerokuApiResGetGtg = {
    name: string
  }

  export type HerokuApiResPost = {
    id: string
  }

  export type HerokuApiResPatch = {
    quantity: number
    type: string
  }

  export default class Heroku {
    constructor(options: HerokuClassOptions)
    get<T>(path: string, options?: Record<string, unknown>): Promise<T>
    patch(path: string, options?: Record<string, unknown>): Promise<HerokuApiResPatch>
    post(path: string, options?: Record<string, unknown>): Promise<HerokuApiResPost>
  }
}
