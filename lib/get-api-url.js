const apiIds = require('./api-ids')

const REGION = process.env.REGION || 'us-east-1'

module.exports = function getApiUrl ({ domainId, clientId, stage }) {
  const apiId = apiIds[domainId]
  if (apiId) {
    return `https://${apiId}.execute-api.${REGION}.amazonaws.com/${stage}`
  }
  return `https://${stage}.${clientId}.ydv.live/${domainId}`
}
