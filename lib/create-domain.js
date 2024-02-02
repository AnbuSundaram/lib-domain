const assert = require('assert')
const apiKeys = require('./api-keys')
const merge = require('lodash/merge')
const getApiUrl = require('./get-api-url')

const usedOfflinePorts = {}

module.exports = function createDomain (id, config) {
  config = config || {}
  assert.strictEqual(
    typeof config.offlinePort,
    'number',
    `${id}: config.offlinePort must be given as a number`
  )

  assert(
    !usedOfflinePorts[config.offlinePort],
    `${id}: config.offlinePort ${config.offlinePort} already used in ${
      usedOfflinePorts[config.offlinePort]
    }!`
  )
  usedOfflinePorts[config.offlinePort] = id

  return merge(
    {
      id,
      environments: {
        development: {
          base: `http://localhost:${config.offlinePort}`
        },
        default: {
          base: getApiUrl({
            domainId: id,
            clientId: process.env.YDV_CLIENT_ID,
            stage: process.env.SERVERLESS_STAGE
          }),
          apiKey: apiKeys[id]
        }
      }
    },
    config
  )
}
