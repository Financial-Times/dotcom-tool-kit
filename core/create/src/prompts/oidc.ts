import { GetPolicyCommand, GetPolicyVersionCommand, IAMClient } from '@aws-sdk/client-iam'
import { GetCallerIdentityCommand, STSClient } from '@aws-sdk/client-sts'
import { ToolKitError } from '@dotcom-tool-kit/error'
import { rootLogger as winstonLogger, styles } from '@dotcom-tool-kit/logger'
import { VaultEnvVars } from '@dotcom-tool-kit/vault'
import { Octokit } from '@octokit/rest'
import suggester from 'code-suggester'
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
  const { Policy: policy } = await iamClient.send(getPolicyCommand)
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

export default async function oidcPrompt(): Promise<boolean> {
  let cancelled = false
  // support an early return if the user interrupts one of the prompts
  const onCancel = () => {
    cancelled = true
  }
  const { confirm } = await prompt({
    name: 'confirm',
    type: 'confirm',
    message: 'Would you like OIDC authentication to be set up automatically for your Serverless app?'
  })
  if (!confirm || cancelled) {
    return cancelled
  }

  const cloudformationTemplateRaw = await fs.readFile(
    path.resolve(__dirname, '../../files/oidc-cloudformation.yml'),
    'utf8'
  )
  const cloudformationTemplate = YAML.parseDocument(cloudformationTemplateRaw)

  const { teamName, awsAccount } = await prompt(
    [
      {
        name: 'teamName',
        type: 'text',
        message:
          'What is the name of your team? This will be used to generate the path to store your configuration in the aws-composer repository.'
      },
      {
        name: 'awsAccount',
        type: 'select',
        choices: ['infra-prod', 'next-prod'].map((account) => ({ title: account, value: account })),
        message: 'Please select which FT AWS account you want your project to deploy to'
      }
    ],
    { onCancel }
  )
  if (cancelled) {
    return true
  }

  // access keys are pulled from Tool Kit's development vault
  const vaultEnvVars = new VaultEnvVars(winstonLogger, {
    environment: 'development',
    vaultPath: { team: 'next', app: 'dotcom-tool-kit' }
  })
  const vaultSecretsSchema = z.object({
    CIRCLECI_AUTH_TOKEN: z.string(),
    GITHUB_ACCESS_TOKEN: z.string(),
    [`AWS_ACCESS_KEY_ID_${awsAccount}`]: z.string(),
    [`AWS_SECRET_KEY_${awsAccount}`]: z.string()
  })
  const vaultEnv = vaultSecretsSchema.parse(await vaultEnvVars.get())

  const serverlessConfigRaw = await fs.readFile('serverless.yml', 'utf8')
  const serverlessConfig = YAML.parse(serverlessConfigRaw)
  const serviceName = serverlessConfig?.service
  let stackTags = serverlessConfig?.provider?.stackTags as StackTags | undefined
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
        vaultEnv[`AWS_ACCESS_KEY_ID_${awsAccount}`],
        vaultEnv[`AWS_SECRET_KEY_${awsAccount}`],
        serviceName
      )
      if (previousDocument) {
        winstonLogger.info(
          'Found the permissions assigned to an IAM user for CI deployments previously. Reusing these permissions for your OIDC role policy.'
        )
        cloudformationTemplate.setIn(
          ['Resources', 'CircleciOIDCRolePolicy', 'Properties', 'PolicyDocument'],
          previousDocument
        )
      } else {
        winstonLogger.info(
          "Couldn't find any old IAM permissions to reuse for this project. Falling back to the default permissions recommended by Cloud Enablement."
        )
      }
    }
  }

  let circleciProjectId
  try {
    circleciProjectId = await getCircleCiProjectId(vaultEnv.CIRCLECI_AUTH_TOKEN)
  } catch (err) {
    winstonLogger.error(`Failed to automatically determine the ID for your CircleCI prject: ${err}`)
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

  const templatePath = `cloudformation/${teamName}/${stackTags.systemCode}-deployment-role.yaml`
  const configPath = `config/composer/custom/${teamName}/global/${stackTags.systemCode}-deployment-role.yaml`

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
  winstonLogger.info(
    `Will send the following changes to the ${styles.URL(
      `https://github.com/Financial-Times/${upstreamRepo}`
    )} repository: ${changes}`
  )
  const { prConfirm } = await prompt(
    { name: 'prConfirm', type: 'confirm', message: 'Is that okay?' },
    { onCancel }
  )
  if (prConfirm) {
    const octokit = new Octokit({ auth: vaultEnv.GITHUB_ACCESS_TOKEN })
    await suggester.createPullRequest(octokit, changes, {
      upstreamRepo,
      upstreamOwner: 'Financial-Times',
      fork: false,
      title: `Add OIDC authentication for ${stackTags.systemCode}`,
      description: `This PR has been automatically generated via Tool Kit. It adds the deployment role necessary for the ${stackTags.systemCode} project to deploy to AWS via OIDC authentication, as well as the associated aws-composer configuration.`,
      message: `feat: add OIDC authentication for ${stackTags.systemCode}`
    })
  }
  return cancelled
}
