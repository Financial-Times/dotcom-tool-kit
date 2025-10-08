import * as z from 'zod'

export const hakoImageName = 'docker.packages.ft.com/financial-times-internal-releases/hako-cli:0.2.14-beta'

export const HakoEnvironmentName = z.string().transform((val, ctx) => {
  const match = val.match(/-(prod|test|review|canary)-(eu|us)$/)
  if (!match) {
    ctx.addIssue({
      code: z.ZodIssueCode.invalid_string,
      validation: 'regex',
      message: 'Hako environment name must end with a stage and region, e.g., -prod-eu'
    })
    return z.NEVER
  }
  return {
    name: val,
    stage: match[1],
    region: match[2]
  }
})
export type HakoEnvironment = z.output<typeof HakoEnvironmentName>

export const hakoRegions: Record<string, string> = {
  eu: 'eu-west-1',
  us: 'us-east-1'
}
export const hakoDomains: Record<string, string> = {
  'cp-internal-review-eu': 'cp-internal-review.ftweb.tech',
  'ft-com-prod-eu': 'ft-com-prod.ftweb.tech',
  'ft-com-prod-us': 'ft-com-prod.ftweb.tech',
  'ft-com-test-eu': 'ft-com-test.ftweb.tech',
  'ft-com-review-eu': 'ft-com-review.ftweb.tech',
  'ft-com-canary-eu': 'ft-com-canary.ftweb.tech'
}
