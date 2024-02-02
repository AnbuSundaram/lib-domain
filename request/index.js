const join = require('url-join')
const domainManifest = require('../manifest')
const createRequestPreset = require('./create-preset')

// Export one request function for each domain.
// E.g. exports.item.get('item/123')
module.exports = Object.values(domainManifest).reduce(
  (acc, domainConfig) => ({
    ...acc,
    [domainConfig.id]: createRequestPreset(
      `${domainConfig.id}-request`,
      url => {
        const envConfig =
          domainConfig.environments[process.env.SERVERLESS_STAGE] ||
          domainConfig.environments.default
        return {
          url: join(envConfig.base, url),
          headers: envConfig.apiKey
            ? {
              'X-Api-Key': envConfig.apiKey
            }
            : {}
        }
      }
    )
  }),
  {}
)
