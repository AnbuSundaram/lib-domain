const AWS = require('aws-sdk')
const Logger = require('@ydv/logger')
const log = Logger('get-secret-value')

// Create a Secrets Manager client
let client = new AWS.SecretsManager({
  region: 'us-east-1'
})

let cacheResponse

// TODO delete all the logs once its validate in lower env
module.exports = async function getSecretByName (secretName, defaultValue) {
  if (process.env.SERVERLESS_STAGE === 'development') {
    return defaultValue
  }
  try {
    if (cacheResponse && cacheResponse[secretName]) {
      return cacheResponse[secretName]
    }
    const secretId = process.env.DOMAIN_CONFIG_STORE
    const response = await client
      .getSecretValue({ SecretId: secretId })
      .promise()
    const responseStr = response.SecretString
    const parsedResponse = JSON.parse(responseStr)
    cacheResponse = parsedResponse
    return parsedResponse[secretName]
  } catch (err) {
    log.error(`Got an error while getting the lib secret key::: ${secretName}`, err)
  }
}
