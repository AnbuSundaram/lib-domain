const assert = require('assert')
const merge = require('lodash/merge')
const domainManifest = require('../manifest')
const createProvider = require('./create-provider')
const createFunctions = require('./create-functions')
const getDomainConfig = require('../lib/domain-config')
const Logger = require('@ydv/logger')
const log = Logger('create')

module.exports = createServerlessJson

function createServerlessJson (domainId, options = {}) {
  if (!options.stage) options.stage = 'development'
  options.offline = options.stage === 'development'

  const domainConfig = getDomainConfig(domainId, options)
  const manifest = domainManifest[domainId]

  assert(
    manifest,
    `@eddiebauer/lib-domain | ${domainId} not found in domain manifest!`
  )
  assert.strictEqual(
    typeof options.stage,
    'string',
    `@eddierbauer/lib-domain | options.stage required!`
  )

  options.serverless = merge(
    {},
    manifest.serverless || {},
    options.serverless || {}
  )

  return {
    package: {
      individually: true
    },
    frameworkVersion: '3',
    service: `${options.clientId}-${domainId}`,
    description: `${domainId} service for the platform for ${options.clientId}`,
    provider: createProvider(domainId, options),
    functions: createFunctions(domainId, options),
    ...options.serverless,
    plugins: [
      'serverless-dotenv-plugin',
      'serverless-offline',
      'serverless-prune-plugin',
      domainConfig && 'serverless-domain-manager',
      options.stage !== 'development' && 'serverless-webpack',
      ...(options.serverless.plugins || [])
    ].filter(Boolean),
    resources: {
      "Outputs": {
        "ApiId": {
          'Description': `Output of the ${options.clientId}-${options.stage}-${domainId} APIGateway ID`,
          'Value': {
            'Ref': "ApiGatewayRestApi"
          },
          'Export':{
            'Name': `${options.clientId}-${options.stage}-${domainId}-api-id`
          }
        }

      }
    },
    custom: {
      'serverless-offline': {
        httpPort: manifest.offlinePort,
        lambdaPort: manifest.lambdaPort
      },
      webpack: {
        webpackConfig: 'node_modules/@eddiebauer/lib-domain/webpack.config.js',
        includeModules: true,
        packager: 'npm'
      },
      prune: {
        automatic: true,
        number: 5
      },
      ...(domainConfig && { customDomain: domainConfig }),
      ...options.serverless.custom
    }
  }
}
