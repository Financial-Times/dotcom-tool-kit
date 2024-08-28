import { GetPolicyCommand, GetPolicyVersionCommand, IAMClient } from '@aws-sdk/client-iam'
import { GetCallerIdentityCommand, STSClient } from '@aws-sdk/client-sts'
import { ToolKitError } from '@dotcom-tool-kit/error'
import { rootLogger as winstonLogger, styles } from '@dotcom-tool-kit/logger'
import { DopplerEnvVars } from '@dotcom-tool-kit/doppler'
import { setOptions } from '@dotcom-tool-kit/options'
import type { RCFile } from '@dotcom-tool-kit/plugin'
import { Octokit } from '@octokit/rest'
import * as suggester from 'code-suggester'
import { highlight } from 'cli-highlight'
import { promises as fs } from 'fs'
import fetch from 'node-fetch'
import path from 'path'
import prompt from 'prompts'
import { simpleGit } from 'simple-git'
import YAML from 'yaml'
import { z } from 'zod'

// git mode indicating an object blob is a file
const FILE_MODE = '100644' as const

interface StackTags {
  // short for production, development, ci, test
  environment: 'p' | 'd' | 'ci' | 't'
  // dl is short for 'distribution list', an email address that forwards to other email addresses
  teamDL: string
  systemCode: string
}

// Get the CircleCI project's ID by calling the CircleCI API. It requires the
// GitHub project name as a parameter so we calculate that based on the git
// remote settings.
const getCircleCiProjectId = async (circleCIAuthToken: string) => {
  const remoteURL = await simpleGit().remote(['get-url', 'origin'])
  if (!remoteURL) {
    throw new ToolKitError("couldn't get git repository URL")
  }
  const projectName = remoteURL.trim().match(/Financial-Times\/(.+)\.git$/)?.[1]
  if (!projectName) {
    throw new ToolKitError("couldn't parse git repository URL into Financial-Times project")
  }

  const circleCIAuth = Buffer.from(`${circleCIAuthToken}:`).toString('base64')
  const circleciProjectResp = await fetch(
    `https://circleci.com/api/v2/project/gh/Financial-Times/${projectName}`,
    { headers: { authorization: `Basic ${circleCIAuth}` } }
  )
  if (!circleciProjectResp.ok) {
    throw new ToolKitError('failed to get project ID from CircleCI API')
  }
  return (await circleciProjectResp.json()).id
}

// Make the PR contents legible for users (by clearly stating what files are
// being created and adding syntax highlighting) so they can feel confident
// automatically creating a PR.
const formatChanges = (changes: suggester.Changes): string => {
  let formatted = ''
  for (const [path, { content }] of changes) {
    // we aren't deleting any files so content will never be null
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const highlighted = highlight(content!, { language: 'yaml' }).replace(
      // indent every line by 2 spaces so that it's easier to skim the
      // different files
      /^/gm,
      '  '
    )
    formatted += `\n${styles.filepath(path)}:\n${highlighted}`
  }
  return formatted
}

// If we're migrating to OIDC authentication from a project that had a IAM user
// to authenticate deployments previously we can copy the permissions that user
// had so that we don't have to do any guesswork about what AWS resources are
// being touched.
const getPreviousIAMPermissions = async (
  accessKeyId: string,
  secretAccessKey: string,
  serviceName: string
) => {
  const clientOptions = {
    credentials: {
      accessKeyId,
      secretAccessKey
    },
    region: 'eu-west-1'
  }

  // Get the AWS account ID via the API. We could use a map of AWS account
  // names to IDs but I'm not sure it's a good idea to expose those in a public
  // repo.
  const stsClient = new STSClient(clientOptions)
  const getCallerIdentityCommand = new GetCallerIdentityCommand({})
  const { Account: accountId } = await stsClient.send(getCallerIdentityCommand)
  if (!accountId) {
    return
  }

  const iamClient = new IAMClient(clientOptions)
  const getPolicyCommand = new GetPolicyCommand({
    PolicyArn: `arn:aws:iam::${accountId}:policy/FTDeployPolicyFor_${serviceName}`
  })
  let policy
  try {
    const policyCommand = await iamClient.send(getPolicyCommand)
    policy = policyCommand.Policy
    // the AWS call will throw an error if the policy doesn't exist, in which
    // case we should instead return undefined to signal we want to use the
    // default permissions
  } catch {}
  if (!policy) {
    return
  }

  const getPolicyVersionCommand = new GetPolicyVersionCommand({
    PolicyArn: policy.Arn,
    VersionId: policy.DefaultVersionId
  })
  const policyVersion = await iamClient.send(getPolicyVersionCommand)

  const policyDocument = policyVersion.PolicyVersion?.Document
  if (policyDocument) {
    return JSON.parse(decodeURIComponent(policyDocument))
  }
}

export interface OidcParams {
  toolKitConfig: RCFile
}

