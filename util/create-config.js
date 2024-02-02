const merge = require('lodash/merge')
const Logger = require('@ydv/logger')
const urlParseAuth = require('url-parse-auth')

const log = Logger('config')

module.exports = function createConfig ({
  environment = process.env.NODE_ENV || 'development',
  clientId = process.env.YDV_CLIENT_ID,
  domainId,
  alwaysRemoteDatabase = false,
  replicaSet = false,
  mongoUrl = process.env.MONGODB_URL,
  config = {}
}) {
  log.silly(`Loading config... Client ${clientId} / Environment ${environment}`)

  if(domainId === 'atomic' && clientId === 'eddiebauer'){
    //Doing this override for connection atomic_pim DB for domain-atomic app.
    clientId = 'pim'
  }

  const remoteMongoUrl =
    mongoUrl ||
    `mongodb+srv://domainApiUser:4ulTPq9q2t8IZt5p@dev01-eddiebauer-com-x6i4a.mongodb.net/${domainId}_${clientId}?retryWrites=true`

  const env = {
    development: {
      mongo: {
        url: alwaysRemoteDatabase
          ? remoteMongoUrl
          : `mongodb://localhost:27017/${domainId}_${clientId}`,
        replicaSet: replicaSet
      }
    },
    default: {
      mongo: {
        url: remoteMongoUrl,
        replicaSet: replicaSet
      }
    }
  }

  const result = merge(
    {},
    env.default,
    config.default,
    env[environment] || {},
    config[environment] || {}
  )

  const { user } = urlParseAuth(result.mongo.url || '')
  const userReplacement = (user || '')
    .split('')
    .map(value => '*')
    .join('')
  
  const { password } = urlParseAuth(result.mongo.url || '')
  const passwordReplacement = (password || '')
    .split('')
    .map(value => '*')
    .join('')
  log.silly(
    'Mongo url is',
    result.mongo.url.replace(password, passwordReplacement).replace(user, userReplacement)
  )

  return result
}