export default async function oidcPrompt({ toolKitConfig }: OidcParams): Promise<boolean> {
  let cancelled = false
  // support an early return if the user interrupts one of the prompts
  const onCancel = () => {
    cancelled = true
  }
  const { confirm } = await prompt({
    name: 'confirm',
    type: 'confirm',
    initial: true,
    message: 'Would you like OIDC authentication to be set up automatically for your Serverless app?'
  })
  if (!confirm || cancelled) {
    return cancelled
  }

  const cloudformationTemplateRaw = await fs.readFile(
    path.resolve(__dirname, '../../files/oidc-cloudformation.yml'),
    'utf8'
  )
  // CloudFormation's intrinsic functions need to be defined as custom tags in
  // the schema if we need to add any nodes including them programmatically
  const subCustomTag: YAML.ScalarTag = {
    tag: '!Sub',
    identify: (value) => typeof value === 'string',
    resolve: (str) => str
  }
  const cloudformationTemplate = YAML.parseDocument(cloudformationTemplateRaw, { customTags: [subCustomTag] })

  const { awsAccount }: { awsAccount: string } = await prompt(
    {
      name: 'awsAccount',
      type: 'select',
      choices: ['infra-prod', 'next-prod'].map((account) => ({ title: account, value: account })),
      message:
        "Please select which FT AWS account this project deploys to (let the Platforms team know if your account isn't listed)"
    },
    { onCancel }
  )
  const awsAccountDopplerName = awsAccount.replaceAll('-', '_').toUpperCase()
  if (cancelled) {
    return true
  }

  // access keys are pulled from Tool Kit's doppler project
  const dopplerEnvVars = new DopplerEnvVars(winstonLogger, 'prod', {
    project: 'dotcom-tool-kit'
  })
  const dopplerSecretsSchema = z
    .object({
      CIRCLECI_AUTH_TOKEN: z.string(),
      GITHUB_ACCESS_TOKEN: z.string()
    })
    .merge(
      z.object({
        [`AWS_${awsAccountDopplerName}_ACCESS_KEY_ID`]: z.string(),
        [`AWS_${awsAccountDopplerName}_SECRET_ACCESS_KEY`]: z.string()
      })
    )
  const dopplerEnv = dopplerSecretsSchema.parse(await dopplerEnvVars.get())

  let serverlessConfigRaw
  try {
    serverlessConfigRaw = await fs.readFile('serverless.yml', 'utf8')
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code !== 'ENOENT') {
      throw err
    }
    // check serverless.yaml (note the additional 'a') as well
    serverlessConfigRaw = await fs.readFile('serverless.yaml', 'utf8')
  }
  const serverlessConfig = YAML.parse(serverlessConfigRaw)
  const serviceName = serverlessConfig?.service
  const serviceProvider = serverlessConfig?.provider
  let stackTags = (serviceProvider?.stackTags ?? serviceProvider?.tags) as StackTags | undefined
  if (!stackTags) {
    const { systemCode, teamDL } = await prompt(
      [
        {
          name: 'systemCode',
          type: 'text',
          message: 'What is the system code for your app?'
        },
        {
          name: 'teamDL',
          type: 'text',
          message: 'What is the email address for your team?'
        }
      ],
      { onCancel }
    )
    if (cancelled) {
      return true
    }
    stackTags = { teamDL, environment: 'p', systemCode }
  } else {
    const { fetchOldPermissions } = await prompt(
      {
        name: 'fetchOldPermissions',
        type: 'confirm',
        initial: true,
        message:
          "Is it alright if we try to query AWS for IAM permissions from the previous IAM deployment user for this project? If none are found we'll just use some default permissions."
      },
      { onCancel }
    )
    if (cancelled) {
      return true
    }
    if (fetchOldPermissions) {
      const previousDocument = await getPreviousIAMPermissions(
        dopplerEnv[`AWS_${awsAccountDopplerName}_ACCESS_KEY_ID`],
        dopplerEnv[`AWS_${awsAccountDopplerName}_SECRET_ACCESS_KEY`],
        serviceName
      )
      if (previousDocument) {
        winstonLogger.info(
          'Found the permissions assigned to an IAM user for CI deployments previously. Reusing these permissions for your OIDC role policy.'
        )
        const policyPath = ['Resources', 'CircleciOIDCRolePolicy', 'Properties', 'PolicyDocument']
        cloudformationTemplate.setIn(policyPath, cloudformationTemplate.createNode(previousDocument))

        // HACK:20240213:IM Guess Doppler project name to use in Parameter
        // store path using the same logic we used to use to infer the name
        // from Tool Kit vault plugin options. The class tries to read the
        // options from the global options object so let's set these options
        // based on what's been selected during the options prompt.
        setOptions('@dotcom-tool-kit/doppler', toolKitConfig.options.plugins['@dotcom-tool-kit/doppler'])
        const dopplerProjectName = new DopplerEnvVars(winstonLogger, 'prod').options.project
        const ssmAction = 'ssm:GetParameter'
        const ssmResource = `arn:aws:ssm:eu-west-1:\${AWS::AccountId}:parameter/${dopplerProjectName}/*`
        winstonLogger.info(
          `Adding a permission to allow secrets set by Doppler in Parameter Store to be read so the app is ready for the Doppler migration. Will allow the ${styles.code(
            ssmAction
          )} scoped to the ${styles.code(ssmResource)} resource.`
        )
        const subbedResource = cloudformationTemplate.createNode(ssmResource, { tag: '!Sub' })
        cloudformationTemplate.addIn([...policyPath, 'Statement'], {
          Sid: 'AllowReadDopplerSecrets',
          Effect: 'Allow',
          Action: [ssmAction],
          Resource: [subbedResource]
        })
      } else {
        winstonLogger.info(
          "Couldn't find any old IAM permissions to reuse for this project. Falling back to the default permissions recommended by Cloud Enablement."
        )
      }
    }
  }

  let circleciProjectId
  try {
    circleciProjectId = await getCircleCiProjectId(dopplerEnv.CIRCLECI_AUTH_TOKEN)
  } catch (err) {
    winstonLogger.error(`Failed to automatically determine the ID for your CircleCI project: ${err}`)
    circleciProjectId = (
      await prompt(
        {
          name: 'circleId',
          type: 'text',
          message:
            "You can instead enter the project ID manually. You can find the ID by going to your project's settings in the CircleCI UI and copying the ID displayed at Overview > Project ID."
        },
        { onCancel }
      )
    ).circleId
    if (cancelled) {
      return true
    }
  }

  let githubUsername
  try {
    const octokit = new Octokit({ auth: `token ${dopplerEnv.GITHUB_ACCESS_TOKEN}` })
    const resp = await octokit.rest.users.getAuthenticated()
    githubUsername = resp.data.login
  } catch (err) {
    winstonLogger.error(
      `Failed to automatically determine your GitHub username: ${err}\nThis is used in the PR description to give Cloud Enablement some context on who to talk to about these changes.`
    )
  }
  if (!githubUsername) {
    githubUsername = (
      await prompt(
        {
          name: 'username',
          type: 'text',
          message:
            'Please enter your GitHub username, which can be found in the URL when you open your profile'
        },
        { onCancel }
      )
    ).username
    if (cancelled) {
      return true
    }
  }

  const templatePath = `cloudformation/${stackTags.systemCode}/circleci-deploy-role.yaml`
  const configPath = `config/composer/custom/${stackTags.systemCode}/global/circleci-deploy-role.yaml`

  const composerConfig = {
    template_path: templatePath,
    parameters: {
      SystemCode: stackTags.systemCode,
      CircleciProjectId: circleciProjectId,
      CircleciOrgName: 'Financial-Times'
    },
    stack_tags: stackTags
  }

  const upstreamRepo = `aws-composer-account-${awsAccount}`
  const changes = new Map([
    [templatePath, { mode: FILE_MODE, content: cloudformationTemplate.toString() }],
    [configPath, { mode: FILE_MODE, content: YAML.stringify(composerConfig) }]
  ])
  const title = `Add OIDC authentication for ${stackTags.systemCode}`
  const description = `This PR has been automatically generated by @${githubUsername} using Customer Products Platforms' [Tool Kit](https://github.com/Financial-Times/dotcom-tool-kit). It adds the deployment role necessary for the ${stackTags.systemCode} project to deploy to AWS via [OIDC authentication](https://tech.in.ft.com/tech-topics/continuous-delivery/circleci-aws-oidc-authentication), as well as the associated \`aws-composer\` configuration.`
  winstonLogger.info(
    `Will send the following changes to the ${styles.URL(
      `https://github.com/Financial-Times/${upstreamRepo}`
    )} repository:\n${formatChanges(changes)}`
  )
  winstonLogger.info(`The PR will read:\n${styles.title(title)}\n\n${description}`)
  const { prConfirm } = await prompt(
    { name: 'prConfirm', type: 'confirm', message: 'Is that okay?' },
    { onCancel }
  )
  if (prConfirm) {
    const octokit = new Octokit({ auth: dopplerEnv.GITHUB_ACCESS_TOKEN })
    const prNumber = await suggester.createPullRequest(octokit, changes, {
      upstreamRepo,
      upstreamOwner: 'Financial-Times',
      // replace ' ' and '_' with '-' to create a more standard git branch name
      branch: `oidc-role-${stackTags.systemCode.replace(/_| /g, '-')}`,
      fork: false,
      title,
      description,
      message: `feat: add OIDC authentication for ${stackTags.systemCode}`
    })
    winstonLogger.info(
      `The PR was successfully created! You can track it at https://github.com/Financial-Times/${upstreamRepo}/pull/${prNumber}`
    )
  }
  return cancelled
}
